/** Code for recording steps. */
builder.record = {};

builder.record.verifyExploring = false;
builder.record.verifyExplorer = null;

builder.record.recording = false;
builder.record.recorder = null;
builder.record.pageLoadListener = null;
builder.record.selenium1WaitsListener = null;
builder.record.selenium1WaitsListenerNoticedLoading = false;
builder.record.insertionIndex = 100000;
builder.record.lastRecordedStep = null;

/** Stop recorder or verify explorer currently running. */
builder.record.stopAll = function() {
  if (builder.record.verifyExploring) {
    builder.record.verifyExploring = false;
    builder.record.verifyExplorer.destroy();
    builder.record.verifyExplorer = null;
  }
  if (builder.record.recording) {
    builder.record.stop();
  }
};

/** Allows user to select a text whose presence should be verified. */
builder.record.verifyExplore = function() {
  builder.record.verifyExploring = true;
  builder.record.stop();
  jQuery('#record-panel').show();
  window.bridge.focusRecordingTab();
  builder.record.verifyExplorer = new builder.VerifyExplorer(
    window.bridge.getRecordingWindow(),
    builder.getScript().seleniumVersion,
    function(step) {
      builder.record.recordStep(step);
      // Don't immediately stop: this would cause the listener that prevents the click from
      // actually activating the selected element to be detached prematurely.
      setTimeout(function() { builder.record.stopVerifyExploring(); }, 1);
      window.bridge.focusRecorderWindow();
    }
  );
};

builder.record.stopVerifyExploring = function() {
  builder.record.verifyExploring = false;
  builder.record.verifyExplorer.destroy();
  builder.record.verifyExplorer = null;
  builder.record.continueRecording();
};

/** Whether a ends with b. */
function endsWith(a, b) {
  if (a.length < b.length) { return false; }
  return a.substring(a.length - b.length) === b;
}

builder.record.recordStep = function(step) {
  builder.record.lastRecordedStep = step;
  builder.getScript().insertStep(step, builder.record.insertionIndex);
  builder.record.insertionIndex++;
  builder.stepdisplay.update();
};

builder.record.getLastRecordedStep = function() {
  //if (builder.record.lastRecordedStep) {
  return builder.record.lastRecordedStep;
  /*} else if (builder.record.insertionIndex - 1 < builder.getScript().steps.length) {
    return builder.getScript().steps[builder.record.insertionIndex - 1];
  }
  return null;*/
};

builder.record.stop = function() {
  jQuery('#record-panel').hide();
  if (builder.record.recorder) { builder.record.recorder.destroy(); }
  builder.record.recorder = null;
  builder.pageState.removeListener(builder.record.pageLoadListener);
  if (builder.record.selenium1WaitsListener) {
    builder.pageState.removeListener(builder.record.selenium1WaitsListener);
    builder.record.selenium1WaitsListener = null;
  }
  builder.record.recording = false;
  builder.stepdisplay.update();
};

builder.record.continueRecording = function(insertionIndex) {
  jQuery('#record-panel').show();
  
  if (builder.getScript().seleniumVersion == builder.selenium2) {
    jQuery('#record-do-mouseovers-div').show();
  } else {
    jQuery('#record-do-mouseovers-div').hide();
  }
  
  if (insertionIndex !== undefined) {
    builder.record.insertionIndex = insertionIndex;
  }
  
  builder.record.lastRecordedStep = null;
  
  builder.record.recorder = builder.getScript().seleniumVersion.getRecorder(window.bridge.getRecordingWindow(), builder.record.recordStep, builder.record.getLastRecordedStep);
  
  builder.record.recording = true;
  
  builder.stepdisplay.update();
  
  var isLoading = false;
  builder.record.pageLoadListener = function(url, pageloading) {
    if (pageloading) {
      isLoading = true;
    } else {
      if (isLoading) {
        builder.record.recorder.destroy();
        var script = builder.getScript();
        // If we've navigated to this location manually, the URL has not yet been set, so we do
        // this now.
        var ls = script.getLastStep();
        if (ls && (ls.type === script.seleniumVersion.navigateToUrlStepType) && (ls.url || "") === "") {
          ls.url = window.bridge.getRecordingWindow().location + "";
          builder.stepdisplay.update();
        }
      
        builder.record.recorder = script.seleniumVersion.getRecorder(window.bridge.getRecordingWindow(), builder.record.recordStep, builder.record.getLastRecordedStep);
      }
      isLoading = false;
    }
  };
  builder.pageState.addListener(builder.record.pageLoadListener);
  
  if (builder.getScript().seleniumVersion === builder.selenium1) {
    builder.record.selenium1WaitsListenerNoticedLoading = false;
    builder.record.selenium1WaitsListener = function(url, pageloading) {
      if (pageloading && !builder.record.selenium1WaitsListenerNoticedLoading) {
        builder.record.selenium1WaitsListenerNoticedLoading = true;
        return;
      }
      if (builder.record.selenium1WaitsListenerNoticedLoading) {
        builder.record.recordStep(new builder.Step(builder.selenium1.stepTypes.waitForPageToLoad, "60000"));
        builder.record.selenium1WaitsListenerNoticedLoading = false;
        return;
      }
    };
    
    builder.pageState.addListener(builder.record.selenium1WaitsListener);
  }
};

builder.record.startRecording = function(urlText, seleniumVersion) {  
  var anchorIndex = urlText.indexOf('#');
  if (anchorIndex !== -1) {
    urlText = urlText.substring(0, anchorIndex);
  }
  var url = new builder.Url(urlText);

  if (!url.hostname() || urlText.substring(0, 6) === 'about:') {
    alert(_t('record_invalid_url'));
    jQuery("#startup-url").focus();
    return;
  }
    
  // Delete cookies for given URL.
  builder.deleteURLCookies(url.href());
  
  // Now load the page - both to ensure we're on the right page when we start recording
  // and to ensure that we get a clean page free of cookie influence.
  // Don't show the record interface until the new page has loaded.
  var isLoading = false;
  builder.record.pageLoadListener = function(urlText, pageloading) {
    var url = new builder.Url(urlText);
    if (pageloading) {
      isLoading = true;
      jQuery('#heading-record').addClass('is-on');
    } else {
      jQuery('#heading-record').removeClass('is-on');
      if (isLoading) {
        builder.record.recording = true;    
        builder.gui.switchView(builder.views.script);
        builder.suite.addScript(new builder.Script(seleniumVersion));
        builder.getScript().saveRequired = true;
        if (seleniumVersion === builder.selenium1) {
          builder.getScript().addStep(new builder.Step(builder.selenium1.stepTypes.open, url.href()));
          builder.record.recordStep(new builder.Step(builder.selenium1.stepTypes.waitForPageToLoad, "60000"));
        } else {
          builder.getScript().addStep(new builder.Step(builder.selenium2.stepTypes.get, url.href()));
        }
        builder.stepdisplay.update();
        builder.pageState.removeListener(builder.record.pageLoadListener);
        builder.record.continueRecording();
      }
      isLoading = false;
    }
  };
  builder.pageState.addListener(builder.record.pageLoadListener);
  window.bridge.getRecordingWindow().location = url.href();
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
