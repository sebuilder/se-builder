/** Playback system for remote webdriver. */
builder.selenium2.rcPlayback = {};

builder.selenium2.rcPlayback.getHostPort = function() {
  return bridge.prefManager.getCharPref("extensions.seleniumbuilder.remote.hostport");
};

builder.selenium2.rcPlayback.setHostPort = function(hostPort) {
  bridge.prefManager.setCharPref("extensions.seleniumbuilder.remote.hostport", hostPort);
};

builder.selenium2.rcPlayback.getBrowserString = function() {
  return bridge.prefManager.getCharPref("extensions.seleniumbuilder.remote.browserstring");
};

builder.selenium2.rcPlayback.setBrowserString = function(browserstring) {
  bridge.prefManager.setCharPref("extensions.seleniumbuilder.remote.browserstring", browserstring);
};

builder.selenium2.rcPlayback.getBrowserVersion = function() {
  return bridge.prefManager.getCharPref("extensions.seleniumbuilder.remote.browserversion");
};

builder.selenium2.rcPlayback.setBrowserVersion = function(browserversion) {
  bridge.prefManager.setCharPref("extensions.seleniumbuilder.remote.browserversion", browserversion);
};

builder.selenium2.rcPlayback.getPlatform = function() {
  return bridge.prefManager.getCharPref("extensions.seleniumbuilder.remote.platform");
};

builder.selenium2.rcPlayback.setPlatform = function(platform) {
  bridge.prefManager.setCharPref("extensions.seleniumbuilder.remote.platform", platform);
};

/** What interval to check waits for. */
builder.selenium2.rcPlayback.waitIntervalAmount = 100;
/** waitMs / waitCycleDivisor -> max wait cycles. */
builder.selenium2.rcPlayback.waitCycleDivisor = 500;

builder.selenium2.rcPlayback.runs = [];

builder.selenium2.rcPlayback.makeRun = function(settings, script, postRunCallback, jobStartedCallback, stepStateCallback, initialVars, pausedCallback, preserveRunSession) {
  var ivs = {};
  if (initialVars) {
    for (var k in initialVars) {
      ivs[k] = initialVars[k];
    }
  }
  return {
    hostPort: settings.hostPort,
    browserstring: settings.browserstring,
    sessionID: null,
    currentStepIndex: -1,
    currentStep: null,
    script: script,
    requestStop: false,
    playResult: { success: false },
    pausedOnBreakpoint: false,
    vars: ivs,
    /** How many wait cycles have been run. */
    waitCycle: 0,
    /** The wait timeout. */
    waitTimeout: null,
    /** The wait timeout function. Not using interval to prevent overlapping */
    waitFunction: null,
    /** The pause incrementor. */
    pauseCounter: 0,
    /** The pause interval. */
    pauseInterval: null,
    /** How many ms to wait for, implicitly or explicitly. */
    waitMs: script.timeoutSeconds * 1000,
    postRunCallback: postRunCallback || null,
    jobStartedCallback: jobStartedCallback || null,
    stepStateCallback: stepStateCallback || function() {},
    pausedCallback: pausedCallback || function() {},
    /** Whether to preserve the playback session at the end of the run rather than shutting it down. */
    preserveRunSession: preserveRunSession
  };
};

builder.selenium2.rcPlayback.getVars = function(r, callback) {
  callback(r.vars);
};

builder.selenium2.rcPlayback.setVar = function(r, k, v, callback) {
  if (v === null) {
    delete r.vars[k];
  } else {
    r.vars[k] = v;
  }
  if (callback) { callback(); }
};

builder.selenium2.rcPlayback.isRunning = function() {
  return builder.selenium2.rcPlayback.runs.length > 0;
};

builder.selenium2.rcPlayback.runReusing = function(r, postRunCallback, jobStartedCallback, stepStateCallback, initialVars, pausedCallback, preserveRunSession) {
  var settings = {hostPort:r.hostPort, browserstring:r.browserstring};
  var k;
  var r2 = builder.selenium2.rcPlayback.makeRun(settings, builder.getScript(), postRunCallback, jobStartedCallback, stepStateCallback, initialVars, pausedCallback, preserveRunSession);
  r2.vars = {};
  for (k in r.vars) {
    r2.vars[k] = r.vars[k];
  }
  if (initialVars) {
    for (k in initialVars) {
      r2.vars[k] = initialVars[k];
    }
  }
  r2.sessionID = r.sessionID;
  builder.selenium2.rcPlayback.runs.push(r2);
  r2.jobStartedCallback();
  r2.playResult.success = true;
  builder.selenium2.rcPlayback.playNextStep(r2);
  return r2;
};

/**
 * @param settings {hostPort:string, browserstring:string, browserversion:string, platform:string}
 * @param postRunCallback function({success:bool, errorMessage:string|null})
 * @param jobStartedCallback function(serverResponse:string)
 * @param stepStateCallback function(run:obj, script:Script, step:Step, stepIndex:int, state:builder.stepdisplay.state.*, message:string|null, error:string|null, percentProgress:int)
 */
