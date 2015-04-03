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

// NB These do not actually enable/disable the menu functionality!
builder.gui.menu.showItemAsDisabled = function(id) {
  jQuery('#' + id).addClass('disabledMenuItem');
};

builder.gui.menu.showItemAsEnabled = function(id) {
  jQuery('#' + id).removeClass('disabledMenuItem');
};

builder.registerPostLoadHook(function() {
  // File menu
  builder.gui.menu.addMenu(_t('menu_file'), 'file');
  builder.gui.menu.addItem('file', _t('open_script_or_suite'), 'script-open', function() {
    if (builder.suite.getNumberOfScripts() > 1) {
      if (!builder.suite.getSaveRequired() ||
          confirm(_t('lose_changes_warning')))
      {
        builder.record.stopAll();
        builder.io.loadUnknownFile(false);
      }
    } else {
      if (!builder.getScript().saveRequired ||
          confirm(_t('lose_changes_warning')))
      {
        builder.record.stopAll();
        builder.io.loadUnknownFile(false);
      }
    }
  });
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
  
  builder.gui.menu.addItem('file', _t('menu_settings'), 'script-settings', function() {
    builder.dialogs.settings.show();
  });
  
  builder.suite.addScriptChangeListener(function() {
    if (builder.getScript() === null) { return; }
    var script = builder.getScript();
    if (script.seleniumVersion == builder.selenium1) {
      builder.gui.menu.hideItem('script-settings');
    } else {
      builder.gui.menu.showItem('script-settings');
    }
    if (builder.seleniumVersions.length < 3) {
      var otherVersion = builder.seleniumVersions[(builder.seleniumVersions.indexOf(script.seleniumVersion) + 1) % 2];
      jQuery('#script-convert').html(_t('menu_convert_to', otherVersion.name));
    }
    jQuery('#selenium-version-display').html(script.seleniumVersion.name);
    
    jQuery('#script-discard').html(builder.suite.getNumberOfScripts() > 1 ? _t('menu_discard_suite') : _t('menu_discard'));
    
    if (script.path === null) {
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
    builder.record.continueRecording(/* insert index */ builder.getScript().steps.length);
  });
  
  // Run menu
  builder.gui.menu.addMenu(_t('menu_run'), 'run');
  builder.gui.menu.addItem('run', _t('menu_run_locally'), 'run-locally', function() {
    builder.record.stopAll();
    builder.dialogs.runall.runLocally(true);
  });
  builder.gui.menu.addItem('run', _t('menu_run_on_rc'), 'run-onrc', function() {
    builder.record.stopAll();
    builder.dialogs.rc.show(jQuery("#dialog-attachment-point"), /*play all*/ false);
  });
  builder.gui.menu.addItem('run', _t('menu_run_suite_locally'), 'run-suite-locally', function() {
    builder.record.stopAll();
    builder.dialogs.runall.runLocally(false);
  });
  builder.gui.menu.addItem('run', _t('menu_run_suite_on_rc'), 'run-suite-onrc', function() {
    builder.record.stopAll();
    builder.dialogs.rc.show(jQuery("#dialog-attachment-point"), /*play all*/ true);
  });
  
  builder.suite.shareState = bridge.prefManager.getBoolPref("extensions.seleniumbuilder.shareSuiteState");
    
  builder.gui.menu.addItem('run', builder.suite.shareState ? _t('menu_dont_share_state_across_suite') : _t('menu_share_state_across_suite'), 'run-share-state', function() {
    if (!(builder.suite.areAllScriptsOfVersion(builder.selenium1) || builder.suite.areAllScriptsOfVersion(builder.selenium2))) {
      return;
    }
    if (builder.suite.shareState) {
      builder.suite.shareState = false;
      builder.suite.suiteSaveRequired = true;
      bridge.prefManager.setBoolPref("extensions.seleniumbuilder.shareSuiteState", false);
      jQuery('#run-share-state').text(_t('menu_share_state_across_suite'));
      builder.suite.broadcastScriptChange();
    } else {
      builder.suite.shareState = true;
      builder.suite.suiteSaveRequired = true;
      bridge.prefManager.setBoolPref("extensions.seleniumbuilder.shareSuiteState", true);
      jQuery('#run-share-state').text(_t('menu_dont_share_state_across_suite'));
      builder.suite.broadcastScriptChange();
    }
  });
  
  builder.suite.addScriptChangeListener(function() {
    if (builder.suite.areAllScriptsOfVersion(builder.selenium1) || builder.suite.areAllScriptsOfVersion(builder.selenium2)) {
      builder.gui.menu.showItemAsEnabled('run-share-state');
    } else {
      builder.gui.menu.showItemAsDisabled('run-share-state');
    }
  });
  
  // Suite menu
  builder.gui.menu.addMenu(_t('menu_suite'), 'suite');
    
  // Debug menu
  builder.gui.menu.addMenu(_t('menu_debug'), 'debug');
  builder.gui.menu.addItem('debug', _t('menu_disable_breakpoints'), 'debug-toggle-breakpoints', function() {
    if (builder.breakpointsEnabled) {
      builder.breakpointsEnabled = false;
      jQuery('.b-step-breakpoint-set').addClass('b-step-breakpoint-disabled');
      jQuery('.b-step-breakpoint-disabled').removeClass('b-step-breakpoint-set');
      jQuery('#debug-toggle-breakpoints').text(_t('menu_enable_breakpoints'));
    } else {
      builder.breakpointsEnabled = true;
      jQuery('.b-step-breakpoint-disabled').addClass('b-step-breakpoint-set');
      jQuery('.b-step-breakpoint-set').removeClass('b-step-breakpoint-disabled');      
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
  
  builder.gui.menu.addItem('data', _t('inputs'), 'data-inputs', builder.dialogs.inputs.show);
  
  builder.gui.menu.addDivider('data', 'data-input-divider');
  
  var srcs = builder.datasource.getSources();
  srcs.forEach(function(src) {
    builder.gui.menu.addItem('data', src.name, 'data-' + src.id, function() {
      builder.datasource.showConfig(src);
    });
  });
  
  builder.suite.addScriptChangeListener(builder.datasource.updateMenu);
});



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
