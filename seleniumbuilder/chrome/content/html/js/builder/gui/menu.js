/** Attaches functionality to menu items. */
builder.gui.menu = {};

builder.gui.menu.addMenu = function(title, id) {
  jQuery('#menu').append(newNode('li',
    newNode('a', {'href': '#'}, title),
    newNode('ul', {'id': id + '-menu'})
  ));
};

builder.gui.menu.addSingleItemMenu = function(title, id, f) {
  jQuery('#menu').append(newNode('li',
    newNode('a', {'href': '#', 'id': id, 'click': f}, title)
  ));
};

builder.gui.menu.addItem = function(menu, title, id, f) {
  jQuery('#' + menu + '-menu').append(newNode('li', {'id': id + '-li'}, newNode('a', {'click': f, 'id': id}, title)));
};

builder.gui.menu.showItem = function(id) {
  jQuery('#' + id + '-li').show();
};

builder.gui.menu.hideItem = function(id) {
  jQuery('#' + id + '-li').hide();
};

builder.gui.menu.setItemVisible = function(id, visible) {
  if (visible) {
    builder.gui.menu.showItem(id);
  } else {
    builder.gui.menu.hideItem(id);
  }
};

builder.gui.menu.addDivider = function(menu, id) {
  jQuery('#' + menu + '-menu').append(newNode('div', {'id': id, 'class': 'divider'}));
};

builder.gui.menu.addSection = function(menu, id) {
  jQuery('#' + menu + '-menu').append(newNode('span', {'id': menu + '-menu-' + id}));
};

builder.gui.menu.clearSection = function(menu, id) {
  jQuery('#' + menu + '-menu-' + id).html('');
};

builder.gui.menu.addItemToSection = function(menu, section, title, id, f) {
  jQuery('#' + menu + '-menu-' + section).append(newNode('li', {'id': id + '-li'}, newNode('a', {'click': f, 'id': id}, title)));
};

builder.gui.menu.highlightItem = function(id) {
  jQuery('#' + id).addClass('highlightedMenuItem');
};

builder.gui.menu.deHighlightItem = function(id) {
  jQuery('#' + id).removeClass('highlightedMenuItem');
};

