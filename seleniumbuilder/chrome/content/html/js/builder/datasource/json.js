/** A data-driving source for JSON files. */

builder.datasource.json = {};

builder.datasource.register(builder.datasource.json);

builder.datasource.json.id = "json";
builder.datasource.json.name = "JSON";

builder.datasource.json.dialog = null;
builder.datasource.json.path = "";

builder.datasource.json.fetchRows = function(config, script, callback, failure) {
  if (script.path) {
    // Relative path
    builder.io.loadPath({where: script.path.where, path: config.path}, script.path, function(result) {
      if (result) {
        callback(JSON.parse(result.text));
      } else {
        // Absolute path
        builder.io.loadPath({where: script.path.where, path: config.path}, null, function(result) {
          if (result) {
            callback(JSON.parse(result.text));
          } else {
            // Local absolute path
            result = null;
            try {
              result = JSON.parse(bridge.readPath(config.path));
            } catch (e) {
              failure(_t('unable_to_load_file', config.path));
            }
            if (result) { callback(result); }
          }
        });
      }
    });
  } else {
    var result = null;
    try {
      result = JSON.parse(bridge.readPath(config.path));
    } catch (e) {
      failure(_t('unable_to_load_file', config.path));
    }
    if (result) { callback(result); }
  }
};

builder.datasource.json.showConfigDialog = function(callback, config) {
  builder.datasource.json.hideConfigDialog();
  builder.datasource.json.path = config ? (config.path || "") : "";
  builder.datasource.json.dialog = newNode('div', {'class': 'dialog'});
  
  var path_field = newNode('input', {'id': 'json-path', 'type': 'text', 'value': builder.datasource.json.path});
  
  var cancel_b = newNode('a', _t('cancel'), {
    'class': 'button',
    'click': function () {
      builder.datasource.json.hideConfigDialog();
    }
  });
  
  function okf() {
    var p = jQuery('#json-path').val();
    builder.datasource.json.hideConfigDialog();
    callback({path: p});
  }
  
  var ok_b = newNode('a', _t('ok'), {
    'class': 'button',
    'click': okf
  });
  
  jQuery(builder.datasource.json.dialog).
      append(newNode('h3', _t('json_file_path'))).
      append(path_field).
      append(newNode('p', cancel_b, ok_b));
  
  builder.dialogs.show(builder.datasource.json.dialog);
  
  jQuery(path_field).focus().select().keypress(function (e) {
    if (e.which == 13) {
      okf();
    }
  });
};

builder.datasource.json.hideConfigDialog = function() {
  jQuery(builder.datasource.json.dialog).remove();
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
