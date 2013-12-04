/**
 * A class that can record clicks and typing on a window and all sub-windows.
 *
 * @param {Window} The frame to explore
 * @param {Function(step)} Function called with recorded steps
 */
builder.selenium2.Recorder = function(top_window, recordStep) {
  this.top_window = top_window;
  this.recordStep = recordStep;
  
  // These three variables are used to notice when the same event gets issued twice in a row.
  /** The last locator clicked on. */
  this.lastLocator = false;
  /** Timeout used to reset the above values after a second. */
  this.lastLocTimeout;
  /**
   * List of frames to which the recorder has been bound. Gets continually updated via timeout.
   */
  this.bound = [];
  /** Listener functions attached to frames. Stored so they can be detached again. */
  this.listeners = {};
  
  var rec = this;
  // Shims for listeners.
  this.listeners.writeJsonClicks   = function(e) { rec.writeJsonClicks(e);   };
  this.listeners.writeJsonClickAt  = function(e) { rec.writeJsonClickAt(e);  };
  this.listeners.writeJsonType     = function(e) { rec.writeJsonType(e);     };
  this.listeners.writeJsonChange   = function(e) { rec.writeJsonChange(e);   };
  this.listeners.writeJsonKeyPress = function(e) { rec.writeJsonKeyPress(e); };
  this.listeners.bindFrame         = function(frame, level) { rec.bindFrame(frame, level);   };
  this.listeners.unbindFrame       = function(frame, level) { rec.unbindFrame(frame, level); };
  
  // Initialise the recorder by binding to all frames in the recorder window.
  builder.loadlistener.on_all_frames(top_window, this.listeners.bindFrame, 0);
  // Periodically check if new frames have appeared.  
  this.checkFrames = setInterval(function () {
    builder.loadlistener.on_all_frames(rec.top_window, function (frame, level) {
      if (rec.bound.indexOf(frame) == -1) {
        rec.bindFrame(frame, level);
      }
    }, 0);
  }, 200);
  
  // Now listen on navigation functions in the browser.
  this.bind_browser(window.bridge.getBrowser());
};

