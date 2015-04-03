/**
 * Dialog that runs all scripts in the suite and keeps track of scripts being run.
 */
builder.dialogs.runall = {};
builder.dialogs.runall.dialog = null;

builder.dialogs.runall.versionToSettings = {};

builder.dialogs.runall.currentScriptOnly = false;
builder.dialogs.runall.currentRunIndex = -1;
builder.dialogs.runall.runs = [];

builder.dialogs.runall.info_p = null;
builder.dialogs.runall.scriptlist = null;
builder.dialogs.runall.stop_b = null;
builder.dialogs.runall.close_b = null;

builder.dialogs.runall.rc = false;
builder.dialogs.runall.requestStop = false;
builder.dialogs.runall.currentPlayback = null;

builder.dialogs.runall.running = false;
builder.dialogs.runall.currentRCRun = null;

builder.dialogs.runall.runRC = function(currentScriptOnly, versionToSettings) {
  builder.dialogs.runall.currentScriptOnly = currentScriptOnly;
  builder.dialogs.runall.versionToSettings = versionToSettings;
  builder.dialogs.runall.rc = true;
  builder.dialogs.runall.run();
};

builder.dialogs.runall.runLocally = function(currentScriptOnly) {
  builder.dialogs.runall.currentScriptOnly = currentScriptOnly;
  builder.dialogs.runall.rc = false;
  builder.dialogs.runall.run();
};

function makeRunEntry(run) {
  return newNode('span', {
    style: "cursor: pointer;",
    click: function() {
      if (!builder.dialogs.runall.running) {
        builder.suite.switchToScript(run.scriptIndex);
        builder.stepdisplay.update();
      }
    }
  }, run.name);
}

function makeViewResultLink(sid) {
  return newNode('a', {'class':"step-view", id:sid + "-view", style:"display: none", click: function(e) {
    window.bridge.getRecordingWindow().location = this.href;
    // We don't actually want the SB window to navigate to the script's page!
    e.preventDefault();
  }}, _t('view_run_result'));
}

/** Asynchronously get the data rows for the list of scripts, calling the callback with a mapping of script index -> rows when complete. */
builder.dialogs.runall.getAllRows = function(scripts, callback, failure) {
  var scriptIndexToRows = {};
  var runsComplete = [0];
  var failed = false;
  var f2 = function(e) {
    if (!failed) {
        failed = true;
        failure(e);
    }
  };
  for (var i = 0; i < scripts.length; i++) {
    builder.dialogs.runall.getScriptRows(scripts, i, scriptIndexToRows, runsComplete, callback, f2);
  }
};

/** Asynchronously get the data rows for the given script, store them in scriptIndexToRows, and call the callback if all rows have been acquired. */
builder.dialogs.runall.getScriptRows = function(scripts, i, scriptIndexToRows, runsComplete, callback, failure) {
  builder.datasource.getRows(scripts[i], function(rows) {
    scriptIndexToRows[i] = rows;
    runsComplete[0]++;
    if (runsComplete[0] == scripts.length) {
      callback(scriptIndexToRows);
    }
  }, failure);
};

