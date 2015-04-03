builder.selenium2.io = {};

/**
 * Code for exporting/importing Selenium 2 scripts in a variety of formats.
*/
builder.selenium2.io.parseScript = function(text, path) {
  var scriptJSON = JSON.parse(text);
  var script = new builder.Script(builder.selenium2);
  script.path = {
    'where': path.where,
    'path': path.path,
    'format': builder.selenium2.io.formats[0]
  };
  
  var known_unknowns = [];
  var ko_string = "";
  var i = 0;
  for (i = 0; i < scriptJSON.steps.length; i++) {
    var typeName = scriptJSON.steps[i].type;
    if (!builder.selenium2.stepTypes[typeName] && known_unknowns.indexOf(typeName) == -1) {
      if (known_unknowns.length > 0) {
        ko_string += ", ";
      }
      ko_string += typeName;
      known_unknowns.push(typeName);
    }
  }
  if (known_unknowns.length > 0) {
    throw new Error(_t("sel1_no_command_found") + ": " + ko_string);
  }
  
  for (i = 0; i < scriptJSON.steps.length; i++) {
    script.steps.push(builder.stepFromJSON(scriptJSON.steps[i], builder.selenium2));
  }
  
  script.timeoutSeconds = scriptJSON.timeoutSeconds || 60;
  if (scriptJSON.data) {
    script.data = scriptJSON.data;
  }
  if (scriptJSON.inputs) {
    script.inputs = scriptJSON.inputs;
  }
  
  return script;
};

builder.selenium2.io.jsonToLoc = function(jsonO) {
  var method = builder.locator.methodForName(builder.selenium2, jsonO.type);
  var values = {};
  values[method] = ["" + jsonO.value];
  return new builder.locator.Locator(method, 0, values);
};

builder.selenium2.io.loadScriptJSON = function(path) {
  var file = null;
  if (path === null) {
    file = bridge.showFilePicker(window, _t('select_a_file'), 
                          Components.interfaces.nsIFilePicker.modeOpen,
                          bridge.Format.TEST_CASE_DIRECTORY_PREF,
                          function(fp) { return fp.file; });
  } else {
    file = bridge.SeFileUtils.getFile(path);
  }
  var sis = bridge.SeFileUtils.openFileInputStream(file);
  var script = JSON.parse(bridge.SeFileUtils.getUnicodeConverter('UTF-8').ConvertToUnicode(sis.read(sis.available())));
  sis.close();
  script.path = {
    where: "local",
    path: file.path
  };
  return script;
};

builder.selenium2.io.getScriptDefaultRepresentation = function(script, name, params) {
  return builder.selenium2.io.formats[0].format(script, name, params || {});
};

builder.selenium2.io.defaultRepresentationExtension = ".json";

builder.selenium2.io.saveScript = function(script, format, path, callback) {
  if (format.get_params) {
    format.get_params(script, function(params) {
      callback(builder.selenium2.io.saveScriptWithParams(script, format, path, params));
    });
  } else {
    callback(builder.selenium2.io.saveScriptWithParams(script, format, path, {}));
  }
};

builder.selenium2.io.saveScriptWithParams = function(script, format, path, params) {
  try {
    var file = null;
    if (path === null) {
      file = bridge.showFilePicker(window, _t('save_as'),
                            Components.interfaces.nsIFilePicker.modeSave,
                            bridge.Format.TEST_CASE_DIRECTORY_PREF,
                            function(fp) { return fp.file; },
                            format.extension);
    } else {
      file = bridge.SeFileUtils.getFile(path);
    }
    if (file !== null) {
      var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance( Components.interfaces.nsIFileOutputStream);
      outputStream.init(file, 0x02 | 0x08 | 0x20, 0644, 0);
      var converter = bridge.SeFileUtils.getUnicodeConverter('UTF-8');
      var text = converter.ConvertFromUnicode(format.format(script, file.leafName, params));
      outputStream.write(text, text.length);
      var fin = converter.Finish();
      if (fin.length > 0) {
        outputStream.write(fin, fin.length);
      }
      outputStream.close();
      path = {
        where: "local",
        path: file.path,
        format: format
      };
      if (builder.selenium2.io.isSaveFormat(format)) {
        script.path = path;
      } else {
        script.exportpath = path;
      }
      return true;
    } else {
      return false;
    }
  } catch (err) {
    alert("" + err);
    return false;
  }
};

