/**
 * Code for playing back Selenium 1 scripts locally.
*/

builder.selenium1.playback = {};

/** We should be able to play back any kind of Selenium 1 method. */
builder.selenium1.playback.canPlayback = function(stepType) {
  return true;
};

/** The script being played back. */
builder.selenium1.playback.script = null;
/** The index of the step being played back. */
builder.selenium1.playback.step_index = -1;
/** The step after which playback should stop, or -1 to go till the end. */
builder.selenium1.playback.end_step_index = -1;
/** The function to call with a result object after the run has concluded one way or another. */
builder.selenium1.playback.postPlayCallback = null;
/** The result object returned at the end of the run. */
builder.selenium1.playback.playResult = null;
/** Whether the user has requested test stoppage. */
builder.selenium1.playback.stopRequest = false;
/** Whether playback is paused due to a breakpoint or a "run until". */
builder.selenium1.playback.isPaused = false;
/** The delay between steps. */
builder.selenium1.playback.speed = 0;
/** The pause incrementor. */
builder.selenium1.playback.pauseCounter = 0;
/** The pause interval. */
builder.selenium1.playback.pauseInterval = null;
// Set up Selenium to drive the browser.
builder.selenium1.playback.handler = new CommandHandlerFactory();
builder.selenium1.playback.browserbot = new MozillaBrowserBot(window.bridge.getRecordingWindow());
builder.selenium1.playback.selenium = new Selenium(builder.selenium1.playback.browserbot);
builder.selenium1.playback.handler.registerAll(builder.selenium1.playback.selenium);

builder.selenium1.playback.record_result = function(result) {
  // Color the step according to whether the playback succeeded.
  if (result && result.failed) {
    builder.selenium1.playback.stepStateCallback(builder.selenium1.playback, builder.selenium1.playback.wholeScript, builder.selenium1.playback.script[builder.selenium1.playback.step_index], builder.selenium1.playback.step_index, builder.stepdisplay.state.FAILED, null, result.failureMessage);
    builder.selenium1.playback.playResult.success = false;
    if (result.failureMessage) {
      builder.selenium1.playback.playResult.errormessage = result.failureMessage;
      builder.selenium1.playback.script[builder.selenium1.playback.step_index].failureMessage = result.failureMessage;
    } else {
      builder.selenium1.playback.playResult.errormessage = " (" + _t('sel1_unknown_failure_reason') + ")";
    }
  } else {
    builder.selenium1.playback.stepStateCallback(builder.selenium1.playback, builder.selenium1.playback.wholeScript, builder.selenium1.playback.script[builder.selenium1.playback.step_index], builder.selenium1.playback.step_index, builder.stepdisplay.state.SUCCEEDED, null, null);
  }
  // Play the next step, if appropriate.
  if (builder.selenium1.playback.step_index !== builder.selenium1.playback.end_step_index &&
      ++builder.selenium1.playback.step_index < builder.selenium1.playback.script.length &&
      !builder.selenium1.playback.stopRequest)
  {
    if (builder.breakpointsEnabled && builder.selenium1.playback.script[builder.selenium1.playback.step_index].breakpoint) {
      builder.selenium1.playback.isPaused = true;
      BrowserBot.enableInterception = false;
      builder.selenium1.playback.stepStateCallback(builder.selenium1.playback, builder.selenium1.playback.wholeScript, builder.selenium1.playback.script[builder.selenium1.playback.step_index], builder.selenium1.playback.step_index, builder.stepdisplay.state.BREAKPOINT, null, null);
      builder.selenium1.playback.runPausedCallback();
      return;
    }
    
    if (builder.selenium1.playback.speed > 0) {
      window.setTimeout(function() { builder.selenium1.playback.play_step(builder.selenium1.playback.script[builder.selenium1.playback.step_index]); }, builder.selenium1.playback.speed);
    } else {
      builder.selenium1.playback.play_step(builder.selenium1.playback.script[builder.selenium1.playback.step_index]);
    }
  } else {
    if (builder.selenium1.playback.step_index == builder.selenium1.playback.script.length || builder.selenium1.playback.stopRequest) {
      builder.selenium1.playback.finish();
    } else {
      builder.selenium1.playback.isPaused = true;
      BrowserBot.enableInterception = false;
      builder.selenium1.playback.runPausedCallback();
    }
  }
};

