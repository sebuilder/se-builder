builder.views.plugins = {};

builder.views.plugins.show = function () {
  jQuery('#plugins').show();
  builder.views.plugins.refresh();
};

builder.views.plugins.hide = function () {
  jQuery('#plugins').hide();
};

builder.registerPostLoadHook(function() {
  jQuery('#plugins-title').text(_t('plugins_title'));
  jQuery('#plugins-back').text(_t('plugins_back'));
  jQuery('#plugins-refresh').text(_t('plugins_refresh'));
  jQuery('#plugins-loading-msg').text(_t('plugins_loading'));
  jQuery('#plugins-downloading-msg').text(_t('plugins_downloading'));
  
  jQuery('#plugins-back').click(function() {
    builder.gui.switchView(builder.views.startup);
  });
  jQuery('#plugins-refresh').click(function() {
    builder.views.plugins.refresh();
  });
});

builder.views.plugins.getName = function(info) {
  if (info.installedInfo) {
    return info.installedInfo.name + " " + info.installedInfo.pluginVersion;
  } else {
    return info.repositoryInfo.name + " " + info.repositoryInfo.browsers[bridge.browserType()].pluginVersion;
  }
};

builder.views.plugins.getIcon = function(info) {
  if (info.installedInfo && info.installedInfo.icon) {
    return builder.plugins.getResourcePath(info.identifier, info.installedInfo.icon);
  } else {
    return info.repositoryInfo ? info.repositoryInfo.icon : "";
  }
};

builder.views.plugins.getStatus = function(info) {
  var state = "";
  if (info.installState == builder.plugins.INSTALLED) {
    state = {
      "DISABLED":   _t('plugin_disabled'),
      "ENABLED":    _t('plugin_installed'),
      "TO_ENABLE":  _t('plugin_installed_to_enable'),
      "TO_DISABLE": _t('plugin_installed_to_disable')
    }[info.enabledState];
  } else {
    state = {
      "NOT_INSTALLED" : _t('plugin_not_installed'),
      "TO_INSTALL"    : _t('plugin_to_install'),
      "TO_UNINSTALL"  : _t('plugin_to_uninstall'),
      "TO_UPDATE"     : _t('plugin_to_update')
    }[info.installState];
  }
  if (info.installState == "NOT_INSTALLED") {
    if (builder.plugins.isPluginTooNew(info)) {
      state += _t('cant_install_builder_too_old');
    } else if (builder.plugins.isPluginTooOld(info)) {
      state += _t('cant_install_builder_too_new');
    }
  }
  if (builder.plugins.isUpdateable(info)) {
    if (builder.plugins.isPluginTooNew(info)) {
      state += _t('cant_update_builder_too_old', info.repositoryInfo.browsers[bridge.browserType()].pluginVersion);
    } else if (builder.plugins.isPluginTooOld(info)) {
      state += _t('cant_update_builder_too_new', info.repositoryInfo.browsers[bridge.browserType()].pluginVersion);
    } else {
      state += _t('plugin_update_available', info.repositoryInfo.browsers[bridge.browserType()].pluginVersion);
    }
  }
  return state;
};

builder.views.plugins.getEntryClass = function(info) {
  if (info.installState == builder.plugins.INSTALLED) {
    return {
      "DISABLED":   "disabled",
      "ENABLED":    "installed",
      "TO_ENABLE":  "installed",
      "TO_DISABLE": "disabled"
    }[info.enabledState];
  }
  
  return {
    "NOT_INSTALLED" : "not_installed",
    "TO_INSTALL"    : "installed",
    "TO_UNINSTALL"  : "not_installed",
    "TO_UPDATE"     : "installed"
  }[info.installState];
};

builder.views.plugins.getDescription = function(info) {
  var i = info.installedInfo ? info.installedInfo : info.repositoryInfo;
  
  if (i["description_" + builder.translate.getLocaleName()]) {
    return i["description_" + builder.translate.getLocaleName()];
  } else {
    return i.description;
  }
};

builder.views.plugins.makePluginEntry = function(info) {
  var entry = newNode('li', {'class': builder.views.plugins.getEntryClass(info), 'id': info.identifier + '-entry'},
    newNode('img', {'src': builder.views.plugins.getIcon(info), 'class': 'pluginIcon'}),
    newNode('div', {'class': 'pluginInfo'},
      newNode('div', {'class': 'pluginHeader'},
        newNode('span', {'class': 'pluginName'}, builder.views.plugins.getName(info)),
        newNode('span', {'class': 'pluginStatus', 'id': info.identifier + '-status'}, builder.views.plugins.getStatus(info))
      ),
      newNode('div', {'class': 'pluginDescription'}, builder.views.plugins.getDescription(info)),
      newNode('span', {'id': info.identifier + '-s-install-and-reboot'}, newNode('a', {'href': '#', 'class': 'button', 'id': info.identifier + '-install-and-reboot'}, _t('plugin_install'))),
      newNode('a', {'href': '#', 'class': 'button', 'id': info.identifier + '-uninstall-and-reboot'}, _t('plugin_uninstall')),
      newNode('a', {'href': '#', 'class': 'button', 'id': info.identifier + '-update-and-reboot'}, _t('plugin_update')),
      newNode('a', {'href': '#', 'class': 'button', 'id': info.identifier + '-enable-and-reboot' }, _t('plugin_enable')),
      newNode('a', {'href': '#', 'class': 'button', 'id': info.identifier + '-disable-and-reboot'  }, _t('plugin_disable'))
  ));
    
  return entry;
};

