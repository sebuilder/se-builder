/** Dialog for asking the user what format they would like to convert a script into. */
builder.dialogs.convert = {};

builder.dialogs.convert.node = null;
builder.dialogs.convert.dialog = null;

function createConversionLi(script, version) {
  return newNode('li', {}, newNode('a', { href: '#', click: function() {
    builder.setScript(builder.versionconverter.convertScript(script, version));
    builder.stepdisplay.update();
    builder.suite.setCurrentScriptSaveRequired(true);
    builder.gui.suite.update();
    builder.dialogs.convert.hide();
  } }, version.name));
}

builder.dialogs.convert.show = function(node) {
  var script = builder.getScript(), i, version;
  var conversionOptions = [];
  for (i = 0; i < builder.seleniumVersions.length; i++) {
    version = builder.seleniumVersions[i];
    if (version === script.seleniumVersion) { continue; }
    if (builder.versionconverter.canConvert(script, version)) {
      conversionOptions.push(version);
    }
  }
  
  if (conversionOptions.length === 1) {
    builder.setScript(builder.versionconverter.convertScript(script, conversionOptions[0]));
    builder.stepdisplay.update();
    builder.suite.setCurrentScriptSaveRequired(true);
    builder.gui.suite.update();
    return;
  }
  
  builder.dialogs.convert.dialog = newNode('div', {'class': 'dialog'});
  jQuery(node).append(builder.dialogs.convert.dialog);
  
  var format_list = newNode('ul');  
  var cancel_b = newNode('a', _t('cancel'), {
    'class': 'button',
    'click': function () {
      builder.dialogs.convert.hide();
    },
    'href': '#cancel'
  });
  jQuery(builder.dialogs.convert.dialog).
      append(newNode('h3', _t('script_conversion'))).
      append(format_list).
      append(newNode('p', cancel_b));
  
  for (i = 0; i < builder.seleniumVersions.length; i++) {
    version = builder.seleniumVersions[i];
    if (version == script.seleniumVersion) { continue; }
    if (builder.versionconverter.canConvert(script, version)) {
      jQuery(format_list).append(createConversionLi(script, version));
    } else {
      var iList = builder.versionconverter.nonConvertibleStepNames(builder.getScript(), version);
      var inconvertibles = "";
      for (i = 0; i < iList.length; i++) {
        inconvertibles += iList[i] + " ";
      }
      jQuery(format_list).append(newNode('li', version.name + ": " + _t('the_following_steps_cant_be_converted') + ": " + inconvertibles));
    }
  }
};

builder.dialogs.convert.hide = function() {
  jQuery(builder.dialogs.convert.dialog).remove();
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
