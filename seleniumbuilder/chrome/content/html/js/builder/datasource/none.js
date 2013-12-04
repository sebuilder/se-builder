/** A dummy source for no data. */

builder.datasource.none = {};

builder.datasource.register(builder.datasource.none);

builder.datasource.none.id = "none";
builder.datasource.none.name = _t('no_source');

builder.datasource.none.fetchRows = function() {
  return [{}];
};

builder.datasource.none.showConfigDialog = function(callback) {
  callback({});
};

builder.datasource.none.hideConfigDialog = function() {};