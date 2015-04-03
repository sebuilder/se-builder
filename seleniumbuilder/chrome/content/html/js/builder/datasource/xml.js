/** A data-driving source for XML files in the same style as IDE's. */

builder.datasource.xml = {};

builder.datasource.register(builder.datasource.xml);

builder.datasource.xml.id = "xml";
builder.datasource.xml.name = "XML";

builder.datasource.xml.dialog = null;
builder.datasource.xml.path = "";

function parseXML(text) {
  var xml = new DOMParser().parseFromString(text, "text/xml");
  var rows = xml.getElementsByTagName("testdata")[0].getElementsByTagName("test");
  var data = [];
  for (var i = 0; i < rows.length; i++) {
    var row = {};
    for (var j = 0; j < rows[i].attributes.length; j++) {
      row[rows[i].attributes[j].name] = rows[i].attributes[j].value;
    }
    data.push(row);
  }
  return data;
}

builder.datasource.xml.fetchRows = function(config, script, callback, failure) {
  if (script.path) {
    // Relative path
    builder.io.loadPath({where: script.path.where, path: config.path}, script.path, function(result) {
      if (result) {
        callback(parseXML(result.text));
      } else {
        // Absolute path
        builder.io.loadPath({where: script.path.where, path: config.path}, null, function(result) {
          if (result) {
            callback(parseXML(result.text));
          } else {
            // Local absolute path
            result = null;
            try {
              result = parseXML(bridge.readPath(config.path));
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
      result = parseXML(bridge.readPath(config.path));
    } catch (e) {
      failure(_t('unable_to_load_file', config.path));
    }
    if (result) { callback(result); }
  }
};

builder.datasource.xml.showConfigDialog = function(callback, config) {
  builder.datasource.xml.hideConfigDialog();
  builder.datasource.xml.path = config ? (config.path || "") : "";
  builder.datasource.xml.dialog = newNode('div', {'class': 'dialog'});
  
  var path_field = newNode('input', {'id': 'xml-path', 'type': 'text', 'value': builder.datasource.xml.path});
  
  var cancel_b = newNode('a', _t('cancel'), {
    'class': 'button',
    'click': function () {
      builder.datasource.xml.hideConfigDialog();
    }
  });
  
  function okf() {
    var p = jQuery('#xml-path').val();
    builder.datasource.xml.hideConfigDialog();
    callback({path: p});
  }
  
  var ok_b = newNode('a', _t('ok'), {
    'class': 'button',
    'click': okf
  });
  
  jQuery(builder.datasource.xml.dialog).
      append(newNode('h3', _t('xml_file_path'))).
      append(path_field).
      append(newNode('p', cancel_b, ok_b));
  
  builder.dialogs.show(builder.datasource.xml.dialog);
  
  jQuery(path_field).focus().select().keypress(function (e) {
    if (e.which == 13) {
      okf();
    }
  });
};

builder.datasource.xml.hideConfigDialog = function() {
  jQuery(builder.datasource.xml.dialog).remove();
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
