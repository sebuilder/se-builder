builder.selenium2.io.addLangFormatter({
  name: "Python",
  extension: ".py",
  not: "not ",
  start:
    "# -*- coding: utf-8 -*-\n" +
    "from selenium.webdriver.firefox.webdriver import WebDriver\n" +
    "from selenium.webdriver.common.action_chains import ActionChains\n" +
    "import time\n" +
    "\n" +
    "success = True\n" +
    "wd = WebDriver()\n" +
    "wd.implicitly_wait({timeoutSeconds})\n" +
    "\n" +
    "def is_alert_present(wd):\n" +
    "    try:\n" +
    "        wd.switch_to_alert().text\n" +
    "        return True\n" +
    "    except:\n" +
    "        return False\n" +
    "\n" +
    "try:\n",
  ind: "    ",
  end:
    "finally:\n" +
    "    wd.quit()\n" +
    "    if not success:\n" +
    "        raise Exception(\"Test failed.\")\n",
  lineForType: {
    "get":
      "{ind}wd.get({url})\n",
    "goBack":
      "{ind}wd.back()\n",
    "goForward":
      "{ind}wd.forward()\n",
    "refresh":
      "{ind}wd.refresh()\n",
    "store":
      "{ind}${{variable}} = {text}\n",
    "print":
      "{ind}print({text})\n",
    "pause":
      "{ind}time.sleep(float({waitTime}) / 1000)\n",
    "clickElement":
      "{ind}wd.{locatorBy}({locator}).click()\n",
    "setElementText":
      "{ind}wd.{locatorBy}({locator}).click()\n" +
      "{ind}wd.{locatorBy}({locator}).clear()\n" +
      "{ind}wd.{locatorBy}({locator}).send_keys({text})\n",
    "sendKeysToElement":
      "{ind}wd.{locatorBy}({locator}).click()\n" +
      "{ind}wd.{locatorBy}({locator}).send_keys({text})\n",
    "setElementSelected":
      "{ind}if not wd.{locatorBy}({locator}).is_selected():\n" +
      "{ind}    wd.{locatorBy}({locator}).click()\n",
    "setElementNotSelected":
      "{ind}if wd.{locatorBy}({locator}).is_selected():\n" +
      "{ind}    wd.{locatorBy}({locator}).click()\n",
    "submitElement":
      "{ind}wd.{locatorBy}({locator}).submit()\n",
    "close":
      "{ind}wd.close()\n",
    "doubleClickElement":
      "{ind}ActionChains(wd).double_click(wd.{locatorBy}({locator})).perform()\n",
    "mouseOverElement":
      "{ind}ActionChains(wd).move_to_element(wd.{locatorBy}({locator})).perform()\n",
    "dragToAndDropElement":
      "{ind}ActionChains(wd).drag_and_drop(wd.{locatorBy}({locator}), wd.{locator2By}({locator2})).perform()\n",
    "clickAndHoldElement":
      "{ind}ActionChains(wd).click_and_hold(wd.{locatorBy}({locator})).perform()\n",
    "releaseElement":
      "{ind}ActionChains(wd).release(wd.{locatorBy}({locator})).perform()\n",
    "addCookie":
      function(step, escapeValue, userParams, doSubs) {
        var cookie = "{\"name\": " + escapeValue(step.type, step.name) + ", \"value\":" + escapeValue(step.type, step.value);
        var opts = step.options.split(",");
        for (var i = 0; i < opts.length; i++) {
          var kv = opts[i].trim().split("=");
          if (kv.length == 1) { continue; }
          if (kv[0] == "path") {
            cookie += ", \"path\": " + escapeValue(step.type, kv[1]);
          }
          if (kv[0] == "max_age") {
            cookie += ", \"expiry\": int(time.time() + " + parseInt(kv[1]) * 1000 + ")";
          }
        }
        cookie += "}";
        return doSubs("{ind}") + "wd.add_cookie(" + cookie + ")\n";
      },
    "deleteCookie":
      "{ind}wd.delete_cookie({name})\n",
    "saveScreenshot":
      "{ind}wd.save_screenshot({file})\n",
    "switchToFrame":
      "{ind}wd.switch_to_frame({identifier})\n",
    "switchToFrameByIndex":
      "{ind}wd.switch_to_frame(int({index}))\n",
    "switchToWindow":
      "{ind}wd.switch_to_window({name})\n",
    "switchToDefaultContent":
      "{ind}wd.switch_to_default_content()\n",
    "answerAlert":
      "{ind}wd.switch_to_alert().send_keys({text})\n" +
      "{ind}wd.switch_to_alert().accept()\n",
    "acceptAlert":
      "{ind}wd.switch_to_alert().accept()\n",
    "dismissAlert":
      "{ind}wd.switch_to_alert().dismiss()\n"
  },
  locatorByForType: function(stepType, locatorType, locatorIndex) {
    if ({
      "assertElementPresent": 1,
      "verifyElementPresent": 1
    }[stepType.name]) {
      return {
        "class": "find_elements_by_class_name",
        "id": "find_elements_by_id",
        "link text": "find_elements_by_link_text",
        "xpath": "find_elements_by_xpath",
        "css selector": "find_elements_by_css_selector",
        "name": "find_elements_by_name"}[locatorType];
    }
    return {
      "class": "find_element_by_class_name",
      "id": "find_element_by_id",
      "link text": "find_element_by_link_text",
      "xpath": "find_element_by_xpath",
      "css selector": "find_element_by_css_selector",
      "name": "find_element_by_name"}[locatorType];
  },
  assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "{ind}if {getter} == {cmp}:\n" +
        "{ind}    raise Exception(\"not {stepTypeName} failed\")\n", getter);
    } else {
      return doSubs(
        "{ind}if {getter} != {cmp}:\n" +
        "{ind}    raise Exception(\"not {stepTypeName} failed\")\n", getter);
    }
  },
  verify: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "{ind}if {getter} == {cmp}:\n" +
        "{ind}    success = False\n" +
        "{ind}    print(\"not {stepTypeName} failed\")\n", getter);
    } else {
      return doSubs(
        "{ind}if {getter} != {cmp}:\n" +
        "{ind}    success = False\n" +
        "{ind}    print(\"{stepTypeName} failed\")\n", getter);
    }
  },
  waitFor: "",
  store:
    "{ind}${{variable}:{vartype}} = {getter}\n",
  boolean_assert:
    "{ind}if {posNot}{getter}:\n" +
    "{ind}    raise Exception(\"{negNot}{stepTypeName} failed\")\n",
  boolean_verify:
    "{ind}if {posNot}{getter}:\n" +
    "{ind}    success = False\n" +
    "{ind}    print(\"{negNot}{stepTypeName} failed\")\n",
  boolean_waitFor: "",
  boolean_store:
    "{ind}${{variable}:{vartype}} = {getter}\n",
  boolean_getters: {
    "TextPresent": {
      getter: "({text} in wd.find_element_by_tag_name(\"html\").text)",
      vartype: "boolean"
    },
    "ElementPresent": {
      getter: "(len(wd.{locatorBy}({locator})) != 0)",
      vartype: "boolean"
    },
    "ElementSelected": {
      getter: "wd.{locatorBy}({locator}).is_selected()",
      vartype: "boolean"
    },
    "CookiePresent": {
      getter: "wd.get_cookie({name})",
      vartype: "boolean"
    },
    "AlertPresent": {
      getter: "is_alert_present(wd)",
      vartype: "boolean"
    }
  },
  getters: {
    "BodyText": {
      getter: "wd.find_element_by_tag_name(\"html\").text",
      cmp: "{text}",
      vartype: "String"
    },
    "PageSource": {
      getter: "wd.page_source",
      cmp: "{source}",
      vartype: "String"
    },
    "Text": {
      getter: "wd.{locatorBy}({locator}).text",
      cmp: "{text}",
      vartype: "String"
    },
    "CurrentUrl": {
      getter: "wd.current_url",
      cmp: "{url}",
      vartype: "String"
    },
    "Title": {
      getter: "wd.title",
      cmp: "{title}",
      vartype: "String"
    },
    "ElementValue": {
      getter: "wd.{locatorBy}({locator}).get_attribute(\"value\")",
      cmp: "{value}",
      vartype: "String"
    },
    "ElementAttribute": {
      getter: "wd.{locatorBy}({locator}).get_attribute({attributeName})",
      cmp: "{value}",
      vartype: "String"
    },
    "ElementStyle": {
      getter: "wd.{locatorBy}({locator}).value_of_css_property({propertyName})",
      cmp: "{value}",
      vartype: "String"
    },
    "CookieByName": {
      getter: "wd.get_cookie({name})[\"value\"]",
      cmp: "{value}",
      vartype: "String"
    },
    "AlertText": {
      getter: "wd.switch_to_alert().text",
      cmp: "{text}",
      vartype: "String"
    },
    "Eval": {
      getter: "wd.execute_script({script})",
      cmp: "{value}",
      vartype: "String"
    }
  },
  /**
   * Processes a parameter value into an appropriately escaped expression. Mentions of variables
   * with the ${foo} syntax are transformed into expressions that concatenate the variables and
   * literals.  
   * For example:
   * a${b}c
   * becomes:
   * "a" + str(b) + "c"
   * 
   * It would be much nicer to be using string.format here, but the minimum required Python version
   * Selenium appears to be 2.5, and string.format only turns up in 2.6.
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
          output += "str(" + varName + ")";
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
});



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
