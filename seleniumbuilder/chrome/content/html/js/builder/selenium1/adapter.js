/**
 * Functions for interfacing with the code from Selenium IDE in the selenium-ide folder.
 */
builder.selenium1.adapter = {};
builder.selenium1.io = {};

// Load in bits and pieces evidently required to get export to work. Taken from test-api-doc.js in
// Selenium IDE and modified mildly.
builder.selenium1.adapter.seleniumAPI = {};
var subScriptLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
subScriptLoader.loadSubScript('chrome://seleniumbuilder/content/html/js/selenium-ide/selenium/scripts/selenium-api.js', builder.selenium1.adapter.seleniumAPI);
var parser = new DOMParser();
var apidoc = parser.parseFromString(FileUtils.readURL("chrome://seleniumbuilder/content/html/js/selenium-ide/selenium/iedoc-core.xml"), "text/xml");
Command.apiDocuments = [apidoc];
Command.prototype.getAPI = function() {
  return builder.selenium1.adapter.seleniumAPI;
};

/**
 * @return Format objects that have a name property that can be displayed.
 */
builder.selenium1.adapter.availableFormats = function() {
  return builder.selenium1.adapter.formatCollection().presetFormats;
};

builder.selenium1.io.isSaveFormat = function(format) {
  return format && format.name == "HTML";
};

builder.selenium1.adapter.parseSuite = function(text, path, callback) {
  var format = builder.selenium1.adapter.formatCollection().findFormat('default');
  var si = { 'scripts': [], 'path': {'path': path.path, 'where': path.where, 'format': format } };
  var ts = null;
  try {
    ts = TestSuite.loadString(text);
  } catch (e) {
    callback(null, e);
    return;
  }
  if (!ts || ts.tests.length == 0) {
    callback(null, _t('could_not_open_suite'));
    return;
  }
  function loadScript(i) {
    var filename = ts.tests[i].filename;
    if (!endsWith(filename, ".html")) {
      filename += ".html";
    }
    builder.io.loadPath({'where': path.where, 'path': filename}, path, function(scriptInfo, error) {
      var script = null;
      if (scriptInfo) {
        script = builder.selenium1.adapter.parseScript(scriptInfo.text, scriptInfo.path);
      }
      if (script != null) {
        si.scripts.push(script);
      }
      if (i < ts.tests.length - 1) {
        loadScript(i + 1);
      } else {
        callback(si);
      }
    });
  }
  loadScript(0);
  /*for (var i = 0; i < ts.tests.length; i++) {
    var filename = ts.tests[i].filename;
    if (!endsWith(filename, ".html")) {
      filename += ".html";
    }
    var scriptInfo = builder.io.loadPath({'where': path.where, 'path': filename}, path);
    var script = null;
    if (scriptInfo) {
      script = builder.selenium1.adapter.parseScript(scriptInfo.text, scriptInfo.path);
    }
    if (script === null) {
      alert(_t('sel1_could_not_open_suite_script', filename));
      return null;
    }
    si.scripts.push(script);
  }
  return si;*/
};

builder.selenium1.loadSuite = builder.selenium1.adapter.importSuite;

/**
 * Allows user to save a suite.
 * @return The path saved to, or null.
 */
builder.selenium1.adapter.saveSuite = function(scripts, path) {
  var format = builder.selenium1.adapter.formatCollection().findFormat('default');
  try {
    var ts = new TestSuite();
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      var tc = builder.selenium1.adapter.convertScriptToTestCase(script);
      ts.addTestCaseFromContent(tc);
    }
    if (path) {
      ts.file = FileUtils.getFile(path.path);
    }
    if (ts.save(false)) {
      return { 'path': ts.file.path, 'where': 'local', 'format': format };
    } else {
      return null;
    }
  } catch (e) {
    alert(_t('sel1_couldnt_save_suite', e + ""));
    return null;
  }
};

/**
 * Allows user to export a suite to the given format.
 * @return The path saved to, or null.
 */