builder.selenium2.rcPlayback.run = function(settings, postRunCallback, jobStartedCallback, stepStateCallback, initialVars, pausedCallback, preserveRunSession) {
  var r = builder.selenium2.rcPlayback.makeRun(settings, builder.getScript(), postRunCallback, jobStartedCallback, stepStateCallback, initialVars, pausedCallback, preserveRunSession);
  
  var hostPort = settings.hostPort;
  var browserstring = settings.browserstring;
  var browserversion = settings.browserversion;
  var platform = settings.platform;
  
  var name = _t('sel2_untitled_run');
  if (r.script.path) {
    name = r.script.path.path.split("/");
    name = name[name.length - 1];
    name = name.split(".")[0];
  }
  name = "Selenium Builder " + browserstring + " " + (browserversion ? browserversion + " " : "") + (platform ? platform + " " : "") + name;
  builder.selenium2.rcPlayback.runs.push(r);
  
  var caps = {
    "name": name,
    "browserName":browserstring||"firefox",
    "version":browserversion||"",
    "platform":platform||"ANY"
  };
  
  for (var key in settings) {
    if (!{hostPort:1, browserstring:1, browserversion: 1, platform: 1}[key]) {
      caps[key] = settings[key];
    }
  }
  
  builder.selenium2.rcPlayback.send(
    r,
    "POST",
    "",
    JSON.stringify({"desiredCapabilities":caps}),
    builder.selenium2.rcPlayback.startJob);
  return r;
};

/**
 * Selenium server appends a series of null characters to its JSON responses - here we cut 'em off.
 */
builder.selenium2.rcPlayback.fixServerResponse = function(t) {
  var i = 0;
  for (; i < t.length; i++) {
    if (t.charCodeAt(i) === 0) {
      break;
    }
  }
  
  return t.substring(0, i);
};

builder.selenium2.rcPlayback.parseServerResponse = function(t) {
  t = builder.selenium2.rcPlayback.fixServerResponse(t);
  if (t.length === 0) {
    return {};
  } else {
    // The response may be some JSON, or it may also be a HTML page.
    try {
      return JSON.parse(t);
    } catch (e) {
      return {'value': {'message': t}};
    }
  }
};

builder.selenium2.rcPlayback.startJob = function(r, response) {
  if (r.jobStartedCallback) {
    r.jobStartedCallback(response);
  }
  r.sessionID = response.sessionId;
  r.playResult.success = true;
  builder.selenium2.rcPlayback.send(r, "POST", "/timeouts/implicit_wait", JSON.stringify({'ms':r.waitMs}), function(r, response) {
    builder.selenium2.rcPlayback.playNextStep(r);
  });
};

builder.selenium2.rcPlayback.continueTests = function() {
  for (var i = 0; i < builder.selenium2.rcPlayback.runs.length; i++) {
    var r = builder.selenium2.rcPlayback.runs[i];
    if (r.pausedOnBreakpoint) {
      builder.selenium2.rcPlayback.continueRun(r);
    }
  }
};

builder.selenium2.rcPlayback.continueRun = function(r) {
  r.pausedOnBreakpoint = false;
  r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.RUNNING, null, null);
  try {
    builder.selenium2.rcPlayback.types[r.currentStep.type.getName()](r, r.currentStep);
  } catch (e) {
    builder.selenium2.rcPlayback.recordError(r, e);
  }
};

builder.selenium2.rcPlayback.playNextStep = function(r) {
  r.currentStepIndex++;
  if (!r.requestStop && r.currentStepIndex < r.script.steps.length) {
    r.currentStep = r.script.steps[r.currentStepIndex];
    if (builder.breakpointsEnabled && r.currentStep.breakpoint) {
      r.pausedOnBreakpoint = true;
      r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.BREAKPOINT, null, null);
      r.pausedCallback();
      return;
    }
    r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.RUNNING, null, null);
    try {
      builder.selenium2.rcPlayback.types[r.currentStep.type.getName()](r, r.currentStep);
    } catch (e) {
      builder.selenium2.rcPlayback.recordError(r, e);
    }
  } else {
    builder.selenium2.rcPlayback.shutdown(r);
  }
};

builder.selenium2.rcPlayback.shutdown = function(r) {
  jQuery('#edit-rc-connecting').hide();
  if (r.preserveRunSession) {
    builder.selenium2.rcPlayback.postShutdown(r);
  } else {
    // Finish session.
    builder.selenium2.rcPlayback.send(r, "DELETE", "", "", builder.selenium2.rcPlayback.postShutdown, builder.selenium2.rcPlayback.postShutdown);
  }
};

builder.selenium2.rcPlayback.postShutdown = function(r) {
  builder.selenium2.rcPlayback.runs = builder.selenium2.rcPlayback.runs.filter(function(r2) { return r2 != r; });
  if (r.postRunCallback) {
    r.postRunCallback(r.playResult);
  }
};

builder.selenium2.rcPlayback.getTestRuns = function() {
  return builder.selenium2.rcPlayback.runs;
};

builder.selenium2.rcPlayback.stopTest = function(r) {
  if (r.pausedOnBreakpoint) {
    builder.selenium2.rcPlayback.shutdown(r);
  } else {
    r.requestStop = true;
  }
};

builder.selenium2.rcPlayback.hasError = function(response) {
  return !!response.status; // So undefined and 0 are fine.
};

builder.selenium2.rcPlayback.handleError = function(r, response, errorThrown) {
  var err = _t('sel2_server_error');
  if (errorThrown) { err += ": " + errorThrown; }
  if (response.value && response.value.message) {
    err += ": " + response.value.message.substring(0, 256);
  }
  builder.selenium2.rcPlayback.recordError(r, err);
};

