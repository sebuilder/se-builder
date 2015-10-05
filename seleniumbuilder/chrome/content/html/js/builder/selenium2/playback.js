/**
 * Code for playing back Selenium 2 scripts locally.
*/

builder.selenium2.playback = {};

/** The WebDriver session ID. */
builder.selenium2.playback.sessionId = null;
/** The CommandProcessor used to talk to WebDriver with. */
builder.selenium2.playback.commandProcessor = null;
/** The script being played back. */
builder.selenium2.playback.script = null;
/** The step being played back. */
builder.selenium2.playback.currentStep = null;
/** The step after which playback should pause. */
builder.selenium2.playback.finalStep = null;
/** The function to call with a result object after the run has concluded one way or another. */
builder.selenium2.playback.postPlayCallback = null;
/** The result object returned at the end of the run. */
builder.selenium2.playback.playResult = null;
/** Whether the user has requested test stoppage. */
builder.selenium2.playback.stopRequest = false;
/** What interval to check waits for. */
builder.selenium2.playback.waitIntervalAmount = 300;
/** How many wait cycles have been run. */
builder.selenium2.playback.waitCycle = 0;
/** The wait interval. */
builder.selenium2.playback.waitInterval = null;
/** Stored variables. */
builder.selenium2.playback.vars = {};
/** What interval to check implicit waits for. */
builder.selenium2.playback.implicitWaitTimeoutAmount = 300;
/** How many implicit wait cycles have been run. */
builder.selenium2.playback.implicitWaitCycle = 0;
/** The implicit wait timeout. */
builder.selenium2.playback.implicitWaitTimeout = null;
/** The session start timeout. */
builder.selenium2.playback.sessionStartTimeout = null;
/** The bypass decrement. */
builder.selenium2.playback.byPassCounter = 0;
/** The pause incrementor. */
builder.selenium2.playback.pauseCounter = 0;
/** The pause interval. */
builder.selenium2.playback.pauseInterval = null;
/** The current execute callback, to reroute mis-routed messages to. */
builder.selenium2.playback.exeCallback = null;
/** The number of the newest execute callback, to prevent misrouting. */
builder.selenium2.playback.callbackCount = 1;
/** The original value of prompts.tab_modal.enabled. */
builder.selenium2.playback.prompts_tab_modal_enabled = true;
/** Whether playback is currently paused on a breakpoint. */
builder.selenium2.playback.pausedOnBreakpoint = false;

/** How many wait cycles are run before waits time out. */
builder.selenium2.playback.maxWaitCycles = function() {
  return builder.selenium2.playback.script.timeoutSeconds * 1000 / builder.selenium2.playback.waitIntervalAmount;
};

/** How many implicit wait cycles are run before waits time out. */
builder.selenium2.playback.maxImplicitWaitCycles = function() {
  return builder.selenium2.playback.script.timeoutSeconds * 1000 / builder.selenium2.playback.implicitWaitTimeoutAmount;
}

builder.selenium2.playback.currentStepIndex = function() {
  return builder.selenium2.playback.script.getStepIndexForID(builder.selenium2.playback.currentStep.id);
};

builder.selenium2.playback.stopTest = function() {
  if (builder.selenium2.playback.isRunning()) {
    builder.selenium2.playback.stopRequest = true;
  } else {
    builder.selenium2.playback.shutdown();
  }
};

builder.selenium2.playback.runTest = function(postPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback, initialVars) {
  if (!builder.doShareSuiteState()) {
    if (builder.getScript().steps[0].type == builder.selenium2.stepTypes.get) {
      builder.deleteURLCookies(builder.getScript().steps[0].url);
    }
    builder.selenium2.playback.vars = {};
  }
  if (initialVars) {
    for (var k in initialVars) {
      builder.selenium2.playback.vars[k] = initialVars[k];
    }
  }
  builder.selenium2.playback.runTestBetween(
    builder.getScript().steps[0].id,
    builder.getScript().steps[builder.getScript().steps.length - 1].id,
    postPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback
  );
};

builder.selenium2.playback.continueTestBetween = function(startStepID, endStepID, postPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback) {
  if (builder.selenium2.playback.hasPlaybackSession()) {
    builder.selenium2.playback.pausedOnBreakpoint = false;
    if (endStepID) {
      builder.selenium2.playback.finalStep = builder.selenium2.playback.script.getStepWithID(endStepID);
    } else {
      builder.selenium2.playback.finalStep = builder.selenium2.playback.script.steps[builder.selenium2.playback.script.steps.length - 1];
    }
    if (startStepID) {
      builder.selenium2.playback.currentStep = builder.selenium2.playback.script.getStepWithID(startStepID);
    }
    builder.selenium2.playback.playStep();
  } else {
    builder.selenium2.playback.runTestBetween(startStepID, endStepID, postPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback);
  }
}

builder.selenium2.playback.runTestBetween = function(startStepID, endStepID, postPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback) {
  if (builder.selenium2.playback.hasPlaybackSession()) { return; }
  builder.selenium2.playback.pausedOnBreakpoint = false;
  builder.selenium2.playback.script = builder.getScript();
  
  builder.selenium2.playback.postPlayCallback   = postPlayCallback   || function() {};
  builder.selenium2.playback.jobStartedCallback = jobStartedCallback || function() {};
  builder.selenium2.playback.stepStateCallback  = stepStateCallback  || function() {};
  builder.selenium2.playback.runPausedCallback  = runPausedCallback  || function() {};
    
  builder.selenium2.playback.currentStep = builder.selenium2.playback.script.getStepWithID(startStepID);
  if (!builder.selenium2.playback.currentStep) {
    builder.selenium2.playback.currentStep = builder.selenium2.playback.script.steps[0];
  }
  /*if (builder.selenium2.playback.currentStep == builder.selenium2.playback.script.steps[0]) {
    builder.selenium2.playback.vars = {};
  }*/ // qqDPS
  builder.selenium2.playback.finalStep = builder.selenium2.playback.script.getStepWithID(endStepID);
  if (!builder.selenium2.playback.finalStep) {
    builder.selenium2.playback.finalStep = builder.selenium2.playback.script.steps[builder.selenium2.playback.script.steps.length - 1];
  }
  builder.selenium2.playback.playResult = {success: true};
  builder.selenium2.playback.startSession();
};

