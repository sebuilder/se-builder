builder.selenium2.io.locToJSON = function(loc) {
  return {
    type: loc.getName(builder.selenium2),
    value: loc.getValue()
  };
};

builder.selenium2.io.formats.push({
  name: "JSON",
  extension: ".json",
  format: function(script, name) {
    var cleanScript = {
      'type': 'script',
      'seleniumVersion': "2",
      'formatVersion': 2,
      'steps': [],
      'data': script.data
    };
    for (var i = 0; i < script.steps.length; i++) {
      cleanScript.steps.push(script.steps[i].toJSON());
    }
    return JSON.stringify(cleanScript, null, /* indent */ 2);
  },
  canExport: function(stepType) {
    return true;
  },
  nonExportables: function(script) {
    return [];
  }
});

builder.selenium2.io.suiteFormats.push({
  name: "JSON",
  extension: ".json",
  scriptFormatName: "JSON",
  format: function(scripts, path) {
    var cleanSuite = {
      "type": "suite",
      "seleniumVersion": "2",
      "formatVersion": 1,
      "scripts": []
    };
    for (var i = 0; i < scripts.length; i++) {
      var relPath = builder.io.deriveRelativePath(scripts[i].path, path);
      cleanSuite.scripts.push({"where": relPath.where, "path": relPath.path});
    }
    return JSON.stringify(cleanSuite, null, /* indent */ 2);
  }
});