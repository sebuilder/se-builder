builder.io = {};

builder.io.storageSystems = [];

builder.io.addStorageSystem = function(ss) {
  builder.io.storageSystems.push(ss);
};

builder.io.loadPath = function(path, basePath, callback) {
  for (var i = 0; i < builder.io.storageSystems.length; i++) {
    var ss = builder.io.storageSystems[i];
    if (ss.where == path.where) {
      ss.load(path, basePath || null, callback);
      return;
    }
  }
  callback(null);
};

/**
 * @param path A path
 * @param basePath Another path, with the same "where" as path
 * @returns A relative path from the <em>parent of basePath</em> to path
 */
builder.io.deriveRelativePath = function(path, basePath) {
  for (var i = 0; i < builder.io.storageSystems.length; i++) {
    var ss = builder.io.storageSystems[i];
    if (ss.where == path.where) {
      return ss.deriveRelativePath(path, basePath);
    }
  }
  return path;
};

builder.io.addStorageSystem({
  "where": "local",
  "load": function(path, basePath, callback) {
    var file = null;
    if (basePath) {
      var baseFile = FileUtils.getFile(basePath.path);
      if (baseFile && baseFile.exists()) {
        file = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
        file.setRelativeDescriptor(baseFile.parent, path.path);
      }
    }
    if (!file || !file.exists()) {
      try { file = FileUtils.getFile(path.path); } catch (e) {}
    }
    if (file && !file.exists()) { return null; }
    var text = null;
    try {
      text = builder.io.readFile(file);
    } catch (e) {
      alert(_t('unable_to_read_file') + e);
      callback(null);
    }
    callback({ "text": text, "path": { "path": file.path, "where": "local" } });
  },
  "deriveRelativePath": function(path, basePath) {
    var rp = FileUtils.getFile(path.path).getRelativeDescriptor(FileUtils.getFile(basePath.path).parent);
    return rp == null ? path : {"path": rp, "where": path.where, "format": path.format};
  }
});

builder.io.loadFile = function(path) {
  var file = null;
  if (!path) {
    file = showFilePicker(window, _t('select_a_file'), 
                          Components.interfaces.nsIFilePicker.modeOpen,
                          Format.TEST_CASE_DIRECTORY_PREF,
                          function(fp) { return fp.file; });
  } else {
    file = FileUtils.getFile(path);
  }
  return file;
};

builder.io.readFile = function(file) {
  var sis = FileUtils.openFileInputStream(file);
  var data = FileUtils.getUnicodeConverter('UTF-8').ConvertToUnicode(sis.read(sis.available()));
  sis.close();
  return data;
};

/** Displays a dialog to load a file (a script or suite) and attempts to interpret it and load it in. */
builder.io.loadUnknownFile = function(addToSuite, path) {
  var file = builder.io.loadFile(path);
  if (!file) { return; }
  var text = null;
  try {
    var text = builder.io.readFile(file);
  } catch (e) {
    alert(_t('unable_to_read_file') + e);
  }
  if (text) { builder.io.loadUnknownText(text, { 'where': 'local', 'path': file.path }, addToSuite); }
}

builder.io.loadUnknownText = function(text, path, addToSuite, callback) {  
  var errors = "";
  callback = callback || function() {};
  
  function loadText(i) {
    var seleniumVersion = builder.seleniumVersions[i];
    
    try {
      var script = seleniumVersion.io.parseScript(text, path);
      if (script.steps.length == 0) {
        throw _t('script_is_empty');
      }
      if (script) {
        if (addToSuite) {
          builder.suite.addScript(script);
          builder.stepdisplay.update();
        } else {
          builder.gui.switchView(builder.views.script);
          builder.setScript(script);
          builder.stepdisplay.update();
          builder.suite.setCurrentScriptSaveRequired(false);
          builder.gui.suite.update();
        }
        callback(true);
        return;
      }
    } catch (e) {
      errors += "\n" + seleniumVersion.name + ": " + e;
    }
    if (addToSuite || !seleniumVersion.io.parseSuite) {
      if (i == 0) {
        loadText(1);
      } else {
        if (!addToSuite) {
          builder.gui.switchView(builder.views.startup);
        }
        alert(_t('unable_to_read_file') + errors);
        callback(false);
      }
      return;
    }
    seleniumVersion.io.parseSuite(text, path, function(suite, error) {
      if (error) {
        errors += "\n" + seleniumVersion.name + " " + _t('suite') + ": " + error;
      } else {
        if (suite && suite.scripts.length == 0) {
          errors += "\n" + _t('suite_is_empty');
        } else if (suite) {
          builder.gui.switchView(builder.views.script);
          builder.suite.setSuite(suite.scripts, suite.path);
          builder.stepdisplay.update();
          builder.suite.setCurrentScriptSaveRequired(false);
          builder.gui.suite.update();
          callback(true);
          return;
        }
      }
      if (i == 0) {
        loadText(1);
      } else {
        builder.gui.switchView(builder.views.startup);
        alert(_t('unable_to_read_file') + errors);
        callback(false);
      }
    });
  }
  loadText(0);
};