/**
 * Used for making verifications and choosing new locators.
 * 
 * Creating a VerifyExplorer attaches listeners to all frames in the browser so that when the user
 * clicks on a DOM node/HTML element, the change_status function is called. To show the user which
 * node will be chosen if they click now the node is given a outline border.
 *
 * @param {Window} The frame to explore
 * @param Selenium version to generate steps for
 * @param {Function(step)} Function called with recorded verify step
 * @param boolean Instead of returning an entire ste, just returns the locator for the selected element.
 */
builder.VerifyExplorer = function(top_window, seleniumVersion, recordStep, justReturnLocator) {
  this.top_window        = top_window;
  this.seleniumVersion   = seleniumVersion;
  this.recordStep        = recordStep;
  /** The DOM element the user is currently hovering over and that has been highlit. */
  this.highlit_element   = null;
  /** Listener functions attached to frames. Stored so they can be detached again. */
  this.justReturnLocator = justReturnLocator;
  
  this.listeners = {
    mouseover: function(e) { ae.handleMouseover(e); },
    mouseout:  function(e) { ae.resetBorder(e);     },
    mouseup:   function(e) { ae.handleMouseup(e);   },
    mousedown: function(e) { ae.absorbMousedown(e); },
    click:     function(e) { ae.absorbClick(e);     }
  };
  
  var ae = this;
  
  function attach(frame, level) {
    for (var l in ae.listeners) {
      jQuery(frame.document).bind(l, {}, ae.listeners[l], true);
    }
  }
  
  builder.loadlistener.on_all_frames(top_window, attach, 0);
};

