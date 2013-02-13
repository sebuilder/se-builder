builder.selenium2.io.addLangFormatter({
  name: "Node.JS - WD",
  extension: ".js",
  not: "!",
  start:
    "var wd = require('wd')\n" +
    "  , _ = require('underscore')\n" +
    "  , fs = require('fs')\n" +
    "  , path = require('path')\n" +
    "  , uuid = require('uuid-js');\n" +
    "var VARS = {};\n" +
    "\n" +
    "var b = wd.promiseRemote();\n\n" +
    "b.on('status', function(info){" +
      "console.log('\x1b[36m%s\x1b[0m', info);" +
    "});" +
    "b.on('command', function(meth, path, data){" +
    "  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path, data || '');" +
    "});\n" +
    "b.init({\n" +
    "  browserName:'firefox'\n" +
    "})\n",
  end:
    ".fin(function () {\n" +
        "b.quit();\n" +
    "}).done();\n",
  lineForType: {
    "print":
      ".then(function () { console.log({text}); })\n",
    "pause":
      ".delay({waitTime})\n",
    "get":
      ".then(function () { return b.get({url}); })\n",
    "goBack":
      ".then(function () { return b.back(); })\n",
    "goForward":
      ".then(function () { return b.forward(); })\n",
    "store":
      ".then(function () {  ${{variable}} = '' + {text}; })\n",
    "clickElement":
      ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
      ".then(function (el) { return b.clickElement(el); })\n",
    "setElementText":
      ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
      ".then(function (el) { return b.clear(el)\n" +
      "  .then(function () { return b.type(el, {text}); });\n" +
      "})\n",
    "doubleClickElement":
      ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
      ".then(function (el) { return b.moveTo(el, 0, 0); })\n" +
      ".then(function () { return b.doubleclick(); })\n",
    "clickAndHoldElement":
      ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
      ".then(function (el) { return b.moveTo(el, 0, 0)\n" +
      "  .then(function (el) { return b.buttonDown(); })\n" +
      "})\n",
    "releaseElement":
      ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
      ".then(function (el) { return b.moveTo(el, 0, 0); })\n" +
      ".then(function (el) { return b.buttonUp(); })\n",
    "sendKeysToElement":
      ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
      ".then(function (el) { return b.type(el, {text}); })\n",
    "setElementSelected":
      ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
      ".then(function (el) { return b.isSelected(el)\n" +
      "  .then(function (isSelected) {\n" +
      "     if (!isSelected) {\n" +
      "       return b.clickElement(el);\n" +
      "     }\n" +
      "  });\n" +
      "})\n",
    "setElementNotSelected":
      ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
      ".then(function (el) { return b.isSelected(el)\n" +
      "  .then(function (isSelected) {\n" +
      "     if (isSelected) {\n" +
      "       return b.clickElement(el);\n" +
      "     }\n" +
      "  });\n" +
      "})\n",
    "close":
      "",
    "refresh":
      ".then(function () { return b.refresh() })",
    "addCookie":
      function(step, escapeValue) {
        var data = {value: step.value, name: step.name};
        step.options.split("/").forEach(function(entry) {
          var entryArr = entry.split("=");
          data[entryArr[0]] = data[entryArr[1]];
        });
        return ".then(function () { return b.setCookie(" + JSON.stringify(data) + "); })\n";
      },
    "deleteCookie":
      ".then(function () { return b.deleteCookie({name}); })\n",
    "saveScreenshot":
      ".then(function () { return b.takeScreenshot(); })\n" +
      ".then(function (base64Image) {\n" +
      "  var decodedImage = new Buffer(base64Image, 'base64');\n" +
      "  fs.writeFile(path.resolve(__dirname, 'screenShot' + uuid.create() + '.png'), decodedImage, function write(err) { if (err) throw err; });\n" +
      "})\n",
    "switchToFrame":
      ".then(function () { return b.frame({identifier}); })\n",
    "switchToFrameByIndex":
      ".then(function () { return b.frame({index}); })\n",
    "switchToWindow":
      ".then(function () { return b.window({name}); })\n",
    // "switchToDefaultContent":
    //   "        wd = (FirefoxDriver) wd.switchTo().switchToDefaultContent();\n",
    "answerAlert":
      ".then(function () { return b.alertKeys({text}); })\n" +
      ".then(function () { return b.acceptAlert(); })\n",
    "acceptAlert":
      ".then(function () { return b.acceptAlert(); })\n",
    "dismissAlert":
      ".then(function () { return b.dismissAlert(); })\n",
    "submitElement":
      ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
      ".then(function (el) { return b.submit(el); })"
  },
  waitFor: "",
  assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "{getter}\n" +
        "  if (_.isEqual({value},{cmp})) {\n" +
        "    b.quit();\n" +
        "    throw new Error('!{stepTypeName} failed');\n" +
        "  }\n" +
        "{getterFinish}\n", getter);
    } else {
      return doSubs(
        "{getter}\n" +
        "  if (!_.isEqual({value}, {cmp})) {\n" +
        "    b.quit();\n" +
        "    throw new Error('{stepTypeName} failed');\n" +
        "  }\n" +
        "{getterFinish}\n", getter);
    }
  },
  verify: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "{getter}\n" +
        "  if (_.isEqual({value}, {cmp})) {\n" +
        "    console.log('!{stepTypeName} failed');\n" +
        "  }\n" +
        "{getterFinish}\n", getter);
    } else {
      return doSubs(
        "{getter}\n" +
        "  if (!_.isEqual({value}, {cmp})) {\n" +
        "    console.log('{stepTypeName} failed');\n" +
        "  }\n" +
        "{getterFinish}\n", getter);
    }
  },
  store:
    "{getter}\n" +
    "${{variable}} = {value};\n" +
    "{getterFinish}\n",
  boolean_assert:
    "{getter}\n" +
    "if ({posNot}{value}) {\n" +
    "  b.quit(null);\n" +
    "  throw new Error('{negNot}{stepTypeName} failed');\n" +
    "}\n" +
    "{getterFinish}\n",
  boolean_verify:
    "{getter}\n" +
    "if ({posNot}{value}) {\n" +
    "  b.quit(null);\n" +
    "  console.log('{negNot}{stepTypeName} failed');\n" +
    "}\n" +
    "{getterFinish}\n",
  boolean_waitFor: "",
  boolean_store:
    "{getter}\n" +
    "${{variable}} = {value};" +
    "{getterFinish}\n",
  boolean_getters: {
    "TextPresent": {
      getter: ".then(function () { return b.elementByTagName('html'); })\n" +
      ".then(function (el) { return el.text(); })\n" +
      ".then(function (text) {\n" +
      "  var bool = text.indexOf({text}) != -1;",
      getterFinish: "})",
      value: "bool"
    },
    "ElementPresent": {
      getter: ".then(function () { return b.hasElement({locatorBy},{locator}); })\n" +
      ".then(function (el) {",
      getterFinish: "})",
      value: "bool"
    },
    "ElementSelected": {
      getter: ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
      ".then(function (el) { return b.isSelected(el); })\n" +
      ".then(function (bool) {",
      getterFinish: "})",
      value: "bool"
    },
    "CookiePresent": {
      getter: ".then(function () { return b.allCookies(); })\n" +
        ".then(function (cookies) {\n" +
        "  var hasCookie = _.find(cookies, function(e){ return e.name === {name}; });",
      getterFinish: "})",
      value: "hasCookie"
    },
    "AlertPresent": { // should return an error if it's not there (and true if it's there)
      getter: ".then(function () { return b.alertText(); })\n" +
        ".then(function (bool) { return bool; }, function (err) { return false; })\n" +
        ".then(function (bool) {",
      getterFinish: "})",
      value: "bool"
    }
  },
  getters: {
    "BodyText": {
      getter: ".then(function () { return b.elementByTagName('html'); })\n" +
        ".then(function (el) { return el.text(); })\n" +
        ".then(function (text) {",
      getterFinish: "})",
      cmp: "{text}",
      value: "text"
    },
    "PageSource": {
      getter: ".then(function () { return b.source(); })\n" +
        ".then(function (source) {",
      getterFinish: "})",
      cmp: "{source}",
      value: "source"
    },
    "Text": {
      getter: ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
        ".then(function (el) { return el.text(); })\n" +
        ".then(function (text) {",
      getterFinish: "})",
      cmp: "{text}",
      value: "text"
    },
    "CurrentUrl": {
      getter: ".then(function () { return b.url(); })" +
        ".then(function (url) {",
      getterFinish: "})",
      cmp: "{url}",
      value: "url"
    },
    "Title": {
      getter: ".then(function () { return b.title(); })\n" +
        ".then(function (title) {",
      getterFinish: "})",
      cmp: "{title}",
      value: "title"
    },
    "ElementValue": {
      getter: ".then(function () { return b.elementBy{locatorBy}({locator}); })\n" +
        ".then(function (el) { return b.getAttribute(el, 'value'); })" +
        ".then(function (value) {",
      getterFinish: "})",
      cmp: "{value}",
      value: "value"
    },
    "ElementAttribute": {
      getter: ".then(function (el) { return b.elementBy{locatorBy}({locator}); })\n" +
        ".then(function (el) { return b.getAttribute(el, {attributeName}); })" +
        ".then(function (value) {",
      getterFinish: "})",
      cmp: "{value}",
      value: "value"
    },
    "CookieByName": {
      getter: ".then(function (el) { return b.allCookies(); })\n" +
        ".then(function (cookies) {\n" +
        "  var cookie = _.find(cookies, function(e){ return e.name === {name}; });",
      getterFinish: "})",
      cmp: "{value}",
      value: "cookie"
    },
    "AlertText": {
      getter: ".then(function (el) { return b.alertText(); })" +
        ".then(function (text) {",
      getterFinish: "})",
      cmp: "{text}",
      value: "text"
    }
  },

  locatorByForType: function(stepType, locatorType, locatorIndex) {
    if(locatorType === "xpath"){ return "XPath"; }
    return locatorType.split(" ").map(function(el) {
      return el.charAt(0).toUpperCase() + el.slice(1);
    }).join("");
  },

  /**
   * Processes a parameter value into an appropriately escaped expression. Mentions of variables
   * with the ${foo} syntax are transformed into expressions that concatenate the variables and
   * literals.
   * For example:
   * a${b}c
   * becomes:
   * "a" + b + "c"
   */
  escapeValue: function(stepType, value, pName) {
    if (stepType.name.startsWith("store") && pName == "variable") { return value; }
    if (stepType.name == "switchToFrameByIndex" && pName == "index") { return value; }
    // This function takes a string literal and escapes it and wraps it in quotes.
    var esc = function(v) { return "\"" + v.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\""; };

    // Don't escape numerical values.
    if (stepType == builder.selenium2.stepTypes.pause) {
      esc = function(v) { return v; };
    }

    // The following is a transducer that produces the escaped expression by going over each
    // character of the input.
    var output = "";       // Escaped expression.
    var lastChunk = "";    // Accumulates letters of the current literal.
    var hasDollar = false; // Whether we've just encountered a $ character.
    var insideVar = false; // Whether we are reading in the name of a variable.
    var varName = "";      // Accumulates letters of the current variable.
    for (var i = 0; i < value.length; i++) {
      var ch = value.substring(i, i + 1);
      if (insideVar) {
        if (ch == "}") {
          // We've finished reading in the name of a variable.
          // If this isn't the start of the expression, use + to concatenate it.
          if (output.length > 0) { output += " + "; }
          output += "VARS." + varName;
          insideVar = false;
          hasDollar = false;
          varName = "";
        } else {
          // This letter is part of the name of the variable we're reading in.
          varName += ch;
        }
      } else {
        // We're not currently reading in the name of a variable.
        if (hasDollar) {
          // But we *have* just encountered a $, so if this character is a {, we are about to
          // do a variable.
          if (ch == "{") {
            insideVar = true;
            if (lastChunk.length > 0) {
              // Add the literal we've read in to the text.
              if (output.length > 0) { output += " + "; }
              output += esc(lastChunk);
            }
            lastChunk = "";
          } else {
            // No, it was just a lone $.
            hasDollar = false;
            lastChunk += "$" + ch;
          }
        } else {
          // This is the "normal case" - accumulating the letters of a literal. Unless the letter
          // is a $, in which case this may be the start of a
          if (ch == "$") { hasDollar = true; } else { lastChunk += ch; }
        }
      }
    }
    // Append the final literal, if any, to the output.
    if (lastChunk.length > 0) {
      if (output.length > 0) { output += " + "; }
      output += esc(lastChunk);
    }
    return output;
  },
  usedVar: function(varName, varType) { return "VARS." + varName; },
  unusedVar: function(varName, varType) { return "VARS." + varName; }
});
