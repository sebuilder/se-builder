/** Playback system for remote webdriver. */
builder.selenium2.rcPlayback = {};

builder.selenium2.rcPlayback.browserVersionAndPlatform = true;

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

builder.selenium2.rcPlayback.hostPort = null;
builder.selenium2.rcPlayback.browserstring = null;
builder.selenium2.rcPlayback.sessionID = null;
builder.selenium2.rcPlayback.currentStepIndex = -1;
builder.selenium2.rcPlayback.currentStep = null;
builder.selenium2.rcPlayback.script = null;
builder.selenium2.rcPlayback.requestStop = false;
builder.selenium2.rcPlayback.playResult = null;
builder.selenium2.rcPlayback.vars = {};
/** What interval to check waits for. */
builder.selenium2.rcPlayback.waitIntervalAmount = 100;
/** How many wait cycles are run before waits time out. */
builder.selenium2.rcPlayback.maxWaitCycles = 100;
/** How many wait cycles have been run. */
builder.selenium2.rcPlayback.waitCycle = 0;
/** The wait timeout. */
builder.selenium2.rcPlayback.waitTimeout = null;
/** The wait timeout function. Not using interval to prevent overlapping */
builder.selenium2.rcPlayback.waitFunction = null;
/** The pause incrementor. */
builder.selenium2.rcPlayback.pauseCounter = 0;
/** The pause interval. */
builder.selenium2.rcPlayback.pauseInterval = null;

builder.selenium2.rcPlayback.run = function(hostPort, browserstring, browserversion, platform, postRunCallback, jobStartedCallback) {
  jQuery('#steps-top')[0].scrollIntoView(false);
  jQuery('#edit-rc-playing').show();
  jQuery('#edit-rc-stopping').hide();
  builder.selenium2.rcPlayback.requestStop = false;
  builder.selenium2.rcPlayback.playResult = { success: false };
  builder.selenium2.rcPlayback.hostPort = hostPort;
  builder.selenium2.rcPlayback.browserstring = browserstring;
  builder.selenium2.rcPlayback.currentStepIndex = -1;
  builder.selenium2.rcPlayback.currentStep = null;
  builder.selenium2.rcPlayback.script = builder.getScript();
  builder.selenium2.rcPlayback.vars = {};
  builder.selenium2.rcPlayback.postRunCallback = postRunCallback;
  builder.selenium2.rcPlayback.jobStartedCallback = jobStartedCallback;
  builder.views.script.clearResults();
  jQuery('#edit-clearresults-span').show();
  builder.selenium2.rcPlayback.sessionID = null;
  jQuery('#edit-rc-connecting').show();
  var name = _t('sel2_untitled_run');
  if (builder.selenium2.rcPlayback.script.path) {
    var name = builder.selenium2.rcPlayback.script.path.path.split("/");
    name = name[name.length - 1];
    name = name.split(".")[0];
  }
  name = "Selenium Builder " + browserstring + " " + (browserversion ? browserversion + " " : "") + (platform ? platform + " " : "") + name;
  builder.selenium2.rcPlayback.send(
    "POST",
    "",
    JSON.stringify({"desiredCapabilities":{
      "name": name,
      "browserName":browserstring||"firefox",
      "version":browserversion||"",
      "platform":platform||"ANY"}}),
    builder.selenium2.rcPlayback.startJob);
};

/**
 * Selenium server appends a series of null characters to its JSON responses - here we cut 'em off.
 */
builder.selenium2.rcPlayback.fixServerResponse = function(t) {
  var i = 0;
  for (; i < t.length; i++) {
    if (t.charCodeAt(i) == 0) {
      break;
    }
  }
  
  return t.substring(0, i);
};

