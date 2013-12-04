builder.views.startup = {};

// Attach listeners to the relevant links and buttons.
builder.registerPostLoadHook(function () {
  builder.gui.addStartupEntry(_t('open_script_or_suite'), 'startup-open', function() { builder.io.loadUnknownFile(false); });
  builder.gui.addStartupEntry(_t('view_command_table'), 'startup-show-steps-table', builder.gui.stepstable.show);
  builder.gui.addStartupEntry(_t('manage_plugins'), 'startup-plugins', function() {
    builder.gui.switchView(builder.views.plugins);
  });
  
  jQuery('#startup-plugins').append(newNode('span', _t('updates_available'), {'id': 'startup-plugins-hasupdates', 'style': "display: none;", 'class': "updates-available"}));
  
  jQuery('#startrecording-msg').text(_t('start_recording_at'));
  jQuery('#cookie-warning').text(_t('cookie_warning'));
  
  jQuery('#startup-start-recording-sel1').submit(function() {
    builder.record.startRecording(jQuery('#startup-url').val(), builder.selenium1);
  });
  jQuery('#startup-start-recording-sel2').submit(function() {
    builder.record.startRecording(jQuery('#startup-url').val(), builder.selenium2);
  });
});

// Populate the input field for the URL to record from.
builder.pageState.addListener(function (url, loading) {
  jQuery('#startup-url').val(url);
});

builder.views.startup.show = function() {
  jQuery('#startup, #heading-startup').show();
  jQuery('#dialog-attachment-point').css('top', '-30px');
  builder.plugins.hasUpdates(function(has) {
    if (has) {
      jQuery('#startup-plugins-hasupdates').show();
    } else {
      jQuery('#startup-plugins-hasupdates').hide();
    }
  });
};

builder.views.startup.hide = function() {
  jQuery('#startup, #heading-startup').hide();
  jQuery('#dialog-attachment-point').css('top', '1em');
};