// Establish gui namespace.
builder.gui = {};
builder.views = {};

/** The view being displayed. */
builder.gui.currentView = null;

builder.gui.switchView = function(newView) {
  if (builder.gui.currentView !== null) {
    builder.gui.currentView.hide();
  }
  builder.gui.currentView = newView;
  builder.gui.currentView.show();
};

builder.registerPostLoadHook(function() {
  // Set the initial value of currenturl - this is necessary so that the startup-url field is
  // populated.
  builder.pageState.setCurrentUrl(window.bridge.getRecordingWindow().document.location.toString());
});

// There is a bug in Firefox ( https://bugzilla.mozilla.org/show_bug.cgi?id=531199 ) that causes
// window.beforeunload to be called twice. So we set and reset this flag to prevent asking the user
// twice whether they want to close the window.
builder.gui.preventDoubleQuestion = false;

// Ask the user if they want to save changes.
window.onbeforeunload = function() {
  if (builder.gui.preventDoubleQuestion) { return; }
  if (builder.suite.getSaveRequired()) {
    builder.gui.preventDoubleQuestion = true;
    window.setTimeout(function() { builder.gui.preventDoubleQuestion = false; }, 2000);
    return _t('unsaved_changes_warning');
  }
};

builder.runPreShutdownHooks = function() {
  for (var i = 0; i < builder.preShutdownHooks.length; i++) {
    try {
      builder.preShutdownHooks[i]();
    } catch (e) { dump(e); }
  }
  builder.preShutdownHooks = [];
};

builder.shutdown = function() {
  builder.runPreShutdownHooks();
  window.bridge.shutdown();
};

builder.reboot = function() {
  builder.runPreShutdownHooks();
  bridge.getBrowser().setTimeout(function() {
    bridge.boot();
  }, 1000);
  window.bridge.shutdown();
};

// If the recorder window is closed, shut down builder.
window.onunload = function() {
  builder.runPreShutdownHooks();
  window.bridge.recorderWindow = null; // As we're closing it ourselves just now, shutdown doesn't have to.
  window.bridge.shutdown();
};

builder.gui.addStartupEntry = function(text, id, f) {
  jQuery('#startup-entries').append(
    newNode('li', {'id': id},
      newNode('a', {'name': 'id', 'href': "#", 'click': f}, text)
    )
  );
};

builder.gui.removeStartupEntry = function(id) {
  jQuery('#' + id).remove();
};