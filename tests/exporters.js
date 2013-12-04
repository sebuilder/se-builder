// test exporters - run selenium tests using each one

var assert = require('assert')
  , convert = require('../tools/convert')
  , Log = require('coloured-log')
  , log = new Log(Log.DEBUG);

// test exporters
var exporters = ["node-wd", "node-mocha", "java_new", "english"];
var testExporter = function(exporter, testFile) {
  assert.doesNotThrow(function(){
    convert.run([exporter, testFile]);
  });
};

var testFile = "./tests/examples/full_example.json";

for (var i = exporters.length - 1; i >= 0; i--) {
  log.debug("Testing exporter " + exporters[i]);
  testExporter(exporters[i], testFile);
}

log.info("Tested " + exporters.length + " exporters succesfully");

// non-available exporter
assert.throws(function() {
  convert.run(["non-available-exporter", testFile]);
});