builder.selenium1.adapter.exportSuiteAs = function(scripts, format) {
  try {
    var ts = new TestSuite();
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      var tc = builder.selenium1.adapter.convertScriptToTestCase(script);
      ts.addTestCaseFromContent(tc);
    }
    if (format.saveSuiteAsNew(ts) && ts.file) {
      return { 'path': ts.file.path, 'where': local, 'format': format };
    } else {
      return null;
    }
  } catch (e) {
    alert(_t('sel1_couldnt_save_suite', e + ""));
    return null;
  }
};

builder.selenium1.io.makeSuiteExportFunction = function(format) {
  return function(scripts, path) {
    return builder.selenium1.adapter.exportSuiteAs(scripts, format);
  };
};

builder.selenium1.io.getSuiteExportFormats = function(path) {
  var fs = [];
  if (path) {
    fs.push({'name': "Save to " + path.path, 'save': builder.selenium1.adapter.saveSuite});
  }
  fs.push({'name': "Save as HTML", 'save': function(scripts, path) {
    return builder.selenium1.adapter.saveSuite(scripts, null);
  }});
  var afs = builder.selenium1.adapter.availableFormats();
  for (var i = 0; i < afs.length; i++) {
    if (afs[i].getFormatter().formatSuite) {
      fs.push({'name': "Export as " + afs[i].name, 'save': builder.selenium1.io.makeSuiteExportFunction(afs[i])});
    }
  }
  return fs;
};

/**
 * Allows user to parse a script in the default format.
 * @return A script, or null on failure.
 */
builder.selenium1.adapter.parseScript = function(text, path) {
  try {
    var format = builder.selenium1.adapter.formatCollection().findFormat('default');
    var testCase = new TestCase();
    format.getFormatter().parse(testCase, text);
    return builder.selenium1.adapter.convertTestCaseToScript(testCase, format, path);
  } catch (e) {
    return null;
  }
};

builder.selenium1.io.parseScript = builder.selenium1.adapter.parseScript;
builder.selenium1.io.parseSuite = builder.selenium1.adapter.parseSuite;
  
/**
 * Exports the given script using the default format.
 * @param script The script to export
 */
builder.selenium1.adapter.exportScript = function(script) {
  return builder.selenium1.adapter.exportScriptWithFormat(
    script,
    builder.selenium1.adapter.formatCollection().findFormat('default')
  );
};

builder.selenium1.adapter.getScriptDefaultRepresentation = function(script, name) {
  var format = builder.selenium1.adapter.formatCollection().findFormat('default');
  var testCase = builder.selenium1.adapter.convertScriptToTestCase(script);
  return format.getFormatter().format(testCase, name, '', true);
};

builder.selenium1.io.getScriptDefaultRepresentation = builder.selenium1.adapter.getScriptDefaultRepresentation;
builder.selenium1.io.defaultRepresentationExtension = ".html";

/**
 * Exports the given script using the given format.
 * @param script The script to export
 * @param format The format to use, chosen from availableFormats
 * @return A nsiLocalFile on success, or false on failure
 */
builder.selenium1.adapter.exportScriptWithFormat = function(script, format, extraOptions) {
  var formatter = format.getFormatter();
  try {
    var testCase = builder.selenium1.adapter.convertScriptToTestCase(script);
    if (format.saveAs(testCase)) {
      return testCase.file;
    } else {
      return false;
    }
  } catch (e) {
    alert(_t('sel1_couldnt_export_script', e));
    return false;
  }
};

/**
 * Exports the given script using the given format to the given path.
 * @param script The script to export
 * @param format The format to use, chosen from availableFormats
 * @param path The path to export to
 * @return A nsiLocalFile on success, or false on failure
 */
builder.selenium1.adapter.exportScriptWithFormatToPath = function(script, format, path, extraOptions) {
  try {
    var testCase = builder.selenium1.adapter.convertScriptToTestCase(script);
    if (format.saveAs(testCase, path, false)) {
      return testCase.file;
    } else {
      return false;
    }
  } catch (e) {
    alert(_t('sel1_couldnt_export_script', e));
    return false;
  }
};

builder.selenium1.adapter.formatCollection = function() {
  return new FormatCollection(SeleniumIDE.Preferences.DEFAULT_OPTIONS);
};