builder.selenium2.rcPlayback.parseServerResponse = function(t) {
  t = builder.selenium2.rcPlayback.fixServerResponse(t);
  if (t.length == 0) {
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

builder.selenium2.rcPlayback.startJob = function(response) {
  if (builder.selenium2.rcPlayback.jobStartedCallback) {
    builder.selenium2.rcPlayback.jobStartedCallback(response);
  }
  builder.selenium2.rcPlayback.sessionID = response.sessionId;
  builder.selenium2.rcPlayback.playResult.success = true;
  builder.selenium2.rcPlayback.send("POST", "/timeouts/implicit_wait", JSON.stringify({'ms':60000}), function(response) {
    jQuery('#edit-rc-connecting').hide();
    builder.selenium2.rcPlayback.playNextStep();
  });
};

builder.selenium2.rcPlayback.playNextStep = function() {
  builder.selenium2.rcPlayback.currentStepIndex++;
  if (!builder.selenium2.rcPlayback.requestStop &&
    builder.selenium2.rcPlayback.currentStepIndex < builder.selenium2.rcPlayback.script.steps.length)
  {
    builder.selenium2.rcPlayback.currentStep = builder.selenium2.rcPlayback.script.steps[builder.selenium2.rcPlayback.currentStepIndex];
    jQuery('#' + builder.selenium2.rcPlayback.currentStep.id + '-content').css('background-color', '#ffffaa');
    builder.selenium2.rcPlayback.currentStep.outcome = "playing";
    builder.selenium2.rcPlayback.types[builder.selenium2.rcPlayback.currentStep.type.getName()](builder.selenium2.rcPlayback.currentStep);
  } else {
    builder.selenium2.rcPlayback.shutdown();
  }
};

builder.selenium2.rcPlayback.shutdown = function() {
  // Finish session.
  jQuery('#edit-rc-connecting').hide();
  builder.selenium2.rcPlayback.send("DELETE", "", "", function() {
    jQuery('#edit-rc-playing').hide();
    jQuery('#edit-rc-stopping').hide();
    if (builder.selenium2.rcPlayback.postRunCallback) {
      builder.selenium2.rcPlayback.postRunCallback(builder.selenium2.rcPlayback.playResult);
    }
  }, function() {
    jQuery('#edit-rc-playing').hide();
    jQuery('#edit-rc-stopping').hide();
    if (builder.selenium2.rcPlayback.postRunCallback) {
      builder.selenium2.rcPlayback.postRunCallback(builder.selenium2.rcPlayback.playResult);
    }
  });
};

builder.selenium2.rcPlayback.stopTest = function() {
  builder.selenium2.rcPlayback.requestStop = true;
  jQuery('#edit-rc-playing').hide();
  jQuery('#edit-rc-stopping').show();
};

builder.selenium2.rcPlayback.hasError = function(response) {
  return !!response.status; // So undefined and 0 are fine.
};

builder.selenium2.rcPlayback.handleError = function(response, errorThrown) {
  var err = _t('sel2_server_error');;
  if (errorThrown) { err += ": " + errorThrown; }
  if (response.value && response.value.message) {
    err += ": " + response.value.message.substring(0, 256);
  }
  builder.selenium2.rcPlayback.recordError(err);
};

builder.selenium2.rcPlayback.recordError = function(err) {
  if (builder.selenium2.rcPlayback.currentStepIndex === -1) {
    // If we can't connect to the server right at the start, just attach the error message to the
    // first step.
    builder.selenium2.rcPlayback.currentStepIndex = 0;
  } else {
    if (builder.selenium2.rcPlayback.currentStep.negated && builder.selenium2.rcPlayback.currentStep.type.getName().startsWith("assert")) {
      // Record this as a failed result instead - this way it will be turned into a successful result
      // by recordResult.
      builder.selenium2.rcPlayback.recordResult({success: false});
      return;
    } 
  }
  jQuery("#" + builder.selenium2.rcPlayback.script.steps[builder.selenium2.rcPlayback.currentStepIndex].id + '-content').css('background-color', '#ff3333');
  builder.selenium2.rcPlayback.script.steps[builder.selenium2.rcPlayback.currentStepIndex].outcome = "error";
  jQuery("#" + builder.selenium2.rcPlayback.script.steps[builder.selenium2.rcPlayback.currentStepIndex].id + "-error").html(err).show();
  builder.selenium2.rcPlayback.script.steps[builder.selenium2.rcPlayback.currentStepIndex].failureMessage = err;
  builder.selenium2.rcPlayback.playResult.success = false;
  builder.selenium2.rcPlayback.playResult.errormessage = err;
  
  builder.selenium2.rcPlayback.shutdown();
};

builder.selenium2.rcPlayback.send = function(http_method, path, msg, callback, errorCallback) {
  var url = null;
  if (builder.selenium2.rcPlayback.sessionID) {
    url = "http://" + builder.selenium2.rcPlayback.hostPort + "/wd/hub/session/" + builder.selenium2.rcPlayback.sessionID + path;
  } else {
    url = "http://" + builder.selenium2.rcPlayback.hostPort + "/wd/hub/session";
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
        callback(builder.selenium2.rcPlayback.parseServerResponse(t));
      } else {
        builder.selenium2.rcPlayback.recordResult({'success': true});
      }
    },
    error: function(xhr, textStatus, errorThrown) {
      var response = builder.selenium2.rcPlayback.parseServerResponse(xhr.responseText);
      if (errorCallback) {
        errorCallback(response);
      } else {
        builder.selenium2.rcPlayback.handleError(response, errorThrown);
      }
    }
  });
};

