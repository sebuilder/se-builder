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
  
  builder.dialogs.rc.dialog = newNode('div', {'class': 'dialog'});
  var script = builder.getScript();
  
  var run_b = newNode('a', altOKText || _t('run_script'), {
    'class': 'button',
    'click': function () {
      var hostPort = jQuery('#rc-hostport').val();
      var browserString = jQuery('#rc-browserstring').val();
      script.seleniumVersion.rcPlayback.setHostPort(hostPort);
      script.seleniumVersion.rcPlayback.setBrowserString(browserString);
      var browserVersion = null;
      var platform = null;
      if (script.seleniumVersion.rcPlayback.browserVersionAndPlatform) {
        browserVersion = jQuery('#rc-browserversion').val();
        platform = jQuery('#rc-platform').val();
        script.seleniumVersion.rcPlayback.setBrowserVersion(browserVersion);
        script.seleniumVersion.rcPlayback.setPlatform(platform);
      }
      builder.dialogs.rc.hide();
      if (altCallback) {
        altCallback(hostPort, browserString);
      } else {
        if (playall) {
          builder.dialogs.runall.runRC(node, hostPort, browserString, browserVersion, platform);
        } else {
          if (script.seleniumVersion.rcPlayback.browserVersionAndPlatform) {
            script.seleniumVersion.rcPlayback.run(hostPort, browserString, browserVersion, platform);
          } else {
            script.seleniumVersion.rcPlayback.run(hostPort, browserString);
          }
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
    newNode('table', {style: 'border: none;', id: 'rc-options-table'},
      newNode('tr',
        newNode('td', _t('rc_server_host_port') + " "),
        newNode('td', newNode('input', {id: 'rc-hostport', type: 'text', value: script.seleniumVersion.rcPlayback.getHostPort()}))
      ),
      newNode('tr',
        newNode('td', _t('rc_browser_string') + " "),
        newNode('td', newNode('input', {id: 'rc-browserstring', type: 'text', value: script.seleniumVersion.rcPlayback.getBrowserString()}))
      )
    )
  );
  
  jQuery(builder.dialogs.rc.dialog).
      append(chooseHeader).
      append(optDiv).
      append(bDiv);
      
  jQuery(node).append(builder.dialogs.rc.dialog);
  
  if (script.seleniumVersion.rcPlayback.browserVersionAndPlatform) {
    jQuery('#rc-options-table').append(newNode('tr',
      newNode('td', _t('rc_browser_version') + " "),
      newNode('td', newNode('input', {id: 'rc-browserversion', type: 'text', value: script.seleniumVersion.rcPlayback.getBrowserVersion()}))
    )).append(newNode('tr',
      newNode('td', _t('rc_platform') + " "),
      newNode('td', newNode('input', {id: 'rc-platform', type: 'text', value: script.seleniumVersion.rcPlayback.getPlatform()}))
    ));
  }
};

builder.dialogs.rc.hide = function () {
  jQuery(builder.dialogs.rc.dialog).remove();
};
