builder.stepdisplay = {};

builder.stepdisplay.state = {};
builder.stepdisplay.state.NO_CHANGE = -1;
builder.stepdisplay.state.NORMAL = 0;
builder.stepdisplay.state.RUNNING = 1;
builder.stepdisplay.state.SUCCEEDED = 2;
builder.stepdisplay.state.FAILED = 3;
builder.stepdisplay.state.ERROR = 4;
builder.stepdisplay.state.BREAKPOINT = 5;

builder.stepdisplay.stateColors = {};
builder.stepdisplay.stateColors[builder.stepdisplay.state.NORMAL] = 'white';
builder.stepdisplay.stateColors[builder.stepdisplay.state.RUNNING] = '#ffffaa';
builder.stepdisplay.stateColors[builder.stepdisplay.state.SUCCEEDED] = '#bfee85';
builder.stepdisplay.stateColors[builder.stepdisplay.state.FAILED] = '#ffcccc';
builder.stepdisplay.stateColors[builder.stepdisplay.state.ERROR] = '#ff3333';
builder.stepdisplay.stateColors[builder.stepdisplay.state.BREAKPOINT] = '#e0d5e9';

builder.registerPostLoadHook(function() {
  jQuery('#suite-saverequired').text(_t('suite_has_unsaved_changes'));
  jQuery('#suite-cannotsave-unsavedscripts').text(_t('suite_cannot_save_unsaved_scripts'));
  jQuery('#suite-cannotsave-notallsel1').text(_t('cannot_save_suite_due_to_mixed_versions'));
  jQuery('#edit-stop-local-playback').text(_t('stop_playback'));
  jQuery('#edit-stop-rc-playback').text(_t('stop_playback'));
  jQuery('#edit-continue-local-playback').text(_t('continue_playback'));
  jQuery('#edit-continue-rc-playback').text(_t('continue_playback'));
  jQuery('#edit-rc-stopping').text(_t('stopping'));
  jQuery('#edit-clearresults').text(_t('clear_results'));
  jQuery('#edit-rc-connecting-text').text(_t('connecting'));
  jQuery('#record-verify').text(_t('record_verification'));
  jQuery('#record-stop-button').text(_t('stop_recording'));
});

var reorderHandlerInstalled = false;

function esc(txt) {
  txt = JSON.stringify(txt);
  return txt.substring(1, txt.length - 1);
}

function deesc(txt) {
  try {
    return JSON.parse("\"" + txt + "\"");
  } catch (e) {
    return txt;
  }
}

/** Functions for displaying Selenium 2 steps. */
builder.stepdisplay.clearDisplay = function() {
  jQuery("#steps").empty();
  jQuery('#recordingSuite0').empty();
};

builder.stepdisplay.updateStepPlaybackState = function(run, script, step, stepIndex, state, message, error, percentProgress) {
  if (script != builder.getScript()) { return; } // This script isn't visible.
  var id = step.id;
  if (state != builder.stepdisplay.state.NO_CHANGE) {
    jQuery("#" + id + '-content').css('background-color', builder.stepdisplay.stateColors[state]);
  }
  if (message) {
    jQuery("#" + id + "-message").html(message).show();
  }
  if (error) {
    jQuery("#" + id + "-error").html(error).show();
  }
  if (percentProgress && percentProgress > 0) {
    builder.stepdisplay.setProgressBar(id, percentProgress);
  } else {
    builder.stepdisplay.hideProgressBar(id);
  }
  step.outcome = state;
  step.runmessage = message;
  step.failureMessage = error;
};

builder.stepdisplay.update = function() {
  if (!reorderHandlerInstalled) {
    // Make steps sortable by dragging.
    jQuery('#steps').sortable({
      items: ".b-step",
      axis: "y",
      update: function(evt, ui) {
        var reorderedSteps = jQuery('#steps .b-step').get();
        var reorderedIDs = [];
        for (var i = 0; i < reorderedSteps.length; i++) {
          // Filter out elements that aren't actually steps. (?)
          if (builder.getScript().getStepIndexForID(reorderedSteps[i].id) != -1) {
            reorderedIDs.push(reorderedSteps[i].id);
          }
        }
        builder.getScript().reorderSteps(reorderedIDs);
      }
    });
    reorderHandlerInstalled = true;
  }
  builder.stepdisplay.clearDisplay();
  var script = builder.getScript();
  var saveRequired = script.saveRequired;
  for (var i = 0; i < script.steps.length; i++) {
    addStep(script.steps[i]);
  }
  script.saveRequired = saveRequired;
};

