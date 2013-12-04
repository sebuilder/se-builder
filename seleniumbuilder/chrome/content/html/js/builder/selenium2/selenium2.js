/**
 * Data structure representing Selenium 2. Use "builder.selenium2" to refer to Selenium 2, as
 * opposed to a string or numerical representation. builder.selenium1 and builder.selenium2 both
 * export a stepTypes map and a categories list that have the same interface so that most code
 * doesn't have to know which version of Selenium is being used.
 */
builder.selenium2 = {
  toString: function() { return "__SELENIUM_2__"; },
  name: "Selenium 2",
  shortName: "sel2"
};

builder.seleniumVersions.push(builder.selenium2);

builder.selenium2.StepType = function(name) {
  this.name = name;
};

builder.selenium2.StepType.prototype = {
  /** @return The type's name. */
  getName: function() { return this.name; },
  /** @return List of parameter names. */
  getParamNames: function() { return builder.selenium2.__stepData[this.name] },
  /** @return Whether the given parameter is a "locator" or "string". */
  getParamType: function(paramName) { return paramName.toLowerCase().indexOf("locator") != -1 ? "locator" : "string" },
  /** @return Whether setting negated to true on a step of this type is valid. */
  getNegatable: function() {
    return this.name.startsWith("waitFor") ||
           this.name.startsWith("assert") ||
           this.name.startsWith("verify");
  },
  /** @return The note text for this step type, if any. */
  getNote: function() { return builder.selenium2.__stepNotes[this.name] ? _t(builder.selenium2.__stepNotes[this.name]) : null; }
};

/** Internal step data - converted into stepTypes below. */
builder.selenium2.__stepData = {
  "get":                             ["url"], 
  "goBack":                          [], 
  "goForward":                       [], 
  "clickElement":                    ["locator"], 
  "setElementText":                  ["locator", "text"], 
  "sendKeysToElement":               ["locator", "text"], 
  "clickElementWithOffset":          ["locator", "offset"],
  "doubleClickElement":              ["locator"],
  "mouseOverElement":                ["locator"],
  "dragToAndDropElement":            ["locator", "targetLocator"], 
  "clickAndHoldElement":             ["locator"], 
  "releaseElement":                  ["locator"], 
  "setElementSelected":              ["locator"], 
  "clearSelections":                 ["locator"], 
  "setElementNotSelected":           ["locator"], 
  "submitElement":                   ["locator"], 
  "close":                           [], 
  "refresh":                         [], 
  "assertTextPresent":               ["text"], 
  "verifyTextPresent":               ["text"], 
  "waitForTextPresent":              ["text"], 
  "storeTextPresent":                ["text", "variable"], 
  "assertBodyText":                  ["text"], 
  "verifyBodyText":                  ["text"], 
  "waitForBodyText":                 ["text"], 
  "storeBodyText":                   ["variable"], 
  "assertElementPresent":            ["locator"], 
  "verifyElementPresent":            ["locator"], 
  "waitForElementPresent":           ["locator"], 
  "storeElementPresent":             ["locator", "variable"], 
  "assertPageSource":                ["source"], 
  "verifyPageSource":                ["source"], 
  "waitForPageSource":               ["source"], 
  "storePageSource":                 ["variable"], 
  "assertText":                      ["locator", "text"], 
  "verifyText":                      ["locator", "text"], 
  "waitForText":                     ["locator", "text"], 
  "storeText":                       ["locator", "variable"], 
  "assertCurrentUrl":                ["url"], 
  "verifyCurrentUrl":                ["url"], 
  "waitForCurrentUrl":               ["url"], 
  "storeCurrentUrl":                 ["variable"], 
  "assertTitle":                     ["title"], 
  "verifyTitle":                     ["title"], 
  "waitForTitle":                    ["title"], 
  "storeTitle":                      ["variable"], 
  "assertElementAttribute":          ["locator", "attributeName", "value"], 
  "verifyElementAttribute":          ["locator", "attributeName", "value"], 
  "waitForElementAttribute":         ["locator", "attributeName", "value"], 
  "storeElementAttribute":           ["locator", "attributeName", "variable"], 
  "assertElementSelected":           ["locator"], 
  "verifyElementSelected":           ["locator"], 
  "waitForElementSelected":          ["locator"], 
  "storeElementSelected":            ["locator", "variable"], 
  "assertElementValue":              ["locator", "value"], 
  "verifyElementValue":              ["locator", "value"], 
  "waitForElementValue":             ["locator", "value"], 
  "storeElementValue":               ["locator", "variable"], 
  "addCookie":                       ["name", "value", "options"], 
  "deleteCookie":                    ["name"], 
  "assertCookieByName":              ["name", "value"], 
  "verifyCookieByName":              ["name", "value"], 
  "waitForCookieByName":             ["name", "value"], 
  "storeCookieByName":               ["name", "variable"], 
  "assertCookiePresent":             ["name"], 
  "verifyCookiePresent":             ["name"], 
  "waitForCookiePresent":            ["name"], 
  "storeCookiePresent":              ["name", "variable"], 
  "saveScreenshot":                  ["file"], 
  "print":                           ["text"], 
  "store":                           ["text", "variable"],
  "pause":                           ["waitTime"],
  "switchToFrame":                   ["identifier"],
  "switchToFrameByIndex":            ["index"],
  "switchToWindow":                  ["name"],
  "switchToDefaultContent":          [],
  "assertAlertText":                 ["text"],
  "verifyAlertText":                 ["text"],
  "waitForAlertText":                ["text"],
  "storeAlertText":                  ["variable"],
  "assertAlertPresent":              [],
  "verifyAlertPresent":              [],
  "waitForAlertPresent":             [],
  "storeAlertPresent":               ["variable"],
  "answerAlert":                     ["text"],
  "acceptAlert":                     [],
  "dismissAlert":                    [],
  "assertEval":                      ["script", "value"],
  "verifyEval":                      ["script", "value"],
  "waitForEval":                     ["script", "value"],
  "storeEval":                       ["script", "variable"]
};