builder.selenium2.rcPlayback.recordError = function(r, err) {
  if (r.currentStepIndex === -1) {
    // If we can't connect to the server right at the start, just attach the error message to the
    // first step.
    r.currentStepIndex = 0;
  } else {
    if (r.currentStep.negated && r.currentStep.type.getName().startsWith("assert")) {
      // Record this as a failed result instead - this way it will be turned into a successful result
      // by recordResult.
      builder.selenium2.rcPlayback.recordResult(r, {success: false});
      return;
    } 
  }
  r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.ERROR, null, err);
  r.playResult.success = false;
  r.playResult.errormessage = err;
  
  builder.selenium2.rcPlayback.shutdown(r);
};

builder.selenium2.rcPlayback.send = function(r, http_method, path, msg, callback, errorCallback) {
  var url = null;
  if (r.sessionID) {
    url = "http://" + r.hostPort + "/wd/hub/session/" + r.sessionID + path;
  } else {
    url = "http://" + r.hostPort + "/wd/hub/session";
  }
  jQuery.ajax({
    // Because the server appends null characters to its output, we want to disable automatic
    // JSON parsing in jQuery.
    dataType: "html",
    // But because the server crashes if we don't accept application/json, we explicitly set it to.
    headers: { 
      "Accept" : "application/json, image/png",
      "Content-Type": "text/plain; charset=utf-8"
    },
    type: http_method || "POST",
    url: url,
    data: msg,
    success: function(t) {
      if (callback) {
        try {
          callback(r, builder.selenium2.rcPlayback.parseServerResponse(t));
        } catch (err) {
          builder.selenium2.rcPlayback.recordError(r, err);
        }
      } else {
        builder.selenium2.rcPlayback.recordResult(r, {'success': true});
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      var response = builder.selenium2.rcPlayback.parseServerResponse(xhr.responseText);
      if (errorCallback) {
        try {
          errorCallback(r, response);
        } catch (err) {
          builder.selenium2.rcPlayback.recordError(r, err);
        }
      } else {
        builder.selenium2.rcPlayback.handleError(r, response, errorThrown);
      }
    }
  });
};

/** Performs ${variable} substitution for parameters. */
builder.selenium2.rcPlayback.param = function(r, pName) {
  var output = "";
  var hasDollar = false;
  var insideVar = false;
  var varName = "";
  var text = r.currentStep.type.getParamType(pName) == "locator" ? r.currentStep[pName].getValue() : r.currentStep[pName];
  for (var i = 0; i < text.length; i++) {
    var ch = text.substring(i, i + 1);
    if (insideVar) {
      if (ch == "}") {
        if (r.vars[varName] === undefined) {
          throw "Variable not set: " + varName + ".";
        }
        output += r.vars[varName];
        insideVar = false;
        hasDollar = false;
        varName = "";
      } else {
        varName += ch;
      }
    } else {
      // !insideVar
      if (hasDollar) {
        if (ch == "{") { insideVar = true; } else { hasDollar = false; output += "$" + ch; }
      } else {
        if (ch == "$") { hasDollar = true; } else { output += ch; }
      }
    }
  }

  return r.currentStep.type.getParamType(pName) == "locator" ? {"using": r.currentStep[pName].getName(builder.selenium2), "value": output} : output;
};

builder.selenium2.rcPlayback.print = function(r, text) {
  r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.NO_CHANGE, text, null);
};

builder.selenium2.rcPlayback.recordResult = function(r, result) {
  if (r.currentStep.negated) {
    result.message = r.currentStep.type.getName() + " " + _t('sel2_is') + " " + result.success;
    result.success = !result.success;
  }
  if (result.success) {
    r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.SUCCEEDED, null, null);
  } else {
    r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.FAILED, null, null);
    r.playResult.success = false;
    if (result.message) {
      r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.NO_CHANGE, result.message, null);
      r.playResult.errormessage = result.message;
    }
  }

  builder.selenium2.rcPlayback.playNextStep(r);
};

builder.selenium2.rcPlayback.findElement = function(r, locator, callback, errorCallback) {
  builder.selenium2.rcPlayback.send(r, "POST", "/element", JSON.stringify(locator),
    function(r, response) {
      if (builder.selenium2.rcPlayback.hasError(r, response)) {
        if (errorCallback) {
          try {
            errorCallback(r, response);
          } catch (e) {
            builder.selenium2.rcPlayback.recordError(r, e);
          }
        } else {
          builder.selenium2.rcPlayback.handleError(r, response);
        }
      } else {
        if (callback) {
          try {
            callback(r, response.value.ELEMENT);
          } catch (e) {
            builder.selenium2.rcPlayback.recordError(r, e);
          }
        } else {
          builder.selenium2.rcPlayback.recordResult(r, {success: true});
        }
      }
    }
  );
};

