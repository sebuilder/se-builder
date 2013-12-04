/**
 * Dialog that can be inserted to allow the user to run a test on Selenium RC/RemoteWebdriver.
 */
builder.dialogs.rc = {};
/** The DOM node into which to insert the dialog. */
builder.dialogs.rc.node = null;
/** The dialog. */
builder.dialogs.rc.dialog = null;
/** Whether the dialog is for playing all scripts in the suite */
builder.dialogs.rc.playall = false;
  
/**
 * Insert a run on RC dialog.
 * @param anode The DOM node into which to insert the dialog, replacing its contents.
 * @param doplayall Whether the dialog is for playing all scripts in the suite
 * @param altCallback If specified, called instead of running RC.
 * @param altOKText If specified, overrides the text in the "Run" button.
 */
builder.dialogs.rc.show = function (node, playall, altCallback, altOKText) {
  builder.dialogs.rc.node = node;
  builder.dialogs.rc.playall = playall;
  
  var script = builder.getScript();
  
  builder.dialogs.rc.showSel1 = playall ? builder.suite.isAnyScriptOfVersion(builder.selenium1) : script.seleniumVersion == builder.selenium1;
  builder.dialogs.rc.showSel2 = playall ? builder.suite.isAnyScriptOfVersion(builder.selenium2) : script.seleniumVersion == builder.selenium2;
  
  builder.dialogs.rc.dialog = newNode('div', {'class': 'dialog'});
  
  var run_b = newNode('a', altOKText || _t('run_script'), {
    'class': 'button',
    'click': function () {
      var versionToSettings = {};
      if (builder.dialogs.rc.showSel1) {
        versionToSettings[builder.selenium1] = {
          hostPort: jQuery('#sel1-hostPort').val(),
          browserstring: jQuery('#sel1-browserstring').val()
        };
        builder.selenium1.rcPlayback.setHostPort(jQuery('#sel1-hostPort').val());
        builder.selenium1.rcPlayback.setBrowserString(jQuery('#sel1-browserstring').val());
      }
      if (builder.dialogs.rc.showSel2) {
        versionToSettings[builder.selenium2] = {
          hostPort: jQuery('#sel2-hostPort').val(),
          browserstring: jQuery('#sel2-browserstring').val(),
          browserversion: jQuery('#sel2-browserversion').val(),
          platform: jQuery('#sel2-platform').val()
        };
        builder.selenium2.rcPlayback.setHostPort(jQuery('#sel2-hostPort').val());
        builder.selenium2.rcPlayback.setBrowserString(jQuery('#sel2-browserstring').val());
        builder.selenium2.rcPlayback.setBrowserVersion(jQuery('#sel2-browserversion').val());
        builder.selenium2.rcPlayback.setPlatform(jQuery('#sel2-platform').val());
      }
      builder.dialogs.rc.hide();
      if (altCallback) {
        altCallback(versionToSettings);
      } else {
        if (playall) {
          builder.dialogs.runall.runRC(node, versionToSettings);
        } else {
          builder.views.script.onStartRCPlayback();
          script.seleniumVersion.rcPlayback.run(versionToSettings[script.seleniumVersion], builder.views.script.onEndRCPlayback, builder.views.script.onConnectionEstablished, builder.stepdisplay.updateStepPlaybackState);
        }
      }
    },
    'href': '#run'
  });
  var cancel_b = newNode('a', _t('cancel'), {
    'class': 'button',
    'click': function () {
      builder.dialogs.rc.hide();
    },
    'href': '#cancel'
  });
  var bDiv = newNode('div', {style:'margin-top: 20px;'});
  jQuery(bDiv).append(run_b).append(cancel_b);
  var chooseHeader = newNode('h4', _t('selenium_rc_settings'));
  
  var optDiv = newNode('div', {id: 'options-div'},
    newNode('table', {style: 'border: none;', id: 'rc-options-table'})
  );
  
  jQuery(builder.dialogs.rc.dialog).
      append(chooseHeader).
      append(optDiv).
      append(bDiv);
      
  jQuery(node).append(builder.dialogs.rc.dialog);
  
  if (builder.dialogs.rc.showSel1) {
    jQuery('#rc-options-table').append(newNode('tr', {'colspan': '2'}, newNode('h4', "Selenium 1")));
    jQuery('#rc-options-table').append(newNode('tr',
      newNode('td', _t('rc_server_host_port') + " "),
      newNode('td', newNode('input', {id: 'sel1-hostPort', type: 'text', value: builder.selenium1.rcPlayback.getHostPort()}))
    ));
    jQuery('#rc-options-table').append(newNode('tr',
      newNode('td', _t('rc_browser_string') + " "),
      newNode('td', newNode('input', {id: 'sel1-browserstring', type: 'text', value: builder.selenium1.rcPlayback.getBrowserString()}))
    ));
  }
  
  if (builder.dialogs.rc.showSel2) {
    jQuery('#rc-options-table').append(newNode('tr', {'colspan': '2'}, newNode('h4', "Selenium 2")));
    jQuery('#rc-options-table').append(newNode('tr',
      newNode('td', _t('rc_server_host_port') + " "),
      newNode('td', newNode('input', {id: 'sel2-hostPort', type: 'text', value: builder.selenium2.rcPlayback.getHostPort()}))
    ));
    jQuery('#rc-options-table').append(newNode('tr',
      newNode('td', _t('rc_browser_string') + " "),
      newNode('td', newNode('input', {id: 'sel2-browserstring', type: 'text', value: builder.selenium2.rcPlayback.getBrowserString()}))
    ));
    jQuery('#rc-options-table').append(newNode('tr',
      newNode('td', _t('rc_browser_version') + " "),
      newNode('td', newNode('input', {id: 'sel2-browserversion', type: 'text', value: builder.selenium2.rcPlayback.getBrowserVersion()}))
    )).append(newNode('tr',
      newNode('td', _t('rc_platform') + " "),
      newNode('td', newNode('input', {id: 'sel2-platform', type: 'text', value: builder.selenium2.rcPlayback.getPlatform()}))
    ));
  }
};

builder.dialogs.rc.hide = function () {
  jQuery(builder.dialogs.rc.dialog).remove();
};
