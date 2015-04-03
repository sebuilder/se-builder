/**
 * A class that can record clicks and typing on a window and all its sub-windows.
 *
 * @param {Window} The frame to explore
 * @param {Function(step)} Function called with recorded steps
 * @param {Function} Function that returns last recorded step
 */
builder.selenium1.Recorder = function(top_window, recordStep, getLastRecordedStep) {
  try {
    this.top_window = top_window;
    this.recordStep = recordStep;
    this.getLastRecordedStep = getLastRecordedStep;
  
    // These two variables are used to notice when the same event gets issued twice in a row.
    /** The last locator clicked on. */
    this.lastLocator = false;
    /** Timeout used to reset the above values after a second. */
    this.lastLocTimeout = null;
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
        if (rec.bound.indexOf(frame) === -1) {
          rec.bindFrame(frame, level);
        }
      }, 0);
    }, 200);
  
    // Now listen on navigation functions in the browser.
    this.bind_browser(window.bridge.getBrowser());
  } catch(e) {
    Components.utils.reportError(e); // report the error and continue execution
  }
};

builder.selenium1.Recorder.prototype = {
  /**
   * Create an event from a received click on any element.
   */
  writeJsonClicks: function(e) {
    var locator = builder.locator.fromElement(e.target);
    var lastStep = this.getLastRecordedStep();//builder.getScript().getLastStep();
    
    // Selects are handled via change events, so clicks on them can be ignored.
    if ({ 'select': true, 'option': true }[e.target.tagName.toLowerCase()]) { return; }

    // To keep from generating multiple actions for the same click, we check if the click 
    // happened in the same place as the last one.
    if (this.lastLocator && locator.probablyHasSameTarget(this.lastLocator)) {
      if (e.type === 'click') {
        return;
      }
      if (e.type === 'dblclick' && lastStep) {
        if (lastStep.type === builder.selenium1.stepTypes.click ||
            lastStep.type === builder.selenium1.stepTypes.clickAt ||
            lastStep.type === builder.selenium1.stepTypes.doubleClick)
        {
          lastStep.changeType(builder.selenium1.stepTypes.doubleClick);
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

    if (e.type === 'dblclick') {
      this.recordStep(new builder.Step(builder.selenium1.stepTypes.doubleClick, locator));
      return;
    }
    if (e.target.type === "checkbox") {
      this.recordStep(new builder.Step(builder.selenium1.stepTypes.check, locator));
      return;
    }
    this.recordStep(new builder.Step(builder.selenium1.stepTypes.click, locator));
  },
  isTypeOrClickInSamePlace: function(step, locator) {
    if (!step) { return false; }
    if (step.type !== builder.selenium1.stepTypes.type &&
        step.type !== builder.selenium1.stepTypes.click &&
        step.type !== builder.selenium1.stepTypes.doubleClick &&
        step.type !== builder.selenium1.stepTypes.check)
    {
      return false;
    }
    var stepParams = step.getParamNames();
    for (var i = 0; i < stepParams.length; i++) {
      if (stepParams[i] === "locator") {
        if (locator.probablyHasSameTarget(step.locator)) {
          return true;
        }
      }
    }
    return false;
  },
  /** Record change events, e.g. typing, selecting, radio buttons. */
  writeJsonChange: function(e) {
    if (e.which == 13) { // 13 is the key code for enter
      var previousId = this.getLastRecordedStep() ? this.getLastRecordedStep().id : null;
      var recordStep = this.recordStep;
      // If the keypress is used to trigger a click, this key event will be immediately
      // followed by a click event. Hence, wait 100 ms and check if another step got recorded
      // in the meantime.
      var glrs = this.getLastRecordedStep;
      setTimeout(function () {
        var step = glrs();
        if (!step ||
            step.id == previousId ||
            step.type != builder.selenium1.stepTypes.click ||
            e.target.nodeName.toLowerCase() == 'textbox')
        {
          // Ignore enter keypresses on select and option elements.
          if ({'select': true, 'option': true}[e.target.nodeName.toLowerCase()]) {
            return;
          }
          
          // If something else has happened in the interim, eg a click, don't record an enter.
          if (step && step.type == builder.selenium1.stepTypes.click) {
            return;
          }
          var t = e.target;
          if (t.nodeName == "BODY" && step && step.locator) {
            recordStep(new builder.Step(
              builder.selenium1.stepTypes.keyPress,
              step.locator,
              "\\13"));
          } else {
            recordStep(new builder.Step(
              builder.selenium1.stepTypes.keyPress,
              builder.locator.fromElement(e.target, /*applyTextTransforms*/ true),
              "\\13"));
          }
        }
      }, 100);
      return;
    }
    
    var locator = builder.locator.fromElement(e.target);
    var lastStep = this.getLastRecordedStep();//builder.getScript().getLastStep();
    
    // Under some circumstances, for example when the user presses an arrow key, an event can
    // be triggered in Firefox with no e.target.type. Ignore these. 
    if (!e.target.type) {
      return;
    }
    
    // Typing
    if ({ textarea: 1, text: 1, password: 1, date: 1, datetime: 1, 'datetime-local': 1, email: 1, month: 1, number: 1, range: 1, search: 1, tel: 1, time: 1, url: 1, week: 1 }[e.target.type.toLowerCase()]) {
      // Continue typing or replace a click with a type.
      if (lastStep && this.isTypeOrClickInSamePlace(lastStep, locator)) {
        lastStep.changeType(builder.selenium1.stepTypes.type);
        lastStep.value = e.target.value;
        builder.stepdisplay.update();
        return;
      }
      // Also need to check for previous step in case of using enter to submit forms -
      // otherwise we get a spurious extra "type" step after the submit click step.
      var nextToLastStep = lastStep ? builder.getScript().getStepBefore(lastStep) : null;
      if (this.isTypeOrClickInSamePlace(nextToLastStep, locator)) {
        nextToLastStep.changeType(builder.selenium1.stepTypes.type);
        nextToLastStep.value = e.target.value;
        builder.stepdisplay.update();
        return;
      }
      
      // Start typing
      this.recordStep(new builder.Step(builder.selenium1.stepTypes.type, locator, e.target.value));
      return;
    }
    
    // Selecting
    var frame, lastTarget;
    if (e.target.type === 'select' || e.target.type === 'select-one') {
      // Replace a click with a select
      if (lastStep && this.isTypeOrClickInSamePlace(lastStep, locator)) {
        lastStep.changeType(builder.selenium1.stepTypes.select);
        lastStep.optionLocator = e.target.options[e.target.selectedIndex].text;
        builder.stepdisplay.update();
      }
      
      // Deduplicate selects, as we only need the final state of a sequence of selects.
      // Also, sometimes Firefox issues multiple select events.
      if (lastStep && lastStep.type === builder.selenium1.stepTypes.select) {
        frame = findFrame(e.target.ownerDocument);
        if (frame) {
          lastTarget = new MozillaBrowserBot(frame).findElementBy("xpath",
              lastStep.selectLocator.getValueForMethod(builder.locator.methods.xpath), frame.document, frame);
          if (lastTarget === e.target) {
            lastStep.selectLocator = e.target.options[e.target.selectedIndex].text;
            builder.stepdisplay.update();
            return;
          }
        }
      }
      
      // Add select
      this.recordStep(new builder.Step(builder.selenium1.stepTypes.select,
        locator, e.target.options[e.target.selectedIndex].text));
      return;
    }
    
    // Radio button
    if (e.target.type === 'radio') {
      // See if the check is already reported, and if yes, bail. Firefox does multiple events
      // when you select a radio button using a keyboard, so we have to deduplicate.
      if (lastStep && lastStep.type === builder.selenium1.stepTypes.check) {
        frame = this.findFrame(e.target.ownerDocument);
        if (frame) {
          lastTarget = new MozillaBrowserBot(frame).findElementBy("xpath",
              lastStep.locator.getValueForMethod(builder.locator.methods.xpath), frame.document, frame);
          if (lastTarget === e.target) {
            return;
          }
        }
      }

      // Replace a click with a radio button check
      if (lastStep && this.isTypeOrClickInSamePlace(lastStep, locator)) {
        lastStep.changeType(builder.selenium1.stepTypes.check);
        step.locator = locator;
        builder.stepdisplay.update();
        return;
      }

      // Add radio button check
      this.recordStep(new builder.Step(builder.selenium1.stepTypes.check,
        locator));
      return;
    }
  },
  /** Finds the frame for a given document. */
  findFrame: function(d) {
    for (var i = 0; i < this.bound.length; i++) {
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
    var locator = builder.locator.fromElement(e.target);
    var lastStep = this.getLastRecordedStep();//builder.getScript().getLastStep();
    if (lastStep && lastStep.type == builder.selenium1.stepTypes.typeKeys) {
      if (e.which >= 32 || e.which == 9 || e.which == 10) {
        lastStep.value += String.fromCharCode(e.which);
      } else if (e.which == 8) {
        lastStep.value = lastStep.value.substr(lastStep.value.length - 1);
      }
      builder.stepdisplay.update();
    } else {
      if (e.which >= 32 || e.which == 9 || e.which == 10) {
        this.recordStep(new builder.Step(builder.selenium1.stepTypes.typeKeys, locator, String.fromCharCode(e.which)));
      }
    }
  },
  /**
   * Record exact position of clicks for elements where it might be important (e.g canvas tags).
   */
  writeJsonClickAt: function(e) {
    var locator = builder.locator.fromElement(e.target);
    var lastStep = this.getLastRecordedStep();//builder.getScript().getLastStep();
    var offset = jQuery(e.target).offset();
    var coordString = (e.clientX - offset.left) + "," + (e.clientY - offset.top);
    
    // To keep from generating multiple actions for the same click, update the previous click 
    // step as necessary.
    if (this.lastLocator && locator.probablyHasSameTarget(this.lastLocator)) {
      if (e.type == 'click') {
        return;
      }
      if (lastStep && e.type == 'dblclick') {
        if (lastStep.type == builder.selenium1.stepTypes.click ||
            lastStep.type == builder.selenium1.stepTypes.clickAt ||
            lastStep.type == builder.selenium1.stepTypes.doubleClick)
        {
          lastStep.changeType(builder.selenium1.stepTypes.doubleClick);
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
    
    this.recordStep(new builder.Step(builder.selenium1.clickAt, locator, coordString));
  },
  writeJsonKeyPress: function(e) {
    if (e.which == 13) { // 13 is the key code for enter
      var previousId = this.getLastRecordedStep() ? this.getLastRecordedStep().id : null;
      var recordStep = this.recordStep;
      // If the keypress is used to trigger a click, this key event will be immediately
      // followed by a click event. Hence, wait 100 ms and check if another step got recorded
      // in the meantime.
      var glrs = this.getLastRecordedStep;
      setTimeout(function () {
        var step = glrs();
        if (!step ||
            step.id == previousId ||
            step.type != builder.selenium1.stepTypes.click ||
            e.target.nodeName.toLowerCase() == 'textbox')
        {
          // Ignore enter keypresses on select and option elements.
          if ({'select': true, 'option': true}[e.target.nodeName.toLowerCase()]) {
            return;
          }
          recordStep(new builder.Step(
            builder.selenium1.stepTypes.keyPress,
            builder.locator.fromElement(e.target),
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

    this.overrideDialogs(frame);

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
      frame.document.addEventListener("keypress", this.listeners.writeJsonKeyPress, true);
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
      frame.document.removeEventListener("keypress", this.listeners.writeJsonKeyPress, true);
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
        rec.recordStep(new builder.Step(builder.selenium1.stepTypes.goBack));
      }
    });

    // The other BrowserReload* functions are just wrappers around this
    this.observe(browser, 'BrowserReloadWithFlags', function () {
      if (browser.content == window.bridge.getRecordingWindow()) {
        rec.recordStep(new builder.Step(builder.selenium1.stepTypes.refresh));
      }
    });

    // Listen for the user actually typing in a URL into the navigation bar.
    // (browser is a window, gBrowser is a Browser, and mCurrentBrowser is a TabBrowser)
    this.observe(browser.gBrowser.mCurrentBrowser, 'loadURIWithFlags', function (browser, url) {
      // We can't find out what the URL was until after we get destroyed (and then bound to
      // the next content window) so we rely on who ever is listening to do this for us.
      rec.recordStep(new builder.Step(builder.selenium1.stepTypes.open, "", /* user opened page manually*/ true));
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

builder.selenium1.getRecorder = function(recordingWindow, recordStep, getLastRecordedStep) {
  return new builder.selenium1.Recorder(recordingWindow, recordStep, getLastRecordedStep);
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
