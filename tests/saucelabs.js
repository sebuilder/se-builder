// test exporters with SuaceLabs

var assert = require('assert')
  , convert = require('../tools/convert')
  , Log = require('coloured-log')
  , log = new Log(Log.DEBUG)
  , vm = require("vm")
  , fs = require('fs')
  , wd = require('wd')
  , _ = require('underscore')
  , q = require('q')
  , path = require('path')
  , uuid = require('uuid-js')
  , request = require('request')
  , rqst = request.defaults({jar: false})
  , platforms = [
    { browserName: "firefox", platform: "VISTA" },
    { browserName: "chrome", platform: "Linux" },
    { browserName: "iexplore", platform: "Windows 2008" }
  ]
  , login = process.env.SAUCE_USERNAME
  , accessKey = process.env.SAUCE_ACCESS_KEY
  , buildId = process.env.TRAVIS_JOB_ID || Math.random().toString(36).slice(2);

log.info("Testing if exporterts really work with Selenium & Sauce Labs");

if (process.env.TRAVIS_PULL_REQUEST !== false) {
  return log.info("This is a pull request, skipping");
}

// exporters to test
var exporters = ["node-wd"];

var SauceStatus = function(user, key) {
  this.user = user;
  this.key = key;
  this.baseUrl = ["https://", this.user, ':', this.key, '@saucelabs.com', '/rest/v1/', this.user].join("");
};

SauceStatus.prototype.passed = function(jobid, status, callback) {
  var _body = JSON.stringify({
    "passed": status
  }),
    _url = this.baseUrl + "/jobs/" + jobid;
  rqst({
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: "PUT",
    url: _url,
    body: _body,
    json: true
  }, function() {
    callback();
  });
};

var sauceStatus = new SauceStatus(login, accessKey);
var testExporter = function(exporter, testFile) {
  assert.doesNotThrow(function(){
    _.each(platforms, function (caps) {
      caps = _.clone(caps);

      var isDone = function () {
        log.info("Sauce job finished succesfully, job id:" + context.b.sessionID);
        sauceStatus.passed(context.b.sessionID, true, function () {
        });
      },
      isError = function (err) {
        log.error("run failed - stacktrace below");
        // mark job as failed
        sauceStatus.passed(context.b.sessionID, false, function () {
          throw new Error(err);
        });
      },
      context = vm.createContext({
          require: require,
          fs: fs,
          wd: wd,
          _: _,
          path: path,
          uuid: uuid,
          console: console,
          Buffer: Buffer,
          q: q,
          __dirname: __dirname,
          isDone: isDone, isError: isError
      });

      caps.name = exporter;
      caps.build = buildId;

      var conversionDone = function (output) {
        selenium = output.replace('wd.promiseRemote()', 'wd.promiseRemote("ondemand.saucelabs.com", 80, "' + login + '", "' + accessKey + '")');
        selenium = selenium.replace(/b\.init\({[\S\s]*?}\)/, 'b.init(' + JSON.stringify(caps) + ')');
        selenium = selenium.replace('}).done();', '}).done(isDone, isError);');

        log.debug("Running output of exporter " + exporter + " against Sauce");
        vm.runInContext(selenium, context);
      };

      convert.run([exporter, testFile], null, conversionDone);
    });
  });
};

var testFile = "./tests/examples/full_example.json";

for (var i = exporters.length - 1; i >= 0; i--) {
  log.debug("Testing exporter " + exporters[i]);
  testExporter(exporters[i], testFile);
}