builder.selenium1.playback.echo = function(message) {
  builder.selenium1.playback.stepStateCallback(builder.selenium1.playback, builder.selenium1.playback.wholeScript, builder.selenium1.playback.script[builder.selenium1.playback.step_index], builder.selenium1.playback.step_index, builder.stepdisplay.state.NO_CHANGE, message, null);
};

builder.selenium1.playback.setSpeed = function(newSpeed) {
  builder.selenium1.playback.speed = newSpeed;
};

builder.selenium1.playback.pause = function(waitTime) {
  // This is handled in play_step.
};

builder.selenium1.playback.record_error = function(error) {
  builder.selenium1.playback.stepStateCallback(builder.selenium1.playback, builder.selenium1.playback.wholeScript, builder.selenium1.playback.script[builder.selenium1.playback.step_index], builder.selenium1.playback.step_index, builder.stepdisplay.state.NO_CHANGE, null, error || _t('sel1_playback_failed'));
  builder.selenium1.playback.playResult.success = false;
  builder.selenium1.playback.playResult.errormessage = error;
  builder.selenium1.playback.finish();
};

builder.selenium1.playback.finish = function() {
  BrowserBot.enableInterception = false;
  builder.selenium2.playback.execute("setModalHandling", { 'value': {'modalHandling': '0'} }, function(result) {
    // Set the display of prompts back to how it was.
    try { bridge.prefManager.setBoolPref("prompts.tab_modal.enabled", builder.selenium2.playback.prompts_tab_modal_enabled); } catch (e) {}
    builder.selenium1.playback.script = null;
    if (builder.selenium1.playback.postPlayCallback) {
      builder.selenium1.playback.postPlayCallback(builder.selenium1.playback.playResult);
    }
  });
};

/** Dumps message to browser console. */
function myDump(aMessage) {
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                 .getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage("SB: " + aMessage);
}

builder.selenium1.playback.preprocessParameter = function(p) {
  if (p instanceof builder.locator.Locator) {
    return builder.selenium1.playback.selenium.preprocessParameter(
      p.getName(builder.selenium1) + "=" + p.getValue()
    );
  }
  return builder.selenium1.playback.selenium.preprocessParameter("" + p);
};

builder.selenium1.playback.playSel2Step = function(name, params, customCallback, customFailureCallback) {
  var spoofedResult = {
    'failed': false,
    'sel2_result': null,
    'throwMe': null,
    'terminationCondition': function() {
      if (this.throwMe) { throw this.throwMe; }
      return !!this.sel2_result || this.failed;
    }
  };
  builder.selenium2.playback.execute(name, params, function(result) {
    if (customCallback) {
      customCallback(spoofedResult, result);
    } else {
      spoofedResult.sel2_result = result;
    }
  },
  function(failureMessage) {
    if (customFailureCallback) {
      customFailureCallback(spoofedResult, failureMessage);
    } else {
      spoofedResult.failureMessage = failureMessage;
      spoofedResult.failed = true;
    }
  });
  return spoofedResult;
};

builder.selenium1.playback.waitIters = 0;
builder.selenium1.playback.maxWaitIters = 0;

builder.selenium1.playback.waitForSel2Step = function(name, params, successFunction, failureFunction, timeoutMs) {
  var spoofedResult = {
    'failed': false,
    'sel2_result': null,
    'throwMe': null,
    'terminationCondition': function() {
      if (this.throwMe) { throw this.throwMe; }
      return !!this.sel2_result || this.failed;
    }
  };
  builder.selenium1.playback.maxWaitIters = timeoutMs / 1000;
  builder.selenium1.playback.waitIters = 0;
  var f = function(self) {
    builder.selenium2.playback.execute(name, params, function(result) {
      var r = successFunction(result);
      if (r.success) {
        spoofedResult.sel2_result = result;
      } else {
        builder.selenium1.playback.waitIters++;
        if (builder.selenium1.playback.waitIters > builder.selenium1.playback.maxWaitIters) {
          spoofedResult.throwMe = r.message;
          spoofedResult.failed = true;
        } else {
          setTimeout(function() { self(self); }, 1000);
        }
      }
    },
    function(failureMessage) {
      var r = failureFunction(failureMessage);
      if (r.success) {
        spoofedResult.sel2_result = {'success': true};
      } else {
        builder.selenium1.playback.waitIters++;
        if (builder.selenium1.playback.waitIters > builder.selenium1.playback.maxWaitIters) {
          spoofedResult.throwMe = r.message;
          spoofedResult.failed = true;
        } else {
          setTimeout(function() { self(self); }, 1000);
        }
      }
    });
  };
  f(f);
  return spoofedResult;
};