builder.stepdisplay.updateStep = function(stepID) {
  var script = builder.getScript();
  var step = script.getStepWithID(stepID);
  var paramNames = step.getParamNames();
  if (step.negated) {
    jQuery('#' + stepID + '-type').text(_t('not') + " " + builder.translate.translateStepName(step.type.getName()));
  } else {
    jQuery('#' + stepID + '-type').text(builder.translate.translateStepName(step.type.getName()));
  }
  if (script.seleniumVersion.playback.canPlayback(step.type)) {
    jQuery('#' + stepID + '-unplayable').hide();
  } else {
    jQuery('#' + stepID + '-unplayable').show();
  }
  for (var i = 0; i < paramNames.length; i++) {
    jQuery('#' + stepID + 'edit-p' + i).show();
    jQuery('#' + stepID + 'edit-p' + i + '-name').text(_t('edit_p', builder.translate.translateParamName(paramNames[i], step.type.getName())));
    jQuery('#' + stepID + '-p' + i).show();
    jQuery('#' + stepID + '-p' + i + '-name').text(builder.translate.translateParamName(paramNames[i], step.type.getName()));
    if (step.type.getParamType(paramNames[i]) == "locator") {
      jQuery('#' + stepID + '-p' + i + '-value').text(step[paramNames[i]].getName(script.seleniumVersion) + ": " + esc(step[paramNames[i]].getValue()));
    } else {
      jQuery('#' + stepID + '-p' + i + '-value').text(esc(step[paramNames[i]]));
    }
    if (paramNames.length > 1) {
      jQuery('#' + stepID + '-p' + i).css("display", "block");
    } else {
      jQuery('#' + stepID + '-p' + i).css("display", "inline");
    }
    if (paramNames.length > 1 || step[paramNames[i]] == "") {
      jQuery('#' + stepID + '-p' + i + '-name').show();
    } else {
      jQuery('#' + stepID + '-p' + i + '-name').hide();
    }
  }
  // Hide the param display elements that aren't needed.
  for (var i = paramNames.length; i < 3; i++) {
    jQuery('#' + stepID + 'edit-p' + i).hide();
    jQuery('#' + stepID + '-p' + i).hide();
  }
  if (step.type.getNote()) {
    jQuery('#' + stepID + '-note').show().html(step.type.getNote());
  } else {
    jQuery('#' + stepID + '-note').hide();
  }
  
  // Set the playback status info
  jQuery('#' + step.id + '-content').css('background-color', 'white');
  jQuery('#' + step.id + '-error').hide();
  jQuery('#' + step.id + '-message').hide();
  if (builder.stepdisplay.stateColors[step.outcome]) {
    jQuery("#" + step.id + '-content').css('background-color', builder.stepdisplay.stateColors[step.outcome]);
  }
  if (step.runmessage) {
    jQuery("#" + step.id + "-message").show().html(step.runmessage);
  }
  if (step.failureMessage) {
    jQuery("#" + step.id + "-error").show().html(step.failureMessage);
  }
};

builder.stepdisplay.showProgressBar = function(stepID) {
  jQuery('#' + stepID + '-progress-done').show();
  jQuery('#' + stepID + '-progress-notdone').show();
};

builder.stepdisplay.hideProgressBar = function(stepID) {
  jQuery('#' + stepID + '-progress-done').hide();
  jQuery('#' + stepID + '-progress-notdone').hide();
};

builder.stepdisplay.setProgressBar = function(stepID, percent) {
  jQuery('#' + stepID + '-progress-done').css('width', percent);
  jQuery('#' + stepID + '-progress-notdone').css('left', percent).css('width', 100 - percent);
  builder.stepdisplay.showProgressBar(stepID);
};

builder.stepdisplay.addNewStep = function() {
  var script = builder.getScript();
  var newStep = new builder.Step(script.seleniumVersion.defaultStepType);
  script.addStep(newStep);
  addStep(newStep);
  builder.suite.setCurrentScriptSaveRequired(true);
  return newStep.id;
};

function addNewStepBefore(beforeStepID) {
  var id = builder.stepdisplay.addNewStep();
  var beforeStepDOM = jQuery('#' + beforeStepID)[0];
  var newStepDOM = jQuery("#" + id)[0];
  newStepDOM.parentNode.removeChild(newStepDOM);
  beforeStepDOM.parentNode.insertBefore(newStepDOM, beforeStepDOM);
  builder.getScript().moveStepToBefore(id, beforeStepID);
  builder.suite.setCurrentScriptSaveRequired(true);
}

