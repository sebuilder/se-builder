// Establish bridge namespace.
var bridge = {};
/** The tab node that is highlighted green (can be used to get a reference to the content). */
bridge.recordingTab = null;
/** The window we're recording in, if different from the one in the recordingTab. */
bridge.customRecordingWindow = null;
/** The window that contains the recorder. */
bridge.recorderWindow = null;
/** Document load listeners, mapped from window to listener. */
bridge.docLoadListeners = {};

bridge.logMessage = function(aMessage) {
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                 .getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage(aMessage);
}

/** Set an alternate window to record in that's not the window of the recordingTab. */
bridge.setCustomRecordingWindow = function(newWindow) {
  bridge.customRecordingWindow = newWindow;
};

/** @return The content window we're recording in. */
bridge.getRecordingWindow = function() {
  if (bridge.customRecordingWindow) { return customRecordingWindow; }
  return getBrowser().getBrowserForTab(bridge.recordingTab).contentWindow;
};

/** Moves the content window we're recording into the foreground. */
bridge.focusRecordingTab = function() {
  if (bridge.customRecordingWindow) {
    bridge.customRecordingWindow.focus();
    return;
  }
  getBrowser().selectedTab = bridge.recordingTab;
  window.focus();
};

/** Moves the Selenium Builder window into the foreground. */
bridge.focusRecorderWindow = function() {
  bridge.focusRecordingTab();
  bridge.recorderWindow.focus();
};

/** @return The main browser window we're recording in. */
bridge.getBrowser = function() {
  return window;
};

/** Shuts down SeBuilder. */
bridge.shutdown = function() {
  if (bridge.recordingTab) {
    bridge.recordingTab.style.setProperty("background-color", "", "");
  }
  if (bridge.recorderWindow) {
    bridge.recorderWindow.close();
  }
  bridge.recorderWindow = null;
};

/**
 * Add a listener to be notified when the document in win changes. There can only be one
 * listener per window. (Though the code can be easily improved using arrays and splicing
 * if this becomes a problem.)
 */ 
bridge.addDocLoadListener = function(win, l) {
  bridge.docLoadListeners[win] = l;
};

bridge.removeDocLoadListener = function(win, l) {
  delete bridge.docLoadListeners[win];
};

bridge.prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

bridge.browserType = function() { return "firefox"; }

bridge.pluginRepository = function() {
  return bridge.prefManager.getCharPref("extensions.seleniumbuilder.plugins.repository");
};

bridge.setPluginRepository = function(rep) {
  bridge.prefManager.setCharPref("extensions.seleniumbuilder.plugins.repository", rep);
};

bridge.boot = function() {
  // If we've already booted just put the GUI into the foreground.
  if (bridge.recorderWindow) {
    bridge.recorderWindow.focus();
    return;
  }
  
  // Save the tab the user has currently open: it's the one we'll record from.
  bridge.recordingTab = getBrowser().mCurrentTab;

  // Make it obvious which tab is recording by turning it green!
  bridge.recordingTab.style.setProperty("background-color", "#bfee85", "important");
  
  bridge.recorderWindow = window.open("chrome://seleniumbuilder/content/html/gui.html", "seleniumbuilder", "width=550,height=600,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,copyhistory=no,resizable=yes");
    
  // Install a listener with the browser to be notified when a new document is loaded.
  try {
    var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(
        Components.interfaces.nsIObserverService);
    var observer = {
      observe: function (doc) {
        if (bridge.docLoadListeners[doc.defaultView]) {
          bridge.docLoadListeners[doc.defaultView]();
        }
      }
    };
    //observerService.addObserver(observer, "content-document-global-created", false);
    observerService.addObserver(observer, "document-element-inserted", false);
  } catch (e) {
    dump(e);
  }
  
  bridge.booter = setInterval(function() {
    if (bridge.recorderWindow.wrappedJSObject.boot) {
      bridge.recorderWindow.wrappedJSObject.boot(bridge);
      clearInterval(bridge.booter);
    }
  }, 100);
};

bridge.getInternalFile = function(path, callback) {
  var MY_ID = "seleniumbuilder@saucelabs.com";
  try {
    // We may be on FF 4 or later
    Components.utils.import("resource://gre/modules/AddonManager.jsm");
    AddonManager.getAddonByID(MY_ID, function(addon) {
      callback(addon.getResourceURI(path).QueryInterface(Components.interfaces.nsIFileURL).file);
    });
  } catch (e) {
    // We're on Firefox < 4, so we can use nsIExtensionManager.
    var em = Components.classes["@mozilla.org/extensions/manager;1"].
        getService(Components.interfaces.nsIExtensionManager);
    callback(em.getInstallLocation(MY_ID).getItemFile(MY_ID, path));
  }
};

