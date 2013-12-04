// convert Selenium Builder format to output format using specified exporter
"use strict";
var fs = require('fs')
  , vm = require("vm")
  , path = require('path');

// prepare context and all the utility functions
var initContext = function(exporterName) {
  var files = ["selenium-ide/tools.js", "builder/script.js", "builder/selenium2/selenium2.js",
               "builder/locator.js", "builder/selenium2/io/io.js",
               "builder/selenium2/io/formats/" + exporterName + ".js"]
    , context = vm.createContext(
      {
        _t: function() { return arguments; },
        builder: {
          seleniumVersions: [],
          selenium1: {},
          selenium2: {io: { formats:[], lang_infos: []}}
        }
      });

  for (var i = 0; i < files.length; i++) {
    vm.runInContext(fs.readFileSync(path.resolve("./seleniumbuilder/chrome/content/html/js/", files[i])), context);
  }
  return context;
};

var main = function(args, readyCb, doneCb) {
  var inputPath = args[1]
    , exporterName = args[0]
    , outputPath = args[2]
    , context = initContext(exporterName);

  fs.readFile(inputPath, "utf8", function (err, data) {

    var input = context.builder.selenium2.io.parseScript(data, { 'where': 'local', 'path': '' });
    // exporter is first in list
    var format = context.builder.selenium2.io.formats[0];
    var output = format.format(input, "whatever-name-man", format.get_params);
    if (doneCb) { doneCb(output); }
    if (!outputPath) { return '';}
    fs.writeFile(outputPath, output, function(err) {
      if(err) {
        console.log(err);
      }
      else {
        console.log("Exported to " + exporterName);
      }
    });

  });
};

if (require.main === module) {
  main(process.argv.splice(2));
}

module.exports.run = main;
