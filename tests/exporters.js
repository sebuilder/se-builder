// test exporters - run selenium tests using each one

var assert = require('assert')
  , convert = require('../tools/convert');

// test exporters
var exporters = ["node-wd", "java_new", "english"];
var testExporter = function(exporter, testFile) {
  assert.doesNotThrow(function(){
    convert.run([exporter, testFile]);
  });
};

var testFile = "./tests/examples/full_example.json";

for (var i = exporters.length - 1; i >= 0; i--) {
  testExporter(exporters[i], testFile);
}

// non-available exporter
assert.throws(function() {
  convert.run(["non-available-exporter", testFile]);
});