/** Performs ${variable} substitution for parameters. */
builder.selenium2.rcPlayback.param = function(pName) {
  var output = "";
  var hasDollar = false;
  var insideVar = false;
  var varName = "";
  var text = builder.selenium2.rcPlayback.currentStep.type.getParamType(pName) == "locator" ? builder.selenium2.rcPlayback.currentStep[pName].getValue() : builder.selenium2.rcPlayback.currentStep[pName];
  for (var i = 0; i < text.length; i++) {
    var ch = text.substring(i, i + 1);
    if (insideVar) {
      if (ch == "}") {
        if (builder.selenium2.rcPlayback.vars[varName] == undefined) {
          throw "Variable not set: " + varName + ".";
        }
        output += builder.selenium2.rcPlayback.vars[varName];
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

  return builder.selenium2.rcPlayback.currentStep.type.getParamType(pName) == "locator" ? {"using": builder.selenium2.rcPlayback.currentStep[pName].getName(builder.selenium2), "value": output} : output;
};

builder.selenium2.rcPlayback.print = function(text) {
  jQuery('#' + builder.selenium2.rcPlayback.currentStep.id + '-message').show().append(newNode('span', text));
};

builder.selenium2.rcPlayback.recordResult = function(result) {
  if (builder.selenium2.rcPlayback.currentStep.negated) {
    result.message = builder.selenium2.rcPlayback.currentStep.type.getName() + " " + _t('sel2_is') + " " + result.success;
    result.success = !result.success;
  }
  if (result.success) {
    jQuery('#' + builder.selenium2.rcPlayback.currentStep.id + '-content').css('background-color', '#bfee85');
    builder.selenium2.rcPlayback.currentStep.outcome = "success";
  } else {
    jQuery('#' + builder.selenium2.rcPlayback.currentStep.id + '-content').css('background-color', '#ffcccc');
    builder.selenium2.rcPlayback.playResult.success = false;
    builder.selenium2.rcPlayback.currentStep.outcome = "failure";
    if (result.message) {
      jQuery('#' + builder.selenium2.rcPlayback.currentStep.id + '-message').html(result.message).show();
      builder.selenium2.rcPlayback.playResult.errormessage = result.message;
      builder.selenium2.rcPlayback.currentStep.failureMessage = result.message;
    }
  }

  builder.selenium2.rcPlayback.playNextStep();
};

builder.selenium2.rcPlayback.findElement = function(locator, callback, errorCallback) {
  builder.selenium2.rcPlayback.send("POST", "/element", JSON.stringify(locator),
    function(response) {
      if (builder.selenium2.rcPlayback.hasError(response)) {
        if (errorCallback) {
          errorCallback(response);
        } else {
          builder.selenium2.rcPlayback.handleError(response);
        }
      } else {
        if (callback) {
          callback(response.value.ELEMENT);
        } else {
          builder.selenium2.rcPlayback.recordResult({success: true});
        }
      }
    }
  );
};

builder.selenium2.rcPlayback.findElements = function(locator, callback, errorCallback) {
  builder.selenium2.rcPlayback.send("POST", "/elements", JSON.stringify(locator),
    function(response) {
      if (builder.selenium2.rcPlayback.hasError(response)) {
        if (errorCallback) {
          errorCallback(response);
        } else {
          builder.selenium2.rcPlayback.handleError(response);
        }
      } else {
        if (callback) {
          var elids = [];
          for (var i = 0; i < response.value.length; i++) {
            elids.push(response.value[i].ELEMENT);
          }
          callback(elids);
        } else {
          builder.selenium2.rcPlayback.recordResult({success: true});
        }
      }
    }
  );
};

/** Repeatedly calls testFunction, allowing it to tell us if it was successful. */
builder.selenium2.rcPlayback.wait = function(testFunction) {
  builder.stepdisplay.setProgressBar(builder.selenium2.rcPlayback.currentStep.id, 0);
  builder.selenium2.rcPlayback.waitCycle = 0;
  // Using a timeout that keeps on re-installing itself rather than an interval to prevent
  // the case where the request takes longer than the timeout and requests overlap.
  builder.selenium2.rcPlayback.waitFunction = function() {
    testFunction(function(success) {
      if (success != builder.selenium2.rcPlayback.currentStep.negated) {
        builder.stepdisplay.hideProgressBar(builder.selenium2.rcPlayback.currentStep.id);
        builder.selenium2.rcPlayback.recordResult({'success': success});
        return;
      }
      if (builder.selenium2.rcPlayback.waitCycle++ >= builder.selenium2.rcPlayback.maxWaitCycles) {
        builder.stepdisplay.hideProgressBar(builder.selenium2.rcPlayback.currentStep.id);
        builder.selenium2.rcPlayback.recordError("Wait timed out.");
        return;
      }
      if (builder.selenium2.rcPlayback.stopRequest) {
        builder.stepdisplay.hideProgressBar(builder.selenium2.rcPlayback.currentStep.id);
        builder.selenium2.rcPlayback.shutdown();
        return;
      }
      builder.stepdisplay.setProgressBar(builder.selenium2.rcPlayback.currentStep.id, builder.selenium2.rcPlayback.waitCycle * 100 / builder.selenium2.rcPlayback.maxWaitCycles);
      builder.selenium2.rcPlayback.waitTimeout = window.setTimeout(
        builder.selenium2.rcPlayback.waitFunction,
        builder.selenium2.rcPlayback.waitIntervalAmount
      );
    });
  };
  builder.selenium2.rcPlayback.waitTimeout = window.setTimeout(builder.selenium2.rcPlayback.waitFunction, 1);
};

builder.selenium2.rcPlayback.types = {};

builder.selenium2.rcPlayback.types.pause = function(step) {
  builder.selenium2.rcPlayback.pauseCounter = 0;
  var max = builder.selenium2.rcPlayback.param("waitTime") / 100;
  builder.stepdisplay.showProgressBar(step.id);
  builder.selenium2.rcPlayback.pauseInterval = setInterval(function() {
    if (builder.selenium2.rcPlayback.requestStop) {
      window.clearInterval(builder.selenium2.rcPlayback.pauseInterval);
      builder.stepdisplay.hideProgressBar(builder.selenium2.rcPlayback.currentStep.id);
      builder.selenium2.rcPlayback.shutdown();
      return;
    }
    builder.selenium2.rcPlayback.pauseCounter++;
    builder.stepdisplay.setProgressBar(step.id, 100 * builder.selenium2.rcPlayback.pauseCounter / max);
    if (builder.selenium2.rcPlayback.pauseCounter >= max) {
      window.clearInterval(builder.selenium2.rcPlayback.pauseInterval);
      builder.stepdisplay.hideProgressBar(builder.selenium2.rcPlayback.currentStep.id);
      builder.selenium2.rcPlayback.recordResult({success: true});
    }
  }, 100);
};

builder.selenium2.rcPlayback.types.print = function(step) {
  builder.selenium2.rcPlayback.print(builder.selenium2.rcPlayback.param("text"));
  builder.selenium2.rcPlayback.recordResult({success: true});
};

builder.selenium2.rcPlayback.types.store = function(step) {
  builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = builder.selenium2.rcPlayback.param("text");
  builder.selenium2.rcPlayback.recordResult({success: true});
};

builder.selenium2.rcPlayback.types.get = function(step) {
  var url = builder.selenium2.rcPlayback.param("url");
  builder.selenium2.rcPlayback.send("POST", "/url", JSON.stringify({'url': url}));
};

builder.selenium2.rcPlayback.types.goBack = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/back", "");
};

builder.selenium2.rcPlayback.types.goForward = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/forward", "");
};

builder.selenium2.rcPlayback.types.refresh = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/refresh", "");
};

