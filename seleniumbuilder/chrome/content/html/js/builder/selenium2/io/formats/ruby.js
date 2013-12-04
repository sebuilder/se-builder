builder.selenium2.io.formats.push(builder.selenium2.io.createLangFormatter({
  name: "Ruby",
  extension: ".rb",
  not: "not ",
  start:
    "require 'rubygems'\n" +
	"require 'selenium-webdriver'"+
	"\n" +
	"wd = Selenium::WebDriver.for :firefox\n\n",
  end:
    "wd.quit\n",
  lineForType: {
    "get":
      "wd.get {url}\n",
    "goBack":
      "wd.navigate.back\n",
    "goForward":
      "wd.navigate.forward\n",
    "clickElement":
      "wd.find_element({locatorBy}, {locator}).click\n",
    "doubleClickElement":
      "wd.action.double_click(wd.find_element({locatorBy}, {locator})).perform\n",
    "mouseOverElement":
      "wd.action.move_to(wd.find_element({locatorBy}, {locator})).perform\n",
    "setElementText":
      "wd.find_element({locatorBy}, {locator}).click\n" +
      "wd.find_element({locatorBy}, {locator}).clear\n" +
      "wd.find_element({locatorBy}, {locator}).send_keys {text}\n",
    "sendKeysToElement":
      "wd.find_element({locatorBy}, {locator}).click\n" +
      "wd.find_element({locatorBy}, {locator}).send_keys {text}\n",
    "setElementSelected":
      "if not wd.find_element({locatorBy}, {locator}).selected?\n" +
	  "    wd.find_element({locatorBy}, {locator}).click\n"+
	  "end\n",
    "setElementNotSelected":
      "if wd.find_element({locatorBy}, {locator}).selected?\n" +
	  "    wd.find_element({locatorBy}, {locator}).click\n"+
	  "end\n",
    "submitElement":
      "wd.find_element({locatorBy}, {locator}).submit\n",
    "close":
      "",
    "verifyTextPresent":
      "if {posNot}wd.find_element(:tag_name, \"html\").text.include? {text}\n" +
	  "    print \"{negNot}verifyTextPresent failed\"\n"+
	  "end\n",
    "assertTextPresent":
      "if {posNot}wd.find_element(:tag_name, \"html\").text.include? {text}\n" +
	  "    wd.quit\n" +
	  "    raise Exception, \"{negNot}assertTextPresent failed\"\n"+
	  "end\n",
    "waitForTextPresent":
      "",
    "verifyBodyText":
      "if {posNot}{text} == wd.find_element(:tag_name, \"html\").text\n" +
	  "    print \"{negNot}verifyBodyText failed\" \n"+
	  "end\n",
    "assertBodyText":
      "if {posNot}{text} == wd.find_element_by_tag_name(\"html\").text\n" +
	  "    wd.close\n" +
	  "    raise Exception, \"{negNot}assertBodyText failed\"\n"+
	  "end\n",
    "waitForBodyText":
      "",
    "verifyElementPresent":
      "if {negNot}wd.find_element({locatorBy}, {locator}).length == 0\n" +
	  "    print \"{negNot}verifyElementPresent failed\"\n"+
	  "end",
    "assertElementPresent":
      "if {negNot}wd.find_element({locatorBy}, {locator}).length == 0\n" +
	  "    wd.quit\n" +
	  "    raise Exception, \"{negNot}assertElementPresent failed\"\n"+
	  "end\n",
    "waitForElementPresent":
      "",
    "verifyPageSource":
      "if {posNot}(wd.page_source == {source})\n" +
	  "    print \"{negNot}verifyPageSource failed\"\n"+
	  "end\n",
    "assertPageSource":
      "if {posNot}wd.page_source == {source}\n" +
	  "    wd.close\n" +
	  "    raise Exception, \"{negNot}assertPageSource failed\"\n"+
	  "end\n",      
    "waitForPageSource":
      "",
    "verifyText":
      "if {posNot}wd.find_element({locatorBy}, {locator}).text == {text}\n" +
	  "    print \"{negNot}verifyText failed\"\n",
    "assertText":
      "if {posNot}wd.find_element({locatorBy}, {locator}).text == {text}\n" +
	  "    wd.close\n" +
	  "    raise Exception, \"{negNot}assertText failed\"\n"+
	  "end\n",
    "waitForText":
      "",
    "verifyCurrentUrl":
      "if {posNot}wd.current_url == {url}\n" +
	  "      print \"{negNot}verifyCurrentUrl failed\"\n"+
	  "end\n",
    "assertCurrentUrl":
      "if {posNot}wd.current_url == {url}\n" +
	  "    wd.close\n" +
	  "    raise Exception(\"{negNot}assertCurrentUrl failed\")\n"+
	  "end\n",
    "waitForCurrentUrl":
      "",
    "verifyTitle":
      "if {posNot}wd.title == {title}\n" +
	  "    print \"{negNot}verifyTitle failed\"\n"+
	  "end\n",
    "assertTitle":
      "if {posNot}wd.title == {title}\n" +
	  "    wd.close\n" +
	  "    raise Exception(\"{negNot}assertTitle failed\")\n"+
	  "end\n",
    "waitForTitle":
      "",
    "verifyElementSelected":
      "if {posNot}wd.find_element({locatorBy}, {locator}).selected?\n" +
	  "    print \"{negNot}verifyElementSelected failed\"\n"+
	  "end\n",
    "assertElementSelected":
      "if {posNot}wd.find_element({locatorBy}, {locator}).selected?\n" +
	  "    wd.close\n" +
	  "    raise Exception, \"{negNot}assertElementSelected failed\"\n"+
	  "end\n",
    "waitForElementSelected":
      "",
    "verifyElementValue":
      "if {posNot}wd.find_element({locatorBy}, {locator}).value == {value}\n" +
      "    print \"{negNot}verifyElementValue failed\"\n",
    "assertElementValue":
      "if {posNot}wd.find_element({locatorBy}, {locator}).value == {value}\n" +
	  "    wd.close\n" +
	  "    raise Exception, \"{negNot}assertElementValue failed\"\n"+
	  "end\n",
    "element.waitForValue":
      "",
    "verifyCookieByName":
      "if {posNot}wd.manage().cookie_named({name}) == {value}\n" +
	  "    print \"{negNot}verifyCookieByName failed\"\n"+
	  "end\n",
    "assertCookieByName":
      "if {posNot}wd.manage().cookie_named({name}) == {value}\n" +
	  "    wd.close\n" +
	  "    raise Exception, \"{negNot}assertCookieByName failed\"\n"+
	  "end\n",
    "waitForCookieByName":
      "",
    "verifyCookiePresent":
      "if {posNot}wd.manage().cookie_named({name})\n" +
	  "    print \"{negNot}verifyCookiePresent failed\"\n"+
	  "end\n",
    "assertCookiePresent":
      "if {posNot}wd.manage().cookie_named({name})\n" +
	  "    wd.close\n" +
	  "    raise Exception, \"{negNot}assertCookiePresent failed\"\n"+
	  "end\n",
    "waitForCookiePresent":
      "",
    "storeTitle":
      "${{variable}} = wd.title\n"
  },
  locatorByForType: function(stepType, locatorType, locatorIndex) {
    if ({
      "assertElementPresent": 1,
      "verifyElementPresent": 1
    }[stepType.name]) {
      return {
        "class": ":class",
        "id": ":id",
        "link text": ":link_text",
        "xpath": ":xpath",
        "css selector": ":css",
        "name": ":name"}[locatorType];
    }
    return {
        "class": ":class",
        "id": ":id",
        "link text": ":link_text",
        "xpath": ":xpath",
        "css selector": ":css",
        "name": ":name"}[locatorType];
  },
  /**
   * Processes a parameter value into an appropriately escaped expression. Mentions of variables
   * with the ${foo} syntax are transformed into expressions that concatenate the variables and
   * literals.  
   * For example:
   * a${b}c
   * becomes:
   * "a" + b.inspect + "c"
   * 
   */
  escapeValue: function(stepType, value, pName) {
    if (stepType.name.startsWith("store") && pName == "variable") { return value; }
    // This function takes a string literal and escapes it and wraps it in quotes.
    function esc(v) { return "\"" + v.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\""; }

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
          output += varName + ".inspect";
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
  usedVar: function(varName) { return varName; },
  unusedVar: function(varName) { return varName; }
}));