function addNewStepAfter(afterStepID) {
  var id = builder.stepdisplay.addNewStep();
  var afterStep = jQuery('#' + afterStepID);
  var newStepDOM = jQuery("#" + id)[0];
  newStepDOM.parentNode.removeChild(newStepDOM);
  afterStep.after(newStepDOM);
  builder.getScript().moveStepToAfter(id, afterStepID);
  builder.suite.setCurrentScriptSaveRequired(true);
}

function copyStep(stepID) {
  bridge.setClipboardString(JSON.stringify(builder.getScript().getStepWithID(stepID).toJSON()));
}

function cutStep(stepID) {
  copyStep(stepID);
  deleteStep(stepID);
}

function pasteStep(afterStepID) {
  var text = bridge.getClipboardString();
  if (!text) { return; }
  var script = builder.getScript();
  var newStep = builder.stepFromJSON(JSON.parse(text), script.seleniumVersion);
  script.addStep(newStep);
  addStep(newStep);
  var id = newStep.id;
  var afterStep = jQuery('#' + afterStepID);
  var newStepDOM = jQuery("#" + id)[0];
  newStepDOM.parentNode.removeChild(newStepDOM);
  afterStep.after(newStepDOM);
  builder.getScript().moveStepToAfter(id, afterStepID);
  builder.suite.setCurrentScriptSaveRequired(true);
}

function deleteStep(stepID) {
  if (builder.getScript().steps.length < 2) { return; }
  builder.getScript().removeStepWithID(stepID);
  jQuery('#' + stepID).remove();
  builder.suite.setCurrentScriptSaveRequired(true);
  appearingID = -1; // If there was a menu open, pave the way for a different one to open instead.
}

function toggleBreakpoint(stepID) {
  var bp = builder.getScript().getStepWithID(stepID).breakpoint;
  if (bp) {
    jQuery('#' + stepID + '-breakpoint').hide();
    jQuery('#' + stepID + 'toggle-breakpoint').text(_t('step_add_breakpoint'));
    builder.getScript().getStepWithID(stepID).breakpoint = false;
  } else {
    jQuery('#' + stepID + '-breakpoint').show();
    jQuery('#' + stepID + 'toggle-breakpoint').text(_t('step_remove_breakpoint'));
    builder.getScript().getStepWithID(stepID).breakpoint = true;
  }
}

builder.stepdisplay.clearAllBreakpoints = function() {
  var script = builder.getScript();
  for (var i = 0; i < script.steps.length; i++) {
    var step = script.steps[i];
    jQuery('#' + step.id + '-breakpoint').hide();
    jQuery('#' + step.id + 'toggle-breakpoint').text(_t('step_add_breakpoint'));
    step.breakpoint = false;
  }
};

var searchers = [];
var hasSearchers = false;
var searcherInterval = null;
var wasRecording = false;

function toggleSearchers(stepID, pIndex) {
  if (hasSearchers) { stopSearchers(stepID, pIndex); } else { startSearchers(stepID, pIndex); }
}

function stopSearchers(stepID, pIndex) {
  if (searcherInterval) {
    clearInterval(searcherInterval);
  }
  for (var i = 0; i < searchers.length; i++) {
    searchers[i].destroy();
  }
  searchers = [];
  hasSearchers = false;
  if (wasRecording) {
    builder.record.continueRecording();
  }
}

function startSearchers(stepID, pIndex) {
  wasRecording = builder.record.recording;
  if (builder.record.recording) {
    builder.record.stop();
  }
  hasSearchers = true;
  attachSearchers(stepID, pIndex, true);
  // Keep on looking for new frames with no attached searchers.
  searcherInterval = setInterval(function() { attachSearchers(stepID, pIndex); }, 500, true);
  window.bridge.focusRecordingTab();
}

/**
 * Attach a VerifyExplorer to each frame in Firefox to allow the user to select a new locator.
 * The code also attaches a boolean to the frames to prevent attaching multiple searchers, but
 * since this can't be easily cleared when searching is complete, it can be overridden with the
 * force parameter.
 */
