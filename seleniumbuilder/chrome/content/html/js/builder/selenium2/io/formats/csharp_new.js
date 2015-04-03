builder.selenium2.io.addLangFormatter({
  name: "C#",
  extension: ".cs",
  not: "!",
  start:
    "using System;\n" +
    "using System.Threading;\n" +
    "using OpenQA.Selenium;\n" +
    "using OpenQA.Selenium.Interactions;\n" +
    "using OpenQA.Selenium.Remote;\n" +
    "using OpenQA.Selenium.Support.UI;\n"+
    "\n" +
    "namespace se_builder {\n" +
    "  public class {scriptName} {\n" +
    "    static void Main(string[] args) {\n" +
    "      IWebDriver wd = new RemoteWebDriver(DesiredCapabilities.Firefox());\n" +
    "      try {\n" +
    "        var wait = new WebDriverWait(wd, TimeSpan.FromSeconds({timeoutSeconds}));\n",
  end:
    "      } finally { wd.Quit(); }\n" +
    "    }\n" +
    "    \n" +
    "    public static bool isAlertPresent(IWebDriver wd) {\n" +
    "        try {\n" +
    "            wd.SwitchTo().Alert();\n" +
    "            return true;\n" +
    "        } catch (NoAlertPresentException e) {\n" +
    "            return false;\n" +
    "        }\n" +
    "    }\n" +
    "  }\n}\n",
  lineForType: {
    "print":
      "        Console.WriteLine({text});\n",
    "pause":
      "        Thread.Sleep({waitTime});\n",
    "store":
      "        ${{variable}:string} = \"\" + {text};\n",
    "get":
      "        wd.Navigate().GoToUrl({url});\n",
    "goBack":
      "        wd.Navigate().Back();\n",
    "goForward":
      "        wd.Navigate().Forward();\n",
    "clickElement":
      "        wd.FindElement(By.{locatorBy}({locator})).Click();\n",
    "mouseOverElement":
      "        new Actions(wd).MoveToElement(wd.FindElement(By.{locatorBy}({locator}))).Build().Perform();\n",
    "setElementText":
      "        wd.FindElement(By.{locatorBy}({locator})).Click();\n" +
      "        wd.FindElement(By.{locatorBy}({locator})).Clear();\n" +
      "        wd.FindElement(By.{locatorBy}({locator})).SendKeys({text});\n",
    "sendKeysToElement":
      "        wd.FindElement(By.{locatorBy}({locator})).Click();\n" +
      "        wd.FindElement(By.{locatorBy}({locator})).SendKeys({text});\n",
    "setElementSelected":
      "        if (!wd.FindElement(By.{locatorBy}({locator})).Selected) {\n" +
      "            wd.FindElement(By.{locatorBy}({locator})).Click();\n" +
      "        }\n",
    "setElementNotSelected":
      "        if (wd.FindElement(By.{locatorBy}({locator})).Selected) {\n" +
      "            wd.FindElement(By.{locatorBy}({locator})).Click();\n" +
      "        }\n",
    "submitElement":
      "        wd.FindElement(By.{locatorBy}({locator})).Submit();\n",
    "close":
      "        wd.Close();\n",
    "refresh":
      "        wd.Navigate().Refresh();\n",
    "switchToFrame":
      "        wd = wd.SwitchTo().Frame({identifier});\n",
    "switchToFrameByIndex":
      "        wd = wd.SwitchTo().Frame({index});\n",
    "switchToWindow":
      "        wd = wd.SwitchTo().Window({name});\n",
    "switchToDefaultContent":
      "        wd = wd.SwitchTo().DefaultContent();\n",
    "answerAlert":
      "        wd.SwitchTo().Alert().SendKeys({text});\n" +
      "        wd.SwitchTo().Alert().Accept();\n",
    "acceptAlert":
      "        wd.SwitchTo().Alert().Accept();\n",
    "dismissAlert":
      "        wd.SwitchTo().Alert().Dismiss();\n",
    "addCookie":
      function(step, escapeValue) {
		var path;
        var c_name = "c" + step.id;
        var max_age = null;
        var r = "        Cookie " + c_name + " = new Cookie(" + escapeValue(step.type, step.name) + ", " + escapeValue(step.type, step.value);
        var opts = step.options.split(",");
        for (var i = 0; i < opts.length; i++) {
          var kv = opts[i].trim().split("=");
          if (kv.length == 1) { continue; }
          if (kv[0] == "path") {
            path = escapeValue(step.type, kv[1]);
          }
          if (kv[0] == "max_age") {
            max_age = "DateTime.Now.AddSeconds((double)" + parseInt(kv[1])+")";
          }
        }
        if (path) {
            r += ", "+path;
            if (max_age) {
          r += ", "+max_age;
            }
        }
        r += ");\n";
        r += "        wd.Manage().Cookies.AddCookie(c" + step.id + ");\n";  
        return r;
      },
    "deleteCookie":
      function(step, escapeValue) {
        return(
        "        Cookie c" + step.id + " = wd.Manage().Cookies.GetCookieNamed(" + escapeValue(step.type, step.name) + ");\n" +
        "        if (c" + step.id + " != null) { wd.Manage().Cookies.DeleteCookie(c" + step.id + "); }\n");
      }
  },
  assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "        if ({getter} == {cmp}) {\n" +
        "            wd.Close();\n" +
        "            throw new SystemException(\"!{stepTypeName} failed\");\n" +
        "        }\n", getter);
    } else {
      return doSubs(
        "        if ({getter} != {cmp}) {\n" +
        "            wd.Close();\n" +
        "            throw new SystemException(\"{stepTypeName} failed\");\n" +
        "        }\n", getter);
    }
  },
  verify: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "        if ({getter} == {cmp}) {\n" +
        "            Console.Error.WriteLine(\"!{stepTypeName} failed\");\n" +
        "        }\n", getter);
    } else {
      return doSubs(
        "        if ({getter} != {cmp}) {\n" +
        "            Console.Error.WriteLine(\"{stepTypeName} failed\");\n" +
        "        }\n", getter);
    }
  },
  waitFor: function(step, escapeValue, doSubs, getter) {
    return doSubs("        wait.Until(d => {getter} == {cmp});\n", getter).replace('wd', 'd');
  },
  store:
    "        ${{variable}:{vartype}} = {getter};\n",
  boolean_assert:
    "        if ({posNot}{getter}) {\n" +
    "            wd.Close();\n" +
    "            throw new SystemException(\"{negNot}{stepTypeName} failed\");\n" +
    "        }\n",
  boolean_verify:
    "        if ({posNot}{getter}) {\n" +
    "            Console.Error.WriteLine(\"{negNot}{stepTypeName} failed\");\n" +
    "        }\n",
  boolean_waitFor: function(step, escapeValue, doSubs, getter) {
    return doSubs("        wait.Until(d => {getter});\n", getter).replace('wd', 'd');
  },
  boolean_store:
    "        ${{variable}:{vartype}} = {getter};\n",
  boolean_getters: {
    "TextPresent": {
      getter: "wd.FindElement(By.TagName(\"html\")).Text.Contains({text})",
      vartype: "bool"
    },
    "ElementPresent": {
      getter: "(wd.FindElements(By.{locatorBy}({locator})).Count != 0)",
      vartype: "bool"
    },
    "ElementSelected": {
      getter: "(wd.FindElement(By.{locatorBy}({locator})).Selected)",
      vartype: "bool"
    },
    "CookiePresent": {
      getter: "(wd.Manage().Cookies.GetCookieNamed({name}) != null)",
      vartype: "bool"
    },
    "AlertPresent": {
      getter: "isAlertPresent(wd)",
      vartype: "bool"
    }
  },
  getters: {
    "BodyText": {
      getter: "wd.FindElement(By.TagName(\"html\")).Text",
      cmp: "{text}",
      vartype: "string"
    },
    "PageSource": {
      getter: "wd.PageSource",
      cmp: "{source}",
      vartype: "string"
    },
    "Text": {
      getter: "wd.FindElement(By.{locatorBy}({locator})).Text",
      cmp: "{text}",
      vartype: "string"
    },
    "CurrentUrl": {
      getter: "wd.Url",
      cmp: "{url}",
      vartype: "string"
    },
    "Title": {
      getter: "wd.Title",
      cmp: "{title}",
      vartype: "string"
    },
    "ElementValue": {
      getter: "wd.FindElement(By.{locatorBy}({locator})).GetAttribute(\"value\")",
      cmp: "{value}",
      vartype: "string"
    },
    "ElementAttribute": {
      getter: "wd.FindElement(By.{locatorBy}({locator})).GetAttribute({attributeName})",
      cmp: "{value}",
      vartype: "string"
    },
    "ElementStyle": {
      getter: "wd.FindElement(By.{locatorBy}({locator})).GetCssValue({propertyName})",
      cmp: "{value}",
      vartype: "string"
    },
    "CookieByName": {
      getter: "wd.Manage().Cookies.GetCookieNamed({name}).Value",
      cmp: "{value}",
      vartype: "string"
    },
    "AlertText": {
      getter: "wd.SwitchTo().Alert().Text",
      cmp: "{text}",
      vartype: "string"
    },
    "Eval": {
      getter: "(string) (wd as IJavaScriptExecutor).ExecuteScript({script})",
      cmp: "{value}",
      vartype: "string"
    }
  },
  locatorByForType: function(stepType, locatorType, locatorIndex) {
    if ({"select.select":1, "select.deselect":1}[stepType.name] && locatorIndex == 2) {
      return {
        "index": "ByIndex",
        "value": "ByValue",
        "label": "ByVisibleText",
        "id":    "[NOT IMPLEMENTED]"
      };
    }
    return {
      "class name": "ClassName",
      "id": "Id",
      "link text": "LinkText",
      "xpath": "XPath",
      "css selector": "CssSelector",
      "name": "Name",
      "tag name": "TagName",
      "partial link text": "PartialLinkText"}[locatorType];
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
    var esc = function esc(v) { return "\"" + v.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\""; };
    
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
          output += varName;
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
  usedVar: function(varName, varType) { return varName; },
  unusedVar: function(varName, varType) { return varType + " " + varName; }
});



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