builder.selenium2.rcPlayback.findElements = function(r, locator, callback, errorCallback) {
  builder.selenium2.rcPlayback.send(r, "POST", "/elements", JSON.stringify(locator),
    function(r, response) {
      if (builder.selenium2.rcPlayback.hasError(r, response)) {
        if (errorCallback) {
          try {
            errorCallback(r, response);
          } catch (e) {
            builder.selenium2.rcPlayback.recordError(r, e);
          }
        } else {
          builder.selenium2.rcPlayback.handleError(r, response);
        }
      } else {
        if (callback) {
          var elids = [];
          for (var i = 0; i < response.value.length; i++) {
            elids.push(response.value[i].ELEMENT);
          }
          callback(r, elids);
        } else {
          builder.selenium2.rcPlayback.recordResult(r, {success: true});
        }
      }
    }
  );
};

/** Repeatedly calls testFunction, allowing it to tell us if it was successful. */
builder.selenium2.rcPlayback.wait = function(r, testFunction) {
  r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.NO_CHANGE, null, null, 1);
  r.waitCycle = 0;
  // Using a timeout that keeps on re-installing itself rather than an interval to prevent
  // the case where the request takes longer than the timeout and requests overlap.
  r.waitFunction = function() {
    try {
      testFunction(r, function(r, success) {
        if (success != r.currentStep.negated) {
          r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.NO_CHANGE, null, null, 0);
          builder.selenium2.rcPlayback.recordResult(r, {'success': success});
          return;
        }
        if (r.waitCycle++ > r.waitMs / builder.selenium2.rcPlayback.waitCycleDivisor) {
          r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.NO_CHANGE, null, null, 0);
          builder.selenium2.rcPlayback.recordError(r, "Wait timed out.");
          return;
        }
        if (r.requestStop) {
          r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.NO_CHANGE, null, null, 0);
          builder.selenium2.rcPlayback.shutdown(r);
          return;
        }
        r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.NO_CHANGE, null, null, 1 + r.waitCycle * 99 * builder.selenium2.rcPlayback.waitCycleDivisor / r.waitMs);
        r.waitTimeout = window.setTimeout(
          r.waitFunction,
          builder.selenium2.rcPlayback.waitIntervalAmount
        );
      });
    } catch (e) {
      builder.selenium2.rcPlayback.recordError(r, e);
    }
  };
  r.waitTimeout = window.setTimeout(r.waitFunction, 1);
};

builder.selenium2.rcPlayback.types = {};

builder.selenium2.rcPlayback.types.pause = function(r, step) {
  r.pauseCounter = 0;
  var max = builder.selenium2.rcPlayback.param(r, "waitTime") / 100;
  r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.NO_CHANGE, null, null, 1);
  r.pauseInterval = setInterval(function() {
    if (r.requestStop) {
      window.clearInterval(r.pauseInterval);
      r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.NO_CHANGE, null, null, 0);
      builder.selenium2.rcPlayback.shutdown(r);
      return;
    }
    r.pauseCounter++;
    r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.NO_CHANGE, null, null, 1 + 99 * r.pauseCounter / max);
    if (r.pauseCounter >= max) {
      window.clearInterval(r.pauseInterval);
      r.stepStateCallback(r, r.script, r.currentStep, r.currentStepIndex, builder.stepdisplay.state.NO_CHANGE, null, null, 0);
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    }
  }, 100);
};

builder.selenium2.rcPlayback.types.print = function(r, step) {
  builder.selenium2.rcPlayback.print(r, builder.selenium2.rcPlayback.param(r, "text"));
  builder.selenium2.rcPlayback.recordResult(r, {success: true});
};

builder.selenium2.rcPlayback.types.store = function(r, step) {
  r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = builder.selenium2.rcPlayback.param(r, "text");
  builder.selenium2.rcPlayback.recordResult(r, {success: true});
};

builder.selenium2.rcPlayback.types.get = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/url", JSON.stringify({'url': builder.selenium2.rcPlayback.param(r, "url")}));
};

builder.selenium2.rcPlayback.types.goBack = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/back", "");
};

builder.selenium2.rcPlayback.types.goForward = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/forward", "");
};

builder.selenium2.rcPlayback.types.refresh = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/refresh", "");
};

builder.selenium2.rcPlayback.types.clickElement = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/click", "");
  });
};

builder.selenium2.rcPlayback.types.doubleClickElement = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/click", "", function(r, response) {
      builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/click", "");
    });
  });
};

builder.selenium2.rcPlayback.types.mouseOverElement = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "POST", "/moveto", JSON.stringify({
      'element': id
    }));
  });
};

builder.selenium2.rcPlayback.types.submitElement = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/submit", "");
  });
};

builder.selenium2.rcPlayback.types.setElementText = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/click", "", function(r, response) {
      builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/clear", "", function(r, response) {
        builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/value", JSON.stringify({
          'value': [builder.selenium2.rcPlayback.param(r, "text")]
        }));
      });
    });
  });
};

builder.selenium2.rcPlayback.types.sendKeysToElement = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/click", "", function(r, response) {
      builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/value", JSON.stringify({
        'value': [builder.selenium2.rcPlayback.param(r, "text")]
      }));
    });
  });
};

builder.selenium2.rcPlayback.types.setElementSelected = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/selected", "", function(r, response) {
      if (response.value) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/click", "");
      }
    });
  });
};

builder.selenium2.rcPlayback.types.setElementNotSelected = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/selected", "", function(r, response) {
      if (!response.value) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/click", "");
      }
    });
  });
};