builder.selenium2.io.formats = [];

builder.selenium2.io.isSaveFormat = function(format) {
  return format && format == builder.selenium2.io.formats[0];
};

builder.selenium2.io.makeDoSubs = function(script, step, name, userParams, used_vars, lang_info) {
  var doSubs = function(line, extras) {
	var k, j;
    if (extras) {
      for (k in extras) {
        var v = doSubs(extras[k]);
        line = line.replace(new RegExp("\\{" + k + "\\}", "g"), v);
      }
    }
    line = line.replace(new RegExp("\\{stepTypeName\\}", "g"), step.type.name);
    for (k in userParams) {
      line = line.replace(new RegExp("\\{" + k + "\\}", "g"), userParams[k]);
    }
    var pNames = step.getParamNames();
    for (j = 0; j < pNames.length; j++) {
      if (step.type.getParamType(pNames[j]) == "locator") {
        line = line.replace(new RegExp("\\{" + pNames[j] + "\\}", "g"), lang_info.escapeValue(step.type, step[pNames[j]].getValue(), pNames[j]));
        line = line.replace(new RegExp("\\{" + pNames[j] + "By\\}", "g"), lang_info.locatorByForType(step.type, step[pNames[j]].getName(builder.selenium2), j + 1));
      } else {
        line = line.replace(new RegExp("\\{" + pNames[j] + "\\}", "g"), lang_info.escapeValue(step.type, step[pNames[j]], pNames[j]));
      }
    }
    // Depending on whether the step is negated, put in the appropriate logical nots.
    if (step.negated) {
      line = line.replace(new RegExp("\\{posNot\\}", "g"), "");
      line = line.replace(new RegExp("\\{negNot\\}", "g"), lang_info.not);
    } else {
      line = line.replace(new RegExp("\\{posNot\\}", "g"), lang_info.not);
      line = line.replace(new RegExp("\\{negNot\\}", "g"), "");
    }
    // Finally, sub in any lang_info keys required.
    for (k in lang_info) {
      line = line.replace(new RegExp("\\{" + k + "\\}", "g"), lang_info[k]);
    }
    // Replace ${foo} with the necessary invocation of the variable, eg "String foo" or "var foo".
    var l2 = "";
    var hasDollar = false;
    var insideVar = false;
    var varName = "";
    for (j = 0; j < line.length; j++) {
      var ch = line.substring(j, j + 1);
      if (insideVar) {
        if (ch == "}") {
          var spl = varName.split(":", 2);
          var varType = spl.length == 2 ? spl[1] : null;
          varName = spl[0];
          if (used_vars[varName]) {
            l2 += lang_info.usedVar(varName, varType);
          } else {
            l2 += lang_info.unusedVar(varName, varType);
            used_vars[varName] = true;
          }
          insideVar = false;
          hasDollar = false;
          varName = "";
        } else {
          varName += ch;
        }
      } else {
        // !insideVar
        if (hasDollar) {
          if (ch == "{") { insideVar = true; } else { hasDollar = false; l2 += "$" + ch; }
        } else {
          if (ch == "$") { hasDollar = true; } else { l2 += ch; }
        }
      }
    }
    
    return l2;
  };
  
  return doSubs;
};

builder.selenium2.io.lang_infos = {};

builder.selenium2.io.addLangFormatter = function(lang_info) {
  builder.selenium2.io.lang_infos[lang_info.name] = lang_info;
  builder.selenium2.io.formats.push(builder.selenium2.io.createLangFormatter(lang_info));
};

builder.selenium2.io.addDerivedLangFormatter = function(original_name, lang_info_diff) {
  var k;
  var original = builder.selenium2.io.lang_infos[original_name];
  if (original) {
    var new_info = {};
    for (k in original) {
      new_info[k] = original[k];
    }
    for (k in lang_info_diff) {
      new_info[k] = lang_info_diff[k];
    }
    builder.selenium2.io.addLangFormatter(new_info);
  }
};

