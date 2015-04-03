builder.suite = {};

builder.suite.scripts = [];
builder.suite.currentScriptIndex = -1;
builder.suite.scriptChangeListeners = [];
builder.suite.suiteSaveRequired = false;
builder.suite.path = null;
builder.suite.exportpath = null;
builder.suite.shareState = false;

builder.doShareSuiteState = function() {
  // Can only share suite state if all suite scripts are of the same Selenium version!
  return builder.suite.shareState && (builder.suite.areAllScriptsOfVersion(builder.selenium1) || builder.suite.areAllScriptsOfVersion(builder.selenium2));
};

builder.suite.getNumberOfScripts = function() {
  return builder.suite.scripts.length;
};

builder.suite.hasScript = function() {
  return builder.suite.currentScriptIndex != -1;
};

builder.suite.getCurrentScript = function() {
  return builder.suite.hasScript() ?
    builder.suite.scripts[builder.suite.currentScriptIndex] : null;
};

builder.suite.setCurrentScript = function(script) {
  if (builder.suite.hasScript()) {
    builder.suite.scripts[builder.suite.currentScriptIndex] = script;
  } else {
    builder.suite.scripts.push(script);
    builder.suite.currentScriptIndex = builder.suite.scripts.length - 1;
  }
  builder.suite.suiteSaveRequired = builder.suite.suiteSaveRequired || builder.suite.scripts.length > 1;
  builder.suite.broadcastScriptChange();
};

builder.suite.addScript = function(script) {
  if (!builder.suite.hasScript()) {
    builder.suite.setCurrentScript(script);
  } else {
    builder.suite.scripts.push(script);
    builder.suite.currentScriptIndex = builder.suite.scripts.length - 1;
    builder.suite.suiteSaveRequired = true;
    builder.suite.broadcastScriptChange();
  }
};

builder.suite.removeScript = function(index) {
  builder.suite.scripts.splice(index, 1);
  if (builder.suite.currentScriptIndex >= index) {
    builder.suite.currentScriptIndex--;
  }
  if (builder.suite.currentScriptIndex == -1 && builder.suite.scripts.length > 0) {
    builder.suite.currentScriptIndex = 0;
  }
  builder.suite.suiteSaveRequired = true;
  builder.suite.broadcastScriptChange();
};

builder.suite.switchToScript = function(index) {
  if (index < builder.suite.scripts.length) {
    builder.suite.currentScriptIndex = index;
    builder.suite.broadcastScriptChange();
  }
};

builder.suite.getSelectedScriptIndex = function() {
  return builder.suite.currentScriptIndex;
};

builder.suite.setSuite = function(scripts, path, shareState) {
  builder.suite.scripts = scripts;
  builder.suite.currentScriptIndex = scripts.length === 0 ? -1 : 0;
  builder.suite.suiteSaveRequired = false;
  builder.suite.path = path;
  builder.suite.broadcastScriptChange();
  builder.suite.shareState = !!shareState;
  bridge.prefManager.setBoolPref("extensions.seleniumbuilder.shareSuiteState", builder.suite.shareState);
  if (builder.suite.shareState) {
    jQuery('#run-share-state').text(_t('menu_dont_share_state_across_suite'));
  } else {
    jQuery('#run-share-state').text(_t('menu_share_state_across_suite'));
  }
};

builder.suite.clearSuite = function() {
  builder.suite.scripts = [];
  builder.suite.currentScriptIndex = -1;
  builder.suite.suiteSaveRequired = false;
  builder.suite.path = null;
  builder.suite.broadcastScriptChange();
};

builder.suite.getScriptNames = function() {
  var names = [];
  for (var i = 0; i < builder.suite.scripts.length; i++) {
    var script = builder.suite.scripts[i];
    var name = "[" + _t('untitled_script') + " " + (i + 1) + "]";
    if (script.path) {
      name = script.path.path.split("/");
      name = name[name.length - 1].split(".")[0];
    }
    if (script.exportpath) {
      var bits = script.exportpath.path.split("/");
      name += " / " + bits[bits.length - 1];
    }
    names.push(name);
  }
  return names;
};

builder.suite.areAllScriptsOfVersion = function(seleniumVersion) {
  if (!builder.suite.hasScript()) { return false; }
  for (var i = 0; i < builder.suite.scripts.length; i++) {
    if (builder.suite.scripts[i].seleniumVersion != seleniumVersion) {
      return false;
    }
  }
  return true;
};

builder.suite.isAnyScriptOfVersion = function(seleniumVersion) {
  if (!builder.suite.hasScript()) { return false; }
  for (var i = 0; i < builder.suite.scripts.length; i++) {
    if (builder.suite.scripts[i].seleniumVersion == seleniumVersion) {
      return true;
    }
  }
  return false;
};

