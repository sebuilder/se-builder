/**
 * Run after loading user-extensions.js. Registers newly added actions, accessors, assertions,
 * and locator types.
 */

// The numbers of tabs in the methods registry.
var ACTION    = 0;
var ASSERTION = 1;
var WAIT      = 2;
var OTHER     = 3;
var STORE     = 4;

for (var m in Selenium.prototype) {
  if (!builder.selenium1.originalSelMembers[m]) {
    if (m.startsWith("do")) {
      addToCategory(ACTION, "extensions", decapitate(m, "do"));
    }
    if (m.startsWith("is") || m.startsWith("get")) {
      addToCategory(ASSERTION, "extensions", m);
      addToCategory(WAIT, "extensions", m);
      addToCategory(STORE, "extensions", m);
    }
  }
}

builder.registerPostLoadHook(function() {
  var makeLoc = function(name) {
    var loc = {
      'toString': function() { return name; },
    };
    loc[builder.selenium1] = name;
    return loc;
  }
  
  for (var m in PageBot.prototype) {
    if (!builder.selenium1.originalPBMembers[m]) {
      if (m.startsWith("locateElementBy")) {
        var name = decapitate(m, "locateElementBy");
        builder.locator.methods[name] = makeLoc(name);
      }
    }
  }
});

/**
 * Adds a new entry to the registry of methods (see methods.js).
 * @param tab The tab number to add to.
 * @param catName The name of the category to add to. If it does not exist, it's created.
 * @param method The method entry to add.
 */
function addToCategory(tab, catName, method) {
  for (var i in builder.selenium1.__methodRegistry[tab].categories) {
    cat = builder.selenium1.__methodRegistry[tab].categories[i];
    if (cat.name === catName) {
      cat.contents.push(method);
      return;
    }
  }
  builder.selenium1.__methodRegistry[tab].categories.push({
    name: catName,
    contents: [method]
  });
}

/**
 * Removes the head string from the front of the victim string, then makes the first letter of the
 * remaining string lowercase. Eg: decapitate("headTail", "head") -> "tail".
 */
function decapitate(victim, head) {
  return victim.substring(head.length, head.length + 1).toLowerCase() + victim.substring(head.length + 1, victim.length);
}