builder.selenium2.docs = {
  "get": {
    "params": {
      "url": "The URL to go to."
    },
    "description": "Navigate to the given URL."
  },
  "refresh": {
    "description": "Refresh page."
  },
  "goBack": {
    "description": "Go back a page."
  },
  "goForward": {
    "description": "Go forward a page."
  },
  "close": {
    "description": "End Selenium script."
  },
  "setWindowSize": {
    "params": {
        "width": "The new window width, in pixels.",
        "height": "The new window height, in pixels."
    },
    "description": "Changes the size of the playback window."
  },
  "print": {
    "params": {
      "text": "The text to print."
    },
    "description": "Prints out the given text."
  },
  "pause": {
    "params": {
      "waitTime": "The time to pause, in ms."
    },
    "description": "Pauses script execution for a given amount of time."
  },
  "switchToFrame": {
    "params": {
      "identifier": "The name or ID of the frame to switch to. Note that Selenium 1 style relative=X parameters are not supported."
    },
    "description": "Switches playback to a different frame."
  },
  "switchToFrameByIndex": {
    "params": {
      "index": "The index of the frame to switch to."
    },
    "description": "Switches playback to a different frame, identified by its index."
  },
  "switchToWindow": {
    "params": {
      "name": "The name of the window to switch to. Note that Selenium 1 style relative=X parameters are not supported."
    },
    "description": "Switches playback to a different window."
  },
  "switchToWindowByIndex": {
    "params": {
      "index": "The index of the window to switch to. Note that Selenium 1 style relative=X parameters are not supported."
    },
    "description": "Switches playback to a different window, identified by its index."
  },
  "switchToDefaultContent": {
    "params": {},
    "description": "Switches playback to the default/top frame."
  },
  "assertAlertText": {
    "params": {"text": "The expected alert text." },
    "description": "Asserts that there is an alert showing with the given text."
  },
  "verifyAlertText": {
    "params": {"text": "The expected alert text." },
    "description": "Verifies that there is an alert showing with the given text."
  },
  "waitForAlertText": {
    "params": {"text": "The expected alert text." },
    "description": "Wait for an alert showing with the given text."
  },
  "bypassAlertText": {
    "params": {"text": "The expected alert text." ,"nbstep":"number of step to bypass"},
    "description": "bypass n steps that there is an alert showing with the given text."
  },
  "storeAlertText": {
    "params": {"variable": "The name of the variable to store the text in." },
    "description": "Store the text of the visible alert in the given variable."
  },
  "assertAlertPresent": {
    "params": {},
    "description": "Asserts that there is an alert showing."
  },
  "verifyAlertPresent": {
    "params": {},
    "description": "Verifies that there is an alert showing."
  },
  "waitForAlertPresent": {
    "params": {},
    "description": "Wait for an alert."
  },
  "bypassForAlertPresent": {
    "params": {"nbstep":"number of step to bypass"},
    "description": "bypass n steps that there is an alert."
  },
  "storeAlertPresent": {
    "params": {"variable": "The name of the variable to store in whether an alert is present." },
    "description": "Store whether an alert is present in the given variable."
  },
  "answerAlert": {
    "params": {"text": "The text to type into the prompt." },
    "description": "Type the given text into the alert prompt."
  },
  "acceptAlert": {
    "params": {},
    "description": "Accept the current alert."
  },
  "dismissAlert": {
    "params": {},
    "description": "Dismiss the current alert."
  },
  "store": {
    "params": {
      "variable": "The name of the variable to store the text in.",
      "text": "The text to store in the variable."
    },
    "description": "Stores the given text in the given variable."
  },
  "clickElement": {
    "params": {
      "locator": "How to find the element to be clicked."
    },
    "description": "Click an element on the current page."
  },
  "doubleClickElement": {
    "params": {
      "locator": "How to find the element to be clicked."
    },
    "description": "Click an element on the current page twice."
  },
  "mouseOverElement": {
    "params": {
      "locator": "How to find the element."
    },
    "description": "Move the mouse cursor over the given element."
  },
  "clickElementWithOffset": {
    "params": {
      "locator": "How to find the element to be clicked.",
      "offset": "Location of the click relative to the element, formatted as \"x, y\"."
    },
    "description": "Click an element on the current page, with the click offset by a certain amount."
  },
  "setElementText": {
    "params": {
      "locator": "How to find the element to type into.",
      "text": "The text to set its content to."
    },
    "description": "Set the text content of the given element."
  },
  "sendKeysToElement": {
    "params": {
      "locator": "How to find the element to type into.",
      "text": "The text to type in."
    },
    "description": "Type text into an element on the current page."
  },
  "setElementSelected": {
    "params": {
      "locator": "How to find the element to select."
    },
    "description": "Select an element. If it's a check box or radio button, it will become ticked. If it's an option inside a &lt;select&gt;, that option will become the chosen one. If it's an option inside a multi-select, that option will be added to the selection."
  },
  "setElementNotSelected": {
    "params": {
      "locator": "How to find the element to de-select.",
    },
    "description": "Un-select an element. If it's a check box, it will become not ticked. If it's an option inside a multi-select, that option will be removed from the selection."
  },
  "clearSelections": {
    "params": {
      "locator": "How to find the select element to clear.",
    },
    "description": "Clears the selections in a multi-select element."
  },
  "dragToAndDropElement": {
    "params": {
      "locator": "How to find the element to drag and drop.",
      "targetLocator": "The element to drop the first one into",
    },
    "description": "Drags and drops an element onto another element."
  },
  "clickAndHoldElement": {
    "params": {
      "locator": "How to find the element to click on.",
    },
    "description": "Starts clicking on an element but does not release the virtual mouse button."
  },
  "releaseElement": {
    "params": {
      "locator": "How to find the element to stop clicking on.",
    },
    "description": "Stops holding down the virtual mouse button."
  },
  "submitElement": {
    "params": {
      "locator": "How to find the element whose form to submit.",
    },
    "description": "Submits the form the targeted element is a part of. The element does not have to be the submit button - it can be any field or the form itself."
  },
  "addCookie": {
    "params": {
      "name": "The cookie's name.",
      "value": "The value (content) of the cookie.",
      "options": "Cookie options. Format is path=[path],max_age=[max age in milliseconds]. Either or both options can be left out."
    },
    "description": "Creates a cookie for the current domain."
  },
  "deleteCookie": {
    "params": {
      "name": "The name of the cookie to be deleted.",
    },
    "description": "Deletes the cookie of the given name for the current domain."
  },
  "saveScreenshot": {
    "params": {
      "file": "The path to save the screenshot to."
    },
    "description": "Saves a screenshot of the current page, as a PNG image."
  },
  "assertCurrentUrl": {
    "params": {
      "url": "The URL we want to be at."
    },
    "description": "Asserts that the current URL is the given value. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyCurrentUrl": {
    "params": {
      "url": "The URL we want to be at."
    },
    "description": "Verifies that the current URL is the given value. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForCurrentUrl": {
    "params": {
      "url": "The URL we want to be at."
    },
    "description": "Waits until the current URL is the given value."
  },
  "bypassCurrentUrl": {
    "params": {
      "url": "The URL we want to be at."
    },
    "description": "Waits until the current URL is the given value."
  },
  "storeCurrentUrl": {
    "params": {
      "variable": "The name of the variable to store the URL in."
    },
    "description": "Stores the current URL in the given variable."
  },
  "assertTitle": {
    "params": {
      "title": "Title we want the current page to have."
    },
    "description": "Asserts that the current page has the given title. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyTitle": {
    "params": {
      "title": "Title we want the current page to have."
    },
    "description": "Verifies that the current page has the given title. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForTitle": {
    "params": {
      "title": "Title we want the current page to have."
    },
    "description": "Waits for the current page to have the given title."
  },
  "bypassTitle": {
    "params": {
      "title": "Title we want the current page to have."
    },
    "description": "Waits for the current page to have the given title."
  },
  "storeTitle": {
    "params": {
      "variable": "Name of the variable to store the title into."
    },
    "description": "Stores the title of the current page in the given variable."
  },
  "assertText": {
    "params": {
      "locator": "How to find the element whose text to test.",
      "text": "The text we want the element to have."
    },
    "description": "Asserts that the given element contains exactly the given text. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyText": {
    "params": {
      "locator": "How to find the element whose text to test.",
      "text": "The text we want the element to have."
    },
    "description": "Verifies that the given element contains exactly the given text. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForText": {
    "params": {
      "locator": "How to find the element whose text to test.",
      "text": "The text we want the element to have."
    },
    "description": "Waits for the given element containing exactly the given text."
  },
  "bypassText": {
    "params": {
      "locator": "How to find the element whose text to test.",
      "text": "The text we want the element to have."
    },
    "description": "Waits for the given element containing exactly the given text."
  },
  "storeText": {
    "params": {
      "variable": "The name of the variable to store the element's text in.",
      "locator": "How to find the element whose text to store."
    },
    "description": "Stores an element's text content in the given variable."
  },
  "assertTextPresent": {
    "params": {
      "text": "The text we want to feature on the page."
    },
    "description": "Asserts that the given text is somewhere on the page. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyTextPresent": {
    "params": {
      "text": "The text we want to feature on the page."
    },
    "description": "Verifies that the given text is somewhere on the page. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForTextPresent": {
    "params": {
      "text": "The text we want to feature on the page."
    },
    "description": "Waits for the given text to appear somewhere on the page."
  },
  "bypassTextPresent": {
    "params": {
      "text": "The text we want to feature on the page."
    },
    "description": "Waits for the given text to appear somewhere on the page."
  },
  "storeTextPresent": {
    "params": {
      "variable": "The name of the variable to store whether the given text is on the page.",
      "text": "The text to check."
    },
    "description": "Stores whether the given text is anywhere on the page in the given variable."
  },
  "assertBodyText": {
    "params": {
      "text": "The text we want the entire page to be."
    },
    "description": "Asserts that the text of the entire page body is as given. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyBodyText": {
    "params": {
      "text": "The text we want the entire page to be."
    },
    "description": "Verifies that the text of the entire page body is as given. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForBodyText": {
    "params": {
      "text": "The text we want the entire page to be."
    },
    "description": "Waits for the text of the entire page body to be as given."
  },
  "bypassBodyText": {
    "params": {
      "text": "The text we want the entire page to be."
    },
    "description": "Waits for the text of the entire page body to be as given."
  },
  "storeBodyText": {
    "params": {
      "variable": "The name of the variable to store the page body text in."
    },
    "description": "Stores the page body text in the given variable."
  },
  "assertPageSource": {
    "params": {
      "source": "The expected page source."
    },
    "description": "Asserts that the current page's source is as given. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyPageSource": {
    "params": {
      "source": "The expected page source."
    },
    "description": "Verifies that the current page's source is as given. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForPageSource": {
    "params": {
      "source": "The expected page source."
    },
    "description": "Waits for the page source to be as given."
  },
  "bypassPageSource": {
    "params": {
      "source": "The expected page source."
    },
    "description": "Waits for the page source to be as given."
  },
  "storePageSource": {
    "params": {
      "variable": "The name of the variable to store the page source in."
    },
    "description": "Stores the page source in the given variable."
  },
  "assertElementPresent": {
    "params": {
      "locator": "How to find the element."
    },
    "description": "Asserts that the given element exists. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyElementPresent": {
    "params": {
      "locator": "How to find the element."
    },
    "description": "Verifies that the given element exists. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForElementPresent": {
    "params": {
      "locator": "How to find the element."
    },
    "description": "Waits for an element to exist."
  },
  "bypassElementPresent": {
    "params": {
      "locator": "How to find the element."
    },
    "description": "Waits for an element to exist."
  },
  "storeElementPresent": {
    "params": {
      "variable": "Name of the variable to store the attribute value in.",
      "locator": "How to find the element."
    },
    "description": "Stores whether the element exists."
  },
  "assertElementSelected": {
    "params": {
      "locator": "How to find the element."
    },
    "description": "Asserts that the given element is selected. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyElementSelected": {
    "params": {
      "locator": "How to find the element."
    },
    "description": "Verifies that the given element is selected. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForElementSelected": {
    "params": {
      "locator": "How to find the element."
    },
    "description": "Waits for an element to be selected."
  },
  "bypassElementSelected": {
    "params": {
      "locator": "How to find the element."
    },
    "description": "Waits for an element to be selected."
  },
  "storeElementSelected": {
    "params": {
      "variable": "Name of the variable to store the attribute value in.",
      "locator": "How to find the element."
    },
    "description": "Stores whether the element is selected in the given variable."
  },
  "assertElementAttribute": {
    "params": {
      "locator": "How to find the element.",
      "attributeName": "The name of the attribute to check.",
      "value": "The value we want the attribute to have."
    },
    "description": "Asserts that an element's attribute has a specific value. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyElementAttribute": {
    "params": {
      "locator": "How to find the element.",
      "attributeName": "The name of the attribute to check.",
      "value": "The value we want the attribute to have."
    },
    "description": "Verifies that an element's attribute has a specific value. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForElementAttribute": {
    "params": {
      "locator": "How to find the element.",
      "attributeName": "The name of the attribute to check.",
      "value": "The value we want the attribute to have."
    },
    "description": "Waits for an element's attribute to assume a specific value."
  },
  "bypassElementAttribute": {
    "params": {
      "locator": "How to find the element.",
      "attributeName": "The name of the attribute to check.",
      "value": "The value we want the attribute to have."
    },
    "description": "Waits for an element's attribute to assume a specific value."
  },
  "storeElementAttribute": {
    "params": {
      "variable": "Name of the variable to store the attribute value in.",
      "locator": "How to find the element.",
      "attributeName": "The name of the attribute to store."
    },
    "description": "Stores an element's attribute in the given variable."
  },
  "assertElementStyle": {
    "params": {
      "locator": "How to find the element.",
      "propertyName": "The name of the CSS style property to check.",
      "value": "The value we want the property to have."
    },
    "description": "Asserts that an element's CSS style property has a specific value. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyElementStyle": {
    "params": {
      "locator": "How to find the element.",
      "propertyName": "The name of the CSS style property to check.",
      "value": "The value we want the property to have."
    },
    "description": "Verifies that an element's CSS style property has a specific value. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForElementStyle": {
    "params": {
      "locator": "How to find the element.",
      "propertyName": "The name of the CSS style property to check.",
      "value": "The value we want the property to have."
    },
    "description": "Waits for an element's CSS style property to assume a specific value."
  },
  "bypassElementStyle": {
    "params": {
      "locator": "How to find the element.",
      "propertyName": "The name of the CSS style property to check.",
      "value": "The value we want the property to have."
    },
    "description": "Waits for an element's CSS style property to assume a specific value."
  },
  "storeElementStyle": {
    "params": {
      "variable": "Name of the variable to store the property value in.",
      "locator": "How to find the element.",
      "propertyName": "The name of the CSS style property to store."
    },
    "description": "Stores an element's CSS style property in the given variable."
  },
  "assertElementValue": {
    "params": {
      "locator": "How to find the element.",
      "value": "The value we want the element to have."
    },
    "description": "Asserts that an element's value is as given. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyElementValue": {
    "params": {
      "locator": "How to find the element.",
      "value": "The value we want the element to have."
    },
    "description": "Verifies that an element's value is as given. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForElementValue": {
    "params": {
      "locator": "How to find the element.",
      "value": "The value we want the element to have."
    },
    "description": "Waits for an element's value to become the given one."
  },
  "bypassElementValue": {
    "params": {
      "locator": "How to find the element.",
      "value": "The value we want the element to have."
    },
    "description": "Waits for an element's value to become the given one."
  },
  "storeElementValue": {
    "params": {
      "variable": "The name of the variable to store the element's value in.",
      "locator": "How to find the element."
    },
    "description": "Stores an element's value in the given variable."
  },
  "assertCookiePresent": {
    "params": {
      "name": "The cookie's name."
    },
    "description": "Asserts that a cookie with the given name is present. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyCookiePresent": {
    "params": {
      "name": "The cookie's name."
    },
    "description": "Verifies that a cookie with the given name is present. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForCookiePresent": {
    "params": {
      "name": "The cookie's name."
    },
    "description": "Waits for a cookie with the given name to be present."
  },
  "bypassCookiePresent": {
    "params": {
      "name": "The cookie's name."
    },
    "description": "Waits for a cookie with the given name to be present."
  },
  "storeCookiePresent": {
    "params": {
      "variable": "The name of the variable where to store whether the cookie exists.",
      "name": "The cookie name."
    },
    "description": "Stores whether a cookie with the given name exists."
  },
  "assertCookieByName": {
    "params": {
      "name": "The cookie's name.",
      "value": "The value (content) the cookie is expected to have."
    },
    "description": "Asserts that a cookie with the given name is present. If this is not the case, script execution will stop and be marked as failed."
  },
  "verifyCookieByName": {
    "params": {
      "name": "The cookie's name.",
      "value": "The value (content) the cookie is expected to have."
    },
    "description": "Verifies that a cookie with the given name is present. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForCookieByName": {
    "params": {
      "name": "The cookie's name.",
      "value": "The value (content) the cookie is expected to have."
    },
    "description": "Waits for a cookie with the given name and value to be present."
  },
  "bypassCookieByName": {
    "params": {
      "name": "The cookie's name.",
      "value": "The value (content) the cookie is expected to have."
    },
    "description": "Waits for a cookie with the given name and value to be present."
  },
  "storeCookieByName": {
    "params": {
      "variable": "The name of the variable to store the cookie's value in.",
      "name": "The cookie's name."
    },
    "description": "Stores the value (content) of the cookie with the given name in a variable."
  },
  "assertEval": {
    "params": {
      "script": "A JavaScript expression to be evaluated.",
      "value": "The value the script is expected to evaluate to."
    },
    "description": "Evaluates a JavaScript expression within the context of the page and asserts it matches the given value. Use 'return' to return the result of the evaluation, e.g. 'return 3'."
  },
  "verifyEval": {
    "params": {
      "script": "A JavaScript expression to be evaluated.",
      "value": "The value the script is expected to evaluate to."
    },
    "description": "Evaluates a JavaScript expression within the context of the page and verifies it matches the given value. Use 'return' to return the result of the evaluation, e.g. 'return 3'. If this is not the case, script execution will be marked as failed, but the script will continue running."
  },
  "waitForEval": {
    "params": {
      "script": "A JavaScript expression to be evaluated.",
      "value": "The value the script is expected to evaluate to."
    },
    "description": "Waits for the given script to evaluate to the given value. Use 'return' to return the result of the evaluation, e.g. 'return 3'."
  },
  "bypassEval": {
    "params": {
      "script": "A JavaScript expression to be evaluated.",
      "value": "The value the script is expected to evaluate to."
    },
    "description": "Waits for the given script to evaluate to the given value. Use 'return' to return the result of the evaluation, e.g. 'return 3'."
  },
  "storeEval": {
    "params": {
      "variable": "The name of the variable to store evaluation result in.",
      "script": "A JavaScript expression to be evaluated. Use 'return' to return the result of the evaluation, e.g. 'return 3'."
    },
    "description": "Evaluates a JavaScript expression and stores the result in a variable."
  },
  "printWindowName": {
    "description": "Print out the currrent window name."
  },
  "renameWindow": {
    "params" : {
      "name": "a current window new name"
    },
    "description": "Name or Rename the current window DOM object."
  },
  "forceTargets": {
    "params" : {
      "name": "a target value or framename (current value:\"_blank\",\"_self\",\"_parent\",\"_top\",...)"
    },
    "description": "force all links to specifie name to linked document (href and open)"
  },
  "deleteComments": {
    "description": "delete all comments of the html structure"
  },
  "deleteCachesUrls": {
    "description": "delete all params of urls image / css / js"
  },
  "deleteHiddenValues": {
    "description": "delete data value of hidden input tags"
  }
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
