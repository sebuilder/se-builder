/** Adding extra functionality to selenium. */
Selenium.prototype.doEcho = function(message) {
  builder.selenium1.playback.echo(message);
};

Selenium.prototype.doSetSpeed = function(speed) {
  builder.selenium1.playback.setSpeed(speed);
};

Selenium.prototype.pause = function(waitTime) {
  builder.selenium1.playback.pause(waitTime);
};

// Remember what the original members of the Selenium prototype are, so we can tell what the new
// ones are after loading user-extensions.js. This allows us to add them to builder.methods in
// extensions.js.
builder.selenium1.originalSelMembers = {};
for (var m in Selenium.prototype) {
  builder.selenium1.originalSelMembers[m] = true;
}


// Same with PageBot.
builder.selenium1.originalPBMembers = {};
for (var m in PageBot.prototype) {
  builder.selenium1.originalPBMembers[m] = true;
}