function attachSearchers(stepID, pIndex, force) {
  var script = builder.getScript();
  // To do this, we first must iterate over the windows in the browser - but of course
  // each window may contain multiple tabs!
  var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
  var en = windowManager.getEnumerator(null, false);
  while (en.hasMoreElements()) {
    var w = en.getNext();
    for (var i = 0; i < w.frames.length; i++) {
      // This expression filters out the frames that aren't browser tabs.
      // I'm sure there's a better way to detect this, but this would require meaningful
      // documentation in Firefox! qqDPS
      if ((w.frames[i] + "").indexOf("ChromeWindow") == -1) {
        var frame = w.frames[i];
        // Don't attach to the recording window, lest confusion reign.
        if (frame == window) {
          continue;
        }
        // Prevent multiple attached searchers unless force is true.
        if (frame._selenium_builder_hasSearcher && !force) {
          continue;
        }
        frame._selenium_builder_hasSearcher = true;
        
        searchers.push(new builder.VerifyExplorer(
          frame,
          script.seleniumVersion,
          // This function is called when the user selects a new element.
          function(locator) {
            var originalStep = builder.getScript().getStepWithID(stepID);
            originalStep[originalStep.getParamNames()[pIndex]] = locator;
            // Don't immediately stop searchers: this would cause the listener that prevents the
            // click from actually activating the selected element to be detached prematurely.
            setTimeout(stopSearchers, 1);
            window.bridge.focusRecorderWindow();
            builder.stepdisplay.updateStep(stepID);
            builder.suite.setCurrentScriptSaveRequired(true);
            // Update the edit-param view.
            jQuery('#' + stepID + '-p' + pIndex + '-edit-div').remove();
            jQuery('#' + stepID + '-p' + pIndex).show();
            editParam(stepID, pIndex);
          },
          /* justReturnLocator */ true
        ));
      }
    }
  }
}


function updateTypeDivs(stepID, newType) {
  var script = builder.getScript();
  if (newType.getNegatable()) {
    jQuery('#' + stepID + '-edit-negate').show();
    jQuery('#' + stepID + '-edit-negate-label').show();
  } else {
    jQuery('#' + stepID + '-edit-negate').hide();
    jQuery('#' + stepID + '-edit-negate-label').hide();
  }
  jQuery('#' + stepID + '-type-info').html(getTypeInfo(newType));
  var cD = jQuery('#' + stepID + '-edit-cat-list');
  var tD = jQuery('#' + stepID + '-edit-type-list');
  //cD.attr('__sb-stepType', newType);
  cD[0].__sb_stepType = newType;
  cD.html('');
  tD.html('');
  for (var i = 0; i < script.seleniumVersion.categories.length; i++) {
    var inCat = false;
    for (var j = 0; j < script.seleniumVersion.categories[i][1].length; j++) {
      if (script.seleniumVersion.categories[i][1][j] == newType) {
        inCat = true;
      }
    }
    if (inCat) {
      cD.append(newNode('li', newNode(
        'span',
        script.seleniumVersion.categories[i][0],
        {
          class: 'selected-cat'
        }
      )));
      for (var j = 0; j < script.seleniumVersion.categories[i][1].length; j++) {
        if (script.seleniumVersion.categories[i][1][j] == newType) {
          tD.append(newNode('li', newNode(
            'span',
            builder.translate.translateStepName(script.seleniumVersion.categories[i][1][j].getName()),
            {
              class: 'selected-type'
            }
          )));
        } else {
          tD.append(newNode('li', newNode(
            'a',
            builder.translate.translateStepName(script.seleniumVersion.categories[i][1][j].getName()),
            {
              class: 'not-selected-type',
              click: mkUpdate(stepID, script.seleniumVersion.categories[i][1][j])
            }
          )));
        }
      }
    } else {
      cD.append(newNode('li', newNode(
        'a',
        script.seleniumVersion.categories[i][0],
        {
          class: 'not-selected-cat',
          click: mkUpdate(stepID, script.seleniumVersion.categories[i][1][0])
        }
      )));
    }
  }
}

function mkUpdate(stepID, newType) {
  return function() { updateTypeDivs(stepID, newType); };
}

