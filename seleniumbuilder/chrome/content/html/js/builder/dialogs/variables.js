builder.dialogs.variables = {};

builder.dialogs.variables.dialog = null;
builder.dialogs.variables.entryIndex = 0;
builder.dialogs.variables.rcRun = null;

builder.dialogs.variables.getVars = function(callback) {
  var seleniumVersion = builder.getScript().seleniumVersion;
  var runs = seleniumVersion.rcPlayback.getTestRuns();
  if (runs.indexOf(builder.dialogs.variables.rcRun) != -1) {
    seleniumVersion.rcPlayback.getVars(builder.dialogs.variables.rcRun, callback);
  } else if (runs.length > 0) {
    builder.dialogs.variables.rcRun = runs[0];
    seleniumVersion.rcPlayback.getVars(runs[0], callback);
  } else {
    builder.dialogs.variables.rcRun = null;
    callback(seleniumVersion.playback.getVars());
  }
};

builder.dialogs.variables.setVar = function(k, v) {
  var seleniumVersion = builder.getScript().seleniumVersion;
  var runs = seleniumVersion.rcPlayback.getTestRuns();
  if (runs.indexOf(builder.dialogs.variables.rcRun) != -1) {
    seleniumVersion.rcPlayback.setVar(builder.dialogs.variables.rcRun, k, v, function() {});
  } else if (builder.dialogs.variables.rcRun !== null) {
    alert(_t('no_playback_found_for_set_vars'));
    builder.dialogs.variables.hide();
  } else {
    seleniumVersion.playback.setVar(k, v);
  }
};

builder.dialogs.variables.refreshTable = function(var_table) {
  builder.dialogs.variables.getVars(function(vars) {
    jQuery(var_table).html('');
    for (var k in vars) {
      var v = vars[k];
      jQuery(var_table).append(builder.dialogs.variables.makeKVEntry(builder.dialogs.variables.entryIndex++, k, v));
    }
  });
};

builder.dialogs.variables.show = function() {
  builder.dialogs.variables.dialog = newNode('div', {'class': 'dialog'});
  
  var var_table = newNode('table');
  
  builder.dialogs.variables.refreshTable(var_table);
        
  var add_b = newNode('a', '+', {
    'class': 'button smallbutton',
    'click': function () {
      var name = prompt(_t('step_name'));
      if (name) {
        jQuery(var_table).append(builder.dialogs.variables.makeKVEntry(builder.dialogs.variables.entryIndex, name, ""));
        jQuery('#kve_f_' + builder.dialogs.variables.entryIndex).focus();
        builder.dialogs.variables.entryIndex++;
      }
    }
  });
  
  var refresh_b = newNode('a', _t('plugins_refresh'), {
    'class': 'button',
    'click': function () {
      builder.dialogs.variables.refreshTable(var_table);
    }
  });
  
  var close_b = newNode('a', _t('close'), {
    'class': 'button',
    'click': function () {
      builder.dialogs.variables.hide();
    }
  });
  
  jQuery(builder.dialogs.variables.dialog).
      append(newNode('h3', _t('variables'))).
      append(var_table).
      append(newNode('p', add_b, refresh_b, close_b));
  
  builder.dialogs.show(builder.dialogs.variables.dialog);
};

builder.dialogs.variables.isAvailable = function() {
  return true;
};

builder.dialogs.variables.makeKVEntry = function(i, k, v) {
  return newNode('tr', { 'id': 'kve_' + i },
    newNode('td', k),
    newNode('td', newNode('input', { 'id': 'kve_f_' + i, 'type': 'text', 'value': v, 'keyup': function() {
      builder.dialogs.variables.setVar(k, jQuery('#kve_f_' + i).val());
    }})),
    newNode('td', newNode('a', { 'class': 'button smallbutton', 'click': function() {
      jQuery('#kve_' + i).remove();
      builder.dialogs.variables.setVar(k, null);
    }}, "X"))
  );
};

builder.dialogs.variables.hide = function() {
  jQuery(builder.dialogs.variables.dialog).remove();
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