/** Executes the given step in the browser. */
builder.selenium1.playback.play_step = function(step) {
  builder.selenium1.playback.stepStateCallback(builder.selenium1.playback, builder.selenium1.playback.wholeScript, builder.selenium1.playback.script[builder.selenium1.playback.step_index], builder.selenium1.playback.step_index, builder.stepdisplay.state.RUNNING, null, null);
    
  // Pausing
  if (step.type == builder.selenium1.stepTypes.pause) {
    builder.selenium1.playback.pauseCounter = 0;
    var max = step.waitTime / 100;
    builder.selenium1.playback.stepStateCallback(builder.selenium1.playback, builder.selenium1.playback.wholeScript, builder.selenium1.playback.script[builder.selenium1.playback.step_index], builder.selenium1.playback.step_index, builder.stepdisplay.state.NO_CHANGE, null, null, 1);
    builder.selenium1.playback.pauseInterval = setInterval(function() {
      if (builder.selenium1.playback.stopRequest) {
        window.clearInterval(builder.selenium1.playback.pauseInterval);
        builder.selenium1.playback.stepStateCallback(builder.selenium1.playback, builder.selenium1.playback.wholeScript, builder.selenium1.playback.script[builder.selenium1.playback.step_index], builder.selenium1.playback.step_index, builder.stepdisplay.state.NO_CHANGE, null, null, 0);
        builder.selenium1.playback.record_result({failed:true, failureMessage: _t('sel1_test_stopped')});
        return;
      }
      builder.selenium1.playback.pauseCounter++;
      builder.selenium1.playback.stepStateCallback(builder.selenium1.playback, builder.selenium1.playback.wholeScript, builder.selenium1.playback.script[builder.selenium1.playback.step_index], builder.selenium1.playback.step_index, builder.stepdisplay.state.NO_CHANGE, null, null, 1 + 99 * builder.selenium1.playback.pauseCounter / max);
      if (builder.selenium1.playback.pauseCounter >= max) {
        window.clearInterval(builder.selenium1.playback.pauseInterval);
        builder.selenium1.playback.stepStateCallback(builder.selenium1.playback, builder.selenium1.playback.wholeScript, builder.selenium1.playback.script[builder.selenium1.playback.step_index], builder.selenium1.playback.step_index, builder.stepdisplay.state.NO_CHANGE, null, null, 0);
        builder.selenium1.playback.record_result({'failed': false});
      }
    }, 100);
    return;
  }
  
  var pNames = step.getParamNames();
  var p0 = pNames.length > 0 ? step[pNames[0]] : '';
  var p1 = pNames.length > 1 ? step[pNames[1]] : '';
  var command = {
    command: step.type.baseName,
    target: builder.selenium1.playback.preprocessParameter(p0),
    value: builder.selenium1.playback.preprocessParameter(p1)
  };
  var adjustedStepName = step.type.name;
  if (step.type.getNegatable() && step.negated) {
    adjustedStepName = step.type.negator(adjustedStepName);
  }
  // Run command
  var result = null;
  // Special cases for dialog handling.
  if (step.type == builder.selenium1.stepTypes.chooseOkOnNextConfirmation) {
    result = builder.selenium1.playback.playSel2Step("setModalHandling", {'value': {'modalHandling': 'acceptAlert'}});
  } else if (step.type == builder.selenium1.stepTypes.chooseCancelOnNextConfirmation) {
    result = builder.selenium1.playback.playSel2Step("setModalHandling", {'value': {'modalHandling': 'dismissAlert'}});
  } else if (step.type == builder.selenium1.stepTypes.answerOnNextPrompt) {
    result = builder.selenium1.playback.playSel2Step("setModalHandling", {'value': {'modalHandling': 'answerAlert', 'modalResponse': p0}});
  } else if (step.type == builder.selenium1.stepTypes.assertPrompt ||
             step.type == builder.selenium1.stepTypes.assertAlert ||
             step.type == builder.selenium1.stepTypes.assertConfirmation)
  {
    result = builder.selenium1.playback.playSel2Step("getOldAlertText", {},
    /* success */ function(spoofedResult, result) {
      if (step.negated) {
        if (result.value == p0) {
          spoofedResult.throwMe = "Text matches";
        } else {
          spoofedResult.sel2_result = result;
        }
      } else {
        if (result.value == p0) {
          spoofedResult.sel2_result = result;
        } else {
          spoofedResult.throwMe = "Text does not match";
        }
      }
    },
    /* failure */ function(spoofedResult, failureMessage) {
      if (failureMessage.value && failureMessage.value.message) {
        spoofedResult.throwMe = failureMessage.value.message;
      } else {
        spoofedResult.throwMe = failureMessage;
      }
    });
  } else if (step.type == builder.selenium1.stepTypes.verifyPrompt ||
             step.type == builder.selenium1.stepTypes.verifyAlert ||
             step.type == builder.selenium1.stepTypes.verifyConfirmation)
  {
    result = builder.selenium1.playback.playSel2Step("getOldAlertText", {},
    /* success */ function(spoofedResult, result) {
      if (step.negated) {
        if (result.value == p0) {
          spoofedResult.failed = true;
          spoofedResult.failureMessage = "Text matches";
        } else {
          spoofedResult.sel2_result = result;
        }
      } else {
        if (result.value == p0) {
          spoofedResult.sel2_result = result;
        } else {
          spoofedResult.failed = true;
          spoofedResult.failureMessage = "Text does not match";
        }
      }
    },
    /* failure */ function(spoofedResult, failureMessage) {
      spoofedResult.failed = true;
      if (failureMessage.value && failureMessage.value.message) {
        spoofedResult.failureMessage = failureMessage.value.message;
      } else {
        spoofedResult.failureMessage = failureMessage;
      }
    });
  } else if (step.type == builder.selenium1.stepTypes.storePrompt ||
             step.type == builder.selenium1.stepTypes.storeAlert ||
             step.type == builder.selenium1.stepTypes.storeConfirmation)
  {
    result = builder.selenium1.playback.playSel2Step("getOldAlertText", {},
    /* success */ function(spoofedResult, result) {
      storedVars[p0] = result.value;
      spoofedResult.sel2_result = result;
    },
    /* failure */ function(spoofedResult, failureMessage) {
      if (failureMessage.value && failureMessage.value.message) {
        spoofedResult.throwMe = failureMessage.value.message;
      } else {
        spoofedResult.throwMe = failureMessage;
      }
    });
  } else if (step.type == builder.selenium1.stepTypes.waitForPrompt ||
             step.type == builder.selenium1.stepTypes.waitForAlert ||
             step.type == builder.selenium1.stepTypes.waitForConfirmation)
  {
    result = builder.selenium1.playback.waitForSel2Step("getOldAlertText", {},
      /* success */ function(result) {
        if (step.negated) {
          if (result.value != p0) {
            return {'success': true};
          } else {
            return {'success': false, 'message': "Text matches"};
          }
        } else {
          if (result.value == p0) {
            return {'success': true};
          } else {
            return {'success': false, 'message': "Text does not match"};
          }
        }
      },
      /* failure */ function(failureMessage) {
        if (failureMessage.value && failureMessage.value.message) {
          return {'success': false, 'message': failureMessage.value.message};
        } else {
          return {'success': false, 'message': failureMessage};
        }
      },
      Selenium.DEFAULT_TIMEOUT);
  } else if (step.type == builder.selenium1.stepTypes.assertPromptPresent ||
             step.type == builder.selenium1.stepTypes.assertAlertPresent ||
             step.type == builder.selenium1.stepTypes.assertConfirmationPresent)
  {
    result = builder.selenium1.playback.playSel2Step("getOldAlertText", {},
    /* success */ function(spoofedResult, result) {
      if (step.negated) {
        spoofedResult.throwMe = "Dialog present";
      } else {
        spoofedResult.sel2_result = result;
      }
    },
    /* failure */ function(spoofedResult, failureMessage) {
      if (step.negated) {
        spoofedResult.sel2_result = failureMessage;
      } else {
        if (failureMessage.value && failureMessage.value.message) {
          spoofedResult.throwMe = failureMessage.value.message;
        } else {
          spoofedResult.throwMe = failureMessage;
        }
      }
    });
  } else if (step.type == builder.selenium1.stepTypes.verifyPromptPresent ||
             step.type == builder.selenium1.stepTypes.verifyAlertPresent ||
             step.type == builder.selenium1.stepTypes.verifyConfirmationPresent)
  {
    result = builder.selenium1.playback.playSel2Step("getOldAlertText", {},
    /* success */ function(spoofedResult, result) {
      if (step.negated) {
        spoofedResult.failed = true;
        spoofedResult.failureMessage = "Dialog present";
      } else {
        spoofedResult.sel2_result = result;
      }
    },
    /* failure */ function(spoofedResult, failureMessage) {
      if (step.negated) {
        spoofedResult.sel2_result = failureMessage;
      } else {
        if (failureMessage.value && failureMessage.value.message) {
          spoofedResult.failureMessage = failureMessage.value.message;
        } else {
          spoofedResult.failureMessage = failureMessage;
        }
        spoofedResult.failed = true;
      }
    });
  } else if (step.type == builder.selenium1.stepTypes.storePromptPresent ||
             step.type == builder.selenium1.stepTypes.storeAlertPresent ||
             step.type == builder.selenium1.stepTypes.storeConfirmationPresent)
  {
    result = builder.selenium1.playback.playSel2Step("getOldAlertText", {},
    /* success */ function(spoofedResult, result) {
      storedVars[p0] = step.negated ? "false" : "true";
      spoofedResult.sel2_result = result;
    },
    /* failure */ function(spoofedResult, failureMessage) {
      storedVars[p0] = step.negated ? "true" : "false";
      spoofedResult.sel2_result = failureMessage;
    });
  } else if (step.type == builder.selenium1.stepTypes.waitForPromptPresent ||
             step.type == builder.selenium1.stepTypes.waitForAlertPresent ||
             step.type == builder.selenium1.stepTypes.waitForConfirmationPresent)
  {
    result = builder.selenium1.playback.waitForSel2Step("getOldAlertText", {},
      /* success */ function(result) {
        if (step.negated) {
          return {'success': false, 'message': "Dialog present"};
        } else {
          return {'success': true};
        }
      },
      /* failure */ function(failureMessage) {
        if (step.negated) {
          return {'success': true};
        } else {
          if (failureMessage.value && failureMessage.value.message) {
            return {'success': false, 'message': failureMessage.value.message};
          } else {
            return {'success': false, 'message': failureMessage};
          }
        }
      },
      Selenium.DEFAULT_TIMEOUT);
  } else {
    // The normal case of a step.
    try {
      result = builder.selenium1.playback.handler.getCommandHandler(adjustedStepName).execute(builder.selenium1.playback.selenium, command);
    } catch (e) {
      builder.selenium1.playback.record_error(e);
      return;
    }
  }
  var interval;
  
  function makeLoadListener(win, browserbot) {
    return function() {
      if (win.name && !browserbot.openedWindows[win.name]) {
        builder.selenium1.playback.browserbot.openedWindows[win.name] = win;
      }
    };
  }

  function wait() {
    // Tell the browser bot to run a bunch of functions used to eg determine if the page
    // has reloaded yet.
    try {
      if (builder.selenium1.playback.stopRequest) {
        window.clearInterval(interval);
        builder.selenium1.playback.record_result({failed:true, failureMessage: "Test stopped"});
        return;
      }
      
      // The browser bot is trying to listen for new windows being opened so it can wrap their
      // open, alert, etc functions. Unfortunately, it actually gets ahold of objects that have
      // some of the properties of the windows it wants, but are not the real thing, as wrapping
      // their functions doesn't work - the actual window objects that end up getting used by the
      // Javascript on the loaded page have non-wrapped functions.
      // So we lend a helping hand by asking Firefox (note that this makes the code Firefox
      // specific) for all the windows in the browser and pass them to browserbot to have them
      // processed.
      var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
      var en = windowManager.getEnumerator(null, false);
      while (en.hasMoreElements()) {
        var w = en.getNext();
        for (i = 0; i < w.frames.length; i++) {
          // This expression filters out the frames that aren't browser tabs.
          // I'm sure there's a better way to detect this, but this would require meaningful
          // documentation in Firefox! qqDPS
          if ((w.frames[i] + "").indexOf("ChromeWindow") === -1) {
            var win = w.frames[i];
            builder.selenium1.playback.browserbot._modifyWindow(win); // qqDPS ???
            // FF 4+ has rearchitected so that we can no longer successfully intercept open()
            // calls on windows. So instead, we manually look for new windows that have opened.
            // But doing so actually breaks under FF 3, so only do this on FF 4+.
            if (navigator.userAgent.indexOf("Firefox/3.") == -1 && !win.__selenium_builder_popup_listener_active) {
              win.__selenium_builder_popup_listener_active = true;
              win.addEventListener("load", makeLoadListener(win, builder.selenium1.playback.browserbot), false);
            }
          }
        }
      }
      
      builder.selenium1.playback.browserbot.runScheduledPollers();
      if (result.terminationCondition && !result.terminationCondition()) { return; }
      window.clearInterval(interval);
      builder.selenium1.playback.record_result(result);
    } catch (e) {
      window.clearInterval(interval);
      builder.selenium1.playback.record_error(e);
    }
  }
  interval = window.setInterval(wait, 10);
};