builder.selenium2.__stepNotes = {
  "assertAlertText": 'sel2_must_playback_in_foreground',
  "verifyAlertText": 'sel2_must_playback_in_foreground',
  "waitForAlertText": 'sel2_must_playback_in_foreground',
  "storeAlertText": 'sel2_must_playback_in_foreground',
  "assertAlertPresent": 'sel2_must_playback_in_foreground',
  "verifyAlertPresent": 'sel2_must_playback_in_foreground',
  "waitForAlertPresent": 'sel2_must_playback_in_foreground',
  "storeAlertPresent": 'sel2_must_playback_in_foreground',
  "answerAlert": 'sel2_must_playback_in_foreground',
  "acceptAlert": 'sel2_must_playback_in_foreground',
  "dismissAlert": 'sel2_must_playback_in_foreground'
};

/** Map of step types. */
builder.selenium2.stepTypes = {};
for (var n in builder.selenium2.__stepData) {
  builder.selenium2.stepTypes[n] = new builder.selenium2.StepType(n);
}

builder.selenium2.defaultStepType = builder.selenium2.stepTypes.clickElement;
builder.selenium2.navigateToUrlStepType = builder.selenium2.stepTypes.get;

/** List of categories. */
builder.selenium2.categories = [
  [_t('navigation_sel2_cat'), [
    builder.selenium2.stepTypes.get,
    builder.selenium2.stepTypes.refresh,
    builder.selenium2.stepTypes.goBack,
    builder.selenium2.stepTypes.goForward,
    builder.selenium2.stepTypes.close
  ]],
  [_t('input_sel2_cat'), [
    builder.selenium2.stepTypes.clickElement,
    builder.selenium2.stepTypes.doubleClickElement,
    builder.selenium2.stepTypes.mouseOverElement,
    builder.selenium2.stepTypes.setElementText,
    builder.selenium2.stepTypes.sendKeysToElement,
    builder.selenium2.stepTypes.setElementSelected,
    builder.selenium2.stepTypes.setElementNotSelected,
    builder.selenium2.stepTypes.clearSelections,
    builder.selenium2.stepTypes.submitElement,
    builder.selenium2.stepTypes.dragToAndDropElement,
    builder.selenium2.stepTypes.clickAndHoldElement,
    builder.selenium2.stepTypes.releaseElement
  ]],
  [_t('misc_sel2_cat'),[
    builder.selenium2.stepTypes.addCookie,
    builder.selenium2.stepTypes.deleteCookie,
    builder.selenium2.stepTypes.saveScreenshot,
    builder.selenium2.stepTypes.print,
    builder.selenium2.stepTypes.pause,
    builder.selenium2.stepTypes.switchToFrame,
    builder.selenium2.stepTypes.switchToFrameByIndex,
    builder.selenium2.stepTypes.switchToWindow,
    builder.selenium2.stepTypes.switchToDefaultContent,
    builder.selenium2.stepTypes.answerAlert,
    builder.selenium2.stepTypes.acceptAlert,
    builder.selenium2.stepTypes.dismissAlert
  ]],
  [_t('assertion_sel2_cat'), [
    builder.selenium2.stepTypes.assertCurrentUrl,
    builder.selenium2.stepTypes.assertTitle,
    builder.selenium2.stepTypes.assertText,
    builder.selenium2.stepTypes.assertTextPresent,
    builder.selenium2.stepTypes.assertBodyText,
    builder.selenium2.stepTypes.assertPageSource,
    builder.selenium2.stepTypes.assertElementPresent,
    builder.selenium2.stepTypes.assertElementSelected,
    builder.selenium2.stepTypes.assertElementAttribute,
    builder.selenium2.stepTypes.assertElementValue,
    builder.selenium2.stepTypes.assertCookiePresent,
    builder.selenium2.stepTypes.assertCookieByName,
    builder.selenium2.stepTypes.assertAlertText,
    builder.selenium2.stepTypes.assertAlertPresent,
    builder.selenium2.stepTypes.assertEval
  ]],
  [_t('verify_sel2_cat'), [
    builder.selenium2.stepTypes.verifyCurrentUrl,
    builder.selenium2.stepTypes.verifyTitle,
    builder.selenium2.stepTypes.verifyText,
    builder.selenium2.stepTypes.verifyTextPresent,
    builder.selenium2.stepTypes.verifyBodyText,
    builder.selenium2.stepTypes.verifyPageSource,
    builder.selenium2.stepTypes.verifyElementPresent,
    builder.selenium2.stepTypes.verifyElementSelected,
    builder.selenium2.stepTypes.verifyElementAttribute,
    builder.selenium2.stepTypes.verifyElementValue,
    builder.selenium2.stepTypes.verifyCookiePresent,
    builder.selenium2.stepTypes.verifyCookieByName,
    builder.selenium2.stepTypes.verifyAlertText,
    builder.selenium2.stepTypes.verifyAlertPresent,
    builder.selenium2.stepTypes.verifyEval
  ]],
  [_t('wait_sel2_cat'), [
    builder.selenium2.stepTypes.waitForCurrentUrl,
    builder.selenium2.stepTypes.waitForTitle,
    builder.selenium2.stepTypes.waitForText,
    builder.selenium2.stepTypes.waitForTextPresent,
    builder.selenium2.stepTypes.waitForBodyText,
    builder.selenium2.stepTypes.waitForPageSource,
    builder.selenium2.stepTypes.waitForElementPresent,
    builder.selenium2.stepTypes.waitForElementSelected,
    builder.selenium2.stepTypes.waitForElementAttribute,
    builder.selenium2.stepTypes.waitForElementValue,
    builder.selenium2.stepTypes.waitForCookiePresent,
    builder.selenium2.stepTypes.waitForCookieByName,
    builder.selenium2.stepTypes.waitForAlertText,
    builder.selenium2.stepTypes.waitForAlertPresent,
    builder.selenium2.stepTypes.waitForEval
  ]],
  [_t('store_sel2_cat'), [
    builder.selenium2.stepTypes.store,
    builder.selenium2.stepTypes.storeCurrentUrl,
    builder.selenium2.stepTypes.storeTitle,
    builder.selenium2.stepTypes.storeText,
    builder.selenium2.stepTypes.storeTextPresent,
    builder.selenium2.stepTypes.storeBodyText,
    builder.selenium2.stepTypes.storePageSource,
    builder.selenium2.stepTypes.storeElementSelected,
    builder.selenium2.stepTypes.storeElementAttribute,
    builder.selenium2.stepTypes.storeElementValue,
    builder.selenium2.stepTypes.storeCookiePresent,
    builder.selenium2.stepTypes.storeCookieByName,
    builder.selenium2.stepTypes.storeAlertText,
    builder.selenium2.stepTypes.storeAlertPresent,
    builder.selenium2.stepTypes.storeEval
  ]]
];