builder.selenium2.rcPlayback.types.clickElement = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/click", "");
  });
};

builder.selenium2.rcPlayback.types.doubleClickElement = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/click", "", function(response) {
      builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/click", "");
    });
  });
};

builder.selenium2.rcPlayback.types.mouseOverElement = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("POST", "/moveto", JSON.stringify({
      'element': id
    }));
  });
};

builder.selenium2.rcPlayback.types.submitElement = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/submit", "");
  });
};

builder.selenium2.rcPlayback.types.setElementText = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/click", "", function(response) {
      builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/clear", "", function(response) {
        builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/value", JSON.stringify({
          'value': [builder.selenium2.rcPlayback.param("text")]
        }));
      });
    });
  });
};

builder.selenium2.rcPlayback.types.sendKeysToElement = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/click", "", function(response) {
      builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/value", JSON.stringify({
        'value': [builder.selenium2.rcPlayback.param("text")]
      }));
    });
  });
};

builder.selenium2.rcPlayback.types.setElementSelected = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/selected", "", function(response) {
      if (response.value) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/click", "");
      }
    });
  });
};

builder.selenium2.rcPlayback.types.setElementNotSelected = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/selected", "", function(response) {
      if (!response.value) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/click", "");
      }
    });
  });
};

builder.selenium2.rcPlayback.types.clearSelections = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("POST", "/element/" + id + "/elements", JSON.stringify({'using': 'tag name', 'value': 'option'}), function(response) {
      var ids = response.value;
      function deselect(i) {
        if (i >= ids.length) {
          builder.selenium2.rcPlayback.recordResult({success: true});
        } else {
          builder.selenium2.rcPlayback.send("GET", "/element/" + ids[i].ELEMENT + "/selected", "", function(response) {
            if (response.value) {
              builder.selenium2.rcPlayback.send("POST", "/element/" + ids[i].ELEMENT + "/click", "", function(response) {
                deselect(i + 1);
              });
            } else {
              deselect(i + 1);
            }
          });
        }
      }
      deselect(0);
    });
  });
};

builder.selenium2.rcPlayback.types.verifyTextPresent = function(step) {
  builder.selenium2.rcPlayback.findElement({'using': 'tag name', 'value': 'body'}, function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
      if (response.value.indexOf(builder.selenium2.rcPlayback.param("text")) != -1) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_text_not_present', builder.selenium2.rcPlayback.param("text"))});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertTextPresent = function(step) {
  builder.selenium2.rcPlayback.findElement({'using': 'tag name', 'value': 'body'}, function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
      if (response.value.indexOf(builder.selenium2.rcPlayback.param("text")) != -1) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(_t('sel2_text_not_present', builder.selenium2.rcPlayback.param("text")));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForTextPresent = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.findElement({'using': 'tag name', 'value': 'body'}, function(id) {
      builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
        callback(response.value.indexOf(builder.selenium2.rcPlayback.param("text")) != -1);
      }, /*error*/ function() { callback(false); });
    }, /*error*/ function() { callback(false); });
  });
};

