/** Code for managing plugins */
builder.plugins = {};

// States
builder.plugins.NOT_INSTALLED = "NOT_INSTALLED";
builder.plugins.INSTALLED     = "INSTALLED";
builder.plugins.TO_INSTALL    = "TO_INSTALL";
builder.plugins.TO_UNINSTALL  = "TO_UNINSTALL";
builder.plugins.TO_UPDATE     = "TO_UPDATE";

builder.plugins.DISABLED   = "DISABLED";
builder.plugins.ENABLED    = "ENABLED";
builder.plugins.TO_ENABLE  = "TO_ENABLE";
builder.plugins.TO_DISABLE = "TO_DISABLE";

builder.plugins.ds = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
builder.plugins.ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
builder.plugins.db = null;

builder.plugins.downloadingCount = 0;
builder.plugins.startupErrors = [];

builder.plugins.MAX_HEADER_VERSION = 1;
builder.plugins.PLUGINS_BUILDER_VERSION = 1;

// List of {"id":, "version"} objects.
builder.plugins.bundledPlugins = [];

builder.plugins.getGotoPluginsView = function() {
  return bridge.prefManager.getBoolPref("extensions.seleniumbuilder.plugins.gotoPluginsView");
};

builder.plugins.setGotoPluginsView = function(b) {
  bridge.prefManager.setBoolPref("extensions.seleniumbuilder.plugins.gotoPluginsView", b);
};

/**
 * Will call callback with a list of {identifier, installState, enabledState, installedInfo, repositoryInfo} of all plugins.
 */
builder.plugins.getListAsync = function(callback) {
  builder.plugins.getRemoteListAsync(function(repoList, error) {
	var i, id;
    if (error) { callback(null, error); return; }
    var installedList = builder.plugins.getInstalledIDs();
    var repoMap = {};
    if (repoList) {
      for (i = 0; i < repoList.length; i++) {
        repoMap[repoList[i].identifier] = repoList[i];
      }
    }
    var installedMap = {};
    for (i = 0; i < installedList.length; i++) {
      installedMap[installedList[i]] = true;
    }
    var result = [];
    // Add all installed plugins.
    for (i = 0; i < installedList.length; i++) {
      id = installedList[i];
      var line = builder.plugins.getState(id);
      line.identifier = id;
      line.installedInfo = builder.plugins.getInstalledInfo(id);
      if (repoMap[id]) {
        line.repositoryInfo = repoMap[id];
      }
      result.push(line);
    }
    
    // Add all non-installed plugins.
    for (i = 0; i < repoList.length; i++) {
      id = repoList[i].identifier;
      if (installedMap[id]) { continue; }
      result.push({
        "identifier": id,
        "installState": builder.plugins.NOT_INSTALLED,
        "enabledState": builder.plugins.ENABLED,
        "installedInfo": null,
        "repositoryInfo": repoList[i]
      });
    }
    callback(result, error);
  });
};

builder.plugins.isUpdateable = function(info) {
  if (!info.installedInfo || !info.repositoryInfo) {
    return false;
  }
  if (!info.repositoryInfo.browsers[bridge.browserType()]) {
    return false;
  }
  return !builder.plugins.checkMaxVersion(info.installedInfo.pluginVersion, info.repositoryInfo.browsers[bridge.browserType()].pluginVersion);
};

builder.plugins.isPluginTooNew = function(info) {
  info = info.repositoryInfo.browsers[bridge.browserType()];
  if (!info) { return false; }
  return info.builderMinVersion && !builder.plugins.checkMinVersion(info.builderMinVersion + "", builder.version);
};

builder.plugins.isPluginTooOld = function(info) {
  info = info.repositoryInfo.browsers[bridge.browserType()];
  if (!info) { return false; }
  return info.builderMaxVersion && !builder.plugins.checkMaxVersion(info.builderMaxVersion + "", builder.version);
};

builder.plugins.createDir = function(f) {
  if (!f.exists() || !f.isDirectory()) {  
    f.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);  
  }
};

builder.plugins.isValidID = function(str) {
  return str && str.match(/^[0-9a-zA-Z_]{3,32}$/);
};