builder.selenium2.io.canExport = function(lang_info, stepType) {
  var lft = lang_info.lineForType[stepType.name];
  if (lft !== undefined) { return true; }
  if (!lang_info.getters || !lang_info.boolean_getters) { return false; }
  var booleanVersion = false;
  for (var b = 0; b < 2; b++) {
    var stepFlavors = ["assert", "verify", "waitFor", "store"];
    for (var f = 0; f < stepFlavors.length; f++) {
      var flavor_key = (booleanVersion ? "boolean_" : "") + stepFlavors[f];
      if (stepType.name.startsWith(stepFlavors[f]) && lang_info[flavor_key] !== undefined) {
        var getter_name = stepType.name.substring(stepFlavors[f].length);
        var getter = booleanVersion ? lang_info.boolean_getters[getter_name] : lang_info.getters[getter_name];
        if (getter !== undefined) { return true; }
      }
    }
    booleanVersion = true;
  }
  return false;
};

builder.selenium2.io.createLangFormatter = function(lang_info) {
  return {
    name: lang_info.name,
    extension: lang_info.extension,
    get_params: lang_info.get_params || null,
    format: function(script, name, userParams) {
      var t = "";
      var k;
      var start = lang_info.start;
      for (k in lang_info) {
        start = start.replace(new RegExp("\\{" + k + "\\}", "g"), lang_info[k]);
      }
      for (k in userParams) {
        start = start.replace(new RegExp("\\{" + k + "\\}", "g"), userParams[k]);
      }
      start = start.replace(/\{scriptName\}/g, name.substr(0, name.indexOf(".")));
      start = start.replace(/\{timeoutSeconds\}/g, "" + script.timeoutSeconds);
      t += start;
      var used_vars = {};
      stepsLoop: for (var i = 0; i < script.steps.length; i++) {
        var step = script.steps[i];
        var doSubs = builder.selenium2.io.makeDoSubs(script, step, name, userParams, used_vars, lang_info);
        var line = lang_info.lineForType[step.type.name];
        if (typeof line != 'undefined') {
          if (line instanceof Function) {
            t += line(step, lang_info.escapeValue, userParams, doSubs);
          } else {
            t += doSubs(line);
          }
        } else {
          var booleanVersion = false;
          for (var b = 0; b < 2; b++) {
            var stepFlavors = ["assert", "verify", "waitFor", "store"];
            for (var f = 0; f < stepFlavors.length; f++) {
              var flavor_key = (booleanVersion ? "boolean_" : "") + stepFlavors[f];
              if (step.type.name.startsWith(stepFlavors[f]) && lang_info[flavor_key] !== undefined) {
                var flavor = lang_info[flavor_key];
                var getter_name = step.type.name.substring(stepFlavors[f].length);
                var getter = booleanVersion ? lang_info.boolean_getters[getter_name] : lang_info.getters[getter_name];
                if (getter !== undefined) {
                  if (flavor instanceof Function) {
                    t += flavor(step, lang_info.escapeValue, doSubs, getter);
                  } else {
                    t += doSubs(flavor, getter);
                  }
                  continue stepsLoop;
                }
              }
            }
            booleanVersion = true;
          }
          throw(_t('sel2_cant_export_step_type', step.type.name));
        }
      }
      var end = lang_info.end;
      for (k in lang_info) {
        end = end.replace(new RegExp("\\{" + k + "\\}", "g"), lang_info[k]);
      }
      for (k in userParams) {
        end = end.replace(new RegExp("\\{" + k + "\\}", "g"), userParams[k]);
      }
      end = end.replace(/\{scriptName\}/g, name.substr(0, name.indexOf(".")));
      t += end;
      return t;
    },
    canExport: function(stepType) {
      return builder.selenium2.io.canExport(lang_info, stepType);
    },
    nonExportables: function(script) {
      var nes = [];
      for (var i = 0; i < script.steps.length; i++) {
        var step = script.steps[i];
        if (nes.indexOf(step.type.name) == -1 && !builder.selenium2.io.canExport(lang_info, step.type)) {
          nes.push(step.type.name);
        }
      }
      return nes;
    }
  };
};