builder.selenium2.rcPlayback.types.clearSelections = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "POST", "/element/" + id + "/elements", JSON.stringify({'using': 'tag name', 'value': 'option'}), function(r, response) {
      var ids = response.value;
      function deselect(r, i) {
        if (i >= ids.length) {
          builder.selenium2.rcPlayback.recordResult(r, {success: true});
        } else {
          builder.selenium2.rcPlayback.send(r, "GET", "/element/" + ids[i].ELEMENT + "/selected", "", function(r, response) {
            if (response.value) {
              builder.selenium2.rcPlayback.send(r, "POST", "/element/" + ids[i].ELEMENT + "/click", "", function(r, response) {
                deselect(r, i + 1);
              });
            } else {
              deselect(r, i + 1);
            }
          });
        }
      }
      deselect(r, 0);
    });
  });
};

builder.selenium2.rcPlayback.types.verifyTextPresent = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, {'using': 'tag name', 'value': 'body'}, function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
      if (response.value.indexOf(builder.selenium2.rcPlayback.param(r, "text")) != -1) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_text_not_present', builder.selenium2.rcPlayback.param(r, "text"))});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertTextPresent = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, {'using': 'tag name', 'value': 'body'}, function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
      if (response.value.indexOf(builder.selenium2.rcPlayback.param(r, "text")) != -1) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(r, _t('sel2_text_not_present', builder.selenium2.rcPlayback.param(r, "text")));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForTextPresent = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.findElement(r, {'using': 'tag name', 'value': 'body'}, function(r, id) {
      builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
        callback(r, response.value.indexOf(builder.selenium2.rcPlayback.param(r, "text")) != -1);
      }, /*error*/ function(r) { callback(r, false); });
    }, /*error*/ function(r) { callback(r, false); });
  });
};

builder.selenium2.rcPlayback.types.storeTextPresent = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, {'using': 'tag name', 'value': 'body'}, function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
      r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value.indexOf(builder.selenium2.rcPlayback.param(r, "text")) != -1;
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.verifyBodyText = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, {'using': 'tag name', 'value': 'body'}, function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
      if (response.value == builder.selenium2.rcPlayback.param(r, "text")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_body_text_does_not_match', builder.selenium2.rcPlayback.param(r, "text"))});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertBodyText = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, {'using': 'tag name', 'value': 'body'}, function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
      if (response.value == builder.selenium2.rcPlayback.param(r, "text")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(r, _t('sel2_body_text_does_not_match', builder.selenium2.rcPlayback.param(r, "text")));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForBodyText = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.findElement(r, {'using': 'tag name', 'value': 'body'}, function(r, id) {
      builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
        callback(r, response.value == builder.selenium2.rcPlayback.param(r, "text"));
      }, /*error*/ function(r) { callback(r, false); });
    }, /*error*/ function(r) { callback(r, false); });
  });
};

builder.selenium2.rcPlayback.types.storeBodyText = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, {'using': 'tag name', 'value': 'body'}, function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
      r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value;
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.verifyElementPresent = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  }, function(r) {
    builder.selenium2.rcPlayback.recordResult(r, {success: false});
  });
};

builder.selenium2.rcPlayback.types.assertElementPresent = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  }, function(r) {
    builder.selenium2.rcPlayback.recordError(r, _t('sel2_element_not_found'));
  });
};

builder.selenium2.rcPlayback.types.waitForElementPresent = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
      callback(r, true);
    }, function(r) {
      callback(r, false);
    });
  });
};

builder.selenium2.rcPlayback.types.storeElementPresent = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = true;
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  }, function(r) {
    r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = false;
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyPageSource = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/source", "", function(r, response) {
    if (response.value == builder.selenium2.rcPlayback.param(r, "source")) {
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    } else {
      builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_source_does_not_match')});
    }
  });
};

builder.selenium2.rcPlayback.types.assertPageSource = function(r, step) {
  builder.selenium2.rcPlayback.send("GET", "/source", "", function(r, response) {
    if (response.value == builder.selenium2.rcPlayback.param(r, "source")) {
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    } else {
      builder.selenium2.rcPlayback.recordError(r, _t('sel2_source_does_not_match'));
    }
  });
};

builder.selenium2.rcPlayback.types.waitForPageSource = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.send(r, "GET", "/source", "", function(r, response) {
      callback(r, response.value == builder.selenium2.rcPlayback.param(r, "source"));
    });
  });
};

builder.selenium2.rcPlayback.types.storePageSource = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/source", "", function(r, response) {
    r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value;
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyText = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
      if (response.value == builder.selenium2.rcPlayback.param(r, "text")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_element_text_does_not_match', response.value, builder.selenium2.rcPlayback.param(r, "text"))});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertText = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
      if (response.value == builder.selenium2.rcPlayback.param(r, "text")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(r, _t('sel2_element_text_does_not_match', response.value, builder.selenium2.rcPlayback.param(r, "text")));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForText = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
      builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
        callback(r, response.value == builder.selenium2.rcPlayback.param(r, "text"));
      }, /*error*/ function(r) { callback(r, false); });
    }, /*error*/ function(r) { callback(r, false); });
  });
};

builder.selenium2.rcPlayback.types.storeText = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/text", "", function(r, response) {
      r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value;
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.verifyCurrentUrl = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/url", "", function(r, response) {
    if (response.value == builder.selenium2.rcPlayback.param(r, "url")) {
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    } else {
      builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_url_does_not_match', response.value, builder.selenium2.rcPlayback.param("url"))});
    }
  });
};

