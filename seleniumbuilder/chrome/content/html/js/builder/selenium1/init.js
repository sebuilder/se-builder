/**
 * Data structure representing Selenium 1. Use "builder.selenium1" to refer to Selenium 1, as
 * opposed to a string or numerical representation. builder.selenium1 and builder.selenium2 both
 * export a stepTypes map and a categories list that have the same interface so that most code
 * doesn't have to know which version of Selenium is being used.
 */
builder.selenium1 = {
  toString: function() { return "__SELENIUM_1__"; },
  name: "Selenium 1",
  shortName: "sel1"
};

builder.seleniumVersions.push(builder.selenium1);