builder.selenium2.rcPlayback.types.storeTextPresent = function(step) {
  builder.selenium2.rcPlayback.findElement({'using': 'tag name', 'value': 'body'}, function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
      builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value.indexOf(builder.selenium2.rcPlayback.param("text")) != -1;
      builder.selenium2.rcPlayback.recordResult({success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.verifyBodyText = function(step) {
  builder.selenium2.rcPlayback.findElement({'using': 'tag name', 'value': 'body'}, function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
      if (response.value == builder.selenium2.rcPlayback.param("text")) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_body_text_does_not_match', builder.selenium2.rcPlayback.param("text"))});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertBodyText = function(step) {
  builder.selenium2.rcPlayback.findElement({'using': 'tag name', 'value': 'body'}, function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
      if (response.value == builder.selenium2.rcPlayback.param("text")) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(_t('sel2_body_text_does_not_match', builder.selenium2.rcPlayback.param("text")));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForBodyText = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.findElement({'using': 'tag name', 'value': 'body'}, function(id) {
      builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
        callback(response.value == builder.selenium2.rcPlayback.param("text"));
      }, /*error*/ function() { callback(false); });
    }, /*error*/ function() { callback(false); });
  });
};

builder.selenium2.rcPlayback.types.storeBodyText = function(step) {
  builder.selenium2.rcPlayback.findElement({'using': 'tag name', 'value': 'body'}, function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
      builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value;
      builder.selenium2.rcPlayback.recordResult({success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.verifyElementPresent = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.recordResult({success: true});
  }, function() {
    builder.selenium2.rcPlayback.recordResult({success: false});
  });
};

builder.selenium2.rcPlayback.types.assertElementPresent = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.recordResult({success: true});
  }, function() {
    builder.selenium2.rcPlayback.recordError(_t('sel2_element_not_found'));
  });
};

builder.selenium2.rcPlayback.types.waitForElementPresent = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
      callback(true);
    }, function() {
      callback(false);
    });
  });
};

builder.selenium2.rcPlayback.types.storeElementPresent = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = true;
    builder.selenium2.rcPlayback.recordResult({success: true});
  }, function() {
    builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = false;
    builder.selenium2.rcPlayback.recordResult({success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyPageSource = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/source", "", function(response) {
    if (response.value == builder.selenium2.rcPlayback.param("source")) {
      builder.selenium2.rcPlayback.recordResult({success: true});
    } else {
      builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_source_does_not_match')});
    }
  });
};

builder.selenium2.rcPlayback.types.assertPageSource = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/source", "", function(response) {
    if (response.value == builder.selenium2.rcPlayback.param("source")) {
      builder.selenium2.rcPlayback.recordResult({success: true});
    } else {
      builder.selenium2.rcPlayback.recordError(_t('sel2_source_does_not_match'));
    }
  });
};

builder.selenium2.rcPlayback.types.waitForPageSource = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.send("GET", "/source", "", function(response) {
      callback(response.value == builder.selenium2.rcPlayback.param("source"));
    });
  });
};

builder.selenium2.rcPlayback.types.storePageSource = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/source", "", function(response) {
    builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value;
    builder.selenium2.rcPlayback.recordResult({success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyText = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
      if (response.value == builder.selenium2.rcPlayback.param("text")) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_element_text_does_not_match', response.value, builder.selenium2.rcPlayback.param("text"))});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertText = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
      if (response.value == builder.selenium2.rcPlayback.param("text")) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(_t('sel2_element_text_does_not_match', response.value, builder.selenium2.rcPlayback.param("text")));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForText = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
      builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
        callback(response.value == builder.selenium2.rcPlayback.param("text"));
      }, /*error*/ function() { callback(false); });
    }, /*error*/ function() { callback(false); });
  });
};

builder.selenium2.rcPlayback.types.storeText = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/text", "", function(response) {
      builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value;
      builder.selenium2.rcPlayback.recordResult({success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.verifyCurrentUrl = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/url", "", function(response) {
    if (response.value == builder.selenium2.rcPlayback.param("url")) {
      builder.selenium2.rcPlayback.recordResult({success: true});
    } else {
      builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_url_does_not_match', response.value, builder.selenium2.rcPlayback.param("url"))});
    }
  });
};