builder.selenium1.adapter.findBaseUrl = function(script) {
  for (var i = 0; i < script.steps.length; i++) {
    if (script.steps[i].type === builder.selenium1.stepTypes.open) {
      return new builder.Url(script.steps[i].url).server();
    }
  }
  return "http://localhost"; // qqDPS A bit of a desparation move.
};

builder.selenium1.adapter.convertScriptToTestCase = function(script) {
  var testCase = new TestCase();
  testCase.setBaseURL(builder.selenium1.adapter.findBaseUrl(script));
  for (var i = 0; i < script.steps.length; i++) {
    var step = script.steps[i];
    var pNames = step.type.getParamNames();
    var params = [];
    for (var j = 0; j < 2; j++) {
      if (pNames.length > j) {
        if (step.type.getParamType(pNames[j]) === "locator") {
          params.push(step[pNames[j]].getName(builder.selenium1) + "=" + step[pNames[j]].getValue());
        } else {
          params.push(step[pNames[j]] + "");
        }
      } else {
        params.push("");
      }
    }
    var name = step.type.getName();
    if (step.type.getNegatable() && step.negated) {
      name = step.type.negator(name);
    }
    if (name == "open" && params[0].startsWith(testCase.baseURL)) {
      params[0] = params[0].substring(testCase.baseURL.length);
      if (params[0] == "") { params[0] = "/"; }
    }
    testCase.commands.push(new Command(name, params[0], params[1]));
  }
  if (script.path && script.path.where === "local") {
    testCase.file = FileUtils.getFile(script.path.path);
  }
  return testCase;
};

builder.selenium1.adapter.convertTestCaseToScript = function(testCase, originalFormat, path) {
  if (!testCase) { return null; }
  var script = new builder.Script(builder.selenium1);
  script.path = {
    'where': path.where,
    'path': path.path,
    'format': originalFormat
  };
  var baseURL = testCase.baseURL;
  for (var i = 0; i < testCase.commands.length; i++) {
    var negated = false;
    if (!testCase.commands[i].command) { continue; } // Ignore comments
    var stepType = builder.selenium1.stepTypes[testCase.commands[i].command];
    if (!stepType) {
      stepType = builder.selenium1.negatedStepTypes[testCase.commands[i].command];
      negated = true;
    }
    if (!stepType) {
      alert("Unknown step type: " + testCase.commands[i].command);
      return null;
    }
    var params = [];
    var pNames = stepType.getParamNames();
    for (var j = 0; j < 2; j++) {
      if (j >= pNames.length) {
        params.push("");
      } else {
        var p = testCase.commands[i][["target", "value"][j]];
        if (stepType.getParamType(pNames[j]) === "locator") {
          var lType = "unknown";
          var lValue = "";
          if (p.indexOf("=") != -1) {
            lType = p.substring(0, p.indexOf("="));
            lValue = p.substring(p.indexOf("=") + 1);
          }
          var locMethod = builder.locator.methodForName(builder.selenium1, lType);
          if (!locMethod) {
            lValue = p;
            if (p.startsWith("//")) {
              locMethod = builder.locator.methodForName(builder.selenium1, "xpath");
            } else if (p.startsWith("document.")) {
              locMethod = builder.locator.methodForName(builder.selenium1, "dom");
            } else {
              locMethod = builder.locator.methodForName(builder.selenium1, "identifier");
            }
          }
          var locValues = {};
          locValues[locMethod] = [lValue];
          params.push(new builder.locator.Locator(locMethod, 0, locValues));
        } else {
          params.push(p);
        }
      }
    }
    try {
      // Internally we don't have base URLs, so we have to put them straight in here if the provided URL isn't already absolute.
      if (stepType == builder.selenium1.stepTypes.open) {
        if (params[0].match('^(http|https)://')) {
          // leave already absolute params[0] alone
        } else if (params[0].startsWith("/") && endsWith(baseURL, "/")) {
          params[0] = baseURL + params[0].substring(1);
        } else {
          params[0] = baseURL + params[0];
        }
      }
    } catch (e) { alert(e); }
    var step = new builder.Step(
      stepType,
      params[0],
      params[1]
    );
    step.negated = negated;
    script.steps.push(step);
  }
  return script;
};