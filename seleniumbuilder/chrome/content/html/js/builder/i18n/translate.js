builder.translate = {};

builder.translate.DEFAULT_LOC_NAME = "en";
builder.translate.locName = builder.translate.DEFAULT_LOC_NAME;
builder.translate.newLocName = builder.translate.DEFAULT_LOC_NAME;
builder.translate.locales = {};

builder.translate.getLocNamePref = function() {
  if (bridge.prefManager.prefHasUserValue("extensions.seleniumbuilder.translate.locName") &&
      bridge.prefManager.getCharPref("extensions.seleniumbuilder.translate.locName") !== "")
  {
    return bridge.prefManager.getCharPref("extensions.seleniumbuilder.translate.locName");
  } else {
    var localeService = Components.classes["@mozilla.org/intl/nslocaleservice;1"]
                                  .getService(Components.interfaces.nsILocaleService);
    var selectedLocale = localeService.getApplicationLocale();
    return selectedLocale.getCategory("NSILOCALE_COLLATE"); 
  }
};

builder.translate.setNewLocaleName = function(locName) {
  builder.translate.newLocName = locName;
  bridge.prefManager.setCharPref("extensions.seleniumbuilder.translate.locName", locName);
};

builder.translate.addLocale = function(l) {
  builder.translate.locales[l.name] = l;
};

builder.translate.getLocaleName = function() {
  return builder.translate.locName;
};

builder.translate.getEffectiveLocaleName = function() {
  if (!builder.translate.locales[builder.translate.locName]) {
    if (builder.translate.locName.indexOf('-') != -1) {
      if (builder.translate.locales[builder.translate.locName.split('-')[0]]) {
        return builder.translate.locName.split('-')[0];
      }
    }
    return builder.translate.DEFAULT_LOC_NAME;
  }
  return builder.translate.locName;
};

builder.translate.getNewLocaleName = function() {
  return builder.translate.newLocName;
};

builder.translate.getEffectiveNewLocaleName = function() {
  if (!builder.translate.locales[builder.translate.newLocName]) {
    if (builder.translate.newLocName.indexOf('-') != -1) {
      if (builder.translate.locales[builder.translate.newLocName.split('-')[0]]) {
        return builder.translate.newLocName.split('-')[0];
      }
    }
    return builder.translate.DEFAULT_LOC_NAME;
  }
  return builder.translate.newLocName;
};

builder.translate.setLocaleName = function(locName) {
  builder.translate.locName = locName;
};

builder.translate.getAvailableLocales = function() {
  var ls = [];
  for (var k in builder.translate.locales) {
    var v = builder.translate.locales[k];
    if (v.mapping) {
      ls.push(v);
    }
  }
  return ls;
};

function _t(str) {
  return _tl(str, builder.translate.locName, arguments);
}

function _tl(str, locName, args) {
  if (!builder.translate.locales[locName]) {
    if (locName.indexOf('-') != -1) {
      return _tl(str, locName.split('-')[0], args);
    } else {
      return _tl(str, builder.translate.DEFAULT_LOC_NAME, args);
    }
  }
  var s = builder.translate.locales[locName].mapping[str];
  if (!s) {
    if (locName == builder.translate.DEFAULT_LOC_NAME) {
      return "{" + str + "}";
    } else {
      if (locName.indexOf('-') != -1) {
        return _tl(str, locName.split('-')[0], args);
      } else {
        return _tl(str, builder.translate.DEFAULT_LOC_NAME, args);
      }
    }
  }
  for (var i = 1; i < args.length; i++) {
    var arg = args[i];
    if (arg && typeof arg == 'object') {
      for (var k in arg) {
        var v = arg[k];
        s = s.replace(new RegExp("\\{" + k + "\\}", "g"), "" + v);
      }
    } else {
      s = s.replace(new RegExp("\\{" + (i - 1) + "\\}", "g"), "" + arg);
    }
  }
  return s;
}

var locName = builder.translate.getLocNamePref();
builder.translate.locName = locName;
builder.translate.newLocName = locName;

builder.translate.translateStepName = function(stepName) {
  return builder.translate.translateStepNameTo(stepName, builder.translate.locName);
};

