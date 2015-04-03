/** Table of available step types. */
builder.gui.stepstable = {};

builder.gui.stepstable.makeTables = function() {
  return newNode('div', {},
    builder.gui.stepstable.makeTable(false),
    builder.gui.stepstable.makeTable(true)
  );
};

/**
 * Generates steps table HTML.
 * @param showOrphanedSel1Steps Whether to show steps only available in Selenium 1.
*/
builder.gui.stepstable.makeTable = function(showOrphanedSel1Steps) {
  var table = newNode('table', {
    'class': 'stepstable',
    'cellpadding': '0',
    'cellspacing': '0',
    'id': showOrphanedSel1Steps? "stepstable-extended" : "stepstable",
    'style': showOrphanedSel1Steps ? "display: none" : ""
  });
  
  // Table of steps that have both Selenium 1 and 2 versions.
  var sel2Names = {}, sel2Type = null, sel2Name ;
  var i = 0, j = 0, row, head;
  for (var sel1Name in builder.selenium1.stepTypes) {
    sel2Name = builder.versionconverter.sel1ToSel2Steps[sel1Name] || ""; 
    if (!sel2Name && !showOrphanedSel1Steps) { continue; }
    
    // Column headers
    if (i++ % 20 === 0) {
        head = newNode('tr', {'class': 'labels'},
        newNode('td', _t('step_name')),
        newNode('td', _t('sel_1_translation')),
        newNode('td', _t('negatable')),
        newNode('td', _t('local_playback_available'))
      );
      for (j = 0; j < builder.selenium2.io.formats.length; j++) {
        jQuery(head).append(newNode('td', builder.selenium2.io.formats[j].name));
      }
      jQuery(table).append(head);
    }
    
    sel2Names[sel2Name] = true;
    sel2Type = sel2Name ? builder.selenium2.stepTypes[sel2Name] : null;
    row = newNode('tr', {'class': "r" + (i % 2)},
      // Selenium 2 step name, if available
      newNode('td', {}, sel2Name),
      // Selenium 1 step name, if available
      newNode('td', {}, sel1Name),
      // Negatable
      newNode('td', {}, sel2Name ? (sel2Type.getNegatable() ? newNode('span', {'class':'yes'}, _t("yes")) : newNode('span', {'class':'no'}, _t("no"))) : ""),
      // Can play back locally
      newNode('td', {}, sel2Name ? (builder.selenium2.playback.canPlayback(sel2Type) ? newNode('span', {'class':'yes'}, _t("yes")) : newNode('span', {'class':'no'}, _t("no"))) : "")
    );
    for (j = 0; j < builder.selenium2.io.formats.length; j++) {
      jQuery(row).append(newNode('td', {}, sel2Name ? (builder.selenium2.io.formats[j].canExport(sel2Type) ? newNode('span', {'class':'yes'}, _t("yes")) : newNode('span', {'class':'no'}, _t("no"))) : ""));   
    }
    jQuery(table).append(row);
  }
  
  // Table of steps that have only Selenium 2 versions.
  for (sel2Name in builder.selenium2.stepTypes) {
    if (sel2Names[sel2Name]) { continue; }
    
    // Column headers
    if (i++ % 20 === 0) {
        head = newNode('tr', {'class': 'labels'},
        newNode('td', _t('step_name')),
        newNode('td', _t('sel_1_translation')),
        newNode('td', _t('negatable')),
        newNode('td', _t('local_playback_available'))
      );
      for (j = 0; j < builder.selenium2.io.formats.length; j++) {
        jQuery(head).append(newNode('td', builder.selenium2.io.formats[j].name));
      }
      jQuery(table).append(head);
    }
    
    sel2Type = sel2Name ? builder.selenium2.stepTypes[sel2Name] : null;
    row = newNode('tr', {'class': "r" + (i % 2)},
      // Selenium 2 step name, if available
      newNode('td', {}, sel2Name),
      // No Selenium 1 step name
      newNode('td', {}, ""),
      // Negatable
      newNode('td', {}, sel2Name ? (sel2Type.getNegatable() ? newNode('span', {'class':'yes'}, _t("yes")) : newNode('span', {'class':'no'}, _t("no"))) : ""),
      // Can play back locally
      newNode('td', {}, sel2Name ? (builder.selenium2.playback.canPlayback(sel2Type) ? newNode('span', {'class':'yes'}, _t("yes")) : newNode('span', {'class':'no'}, _t("no"))) : "")
    );
    for (j = 0; j < builder.selenium2.io.formats.length; j++) {
      jQuery(row).append(newNode('td', {}, sel2Name ? (builder.selenium2.io.formats[j].canExport(sel2Type) ? newNode('span', {'class':'yes'}, _t("yes")) : newNode('span', {'class':'no'}, _t("no"))) : ""));
    }
    jQuery(table).append(row);
  }
  return table;
};

builder.gui.stepstable.show = function() {
  var win = window.open("chrome://seleniumbuilder/content/html/stepstable.html", "stepstable", "width=1000,height=700,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,copyhistory=no,resizable=yes");
  builder.gui.stepstable.booter = setInterval(function() {
    if (win.wrappedJSObject.insertContent) {
      var tables = builder.gui.stepstable.makeTables();
      win.wrappedJSObject.insertContent(tables);
      jQuery('#showorphans-text', win.wrappedJSObject.document).text(_t("show_step_type_orphans"));
      win.wrappedJSObject.document.title = _t('steps_table');
      clearInterval(builder.gui.stepstable.booter);
    }
  }, 10);
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