builder.plugins.getBuilderDir = function() {
  var f = builder.plugins.ds.get("ProfD", Components.interfaces.nsIFile);
  f.append("SeBuilder");
  builder.plugins.createDir(f);
  return f;
};

builder.plugins.getPluginsDir = function() {
  var f = builder.plugins.getBuilderDir();
  f.append("plugins");
  builder.plugins.createDir(f);
  return f;
};

builder.plugins.getInstalledIDs = function() {
  var result = [];
  var toInstall = {};
  var s = null;
  try {
    s = builder.plugins.db.createStatement("SELECT identifier FROM state WHERE installState = '" + builder.plugins.TO_INSTALL + "'");
    while (s.executeStep()) {
      result.push(s.row.identifier);
      toInstall[s.row.identifier] = true;
    }
  } finally {try {s.finalize();} catch(e) {}}
  var f = builder.plugins.getPluginsDir();
  var en = f.directoryEntries;
  while (en.hasMoreElements()) {
    var child = en.getNext();
    var leafName = child.QueryInterface(Components.interfaces.nsIFile).leafName;
    if (child.QueryInterface(Components.interfaces.nsIFile).isHidden()) {
      continue;
    }
    if (!toInstall[leafName] && builder.plugins.isValidID(leafName)) {
      result.push(leafName);
    }
  }
  return result;
};

builder.plugins.getInstalledInfo = function(id) {
  try {
    var f = builder.plugins.getDirForPlugin(id);
    f.append("header.json");
    if (f.isFile()) {
      return JSON.parse(bridge.readFile(f));
    }
  } catch (e) {
    return null;
  }
};

builder.plugins.setInstallState = function(id, installState) {
  var s;
  try {
    s = builder.plugins.db.createStatement("SELECT * FROM state WHERE identifier = :identifier");
    s.params.identifier = id;
    if (s.executeStep()) {
      s.finalize();
      s = builder.plugins.db.createStatement("UPDATE state SET installState = :installState WHERE identifier = :identifier");
      s.params.identifier = id;
      s.params.installState = installState; 
      s.executeStep();
    } else {
      s.finalize();
      s = builder.plugins.db.createStatement("INSERT INTO state VALUES (:identifier, :installState, :enabledState)");
      s.params.identifier = id;
      s.params.installState = installState;
      s.params.enabledState = builder.plugins.ENABLED; 
      s.executeStep();
    }
  } finally { s.finalize(); }
};

builder.plugins.setEnabledState = function(id, enabledState) {
  var s;
  try {
    s = builder.plugins.db.createStatement("SELECT * FROM state WHERE identifier = :identifier");
    s.params.identifier = id;
    if (s.executeStep()) {
      s.finalize();
      s = builder.plugins.db.createStatement("UPDATE state SET enabledState = :enabledState WHERE identifier = :identifier");
      s.params.identifier = id;
      s.params.enabledState = enabledState; 
      s.executeStep();
    } else {
      s.finalize();
      s = builder.plugins.db.createStatement("INSERT INTO state VALUES (:identifier, :installState, :enabledState)");
      s.params.identifier = id;
      s.params.installState = builder.plugins.INSTALLED;
      s.params.enabledState = enabledState; 
      s.executeStep();
    }
  } finally { s.finalize(); }
};

/** @return The state of an installed plugin. */
builder.plugins.getState = function(id) {
  var s;
  try {
    s = builder.plugins.db.createStatement("SELECT * FROM state WHERE identifier = :identifier");
    s.params.identifier = id;
    if (s.executeStep()) { // qqDPS Synchronous API usage, naughty.
      return {"installState": s.row.installState, "enabledState": s.row.enabledState};
    } else {
      // We have no record of it, so keep it as default.
      return {"installState": builder.plugins.INSTALLED, "enabledState": builder.plugins.ENABLED};
    }
  } finally { s.finalize(); }
};

builder.plugins.pluginExists = function(id) {
  var d = builder.plugins.getDirForPlugin(id);
  return d.exists() && d.isDirectory();
};

builder.plugins.getDirForPlugin = function(id) {
  var f = builder.plugins.getPluginsDir();
  f.append(id);
  return f;
};

