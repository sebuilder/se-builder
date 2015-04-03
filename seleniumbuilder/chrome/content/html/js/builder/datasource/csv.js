/** A data-driving source for JSON files. */

builder.datasource.csv = {};

builder.datasource.register(builder.datasource.csv);

builder.datasource.csv.id = "csv";
builder.datasource.csv.name = "CSV";

builder.datasource.csv.dialog = null;
builder.datasource.csv.path = "";

builder.datasource.csv.fetchRows = function(config, script, callback, failure) {
  if (script.path) {
    // Relative path
    builder.io.loadPath({where: script.path.where, path: config.path}, script.path, function(result) {
      if (result) {
        callback(parseCSV(result.text));
      } else {
        // Absolute path
        builder.io.loadPath({where: script.path.where, path: config.path}, null, function(result) {
          if (result) {
            callback(parseCSV(result.text));
          } else {
            // Local absolute path
            result = null;
            try {
              result = parseCSV(bridge.readPath(config.path));
            } catch (e) {
              failure(_t('unable_to_load_file', config.path));
            }
            if (result !== null) { callback(result); }
          }
        });
      }
    });
  } else {
    var result = null;
    try {
      result = parseCSV(bridge.readPath(config.path));
    } catch (e) {
      failure(_t('unable_to_load_file', config.path));
    }
    if (result !== null) { callback(result); }
  }
};

function parseCSV(text) {
  try {
    return jQuery.csv.toObjects(text);
  } catch (e) {
    alert(_t('csv_parse_error', "" + e));
    return null;
  }
}

builder.datasource.csv.showConfigDialog = function(callback, config) {
  builder.datasource.csv.hideConfigDialog();
  builder.datasource.csv.path = config ? (config.path || "") : "";
  builder.datasource.csv.dialog = newNode('div', {'class': 'dialog'});
  
  var path_field = newNode('input', {'id': 'csv-path', 'type': 'text', 'value': builder.datasource.csv.path});
  
  var cancel_b = newNode('a', _t('cancel'), {
    'class': 'button',
    'click': function () {
      builder.datasource.csv.hideConfigDialog();
    }
  });
  
  function okf() {
    var p = jQuery('#csv-path').val();
    builder.datasource.csv.hideConfigDialog();
    callback({path: p});
  }
  
  var ok_b = newNode('a', _t('ok'), {
    'class': 'button',
    'click': okf
  });
  
  jQuery(builder.datasource.csv.dialog).
      append(newNode('h3', _t('csv_file_path'))).
      append(path_field).
      append(newNode('p', cancel_b, ok_b));
  
  builder.dialogs.show(builder.datasource.csv.dialog);
  
  jQuery(path_field).focus().select().keypress(function (e) {
    if (e.which == 13) {
      okf();
    }
  });
};

builder.datasource.csv.hideConfigDialog = function() {
  jQuery(builder.datasource.csv.dialog).remove();
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