builder.dialogs.runall.run = function() {
  builder.dialogs.runall.hide();
  jQuery('#edit-suite-editing').hide();
  builder.dialogs.runall.requestStop = false;
  builder.dialogs.runall.running = true;
  
  builder.dialogs.runall.info_p = newNode('p', {id:'infop'}, _t('running_scripts'));
  
  // Display the scripts in a similar fashion to the steps are shown in the record interface.
  builder.dialogs.runall.scriptlist = newFragment();
  
  var scriptNames = builder.suite.getScriptNames();
  var scripts = builder.suite.scripts;
  // Load in script data rows.
  builder.dialogs.runall.getAllRows(scripts, function(scriptIndexToRows) {
    // Don't play back if there was a loading error.
    for (var i = 0; i < scripts.length; i++) {
      if (!scriptIndexToRows[i]) { return; }
    }
    
    // Generate run objects, one for each script playback to do.
    builder.dialogs.runall.runs = [];
    var runIndex = 0;
    for (i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      if (builder.dialogs.runall.currentScriptOnly && script != builder.getScript()) {
        continue;
      }
      var name = scriptNames[i];
      var rows = scriptIndexToRows[i];
      for (var j = 0; j < rows.length; j++) {
        var run = {
          name: name + (rows.length > 1 ? (" " + _t('row', j)) : ""),
          script: script,
          scriptIndex: i,
          initialVars: rows[j]
        };
        builder.dialogs.runall.runs.push(run);

        var sid = 'run-num-' + runIndex++;
        builder.dialogs.runall.scriptlist.appendChild(
          newNode('div', {id: sid, 'class': 'b-suite-playback-script', 'style': 'padding: 2px; padding-left: 5px; padding-right: 5px; margin-bottom: 1px; border-radius: 5px;'},
            newNode('div',
              makeRunEntry(run),
              makeViewResultLink(sid)
            ),
            newNode('div', {'class':"step-error", id:sid + "-error", style:"display: none"})
          )
        );
      }
    }

    builder.dialogs.runall.stop_b = newNode('a', _t('stop'), {
      'class': 'button',
      click: function () {
        builder.dialogs.runall.stoprun();
      },
      href: '#stop'
    });

    builder.dialogs.runall.close_b = newNode('a', _t('close'), {
      'class': 'button',
      click: function () {
        jQuery(builder.dialogs.runall.dialog).remove();
      },
      href: '#close'
    });

    builder.dialogs.runall.dialog = newNode('div', {'class': 'dialog'});
    jQuery(builder.dialogs.runall.dialog)
      .append(builder.dialogs.runall.info_p)
      .append(newNode('div', {'class': 'runslist'}, builder.dialogs.runall.scriptlist))
      .append(newNode('p',
        newNode('span', {id: 'suite-playback-stop'}, builder.dialogs.runall.stop_b),
        newNode('span', {id: 'suite-playback-close', style: 'display: none;'}, builder.dialogs.runall.close_b)
      ));

    if (builder.dialogs.runall.runs.length > 1) {  
      builder.dialogs.show(builder.dialogs.runall.dialog);
    }

    builder.dialogs.runall.currentRunIndex = -1; // Will get incremented to 0 in runNextRC/Local.
    if (builder.dialogs.runall.rc) {
      builder.dialogs.runall.runNextRC();
    } else {
      builder.dialogs.runall.runNextLocal();
    }
  },
  /* failure */
  function(e) {
    alert(_t('unable_to_fetch_data', e));
  });
};

builder.dialogs.runall.stoprun = function() {
  builder.dialogs.runall.requestStop = true;
  jQuery('#suite-playback-stop').hide();
  try {
    builder.dialogs.runall.currentPlayback.stopTest();
  } catch (e) {
    // In case we haven't actually started or have already finished, we don't really care if this
    // goes wrong.
  }
  setTimeout(function() {
    builder.dialogs.runall.running = false;
  }, 100);
};

builder.dialogs.runall.processResult = function(result) {
  if (result.url) {
    jQuery("#run-num-" + builder.dialogs.runall.currentRunIndex + "-view").attr('href', result.url).show();
  }
  if (result.success) {
    jQuery("#run-num-" + builder.dialogs.runall.currentRunIndex).css('background-color', '#bfee85');
  } else {
    if (result.errormessage) {
      jQuery("#run-num-" + builder.dialogs.runall.currentRunIndex).css('background-color', '#ff3333');
      jQuery("#run-num-" + builder.dialogs.runall.currentRunIndex + "-error").html(" " + result.errormessage).show();
    } else {
      jQuery("#run-num-" + builder.dialogs.runall.currentRunIndex).css('background-color', '#ffcccc');
    }
  }
};

builder.dialogs.runall.hide = function () {
  jQuery(builder.dialogs.runall.dialog).remove();
};