function getTypeInfo(type) {
  var script = builder.getScript();
  var paramInfo = "";
  var longParamInfo = newNode('ul', {class: 'type-info-longparam'});
  var pNames = type.getParamNames();
  for (var i = 0; i < pNames.length; i++) {
    paramInfo += pNames[i];
    if (i != pNames.length - 1) {
      paramInfo += ", ";
    }
    var doc = builder.translate.translateParamDoc(script.seleniumVersion.shortName, type.getName(), pNames[i], script.seleniumVersion.docs[type.getName()].params[pNames[i]]);
    jQuery(longParamInfo).append(newNode('li',
      newNode('b', builder.translate.translateParamName(pNames[i], type.getName())), ": " + doc));
  }
  if (pNames.length > 0) { paramInfo = " (" + paramInfo + ")"; }
    
  var body = newNode('div', {class: 'type-info-body'});
  var doc = builder.translate.translateStepDoc(script.seleniumVersion.shortName, type.getName(), script.seleniumVersion.docs[type.getName()].description);
  jQuery(body).html(doc);
  jQuery(body).append(_t('param_expr_info'));
  
  return newNode(
    'div',
    { class: 'type-info' },
    newNode('div', {class: 'type-info-head'}, builder.translate.translateStepName(type.getName()) + paramInfo),
    longParamInfo,
    body
  );
}

function editType(stepID) {
  var step = builder.getScript().getStepWithID(stepID);
  
  var catL = newNode(
    'ul',
    {
      id: stepID + '-edit-cat-list',
      class: 'cat-list'
    }
  );
  var typeL = newNode(
    'ul',
    {
      id: stepID + '-edit-type-list',
      class: 'type-list'
    }
  );
  
  var editDiv = newNode(
    'div',
    {
      id: stepID + '-edit-div',
      style: 'margin-bottom: 5px;'
    },
    newNode('table', { class: 'cat-table', cellpadding: '0', cellspacing: '0' }, newNode('tr',
      newNode('td', catL),
      newNode('td', typeL),
      newNode('td', { id: stepID + '-type-info' })
    )),
    newNode(
      'input',
      {
        id: stepID + '-edit-negate',
        type: 'checkbox',
        style: 'display: none;'
      }
    ),
    newNode(
      'span',
      " " + _t('negate_assertion_or_verification'),
      {
        id: stepID + '-edit-negate-label',
        style: 'display: none;'
      }
    ),
    newNode('p'),
    newNode('a', _t('ok'), {
      class: 'button',
      click: function (e) {
        var type = jQuery('#' + stepID + '-edit-cat-list')[0].__sb_stepType;
        if (type) {
          step.changeType(type);
          step.negated = step.type.getNegatable() && !!(jQuery('#' + stepID + '-edit-negate').attr('checked'));
        }
        jQuery('#' + stepID + '-edit-div').remove();
        jQuery('#' + stepID + '-type').show();
        builder.stepdisplay.updateStep(stepID);
        builder.suite.setCurrentScriptSaveRequired(true);
      }
    })
  );
  
  jQuery('#' + stepID + '-type').after(editDiv);
  if (step.negated) {
    jQuery('#' + stepID + '-edit-negate').attr('checked', 'checked');
  }
  jQuery('#' + stepID + '-type').hide();
  updateTypeDivs(stepID, step.type);
}