builder.plugins.getZipForPlugin = function(id) {
  var f = builder.plugins.getBuilderDir();
  f.append("pluginzips");
  builder.plugins.createDir(f);
  f.append(id + ".zip");
  return f;
};

builder.plugins.getExtractForPlugin = function(id) {
  var f = builder.plugins.getBuilderDir();
  f.append("extract");
  builder.plugins.createDir(f);
  f.append(id);
  return f;
};

/**
 * @return A list of info objects of all plugins in the plugin DB.
 */
builder.plugins.getRemoteListAsync = function(callback) {
  var loadTimedOut = false;
  var loadSucceeded = false;
  
  jQuery.ajax({
    type: "GET",
    cache: false,
    dataType: "json",
    url: bridge.pluginRepository() + "?" + Math.random(),
    success: function(data) {
      if (loadTimedOut) { return; }
      loadSucceeded = true;
      if (data.repositoryVersion > 1) {
        callback(null, _t('plugin_list_too_new'));
      } else {
        var result = [];
        for (var i = 0; i < data.plugins.length; i++) {
          if (data.plugins[i].browsers[bridge.browserType()]) {
            result.push(data.plugins[i]);
          }
        }
        callback(result);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      if (loadTimedOut) { return; }
      loadSucceeded = true;
      callback(null, _t('unable_to_fetch_plugins') + ": " + (textStatus ? textStatus : "") + " " + (errorThrown ? errorThrown : ""));
    }
  });
  
  setTimeout(function() {
    if (loadSucceeded) { return; }
    loadTimedOut = true;
    callback(null, _t('unable_to_fetch_plugins') + ": " + _t('plugin_load_timed_out'));
  }, 5000);
};

builder.plugins.performDownload = function(id, url, callback) {
  builder.plugins.downloadingCount++;
  jQuery('#plugins-downloading').show();
  
  var loadTimedOut = false;
  var loadSucceeded = false;
  
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url + "?" + Math.random(), true);
  oReq.responseType = "arraybuffer";
  
  oReq.onload = function (oEvent) {
    if (loadTimedOut) { return; }
    loadSucceeded = true;
    var arrayBuffer = oReq.response; // Note: not oReq.responseText
    if (arrayBuffer) {
      var byteArray = new Uint8Array(arrayBuffer);
      var str = "";
      for (var i = 0; i < byteArray.length; i++) {
        str += String.fromCharCode(byteArray[i]);
      }
      var f = builder.plugins.getZipForPlugin(id);
      try { f.remove(true); } catch (e) {} // qqDPS
      f.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0600);
      var stream = Components.classes["@mozilla.org/network/safe-file-output-stream;1"].
                   createInstance(Components.interfaces.nsIFileOutputStream);
      stream.init(f, 0x04 | 0x08 | 0x20, 0600, 0); // readwrite, create, truncate
      stream.write(str, byteArray.length);
      if (stream instanceof Components.interfaces.nsISafeOutputStream) {
        stream.finish();
      } else {
        stream.close();
      }
      if (f.exists()) {
        builder.plugins.downloadSucceeded(id);
        if (callback) { callback(); }
      } else {
        builder.plugins.downloadFailed(id, null);
      }
    } else {
      builder.plugins.downloadFailed(id, url + " " + _t('plugin_url_not_found'));
    }
  };

  oReq.send(null);
  setTimeout(function() {
    if (loadSucceeded) { return; }
    loadTimedOut = true;
    builder.plugins.downloadFailed(id, _t('plugin_load_timed_out'));
  }, 5000);
};

builder.plugins.downloadSucceeded = function(id) {
  builder.plugins.downloadingCount--;
  if (builder.plugins.downloadingCount === 0) {
    jQuery('#plugins-downloading').hide();
  }
  builder.views.plugins.refresh();
};

builder.plugins.downloadFailed = function(id, e) {
  alert(_t('plugin_download_failed') + (e ? ("\n" + e) : ""));
  builder.plugins.setInstallState(id, builder.plugins.NOT_INSTALLED);
  builder.plugins.downloadingCount--;
  if (builder.plugins.downloadingCount === 0) {
    jQuery('#plugins-downloading').hide();
  }
  builder.views.plugins.refresh();
};