builder.views.plugins.updatePluginEntry = function(info) {
  jQuery('#' + info.identifier + '-entry').removeClass().addClass(builder.views.plugins.getEntryClass(info));
  jQuery('#' + info.identifier + '-status').text(builder.views.plugins.getStatus(info));
  
  jQuery('#' + info.identifier + '-install-and-reboot').toggle(info.installState == builder.plugins.NOT_INSTALLED && !builder.plugins.isPluginTooNew(info) && !builder.plugins.isPluginTooOld(info));
  jQuery('#' + info.identifier + '-uninstall-and-reboot').toggle(info.installState == builder.plugins.INSTALLED);
  jQuery('#' + info.identifier + '-update-and-reboot').toggle(info.installState == builder.plugins.INSTALLED && builder.plugins.isUpdateable(info) && !builder.plugins.isPluginTooNew(info) && !builder.plugins.isPluginTooOld(info));
  jQuery('#' + info.identifier + '-enable-and-reboot').toggle(info.installState == builder.plugins.INSTALLED && (info.enabledState == builder.plugins.DISABLED || info.enabledState == builder.plugins.TO_DISABLE));
  jQuery('#' + info.identifier + '-disable-and-reboot').toggle(info.installState == builder.plugins.INSTALLED && (info.enabledState == builder.plugins.ENABLED || info.enabledState == builder.plugins.TO_ENABLE));
};

builder.views.plugins.getLicense = function(info) {
  return (info.repositoryInfo && info.repositoryInfo.license) ? info.repositoryInfo.license : null;
};

builder.views.plugins.wirePluginEntry = function(info) {
  jQuery('#' + info.identifier + '-install-and-reboot').click(function() {
    var license = builder.views.plugins.getLicense(info);
    if (license && !confirm(license)) { return; }
    builder.plugins.setInstallState(info.identifier, builder.plugins.TO_INSTALL);
    info.installState = builder.plugins.TO_INSTALL;
    builder.views.plugins.updatePluginEntry(info);
    builder.plugins.performDownload(info.identifier, info.repositoryInfo.browsers[bridge.browserType()].downloadUrl, function() {
      builder.plugins.setGotoPluginsView(true);
      builder.reboot();
    });
  });
  
  jQuery('#' + info.identifier + '-uninstall-and-reboot').click(function() {
    builder.plugins.setInstallState(info.identifier, builder.plugins.TO_UNINSTALL);
    info.installState = builder.plugins.TO_UNINSTALL;
    builder.views.plugins.updatePluginEntry(info);
    builder.plugins.setGotoPluginsView(true);
    builder.reboot();
  });
  
  jQuery('#' + info.identifier + '-update-and-reboot').click(function() {
    var license = builder.views.plugins.getLicense(info);
    if (license && !confirm(license)) { return; }
    builder.plugins.setInstallState(info.identifier, builder.plugins.TO_UPDATE);
    info.installState = builder.plugins.TO_UPDATE;
    builder.views.plugins.updatePluginEntry(info);
    builder.plugins.performDownload(info.identifier, info.repositoryInfo.browsers[bridge.browserType()].downloadUrl);
    builder.plugins.setGotoPluginsView(true);
    builder.reboot();
  });
  
  jQuery('#' + info.identifier + '-enable-and-reboot').click(function() {
    var newEnabled = info.enabledState == builder.plugins.DISABLED ? builder.plugins.TO_ENABLE : builder.plugins.ENABLED;
    builder.plugins.setEnabledState(info.identifier, newEnabled);
    info.enabledState = newEnabled;
    builder.views.plugins.updatePluginEntry(info);
    builder.plugins.setGotoPluginsView(true);
    builder.reboot();
  });
  
  jQuery('#' + info.identifier + '-disable-and-reboot').click(function() {
    var newEnabled = info.enabledState == builder.plugins.ENABLED ? builder.plugins.TO_DISABLE : builder.plugins.DISABLED;
    builder.plugins.setEnabledState(info.identifier, newEnabled);
    info.enabledState = newEnabled;
    builder.views.plugins.updatePluginEntry(info);
    builder.plugins.setGotoPluginsView(true);
    builder.reboot();
  });
}

builder.views.plugins.refresh = function() {
  jQuery('#plugins-loading').show();
  jQuery('#plugins-list').html('');
  builder.plugins.getListAsync(function(result, error) {
    jQuery('#plugins-loading').hide();
    if (error) {
      alert(error);
    } else {
      for (var i = 0; i < result.length; i++) {
        jQuery('#plugins-list').append(builder.views.plugins.makePluginEntry(result[i]));
        builder.views.plugins.wirePluginEntry(result[i]);
        builder.views.plugins.updatePluginEntry(result[i]);
      }
    }
  });
};