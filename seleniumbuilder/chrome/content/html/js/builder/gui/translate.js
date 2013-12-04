builder.gui.translate = {};

function getSelectLocaleFunction(name) {
  return function() {
    jQuery('#locale_chooser').remove();
    
    builder.translate.setNewLocaleName(name);
    if (name == builder.translate.getEffectiveLocaleName()) {
      jQuery('#locale_indicator').text(name + " || " + _t('select_locale'));
    } else {
      jQuery('#locale_indicator').text(name + " || " + _t('new_locale_after_restart'));
    }
    jQuery('#locale_indicator').show();
  };
}

builder.gui.translate.selectLocale = function() {
  jQuery('#locale_indicator').hide();
  
  var dialog = newNode('div', { 'class': 'dialog', 'id': 'locale_chooser' },
    newNode('h3', _t('select_locale')),
    newNode('ul', {'id': 'locale_list'}),
    newNode('p',
      newNode('a', {
        'href': '#',
        'class': 'button',
        'click': function() {
          jQuery('#locale_chooser').remove();
          jQuery('#locale_indicator').show();
        }
      }, _t('cancel'))
    )
  );
  
  builder.dialogs.show(dialog);
  
  var locs = builder.translate.getAvailableLocales();
  var current_name = builder.translate.getEffectiveNewLocaleName();
  
  for (var i = 0; i < locs.length; i++) {
    jQuery('#locale_list').append(newNode('li', newNode('a', {
      'href': '#',
      'click': getSelectLocaleFunction(locs[i].name)
    }, (locs[i].name == current_name ? "> " : ""), locs[i].title)));
  }
};

var localeIndicator = newNode('a', {
    'href': '#',
    'style': '',
    'id': 'locale_indicator',
    'title': _t('select_locale'),
    'click': builder.gui.translate.selectLocale
  },
  builder.translate.getEffectiveLocaleName() + " || " + _t('select_locale'));

jQuery('#startup').append(localeIndicator);