builder.selenium2.rcPlayback.types.assertCurrentUrl = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/url", "", function(response) {
    if (response.value == builder.selenium2.rcPlayback.param("url")) {
      builder.selenium2.rcPlayback.recordResult({success: true});
    } else {
      builder.selenium2.rcPlayback.recordError(_t('sel2_url_does_not_match', response.value, builder.selenium2.rcPlayback.param("url")));
    }
  });
};

builder.selenium2.rcPlayback.types.waitForCurrentUrl = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.send("GET", "/url", "", function(response) {
      callback(response.value == builder.selenium2.rcPlayback.param("url"));
    });
  });
};

builder.selenium2.rcPlayback.types.storeCurrentUrl = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/url", "", function(response) {
    builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value;
    builder.selenium2.rcPlayback.recordResult({success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyTitle = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/title", "", function(response) {
    if (response.value == builder.selenium2.rcPlayback.param("title")) {
      builder.selenium2.rcPlayback.recordResult({success: true});
    } else {
      builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_title_does_not_match', response.value, builder.selenium2.rcPlayback.param("title"))});
    }
  });
};

builder.selenium2.rcPlayback.types.assertTitle = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/title", "", function(response) {
    if (response.value == builder.selenium2.rcPlayback.param("title")) {
      builder.selenium2.rcPlayback.recordResult({success: true});
    } else {
      builder.selenium2.rcPlayback.recordError(_t('sel2_title_does_not_match', response.value, builder.selenium2.rcPlayback.param("title")));
    }
  });
};

builder.selenium2.rcPlayback.types.waitForTitle = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.send("GET", "/title", "", function(response) {
      callback(response.value == builder.selenium2.rcPlayback.param("title"));
    });
  });
};

builder.selenium2.rcPlayback.types.storeTitle = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/title", "", function(response) {
    builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value;
    builder.selenium2.rcPlayback.recordResult({success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyElementSelected = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/selected", "", function(response) {
      if (response.value) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_element_not_selected')});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertElementSelected = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/selected", "", function(response) {
      if (response.value) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(_t('sel2_element_not_selected'));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForElementSelected = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
      builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/selected", "", function(response) {
        callback(response.value);
      }, /*error*/ function() { callback(false); });
    }, /*error*/ function() { callback(false); });
  });
};

builder.selenium2.rcPlayback.types.storeElementSelected = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/selected", "", function(response) {
      builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value;
      builder.selenium2.rcPlayback.recordResult({success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.verifyElementValue = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/attribute/value", "", function(response) {
      if (response.value == builder.selenium2.rcPlayback.param("value")) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_element_value_doesnt_match', response.value, builder.selenium2.rcPlayback.param("value"))});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertElementValue = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/attribute/value", "", function(response) {
      if (response.value == builder.selenium2.rcPlayback.param("value")) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(_t('sel2_element_value_doesnt_match', response.value, builder.selenium2.rcPlayback.param("value")));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForElementValue = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
      builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/attribute/value", "", function(response) {
        callback(response.value == builder.selenium2.rcPlayback.param("value"));
      }, /*error*/ function() { callback(false); });
    }, /*error*/ function() { callback(false); });
  });
};

builder.selenium2.rcPlayback.types.storeElementValue = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/attribute/value", "", function(response) {
      builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value;
      builder.selenium2.rcPlayback.recordResult({success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.verifyElementAttribute = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/attribute/" + builder.selenium2.rcPlayback.param("attributeName"), "", function(response) {
      if (response.value == builder.selenium2.rcPlayback.param("value")) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_attribute_value_doesnt_match', builder.selenium2.rcPlayback.param("attributeName"), response.value, builder.selenium2.rcPlayback.param("value"))});
      }
    });
  });
};

builder.selenium2.rcPlayback.types.assertElementAttribute = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/attribute/" + builder.selenium2.rcPlayback.param("attributeName"), "", function(response) {
      if (response.value == builder.selenium2.rcPlayback.param("value")) {
        builder.selenium2.rcPlayback.recordResult({success: true});
      } else {
        builder.selenium2.rcPlayback.recordError(_t('sel2_attribute_value_doesnt_match', builder.selenium2.rcPlayback.param("attributeName"), response.value, builder.selenium2.rcPlayback.param("value")));
      }
    });
  });
};

builder.selenium2.rcPlayback.types.waitForElementAttribute = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
      builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/attribute/" + builder.selenium2.rcPlayback.param("attributeName"), "", function(response) {
        callback(response.value == builder.selenium2.rcPlayback.param("value"));
      }, /*error*/ function() { callback(false); });
    }, /*error*/ function() { callback(false); });
  });
};

