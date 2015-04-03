/**
 * Dialog that can be inserted to allow the user to export the suite using a variety of formats,
 * via builder.selenium1.adapter et al.
 */
builder.dialogs.exportsuite = {};

builder.dialogs.exportsuite.dialog = null;

builder.dialogs.exportsuite.show = function(formats) {
  builder.dialogs.exportsuite.dialog = newNode('div', {'class': 'dialog'});
  
  var format_list = newNode('ul');
  
  var cancel_b = newNode('a', _t('cancel'), {
    'class': 'button',
    'click': function () {
      builder.dialogs.exportsuite.hide();
    },
    'href': '#cancel'
  });
  
  jQuery(builder.dialogs.exportsuite.dialog).
      append(newNode('h3', _t('choose_export_format'))).
      append(format_list).
      append(newNode('p', cancel_b));
  
  // Loop over formats provided by version.
  for (var i = 0; i < formats.length; i++) {
    jQuery(format_list).append(builder.dialogs.exportsuite.createFormatLi(formats[i]));
  }
  
  builder.dialogs.show(builder.dialogs.exportsuite.dialog);
};

builder.dialogs.exportsuite.hide = function () {
  jQuery(builder.dialogs.exportsuite.dialog).remove();
};

builder.dialogs.exportsuite.createFormatLi = function(format) {
  return newNode('li', newNode('a', format.name, {
    'click': function() {
      var path = format.save(builder.suite.scripts, builder.suite.path);
      if (path) {
        builder.suite.path = path;
        builder.suite.setSuiteSaveRequired(false);
        builder.gui.suite.update();
      }
      builder.dialogs.exportsuite.hide();
    }
  }));
};

builder.dialogs.exportsuite.save = function() {
  var path = builder.suite.getCommonSeleniumVersion().io.saveSuite(builder.suite.scripts, builder.suite.path);
  if (path) {
    builder.suite.path = path;
    builder.suite.setSuiteSaveRequired(false);
    builder.gui.suite.update();
  }
  builder.dialogs.exportsuite.hide();
};

builder.dialogs.exportsuite.saveAs = function() {
  var path = builder.suite.getCommonSeleniumVersion().io.saveSuite(builder.suite.scripts);
  if (path) {
    builder.suite.path = path;
    builder.suite.setSuiteSaveRequired(false);
    builder.gui.suite.update();
  }
  builder.dialogs.exportsuite.hide();
};

builder.dialogs.exportsuite.doExport = function() {
  var v = builder.suite.getCommonSeleniumVersion();
  var exporters = v.io.getSuiteExportFormatsFor(builder.suite.getCommonExportFormat());
  if (exporters.length === 0) {
    return;
  }
  if (exporters.length == 1) {
    var path = v.io.exportSuite(builder.suite.scripts, exporters[0]);
    if (path) {
      builder.suite.exportpath = path;
      builder.gui.suite.update();
    }
  } else {
    builder.dialogs.exportsuite.show(exporters);
  }
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