builder.selenium1.playback.stopTest = function() {
  if (builder.selenium1.playback.isPaused) {
    builder.selenium1.playback.finish();
  } else {
    builder.selenium1.playback.stopRequest = true;
  }
};

builder.selenium1.playback.getVars = function() {
  var vs = {};
  for (var key in storedVars) {
    vs[key] = storedVars[key];
  }
  return vs;
};

builder.selenium1.playback.setVar = function(k, v) {
  if (v == null) {
    delete storedVars[k];
  } else {
    storedVars[k] = v;
  }
};

builder.selenium1.playback.hasPlaybackSession = function() {
  return builder.selenium1.playback.script != null;
};

builder.selenium1.playback.isRunning = function() {
  return !builder.selenium1.playback.isPaused;
}

/* Note: The callbacks are only used if there is not yet a playback session underway. Otherwise the callbacks from that session remain in place. */
builder.selenium1.playback.continueTestBetween = function(start_step_id, end_step_id, thePostPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback) {
  if (builder.selenium1.playback.hasPlaybackSession()) {
    BrowserBot.enableInterception = true;
    builder.selenium1.playback.isPaused = false;
    if (end_step_id) {
      builder.selenium1.playback.end_step_index = builder.selenium1.playback.wholeScript.getStepIndexForID(end_step_id);
    } else {
      builder.selenium1.playback.end_step_index = -1;
    }
    if (start_step_id) {
      builder.selenium1.playback.step_index = builder.selenium1.playback.wholeScript.getStepIndexForID(start_step_id);
    }
    builder.selenium1.playback.play_step(builder.selenium1.playback.script[builder.selenium1.playback.step_index]);
  } else {
    builder.selenium1.playback.runTestBetween(start_step_id, end_step_id, thePostPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback);
  }
}