// RC
builder.dialogs.runall.runNextRC = function() {
  builder.dialogs.runall.currentRunIndex++;
  if (builder.dialogs.runall.currentRunIndex < builder.dialogs.runall.runs.length &&
      !builder.dialogs.runall.requestStop)
  {
    var run = builder.dialogs.runall.runs[builder.dialogs.runall.currentRunIndex];
    jQuery("#run-num-" + builder.dialogs.runall.currentRunIndex).css('background-color', '#ffffaa');
    builder.suite.switchToScript(run.scriptIndex);
    builder.stepdisplay.update();
    builder.views.script.onStartRCPlayback();
    builder.dialogs.runall.currentPlayback = builder.getScript().seleniumVersion.rcPlayback;
    
    if (builder.doShareSuiteState() && builder.dialogs.runall.currentRCRun) {
      builder.dialogs.runall.currentRCRun = builder.dialogs.runall.currentPlayback.runReusing(
        builder.dialogs.runall.currentRCRun,
        function(result) {
          builder.views.script.onEndRCPlayback();
          builder.dialogs.runall.processRCResult(result);
        },
        builder.views.script.onConnectionEstablished,
        builder.stepdisplay.updateStepPlaybackState,
        run.initialVars,
        builder.views.script.onPauseRCPlayback,
        builder.dialogs.runall.currentRunIndex < builder.dialogs.runall.runs.length - 1);
    } else {
      builder.dialogs.runall.currentRCRun = builder.dialogs.runall.currentPlayback.run(
        builder.dialogs.runall.versionToSettings[builder.getScript().seleniumVersion],
        function(result) {
          builder.views.script.onEndRCPlayback();
          builder.dialogs.runall.processRCResult(result);
        },
        builder.views.script.onConnectionEstablished,
        builder.stepdisplay.updateStepPlaybackState,
        run.initialVars,
        builder.views.script.onPauseRCPlayback,
        builder.doShareSuiteState() && builder.dialogs.runall.currentRunIndex < builder.dialogs.runall.runs.length - 1);
    }
  } else {
    jQuery('#suite-playback-stop').hide();
    jQuery('#suite-playback-close').show();
    jQuery(builder.dialogs.runall.info_p).html(_t('done_exclamation'));
    jQuery('#edit-suite-editing').show();
    builder.dialogs.runall.running = false;
    builder.dialogs.runall.currentRCRun = null;
  }
};

builder.dialogs.runall.processRCResult = function(result) {
  builder.dialogs.runall.processResult(result);
  builder.dialogs.runall.runNextRC();
};

// Local
builder.dialogs.runall.runNextLocal = function() {
  builder.dialogs.runall.currentRunIndex++;
  if (builder.dialogs.runall.currentRunIndex < builder.dialogs.runall.runs.length &&
      !builder.dialogs.runall.requestStop)
  {
    jQuery("#run-num-" + builder.dialogs.runall.currentRunIndex).css('background-color', '#ffffaa');
    var run = builder.dialogs.runall.runs[builder.dialogs.runall.currentRunIndex];
    builder.suite.switchToScript(run.scriptIndex);
    builder.stepdisplay.update();
    builder.dialogs.runall.currentPlayback = builder.getScript().seleniumVersion.playback;
    builder.dialogs.runall.currentPlayback.runTest(
      function(result) {
        builder.views.script.onEndLocalPlayback(result);
        builder.dialogs.runall.processLocalResult(result);
      },
      builder.views.script.onStartLocalPlayback,
      builder.stepdisplay.updateStepPlaybackState,
      builder.views.script.onPauseLocalPlayback,
      run.initialVars
    );
  } else {
    jQuery('#suite-playback-stop').hide();
    jQuery('#suite-playback-close').show();
    jQuery(builder.dialogs.runall.info_p).html("Done!");
    jQuery('#edit-suite-editing').show();
    builder.dialogs.runall.running = false;
  }
};

builder.dialogs.runall.processLocalResult = function(result) {
  builder.dialogs.runall.processResult(result);
  builder.dialogs.runall.runNextLocal();
};




if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
