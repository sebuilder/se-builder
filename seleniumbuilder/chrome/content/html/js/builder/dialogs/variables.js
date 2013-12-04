builder.dialogs.variables = {};

builder.dialogs.variables.dialog = null;
builder.dialogs.variables.entryIndex = 0;

function refreshTable(var_table) {
  var vars = builder.getScript().seleniumVersion.playback.getVars();
  jQuery(var_table).html('');
  for (var k in vars) {
    var v = vars[k];
    jQuery(var_table).append(makeKVEntry(builder.dialogs.variables.entryIndex++, k, v));
  }
}

builder.dialogs.variables.show = function() {
  builder.dialogs.variables.dialog = newNode('div', {'class': 'dialog'});
  
  var var_table = newNode('table');
  
  refreshTable(var_table);
        
  var add_b = newNode('a', '+', {
    'class': 'button smallbutton',
    'click': function () {
      var name = prompt(_t('step_name'));
      if (name) {
        jQuery(var_table).append(makeKVEntry(builder.dialogs.variables.entryIndex, name, ""));
        jQuery('#kve_f_' + builder.dialogs.variables.entryIndex).focus();
        builder.dialogs.variables.entryIndex++;
      }
    }
  });
  
  var refresh_b = newNode('a', _t('plugins_refresh'), {
    'class': 'button',
    'click': function () {
      refreshTable(var_table);
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

function makeKVEntry(i, k, v) {
  return newNode('tr', { 'id': 'kve_' + i },
    newNode('td', k),
    newNode('td', newNode('input', { 'id': 'kve_f_' + i, 'type': 'text', 'value': v, 'keyup': function() {
      builder.getScript().seleniumVersion.playback.setVar(k, jQuery('#kve_f_' + i).val());
    }})),
    newNode('td', newNode('a', { 'class': 'button smallbutton', 'click': function() {
      jQuery('#kve_' + i).remove();
      builder.getScript().seleniumVersion.playback.setVar(k, null);
    }}, "X"))
  );
}

builder.dialogs.variables.hide = function() {
  jQuery(builder.dialogs.variables.dialog).remove();
};