builder.plugins.validatePlugin = function(id, f) {
  try {
    if (!f.exists()) { return _t('plugin_missing_dir', f.path); }
    if (!f.isDirectory()) { return _t('plugin_not_a_dir', f.path); }
    f.append("header.json");
    if (!f.exists()) {
      return _t('plugin_header_missing', f.path);
    }
    if (!f.isFile()) {
      return _t('plugin_header_not_file', f.path);
    }
    var fileData = bridge.readFile(f);
    var header = null;
    try {
      header = JSON.parse(fileData);
    } catch (e) {
      return _t('plugin_header_file_corrupted', f.path, e);
    }
    if (!header.headerVersion) {
      return _t('plugin_header_file_no_version', f.path); 
    }
    if (header.headerVersion > builder.plugins.MAX_HEADER_VERSION) {
      return _t('plugin_builder_too_old');
    }
    if (header.identifier != id) {
      return _t('plugin_id_mismatch', header.identifier, id);
    }
    if (!header.pluginVersion || !header.pluginVersion.match(/^[0-9]+([.][0-9]+)*$/)) {
      return _t('plugin_version_invalid');
    }
  } catch (e) {
    return _t('plugin_cant_verify', e);
  }
  return null;
};

builder.plugins.performInstall = function(id, customZipF) {
  try {
    var zipF = customZipF ? customZipF : builder.plugins.getZipForPlugin(id);
    if (!zipF.exists()) {
      builder.plugins.startupErrors.push(_t('plugin_unable_to_install', id, _t('plugin_download_failed')));
      builder.plugins.setInstallState(id, builder.plugins.NOT_INSTALLED);
      return;
    }
    var installD = builder.plugins.getDirForPlugin(id);
    try { builder.plugins.getExtractForPlugin(id).remove(true); } catch (e) {} // qqDPS
    builder.plugins.createDir(builder.plugins.getExtractForPlugin(id));
    var zipReader = Components.classes["@mozilla.org/libjar/zip-reader;1"]
                    .createInstance(Components.interfaces.nsIZipReader);
    zipReader.open(zipF);
    var entries = zipReader.findEntries("*");
    while (entries.hasMore()) {
      var path = entries.getNext();
      var e = zipReader.getEntry(path);
      var splitPath = path.split("/");
      var f = builder.plugins.getExtractForPlugin(id);
      if (splitPath[0] != id) { continue; }
      for (var i = 1; i < splitPath.length; i++) {
        f.append(splitPath[i]);
      }
      if (e.isDirectory) {
        builder.plugins.createDir(f);
      } else {
        builder.plugins.createDir(f.parent);
        zipReader.extract(path, f);
      }
    }
  
    var validationError = builder.plugins.validatePlugin(id, builder.plugins.getExtractForPlugin(id));
    if (validationError) {
      builder.plugins.startupErrors.push(_t('plugin_unable_to_install', id, "" + validationError));
      builder.plugins.setInstallState(id, builder.plugins.NOT_INSTALLED);
      return;
    }
  
    try { installD.remove(true); } catch (e) {} // qqDPS
    builder.plugins.getExtractForPlugin(id).moveTo(installD.parent, installD.leafName);
    builder.plugins.setInstallState(id, builder.plugins.INSTALLED);
    builder.plugins.setEnabledState(id, builder.plugins.ENABLED);
  } catch (e) {
    builder.plugins.startupErrors.push(_t('plugin_unable_to_install', id, "" + e));
    builder.plugins.setInstallState(id, builder.plugins.NOT_INSTALLED);
  }
};

builder.plugins.performUninstall = function(id) {
  try {
    builder.plugins.getDirForPlugin(id).remove(true);
    builder.plugins.setInstallState(id, builder.plugins.NOT_INSTALLED);
  } catch (e) {
    builder.plugins.startupErrors.push(_t('plugin_unable_to_uninstall', id, e));
  }
};

builder.plugins.start = function(callback) {
  bridge.getInternalFile("/chrome/content/html/js/builder/bundledPlugins/", function(bundledPluginsDir) {
    builder.plugins.start_2(callback, bundledPluginsDir);
  });
};