builder.selenium2.playback.startSession = function(sessionStartedCallback) {
  try {
    // To be able to manipulate dialogs, they must be of the original global style, not of the new
    // tab-level style. Hence, we store the correct pref and then force them to be old-style.
    builder.selenium2.playback.prompts_tab_modal_enabled = bridge.prefManager.getBoolPref("prompts.tab_modal.enabled");
    bridge.prefManager.setBoolPref("prompts.tab_modal.enabled", false);
  } catch (e) { /* old version? */ }
  
  builder.selenium2.playback.stopRequest = false;
  
  // Set up Webdriver
  var handle = Components.classes["@googlecode.com/webdriver/fxdriver;1"].createInstance(Components.interfaces.nsISupports);
  var server = handle.wrappedJSObject;
  var driver = server.newDriver(window.bridge.getRecordingWindow());
  var iface = Components.classes['@googlecode.com/webdriver/command-processor;1'];
  builder.selenium2.playback.commandProcessor = iface.getService(Components.interfaces.nsICommandProcessor);
  // In order to communicate to webdriver which window we want, we need to uniquely identify the
  // window. The best way to do this I've found is to look for it by title. qqDPS This means that
  // the code in the command processor is modified from its baseline to notice the title_identifier
  // parameter and find the correct window.
  var title_identifier = "--" + new Date().getTime();
  var original_title = window.bridge.getRecordingWindow().document.title;
  window.bridge.getRecordingWindow().document.title += title_identifier;
  builder.selenium2.playback.sessionId = null;

  builder.selenium2.playback.sessionStartTimeout = function() {
    var newSessionCommand = {
      'name': 'newSession',
      'context': '',
      'parameters': {
        'title_identifier': title_identifier,
        'original_title': original_title
      }
    };
    var hasExecuted;
    builder.selenium2.playback.commandProcessor.execute(JSON.stringify(newSessionCommand), function(result) {
      if (hasExecuted) {
        if (builder.selenium2.playback.exeCallback) {
          builder.selenium2.playback.exeCallback(result);
        }
        return;
      }
      hasExecuted = true;
      if (builder.selenium2.playback.stopRequest) {
        builder.selenium2.playback.shutdown();
        return;
      }
      if (JSON.parse(result).value === "NOT FOUND") {
        // It might be we're still loading the recording window's page, and the title has changed.
        window.bridge.getRecordingWindow().document.title += title_identifier;
        window.setTimeout(builder.selenium2.playback.sessionStartTimeout, 1000);
        return;
      }
      // Restore the title if needed.
      if (window.bridge.getRecordingWindow().document.title.indexOf(title_identifier) != -1) {
        window.bridge.getRecordingWindow().document.title = original_title;
      }
      builder.selenium2.playback.sessionId = JSON.parse(result).value;
      builder.selenium2.playback.jobStartedCallback();
      if (sessionStartedCallback) {
        sessionStartedCallback();
      } else {
        builder.selenium2.playback.playStep();
      }
    });
  };
  
  window.setTimeout(builder.selenium2.playback.sessionStartTimeout, 100);
};

/** Repeatedly calls testFunction, allowing it to tell us if it was successful. */
builder.selenium2.playback.wait = function(testFunction) {
  builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.NO_CHANGE, null, null, 1);
  builder.selenium2.playback.waitCycle = 0;
  builder.selenium2.playback.waitInterval = window.setInterval(function() {
    testFunction(function(success) {
      if (success != builder.selenium2.playback.currentStep.negated) {
        window.clearInterval(builder.selenium2.playback.waitInterval);
        builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.NO_CHANGE, null, null, 0);
        builder.selenium2.playback.recordResult({'success': success});
        return;
      }
      if (builder.selenium2.playback.waitCycle++ >= builder.selenium2.playback.maxWaitCycles()) {
        window.clearInterval(builder.selenium2.playback.waitInterval);
        builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.NO_CHANGE, null, null, 0);
        builder.selenium2.playback.recordError("Wait timed out.");
        return;
      }
      if (builder.selenium2.playback.stopRequest) {
        window.clearInterval(builder.selenium2.playback.waitInterval);
        builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.NO_CHANGE, null, null, 0);
        builder.selenium2.playback.shutdown();
        return;
      }
      builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.NO_CHANGE, null, null, 1 + builder.selenium2.playback.waitCycle * 99 / builder.selenium2.playback.maxWaitCycles());
    });
  }, builder.selenium2.playback.waitIntervalAmount);
};

builder.selenium2.playback.findElement = function(locator, callback, errorCallback) {
  builder.selenium2.playback.implicitWaitCycle = 0;
  builder.selenium2.playback.continueFindingElement(locator, callback, errorCallback);
};

// This implements implicit waits by repeatedly calling itself to set a new timeout.
builder.selenium2.playback.continueFindingElement = function(locator, callback, errorCallback, iter) {
  iter = iter ? iter : 0;
  builder.selenium2.playback.implicitWaitTimeout = window.setTimeout(function() {
    if (builder.selenium2.playback.stopRequest) {
      builder.selenium2.playback.shutdown();
      return;
    }
    builder.selenium2.playback.execute('findElement', {using: locator.type, value: locator.value},
      /* callback */
      callback,
      /* errorCallback */
      function(e) {
        if (builder.selenium2.playback.implicitWaitCycle++ >= builder.selenium2.playback.maxImplicitWaitCycles()) {
          if (errorCallback) {
            errorCallback(e);
          } else {
            builder.selenium2.playback.recordError(e.value.message);
          }
        } else {
          builder.selenium2.playback.continueFindingElement(locator, callback, errorCallback, iter + 1);
        }
      }
    );
  }, builder.selenium2.playback.implicitWaitCycle == 0 ? 1 : builder.selenium2.playback.implicitWaitTimeoutAmount);
};

builder.selenium2.playback.execute = function(name, parameters, callback, errorCallback) {
  var cmd = {
    'name': name,
    'context': '',
    'parameters': parameters,
    'sessionId': {"value": builder.selenium2.playback.sessionId}
  };
  builder.selenium2.playback.callbackCount++;
  var cb_id = builder.selenium2.playback.callbackCount;
  builder.selenium2.playback.exeCallback = function(result) {
    if (builder.selenium2.playback.callbackCount != cb_id) {
      return;
    }
    result = JSON.parse(result);
    if (result.status != 0) {
      if (errorCallback) {
        errorCallback(result);
      } else {
        builder.selenium2.playback.recordError(result.value.message || result.value);
      }
    } else {
      if (callback) {
        callback(result);
      } else {
        builder.selenium2.playback.recordResult({success: true});
      }
    }
  };
  builder.selenium2.playback.commandProcessor.execute(JSON.stringify(cmd), builder.selenium2.playback.exeCallback);
};

builder.selenium2.playback.deselectElement = function(target, callback) {
  builder.selenium2.playback.execute('isElementSelected', {id: target}, function(result) {
    if (result.value) {
      builder.selenium2.playback.execute('clickElement', {id: target}, callback);
    } else {
      if (callback) {
        callback(result);
      } else {
        builder.selenium2.playback.recordResult({success: true});
      }
    }
  });
};

