builder.selenium2.io.addLangFormatter({
  name: "PHP - Webdriver",
  extension: ".php",
  not: "! ",
  start:
  "<?php\n"+
  "require_once 'php-webdriver';" +
	"\n" +
	"$wd = new WebDriver();\n" +
	"$session = $wd->session();\n"+
	"\n"+
	"function cookies_contain($cookies, $name) {\n"+ 
    "    foreach ($cookies as $arr) {\n"+
    "        if ($arr['name'] == $name) {\n"+
    "            return true;\n"+
    "        }\n"+ 
    "    }\n"+
    "    return false;\n"+
    "}\n"+
	"\n"+
	"function get_cookie($cookies, $name) {\n"+ 
    "    foreach ($cookies as $arr) {\n"+
    "        if ($arr['name'] == $name) {\n"+
    "            return $arr;\n"+
    "        }\n"+ 
    "    }\n"+
    "    return false;\n"+
    "}\n"+
	"\n"+
	"function alert_present($session) {\n" +
    "    try {\n" +
    "        $session->alert_text();\n" +
    "        return true;\n" +
    "    } catch (NoAlertOpenWebDriverError $e) {\n" +
    "       return false;\n" +
    "    }\n" +
    "}\n" +
    "\n" +
  	"function split_keys($toSend){\n"+
  	"    $payload = array(\"value\" => preg_split(\"//u\", $toSend, -1, PREG_SPLIT_NO_EMPTY));\n"+
  	"    return $payload;\n"+
  	"}\n\n",
  end:
    "\n$session->close();\n"+
	"?>",
  lineForType: {
    "get":
      "$session->open({url});\n",
    "goBack":
      "$session->back();\n",
    "goForward":
      "$session->forward();\n",
    "refresh":
      "$session->refresh();\n",
    "clickElement":
      "$session->element({locatorBy}, {locator})->click();\n",
    "mouseOverElement":
      "$session->moveto(array(\"element\" => $session->element({locatorBy}, {locator})->getID()));\n",
    "setElementText":
      "$session->element({locatorBy}, {locator})->click();\n" +
      "$session->element({locatorBy}, {locator})->clear();\n" +
      "$session->element({locatorBy}, {locator})->value(split_keys({text}));\n",
    "sendKeysToElement":
      "$session->element({locatorBy}, {locator})->click();\n" +
      "$session->element({locatorBy}, {locator})->value(split_keys({text}));\n",
    "setElementSelected":
      "if (!($session->element({locatorBy}, {locator})->selected())) {\n" +
	  "    $session->element({locatorBy}, {locator})->click();\n"+
	  "}\n",
    "setElementNotSelected":
      "if ($session->element({locatorBy}, {locator})->selected()) {\n" +
	  "    $session->element({locatorBy}, {locator})->click();\n"+
	  "}\n",
    "submitElement":
      "$session->element({locatorBy}, {locator})->submit();\n",
    "close":
      "",
    "switchToFrame":
      "$session->frame(array(\"id\" => {identifier}));\n",
    "switchToFrameByIndex":
      "$session->frame(array(\"id\" => {index}));\n",
    "switchToWindow":
      "$session->window(array(\"name\" => {name}));\n",
    "switchToDefaultContent":
      "$session->frame(array(\"id\" => NULL));\n",
    "answerAlert":
      "$session->postalert_text(array(\"text\" => {text}));\n" +
      "$session->accept_alert();\n",
    "acceptAlert":
      "$session->accept_alert();\n",
    "dismissAlert":
      "$session->dismiss_alert();\n",
    "print":
      "echo {text};\n",
    "store":
      "${variable} = {text};\n"
  },
  locatorByForType: function(stepType, locatorType, locatorIndex) {
    return {
        "class": "\"class\"",
        "id": "\"id\"",
        "link text": "\"link text\"",
        "xpath": "\"xpath\"",
        "css selector": "\"css\"",
        "name": "\"name\""}[locatorType];
  },
  assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "if ({getter} == {cmp}) {\n" +
        "    $session->close();\n" +
        "    throw new Exception(\"!{stepTypeName} failed\");\n" +
        "}\n", getter);
    } else {
      return doSubs(
        "if ({getter} != {cmp}) {\n" +
        "    $session->close();\n" +
        "    throw new Exception(\"!{stepTypeName} failed\");\n" +
        "}\n", getter);
    }
  },
  verify: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "if ({getter} == {cmp}) {\n" +
        "    echo \"!{stepTypeName} failed\";\n" +
        "}\n", getter);
    } else {
      return doSubs(
        "if ({getter} != {cmp}) {\n" +
        "    echo \"{stepTypeName} failed\";\n" +
        "}\n", getter);
    }
  },
  waitFor: "",
  store:
    "${{variable}} = {getter};\n",
  boolean_assert:
    "if ({posNot}{getter}) {\n" +
    "    $session->close();\n" +
    "    throw new Exception(\"{negNot}{stepTypeName} failed\");\n" +
    "}\n",
  boolean_verify:
    "if ({posNot}{getter}) {\n" +
    "    echo \"{negNot}{stepTypeName} failed\";\n" +
    "}\n",
  boolean_waitFor: "",
  boolean_store:
    "${{variable}} = {getter};\n",
  boolean_getters: {
    "TextPresent": {
      getter: "(strpos($session->element(\"tag name\", \"html\")->text(), {text}) !== false)",
      vartype: ""
    },
    "ElementPresent": {
      getter: "(strlen($session->element({locatorBy}, {locator})) != 0)",
      vartype: ""
    },
    "ElementSelected": {
      getter: "($session->element({locatorBy}, {locator})->selected())",
      vartype: ""
    },
    "CookiePresent": {
      getter: "($session->getAllCookie({name}))",
      vartype: ""
    },
    "AlertPresent": {
      getter: "alert_present($session)",
      vartype: ""
    }
  },
  getters: {
    "BodyText": {
      getter: "$session->element(\"tag name\", \"html\")->text()",
      cmp: "{text}",
      vartype: ""
    },
    "PageSource": {
      getter: "$session->source()",
      cmp: "{source}",
      vartype: ""
    },
    "Text": {
      getter: "$session->element({locatorBy}, {locator})->text",
      cmp: "{text}",
      vartype: ""
    },
    "CurrentUrl": {
      getter: "$session->url()",
      cmp: "{url}",
      vartype: ""
    },
    "Title": {
      getter: "$session->title()",
      cmp: "{title}",
      vartype: ""
    },
    "ElementValue": {
      getter: "$session->element({locatorBy}, {locator})->attribute(\"value\")",
      cmp: "{value}",
      vartype: ""
    },
    "ElementAttribute": {
      getter: "$session->element({locatorBy}, {locator})->attribute({attributeName})",
      cmp: "{value}",
      vartype: "String"
    },
    "CookieByName": {
      getter: "get_cookie($session->getAllCookies(), {name})",
      cmp: "{value}",
      vartype: ""
    },
    "AlertText": {
      getter: "$session->alert_text()",
      cmp: "{text}",
      vartype: ""
    },
    "Eval": {
      getter: "$session->execute({script})",
      cmp: "{value}",
      vartype: ""
    }
  },
  /**
   * Processes a parameter value into an appropriately escaped expression. Mentions of variables
   * with the ${foo} syntax are transformed into expressions that concatenate the variables and
   * literals.  
   * For example:
   * a${b}c
   * becomes:
   * "a" . b . "c"
   * 
   */
  escapeValue: function(stepType, value, pName) {
    if (stepType.name.startsWith("store") && pName == "variable") { return value; }
    if (stepType.name == "switchToFrameByIndex" && pName == "index") { return value; }
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
          if (output.length > 0) { output += " . "; }
          output += "$" + varName;
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
              if (output.length > 0) { output += " . "; }
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
          // is a $, in which case this may be the start of a...
          if (ch == "$") { hasDollar = true; } else { lastChunk += ch; }
        }
      }
    }
    // Append the final literal, if any, to the output.
    if (lastChunk.length > 0) {
      if (output.length > 0) { output += " . "; }
      output += esc(lastChunk);
    }
    return output;
  },
  usedVar: function(varName) { return "$" + varName; },
  unusedVar: function(varName) { return "$" + varName; }
});