builder.selenium2.Recorder.prototype = {
  /**
   * Create an event from a received click on any element.
   */
  writeJsonClicks: function(e) {
    var locator = builder.locator.fromElement(e.target, /*applyTextTransforms*/ true);
    var lastStep = builder.getScript().getLastStep();
    
    // Selects are handled via change events, so clicks on them can be ignored.
    if ({ 'select': true, 'option': true }[e.target.tagName.toLowerCase()]) { return; }

    // To keep from generating multiple actions for the same click, we check if the click 
    // happened in the same place as the last one.
    if (this.lastLocator && locator.probablyHasSameTarget(this.lastLocator)) {
      if (e.type == 'click') {
        return;
      }
      if (e.type == 'dblclick') {
        if (lastStep.type == builder.selenium2.stepTypes.clickElement ||
            lastStep.type == builder.selenium2.stepTypes.clickElementWithOffset ||
            lastStep.type == builder.selenium2.stepTypes.doubleClickElement)
        {
          lastStep.changeType(builder.selenium2.stepTypes.doubleClickElement);
          builder.stepdisplay.update();
          return;
        }
      }
    }
    this.lastLocator = locator;
    // But if the same click happens after more than a second, count it as intentional. 
    clearTimeout(this.lastLocTimeout);
    var rec = this;
    this.lastLocTimeout = setTimeout(function () {
      rec.lastLocator = null;
    }, 1000);
    
    // Selects are handled via change events, so clicks on them can be ignored.
    if ({ 'select': true, 'option': true }[e.target.tagName.toLowerCase()]) {
      return;
    }
    
    if (e.type == 'dblclick') {
      this.recordStep(new builder.Step(builder.selenium2.stepTypes.doubleClickElement, locator));
    } else if (e.target.type == "checkbox") {
      if (jQuery(e.target).attr('checked')) {
        this.recordStep(new builder.Step(builder.selenium2.stepTypes.setElementSelected, locator));
      } else {
        this.recordStep(new builder.Step(builder.selenium2.stepTypes.setElementNotSelected, locator));
      }
    } else {
      this.recordStep(new builder.Step(builder.selenium2.stepTypes.clickElement, locator));
    }
  },
  isTypeOrClickInSamePlace: function(step, locator) {
    if (step.type != builder.selenium2.stepTypes.setElementText &&
        step.type != builder.selenium2.stepTypes.sendKeysToElement &&
        step.type != builder.selenium2.stepTypes.clickElement &&
        step.type != builder.selenium2.stepTypes.doubleClickElement &&
        step.type != builder.selenium2.stepTypes.setElementSelected &&
        step.type != builder.selenium2.stepTypes.setElementNotSelected &&
        step.type != builder.selenium2.stepTypes.submitElement)
    {
      return false;
    }
    var stepParams = step.getParamNames();
    for (var i = 0; i < stepParams.length; i++) {
      if (stepParams[i] == "locator") {
        if (locator.probablyHasSameTarget(step["locator"])) {
          return true;
        }
      }
    }
    return false;
  },
  /** Record change events, e.g. typing, selecting, radio buttons. */
  writeJsonChange: function(e) {
    var locator = builder.locator.fromElement(e.target, /*applyTextTransforms*/ true);
    var lastStep = builder.getScript().getLastStep();
        
    // Under some circumstances, for example when the user presses an arrow key, an event can
    // be triggered in Firefox with no e.target.type. Ignore these. 
    if (!e.target.type) {
      return;
    }
    
    // Typing
    if ({ textarea: 1, text: 1, password: 1 }[e.target.type.toLowerCase()]) {
      // Continue typing or replace a click with a type.
      if (lastStep && this.isTypeOrClickInSamePlace(lastStep, locator)) {
        lastStep.changeType(builder.selenium2.stepTypes.setElementText);
        lastStep.text = e.target.value;
        builder.stepdisplay.update();
        return;
      }
      // Also need to check for previous step in case of using enter to submit forms -
      // otherwise we get a spurious extra "type" step after the submit click step.
      var nextToLastStep = builder.getScript().getStepBefore(lastStep);
      if (nextToLastStep && this.isTypeOrClickInSamePlace(nextToLastStep, locator)) {
        nextToLastStep.changeType(builder.selenium2.stepTypes.setElementText);
        nextToLastStep.text = e.target.value;
        builder.stepdisplay.update();
        return;
      }
    
      // If this is an enter and we've already recorded the submit for it, ignore.
      if (e.keyCode == 13 && this.lastLocator != null && lastStep.type == builder.selenium2.stepTypes.clickElement) {
        return;
      }
    
      // Start typing
      this.recordStep(new builder.Step(builder.selenium2.stepTypes.sendKeysToElement, locator, "\\" + e.keyCode));
      return;
    }
    
    // Selecting
    if (e.target.type.toLowerCase() == 'select' || e.target.type.toLowerCase() == 'select-one') {
      var vals = {};
      vals[builder.locator.methods.xpath] = [locator.getValueForMethod(builder.locator.methods.xpath) + "//option[" + (e.target.selectedIndex + 1) + "]"];
      var optLoc = new builder.locator.Locator(builder.locator.methods.xpath, 0, vals);
      
      // Add select
      this.recordStep(new builder.Step(builder.selenium2.stepTypes.setElementSelected, optLoc));
      return;
    }
    
    if (e.target.type.toLowerCase() == 'select-multiple') {
      var currentVal = jQuery(e.target).val();
      var oldVal = e.target.__sb_oldVal || [];
      for (var c = 0; c < currentVal.length; c++) {
        var newlyAdded = true;
        for (var o = 0; o < oldVal.length; o++) {
          if (currentVal[c] == oldVal[o]) {
            newlyAdded = false;
          }
        }
        if (newlyAdded) {
          var vals = {};
          vals[builder.locator.methods.xpath] = [locator.getValueForMethod(builder.locator.methods.xpath) + "/option[@value='" + currentVal[c] + "']"];
          var optLoc = new builder.locator.Locator(builder.locator.methods.xpath, 0, vals);
          
          this.recordStep(new builder.Step(builder.selenium2.stepTypes.setElementSelected, optLoc));
        }
      }
      for (var o = 0; o < oldVal.length; o++) {
        var stillThere = false;
        for (var c = 0; c < currentVal.length; c++) {
          if (currentVal[c] == oldVal[o]) {
            stillThere = true;
          }
        }
        if (!stillThere) {
          var vals = {};
          vals[builder.locator.methods.xpath] = [locator.getValueForMethod(builder.locator.methods.xpath) + "/option[@value='" + oldVal[o] + "']"];
          var optLoc = new builder.locator.Locator(builder.locator.methods.xpath, 0, vals);
          
          this.recordStep(new builder.Step(builder.selenium2.stepTypes.setElementNotSelected, optLoc));
        }
      }
      e.target.__sb_oldVal = currentVal;
      builder.stepdisplay.update();
    }
    
    // Radio button
    if (e.target.type == 'radio') {
      // Replace a click with a radio button check
      if (isTypeOrClickInSamePlace(lastStep, locator)) {
        lastStep.changeType(builder.selenium2.stepTypes.setElementSelected);
        lastStep.locator = locator
        builder.stepdisplay.update();
        return;
      }

      // Add radio button check
      this.recordStep(new builder.Step(builder.selenium2.stepTypes.setElementSelected, locator));
      return;
    }
  },
  /** Finds the frame for a given document. */
  findFrame: function(d) {
    for (i in this.bound) {
      if (this.bound[i].document == d) {
        return this.bound[i];
      }
    }
    return null;
  },
  /**
   * This is horrendously primitive support for typing at new-school HTML fun-stuff
   * It will approximately work for appending stuff but monitoring changes is nigh impossible.
   * However it has the advantage of providing the selectors needed for closer modification.
   */
  writeJsonType: function(e) {
    var locator = builder.locator.fromElement(e.target, /*applyTextTransforms*/ true);
    var lastStep = builder.getScript().getLastStep();
    if (lastStep.type == builder.selenium2.stepTypes.sendKeysToElement) {
      if (e.which >= 32 || e.which == 9 || e.which == 10) {
        lastStep.text += String.fromCharCode(e.which);
      } else if (e.which == 8) {
        lastStep.text = lastStep.text.substr(lastStep.text.length - 1);
      }
      builder.stepdisplay.update();
    } else {
      if (e.which >= 32 || e.which == 9 || e.which == 10) {
        this.recordStep(new builder.Step(builder.selenium2.stepTypes.sendKeysToElement, locator, String.fromCharCode(e.which)));
      }
    }
  },
  /**
   * Record exact position of clicks for elements where it might be important (e.g canvas tags).
   */
  writeJsonClickAt: function(e) {
    var locator = builder.locator.fromElement(e.target, /*applyTextTransforms*/ true);
    var lastStep = builder.getScript().getLastStep();
    var offset = jQuery(e.target).offset();
    var coordString = (e.clientX - offset.left) + "," + (e.clientY - offset.top);
    
    // To keep from generating multiple actions for the same click, update the previous click 
    // step as necessary.
    if (this.lastLocator && locator.probablyHasSameTarget(this.lastLocator)) {
      if (e.type == 'click') {
        return;
      }
      if (e.type == 'dblclick') {
        if (lastStep.type == builder.selenium2.stepTypes.clickElement ||
            lastStep.type == builder.selenium2.stepTypes.clickAt ||
            lastStep.type == builder.selenium2.stepTypes.doubleClickElement)
        {
          lastStep.changeType(builder.selenium2.stepTypes.doubleClickElement);
          builder.stepdisplay.update();
          return;
        }
      }
    }
    this.lastLocator = locator;
    // But if the same click happens after more than a second, count it as intentional. 
    clearTimeout(this.lastLocTimeout);
    var rec = this;
    this.lastLocTimeout = setTimeout(function () {
      rec.lastLocator = null;
    }, 1000);
    
    this.recordStep(new builder.Step(builder.selenium2.clickAt, locator, coordString));
  },
  writeJsonKeyPress: function(e) {
    if (e.which == 13) { // 13 is the key code for enter
      var previousId = builder.getScript().getLastStep() ? builder.getScript().getLastStep().id : null;
      var recordStep = this.recordStep;
      // If the keypress is used to trigger a click, this key event will be immediately
      // followed by a click event. Hence, wait 100 ms and check if another step got recorded
      // in the meantime.
      setTimeout(function () {
        var step = builder.getScript().getLastStep();
        if (!step ||
            step.id == previousId ||
            step.type != builder.selenium2.stepTypes.clickElement ||
            e.target.nodeName.toLowerCase() == 'textbox')
        {
          // Ignore enter keypresses on select and option elements.
          if ({'select': true, 'option': true}[e.target.nodeName.toLowerCase()]) {
            return;
          }
          recordStep(new builder.Step(
            builder.selenium2.stepTypes.sendKeysToElement,
            builder.locator.fromElement(e.target, /*applyTextTransforms*/ true),
            "\\13"));
        }
      }, 100);
    }
  },
  /**
   * Given a function and a recording function, returns a new function that first executes the 
   * original function and then calls the recording function, passing in the Observer function,
   * the arguments and the return value. The original wrapped function is put into the 
   * __original__ field of the returned function. In short, it interposes the record function as
   * a logger.
   * @param original The function to wrap.
   * @param observer The observer function to wrap it in.
   */
  wrapWithObserver: function(original, observer) {
    if (typeof original != 'function') { // FIXME - there should be better handling of this.
      return original;
    }

    // If the original function is already wrapped, unwrap it before adding the new wrapping. 
    if (typeof original.__original__ == 'function') {
      original = original.__original__;
    }

    function replacement() {
      var ret = original.apply(this, arguments);
      observer(this, arguments, ret);
      return ret;
    }
    
    replacement.__original__ = original;
    return replacement;
  },
  /**
   * Attach an observer function to the given field of the given object.
   * @param object The object to one of whose fields we want to attach an observer
   * @param fieldName The name of the field
   * @param The observer function 
   */
  observe: function(object, fieldName, observer) {
    if (object && object[fieldName]) {
      object[fieldName] = new this.wrapWithObserver(object[fieldName], observer);
    }
  },
  /**
   * Detach observers from the given object's fields.
   * @param object The object to detach observers from
   * @param fieldNames___ All arguments beyond the 1st are the names of the fields to unobserve
   */
 unobserve: function(object, fieldNames___) {
    for (var i = 1; i < arguments.length; i++) {
      var fieldName = arguments[i];
      if (object && object[fieldName] && object[fieldName].__original__) {
        object[fieldName] = object[fieldName].__original__;
      }
    }
  },
  // FIXME: if possible this should be hooked in at a chrome level to avoid 
  // splattering messily if a web-app overrides the alert function.
  // event DOMWillOpenModalDialog doesn't seem to give enough information.
  /**
   * Attach observers to the alert, prompt, and confirm dialog functions to record the fact that
   * the test runner will have to wait for and then deal with the dialog. 
   */
  overrideDialogs: function(frame) {
    // qqDPS No Selenium 2 alert support yet.
    /*
    var rec = this;
    this.observe(frame.wrappedJSObject, 'alert', function (thiz, args, retval) {
      rec.recordStep(new builder.Step(builder.selenium1.stepTypes.waitForAlert, args[0]));
    });
    this.observe(frame.wrappedJSObject, 'prompt', function (thiz, args, retval) {
      // Necessary: Selenium raises an error if a second alert/prompt/confirmation occurs
      // before this gets called.
      rec.recordStep(new builder.Step(builder.selenium1.stepTypes.verifyPrompt, args[0]));
      rec.recordStep(new builder.Step(builder.selenium1.stepTypes.answerOnNextPrompt, retval));
    });
    this.observe(frame.wrappedJSObject, 'confirm', function (thiz, args, retval) {
      rec.recordStep(new builder.Step(builder.selenium1.stepTypes.verifyConfirmation, args[0]));
      if (retval) {
        rec.recordStep(new builder.Step(builder.selenium1.stepTypes.chooseOkOnNextConfirmation));
      } else {
        rec.recordStep(new builder.Step(builder.selenium1.stepTypes.chooseCancelOnNextConfirmation));
      }
    });
    */
  },
  /** Remove observers for dialogs. */
  underrideDialogs: function(frame) {
    this.unobserve(frame.wrappedJSObject, 'alert', 'prompt', 'confirm');
  },
  /** Turns off autocomplete for the given fields. */
  deactivateAutocomplete: function(elements) {
    for (var i = 0; i < elements.length; i++) {
      jQuery(elements[i]).attr("autocomplete", "off");
    }
  },
  /** Reactivate autocomplete for the given elements. */
  reactivateAutocomplete: function(elements) {
    for (var i = 0; i < elements.length; i++) {
      jQuery(elements[i]).removeAttr("autocomplete");
    }
  },
  /**
   * Attaches listeners to everything in the frame.
   * @param frame The frame to attach listeners to.
   * @param level The level of the frame - level 0 means it's a page in the browser
   */
  bindFrame: function(frame, level) {
    // Remember that this frame has been bound to.
    this.bound.push(frame);
    
    // Turns out there are cases where people are canceling click on purpose, so I am manually
    // going to attach click listeners to all links.
    var links = frame.document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
      jQuery(links[i]).bind("click", {}, this.listeners.writeJsonClicks, true);
      for (var z = 0; z < links[i].childNodes.length; z++) {
        jQuery(links[i].childNodes[z]).bind("click", {}, this.listeners.writeJsonClicks, true);
      }
    }

    this.overrideDialogs(frame.document);

    jQuery('canvas', frame.document).
        bind('click', {}, this.listeners.writeJsonClickAt, true).
        bind('keypress', {}, this.listeners.writeJsonType, true);
    
    frame.document.addEventListener("dblclick", this.listeners.writeJsonClicks, true);
    frame.document.addEventListener("change", this.listeners.writeJsonChange, true);    
    frame.document.addEventListener("keyup", this.listeners.writeJsonChange, true);

    if (frame.document.designMode && frame.document.designMode.toLowerCase() == 'on') {
      jQuery(frame.document).
          bind("keypress", {}, this.listeners.writeJsonType, true).
          bind("click", {}, this.listeners.writeJsonClickAt, true);
    } else {
      frame.document.addEventListener("click", this.listeners.writeJsonClicks, true);
      //frame.document.addEventListener("keypress", this.listeners.writeJsonKeyPress, true); qqDPS
    }

    // Turn off autocomplete.
    this.deactivateAutocomplete(frame.document.getElementsByTagName('form'));
    this.deactivateAutocomplete(frame.document.getElementsByTagName('input'));
    this.deactivateAutocomplete(frame.document.getElementsByTagName('textarea'));
  },
  /**
   * Remove all the listeners from everything in the frame.
   */
  unbindFrame: function(frame, level) {
    if (!frame.document) { return; }
    
    var links = frame.document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
      jQuery(links[i]).unbind("click", this.listeners.writeJsonClicks, true);
      for (var z = 0; z < links[i].childNodes.length; z++) {
        jQuery(links[i].childNodes[z]).unbind("click", this.listeners.writeJsonClicks, true);
      }
    }

    this.underrideDialogs(frame);
    
    jQuery('canvas', frame.document).
        unbind('click', this.listeners.writeJsonClickAt, true).
        unbind('keypress', this.listeners.writeJsonType, true);
      
    frame.document.removeEventListener("dblclick", this.listeners.writeJsonClicks, true);
    frame.document.removeEventListener("change", this.listeners.writeJsonChange, true);    
    frame.document.removeEventListener("keyup", this.listeners.writeJsonChange, true);
    
    if (frame.document.designMode && frame.document.designMode.toLowerCase() == 'on') {
      jQuery(frame.document).
          unbind("keypress", this.listeners.writeJsonType, true).
          unbind("click", this.listeners.writeJsonClickAt, true);
    } else {
      frame.document.removeEventListener("click", this.listeners.writeJsonClicks, true);
      //frame.document.removeEventListener("keypress", this.listeners.writeJsonKeyPress, true); qqDPS
    }

    // Turn autocomplete back on. Unfortunately, this also turns on autocomplete for elements
    // that had autocomplete off in the original document. Theoretically speaking, the original
    // autocomplete value could be stored in deactivateAutocomplete and restored here, but in
    // practice, Firefox pretends to Javascript that the attribute doesn't exist! For example,
    // the line
    // <input autocomplete="off" type="text" name="email"></input></p>
    // turns into
    // <input name="email" type="text"></p>
    // when read in from jQuery.
    this.reactivateAutocomplete(frame.document.getElementsByTagName('form'));
    this.reactivateAutocomplete(frame.document.getElementsByTagName('input'));
    this.reactivateAutocomplete(frame.document.getElementsByTagName('textarea'));
  },
  /**
   * Add listeners into common navigation functions.
   */
  bind_browser: function(browser) {
    var rec = this;
    // Firefox 3.5 Only
    this.observe(browser, 'BrowserBack', function () {
      if (browser.content == window.bridge.getRecordingWindow()) {
        rec.recordStep(new builder.Step(builder.selenium2.stepTypes.goBack));
      }
    });

    // The other BrowserReload* functions are just wrappers around this
    this.observe(browser, 'BrowserReloadWithFlags', function () {
      if (browser.content == window.bridge.getRecordingWindow()) {
        rec.recordStep(new builder.Step(builder.selenium2.stepTypes.refresh));
      }
    });

    // Listen for the user actually typing in a URL into the navigation bar.
    // (browser is a window, gBrowser is a Browser, and mCurrentBrowser is a TabBrowser)
    this.observe(browser.gBrowser.mCurrentBrowser, 'loadURIWithFlags', function (browser, url) {
      // We can't find out what the URL was until after we get destroyed (and then bound to
      // the next content window) so we rely on who ever is listening to do this for us.
      rec.recordStep(new builder.Step(builder.selenium2.stepTypes.get, ""));
    });
  },
  /**
   * Remove listeners from common navigation functions.
   */
  unbind_browser: function(browser) {
    this.unobserve(browser, 'BrowserBack', 'BrowserReloadWithFlags');
    this.unobserve(browser.gBrowser.mCurrentBrowser, 'loadURIWithFlags');
  },
  destroy: function() {
    builder.loadlistener.on_all_frames(this.top_window, this.listeners.unbindFrame, 0);
    clearInterval(this.checkFrames);
    this.unbind_browser(window.bridge.getBrowser());
  }
};

builder.selenium2.getRecorder = function(recordingWindow, recordStep) {
  return new builder.selenium2.Recorder(recordingWindow, recordStep);
};