builder.VerifyExplorer.prototype = {
  /**
   * Highlights the mousedover element and removes highlight from old element.
   */
  handleMouseover: function(e) {
    // If there is a previous highlit element, remove its borders
    if (this.highlit_element) {
      this.resetBorder({
        target: this.highlit_element
      });
    }
    this.highlit_element = e.target;
    e.target.style.outline = '1px solid #003366';
  },

  /**
   * Informs whatever is listening to record_verification that an verification has been made.
   * This will usually result in us being destroy()ed by whatever is listening.
   */
  handleMouseup: function(e) {
    // Figures out what verification to record for the element clicked on, or if
    // for_choosing_locator is set, just returns with a assertVisible verification that (I guess)
    // can be used to set the new locator.
    e.cancelBubble = true;
    e.stopPropagation();
    e.preventDefault();

    window.focus();

    // Setup the params
    var locator = builder.locator.fromElement(e.target, /*applyTextTransforms*/ this.seleniumVersion == builder.selenium2);
    if (this.justReturnLocator) { this.recordStep(locator); return; }

    var tag = e.target.nodeName.toUpperCase();
    var selection = window.bridge.getRecordingWindow().getSelection();

    if (selection && selection.toString().trim().length > 0) {
      if (this.seleniumVersion == builder.selenium1) {
        this.recordStep(new builder.Step(builder.selenium1.stepTypes.verifyTextPresent,
          builder.normalizeWhitespace(selection.toString())));
      }
      if (this.seleniumVersion == builder.selenium2) {
        this.recordStep(new builder.Step(builder.selenium2.stepTypes.verifyTextPresent,
          builder.normalizeWhitespace(selection.toString())));
      }
      return;
    }
    
    if (tag == "SELECT") {
      if (this.seleniumVersion == builder.selenium1) {
        this.recordStep(new builder.Step(builder.selenium1.stepTypes.verifySelectedValues, locator, e.target.value));
      }
      if (this.seleniumVersion == builder.selenium2) {
        this.recordStep(new builder.Step(builder.selenium2.stepTypes.verifyElementValue, locator, e.target.value));
      }
      return;
    }
    
    if (tag == "INPUT") {
      var type = e.target.getAttribute('type');
      if (type) { type = type.toLowerCase(); }
      
      if ({"checkbox": 1, "radio": 1}[type]) {
        // NOTE: if this event is handled synchronously, Firefox helpfully toggles the checked
        // status to what it would be after the click has finished if we hadn't called
        // preventDefault above.
        // This means that it is impossible to tell whether a radio button is selected, because no
        // matter what its current status, after clicking on it, it becomes checked. By delaying
        // this evaluation until after the event handling has finished, we get access to the actual
        // checked property.
        var ae = this;
        setTimeout(function () {
          var step = null;
          if (ae.seleniumVersion == builder.selenium1) {
            step = new builder.Step(builder.selenium1.stepTypes.verifyChecked, locator);
          }
          if (ae.seleniumVersion == builder.selenium2) {
            step = new builder.Step(builder.selenium1.stepTypes.verifyElementSelected, locator);
          }
          step.negated = !e.target.checked;
          ae.recordStep(step);
        }, 0);
      } else {
        if (this.seleniumVersion == builder.selenium1) {
          this.recordStep(new builder.Step(builder.selenium1.stepTypes.verifyValue, locator, e.target.value));
        }
        if (this.seleniumVersion == builder.selenium2) {
          this.recordStep(new builder.Step(builder.selenium2.stepTypes.verifyElementValue, locator, e.target.value));
        }
      }
      return;
    }
    if (tag == "TEXTAREA") {
      if (this.seleniumVersion == builder.selenium1) {
        this.recordStep(new builder.Step(builder.selenium1.stepTypes.verifyValue, locator, e.target.value));
      }
      if (this.seleniumVersion == builder.selenium2) {
        this.recordStep(new builder.Step(builder.selenium2.stepTypes.verifyElementValue, locator, e.target.value));
      }
      return;
    }
    if (e.target.textContent !== "") {
      var text = this.seleniumVersion == builder.selenium2 ? getCorrectCaseText(e.target) : e.target.textContent;
      if (text.length > 200) {
        var nextSpace = text.indexOf(' ', 200);
        if (nextSpace > -1 && nextSpace < 250) {
          text = text.substr(0, nextSpace);
        } else {
          nextSpace = text.substr(200).lastIndexOf(' ');
          if (nextSpace > 50) {
            text = text.substr(0, 50);
          } else {
            text = text.substr(0, 100);
          }
        }
      }
      if (this.seleniumVersion == builder.selenium1) {
        this.recordStep(new builder.Step(builder.selenium1.stepTypes.verifyTextPresent,
          builder.normalizeWhitespace(text)));
      }
      if (this.seleniumVersion == builder.selenium2) {
        this.recordStep(new builder.Step(builder.selenium2.stepTypes.verifyTextPresent,
          builder.normalizeWhitespace(text)));
      }
      return;
    }
    
    
    if (this.seleniumVersion == builder.selenium1) {
      this.recordStep(new builder.Step(builder.selenium1.stepTypes.verifyVisible, locator));
    }
    if (this.seleniumVersion == builder.selenium2) {
      this.recordStep(new builder.Step(builder.selenium2.stepTypes.verifyElementPresent, locator));
    }
  },

  /**
   * Prevent the default action from firing on the click event.
   * This needs to be explicit because we only catch the mouseup.
   */
  absorbClick: function(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  /**
   * With Mousedown the default action is to allow text selection, so don't preventDefault.
   * This way, the user can select what part of the text on the page they wish to make a
   * verification about.
   */
  absorbMousedown: function(e) {
    e.stopPropagation();
  },

  /**
   * Remove the outline from any node that has been outlined.
   *
   * FIXME: If a page specifies an outline on the node, this process will remove it.
   * (CSS outline properties should be OK.)
   */
  resetBorder: function(e) {
    if (this.highlit_element == e.target) { this.highlit_element = null; }
    e.target.style.outline = ''; // FIXME
  },
  
  destroy: function() {
    var ae = this;
    
    function detach(frame, level) {
      for (var l in ae.listeners) {
        jQuery(frame.document).unbind(l, ae.listeners[l], true);
      }
    }
    
    if (this.highlit_element) { this.resetBorder({ target: this.highlit_element }); }
    builder.loadlistener.on_all_frames(this.top_window, detach, 0);
  }
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
