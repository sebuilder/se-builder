builder.selenium2.io.formats.push(builder.selenium2.io.createLangFormatter({
  name: "English",
  extension: ".en.txt",
  not: "not ",
  start:
    "Start Firefox (like a boss)\n" +
    "(When you follow these steps, make sure page content is loaded before clicking, etc... Since you're a human, this is probably what you do already)\n\n",
  end:
    "\nYou're done! Sweet.",
  lineForType: {
    "get":
      "- Navigate to {url}\n",
    "goBack":
      "- Click the back button\n",
    "goForward":
      "- Click the forward button\n",
    "clickElement":
      "- Click {locatorBy} \"{locator}\"\n",
    "mouseOverElement":
      "- Move the mouse over {locatorBy} \"{locator}\"\n",
    "setElementText":
      "- Type \"{text}\" in \"{locator}\", replacing any text that was already there\n",
    "sendKeysToElement":
      "- Type \"{text}\" in \"{locator}\"\n",
    "setElementSelected":
      "- Select {locatorBy} \"{locator}\"\n",
    "setElementNotSelected":
      "- Deselect {locatorBy} \"{locator}\"\n",
    "submitElement":
      "- Submit the form containing {locatorBy} \"{locator}\"\n",
    "clearSelections":
      "- Click somewhere on the page that's blank so you clear any selected text\n",
    "dragToAndDropElement":
      "- Drag \"{locator}\" and drop it on \"{targetLocator}\"\n",
    "clickAndHoldElement":
      "- Click and hold \"{locator}\"\n",
    "releaseElement":
      "- Stop clicking \"{locator}\". Would YOU want to be clicked forever? Geez.\n",
    "addCookie":
      "- You're supposed to add a cookie called \"{name}\" with the value of \"{value}\", but that's hard since you're not a computer. I suggest baking a batch of real cookies instead.\n",
    "deleteCookie":
      "- You're supposed to delete a cookie called \"{name}\", but that's hard since you're not a computer. I suggest making a real cookie disappear instead.\n",
    "saveScreenshot":
      "- Take a screenshot of the page and make sure the file is called \"{file}\"\n",
    "print":
      "- Print this on a printer: \"{text}\". Then take the paper to your boss and say \"Here's that thing you wanted.\". Boom!\n",
    "close":
      "- Close the browser\n",
    "refresh":
      "- Click the refresh button\n",
    "verifyTextPresent":
      "- Make sure \"{text}\" is {negNot}on the page\n",
    "assertTextPresent":
      "- If \"{text}\" is {posNot}on the page, scream at the coders\n",
    "waitForTextPresent":
      "- Wait until \"{text}\" is {negNot}on the page\n",
    "verifyBodyText":
      "- Make sure the whole content of the page is {negNot}\"{text}\"\n",
    "assertBodyText":
      "- If the whole content of the page is {posNot}\"{text}\", scream at the coders\n",
    "waitForBodyText":
      "- Wait until the text of the site is {negNot}\"{text}\"\n",
    "verifyElementPresent":
      "- Make sure {locatorBy} \"{locator}\" is {negNot}present\n",
    "assertElementPresent":
      "- If {locatorBy} \"{locator}\" is {posNot}present, scream at the coders\n",
    "waitForElementPresent":
      "- Wait until {locatorBy} \"{locator}\" is {negNot}present\n",
    "verifyPageSource":
      "- Make sure the page source is {negNot}\"{source}\"\n",
    "assertPageSource":
      "- If the page source is {posNot}\"{source}\", scream at the coders\n",
    "waitForPageSource":
      "- Wait until the page source is {negNot}\"{source}\"\n",
    "verifyText":
      "- Make sure the text in {locatorBy} \"{locator}\" is {negNot}\"{text}\"\n",
    "assertText":
      "- If the text in {locatorBy} \"{locator}\" is {posNot}\"{text}\", scream at the coders\n",
    "waitForText":
      "- Wait until the text of {locatorBy} \"{locator}\" is {negNot}\"{text}\"\n",
    "verifyCurrentUrl":
      "- Make sure the url in the address bar is {negNot}\"{url}\"\n",
    "assertCurrentUrl":
      "- If the url in the address bar is {posNot}\"{url}\", scream at the coders\n",
    "waitForCurrentUrl":
      "- Wait until the current url is {negNot}\"{url}\"\n",
    "verifyTitle":
      "- Make sure the title of the website is {negNot}\"{title}\"\n",
    "assertTitle":
      "- If the title of the website is {posNot}\"{title}\", scream at the coders\n",
    "waitForTitle":
      "- Wait until the page title is {negNot}\"{title}\"\n",
    "verifyElementSelected":
      "- Make sure {locatorBy} \"{locator}\" is {negNot}selected\n",
    "assertElementSelected":
      "- If {locatorBy} \"{locator}\" is {posNot}selected, scream at the coders\n",
    "waitForElementSelected":
      "- Wait until {locatorBy} \"{locator}\" is {negNot}selected\n",
    "verifyElementValue":
      "- Make sure {locatorBy} \"{locator}\" has a value which is {negNot}\"{value}\"\n",
    "assertElementValue":
      "- If {locatorBy} \"{locator}\" has a value which is {posNot}\"{value}\", scream at the coders\n",
    "waitForElementValue":
      "- Wait until the value of {locatorBy} \"{locator}\" is {negNot}\"{value}\"\n",
    "verifyElementAttribute":
      "- Make sure {locatorBy} \"{locator}\" has a \"{attributeName}\" attribute which is {negNot}\"{value}\"\n",
    "assertElementAttribute":
      "- If {locatorBy} \"{locator}\" has a \"{attributeName}\" attribute which is {posNot}{value}, scream at the coders\n",
    "waitForElementAttribute":
      "- Wait until the \"{attributeName}\" attribute of {locatorBy} \"{locator}\" is {negNot}\"{value}\"\n",
    "verifyCookieByName":
      "- Check the cookie whose name is \"{name}\". Make sure its value is {negNot}\"{value}\"\n",
    "assertCookieByName":
      "- Check the cookie whose name is \"{name}\". If its value is {posNot}\"{value}\", scream at the coders\n",
    "waitForCookieByName":
      "- Wait until the value of the cookie called \"{name}\" is {negNot}\"{value}\"\n",
    "verifyCookiePresent":
      "- Make sure there is {negNot}a cookie whose name is \"{name}\"\n",
    "assertCookiePresent":
      "- If there is {posNot}a cookie whose name is \"{name\"}, scream at the coders\n",
    "waitForCookiePresent":
      "- Wait until the cookie called \"{name}\" is {negNot}present\n",
    "store":
      "- ${{variable}} \"{text}\"\n",
    "storeCurrentUrl":
      "- ${{variable}} the current url\n",
    "storeTitle":
      "- ${{variable}} the title of the page\n",
    "storeText":
      "- ${{variable}} the text in \"{locator}\"\n",
    "storeTextPresent":
      "- ${{variable}} whether or not \"{text}\" is anywhere on the page\n",
    "storeBodyText":
      "- ${{variable}} all the text on the page\n",
    "storePageSource":
      "- ${{variable}} the codez that make this website\n",
    "storeElementSelected":
      "- ${{variable}} whether or not \"{locator}\" is selected\n",
    "storeElementAttribute":
      "- ${{variable}} the value of the \"{attributeName}\" attribute of \"{locator}\"\n",
    "storeElementValue":
      "- ${{variable}} the value of \"{locator}\"\n",
    "storeCookiePresent":
      "- ${{variable}} whether or not a cookie called \"{name}\" exists (or just check whether there are cookies in your pantry)\n",
    "storeCookieByName":
      "- ${{variable}} the value of the cookie called \"{name}\"\n"
  },
  locatorByForType: function(stepType, locatorType, locatorIndex) {
    return {
      "class": "the element(s) on the page with the class name",
      "id": "the element on the page with the id of",
      "link text": "the link which says",
      "xpath": "the element(s) on the page identified by the xpath query",
      "css selector": "the element(s) on the page found by the css selector",
      "name": "the form element with the name attribute of"}[locatorType];
  },
  escapeValue: function(stepType, value, pName) {
    return value;
  },
  unusedVar: function(varName) {
    return "Let's create a virtual bucket in your brain which we'll use to \"remember\" something. And let's call that bucket '" + varName + "'. Ok, into that bucket, put";
  },
  usedVar: function(varName) {
    return "(whatever's in the bucket in your brain we named '"+varName+"')" ;
  }
}));