function editParam(stepID, pIndex) {
  var script = builder.getScript();
  var step = script.getStepWithID(stepID);
  var pName = step.getParamNames()[pIndex];
  if (step.type.getParamType(pName) == "locator") {
    var tdd_id = stepID + '-p' + pIndex + '-locator-type-chooser';
    var typeDropDown = newNode(
      'select',
      {
        id: tdd_id
      }
    );
    
    function okf() {
      builder.locator.deHighlight(function() {});
      var locMethodName = jQuery('#' + tdd_id).val();
      var locMethod = builder.locator.methodForName(script.seleniumVersion, locMethodName);
      if (locMethod) {
        step[pName].preferredMethod = locMethod;
        step[pName].preferredAlternative = jQuery('#' + stepID + '-p' + pIndex + '-edit-input').data('alt') || 0;
        if (!step[pName].values[step[pName].preferredMethod] || step[pName].values[step[pName].preferredMethod].length == 0)
        {
          step[pName].preferredAlternative = 0;
          step[pName].values[locMethod] = [deesc(jQuery('#' + stepID + '-p' + pIndex + '-edit-input').val())];
        } else {
          if (step[pName].preferredAlternative >= step[pName].values[step[pName].preferredMethod].length) {
            step[pName].preferredAlternative = 0;
          }
          step[pName].values[locMethod][step[pName].preferredAlternative] = deesc(jQuery('#' + stepID + '-p' + pIndex + '-edit-input').val());
        }
      }
      jQuery('#' + stepID + '-p' + pIndex + '-edit-div').remove();
      jQuery('#' + stepID + '-p' + pIndex).show();
      builder.stepdisplay.updateStep(stepID);
      builder.suite.setCurrentScriptSaveRequired(true);
    }
    
    var editDiv = newNode(
      'div',
      {
        id: stepID + '-p' + pIndex + '-edit-div'
      },
      typeDropDown,
      ": ",
      newNode('input', {id: stepID + '-p' + pIndex + '-edit-input', type:'text', value: esc(step[pName].getValue())}),
      newNode('a', _t('ok'), {
        id: stepID + '-p' + pIndex + '-OK',
        class: 'button',
        click: function (e) { okf(); }
      }),
      newNode('a', _t('find'), {
        id: stepID + '-p' + pIndex + '-find',
        class: 'button',
        click: function (e) {
          var locMethodName = jQuery('#' + tdd_id).val();
          var locMethod = builder.locator.methodForName(script.seleniumVersion, locMethodName);
          if (locMethod) {
            builder.locator.highlight(locMethod, deesc(jQuery('#' + stepID + '-p' + pIndex + '-edit-input').val()));
          }
        }
      }),
      newNode('div',
        newNode('a', _t('find_a_different_target'), {
          click: function() { toggleSearchers(stepID, pIndex); }
        })
      )
    );
    
    for (var k in builder.locator.methods) {
      var lMethod = builder.locator.methods[k];
      if (!lMethod[script.seleniumVersion]) { continue; }
      if (lMethod == step[pName].preferredMethod) {
        jQuery(typeDropDown).append(newNode(
          'option', lMethod[script.seleniumVersion], { selected: "true" }
        ));
      } else {
        jQuery(typeDropDown).append(newNode(
          'option', lMethod[script.seleniumVersion]
        ));
      }
    }
        
    var alternativesList = newNode(
      'ul',
      {
        id: stepID + '-p' + pIndex + '-alternatives-list',
        class: 'b-alternatives'
      }
    );
    var alternativesDiv = newNode(
      'div',
      {
        id: stepID + '-p' + pIndex + '-alternatives-div'
      },
      newNode('p', _t('suggested_locator_alternatives')),
      alternativesList
    );
    
    var hasAlts = false;
    for (var altMethod in step[pName].values) {
      if (!step[pName].values[altMethod].length) { continue; }
      if (altMethod != step[pName].preferredMethod || step[pName].values[altMethod].length > 1) {
        hasAlts = true;
        for (var i = 0; i < step[pName].values[altMethod].length; i++) {
          jQuery(alternativesList).append(createAltItem(step, pIndex, pName, builder.locator.methods[altMethod][script.seleniumVersion], step[pName].values[altMethod][i], i));
        }
      }
    }
    
    if (hasAlts) {
      jQuery(editDiv).append(alternativesDiv);
    }
    
    jQuery('#' + stepID + '-p' + pIndex).after(editDiv);
    jQuery('#' + stepID + '-p' + pIndex).hide();
    jQuery('#' + stepID + '-p' + pIndex + '-edit-input').focus().select().keypress(function (e) {
      if (e.which == 13) {
        okf();
      }
    });
  } else {
    function okf() {
      step[pName] = deesc(jQuery('#' + stepID + '-p' + pIndex + '-edit-input').val());
      jQuery('#' + stepID + '-p' + pIndex + '-edit-div').remove();
      jQuery('#' + stepID + '-p' + pIndex).show();
      builder.stepdisplay.updateStep(stepID);
      builder.suite.setCurrentScriptSaveRequired(true);
    }
    
    var editDiv = newNode(
      'div',
      {
        id: stepID + '-p' + pIndex + '-edit-div'
      },
      newNode('input', {id: stepID + '-p' + pIndex + '-edit-input', type:'text', value: esc(step[pName])}),
      newNode('a', "OK", {
        id: stepID + '-p' + pIndex + '-OK',
        class: 'button',
        click: function (e) { okf(); }
      })
    );
    
    jQuery('#' + stepID + '-p' + pIndex).after(editDiv);
    jQuery('#' + stepID + '-p' + pIndex).hide();
    jQuery('#' + stepID + '-p' + pIndex + '-edit-input').focus().select().keypress(function (e) {
      if (e.which == 13) {
        okf();
      }
    });
  }
}