builder.selenium2.rcPlayback.types.storeElementAttribute = function(step) {
  builder.selenium2.rcPlayback.findElement(builder.selenium2.rcPlayback.param("locator"), function(id) {
    builder.selenium2.rcPlayback.send("GET", "/element/" + id + "/attribute/" + builder.selenium2.rcPlayback.param("attributeName"), "", function(response) {
      builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value;
      builder.selenium2.rcPlayback.recordResult({success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.deleteCookie = function(step) {
  builder.selenium2.rcPlayback.send("DELETE", "/cookie/" + builder.selenium2.rcPlayback.param("name"), "");
};

builder.selenium2.rcPlayback.types.addCookie = function(step) {
  var cookie = {
    'name': builder.selenium2.rcPlayback.param("name"),
    'value': builder.selenium2.rcPlayback.param("value"),
    'secure': false,
    'path': '/',
    'class': 'org.openqa.selenium.Cookie'
  };
  var opts = builder.selenium2.rcPlayback.param("options").split(",");
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
  builder.selenium2.rcPlayback.send("POST", "/cookie", JSON.stringify({'cookie': cookie}));
};

builder.selenium2.rcPlayback.types.verifyCookieByName = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/cookie", "", function(response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param("name")) {
        if (response.value[i].value == builder.selenium2.rcPlayback.param("value")) {
          builder.selenium2.rcPlayback.recordResult({success: true});
        } else {
          builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_cookie_value_doesnt_match', builder.selenium2.rcPlayback.param("name"), response.value[i].value, builder.selenium2.rcPlayback.param("value"))});
        }
        return;
      }
    }
    builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_no_cookie_found', builder.selenium2.rcPlayback.param("name"))});
  });
};

builder.selenium2.rcPlayback.types.assertCookieByName = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/cookie", "", function(response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param("name")) {
        if (response.value[i].value == builder.selenium2.rcPlayback.param("value")) {
          builder.selenium2.rcPlayback.recordResult({success: true});
        } else {
          builder.selenium2.rcPlayback.recordError(_t('sel2_cookie_value_doesnt_match', builder.selenium2.rcPlayback.param("name"), response.value[i].value, builder.selenium2.rcPlayback.param("value")));
        }
        return;
      }
    }
    builder.selenium2.rcPlayback.recordError(_t('sel2_no_cookie_found', builder.selenium2.rcPlayback.param("name")));
  });
};

builder.selenium2.rcPlayback.types.waitForCookieByName = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.send("GET", "/cookie", "", function(response) {
      for (var i = 0; i < response.value.length; i++) {
        if (response.value[i].name == builder.selenium2.rcPlayback.param("name")) {
          callback(response.value[i].value == builder.selenium2.rcPlayback.param("value"));
          return;
        }
      }
      callback(false);
    }, function() {
      callback(false);
    });
  });
};

builder.selenium2.rcPlayback.types.storeCookieByName = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/cookie", "", function(response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param("name")) {
        builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value[i].value;
        builder.selenium2.rcPlayback.recordResult({success: true});
        return;
      }
    }
    builder.selenium2.rcPlayback.recordError(_t('sel2_no_cookie_found', builder.selenium2.rcPlayback.param("name")));
  });
};

builder.selenium2.rcPlayback.types.verifyCookiePresent = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/cookie", "", function(response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param("name")) {
        builder.selenium2.rcPlayback.recordResult({success: true});
        return;
      }
    }
    builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_no_cookie_found', builder.selenium2.rcPlayback.param("name"))});
  });
};

builder.selenium2.rcPlayback.types.assertCookiePresent = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/cookie", "", function(response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param("name")) {
        builder.selenium2.rcPlayback.recordResult({success: true});
        return;
      }
    }
    builder.selenium2.rcPlayback.recordError(_t('sel2_no_cookie_found', builder.selenium2.rcPlayback.param("name")));
  });
};

builder.selenium2.rcPlayback.types.waitForCookiePresent = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.send("GET", "/cookie", "", function(response) {
      for (var i = 0; i < response.value.length; i++) {
        if (response.value[i].name == builder.selenium2.rcPlayback.param("name")) {
          callback(true);
          return;
        }
      }
      callback(false);
    }, function() {
      callback(false);
    });
  });
};

builder.selenium2.rcPlayback.types.storeCookiePresent = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/cookie", "", function(response) {
    for (var i = 0; i < response.value.length; i++) {
      if (response.value[i].name == builder.selenium2.rcPlayback.param("name")) {
        builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = true;
        builder.selenium2.rcPlayback.recordResult({success: true});
        return;
      }
    }
    builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = false;
    builder.selenium2.rcPlayback.recordResult({success: true});
  });
};

builder.selenium2.rcPlayback.types.saveScreenshot = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/screenshot", "", function(response) {
    bridge.writeBinaryFile(builder.selenium2.rcPlayback.param("file"), bridge.decodeBase64(response.value));
    builder.selenium2.rcPlayback.recordResult({success: true});
  });
};

builder.selenium2.rcPlayback.types.switchToFrame = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/frame", JSON.stringify({'id': builder.selenium2.rcPlayback.param("identifier")}));
};

builder.selenium2.rcPlayback.types.switchToFrameByIndex = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/frame", JSON.stringify({'id': parseInt(builder.selenium2.rcPlayback.param("index"))}));
};

