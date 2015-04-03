builder.views.script = {};

builder.views.script.clearResults = function() {
  var script = builder.getScript(), i;
  for (i = 0; i < script.steps.length; i++) {
    jQuery('#' + script.steps[i].id + '-content').css('background-color', 'white');
    jQuery('#' + script.steps[i].id + '-error').hide();
    jQuery('#' + script.steps[i].id + '-message').hide();  
    script.steps[i].outcome = null;
    script.steps[i].runmessage = null;
    script.steps[i].failureMessage = null;
  }
  jQuery('#edit-clearresults-span').hide();
  for (i = 0; i < builder.views.script.clearResultsListeners.length; i++) {
    builder.views.script.clearResultsListeners[i]();
  }
};

builder.views.script.onStartRCPlayback = function() {
  jQuery('#edit-continue-rc-playback').hide();
  jQuery('#steps-top')[0].scrollIntoView(false);
  jQuery('#edit-rc-playing').show();
  jQuery('#edit-rc-stopping').hide();
  builder.views.script.clearResults();
  jQuery('#edit-clearresults-span').show();
  jQuery('#edit-rc-connecting').show();
};

builder.views.script.onConnectionEstablished = function() {
  jQuery('#edit-rc-connecting').hide();
};

builder.views.script.onPauseRCPlayback = function() {
  jQuery('#edit-continue-rc-playback').show();
};

builder.views.script.onEndRCPlayback = function() {
  jQuery('#edit-rc-connecting').hide();
  jQuery('#edit-rc-playing').hide();
  jQuery('#edit-rc-stopping').hide();
};

builder.views.script.onStartLocalPlayback = function() {
  jQuery('#edit-continue-local-playback').hide();
  jQuery('#steps-top')[0].scrollIntoView(false);
  jQuery('#edit-editing').hide();
  jQuery('#edit-local-playing').show();
  builder.views.script.clearResults();
  jQuery('#edit-clearresults-span').show();
};

builder.views.script.onEndLocalPlayback = function() {
  jQuery('#edit-editing').show();
  jQuery('#edit-local-playing').hide();
};

builder.views.script.onPauseLocalPlayback = function() {
  jQuery('#edit-continue-local-playback').show();
};

builder.views.script.clearResultsListeners = [];

builder.views.script.addClearResultsListener = function(l) {
  builder.views.script.clearResultsListeners.push(l);
};

builder.views.script.removeClearResultsListener = function(l) {
  if (builder.views.script.clearResultsListeners.indexOf(l) !== -1) {
    builder.views.script.clearResultsListeners.splice(builder.views.script.clearResultsListeners.indexOf(l), 1);
  }
};

builder.views.script.show = function() {
  jQuery('#edit-panel, #steplist, #menu').show();
};

builder.views.script.hide = function() {
  jQuery('#edit-panel, #steplist, #menu').hide();
};

builder.registerPostLoadHook(function() {
  // Buttons visible while recording:
  jQuery('#record-stop-button').click(function (e) {
    builder.record.stop();
  });

  jQuery('#record-verify').click(function (e) {
    if (builder.record.verifyExploring) {
      builder.record.stopVerifyExploring();
    } else {
      builder.record.verifyExplore();
    }
  });
  
  // Current URL in heading
  jQuery('#record-url-display').click(function (e) {
    e.preventDefault();
  });

  // A "currently recording at" label in the interface 
  builder.pageState.addListener(function (url, loading) {
    jQuery('#record-url-display').attr('href', url).text(url);
  });
  
  // Stop playback buttons
  jQuery('#edit-stop-local-playback').click(function() {
    builder.getScript().seleniumVersion.playback.stopTest();
  });
  jQuery('#edit-stop-rc-playback').click(function() {
    var runs = builder.getScript().seleniumVersion.rcPlayback.getTestRuns();
    if (runs.length > 0) {
      jQuery('#edit-rc-playing').hide();
      jQuery('#edit-rc-stopping').show();
      builder.getScript().seleniumVersion.rcPlayback.stopTest(runs[0]);
    }
  });
  
  // Continue playback buttons
  jQuery('#edit-continue-local-playback').click(function() {
    jQuery('#edit-continue-local-playback').hide();
    builder.getScript().seleniumVersion.playback.continueTestBetween();
  }).hide();
  
  jQuery('#edit-continue-rc-playback').click(function() {
    jQuery('#edit-continue-rc-playback').hide();
    builder.getScript().seleniumVersion.rcPlayback.continueTests();
  }).hide();

  // Clear play results:
  jQuery('#edit-clearresults').click(function() {
    builder.views.script.clearResults();
    jQuery('#edit-clearresults-span').hide();
  });
  
  // Display the path of the script 
  builder.suite.addScriptChangeListener(function () {
    var path = builder.suite.hasScript() ? builder.getScript().path : null;
    if (path) {
      jQuery("#edit-test-script-nopath").hide();
      jQuery("#edit-test-script-path").show().html(
        "Currently editing: " + path.path
      );
    } else {
      jQuery("#edit-test-script-path").hide();
      jQuery("#edit-test-script-nopath").show();
    }
  });
  
  // Toggle recording mouseovers
  jQuery('#record-do-mouseovers-label').text(_t('record_mouseovers'));
  if (builder.doRecordMouseovers) { // TODO: Hunt down and [BAKE COOKIES FOR] whoever invented the checked attribute.
    jQuery('#record-do-mouseovers').attr('checked', "checked");
  } else {
    jQuery('#record-do-mouseovers').removeAttr('checked');
  }
  
  jQuery('#record-do-mouseovers').change(function() {
    builder.doRecordMouseovers = !!jQuery('#record-do-mouseovers').attr('checked');
    bridge.prefManager.setBoolPref("extensions.seleniumbuilder.doRecordMouseovers", builder.doRecordMouseovers);
  });
});



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