builder.selenium2.io.suiteFormats = [];

builder.selenium2.io.getSuiteExportFormatsFor = function(format) {
  var formats = [];
  for (var i = 0; i < builder.selenium2.io.suiteFormats.length; i++) {
    var f = builder.selenium2.io.suiteFormats[i];
    if (f.scriptFormatName == format.name) {
      formats.push(f);
    }
  }
  return formats;
};

builder.selenium2.io.getSuiteExportFormats = function(path) {
  var fs = [];
  if (path) {
    fs.push(makeSuiteExportEntry("Save to " + path.path, path.format, path));
  }
  for (var i = 0; i < builder.selenium2.io.suiteFormats.length; i++) {
    fs.push(makeSuiteExportEntry(builder.selenium2.io.suiteFormats[i].name, builder.selenium2.io.suiteFormats[i], null));
  }
  return fs;
};

function makeSuiteExportEntry(name, format, path) {
  return {
    "name": name,
    "save": function(scripts) {
      return builder.selenium2.io.saveSuite(format, scripts, path);
    }
  };
}

builder.selenium2.io.saveSuite = function(scripts, path) {
  return builder.selenium2.io.saveSuiteAsFormat(builder.selenium2.io.suiteFormats[0], scripts, path);
};

builder.selenium2.io.exportSuite = function(scripts, format) {
  return builder.selenium2.io.saveSuiteAsFormat(format, scripts, null);
};

builder.selenium2.io.saveSuiteAsFormat = function(format, scripts, path) {
  try {
    var file = null;
    if (path === null) {
      file = bridge.showFilePicker(window, _t('save_as'),
                            Components.interfaces.nsIFilePicker.modeSave,
                            bridge.Format.TEST_CASE_DIRECTORY_PREF,
                            function(fp) { return fp.file; },
                            format.extension);
    } else {
      file = bridge.SeFileUtils.getFile(path.path);
    }
    if (file !== null) {
      var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance( Components.interfaces.nsIFileOutputStream);
      outputStream.init(file, 0x02 | 0x08 | 0x20, 0644, 0);
      var converter = bridge.SeFileUtils.getUnicodeConverter('UTF-8');
      path = { 'path': file.path, 'where': 'local', 'format': format };
      var text = converter.ConvertFromUnicode(format.format(scripts, path));
      outputStream.write(text, text.length);
      var fin = converter.Finish();
      if (fin.length > 0) {
        outputStream.write(fin, fin.length);
      }
      outputStream.close();
      return path;
    } else {
      return false;
    }
  } catch (err) {
    alert("" + err);
    return false;
  }
};

builder.selenium2.io.parseSuite = function(text, path, callback) {
  var suite = null;
  try {
    suite = JSON.parse(text);
  } catch (e) {
    callback(null, _t('could_not_open_suite'));
    return;
  }
  if (!suite.type || suite.type !== "suite" || !suite.scripts || suite.scripts.length === 0) {
    callback(null, _t('could_not_open_suite'));
    return;
  }
  var si = {
    'scripts': [],
    'path': {'path': path.path, 'where': path.where, 'format': builder.selenium2.io.suiteFormats[0] },
    'shareState': !!suite.shareState
  };
  function loadScript(i) {
    builder.io.loadPath(suite.scripts[i], path, function(loaded) {
      if (loaded) {
        si.scripts.push(builder.selenium2.io.parseScript(loaded.text, loaded.path));
      }
      if (i == suite.scripts.length - 1) {
        callback(si);
      } else {
        loadScript(i + 1);
      }
    });
  }
  loadScript(0);
};

builder.selenium2.io.getSaveFormat = function() {
  return builder.selenium2.io.formats[0];
};

builder.selenium2.io.getSaveSuiteFormat = function() {
  return builder.selenium2.io.suiteFormats[0];
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