builder.plugins.start_2 = function(callback, bundledPluginsDir) {
  // Start up database connection.
  Components.utils.import("resource://gre/modules/Services.jsm");
  var dbFile = builder.plugins.getBuilderDir();
  dbFile.append("plugins.sqlite");
  builder.plugins.db = Services.storage.openDatabase(dbFile); // Will also create the file if it does not exist
  // Create the "state" table if it doesn't exist yet.
  var s = null;
  try {
    s = builder.plugins.db.createStatement("SELECT name FROM sqlite_master WHERE type='table' AND name='state'");
    if (!s.executeStep()) {
      s.finalize();
      s = builder.plugins.db.createStatement("CREATE TABLE state (identifier varchar(255), installState varchar(255), enabledState varchar(255))");
      s.executeStep();
    }
  } finally { s.finalize(); }
  
  // Install bundled plugins.
  var i;
  for (i = 0; i < builder.plugins.bundledPlugins.length; i++) {
    var id = builder.plugins.bundledPlugins[i].id;
    var version = builder.plugins.bundledPlugins[i].version;
    var isUpdate = true;
    try {
      isUpdate = !builder.plugins.checkMaxVersion(builder.plugins.getInstalledInfo(id).pluginVersion, version);
    } catch (e) {
      // Ignore
    }
    if ((!builder.plugins.pluginExists(id) || isUpdate) && builder.plugins.getState(id).installState != builder.plugins.TO_INSTALL) {
      var zipF = bundledPluginsDir.clone();
      zipF.append(id + ".zip");
      builder.plugins.performInstall(id, zipF);
      builder.plugins.setEnabledState(id, builder.plugins.ENABLED);
    }
  }
    
  // Install new plugins.
  var to_install = [];
  try {
    s = builder.plugins.db.createStatement("SELECT identifier FROM state WHERE installState = '" + builder.plugins.TO_INSTALL + "'");
    while (s.executeStep()) {
      to_install.push(s.row.identifier);
    }
  } finally { s.finalize(); }
  for (i = 0; i < to_install.length; i++) {
    builder.plugins.performInstall(to_install[i]);
    builder.plugins.setEnabledState(to_install[i], builder.plugins.ENABLED);
  }
  
  // Update plugins
  var to_update = [];
  try {
    s = builder.plugins.db.createStatement("SELECT identifier FROM state WHERE installState = '" + builder.plugins.TO_UPDATE + "'");
    while (s.executeStep()) {
      to_update.push(s.row.identifier);
    }
  } finally { s.finalize(); }
  for (i = 0; i < to_update.length; i++) {
    builder.plugins.performInstall(to_update[i]);
  }
  
  // Uninstall plugins.
  var to_uninstall = [];
  try {
    s = builder.plugins.db.createStatement("SELECT identifier FROM state WHERE installState = '" + builder.plugins.TO_UNINSTALL + "'");
    while (s.executeStep()) {
      to_uninstall.push(s.row.identifier);
    }
  } finally { s.finalize(); }
  for (i = 0; i < to_uninstall.length; i++) {
    builder.plugins.performUninstall(to_uninstall[i]);
  }
  
  // Enable and disable plugins.
  try {
    s = builder.plugins.db.createStatement("UPDATE state SET enabledState = '" + builder.plugins.DISABLED + "' WHERE enabledState = '" + builder.plugins.TO_DISABLE + "'");
    s.executeStep();
  } finally { s.finalize(); }
  try {
    s = builder.plugins.db.createStatement("UPDATE state SET enabledState = '" + builder.plugins.ENABLED + "' WHERE enabledState = '" + builder.plugins.TO_ENABLE + "'");
    s.executeStep();
  } finally { s.finalize(); }
  
  // Load plugins
  installeds = builder.plugins.getInstalledIDs();
  var to_load = [];
  for (i = 0; i < installeds.length; i++) {
    var state = builder.plugins.getState(installeds[i]);
    if (state.installState == builder.plugins.INSTALLED && state.enabledState == builder.plugins.ENABLED) {
      var info = builder.plugins.getInstalledInfo(installeds[i]);
      if (info.builderMinVersion && !builder.plugins.checkMinVersion(info.builderMinVersion + "", builder.version)) {
        builder.plugins.setEnabledState(installeds[i], builder.plugins.DISABLED);
        builder.plugins.startupErrors.push(_t('plugin_disabled_builder_too_old', info.name, info.builderMinVersion, builder.version));
        continue;
      }
      if (info.builderMaxVersion && !builder.plugins.checkMaxVersion(info.builderMaxVersion + "", builder.version)) {
        builder.plugins.setEnabledState(installeds[i], builder.plugins.DISABLED);
        builder.plugins.startupErrors.push(_t('plugin_disabled_builder_too_new', info.name, info.builderMaxVersion, builder.version));
        continue;
      }
      for (var j = 0; j < info.load.length; j++) {
        to_load.push(builder.plugins.getResourcePath(installeds[i], info.load[j]));
      }
    }
  }
  builder.loader.loadListOfScripts(to_load, callback);
  
  // Show any startup errors.
  for (i = 0; i < builder.plugins.startupErrors.length; i++) {
    alert(builder.plugins.startupErrors[i]);
  }
};