builder.suite.getSaveRequired = function() {
  return builder.suite.getSuiteSaveRequired() || builder.suite.getAnyScriptSaveRequired();
};

builder.suite.setCurrentScriptSaveRequired = function(saveRequired) {
  if (builder.suite.hasScript()) {
    builder.suite.getCurrentScript().saveRequired = saveRequired;
  }
  builder.suite.broadcastScriptChange();
};

builder.suite.setScriptSaveRequired = function(script, saveRequired) {
  script.saveRequired = saveRequired;
  builder.suite.broadcastScriptChange();
};

builder.suite.getCurrentScriptSaveRequired = function() {
  if (builder.suite.hasScript()) {
    return builder.suite.getCurrentScript().saveRequired;
  }
  return false;
};

builder.suite.getAnyScriptSaveRequired = function(saveRequired) {
  for (var i = 0; i < builder.suite.scripts.length; i++) {
    if (builder.suite.scripts[i].saveRequired) { return true; }
  }
  return false;
};

builder.suite.setSuiteSaveRequired = function(suiteSaveRequired) {
  builder.suite.suiteSaveRequired = suiteSaveRequired;
  builder.suite.broadcastScriptChange();
};

builder.suite.getSuiteSaveRequired = function() {
  return builder.suite.suiteSaveRequired;
};

builder.suite.broadcastScriptChange = function() {
  for (var i = 0; i < builder.suite.scriptChangeListeners.length; i++) {
    builder.suite.scriptChangeListeners[i]();
  }
};

builder.suite.addScriptChangeListener = function(l) {
  builder.suite.scriptChangeListeners.push(l);
};

builder.suite.removeScriptChangeListener = function(l) {
  if (builder.suite.scriptChangeListeners.indexOf(l) != -1) {
    builder.suite.scriptChangeListeners.splice(builder.suite.scriptChangeListeners.indexOf(l), 1);
  }
};

builder.suite.getFirstScriptPathWhere = function() {
  return builder.suite.scripts.length > 0 && builder.suite.scripts[0].path ? builder.suite.scripts[0].path.where : null;
};

builder.suite.isSaveable = function() {
  return builder.suite.scripts.length > 1 && builder.suite.isSaveableTo(builder.suite.getFirstScriptPathWhere());
};

builder.suite.isSaveableTo = function(where) {
  var version = null;
  for (var i = 0; i < builder.suite.scripts.length; i++) {
    var script = builder.suite.scripts[i];
    if (!script.path) { return false; }
    if (script.path.where != where) { return false; }
    if (version === null) { version = script.seleniumVersion; }
    if (version != script.seleniumVersion) { return false; }
    if (!version.io.isSaveFormat(script.path.format)) { return false; }
  }
  return true;
};

builder.suite.getFirstScriptExportPathWhere = function() {
  return builder.suite.scripts.length > 0 && builder.suite.scripts[0].exportpath ? builder.suite.scripts[0].exportpath.where : null;
};

builder.suite.isExportable = function() {
  return builder.suite.scripts.length > 1 && builder.suite.isExportableTo(builder.suite.getFirstScriptExportPathWhere());
};

builder.suite.isExportableTo = function(where) {
  return builder.suite.getSuiteExportFormats(where).length > 0;
};

builder.suite.getSuiteExportFormats = function(where) {
  var version = null;
  var format = null;
  for (var i = 0; i < builder.suite.scripts.length; i++) {
    var script = builder.suite.scripts[i];
    if (!script.exportpath) { return []; }
    if (script.exportpath.where != where) { return []; }
    if (version === null) { version = script.seleniumVersion; }
    if (version != script.seleniumVersion) { return []; }
    if (format === null) { format = script.exportpath.format; }
    if (format.name != script.exportpath.format.name) { return []; }
  }
  return version.io.getSuiteExportFormatsFor(format);
};

builder.suite.getCommonSeleniumVersion = function() {
  var version = null;
  for (var i = 0; i < builder.suite.scripts.length; i++) {
    var script = builder.suite.scripts[i];
    if (version === null) { version = script.seleniumVersion; }
    if (version != script.seleniumVersion) { return null; }
  }
  return version;
};

builder.suite.getCommonExportFormat = function() {
  var fs = builder.suite.getSuiteExportFormats(builder.suite.getFirstScriptExportPathWhere());
  return fs.length === 0 ? null : fs[0];
};

builder.getScript = builder.suite.getCurrentScript;
builder.setScript = builder.suite.setCurrentScript;



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