builder.selenium2.rcPlayback.types.switchToWindow = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/window", JSON.stringify({'name': builder.selenium2.rcPlayback.param("name")}));
};

builder.selenium2.rcPlayback.types.switchToDefaultContent = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/frame", JSON.stringify({'id': null}));
};

builder.selenium2.rcPlayback.types.verifyAlertText = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/alert_text", "", function(response) {
    if (response.value == builder.selenium2.rcPlayback.param("text")) {
      builder.selenium2.rcPlayback.recordResult({success: true});
    } else {
      builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_alert_text_does_not_match')});
    }
  });
};

builder.selenium2.rcPlayback.types.assertAlertText = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/alert_text", "", function(response) {
    if (response.value == builder.selenium2.rcPlayback.param("text")) {
      builder.selenium2.rcPlayback.recordResult({success: true});
    } else {
      builder.selenium2.rcPlayback.recordError(_t('sel2_alert_text_does_not_match', response.value, builder.selenium2.rcPlayback.param("text")));
    }
  });
};

builder.selenium2.rcPlayback.types.waitForAlertText = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.send("GET", "/alert_text", "", function(response) {
      callback(response.value == builder.selenium2.rcPlayback.param("text"));
    });
  });
};

builder.selenium2.rcPlayback.types.storeAlertText = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/alert_text", "", function(response) {
    builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value;
    builder.selenium2.rcPlayback.recordResult({success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyAlertPresent = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/alert_text", "", function(response) {
    builder.selenium2.rcPlayback.recordResult({success: true});
  }, function() {
    builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_no_alert_present')});
  });
};

builder.selenium2.rcPlayback.types.assertPresent = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/alert_text", "", function(response) {
    builder.selenium2.rcPlayback.recordResult({success: true});
  });
};

builder.selenium2.rcPlayback.types.waitForAlertPresent = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.send("GET", "/alert_text", "", function(response) {
      callback(true);
    }, function() {
      callback(false);
    });
  });
};

builder.selenium2.rcPlayback.types.storeAlertPresent = function(step) {
  builder.selenium2.rcPlayback.send("GET", "/alert_text", "", function(response) {
    builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = true;
    builder.selenium2.rcPlayback.recordResult({success: true});
  }, function() {
    builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = false;
    builder.selenium2.rcPlayback.recordResult({success: true});
  });
};

builder.selenium2.rcPlayback.types.answerAlert = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/alert_text", JSON.stringify({'text': builder.selenium2.rcPlayback.param("text")}), function(response) {
    builder.selenium2.rcPlayback.send("POST", "/accept_alert", "", function(response) {
      builder.selenium2.rcPlayback.recordResult({success: true});
    });
  });
};

builder.selenium2.rcPlayback.types.acceptAlert = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/accept_alert", "", function(response) {
    builder.selenium2.rcPlayback.recordResult({success: true});
  });
};

builder.selenium2.rcPlayback.types.dismissAlert = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/dismiss_alert", "", function(response) {
    builder.selenium2.rcPlayback.recordResult({success: true});
  });
};

builder.selenium2.rcPlayback.types.verifyEval = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/execute", JSON.stringify({'script': builder.selenium2.rcPlayback.param("script"), 'args': []}), function(response) {
    if (response.value == builder.selenium2.rcPlayback.param("value")) {
      builder.selenium2.rcPlayback.recordResult({success: true});
    } else {
      builder.selenium2.rcPlayback.recordResult({success: false, message: _t('sel2_eval_false', result.value, builder.selenium2.rcPlayback.param("value"))});
    }
  });
};

builder.selenium2.rcPlayback.types.assertEval = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/execute", JSON.stringify({'script': builder.selenium2.rcPlayback.param("script"), 'args': []}), function(response) {
    if (response.value == builder.selenium2.rcPlayback.param("value")) {
      builder.selenium2.rcPlayback.recordResult({success: true});
    } else {
      builder.selenium2.rcPlayback.recordError(_t('sel2_eval_false', response.value, builder.selenium2.rcPlayback.param("value")));
    }
  });
};

builder.selenium2.rcPlayback.types.waitForEval = function(step) {
  builder.selenium2.rcPlayback.wait(function(callback) {
    builder.selenium2.rcPlayback.send("POST", "/execute", JSON.stringify({'script': builder.selenium2.rcPlayback.param("script"), 'args': []}), function(response) {
      callback(response.value == builder.selenium2.rcPlayback.param("value"));
    }, function() {
      callback(false);
    });
  });
};

builder.selenium2.rcPlayback.types.storeEval = function(step) {
  builder.selenium2.rcPlayback.send("POST", "/execute", JSON.stringify({'script': builder.selenium2.rcPlayback.param("script"), 'args': []}), function(response) {
    builder.selenium2.rcPlayback.vars[builder.selenium2.rcPlayback.param("variable")] = response.value;
  });
};