builder.selenium2.rcPlayback.types.assertCurrentUrl = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/url", "", function(r, response) {
    if (response.value == builder.selenium2.rcPlayback.param(r, "url")) {
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    } else {
      builder.selenium2.rcPlayback.recordError(r, _t('sel2_url_does_not_match', response.value, builder.selenium2.rcPlayback.param("url")));
    }
  });
};

builder.selenium2.rcPlayback.types.waitForCurrentUrl = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.send(r, "GET", "/url", "", function(r, response) {
      callback(r, response.value == builder.selenium2.rcPlayback.param(r, "url"));
    });
  });
};

builder.selenium2.rcPlayback.types.storeCurrentUrl = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/url", "", function(r, response) {
    r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value;
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyTitle = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/title", "", function(r, response) {
    if (response.value == builder.selenium2.rcPlayback.param(r, "title")) {
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    } else {
      builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_title_does_not_match', response.value, builder.selenium2.rcPlayback.param(r, "title"))});
    }
  });
};

builder.selenium2.rcPlayback.types.assertTitle = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/title", "", function(r, response) {
    if (response.value == builder.selenium2.rcPlayback.param(r, "title")) {
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    } else {
      builder.selenium2.rcPlayback.recordError(r, _t('sel2_title_does_not_match', response.value, builder.selenium2.rcPlayback.param("title")));
    }
  });
};

builder.selenium2.rcPlayback.types.waitForTitle = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.send(r, "GET", "/title", "", function(r, response) {
      callback(r, response.value == builder.selenium2.rcPlayback.param(r, "title"));
    });
  });
};

builder.selenium2.rcPlayback.types.storeTitle = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/title", "", function(r, response) {
    r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value;
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyElementSelected = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/selected", "", function(r, response) {
      if (response.value) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_element_not_selected')});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertElementSelected = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/selected", "", function(r, response) {
      if (response.value) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(r, _t('sel2_element_not_selected'));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForElementSelected = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
      builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/selected", "", function(r, response) {
        callback(r, response.value);
      }, /*error*/ function(r) { callback(r, false); });
    }, /*error*/ function(r) { callback(r, false); });
  });
};

builder.selenium2.rcPlayback.types.storeElementSelected = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/selected", "", function(r, response) {
      r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value;
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.verifyElementValue = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/attribute/value", "", function(r, response) {
      if (response.value == builder.selenium2.rcPlayback.param(r, "value")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_element_value_doesnt_match', response.value, builder.selenium2.rcPlayback.param(r, "value"))});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertElementValue = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/attribute/value", "", function(r, response) {
      if (response.value == builder.selenium2.rcPlayback.param(r, "value")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(r, _t('sel2_element_value_doesnt_match', response.value, builder.selenium2.rcPlayback.param(r, "value")));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForElementValue = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
      builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/attribute/value", "", function(r, response) {
        callback(r, response.value == builder.selenium2.rcPlayback.param(r, "value"));
      }, /*error*/ function(r) { callback(r, false); });
    }, /*error*/ function(r) { callback(r, false); });
  });
};

builder.selenium2.rcPlayback.types.storeElementValue = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/attribute/value", "", function(r, response) {
      r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value;
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.verifyElementAttribute = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/attribute/" + builder.selenium2.rcPlayback.param(r, "attributeName"), "", function(r, response) {
      if (response.value == builder.selenium2.rcPlayback.param(r, "value")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_attribute_value_doesnt_match', builder.selenium2.rcPlayback.param(r, "attributeName"), response.value, builder.selenium2.rcPlayback.param(r, "value"))});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertElementAttribute = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/attribute/" + builder.selenium2.rcPlayback.param(r, "attributeName"), "", function(r, response) {
      if (response.value == builder.selenium2.rcPlayback.param(r, "value")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(r, _t('sel2_attribute_value_doesnt_match', builder.selenium2.rcPlayback.param(r, "attributeName"), response.value, builder.selenium2.rcPlayback.param(r, "value")));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForElementAttribute = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
      builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/attribute/" + builder.selenium2.rcPlayback.param(r, "attributeName"), "", function(r, response) {
        callback(r, response.value == builder.selenium2.rcPlayback.param(r, "value"));
      }, /*error*/ function(r) { callback(r, false); });
    }, /*error*/ function(r) { callback(r, false); });
  });
};

builder.selenium2.rcPlayback.types.storeElementAttribute = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/attribute/" + builder.selenium2.rcPlayback.param(r, "attributeName"), "", function(r, response) {
      r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value;
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.verifyElementStyle = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/css/" + builder.selenium2.rcPlayback.param(r, "propertyName"), "", function(r, response) {
      if (response.value == builder.selenium2.rcPlayback.param(r, "value")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_css_value_doesnt_match', builder.selenium2.rcPlayback.param(r, "propertyName"), response.value, builder.selenium2.rcPlayback.param(r, "value"))});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertElementStyle = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/css/" + builder.selenium2.rcPlayback.param(r, "propertyName"), "", function(r, response) {
      if (response.value == builder.selenium2.rcPlayback.param(r, "value")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(r, _t('sel2_css_value_doesnt_match', builder.selenium2.rcPlayback.param(r, "propertyName"), response.value, builder.selenium2.rcPlayback.param(r, "value")));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForElementStyle = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
      builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/css/" + builder.selenium2.rcPlayback.param(r, "propertyName"), "", function(r, response) {
        callback(r, response.value == builder.selenium2.rcPlayback.param(r, "value"));
      }, /*error*/ function(r) { callback(r, false); });
    }, /*error*/ function(r) { callback(r, false); });
  });
};

