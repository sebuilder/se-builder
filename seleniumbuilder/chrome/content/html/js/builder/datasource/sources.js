builder.datasource = {};

builder.datasource.sources = [];

builder.datasource.register = function(src) {
  builder.datasource.sources.push(src);
};

builder.datasource.getSources = function() {
  return builder.datasource.sources;
};

builder.datasource.getSourceForID = function(id) {
  for (var i = 0; i < builder.datasource.sources.length; i++) {
    if (builder.datasource.sources[i].id == id) { return builder.datasource.sources[i]; }
  }
  return null;
};

builder.datasource.getRows = function(script) {
  var src = builder.datasource.getSourceForID(script.data.source);
  if (!src) { return [{}]; }
  return src.fetchRows(script.data.configs[src.id]);
};

builder.datasource.updateMenu = function() {
  var srcs = builder.datasource.getSources();
  var script = builder.getScript();
  srcs.forEach(function(src) {
    if (script && script.data.source == src.id) {
      builder.gui.menu.highlightItem('data-' + src.id);
    } else {
      builder.gui.menu.deHighlightItem('data-' + src.id);
    }
  });
};

builder.datasource.showConfig = function(src) {
  function setConfig(config) {
    var script = builder.getScript();
    script.data.configs[src.id] = config;
    script.data.source = src.id;
    builder.datasource.updateMenu();
  }
  if (builder.getScript().data.configs[src.id]) {
    src.showConfigDialog(setConfig, builder.getScript().data.configs[src.id]);
  } else {
    src.showConfigDialog(setConfig);
  }
};