/** Performs ${variable} substitution for parameters. */
builder.selenium2.playback.param = function(pName) {
  var output = "";
  var hasDollar = false;
  var insideVar = false;
  var varName = "";
  var text = builder.selenium2.playback.currentStep.type.getParamType(pName) == "locator" ? builder.selenium2.playback.currentStep[pName].getValue() : builder.selenium2.playback.currentStep[pName];
  for (var i = 0; i < text.length; i++) {
    var ch = text.substring(i, i + 1);
    if (insideVar) {
      if (ch == "}") {
        if (builder.selenium2.playback.vars[varName] == undefined) {
          throw _t('sel2_variable_not_set', varName);
        }
        output += builder.selenium2.playback.vars[varName];
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

  return builder.selenium2.playback.currentStep.type.getParamType(pName) == "locator" ? {"type": builder.selenium2.playback.currentStep[pName].getName(builder.selenium2), "value": output} : output;
};

builder.selenium2.playback.canPlayback = function(stepType) {
  return !!builder.selenium2.playback.playbackFunctions[stepType.getName()];
};

function str(v) {
  return "" + v;
}

builder.selenium2.playback.playbackFunctions = {
  "print": function() {
    builder.selenium2.playback.print(builder.selenium2.playback.param("text"));
    builder.selenium2.playback.recordResult({success: true});
  },
  "pause": function() {
    builder.selenium2.playback.pauseCounter = 0;
    var max = builder.selenium2.playback.param("waitTime") / 100;
    builder.stepdisplay.showProgressBar(builder.selenium2.playback.currentStep.id);
    builder.selenium2.playback.pauseInterval = setInterval(function() {
      if (builder.selenium2.playback.stopRequest) {
        window.clearInterval(builder.selenium2.playback.pauseInterval);
        builder.stepdisplay.hideProgressBar(builder.selenium2.playback.currentStep.id);
        builder.selenium2.playback.shutdown();
        return;
      }
      builder.selenium2.playback.pauseCounter++;
      builder.stepdisplay.setProgressBar(builder.selenium2.playback.currentStep.id, 100 * builder.selenium2.playback.pauseCounter / max);
      if (builder.selenium2.playback.pauseCounter >= max) {
        window.clearInterval(builder.selenium2.playback.pauseInterval);
        builder.stepdisplay.hideProgressBar(builder.selenium2.playback.currentStep.id);
        builder.selenium2.playback.recordResult({success: true});
      }
    }, 100);
  },
  "store": function() {
    builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = builder.selenium2.playback.param("text");
    builder.selenium2.playback.recordResult({success: true});
  },
  "get": function() {
    builder.selenium2.playback.execute('get', {url: builder.selenium2.playback.param("url")});
  },
  "goBack": function() {
    builder.selenium2.playback.execute('goBack', {});
  },
  "goForward": function() {
    builder.selenium2.playback.execute('goForward', {});
  },
  "clickElement": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('clickElement', {id: result.value.ELEMENT});
    });
  },
  "doubleClickElement": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('clickElement', {id: result.value.ELEMENT}, function() {
        builder.selenium2.playback.execute('clickElement', {id: result.value.ELEMENT});
      });
    });
  },
  "mouseOverElement": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('mouseMove', {element: result.value.ELEMENT});
    });
  },
  "submitElement": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('submitElement', {id: result.value.ELEMENT});
    });
  },
  "setElementText": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('clickElement', {id: result.value.ELEMENT},
        function() {
          builder.selenium2.playback.execute('clearElement', {id: result.value.ELEMENT},
            function() {
              builder.selenium2.playback.execute('sendKeysToElement', {id: result.value.ELEMENT, value: builder.selenium2.playback.param("text").split("")});
            }
          );
        }
      );
    });
  },
  "sendKeysToElement": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('clickElement', {id: result.value.ELEMENT},
        function() {
          builder.selenium2.playback.execute('sendKeysToElement', {id: result.value.ELEMENT, value: builder.selenium2.playback.param("text").split("")});
        }
      );
    });
  },
  "setElementSelected": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      var target = result.value.ELEMENT;
      builder.selenium2.playback.execute('isElementSelected', {id: target}, function(result) {
        if (!result.value) {
          builder.selenium2.playback.execute('clickElement', {id: target});
        } else {
          builder.selenium2.playback.recordResult({success: true});
        }
      });
    });
  },
  "setElementNotSelected": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      var target = result.value.ELEMENT;
      builder.selenium2.playback.execute('isElementSelected', {id: target}, function(result) {
        if (result.value) {
          builder.selenium2.playback.execute('clickElement', {id: target});
        } else {
          builder.selenium2.playback.recordResult({success: true});
        }
      });
    });
  },
  "clearSelections": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      var target = result.value.ELEMENT;
      builder.selenium2.playback.execute('findChildElements', {id: target, using: "tag name", value: "option"}, function(result) {
        var deselectables = result.value;
        function deselect(i) {
          if (i >= deselectables.length) {
            builder.selenium2.playback.recordResult({success: true});
          } else {
            builder.selenium2.playback.deselectElement(deselectables[i].ELEMENT, function() { deselect(i + 1); });
          }
        }
        deselect(0);
      });
    });
  },
  "refresh": function() {
    builder.selenium2.playback.execute('refresh', {});
  },
  "setWindowSize": function() {
    window.bridge.getRecordingWindow().resizeTo(builder.selenium2.playback.param("width"), builder.selenium2.playback.param("height"));
    builder.selenium2.playback.recordResult({success: true});
  },
  
  "verifyTextPresent": function() {
    builder.selenium2.playback.findElement({type: 'tag name', value: 'body'}, function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        if (result.value.indexOf(builder.selenium2.playback.param("text")) != -1) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_text_not_present', builder.selenium2.playback.param("text"))});
        }
      });
    });
  },
  "assertTextPresent": function() {
    builder.selenium2.playback.findElement({type: 'tag name', value: 'body'}, function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        if (result.value.indexOf(builder.selenium2.playback.param("text")) != -1) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordError(_t('sel2_text_not_present', builder.selenium2.playback.param("text")));
        }
      });
    });
  },
  "waitForTextPresent": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.findElement({type: 'tag name', value: 'body'}, function(result) {
        builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
          callback(result.value.indexOf(builder.selenium2.playback.param("text")) != -1);
        }, /*error*/ function() { callback(false); });
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassTextPresent": function() {
    builder.selenium2.playback.findElement({type: 'tag name', value: 'body'}, function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        if (result.value.indexOf(builder.selenium2.playback.param("text")) != -1) {
          builder.selenium2.playback.recordResult({success: true});
        }/* else {
          builder.selenium2.playback.recordError(_t('sel2_text_not_present', builder.selenium2.playback.param("text")));
        }*/
      });
    });
  },
  "storeTextPresent": function() {
    builder.selenium2.playback.findElement({type: 'tag name', value: 'body'}, function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value.indexOf(builder.selenium2.playback.param("text")) != -1;
        builder.selenium2.playback.recordResult({success: true});
      });
    });
  },

  "verifyBodyText": function() {
    builder.selenium2.playback.findElement({type: 'tag name', value: 'body'}, function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        if (result.value == builder.selenium2.playback.param("text")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_body_text_does_not_match', builder.selenium2.playback.param("text"))});
        }
      });
    });
  },
  "assertBodyText": function() {
    builder.selenium2.playback.findElement({type: 'tag name', value: 'body'}, function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        if (result.value == builder.selenium2.playback.param("text")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordError(_t('sel2_body_text_does_not_match', builder.selenium2.playback.param("text")));
        }
      });
    });
  },
  "waitForBodyText": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.findElement({type: 'tag name', value: 'body'}, function(result) {
        builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
          callback(result.value == builder.selenium2.playback.param("text"));
        }, /*error*/ function() { callback(false); });
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassBodyText": function() {
    builder.selenium2.playback.findElement({type: 'tag name', value: 'body'}, function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        if (result.value == builder.selenium2.playback.param("text")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_body_text_does_not_match', builder.selenium2.playback.param("text"))});
        }
      });
    });
  },
  "storeBodyText": function() {
    builder.selenium2.playback.findElement({type: 'tag name', value: 'body'}, function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value;
        builder.selenium2.playback.recordResult({success: true});
      });
    });
  },

  "verifyElementPresent": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), null, function(result) {
      builder.selenium2.playback.recordResult({success: false, message: _t('sel2_element_not_found')});
    });
  },
  "assertElementPresent": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), null, function(result) {
      builder.selenium2.playback.recordError(_t('sel2_element_not_found'));
    });
  },
  "waitForElementPresent": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"),
        /*success*/ function(result) { callback(true);  },
        /*error  */ function(result) { callback(false); }
      );
    });
  },
  "bypassElementPresent": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), null, function(result) {
      builder.selenium2.playback.recordResult({success: false, message: _t('sel2_element_not_found')});
    });
  },
  "storeElementPresent": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"),
    /*success*/
    function(result) {
      builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = true;
      builder.selenium2.playback.recordResult({success: true});
    },
    /*failure*/
    function(result) {
      builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = false;
      builder.selenium2.playback.recordResult({success: true});
    });
  },

  "verifyPageSource": function() {
    builder.selenium2.playback.execute('getPageSource', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("source")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordResult({success: false, message: _t('sel2_source_does_not_match')});
      }
    });
  },
  "assertPageSource": function() {
    builder.selenium2.playback.execute('getPageSource', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("source")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordError(_t('sel2_source_does_not_match'));
      }
    });
  },
  "waitForPageSource": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.execute('getPageSource', {}, function(result) {
        callback(result.value == builder.selenium2.playback.param("source"));
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassyPageSource": function() {
    builder.selenium2.playback.execute('getPageSource', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("source")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordResult({success: false, message: _t('sel2_source_does_not_match')});
      }
    });
  },
  "storePageSource": function() {
    builder.selenium2.playback.execute('getPageSource', {}, function(result) {
      builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value;
      builder.selenium2.playback.recordResult({success: true});
    });
  },

  "verifyText": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        if (result.value == builder.selenium2.playback.param("text")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_element_text_does_not_match', result.value, builder.selenium2.playback.param("text"))});
        }
      });
    });
  },
  "assertText": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        if (result.value == builder.selenium2.playback.param("text")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordError(_t('sel2_element_text_does_not_match', result.value, builder.selenium2.playback.param("text")));
        }
      });
    });
  },
  "waitForText": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
        builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
          callback(result.value == builder.selenium2.playback.param("text"));
        }, /*error*/ function() { callback(false); });
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassText": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        if (result.value == builder.selenium2.playback.param("text")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_element_text_does_not_match', result.value, builder.selenium2.playback.param("text"))});
        }
      });
    });
  },
  "storeText": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementText', {id: result.value.ELEMENT}, function(result) {
        builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value;
        builder.selenium2.playback.recordResult({success: true});
      });
    });
  },

  "verifyCurrentUrl": function() {
    builder.selenium2.playback.execute('getCurrentUrl', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("url")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordResult({success: false, message: _t('sel2_url_does_not_match', result.value, builder.selenium2.playback.param("url"))});
      }
    });
  },
  "assertCurrentUrl": function() {
    builder.selenium2.playback.execute('getCurrentUrl', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("url")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordError(_t('sel2_url_does_not_match', result.value, builder.selenium2.playback.param("url")));
      }
    });
  },
  "waitForCurrentUrl": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.execute('getCurrentUrl', {}, function(result) {
        callback(result.value == builder.selenium2.playback.param("url"));
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassCurrentUrl": function() {
    builder.selenium2.playback.execute('getCurrentUrl', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("url")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordResult({success: false, message: _t('sel2_url_does_not_match', result.value, builder.selenium2.playback.param("url"))});
      }
    });
  },
  "storeCurrentUrl": function() {
    builder.selenium2.playback.execute('getCurrentUrl', {}, function(result) {
      builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value;
      builder.selenium2.playback.recordResult({success: true});
    });
  },

  "verifyTitle": function() {
    builder.selenium2.playback.execute('getTitle', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("title")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordResult({success: false, message: _t('sel2_title_does_not_match', result.value, builder.selenium2.playback.param("title"))});
      }
    });
  },
  "assertTitle": function() {
    builder.selenium2.playback.execute('getTitle', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("title")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordError(_t('sel2_title_does_not_match', result.value, builder.selenium2.playback.param("title")));
      }
    });
  },
  "waitForTitle": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.execute('getTitle', {}, function(result) {
        callback(result.value == builder.selenium2.playback.param("title"));
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassTitle": function() {
    builder.selenium2.playback.execute('getTitle', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("title")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
	builder.selenium2.playback.recordResult({success: false, message: _t('sel2_title_does_not_match', result.value, builder.selenium2.playback.param("title"))});
      }
    });
  },
  "storeTitle": function() {
    builder.selenium2.playback.execute('getTitle', {}, function(result) {
      builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value;
      builder.selenium2.playback.recordResult({success: true});
    });
  },

  "verifyElementSelected": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('isElementSelected', {id: result.value.ELEMENT}, function(result) {
        if (result.value) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_element_not_selected')});
        }
      });
    });
  },
  "assertElementSelected": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('isElementSelected', {id: result.value.ELEMENT}, function(result) {
        if (result.value) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordError(_t('sel2_element_not_selected'));
        }
      });
    });
  },
  "waitForElementSelected": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
        builder.selenium2.playback.execute('isElementSelected', {id: result.value.ELEMENT}, function(result) {
          callback(result.value);
        }, /*error*/ function() { callback(false); });
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassElementSelected": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('isElementSelected', {id: result.value.ELEMENT}, function(result) {
        if (result.value) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_element_not_selected')});
        }
      });
    });
  },
  "storeElementSelected": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('isElementSelected', {id: result.value.ELEMENT}, function(result) {
        builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value;
        builder.selenium2.playback.recordResult({success: true});
      });
    });
  },

  "verifyElementValue": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementAttribute', {id: result.value.ELEMENT, name: 'value'}, function(result) {
        if (result.value == builder.selenium2.playback.param("value")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_element_value_doesnt_match', result.value, builder.selenium2.playback.param("value"))});
        }
      });
    });
  },
  "assertElementValue": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementAttribute', {id: result.value.ELEMENT, name: 'value'}, function(result) {
        if (result.value == builder.selenium2.playback.param("value")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordError(_t('sel2_element_value_doesnt_match', result.value, builder.selenium2.playback.param("value")));
        }
      });
    });
  },
  "waitForElementValue": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
        builder.selenium2.playback.execute('getElementAttribute', {id: result.value.ELEMENT, name: 'value'}, function(result) {
          callback(result.value == builder.selenium2.playback.param("value"));
        }, /*error*/ function() { callback(false); });
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassElementValue": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementAttribute', {id: result.value.ELEMENT, name: 'value'}, function(result) {
        if (result.value == builder.selenium2.playback.param("value")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_element_value_doesnt_match', result.value, builder.selenium2.playback.param("value"))});
        }
      });
    });
  },
  "storeElementValue": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementAttribute', {id: result.value.ELEMENT, name: 'value'}, function(result) {
        builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value;
        builder.selenium2.playback.recordResult({success: true});
      });
    });
  },

  "verifyElementAttribute": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementAttribute', {id: result.value.ELEMENT, name: builder.selenium2.playback.param("attributeName") }, function(result) {
        if (result.value == builder.selenium2.playback.param("value")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_attribute_value_doesnt_match', builder.selenium2.playback.param("attributeName"), result.value, builder.selenium2.playback.param("value"))});
        }
      });
    });
  },
  "assertElementAttribute": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementAttribute', {id: result.value.ELEMENT, name: builder.selenium2.playback.param("attributeName") }, function(result) {
        if (result.value == builder.selenium2.playback.param("value")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordError(_t('sel2_attribute_value_doesnt_match', builder.selenium2.playback.param("attributeName"), result.value, builder.selenium2.playback.param("value")));
        }
      });
    });
  },
  "waitForElementAttribute": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
        builder.selenium2.playback.execute('getElementAttribute', {id: result.value.ELEMENT, name: builder.selenium2.playback.param("attributeName") }, function(result) {
          callback(result.value == builder.selenium2.playback.param("value"));
        }, /*error*/ function() { callback(false); });
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassElementAttribute": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementAttribute', {id: result.value.ELEMENT, name: builder.selenium2.playback.param("attributeName") }, function(result) {
        if (result.value == builder.selenium2.playback.param("value")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_attribute_value_doesnt_match', builder.selenium2.playback.param("attributeName"), result.value, builder.selenium2.playback.param("value"))});
        }
      });
    });
  },
  "storeElementAttribute": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementAttribute', {id: result.value.ELEMENT, name: builder.selenium2.playback.param("attributeName") }, function(result) {
        builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value;
        builder.selenium2.playback.recordResult({success: true});
      });
    });
  },
  
  "verifyElementStyle": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementValueOfCssProperty', {id: result.value.ELEMENT, propertyName: builder.selenium2.playback.param("propertyName") }, function(result) {
        if (result.value == builder.selenium2.playback.param("value")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_css_value_doesnt_match', builder.selenium2.playback.param("propertyName"), result.value, builder.selenium2.playback.param("value"))});
        }
      });
    });
  },
  "assertElementStyle": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementValueOfCssProperty', {id: result.value.ELEMENT, propertyName: builder.selenium2.playback.param("propertyName") }, function(result) {
        if (result.value == builder.selenium2.playback.param("value")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordError(_t('sel2_css_value_doesnt_match', builder.selenium2.playback.param("propertyName"), result.value, builder.selenium2.playback.param("value")));
        }
      });
    });
  },
  "waitForElementStyle": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
        builder.selenium2.playback.execute('getElementValueOfCssProperty', {id: result.value.ELEMENT, propertyName: builder.selenium2.playback.param("propertyName") }, function(result) {
          callback(result.value == builder.selenium2.playback.param("value"));
        }, /*error*/ function() { callback(false); });
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassElementStyle": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementValueOfCssProperty', {id: result.value.ELEMENT, propertyName: builder.selenium2.playback.param("propertyName") }, function(result) {
        if (result.value == builder.selenium2.playback.param("value")) {
          builder.selenium2.playback.recordResult({success: true});
        } else {
          builder.selenium2.playback.recordResult({success: false, message: _t('sel2_css_value_doesnt_match', builder.selenium2.playback.param("propertyName"), result.value, builder.selenium2.playback.param("value"))});
        }
      });
    });
  },
  "storeElementStyle": function() {
    builder.selenium2.playback.findElement(builder.selenium2.playback.param("locator"), function(result) {
      builder.selenium2.playback.execute('getElementValueOfCssProperty', {id: result.value.ELEMENT, propertyName: builder.selenium2.playback.param("propertyName") }, function(result) {
		    builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value;
        builder.selenium2.playback.recordResult({success: true});
      });
    });
  },

  "deleteCookie": function() {
    builder.selenium2.playback.execute('deleteCookie', {"name": builder.selenium2.playback.param("name")});
  },

  "addCookie": function() {
    var params = {"cookie": {"name": builder.selenium2.playback.param("name"), "value": builder.selenium2.playback.param("value")}};
    var opts = builder.selenium2.playback.param("options").split(",");
    for (var i = 0; i < opts.length; i++) {
      var kv = opts[i].trim().split("=");
      if (kv.length == 1) { continue; }
      if (kv[0] == "path") {
        params.cookie.path = kv[1];
      }
      if (kv[0] == "max_age") {
        params.cookie.expiry = (new Date().getTime()) / 1000 + parseInt(kv[1]);
      }
    }
    builder.selenium2.playback.execute('addCookie', params);
  },

  "verifyCookieByName": function() {
    builder.selenium2.playback.execute('getCookies', {}, function(result) {
      for (var i = 0; i < result.value.length; i++) {
        if (result.value[i].name == builder.selenium2.playback.param("name")) {
          if (result.value[i].value == builder.selenium2.playback.param("value")) {
            builder.selenium2.playback.recordResult({success: true});
          } else {
            builder.selenium2.playback.recordResult({success: false, message: _t('sel2_cookie_value_doesnt_match', builder.selenium2.playback.param("name"), result.value[i].value, builder.selenium2.playback.param("value"))});
          }
          return;
        }
      }
      builder.selenium2.playback.recordResult({success: false, message: _t('sel2_no_cookie_found', builder.selenium2.playback.param("name"))});
    });
  },
  "assertCookieByName": function() {
    builder.selenium2.playback.execute('getCookies', {}, function(result) {
      for (var i = 0; i < result.value.length; i++) {
        if (result.value[i].name == builder.selenium2.playback.param("name")) {
          if (result.value[i].value == builder.selenium2.playback.param("value")) {
            builder.selenium2.playback.recordResult({success: true});
          } else {
            builder.selenium2.playback.recordError(_t('sel2_cookie_value_doesnt_match', builder.selenium2.playback.param("name"), result.value[i].value, builder.selenium2.playback.param("value")));
          }
          return;
        }
      }
      builder.selenium2.playback.recordError(_t('sel2_no_cookie_found', builder.selenium2.playback.param("name")));
    });
  },
  "waitForCookieByName": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.execute('getCookies', {}, function(result) {
        for (var i = 0; i < result.value.length; i++) {
          if (result.value[i].name == builder.selenium2.playback.param("name")) {
            callback(result.value[i].value == builder.selenium2.playback.param("value"));
            return;
          }
        }
        callback(false);
      },
      /*error*/ function() { callback(false); });
    });
  },
  "bypassCookieByName": function() {
    builder.selenium2.playback.execute('getCookies', {}, function(result) {
      for (var i = 0; i < result.value.length; i++) {
        if (result.value[i].name == builder.selenium2.playback.param("name")) {
          if (result.value[i].value == builder.selenium2.playback.param("value")) {
            builder.selenium2.playback.recordResult({success: true});
          } else {
            builder.selenium2.playback.recordResult({success: false, message: _t('sel2_cookie_value_doesnt_match', builder.selenium2.playback.param("name"), result.value[i].value, builder.selenium2.playback.param("value"))});
          }
          return;
        }
      }
      builder.selenium2.playback.recordResult({success: false, message: _t('sel2_no_cookie_found', builder.selenium2.playback.param("name"))});
    });
  },
  "storeCookieByName": function() {
    builder.selenium2.playback.execute('getCookies', {}, function(result) {
      for (var i = 0; i < result.value.length; i++) {
        if (result.value[i].name == builder.selenium2.playback.param("name")) {
          builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value[i].value;
          builder.selenium2.playback.recordResult({success: true});
          return;
        }
      }
      builder.selenium2.playback.recordError(_t('sel2_no_cookie_found', builder.selenium2.playback.param("name")));
    });
  },

  "verifyCookiePresent": function() {
    builder.selenium2.playback.execute('getCookies', {}, function(result) {
      for (var i = 0; i < result.value.length; i++) {
        if (result.value[i].name == builder.selenium2.playback.param("name")) {
          builder.selenium2.playback.recordResult({success: true});
          return;
        }
      }
      builder.selenium2.playback.recordResult({success: false, message: _t('sel2_no_cookie_found', builder.selenium2.playback.param("name"))});
    });
  },
  "assertCookiePresent": function() {
    builder.selenium2.playback.execute('getCookies', {}, function(result) {
      for (var i = 0; i < result.value.length; i++) {
        if (result.value[i].name == builder.selenium2.playback.param("name")) {
          builder.selenium2.playback.recordResult({success: true});
          return;
        }
      }
      builder.selenium2.playback.recordError(_t('sel2_no_cookie_found', builder.selenium2.playback.param("name")));
    });
  },
  "waitForCookiePresent": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.execute('getCookies', {}, function(result) {
        for (var i = 0; i < result.value.length; i++) {
          if (result.value[i].name == builder.selenium2.playback.param("name")) {
            callback(true);
            return;
          }
        }
        callback(false);
      },
      /*error*/ function() { callback(false); });
    });
  },
  "bypassCookiePresent": function() {
    builder.selenium2.playback.execute('getCookies', {}, function(result) {
      for (var i = 0; i < result.value.length; i++) {
        if (result.value[i].name == builder.selenium2.playback.param("name")) {
          builder.selenium2.playback.recordResult({success: true});
          return;
        }
      }
      builder.selenium2.playback.recordResult({success: false, message: _t('sel2_no_cookie_found', builder.selenium2.playback.param("name"))});
    });
  },
  "storeCookiePresent": function() {
    builder.selenium2.playback.execute('getCookies', {}, function(result) {
      for (var i = 0; i < result.value.length; i++) {
        if (result.value[i].name == builder.selenium2.playback.param("name")) {
          builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = true;
          builder.selenium2.playback.recordResult({success: true});
          return;
        }
      }
      builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = false;
      builder.selenium2.playback.recordResult({success: true});
    });
  },

  "saveScreenshot": function() {
    builder.selenium2.playback.execute("saveScreenshot", builder.selenium2.playback.param("file"));
  },
  
  "switchToFrame": function() {
    builder.selenium2.playback.execute("switchToFrame", { 'id': builder.selenium2.playback.param("identifier") });
  },
  
  "switchToFrameByIndex": function() {
    builder.selenium2.playback.execute("switchToFrame", { 'id': parseInt(builder.selenium2.playback.param("index")) });
  },
  
  "switchToWindow": function() {
    builder.selenium2.playback.execute("switchToWindow", { 'name': builder.selenium2.playback.param("name") });
  },

  "switchToWindowByIndex": function() {
    builder.selenium2.playback.execute("switchToWindow", { 'id': parseInt(builder.selenium2.playback.param("index")) });
  },
  
  "switchToDefaultContent": function() {
    builder.selenium2.playback.execute("switchToFrame", {});
  },
  
  "verifyAlertText": function() {
    builder.selenium2.playback.execute('getAlertText', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("text")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordResult({success: false, message: _t('sel2_alert_text_does_not_match', result.value, builder.selenium2.playback.param("text"))});
      }
    });
  },
  "assertAlertText": function() {
    builder.selenium2.playback.execute('getAlertText', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("text")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordError(_t('sel2_alert_text_does_not_match', result.value, builder.selenium2.playback.param("text")));
      }
    });
  },
  "waitForAlertText": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.execute('getAlertText', {}, function(result) {
        callback(result.value == builder.selenium2.playback.param("text"));
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassAlertText": function() {
    builder.selenium2.playback.execute('getAlertText', {}, function(result) {
      if (result.value == builder.selenium2.playback.param("text")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordResult({success: false, message: _t('sel2_alert_text_does_not_match', result.value, builder.selenium2.playback.param("text"))});
      }
    });
  },
  "storeAlertText": function() {
    builder.selenium2.playback.execute('getAlertText', {}, function(result) {
      builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = result.value;
      builder.selenium2.playback.recordResult({success: true});
    });
  },
  
  "verifyAlertPresent": function() {
    builder.selenium2.playback.execute('getAlert', {}, function(result) {
      builder.selenium2.playback.recordResult({success: true});
    }, /*error*/ function() {
      builder.selenium2.playback.recordResult({success: false, message: _t('sel2_no_alert_present')});
    });
  },
  "assertAlertPresent": function() {
    builder.selenium2.playback.execute('getAlert', {}, function(result) {
      builder.selenium2.playback.recordResult({success: true});
    }, /*error*/ function() {
      builder.selenium2.playback.recordError(_t('sel2_no_alert_present'));
    });
  },
  "waitForAlertPresent": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.execute('getAlert', {}, function(result) {
        callback(true);
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassAlertPresent": function() {
    builder.selenium2.playback.execute('getAlert', {}, function(result) {
      builder.selenium2.playback.recordResult({success: true});
    }, /*error*/ function() {
      builder.selenium2.playback.recordResult({success: false, message: _t('sel2_no_alert_present')});
    });
  },
  "storeAlertPresent": function() {
    builder.selenium2.playback.execute('getAlert', {}, function(result) {
      builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = true;
      builder.selenium2.playback.recordResult({success: true});
    }, /*error*/ function() {
      builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = false;
      builder.selenium2.playback.recordResult({success: true});
    });
  },
  
  "answerAlert": function() {
    builder.selenium2.playback.execute('setAlertValue', { 'text': builder.selenium2.playback.param("text") }, function(result) {
      builder.selenium2.playback.execute('acceptAlert', {});
    });
  },
  "acceptAlert": function() {
    setTimeout(function() {
      builder.selenium2.playback.execute('acceptAlert', {});
    }, 1000);
  },
  "dismissAlert": function() {
    setTimeout(function() {
      builder.selenium2.playback.execute('dismissAlert', {});
    }, 1000);
  },
  
  "verifyEval": function() {
    builder.selenium2.playback.execute('executeScript', { 'script': builder.selenium2.playback.param("script"), 'args': [] }, function(result) {
      if (str(result.value) == builder.selenium2.playback.param("value")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordResult({success: false, message: _t('sel2_eval_false', result.value, builder.selenium2.playback.param("value"))});
      }
    }, /*error*/ function() {
      builder.selenium2.playback.recordResult({success: false, message: _t('sel2_eval_failed')});
    });
  },
  "assertEval": function() {
    builder.selenium2.playback.execute('executeScript', { 'script': builder.selenium2.playback.param("script"), 'args': [] }, function(result) {
      if (str(result.value) == builder.selenium2.playback.param("value")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordError(_t('sel2_eval_false', result.value, builder.selenium2.playback.param("value")));
      }
    }, /*error*/ function() {
      builder.selenium2.playback.recordError(_t('sel2_eval_failed'));
    });
  },
  "waitForEval": function() {
    builder.selenium2.playback.wait(function(callback) {
      builder.selenium2.playback.execute('executeScript', { 'script': builder.selenium2.playback.param("script"), 'args': [] }, function(result) {
        callback(str(result.value) == builder.selenium2.playback.param("value"));
      }, /*error*/ function() { callback(false); });
    });
  },
  "bypassEval": function() {
    builder.selenium2.playback.execute('executeScript', { 'script': builder.selenium2.playback.param("script"), 'args': [] }, function(result) {
      if (str(result.value) == builder.selenium2.playback.param("value")) {
        builder.selenium2.playback.recordResult({success: true});
      } else {
        builder.selenium2.playback.recordResult({success: false, message: _t('sel2_eval_false', result.value, builder.selenium2.playback.param("value"))});
      }
    }, /*error*/ function() {
      builder.selenium2.playback.recordResult({success: false, message: _t('sel2_eval_failed')});
    });
  },
  "storeEval": function() {
    builder.selenium2.playback.execute('executeScript', { 'script': builder.selenium2.playback.param("script"), 'args': [] }, function(result) {
      builder.selenium2.playback.vars[builder.selenium2.playback.param("variable")] = str(result.value);
      builder.selenium2.playback.recordResult({success: true});
    }, /*error*/ function() {
      builder.selenium2.playback.recordError(_t('sel2_eval_failed'));
    });
  },
  "printWindowName": function() {
    builder.selenium2.playback.execute('executeScript', { 'script': 'return window.name;', 'args': [] }, function(result) {
      builder.selenium2.playback.print(str(result.value));
      builder.selenium2.playback.recordResult({success: true});
   }, /*error*/ function() {
      builder.selenium2.playback.recordError(_t('sel2_eval_failed'));
   });
  },
  "renameWindow": function() {
      builder.selenium2.playback.execute('executeScript', { 'script': 'return (window.name="'+builder.selenium2.playback.param("name")+'");', 'args': [] }, function(result) {
      builder.selenium2.playback.recordResult({success: true});
    }, /*error*/ function() {
      builder.selenium2.playback.recordError(_t('sel2_eval_failed'));
    });
  },                   
  "forceTargets": function() {
      builder.selenium2.playback.execute('executeScript', { 'script': 'var a=document.querySelectorAll("a[href]");[].forEach.call(a,function(e){e.setAttribute("target","'+builder.selenium2.playback.param("name")+'");});return 1;', 'args': [] }, function(result) {
      builder.selenium2.playback.recordResult({success: true});
    }, /*error*/ function() {
      builder.selenium2.playback.recordError(_t('sel2_eval_failed'));
    });
  },
  "deleteComments": function() {
      builder.selenium2.playback.execute('executeScript', { 'script': 'var t=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_COMMENT, null, false),c=[];while(t.nextNode()){c.push(t.currentNode);}[].forEach.call(c,function(e){e.parentNode.removeChild(e);});return 1;', 'args': [] }, function(result) {
      builder.selenium2.playback.recordResult({success: true});
    }, /*error*/ function() {
      builder.selenium2.playback.recordError(_t('sel2_eval_failed'));
    });
  },
  "deleteCachesUrls": function() {
      builder.selenium2.playback.execute('executeScript', { 'script': "var a=document.querySelectorAll('link[href*=\"?\"],img[src*=\"?\"],script[src*=\"?\"]');[].forEach.call(a,function(e){var a=e.href||e.src;var b =a.substr(0,a.indexOf('\\?'));(e.src)?e.src=b:e.href=b;});return 1;", 'args': [] }, function(result) {
      builder.selenium2.playback.recordResult({success: true});
    }, /*error*/ function() {
      builder.selenium2.playback.recordError(_t('sel2_eval_failed'));
    });
  },
  "deleteHiddenValues": function() {
      builder.selenium2.playback.execute('executeScript', { 'script': "var a=document.querySelectorAll('input[type=\"hidden\"]');[].forEach.call(a,function(e){a.parentNode.removeChild(a);});return 1;", 'args': [] }, function(result) {
      builder.selenium2.playback.recordResult({success: true});
    }, /*error*/ function() {
      builder.selenium2.playback.recordError(_t('sel2_eval_failed'));
    });
  }
};

builder.selenium2.playback.playStep = function() {
  builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.RUNNING, null, null);
  if (builder.selenium2.playback.byPassCounter === 0){
    if (builder.selenium2.playback.playbackFunctions[builder.selenium2.playback.currentStep.type.getName()]) {
      try {
        builder.selenium2.playback.playbackFunctions[builder.selenium2.playback.currentStep.type.getName()]();
      } catch (e) {
        builder.selenium2.playback.recordError(e);
      }
    } else {
      builder.selenium2.playback.recordError(_t('sel2_step_not_implemented_for_playback', builder.selenium2.playback.currentStep.type));
    }
  } else {
    builder.selenium2.playback.recordResult({success: false, message: _t('sel2_bypass', builder.selenium2.playback.byPassCounter--), skip: true});
  }
};

