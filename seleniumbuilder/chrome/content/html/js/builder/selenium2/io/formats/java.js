builder.selenium2.io.formats.java_info = {
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
    "\n" +
    "public class {scriptName} {\n" +
    "    public static void main(String[] args) {\n" +
    "        FirefoxDriver wd = new FirefoxDriver();\n" +
    "        wd.manage().timeouts().implicitlyWait(60, TimeUnit.SECONDS);\n",
  end:
    "        wd.close();\n" +
    "    }\n" +
    "}\n",
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
    "assertTextPresent":
      "        if ({posNot}wd.findElement(By.tagName(\"html\")).getText().contains({text})) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertTextPresent failed\");\n" +
      "        }\n",
    "verifyTextPresent":
      "        if ({posNot}wd.findElement(By.tagName(\"html\")).getText().contains({text})) {\n" +
      "            System.err.println(\"{negNot}verifyTextPresent failed\");\n" +
      "        }\n",
    "waitForTextPresent":
      "",
    "storeTextPresent":
      "        ${{variable}:boolean} = wd.findElement(By.tagName(\"html\")).getText().contains({text});\n",
    "assertBodyText":
      "        if ({posNot}wd.findElement(By.tagName(\"html\")).getText().equals({text})) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertBodyText failed\");\n" +
      "        }\n",
    "verifyBodyText":
      "        if ({posNot}wd.findElement(By.tagName(\"html\")).getText().equals({text})) {\n" +
      "            System.err.println(\"{negNot}verifyBodyText failed\");\n" +
      "        }\n",
    "waitForBodyText":
      "",
    "storeBodyText":
      "        ${{variable}:String} = wd.findElement(By.tagName(\"html\")).getText();\n",
    "assertElementPresent":
      "        if ({negNot}(wd.findElements(By.{locatorBy}({locator})).size() == 0)) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertElementPresent failed\");\n" +
      "        }\n",
    "verifyElementPresent":
      "        if ({negNot}(wd.findElements(By.{locatorBy}({locator})).size() == 0)) {\n" +
      "            System.err.println(\"{negNot}verifyElementPresent failed\");\n" +
      "        }\n",
    "waitForElementPresent":
      "",
    "storeElementPresent":
      "        ${{variable}:boolean} = wd.findElements(By.{locatorBy}({locator})).size() == 0;\n",
    "assertPageSource":
      "        if ({posNot}wd.getPageSource().equals({source})) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertPageSource failed\");\n" +
      "        }\n",
    "verifyPageSource":
      "        if ({posNot}wd.getPageSource().equals({source})) {\n" +
      "            System.err.println(\"{negNot}verifyPageSource failed\");\n" +
      "        }\n",
    "waitForPageSource":
      "",
    "storePageSource":
      "        ${{variable}:String} = wd.getPageSource();\n",
    "assertText":
      "        if ({posNot}wd.findElement(By.{locatorBy}({locator})).getText().equals({text})) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertText failed\");\n" +
      "        }\n",
    "verifyText":
      "        if ({posNot}wd.findElement(By.{locatorBy}({locator})).getText().equals({text})) {\n" +
      "            System.err.println(\"{negNot}verifyText failed\");\n" +
      "        }\n",
    "waitForText":
      "",
    "storeText":
      "        ${{variable}:String} = wd.findElement(By.{locatorBy}({locator})).getText();\n",
    "assertCurrentUrl":
      "        if ({posNot}wd.getCurrentUrl().equals({url})) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertCurrentUrl failed\");\n" +
      "        }\n",
    "verifyCurrentUrl":
      "        if ({posNot}wd.getCurrentUrl().equals({url})) {\n" +
      "            System.err.println(\"{negNot}verifyCurrentUrl failed\");\n" +
      "        }\n",
    "storeCurrentUrl":
      "        ${{variable}:String} = wd.getCurrentUrl();\n",
    "waitForCurrentUrl":
      "",
    "assertTitle":
      "        if ({posNot}wd.getTitle().equals({title})) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertTitle failed\");\n" +
      "        }\n",
    "verifyTitle":
      "        if ({posNot}wd.getTitle().equals({title})) {\n" +
      "            System.err.println(\"{negNot}verifyTitle failed\");\n" +
      "        }\n",
    "storeTitle":
      "        ${{variable}:String} = wd.getTitle();\n",
    "waitForTitle":
      "",
    "assertElementSelected":
      "        if ({posNot}wd.findElement(By.{locatorBy}({locator})).isSelected()) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertElementSelected failed\");\n" +
      "        }\n",
    "verifyElementSelected":
      "        if ({posNot}wd.findElement(By.{locatorBy}({locator})).isSelected()) {\n" +
      "            System.err.println(\"{negNot}verifyElementSelected failed\");\n" +
      "        }\n",
    "waitForElementSelected":
      "",
    "storeElementSelected":
      "        ${{variable}:boolean} = wd.findElement(By.{locatorBy}({locator})).isSelected();\n",
    "assertElementValue":
      "        if ({posNot}wd.findElement(By.{locatorBy}({locator})).getAttribute(\"value\").equals({value})) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertElementValue failed\");\n" +
      "        }\n",
    "verifyElementValue":
      "        if ({posNot}wd.findElement(By.{locatorBy}({locator})).getAttribute(\"value\").equals({value})) {\n" +
      "            System.err.println(\"{negNot}verifyElementValue failed\");\n" +
      "        }\n",
    "waitForElementValue":
      "",
    "storeElementValue":
      "        ${{variable}:String} = wd.findElement(By.{locatorBy}({locator})).getAttribute(\"value\");\n",
    "assertElementAttribute":
      "        if ({posNot}({value}).equals(wd.findElement(By.{locatorBy}({locator})).getAttribute({attributeName}))) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertElementAttribute failed\");\n" +
      "        }\n",
    "verifyElementAttribute":
    "        if ({posNot}({value}).equals(wd.findElement(By.{locatorBy}({locator})).getAttribute({attributeName}))) {\n" +
      "            System.err.println(\"{negNot}verifyElementAttribute failed\");\n" +
      "        }\n",
    "waitForElementAttribute":
      "",
    "storeElementAttribute":
      "        ${{variable}:String} = wd.findElement(By.{locatorBy}({locator})).getAttribute({attributeName});\n",
    "assertCookieByName":
      "        if ({posNot}({value}).equals(wd.manage().getCookieNamed({name}).getValue())) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertCookieByName failed\");\n" +
      "        }\n",
    "verifyCookieByName":
      "        if ({posNot}({value}).equals(wd.manage().getCookieNamed({name}).getValue())) {\n" +
      "            System.err.println(\"{negNot}verifyCookieByName failed\");\n" +
      "        }\n",
    "waitForCookieByName":
      "",
    "storeCookieByName":
      "        ${{variable}:String} = wd.manage().getCookieNamed({name}).getValue();\n",
    "assertCookiePresent":
      "        if ({negNot}(wd.manage().getCookieNamed({name}) == null)) {\n" +
      "            wd.close();\n" +
      "            throw new RuntimeException(\"{negNot}assertCookiePresent failed\");\n" +
      "        }\n",
    "verifyCookiePresent":
      "        if ({negNot}(wd.manage().getCookieNamed({name}) == null)) {\n" +
      "            System.err.println(\"{negNot}verifyCookiePresent failed\");\n" +
      "        }\n",
    "waitForCookiePresent":
      "",
    "storeCookiePresent":
      "        ${{variable}:boolean} = wd.manage().getCookieNamed({name}) != null;\n",
    "saveScreenshot":
      "        wd.getScreenshotAs(FILE).renameTo(new File({file}));\n",
    "switchToFrame":
      "        wd = (FirefoxDriver) wd.switchTo().frame({identifier});\n",
    "switchToFrameByIndex":
      "        wd = (FirefoxDriver) wd.switchTo().frame({index});\n",
    "switchToWindow":
      "        wd = (FirefoxDriver) wd.switchTo().window({name});\n",
    "switchToDefaultContent":
      "        wd = (FirefoxDriver) wd.switchTo().switchToDefaultContent();\n"
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
    var esc = function(v) { return "\"" + v.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\""; }
    
    // Don't escape numerical values.
    if (stepType == builder.selenium2.stepTypes.pause) {
      esc = function(v) { return v; }
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
};