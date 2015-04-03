builder.breakpointsEnabled = true;

/**
 * Defines a Script object that encapsulates a single test script.
*/
builder.Script = function(seleniumVersion) {
  this.id = builder.__idCounter;
  builder.__idCounter++;
  this.steps = [];
  this.seleniumVersion = seleniumVersion;
  this.path = null;
  this.saveRequired = false;
  this.data = {'configs':{}, 'source': 'none'};
  this.inputs = [];
  this.timeoutSeconds = 60;
};

builder.Script.prototype = {
  getStepIndexForID: function(id) {
    for (var i = 0; i < this.steps.length; i++) {
      if (this.steps[i].id == id) { return i; }
    }
    return -1;
  },
  getStepWithID: function(id) {
    var index = this.getStepIndexForID(id);
    return index == -1 ? null : this.steps[index];
  },
  getLastStep: function() {
    return this.steps.length === 0 ? null : this.steps[this.steps.length - 1];
  },
  getStepBefore: function(step) {
    var index = this.getStepIndexForID(step.id);
    if (index > 0) {
      return this.steps[index - 1];
    } else {
      return null;
    }
  },
  getStepAfter: function(step) {
    var index = this.getStepIndexForID(step.id);
    if (index < this.steps.length - 1) {
      return this.steps[index + 1];
    } else {
      return null;
    }
  },
  removeStepWithID: function(id) {
    var index = this.getStepIndexForID(id);
    if (index !== -1) {
      var step = this.steps[index];
      this.steps.splice(index, 1);
      return step;
    }
    return null;
  },
  addStep: function(step, afterID) {
    if (afterID) {
      var index = this.getStepIndexForID(afterID);
      if (index !== -1) {
        this.steps.splice(index, 0, step);
      }
    }
    this.steps.push(step);
  },
  insertStep: function(step, beforeIndex) {
    if (beforeIndex < this.steps.length) {
      this.steps.splice(beforeIndex, 0, step);
    } else {
      this.steps.push(step);
    }
  },
  moveStepToBefore: function(stepID, beforeStepID) {
    var step = this.removeStepWithID(stepID);
    this.steps.splice(this.getStepIndexForID(beforeStepID), 0, step);
  },
  moveStepToAfter: function(stepID, afterStepID) {
    var step = this.removeStepWithID(stepID);
    if (this.getLastStep().id == afterStepID) {
      this.steps.push(step);
    } else {
      this.steps.splice(this.getStepIndexForID(afterStepID) + 1, 0, step);
    }
  },
  reorderSteps: function(reorderedIDs) {
    var newSteps = [];
    for (var i = 0; i < reorderedIDs.length; i++) {
      newSteps.push(this.getStepWithID(reorderedIDs[i]));
    }
    this.steps = newSteps;
  }
};

/** Global counter for generating unique IDs for steps. */
builder.__idCounter = 1; // Start at 1 so the ID is always true.

/**
 * @param type The type of step (from builder.selenium1.stepTypes or builder.selenium2.stepTypes)
 * Further arguments used as step parameters.
 */
builder.Step = function(type) {
  this.type = type;
  this.id = builder.__idCounter;
  this.negated = false;
  this.step_name = null; // Can be null for default numbering.
  builder.__idCounter++;
  var pNames = this.type.getParamNames();
  if (pNames) {
    for (var i = 0; i < pNames.length; i++) {
      if (i + 1 < arguments.length) {
        this[pNames[i]] = arguments[i + 1];
      } else {
        this[pNames[i]] = this.type.getParamType(pNames[i]) == "locator" ? builder.locator.empty() : "";
      }
    }
  }
  this.changeType(this.type);
};

builder.stepFromJSON = function(parsedJSON, seleniumVersion) {
  if (!seleniumVersion.stepTypes[parsedJSON.type]) {
    throw new Error(_t("sel1_no_command_found") + ": " + parsedJSON.type);
  }
  var step = new builder.Step(seleniumVersion.stepTypes[parsedJSON.type]);
  step.negated = parsedJSON.negated || false;
  step.step_name = parsedJSON.step_name || null;
  var pNames = step.getParamNames();
  for (var j = 0; j < pNames.length; j++) {
    if (parsedJSON[pNames[j]]) {
      if (step.type.getParamType(pNames[j]) == "locator") {
        step[pNames[j]] = builder.selenium2.io.jsonToLoc(parsedJSON[pNames[j]]);
      } else {
        step[pNames[j]] = "" + parsedJSON[pNames[j]];
      }
    }
  }
  
  return step;
};

builder.Step.prototype = {
  getParamNames: function() {
    return this.type.getParamNames();
  },
  changeType: function(newType) {
    this.type = newType;
    var pNames = this.type.getParamNames();
    for (var i = 0; i < pNames.length; i++) {
      if (!this[pNames[i]]) {
        this[pNames[i]] = this.type.getParamType(pNames[i]) == "locator" ? builder.locator.empty() : "";
      }
    }
  },
  toJSON: function() {
    var cleanStep = { type: this.type.name };
    if (this.negated) {
      cleanStep.negated = true;
    }
    if (this.step_name) {
      cleanStep.step_name = this.step_name;
    }
    var pNames = this.getParamNames();
    for (var j = 0; j < pNames.length; j++) {
      if (this.type.getParamType(pNames[j]) == "locator") {
        cleanStep[pNames[j]] = builder.selenium2.io.locToJSON(this[pNames[j]]);
      } else {
        cleanStep[pNames[j]] = this[pNames[j]];
      }
    }
    
    return cleanStep;
  }
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