builder.selenium2.rcPlayback.types.storeElementStyle = function(r, step) {
  builder.selenium2.rcPlayback.findElement(r, builder.selenium2.rcPlayback.param(r, "locator"), function(r, id) {
    builder.selenium2.rcPlayback.send(r, "GET", "/element/" + id + "/css/" + builder.selenium2.rcPlayback.param(r, "propertyName"), "", function(r, response) {
      r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value;
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.deleteCookie = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "DELETE", "/cookie/" + builder.selenium2.rcPlayback.param(r, "name"), "");
};

builder.selenium2.rcPlayback.types.addCookie = function(r, step) {
  var cookie = {
    'name': builder.selenium2.rcPlayback.param(r, "name"),
    'value': builder.selenium2.rcPlayback.param(r, "value"),
    'secure': false,
    'path': '/',
    'class': 'org.openqa.selenium.Cookie'
  };
  var opts = builder.selenium2.rcPlayback.param(r, "options").split(",");
  for (var i = 0; i < opts.length; i++) {
    var kv = opts[i].trim().split("=");
    if (kv.length == 1) { continue; }
    if (kv[0] == "path") {
      cookie.path = kv[1];
    }
    if (kv[0] == "max_age") {
      cookie.expiry = (new Date().getTime()) / 1000 + parseInt(kv[1]);
    }
  }
  builder.selenium2.rcPlayback.send(r, "POST", "/cookie", JSON.stringify({'cookie': cookie}));
};

builder.selenium2.rcPlayback.types.verifyCookieByName = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/cookie", "", function(r, response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param(r, "name")) {
        if (response.value[i].value == builder.selenium2.rcPlayback.param(r, "value")) {
          builder.selenium2.rcPlayback.recordResult(r, {success: true});
        } else {
          builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_cookie_value_doesnt_match', builder.selenium2.rcPlayback.param(r, "name"), response.value[i].value, builder.selenium2.rcPlayback.param(r, "value"))});
        }
        return;
      }
    }
    builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_no_cookie_found', builder.selenium2.rcPlayback.param(r, "name"))});
  });
};

builder.selenium2.rcPlayback.types.assertCookieByName = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/cookie", "", function(r, response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param(r, "name")) {
        if (response.value[i].value == builder.selenium2.rcPlayback.param(r, "value")) {
          builder.selenium2.rcPlayback.recordResult(r, {success: true});
        } else {
          builder.selenium2.rcPlayback.recordError(r, _t('sel2_cookie_value_doesnt_match', builder.selenium2.rcPlayback.param(r, "name"), response.value[i].value, builder.selenium2.rcPlayback.param(r, "value")));
        }
        return;
      }
    }
    builder.selenium2.rcPlayback.recordError(r, _t('sel2_no_cookie_found', builder.selenium2.rcPlayback.param(r, "name")));
  });
};

builder.selenium2.rcPlayback.types.waitForCookieByName = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.send(r, "GET", "/cookie", "", function(r, response) {
      for (var i = 0; i < response.value.length; i++) {
        if (response.value[i].name == builder.selenium2.rcPlayback.param(r, "name")) {
          callback(r, response.value[i].value == builder.selenium2.rcPlayback.param(r, "value"));
          return;
        }
      }
      callback(r, false);
    }, function(r) {
      callback(r, false);
    });
  });
};

builder.selenium2.rcPlayback.types.storeCookieByName = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/cookie", "", function(r, response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param(r, "name")) {
        r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value[i].value;
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
        return;
      }
    }
    builder.selenium2.rcPlayback.recordError(r, _t('sel2_no_cookie_found', builder.selenium2.rcPlayback.param(r, "name")));
  });
};

builder.selenium2.rcPlayback.types.verifyCookiePresent = function(r, step) {
  builder.selenium2.rcPlayback.send("r, GET", "/cookie", "", function(r, response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param(r, "name")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
        return;
      }
    }
    builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_no_cookie_found', builder.selenium2.rcPlayback.param(r, "name"))});
  });
};

builder.selenium2.rcPlayback.types.assertCookiePresent = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/cookie", "", function(r, response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param(r, "name")) {
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
        return;
      }
    }
    builder.selenium2.rcPlayback.recordError(r, _t('sel2_no_cookie_found', builder.selenium2.rcPlayback.param(r, "name")));
  });
};

builder.selenium2.rcPlayback.types.waitForCookiePresent = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.send(r, "GET", "/cookie", "", function(r, response) {
      for (var i = 0; i < response.value.length; i++) {
        if (response.value[i].name == builder.selenium2.rcPlayback.param(r, "name")) {
          callback(r, true);
          return;
        }
      }
      callback(r, false);
    }, function(r) {
      callback(r, false);
    });
  });
};

