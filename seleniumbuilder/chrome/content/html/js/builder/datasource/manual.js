/** A data-driving source for manual entry. */

builder.datasource.manual = {};

builder.datasource.register(builder.datasource.manual);

builder.datasource.manual.id = "manual";
builder.datasource.manual.name = _t('manual_entry');

builder.datasource.manual.dialog = null;
builder.datasource.manual.config = null;
builder.datasource.manual.entryIndex = 0;

builder.datasource.manual.fetchRows = function(config) {
  return [config];
};

builder.datasource.manual.showConfigDialog = function(callback, config) {
  builder.datasource.manual.hideConfigDialog();
  builder.datasource.manual.config = {};
  for (var k in config) {
    builder.datasource.manual.config[k] = config[k];
  }
  builder.datasource.manual.dialog = newNode('div', {'class': 'dialog'});
  
  var var_table = newNode('table');
  
  refreshTable(var_table);
        
  var add_b = newNode('a', '+', {
    'class': 'button smallbutton',
    'click': function () {
      var name = prompt(_t('step_name'));
      if (name) {
        jQuery(var_table).append(makeKVEntry(builder.datasource.manual.entryIndex, name, ""));
        jQuery('#kve_f_' + builder.datasource.manual.entryIndex).focus();
        builder.datasource.manual.entryIndex++;
      }
    }
  });
  
  var cancel_b = newNode('a', _t('cancel'), {
    'class': 'button',
    'click': function () {
      builder.datasource.manual.hideConfigDialog();
    }
  });
  
  var ok_b = newNode('a', _t('ok'), {
    'class': 'button',
    'click': function () {
      builder.datasource.manual.hideConfigDialog();
      callback(builder.datasource.manual.config);
    }
  });
  
  jQuery(builder.datasource.manual.dialog).
      append(newNode('h3', _t('variables'))).
      append(var_table).
      append(newNode('p', add_b, cancel_b, ok_b));
  
  builder.dialogs.show(builder.datasource.manual.dialog);
};

function refreshTable(var_table) {
  builder.datasource.manual.entryIndex = 0;
  jQuery(var_table).html('');
  for (var k in builder.datasource.manual.config) {
    var v = builder.datasource.manual.config[k];
    jQuery(var_table).append(makeKVEntry(builder.datasource.manual.entryIndex++, k, v));
  }
}

function makeKVEntry(i, k, v) {
  return newNode('tr', { 'id': 'kve_' + i },
    newNode('td', k),
    newNode('td', newNode('input', { 'id': 'kve_f_' + i, 'type': 'text', 'value': v, 'keyup': function() {
      builder.datasource.manual.config[k] = jQuery('#kve_f_' + i).val();
    }})),
    newNode('td', newNode('a', { 'class': 'button smallbutton', 'click': function() {
      jQuery('#kve_' + i).remove();
      delete builder.datasource.manual.config[k];
    }}, "X"))
  );
}

builder.datasource.manual.hideConfigDialog = function() {
  jQuery(builder.datasource.manual.dialog).remove();
};