builder.translate.translateStepNameTo = function(stepName, locName) {
  if (!builder.translate.locales[locName]) {
    if (locName.indexOf('-') != -1) {
      return builder.translate.translateStepNameTo(stepName, locName.split('-')[0]);
    } else {
      return builder.translate.translateStepNameTo(stepName, builder.translate.DEFAULT_LOC_NAME);
    }
  }
  
  var s = builder.translate.locales[locName].mapping['step_' + stepName];
  if (!s) {
    if (locName == builder.translate.DEFAULT_LOC_NAME) {
      return stepName;
    } else {
      if (locName.indexOf('-') != -1) {
        return builder.translate.translateStepNameTo(stepName, locName.split('-')[0]);
      } else {
        return builder.translate.translateStepNameTo(stepName, builder.translate.DEFAULT_LOC_NAME);
      }
    }
  }
  return s;
};

builder.translate.translateParamName = function(paramName, stepName) {
  return builder.translate.translateParamNameTo(paramName, stepName, builder.translate.locName);
};

builder.translate.translateParamNameTo = function(paramName, stepName, locName) {
  if (!builder.translate.locales[locName]) {
    if (locName.indexOf('-') != -1) {
      return builder.translate.translateParamNameTo(paramName, stepName, locName.split('-')[0]);
    } else {
      return builder.translate.translateParamNameTo(paramName, stepName, builder.translate.DEFAULT_LOC_NAME);
    }
  }
  
  var s = builder.translate.locales[locName].mapping['p_' + stepName + '_' + paramName];
  
  if (!s) {
    s = builder.translate.locales[locName].mapping['p_' + paramName];
  }
  if (!s) {
    if (locName == builder.translate.DEFAULT_LOC_NAME) {
      return paramName;
    } else {
      if (locName.indexOf('-') != -1) {
        return builder.translate.translateParamNameTo(paramName, stepName, locName.split('-')[0]);
      } else {
        return builder.translate.translateParamNameTo(paramName, stepName, builder.translate.DEFAULT_LOC_NAME);
      }
    }
  }
  return s;
};

builder.translate.translateStepDoc = function(versionName, stepName, def) {
  return builder.translate.translateStepDocTo(versionName, stepName, def, builder.translate.locName);
};

builder.translate.translateStepDocTo = function(versionName, stepName, def, locName) {
  if (!builder.translate.locales[locName]) {
    if (locName.indexOf('-') != -1) {
      return builder.translate.translateStepDocTo(versionName, stepName, def, locName.split('-')[0]);
    } else {
      return builder.translate.translateStepDocTo(versionName, stepName, def, builder.translate.DEFAULT_LOC_NAME);
    }
  }
  
  var s = builder.translate.locales[locName].mapping[versionName + '_doc_' + stepName];
  
  if (!s) {
    if (locName == builder.translate.DEFAULT_LOC_NAME) {
      return def;
    } else {
      if (locName.indexOf('-') != -1) {
        return builder.translate.translateStepDocTo(versionName, stepName, def, locName.split('-')[0]);
      } else {
        return builder.translate.translateStepDocTo(versionName, stepName, def, builder.translate.DEFAULT_LOC_NAME);
      }
    }
  }
  
  return s;
};

builder.translate.translateParamDoc = function(versionName, stepName, paramName, def) {
  return builder.translate.translateParamDocTo(versionName, stepName, paramName, def, builder.translate.locName);
};

builder.translate.translateParamDocTo = function(versionName, stepName, paramName, def, locName) {
  if (!builder.translate.locales[locName]) {
    if (locName.indexOf('-') != -1) {
      return builder.translate.translateParamDocTo(versionName, stepName, paramName, def, locName.split('-')[0]);
    } else {
      return builder.translate.translateParamDocTo(versionName, stepName, paramName, def, builder.translate.DEFAULT_LOC_NAME);
    }
  }
  
  var s = builder.translate.locales[locName].mapping[versionName + '_doc_' + stepName + '_' + paramName];
  if (!s) {
    if (locName == builder.translate.DEFAULT_LOC_NAME) {
      return def;
    } else {
      if (locName.indexOf('-') != -1) {
        return builder.translate.translateParamDocTo(versionName, stepName, paramName, def, locName.split('-')[0]);
      } else {
        return builder.translate.translateParamDocTo(versionName, stepName, paramName, def, builder.translate.DEFAULT_LOC_NAME);
      }
    }
  }
  
  return s;
};


if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
