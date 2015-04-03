builder.selenium2.io.addLangFormatter({
  name: "Java",
  extension: ".java",
  not: "!",
  start:
    "import java.util.concurrent.TimeUnit;\n" +
    "import java.util.Date;\n" + 
    "import java.io.File;\n" +
    "import org.openqa.selenium.support.ui.Select;\n" +
    "import org.openqa.selenium.interactions.Actions;\n" +
    "import org.openqa.selenium.firefox.FirefoxDriver;\n" +
    "import org.openqa.selenium.*;\n" +
    "import static org.openqa.selenium.OutputType.*;\n" +
    "{extraImports}\n" +
    "public class {scriptName} {\n" +
    "    public static void main(String[] args) throws Exception {\n" +
    "        {driverVar}\n" +
    "        {initDriver}\n" +
    "        wd.manage().timeouts().implicitlyWait({timeoutSeconds}, TimeUnit.SECONDS);\n",
  end:
    "        wd.quit();\n" +
    "    }\n" +
    "    \n" +
    "    public static boolean isAlertPresent(FirefoxDriver wd) {\n" +
    "        try {\n" +
    "            wd.switchTo().alert();\n" +
    "            return true;\n" +
    "        } catch (NoAlertPresentException e) {\n" +
    "            return false;\n" +
    "        }\n" +
    "    }\n" +
    "}\n",
  driverVar:
    "FirefoxDriver wd;",
  initDriver:
    "wd = new FirefoxDriver();",
  extraImports:
    "",
  lineForType: {
    "print":
      "        System.out.println({text});\n",
    "pause":
      "        try { Thread.sleep({waitTime}l); } catch (Exception e) { throw new RuntimeException(e); }\n",
    "store":
      "        ${{variable}:String} = \"\" + {text};\n",
    "get":
      "        wd.get({url});\n",
    "goBack":
      "        wd.navigate().back();\n",
    "goForward":
      "        wd.navigate().forward();\n",
    "clickElement":
      "        wd.findElement(By.{locatorBy}({locator})).click();\n",
    "setElementText":
      "        wd.findElement(By.{locatorBy}({locator})).click();\n" +
      "        wd.findElement(By.{locatorBy}({locator})).clear();\n" +
      "        wd.findElement(By.{locatorBy}({locator})).sendKeys({text});\n",
    "sendKeysToElement":
      "        wd.findElement(By.{locatorBy}({locator})).click();\n" +
      "        wd.findElement(By.{locatorBy}({locator})).sendKeys({text});\n",
    "setElementSelected":
      "        if (!wd.findElement(By.{locatorBy}({locator})).isSelected()) {\n" +
      "            wd.findElement(By.{locatorBy}({locator})).click();\n" +
      "        }\n",
    "setElementNotSelected":
      "        if (wd.findElement(By.{locatorBy}({locator})).isSelected()) {\n" +
      "            wd.findElement(By.{locatorBy}({locator})).click();\n" +
      "        }\n",
    "doubleClickElement":
      "        new Actions(wd).doubleClick(wd.findElement(By.{locatorBy}({locator}))).build().perform();\n",
    "mouseOverElement":
      "        new Actions(wd).moveToElement(wd.findElement(By.{locatorBy}({locator}))).build().perform();\n",
    "dragToAndDropElement":
      "        new Actions(wd).dragAndDrop(wd.findElement(By.{locatorBy}({locator})), wd.findElement(By.{locator2By}({locator2}))).build().perform();\n",
    "clickAndHoldElement":
      "        new Actions(wd).clickAndHold(wd.findElement(By.{locatorBy}({locator}))).build.perform();\n",
    "releaseElement":
      "        new Actions(wd).release(wd.findElement(By.{locatorBy}({locator}))).build.perform();\n",
    "clearSelections":
      "        new Select(wd.findElement(By.{locatorBy}({locator}))).deselectAll();\n",
    "submitElement":
      "        wd.findElement(By.{locatorBy}({locator})).submit();\n",
    "close":
      "        wd.close();\n",
    "refresh":
      "        wd.navigate().refresh();\n",
    "addCookie":
      function(step, escapeValue) {
        var r = "        Cookie c" + step.id + " = new Cookie.Builder(" + escapeValue(step.type, step.name) + ", " + escapeValue(step.type, step.value) + ")";
        var opts = step.options.split(",");
        for (var i = 0; i < opts.length; i++) {
          var kv = opts[i].trim().split("=");
          if (kv.length == 1) { continue; }
          if (kv[0] == "path") {
            r += ".path(" + escapeValue(step.type, kv[1]) + ")";
          }
          if (kv[0] == "max_age") {
            r += ".expiresOn(new Date(new Date().getTime() + " + parseInt(kv[1]) * 1000 + "l))";
          }
        }
        r += ".build();\n";
        r += "        wd.manage().addCookie(c" + step.id + ");\n";
        return r;
      },
    "deleteCookie":
      function(step, escapeValue) {
        return(
        "        Cookie c" + step.id + " = wd.manage().getCookieNamed(" + escapeValue(step.type, step.name) + ");\n" +
        "        if (c" + step.id + " != null) { wd.manage().deleteCookie(c" + step.id + "); }\n");
      },
    "saveScreenshot":
      "        wd.getScreenshotAs(FILE).renameTo(new File({file}));\n",
    "switchToFrame":
      "        wd = (FirefoxDriver) wd.switchTo().frame({identifier});\n",
    "switchToFrameByIndex":
      "        wd = (FirefoxDriver) wd.switchTo().frame({index});\n",
    "switchToWindow":
      "        wd = (FirefoxDriver) wd.switchTo().window({name});\n",
    "switchToDefaultContent":
      "        wd = (FirefoxDriver) wd.switchTo().switchToDefaultContent();\n",
    "answerAlert":
      "        wd.switchTo().alert().sendKeys({text});\n" +
      "        wd.switchTo().alert().accept();\n",
    "acceptAlert":
      "        wd.switchTo().alert().accept();\n",
    "dismissAlert":
      "        wd.switchTo().alert().dismiss();\n"
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
      "class name": "className",
      "id": "id",
      "link text": "linkText",
      "xpath": "xpath",
      "css selector": "cssSelector",
      "name": "name",
      "tag name": "tagName",
      "partial link text": "partialLinkText"}[locatorType];
  },
  assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "        if ({getter}.equals({cmp})) {\n" +
        "            wd.close();\n" +
        "            throw new RuntimeException(\"!{stepTypeName} failed\");\n" +
        "        }\n", getter);
    } else {
      return doSubs(
        "        if (!{getter}.equals({cmp})) {\n" +
        "            wd.close();\n" +
        "            throw new RuntimeException(\"{stepTypeName} failed\");\n" +
        "        }\n", getter);
    }
  },
  verify: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "        if ({getter}.equals({cmp})) {\n" +
        "            System.out.println(\"!{stepTypeName} failed\");\n" +
        "        }\n", getter);
    } else {
      return doSubs(
        "        if (!{getter}.equals({cmp})) {\n" +
        "            System.out.println(\"{stepTypeName} failed\");\n" +
        "        }\n", getter);
    }
  },
  waitFor: "",
  store:
    "        ${{variable}:{vartype}} = {getter};\n",
  boolean_assert:
    "        if ({posNot}{getter}) {\n" +
    "            wd.close();\n" +
    "            throw new RuntimeException(\"{negNot}{stepTypeName} failed\");\n" +
    "        }\n",
  boolean_verify:
    "        if ({posNot}{getter}) {\n" +
    "            System.out.println(\"{negNot}{stepTypeName} failed\");\n" +
    "        }\n",
  boolean_waitFor: "",
  boolean_store:
    "        ${{variable}:{vartype}} = {getter};\n",
  boolean_getters: {
    "TextPresent": {
      getter: "wd.findElement(By.tagName(\"html\")).getText().contains({text})",
      vartype: "boolean"
    },
    "ElementPresent": {
      getter: "(wd.findElements(By.{locatorBy}({locator})).size() != 0)",
      vartype: "boolean"
    },
    "ElementSelected": {
      getter: "(wd.findElement(By.{locatorBy}({locator})).isSelected())",
      vartype: "boolean"
    },
    "CookiePresent": {
      getter: "(wd.manage().getCookieNamed({name}) != null)",
      vartype: "boolean"
    },
    "AlertPresent": {
      getter: "isAlertPresent(wd)",
      vartype: "boolean"
    }
  },
  getters: {
    "BodyText": {
      getter: "wd.findElement(By.tagName(\"html\")).getText()",
      cmp: "{text}",
      vartype: "String"
    },
    "PageSource": {
      getter: "wd.getPageSource()",
      cmp: "{source}",
      vartype: "String"
    },
    "Text": {
      getter: "wd.findElement(By.{locatorBy}({locator})).getText()",
      cmp: "{text}",
      vartype: "String"
    },
    "CurrentUrl": {
      getter: "wd.getCurrentUrl()",
      cmp: "{url}",
      vartype: "String"
    },
    "Title": {
      getter: "wd.getTitle()",
      cmp: "{title}",
      vartype: "String"
    },
    "ElementValue": {
      getter: "wd.findElement(By.{locatorBy}({locator})).getAttribute(\"value\")",
      cmp: "{value}",
      vartype: "String"
    },
    "ElementAttribute": {
      getter: "wd.findElement(By.{locatorBy}({locator})).getAttribute({attributeName})",
      cmp: "{value}",
      vartype: "String"
    },
    "ElementStyle": {
      getter: "wd.findElement(By.{locatorBy}({locator})).getCssValue({propertyName})",
      cmp: "{value}",
      vartype: "String"
    },
    "CookieByName": {
      getter: "wd.manage().getCookieNamed({name}).getValue()",
      cmp: "{value}",
      vartype: "String"
    },
    "AlertText": {
      getter: "wd.switchTo().alert().getText()",
      cmp: "{text}",
      vartype: "String"
    },
    "Eval": {
      getter: "wd.executeScript({script})",
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
   * "a" + b + "c"
   */
  escapeValue: function(stepType, value, pName) {
    if (stepType.name.startsWith("store") && pName == "variable") { return value; }
    if (stepType.name == "switchToFrameByIndex" && pName == "index") { return value; }
    // This function takes a string literal and escapes it and wraps it in quotes.
    var esc = function(v) { 
      var escapedValue = "\"" + v.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\""; 
      return escapedValue.replace(/\n/g, '\\n');
    };
    
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