builder.selenium2.playback.print = function(text) {
  builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.NO_CHANGE, text, null);
};

builder.selenium2.playback.recordResult = function(result) {

  if (builder.selenium2.playback.currentStep.negated) {
    var msg = builder.selenium2.playback.currentStep.type.getName() + " " + _t('sel2_is') + " " + _t('sel2_' + result.success);
    if (result.success && builder.selenium2.playback.currentStep.type.getName().startsWith("assert")) {
      builder.selenium2.playback.doRecordError(msg);
      return;
    }
    result.message = msg;
    result.success = !result.success;
  }
  if (result.skip) {
    // Skipped steps should be updated with a distinct UI treatment
    builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.SKIPPED, null, null);
  } else if (result.success) {
    builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.SUCCEEDED, null, null);
    if (result.success && builder.selenium2.playback.currentStep.type.getName().startsWith("bypass")) {
      builder.selenium2.playback.byPassCounter = builder.selenium2.playback.currentStep.nbstep;
    }
  } else {
    // Bypass steps are not real failures, but we're setting the display to "FAILED" so it's more obvious when Se-Builder runs/skips the bypassable steps
    builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.FAILED, null, result.message);
    if (!builder.selenium2.playback.currentStep.type.getName().startsWith("bypass")) {
      builder.selenium2.playback.playResult.success = false;
      if (result.message) {
        builder.selenium2.playback.playResult.errormessage = result.message;
      }
    }
  }

  if (builder.selenium2.playback.stopRequest || builder.selenium2.playback.currentStep == builder.selenium2.playback.finalStep) {
    if (builder.selenium2.playback.stopRequest || builder.selenium2.playback.currentStep == builder.selenium2.playback.script.steps[builder.selenium2.playback.script.steps.length - 1]) {
      builder.selenium2.playback.shutdown();
    } else {
      builder.selenium2.playback.currentStep = builder.selenium2.playback.script.steps[builder.selenium2.playback.script.getStepIndexForID(builder.selenium2.playback.currentStep.id) + 1];
      builder.selenium2.playback.pausedOnBreakpoint = true;
      //builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.BREAKPOINT, null, null);
      builder.selenium2.playback.runPausedCallback();
    }
  } else {
    builder.selenium2.playback.currentStep = builder.selenium2.playback.script.steps[builder.selenium2.playback.script.getStepIndexForID(builder.selenium2.playback.currentStep.id) + 1];
    if (builder.breakpointsEnabled && builder.selenium2.playback.currentStep.breakpoint) {
      builder.selenium2.playback.pausedOnBreakpoint = true;
      builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.BREAKPOINT, null, null);
      builder.selenium2.playback.runPausedCallback();
    } else {
      builder.selenium2.playback.playStep();
    }
  }
};

