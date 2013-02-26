var builder = {};
builder.version = "2.0.6";

builder.loader = {};

builder.loader.ds = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
builder.loader.ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

builder.loader.showProgressBar = function() {
  document.getElementById('booting-done').style.display = 'block';
  document.getElementById('booting-notdone').style.display = 'block';
};

builder.loader.hideProgressBar = function() {
  document.getElementById('booting-done').style.display = 'none';
  document.getElementById('booting-notdone').style.display = 'none';
};

builder.loader.setProgressBar = function(halfPercents, text) {
  document.getElementById('booting-file').innerHTML = text;
  document.getElementById('booting-done').style.width = halfPercents + 'px';
  document.getElementById('booting-notdone').style.width = (201 - halfPercents) + 'px';
  document.getElementById('booting-notdone').style.left = halfPercents + 'px';
  builder.loader.showProgressBar();
};

builder.loader.getProfilePath = function(relativePath) {
  var els = relativePath.split("/");
  var f = builder.loader.ds.get("ProfD", Components.interfaces.nsIFile);
  f.append("SeBuilder");
  for (var i = 0; i < els.length; i++) {
    f.append(els[i]);
  }
  return builder.loader.ios.newFileURI(f).spec;
};

builder.loader.loadScripts = function() {
  builder.loader.loadNextScript(arguments, 0);
};

builder.loader.loadNextScript = function(l, index) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  var path = l[index];
  if (path.charAt(0) == "%") {
    script.setAttribute('src', builder.loader.getProfilePath(path.substring(1)) + "?" + Math.random());
  }
  else {
    // Force no caching.
    script.setAttribute('src', "js/" + path + "?" + Math.random());
  }
  // Above line may not work due to security reasons, so let's try a different
  // way too.
  document.getElementsByTagName('head')[0].appendChild(script);
  builder.loader.setProgressBar(200 * index / l.length, path);
  window.setTimeout(function() {
    if (index < l.length - 1) {
      builder.loader.loadNextScript(l, index + 1);
    }
  }, 3);
};

builder.loader.loadListOfScripts = function(scripts, callback) {
  builder.loader.loadNextListScript(scripts, 0, callback);
}

builder.loader.loadNextListScript = function(scripts, index, callback) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  // Force no caching.
  script.setAttribute('src', scripts[index] + "?" + Math.random());
  // Above line may not work due to security reasons, so let's try a different
  // way too.
  document.getElementsByTagName('head')[0].appendChild(script);
  builder.loader.setProgressBar(200 * index / scripts.length, scripts[index]);
  window.setTimeout(function() {
    if (index < scripts.length - 1) {
      builder.loader.loadNextListScript(scripts, index + 1, callback);
    } else {
      if (callback) { callback(); }
    }
  }, 3);
};


/** Functions that get executed once everything has been loaded. */
builder.postLoadHooks = [];

/** Register a function to be executed once everything has been loaded. */
builder.registerPostLoadHook = function(f) {
  if (builder.loaded) {
    f();
  } else {
    builder.postLoadHooks.push(f);
  }
};

/** Functions that get executed before shutdown. */
builder.preShutdownHooks = [];

builder.registerPreShutdownHook = function(f) {
  builder.preShutdownHooks.push(f);
};

builder.loader.loadScripts(
  // Load Libraries
  "lib/jquery-ui-1.8.17.custom/js/jquery-1.7.1.min.js",
  "lib/jquery-ui-1.8.17.custom/js/jquery-ui-1.8.17.custom.min.js",
  "lib/cssQuery-p.js",
  "lib/browserdetect.js",
  "lib/json2.js",
  "lib/js-xpath.js",
  // Load Selenium IDE Formats & TestCase/Suite
  "selenium-ide/xhtml-entities.js",
  "selenium-ide/preferences.js",
  "selenium-ide/tools.js",
  "selenium-ide/file-utils.js",
  "selenium-ide/testCase.js",
  "selenium-ide/testSuite.js",
  "selenium-ide/format.js",
  // Load Selenium
  "selenium/htmlutils.js",
  "selenium/selenium-logging.js",
  "selenium/selenium-browserdetect.js",
  "selenium/selenium-browserbot.js",
  "selenium/selenium-api.js",
  "selenium/selenium-commandhandlers.js",
  // Load Selenium Builder
  "builder/utils.js",
  "builder/i18n/translate.js",
  "builder/i18n/en.js",
  "builder/i18n/de.js",
  "builder/i18n/fr.js",
  "builder/i18n/pt-br.js",
  "builder/io.js",
  "builder/url.js",
  "builder/script.js",
  "builder/loadlistener.js",
  "builder/verifyexplorer.js",
  "builder/plugins.js",
  "builder/pagestate.js",
  "builder/gui.js",
  "builder/gui/menu.js",
  "builder/gui/suite.js",
  "builder/views/booting.js",
  "builder/views/startup.js",
  "builder/views/script.js",
  "builder/views/plugins.js",
  "builder/selenium1/init.js",
  "builder/selenium1/seleniumpatch.js",
  "builder/selenium1/methods.js",
  // Load in user-extensions.js
  "%user-extensions.js",
  // Deal with the changes it made
  "builder/selenium1/extensions.js",
  // Load more Builder
  "builder/selenium1/selenium1.js",
  "builder/selenium1/recorder.js",
  "builder/selenium1/playback.js",
  "builder/selenium1/rcPlayback.js",
  "builder/selenium1/docs.js",
  // Load SB/Selenium IDE format adapter
  "builder/selenium1/adapter.js",
  "builder/selenium2/selenium2.js",
  "builder/versionconverter.js",
  "builder/selenium2/io/io.js",
  "builder/selenium2/io/formats/json.js",
  "builder/selenium2/io/formats/java.js",
  "builder/selenium2/io/formats/java_new.js",
  "builder/selenium2/io/formats/java_junit.js",
  "builder/selenium2/io/formats/java_testng.js",
  "builder/selenium2/io/formats/ruby.js",
  "builder/selenium2/io/formats/python.js",
  "builder/selenium2/io/formats/python_unittest.js",
  "builder/selenium2/io/formats/php.js",
  "builder/selenium2/io/formats/node-wd.js",
  "builder/selenium2/io/formats/node-mocha.js",
  "builder/selenium2/io/formats/csharp_new.js",
  "builder/selenium2/io/formats/csharp_new_nunit.js",
  "builder/selenium2/io/formats/english.js",
  "builder/locator.js",
  "builder/suite2.js",
  "builder/stepdisplay.js",
  "builder/selenium2/playback.js",
  "builder/selenium2/rcPlayback.js",
  "builder/selenium2/recorder.js",
  "builder/selenium2/docs.js",
  "builder/record.js",
  "builder/dialogs/dialogs.js",
  "builder/dialogs/convert.js",
  "builder/dialogs/exportscript.js",
  "builder/dialogs/exportsuite.js",
  "builder/dialogs/rc.js",
  "builder/dialogs/record.js",
  "builder/dialogs/runall.js",
  "builder/gui/stepstable.js",
  "builder/gui/translate.js",
  "builder/ignition.js"
);