builder.plugins.shutdown = function() {
  var installeds = builder.plugins.getInstalledIDs();
  for (var i = 0; i < installeds.length; i++) {
    var state = builder.plugins.getState(installeds[i]);
    if (
      (state.installState == builder.plugins.INSTALLED || state.installState == builder.plugins.TO_UNINSTALL)  &&
      (state.enabledState == builder.plugins.ENABLED || state.enabledState == builder.plugins.TO_DISABLE))
    {
      var info = builder.plugins.getInstalledInfo(installeds[i]);
      if (info.shutdownFunction) {
        // Eval is traditionally bad, but we've already let the plugin do whatever it wants!
        eval(info.shutdownFunction + "();");
      }
    }
  }
  builder.plugins.db.close();
};

builder.registerPreShutdownHook(builder.plugins.shutdown);

builder.plugins.getResourcePath = function(id, relativePath) {
  var els = relativePath.split("/");
  var f = builder.plugins.getDirForPlugin(id);
  for (var i = 0; i < els.length; i++) {
    f.append(els[i]);
  }
  return builder.plugins.ios.newFileURI(f).spec;
};

/**
 * Checks that actualVersion >= minVersion.
 */
builder.plugins.checkMinVersion = function(minVersion, actualVersion) {
  minVersion = (minVersion + "").split(".");
  actualVersion = (actualVersion + "").split(".");
  for (var i = 0; i < Math.max(minVersion.length, actualVersion.length); i++) {
    var min = i >= minVersion.length    ? 0 : minVersion[i];
    var act = i >= actualVersion.length ? 0 : actualVersion[i];
    if (min != "*" && parseInt(act) < parseInt(min)) {
      return false;
    }
    if (min == "*" || parseInt(act) > parseInt(min)) {
      return true;
    }
  }
  return true;
};

/**
 * Checks that actualVersion <= maxVersion.
 */
builder.plugins.checkMaxVersion = function(maxVersion, actualVersion) {
  maxVersion = (maxVersion + "").split(".");
  actualVersion = (actualVersion + "").split(".");
  for (var i = 0; i < Math.max(maxVersion.length, actualVersion.length); i++) {
    var max = i >= maxVersion.length    ? 0 : maxVersion[i];
    var act = i >= actualVersion.length ? 0 : actualVersion[i];
    if (max != "*" && parseInt(act) > parseInt(max)) {
      return false;
    }
    if (max == "*" || parseInt(act) < parseInt(max)) {
      return true;
    }
  }
  return true;
};

builder.plugins.hasUpdates = function(callback) {
  builder.plugins.getListAsync(function(result) {
    for (var i = 0; i < result.length; i++) {
      var info = result[i];
      if (builder.plugins.isUpdateable(info) && !builder.plugins.isPluginTooNew(info) && !builder.plugins.isPluginTooOld(info)) {
        callback(true);
        return;
      }
    }
    callback(false);
  });
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