builder.selenium2.playback.hasPlaybackSession = function() {
  return builder.selenium2.playback.script != null;
};

builder.selenium2.playback.isRunning = function() {
  return !builder.selenium2.playback.pausedOnBreakpoint;
}

builder.selenium2.playback.getVars = function() {
  return builder.selenium2.playback.vars;
};

builder.selenium2.playback.setVar = function(k, v) {
  if (v == null) {
    delete builder.selenium2.playback.vars[k];
  } else {
    builder.selenium2.playback.vars[k] = v;
  }
};

builder.selenium2.playback.shutdown = function() {
  // Set the display of prompts back to how it was.
  try { bridge.prefManager.setBoolPref("prompts.tab_modal.enabled", builder.selenium2.playback.prompts_tab_modal_enabled); } catch (e) {}
  
  builder.selenium2.playback.script = null;
  
  if (builder.selenium2.playback.postPlayCallback) {
    builder.selenium2.playback.postPlayCallback(builder.selenium2.playback.playResult);
  }
};

builder.selenium2.playback.recordError = function(message) {
  if (builder.selenium2.playback.currentStep.negated && builder.selenium2.playback.currentStep.type.getName().startsWith("assert")) {
    // Record this as a failed result instead - this way it will be turned into a successful result
    // by recordResult.
    builder.selenium2.playback.recordResult({success: false});
    return;
  }
  
  builder.selenium2.playback.doRecordError(message);
};

builder.selenium2.playback.doRecordError = function(message) {
  message = message ? ("" + message) : _t('sel1_playback_failed');
  builder.selenium2.playback.stepStateCallback(builder.selenium2.playback, builder.selenium2.playback.script, builder.selenium2.playback.currentStep, builder.selenium2.playback.currentStepIndex(), builder.stepdisplay.state.ERROR, null, message);
  builder.selenium2.playback.playResult.success = false;
  builder.selenium2.playback.playResult.errormessage = message;
  builder.selenium2.playback.shutdown();
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