/** Creates list item for alternative locator. */
function createAltItem(step, pIndex, pName, altName, altValue, altIndex) {
  return newNode(
    'li',
    newNode(
      'a',
      altName + ": " + esc(altValue),
      {
        click: function(e) {
          jQuery('#' + step.id + '-p' + pIndex + '-locator-type-chooser').val(altName);
          jQuery('#' + step.id + '-p' + pIndex + '-edit-input').val(esc(altValue));
          jQuery('#' + step.id + '-p' + pIndex + '-edit-input').data('alt', altIndex);
        }
      }
    )
  );
}

var appearingID = -1;
var lastExitOn = {};
var enterNext = -1;

/** Adds the given step to the GUI. */
function addStep(step) {
  var script = builder.getScript();
  jQuery("#steps").append(
    // List of options that materialises on rollover.
    newNode('div', {id: step.id, class: 'b-step'},
      newNode('span', {id: step.id + '-b-tasks', class: 'b-tasks'},
        newNode('a', _t('step_edit_type'), {
          id: step.id + 'edit',
          class: 'b-task',
          click: function() { editType(step.id); return false; }
        }),
        newNode('a', newNode('span', 'p0', {id: step.id + 'edit-p0-name'}), {
          id: step.id + 'edit-p0',
          class: 'b-task',
          click: function() { editParam(step.id, 0); }
        }),
        newNode('a', newNode('span', 'p1', {id: step.id + 'edit-p1-name'}), {
          id: step.id + 'edit-p1',
          class: 'b-task',
          click: function() { editParam(step.id, 1); }
        }),
        newNode('a', newNode('span', 'p2', {id: step.id + 'edit-p2-name'}), {
          id: step.id + 'edit-p2',
          class: 'b-task',
          click: function() { editParam(step.id, 2); }
        }),
        newNode('a', _t('step_delete'), {
          id: step.id + 'delete',
          class: 'b-task',
          click: function() { deleteStep(step.id); }
        }),
        newNode('a', _t('step_new_above'), {
          id: step.id + 'insert-above',
          class: 'b-task',
          click: function() { addNewStepBefore(step.id); }
        }),
        newNode('a', _t('step_new_below'), {
          id: step.id + 'insert-below',
          class: 'b-task',
          click: function() { addNewStepAfter(step.id); }
        }),
        newNode('a', _t('step_copy'), {
          id: step.id + 'copy',
          class: 'b-task',
          click: function() { copyStep(step.id); }
        }),
        newNode('a', _t('step_cut'), {
          id: step.id + 'cut',
          class: 'b-task',
          click: function() { cutStep(step.id); }
        }),
        newNode('a', _t('step_paste'), {
          id: step.id + 'paste',
          class: 'b-task',
          click: function() { pasteStep(step.id); }
        }),
        newNode('a', _t('step_run'), {
          id: step.id + 'run-step',
          class: 'b-task',
          click: function() { script.seleniumVersion.playback.continueTestBetween(step.id, step.id, builder.views.script.onEndLocalPlayback, builder.views.script.onStartLocalPlayback, builder.stepdisplay.updateStepPlaybackState, builder.views.script.onPauseLocalPlayback); }
        }),
        newNode('a', _t('step_run_from_here'), {
          id: step.id + 'run-from-here',
          class: 'b-task',
          click: function() { script.seleniumVersion.playback.continueTestBetween(step.id, null, builder.views.script.onEndLocalPlayback, builder.views.script.onStartLocalPlayback, builder.stepdisplay.updateStepPlaybackState, builder.views.script.onPauseLocalPlayback); }
        }),
        newNode('a', _t('step_run_to_here'), {
          id: step.id + 'run-to-here',
          class: 'b-task',
          click: function() {
            script.seleniumVersion.playback.continueTestBetween(null, step.id, builder.views.script.onEndLocalPlayback, builder.views.script.onStartLocalPlayback, builder.stepdisplay.updateStepPlaybackState, builder.views.script.onPauseLocalPlayback);
          }
        }),
        newNode('a', step.breakpoint ? _t('step_remove_breakpoint') : _t('step_add_breakpoint'), {
          id: step.id + 'toggle-breakpoint',
          class: 'b-task',
          click: function() { toggleBreakpoint(step.id); }
        })
      ),
      newNode('div', {class: 'b-step-content', id: step.id + '-content'},
        newNode('div', {class: 'b-step-container', id: step.id + '-container'},
          // The breakpoint marker
          newNode('span', {'id': step.id + '-breakpoint', 'class': 'b-step-breakpoint' + (builder.breakpointsEnabled ? '' : 'b-step-breakpoint-disabled'), 'style': step.breakpoint ? '' : 'display: none;'}, ' '),
        
          // The step number
          newNode('span', {class:'b-step-number'}),
      
          // The type
          newNode('a', step.type, {
            id: step.id + '-type',
            class:'b-method',
            click: function() { editType(step.id); }
          }),
      
          // The first parameter
          newNode('span', {id: step.id + '-p0'},
            newNode('a', {
              id: step.id + '-p0-name',
              class:'b-param-type',
              click: function() { editParam(step.id, 0); }
            }),
            newNode('a', '', {
              id: step.id + '-p0-value',
              class:'b-param',
              click: function() { editParam(step.id, 0); }
            })
          ),
          
          // The second parameter
          newNode('span', {id: step.id + '-p1'},
            newNode('a', {
              id: step.id + '-p1-name',
              class:'b-param-type',
              click: function() { editParam(step.id, 1); }
            }),
            newNode('a', '', {
              id: step.id + '-p1-value',
              class:'b-param',
              click: function() { editParam(step.id, 1); }
            })
          ),
          
          // The third parameter
          newNode('span', {id: step.id + '-p2'},
            newNode('a', {
              id: step.id + '-p2-name',
              class:'b-param-type',
              click: function() { editParam(step.id, 2); }
            }),
            newNode('a', '', {
              id: step.id + '-p2-value',
              class:'b-param',
              click: function() { editParam(step.id, 2); }
            })
          ),
      
          // Message display
          newNode('div', {'class': "b-step-note", 'id': step.id + '-note', style:'display: none'}), 
          newNode('div', {style:"width: 100px; height: 3px; background: #333333; display: none", id: step.id + "-progress-done"}),
          newNode('div', {style:"width: 0px; height: 3px; background: #bbbbbb; position: relative; top: -3px; left: 100px; display: none", id: step.id + "-progress-notdone"}),
          newNode('div', {class:"b-step-message", id: step.id + "-message", style:'display: none'}),
          newNode('div', {class:"b-step-error", id: step.id + "-error", style:'display: none'}),
          newNode('div', _t('playback_not_supported_warning'), {class:"b-step-error", id: step.id + "-unplayable", style:'display: none'})
        )
      )
    )
  );
  
  jQuery('#' + step.id).mouseenter(function(e) {
    if (appearingID == -1) {
      jQuery('#' + step.id + '-b-tasks').addClass('b-tasks-appear');
      jQuery('#' + step.id + '-type').addClass('b-tasks-appear-method');
      appearingID = step.id;
    } else {
      enterNext = step.id;
    }
    if (appearingID == step.id) {
      lastExitOn[step.id] = new Date().getTime();
    }
  });
  jQuery('#' + step.id).mouseleave(function(e) {
    var exitTime = new Date().getTime();
    setTimeout(function() {
      if (lastExitOn[step.id] == exitTime) {
        jQuery('#' + step.id + '-b-tasks').removeClass('b-tasks-appear');
        jQuery('#' + step.id + '-type').removeClass('b-tasks-appear-method');
        if (appearingID == step.id) {
          appearingID = -1;
          if (enterNext != -1) {
            jQuery('#' + enterNext + '-b-tasks').addClass('b-tasks-appear');
            jQuery('#' + enterNext + '-type').addClass('b-tasks-appear-method');
            appearingID = enterNext;
            enterNext = -1;
            lastExitOn[step.id] = new Date().getTime();
          }
        }
      }
    }, 150);
    lastExitOn[step.id] = exitTime;
    if (enterNext == step.id) {
      enterNext = -1;
    }
  });
  
  // Prevent tasks menu from going off the bottom of the list.
  jQuery('#' + step.id).mouseenter(function(evt) {
    var stepEl = jQuery('#' + step.id);
    var menu = jQuery('#' + step.id + '-b-tasks');
    if (stepEl.position().top + menu.height() > jQuery(window).height() + jQuery(window).scrollTop()) {
      menu.css("top", jQuery(window).height() + jQuery(window).scrollTop() - stepEl.position().top - menu.height() - 15);
    } else {
      menu.css("top", 2);
    }
  });

  builder.stepdisplay.updateStep(step.id);
  builder.suite.setCurrentScriptSaveRequired(true);
}