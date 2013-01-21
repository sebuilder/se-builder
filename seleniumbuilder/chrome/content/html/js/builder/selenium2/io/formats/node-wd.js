builder.selenium2.io.addLangFormatter({
  name: "Node.JS - WD",
  extension: ".js",
  not: "!",
  start:
    "var wd = require('wd')\n" +
    "  , assert = require('assert')\n" +
    "  , _ = require('underscore')\n" +
    "  , fs = require('fs')\n" +
    "  , path = require('path')\n" +
    "  , uuid = require('uuid-js');\n" +
    "var VARS = {};\n" +
    "\n" +
    "var b = wd.remote();\n\n" +
    "b.on('status', function(info){" +
      "console.log('\x1b[36m%s\x1b[0m', info);" +
    "});" +
    "b.on('command', function(meth, path, data){" +
    "  console.log(' > \x1b[33m%s\x1b[0m: %s', meth, path, data || '');" +
    "});\n" +
    "b.chain().init({\n" +
    "  browserName:'chrome'\n" +
    "})\n",
  end:
    ".quit(null);\n",
  lineForType: {
    "print":
      ".queueAdd(function(){ console.log({text}); })\n",
    "pause":
      ".pauseChain({waitTime})\n",
    "get":
      ".get({url})\n",
    "goBack":
      ".back()\n",
    "goForward":
      ".forward()\n",
    "store":
      ".queueAdd(function(){ ${{variable}} = '' + {text};})\n",
    "clickElement":
      ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.next('clickElement', el, function(){});\n" +
      "})\n",
    "setElementText":
      ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.next('clear', el, function(err){\n" +
      "    b.next('type', el, {text}, function(){});\n" +
      "  });\n" +
      "})\n",
    "doubleClickElement":
      ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.next('moveTo', el, 0, 0, function(){\n" +
        "  b.next('doubleclick', function(){});\n" +
      "  });\n" +
      "})\n",
    "clickAndHoldElement":
      ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.next('moveTo', el, 0, 0, function(){\n" +
        "  b.next('buttonDown', function(){});\n" +
      "  });\n" +
      "})\n",
    "releaseElement":
      ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.next('moveTo', el, 0, 0, function(){\n" +
        "  b.next('buttonUp', function(){});\n" +
      "  });\n" +
      "})\n",
    "sendKeysToElement":
      ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.next('type', el, {text}, function(){});\n" +
      "})\n",
    "setElementSelected":
      ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.next('isSelected', el, function(err, isSelected){\n" +
      "    if (!isSelected) {\n" +
      "      b.next('clickElement', el, function(){});\n" +
      "    }\n" +
      "  });\n" +
      "})\n",
    "setElementNotSelected":
      ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.next('isSelected', el, function(err, isSelected){\n" +
      "    if (isSelected) {\n" +
      "      b.next('clickElement', el, function(){});\n" +
      "    }\n" +
      "  });\n" +
      "})\n",
    "close":
      "",
    "refresh":
      ".refresh(function(){})\n",
    "addCookie":
      function(step, escapeValue) {
        var data = {value: step.value, name: step.name};
        step.options.split("/").forEach(function(entry) {
          var entryArr = entry.split("=");
          data[entryArr[0]] = data[entryArr[1]];
        });
        return ".setCookie(" + JSON.stringify(data) + ", function(){})\n";
      },
    "deleteCookie":
      ".deleteCookie({name}, function(){})\n",
    "saveScreenshot":
      ".takeScreenshot(function(err, base64Image) {\n" +
      "  var decodedImage = new Buffer(base64Image, 'base64');\n" +
      "  fs.writeFile(path.resolve(__dirname, 'screenShot' + uuid.create() + '.png'), decodedImage, function write(err) { if (err) throw err; });\n" +
      "})\n",
    "switchToFrame":
      ".frame({identifier}, function(){})\n",
    "switchToFrameByIndex":
      ".frame({index}, function(){})\n",
    "switchToWindow":
      ".window({name}, function(){})\n",
    // "switchToDefaultContent":
    //   "        wd = (FirefoxDriver) wd.switchTo().switchToDefaultContent();\n",
    "answerAlert":
      ".alertKeys({text}, function() {\n" +
      "  b.next('acceptAlert', function(){});\n" +
      "})\n",
    "acceptAlert":
      ".acceptAlert(function(){})\n",
    "dismissAlert":
      ".dismissAlert(function(){})\n",

    "submitElement":
      ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.next('submit', el, function(err){});" +
      "})\n"
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
      getter: ".elementByTagName('html', function(err, el) {\n" +
        "  b.next('text', el, function(err, text){\n" +
      "    var bool = text.indexOf({text}) != -1;",
      getterFinish: "  });\n})",
      value: "bool"
    },
    "ElementPresent": {
      getter: ".hasElement({locatorBy},{locator}, function(err, bool) {",
      getterFinish: "})",
      value: "bool"
    },
    "ElementSelected": {
      getter: ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "b.next('isSelected', el, function(err, bool){",
      getterFinish: "  });\n})",
      value: "bool"
    },
    "CookiePresent": {
      getter: ".allCookies(function(err, cookies) {\n" +
        "  var hasCookie = _.find(cookies, function(e){ return e.name === {name}; });",
      getterFinish: "})",
      value: "hasCookie"
    },
    "AlertPresent": {
      getter: ".alertText(function(err, bool){",
      getterFinish: "})",
      value: "bool"
    }
  },
  getters: {
    "BodyText": {
      getter: ".elementByTagName('html', function(err, el) {\n" +
      "  b.text(el, function(err, text){",
      getterFinish: "  });\n})",
      cmp: "{text}",
      value: "text"
    },
    "PageSource": {
      getter: ".source(function(err, source) {",
      getterFinish: "})",
      cmp: "{source}",
      value: "source"
    },
    "Text": {
      getter: ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.text(el, function(err, text){",
      getterFinish: "  });\n})",
      cmp: "{text}",
      value: "text"
    },
    "CurrentUrl": {
      getter: ".url(function(err, url) {",
      getterFinish: "})",
      cmp: "{url}",
      value: "url"
    },
    "Title": {
      getter: ".title(function(err, title){",
      getterFinish: "})",
      cmp: "{title}",
      value: "title"
    },
    "ElementValue": {
      getter: ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.getAttribute(el, 'value', function(err, value){",
      getterFinish: "  });\n})",
      cmp: "{value}",
      value: "value"
    },
    "ElementAttribute": {
      getter: ".elementBy{locatorBy}({locator}, function(err, el) {\n" +
      "  b.getAttribute(el, {attributeName}, function(err, value){",
      getterFinish: "  });\n})",
      cmp: "{value}",
      value: "value"
    },
    "CookieByName": {
      getter: ".allCookies(function(err, cookies) {\n" +
      "  var cookie = _.find(cookies, function(e){ return e.name === {name}; });",
      getterFinish: "})",
      cmp: "{value}",
      value: "cookie"
    },
    "AlertText": {
      getter: ".alertText(function(err, text){",
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