builder.selenium2.rcPlayback.types.storeCookiePresent = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/cookie", "", function(r, response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param(r, "name")) {
        r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = true;
        builder.selenium2.rcPlayback.recordResult(r, {success: true});
        return;
      }
    }
    r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = false;
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};

builder.selenium2.rcPlayback.types.saveScreenshot = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/screenshot", "", function(r, response) {
    bridge.writeBinaryFile(builder.selenium2.rcPlayback.param(r, "file"), bridge.decodeBase64(response.value));
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};

builder.selenium2.rcPlayback.types.switchToFrame = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/frame", JSON.stringify({'id': builder.selenium2.rcPlayback.param(r, "identifier")}));
};

builder.selenium2.rcPlayback.types.switchToFrameByIndex = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/frame", JSON.stringify({'id': parseInt(builder.selenium2.rcPlayback.param(r, "index"))}));
};

builder.selenium2.rcPlayback.types.switchToWindow = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/window", JSON.stringify({'name': builder.selenium2.rcPlayback.param(r, "name")}));
};

builder.selenium2.rcPlayback.types.switchToWindowByIndex = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/window", JSON.stringify({'id': parseInt(builder.selenium2.rcPlayback.param(r, "index"))}));
};

builder.selenium2.rcPlayback.types.switchToDefaultContent = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/frame", JSON.stringify({'id': null}));
};

builder.selenium2.rcPlayback.types.verifyAlertText = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/alert_text", "", function(r, response) {
    if (response.value == builder.selenium2.rcPlayback.param(r, "text")) {
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    } else {
      builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_alert_text_does_not_match')});
    }
  });
};

builder.selenium2.rcPlayback.types.assertAlertText = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/alert_text", "", function(r, response) {
    if (response.value == builder.selenium2.rcPlayback.param(r, "text")) {
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    } else {
      builder.selenium2.rcPlayback.recordError(r, _t('sel2_alert_text_does_not_match', response.value, builder.selenium2.rcPlayback.param(r, "text")));
    }
  });
};

builder.selenium2.rcPlayback.types.waitForAlertText = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.send(r, "GET", "/alert_text", "", function(r, response) {
      callback(r, response.value == builder.selenium2.rcPlayback.param(r, "text"));
    });
  });
};

builder.selenium2.rcPlayback.types.storeAlertText = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/alert_text", "", function(r, response) {
    r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value;
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyAlertPresent = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/alert_text", "", function(r, response) {
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  }, function(r) {
    builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_no_alert_present')});
  });
};

builder.selenium2.rcPlayback.types.assertAlertPresent = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/alert_text", "", function(r, response) {
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};

builder.selenium2.rcPlayback.types.waitForAlertPresent = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.send(r, "GET", "/alert_text", "", function(r, response) {
      callback(r, true);
    }, function(r) {
      callback(r, false);
    });
  });
};

builder.selenium2.rcPlayback.types.storeAlertPresent = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "GET", "/alert_text", "", function(r, response) {
    r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = true;
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  }, function(r) {
    r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = false;
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};

builder.selenium2.rcPlayback.types.answerAlert = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/alert_text", JSON.stringify({'text': builder.selenium2.rcPlayback.param(r, "text")}), function(r, response) {
    builder.selenium2.rcPlayback.send(r, "POST", "/accept_alert", "", function(r, response) {
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.acceptAlert = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/accept_alert", "", function(r, response) {
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};

builder.selenium2.rcPlayback.types.dismissAlert = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/dismiss_alert", "", function(r, response) {
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyEval = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/execute", JSON.stringify({'script': builder.selenium2.rcPlayback.param(r, "script"), 'args': []}), function(r, response) {
    if (response.value == builder.selenium2.rcPlayback.param(r, "value")) {
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    } else {
      builder.selenium2.rcPlayback.recordResult(r, {success: false, message: _t('sel2_eval_false', result.value, builder.selenium2.rcPlayback.param(r, "value"))});
    }
  });
};

builder.selenium2.rcPlayback.types.assertEval = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/execute", JSON.stringify({'script': builder.selenium2.rcPlayback.param(r, "script"), 'args': []}), function(r, response) {
    if (response.value == builder.selenium2.rcPlayback.param(r, "value")) {
      builder.selenium2.rcPlayback.recordResult(r, {success: true});
    } else {
      builder.selenium2.rcPlayback.recordError(r, _t('sel2_eval_false', response.value, builder.selenium2.rcPlayback.param(r, "value")));
    }
  });
};

builder.selenium2.rcPlayback.types.waitForEval = function(r, step) {
  builder.selenium2.rcPlayback.wait(r, function(r, callback) {
    builder.selenium2.rcPlayback.send(r, "POST", "/execute", JSON.stringify({'script': builder.selenium2.rcPlayback.param(r, "script"), 'args': []}), function(r, response) {
      callback(r, response.value == builder.selenium2.rcPlayback.param(r, "value"));
    }, function(r) {
      callback(r, false);
    });
  });
};

builder.selenium2.rcPlayback.types.storeEval = function(r, step) {
  builder.selenium2.rcPlayback.send(r, "POST", "/execute", JSON.stringify({'script': builder.selenium2.rcPlayback.param(r, "script"), 'args': []}), function(r, response) {
    r.vars[builder.selenium2.rcPlayback.param(r, "variable")] = response.value;
    builder.selenium2.rcPlayback.recordResult(r, {success: true});
  });
};




if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