/**
 * Plays the current script from a particular step.
 * @param start_step_id The ID of the step to start playing on, or 0 to start at the beginning
 * @param end_step_id The ID of the step to end playing on (inclusive) or 0 to play till the end
 * @param thePostPlayCallback Optional callback to call after the run
 */
builder.selenium1.playback.runTestBetween = function(start_step_id, end_step_id, thePostPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback, initialVars) {
  if (builder.selenium1.playback.hasPlaybackSession()) { return; }
  
  // BrowserBot does a bad thing where it permanently replaces the popup handlers for pages. So
  // I've added a global flag to control whether it just forwards to the original handlers or not.
  BrowserBot.enableInterception = true;
  
  builder.selenium1.playback.speed = 0;
  builder.selenium1.playback.isPaused = false;
  
  builder.selenium1.playback.stopRequest = false;
  
  builder.selenium1.playback.postPlayCallback   = thePostPlayCallback || function() {};
  builder.selenium1.playback.jobStartedCallback = jobStartedCallback  || function() {};
  builder.selenium1.playback.stepStateCallback  = stepStateCallback   || function() {};
  builder.selenium1.playback.runPausedCallback  = runPausedCallback   || function() {};
  builder.selenium1.playback.playResult = {success: true};
  
  // Need to recreate the playback system, as it may be bound to the wrong tab. This happens
  // when the recorder tab is closed and subsequently reopened.
  builder.selenium1.playback.handler = new CommandHandlerFactory();
  builder.selenium1.playback.browserbot = new MozillaBrowserBot(window.bridge.getRecordingWindow());
  builder.selenium1.playback.selenium = new Selenium(builder.selenium1.playback.browserbot);
  builder.selenium1.playback.handler.registerAll(builder.selenium1.playback.selenium);
  
  builder.selenium1.playback.wholeScript = builder.getScript();
  builder.selenium1.playback.script = builder.getScript().steps;
  builder.selenium1.playback.browserbot.baseUrl = builder.selenium1.adapter.findBaseUrl(builder.selenium1.playback.wholeScript);
  
  builder.selenium1.playback.step_index = 0;
  builder.selenium1.playback.end_step_index = -1;
  
  if (start_step_id) {
    for (i = 0; i < builder.selenium1.playback.script.length; i++) {
      if (builder.selenium1.playback.script[i].id === start_step_id) {
        builder.selenium1.playback.step_index = i;
      }
    }
  }
  
  if (end_step_id) {
    for (i = 0; i < builder.selenium1.playback.script.length; i++) {
      if (builder.selenium1.playback.script[i].id === end_step_id) {
        builder.selenium1.playback.end_step_index = i;
      }
    }
  }
  
  if (builder.selenium1.playback.step_index == 0) {
    storedVars = new Object();
    if (initialVars) {
      for (var k in initialVars) {
        storedVars[k] = initialVars[k];
      }
    }
  }
  
  try {
    // To be able to manipulate dialogs, they must be of the original global style, not of the new
    // tab-level style. Hence, we store the correct pref and then force them to be old-style.
    builder.selenium2.playback.prompts_tab_modal_enabled = bridge.prefManager.getBoolPref("prompts.tab_modal.enabled");
    bridge.prefManager.setBoolPref("prompts.tab_modal.enabled", false);
  } catch (e) { /* old version? */ }
  
  // Because the Selenium 1 dialogs handling code appears to be broken, we piggyback on the working
  // Webdriver code instead. This means we need to init a Webdriver playback session.
  var handle = Components.classes["@googlecode.com/webdriver/fxdriver;1"].createInstance(Components.interfaces.nsISupports);
  var server = handle.wrappedJSObject;
  var driver = server.newDriver(window.bridge.getRecordingWindow());
  var iface = Components.classes['@googlecode.com/webdriver/command-processor;1'];
  builder.selenium2.playback.commandProcessor = iface.getService(Components.interfaces.nsICommandProcessor);
  // In order to communicate to webdriver which window we want, we need to uniquely identify the
  // window. The best way to do this I've found is to look for it by title. qqDPS This means that
  // the code in the command processor is modified from its baseline to notice the title_identifier
  // parameter and find the correct window.
  var original_title = window.bridge.getRecordingWindow().document.title;
  var title_identifier = "--" + new Date().getTime();
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
      builder.selenium2.playback.sessionId = JSON.parse(result).value;
      // By default, we want to accept all alerts.
      builder.selenium2.playback.execute("setModalHandling", { 'value': {'modalHandling': 'acceptAlert'} }, function(result) {
        builder.selenium1.playback.jobStartedCallback();
        builder.selenium1.playback.play_step(builder.selenium1.playback.script[builder.selenium1.playback.step_index]);
      });
    });
  };
  
  window.setTimeout(builder.selenium2.playback.sessionStartTimeout, 100);
};

/**
 * Plays the current script.
 * @param thePostPlayCallback Optional callback to call after the run
 */
builder.selenium1.playback.runTest = function(thePostPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback, initialVars) {
  if (builder.getScript().steps[0].type == builder.selenium1.stepTypes.open) {
    builder.deleteURLCookies(builder.getScript().steps[0].url);
  }
  builder.selenium1.playback.runTestBetween(0, 0, thePostPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback, initialVars);
};