/**
 * Loads the given URL from the file system given a chrome:// URL.
 */
bridge.loadFile = function(url, success, error) {
  var data = "";
  // Get rid of the random number get-string meant to discourage caching.
  if (url.match("[?]")) {
    url = url.split("?")[0];
  }
  var prefix = "chrome://seleniumbuilder/";
  var path = "chrome/" + url.substring(prefix.length);
  var MY_ID = "seleniumbuilder@saucelabs.com";
  var file = null;
  try {
    // We may be on FF 4 or later
    Components.utils.import("resource://gre/modules/AddonManager.jsm");
    AddonManager.getAddonByID(MY_ID, function(addon) {
      file = addon.getResourceURI(path).QueryInterface(Components.interfaces.nsIFileURL).file;
      var data = null;
      try {
        data = bridge.readFile(file);
      } catch (e) {
        error(e);
        return;
      }
      success(data);
    });
  } catch (e) {
    // We're on Firefox < 4, so we can use nsIExtensionManager.
    var em = Components.classes["@mozilla.org/extensions/manager;1"].
        getService(Components.interfaces.nsIExtensionManager);
    file = em.getInstallLocation(MY_ID).getItemFile(MY_ID, path);
    var data = null;
    try {
      data = bridge.readFile(file);
    } catch (e) {
      error(e);
      return;
    }
    window.setTimeout(function() { success(data); }, 1000); // Pretend this took time.
  }
};

bridge.readFile = function(file) {
  var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].
              createInstance(Components.interfaces.nsIFileInputStream);
  var cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].
              createInstance(Components.interfaces.nsIConverterInputStream);
  fstream.init(file, -1, 0, 0);
  cstream.init(fstream, "UTF-8", 0, 0); // you can use another encoding here if you wish

  var str = {};
  var read = 0;
  var data = "";
  do { 
    read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
    data += str.value;
  } while (read != 0);
  cstream.close(); // this closes fstream
  return data;
};

bridge.decodeBase64 = function(data) {
  return window.atob(data);
};

bridge.writeBinaryFile = function(path, data) {
  var file = Components.classes["@mozilla.org/file/local;1"]
                  .createInstance(Components.interfaces.nsILocalFile);
  file.initWithPath(path);
  var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance( Components.interfaces.nsIFileOutputStream);
  outputStream.init(file, -1, -1, 0);
  outputStream.write(data, data.length);
  outputStream.close();
};

// Import the Services module for future use, if we're not in a
// a browser window where it's already loaded.
Components.utils.import('resource://gre/modules/Services.jsm');

// Create a constructor for the builtin supports-string class.
const nsSupportsString = Components.Constructor("@mozilla.org/supports-string;1", "nsISupportsString");
function SupportsString(str) {
  // Create an instance of the supports-string class
  var res = nsSupportsString();

  // Store the JavaScript string that we want to wrap in the new nsISupportsString object
  res.data = str;
  return res;
}

// Create a constructor for the builtin transferable class
const nsTransferable = Components.Constructor("@mozilla.org/widget/transferable;1", "nsITransferable");

// Create a wrapper to construct a nsITransferable instance and set its source to the given window, when necessary
function Transferable(source) {
  var res = nsTransferable();
  if ('init' in res) {
    // When passed a Window object, find a suitable provacy context for it.
    if (source instanceof Ci.nsIDOMWindow) {
      // Note: in Gecko versions >16, you can import the PrivateBrowsingUtils.jsm module
      // and use PrivateBrowsingUtils.privacyContextFromWindow(sourceWindow) instead
      source = source.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
    }
    res.init(source);
  }
  return res;
}

bridge.getClipboardString = function() {
  var trans = Transferable();
  trans.addDataFlavor("text/unicode");
  Services.clipboard.getData(trans, Services.clipboard.kGlobalClipboard);
  var str       = {};
  var strLength = {};
  trans.getTransferData("text/unicode", str, strLength);
  if (str) {
    return str.value.QueryInterface(Ci.nsISupportsString).data;
  } else {
    return null;
  }
};

bridge.setClipboardString = function(dataString) {
  var trans = Transferable(window);
  trans.addDataFlavor("text/unicode");
  // We multiply the length of the string by 2, since it's stored in 2-byte UTF-16
  // format internally.
  trans.setTransferData("text/unicode", SupportsString(dataString), dataString.length * 2);
  Services.clipboard.setData(trans, null, Services.clipboard.kGlobalClipboard);
};