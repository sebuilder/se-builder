/**
 * Dialog that runs all scripts in the suite and keeps track of scripts being run.
 */
builder.dialogs.runall = {};
builder.dialogs.runall.node = null;
builder.dialogs.runall.dialog = null;
builder.dialogs.runall.hostPort = null;
builder.dialogs.runall.browserString = null;
builder.dialogs.runall.browserVersion = null;
builder.dialogs.runall.platform = null;

builder.dialogs.runall.currentScriptIndex = -1;
builder.dialogs.runall.scriptNames = [];

builder.dialogs.runall.info_p = null;
builder.dialogs.runall.scriptlist = null;
builder.dialogs.runall.stop_b = null;
builder.dialogs.runall.close_b = null;

builder.dialogs.runall.rc = false;
builder.dialogs.runall.requestStop = false;
builder.dialogs.runall.currentPlayback = null;

builder.dialogs.runall.running = false;

builder.dialogs.runall.runRC = function(node, hostPort, browserString, browserVersion, platform) {
  builder.dialogs.runall.node = node;
  builder.dialogs.runall.hostPort = hostPort;
  builder.dialogs.runall.browserString = browserString;
  builder.dialogs.runall.browserVersion = browserVersion;
  builder.dialogs.runall.platform = platform;
  builder.dialogs.runall.rc = true;
  builder.dialogs.runall.run();
};

builder.dialogs.runall.runLocally = function(node) {
  builder.dialogs.runall.node = node;
  builder.dialogs.runall.rc = false;
  builder.dialogs.runall.run();
};

function makeScriptEntry(name, scriptIndex) {
  return newNode('span', {
    style: "cursor: pointer;",
    click: function() {
      if (!builder.dialogs.runall.running) {
        builder.suite.switchToScript(scriptIndex);
        builder.stepdisplay.update();
      }
    }
  }, name);
}

function makeViewResultLink(sid) {
  return newNode('a', {'class':"step-view", id:sid + "-view", style:"display: none", click: function(e) {
    window.bridge.getRecordingWindow().location = this.href;
    // We don't actually want the SB window to navigate to the script's page!
    e.preventDefault();
  }}, _t('view_run_result'));
}

builder.dialogs.runall.run = function() {
  jQuery('#edit-suite-editing').hide();
  builder.dialogs.runall.requestStop = false;
  builder.dialogs.runall.running = true;
  
  builder.dialogs.runall.scriptNames = builder.suite.getScriptNames();
  
  builder.dialogs.runall.info_p = newNode('p', {id:'infop'}, _t('running_scripts'));
  
  // Display the scripts in a similar fashion to the steps are shown in the record interface.
  builder.dialogs.runall.scriptlist = newFragment();
  
  for (var i = 0; i < builder.dialogs.runall.scriptNames.length; i++) {
    var name = builder.dialogs.runall.scriptNames[i];
    var sid = 'script-num-' + i;

    builder.dialogs.runall.scriptlist.appendChild(
      newNode('div', {id: sid, 'class': 'b-suite-playback-script'},
        newNode('div',
          makeScriptEntry(name, i),
          makeViewResultLink(sid)
        ),
        newNode('div', {'class':"step-error", id:sid + "-error", style:"display: none"})
      )
    );
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
    .append(builder.dialogs.runall.scriptlist)
    .append(newNode('p',
      newNode('span', {id: 'suite-playback-stop'}, builder.dialogs.runall.stop_b),
      newNode('span', {id: 'suite-playback-close', style: 'display: none;'}, builder.dialogs.runall.close_b)
    ));
    
  jQuery(builder.dialogs.runall.node).append(builder.dialogs.runall.dialog);
  
  builder.dialogs.runall.currentScriptIndex = -1; // Will get incremented to 0 in runNextRC/Local.
  if (builder.dialogs.runall.rc) {
    builder.dialogs.runall.runNextRC();
  } else {
    builder.dialogs.runall.runNextLocal();
  }
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
    jQuery("#script-num-" + builder.dialogs.runall.currentScriptIndex + "-view").attr('href', result.url).show();
  }
  if (result.success) {
    jQuery("#script-num-" + builder.dialogs.runall.currentScriptIndex).css('background-color', '#bfee85');
  } else {
    if (result.errormessage) {
      jQuery("#script-num-" + builder.dialogs.runall.currentScriptIndex).css('background-color', '#ff3333');
      jQuery("#script-num-" + builder.dialogs.runall.currentScriptIndex + "-error").html(" " + result.errormessage).show();
    } else {
      jQuery("#script-num-" + builder.dialogs.runall.currentScriptIndex).css('background-color', '#ffcccc');
    }
  }
};

builder.dialogs.runall.hide = function () {
  jQuery(builder.dialogs.runall.dialog).remove();
};

// RC
builder.dialogs.runall.runNextRC = function() {
  builder.dialogs.runall.currentScriptIndex++;
  if (builder.dialogs.runall.currentScriptIndex < builder.dialogs.runall.scriptNames.length &&
      !builder.dialogs.runall.requestStop)
  {
    jQuery("#script-num-" + builder.dialogs.runall.currentScriptIndex).css('background-color', '#ffffaa');
    builder.suite.switchToScript(builder.dialogs.runall.currentScriptIndex);
    builder.stepdisplay.update();
    builder.dialogs.runall.currentPlayback = builder.getScript().seleniumVersion.rcPlayback;
    builder.dialogs.runall.currentPlayback.run(
      builder.dialogs.runall.hostPort,
      builder.dialogs.runall.browserString,
      builder.dialogs.runall.browserVersion,
      builder.dialogs.runall.platform,
      builder.dialogs.runall.processRCResult);
  } else {
    jQuery('#suite-playback-stop').hide();
    jQuery('#suite-playback-close').show();
    jQuery(builder.dialogs.runall.info_p).html(_t('done_exclamation'));
    jQuery('#edit-suite-editing').show();
    builder.dialogs.runall.running = false;
  }
};

builder.dialogs.runall.processRCResult = function(result) {
  builder.dialogs.runall.processResult(result);
  builder.dialogs.runall.runNextRC();
};

// Local
builder.dialogs.runall.runNextLocal = function() {
  builder.dialogs.runall.currentScriptIndex++;
  if (builder.dialogs.runall.currentScriptIndex < builder.dialogs.runall.scriptNames.length &&
      !builder.dialogs.runall.requestStop)
  {
    jQuery("#script-num-" + builder.dialogs.runall.currentScriptIndex).css('background-color', '#ffffaa');
    builder.suite.switchToScript(builder.dialogs.runall.currentScriptIndex);
    builder.stepdisplay.update();
    builder.dialogs.runall.currentPlayback = builder.getScript().seleniumVersion.playback;
    builder.dialogs.runall.currentPlayback.runTest(builder.dialogs.runall.processLocalResult);
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