builder.registerPostLoadHook(function() {
  // File menu
  builder.gui.menu.addMenu(_t('menu_file'), 'file');
  builder.gui.menu.addItem('file', _t('menu_save'), 'script-save', function() {
    builder.record.stopAll();
    builder.dialogs.exportscript.save();
  });
  builder.gui.menu.addItem('file', _t('menu_save_as'), 'script-save-as', function() {
    builder.record.stopAll();
    builder.dialogs.exportscript.saveAs();
  });
  jQuery('#script-save-as-li').hide();
  builder.gui.menu.addItem('file', _t('menu_export'), 'script-export', function() {
    builder.record.stopAll();
    builder.dialogs.exportscript.show(jQuery("#dialog-attachment-point"));
  });
  builder.gui.menu.addItem('file', _t('menu_convert'), 'script-convert', function() {
    builder.record.stopAll();
    builder.dialogs.convert.show(jQuery("#dialog-attachment-point"));
  });
  builder.gui.menu.addItem('file', _t('menu_discard'), 'script-discard', function() {
    if (builder.suite.getNumberOfScripts() > 1) {
      if (!builder.suite.getSaveRequired() ||
          confirm(_t('lose_changes_warning')))
      {
        builder.record.stopAll();
        builder.gui.switchView(builder.views.startup);
        builder.suite.clearSuite();
        // Clear any error messages.
        jQuery('#error-panel').hide();
      }
    } else {
      if (!builder.getScript().saveRequired ||
          confirm(_t('lose_changes_warning')))
      {
        builder.record.stopAll();
        builder.gui.switchView(builder.views.startup);
        builder.suite.clearSuite();        
        // Clear any error messages.
        jQuery('#error-panel').hide();
      }
    }
  });
  
  builder.suite.addScriptChangeListener(function() {
    if (builder.getScript() == null) { return; }
    var script = builder.getScript();
    if (builder.seleniumVersions.length < 3) {
      var otherVersion = builder.seleniumVersions[(builder.seleniumVersions.indexOf(script.seleniumVersion) + 1) % 2];
      jQuery('#script-convert').html(_t('menu_convert_to', otherVersion.name));
    }
    jQuery('#selenium-version-display').html(script.seleniumVersion.name);
    
    jQuery('#script-discard').html(builder.suite.getNumberOfScripts() > 1 ? _t('menu_discard_suite') : _t('menu_discard'));
    
    if (script.path == null) {
      jQuery('#script-save').show().html(_t('menu_save'));
      jQuery('#script-save-as-li').hide();
    } else if (script.path.where == 'local') {
      jQuery('#script-save').show().html(_t('menu_save_to', script.path.path));
      jQuery('#script-save-as-li').show();
    } else {
      jQuery('#script-save').hide();
      jQuery('#script-save-as-li').show();
    }
  });
  
  // Record button: Record more of the script
  builder.gui.menu.addSingleItemMenu(_t('menu_record'), 'record', function () {
    builder.record.stopAll();
    builder.record.continueRecording();
  });
  
  // Run menu
  builder.gui.menu.addMenu(_t('menu_run'), 'run');
  builder.gui.menu.addItem('run', _t('menu_run_locally'), 'run-locally', function() {
    builder.record.stopAll();
    builder.getScript().seleniumVersion.playback.runTest(builder.views.script.onEndLocalPlayback, builder.views.script.onStartLocalPlayback, builder.stepdisplay.updateStepPlaybackState, builder.views.script.onPauseLocalPlayback
      , builder.datasource.getRows(builder.getScript())[0] /* qqDPS Just ignoring all subsequent data entries. */);
  });
  builder.gui.menu.addItem('run', _t('menu_run_on_rc'), 'run-onrc', function() {
    builder.record.stopAll();
    builder.dialogs.rc.show(jQuery("#dialog-attachment-point"), /*play all*/ false);
  });
  builder.gui.menu.addItem('run', _t('menu_run_suite_locally'), 'run-suite-locally', function() {
    builder.record.stopAll();
    builder.dialogs.runall.runLocally(jQuery("#dialog-attachment-point"));
  });
  builder.gui.menu.addItem('run', _t('menu_run_suite_on_rc'), 'run-suite-onrc', function() {
    builder.record.stopAll();
    builder.dialogs.rc.show(jQuery("#dialog-attachment-point"), /*play all*/ true);
  });
  
  // Suite menu
  builder.gui.menu.addMenu(_t('menu_suite'), 'suite');
    
  // Debug menu
  builder.gui.menu.addMenu(_t('menu_debug'), 'debug');
  builder.gui.menu.addItem('debug', _t('menu_disable_breakpoints'), 'debug-toggle-breakpoints', function() {
    if (builder.breakpointsEnabled) {
      builder.breakpointsEnabled = false;
      jQuery('.b-step-breakpoint').addClass('b-step-breakpoint-disabled');
      jQuery('#debug-toggle-breakpoints').text(_t('menu_enable_breakpoints'));
    } else {
      builder.breakpointsEnabled = true;
      jQuery('.b-step-breakpoint').removeClass('b-step-breakpoint-disabled');
      jQuery('#debug-toggle-breakpoints').text(_t('menu_disable_breakpoints'));
    }
  });
  
  builder.gui.menu.addItem('debug', _t('menu_clear_breakpoints'), 'debug-clear-breakpoints', function() {
    if (confirm(_t('clear_breakpoints_confirm'))) {
      builder.stepdisplay.clearAllBreakpoints();
    }
  });
  
  builder.gui.menu.addItem('debug', _t('menu_playback_variables'), 'debug-playback-variables', function() {
    if (builder.dialogs.variables.isAvailable()) {
      builder.dialogs.variables.show();
    }
  });
  
  // Data menu
  builder.gui.menu.addMenu(_t('menu_data'), 'data');
  
  var srcs = builder.datasource.getSources();
  srcs.forEach(function(src) {
    builder.gui.menu.addItem('data', src.name, 'data-' + src.id, function() {
      builder.datasource.showConfig(src);
    });
  });
  
  builder.suite.addScriptChangeListener(builder.datasource.updateMenu);
});
