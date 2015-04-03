var m = {};
builder.translate.addLocale({'name':'nl', 'title': "Nederlands", 'mapping': m});

// General
m.ok = "OK";
m.cancel = "annuleren";

// Lang selection
m.select_locale = "Taal kiezen";
m.new_locale_after_restart = "Taal wordt na het herstarten van builder gewisseld.";

m.open_script_or_suite = "Skript of suite openen";
m.view_command_table = "Tabel beschikbare stap-types voor Selenium 1 & 2";
m.manage_plugins = "Plugins beheren";
m.start_recording_at = "Opname beginnen op";
m.cookie_warning = "Let op: Alle Cookies voor dit domain worden bij het starten van der opname gewist.";

m.steps_table = "Tabel met stap-typen";
m.step_name = "Naam";
m.sel_1_translation = "Selenium 1 vertaling";
m.negatable = "Omkeerbaar";
m.local_playback_available = "Lokaal afspeelbaar";
m.yes = "ja";
m.no = "nee";
m.show_step_type_orphans = "Selenium 1 stap-typen welke geen corresproderend Selenium 2 type hebben, tonen.";

m.plugins_title = "Plugins";
m.plugins_back = "Terug";
m.plugins_refresh = "Opnieuw laden";
m.plugins_reboot = "Herstart";
m.plugins_loading = "Laad plugins...";
m.plugins_downloading = "Laad plugin...";
m.plugin_disabled = "Gedeactiveerd";
m.plugin_installed = "Geinstalleerd";
m.plugin_installed_to_enable = "Geinstalleerd, na herstarten geactiveerd";
m.plugin_installed_to_disable = "Geinstalleerd, na herstarten gedeactiveerd";
m.plugin_not_installed = "Niet geinstalleerd";
m.plugin_to_install = "Na herstart geinstalleerd";
m.plugin_to_uninstall = "Na herstart gedeinstalleerd";
m.plugin_to_update = "Geinstalleerd, na herstart geactualiseerd";
m.plugin_update_available = ", nieuwe versie {0} beschikbaar";
m.plugin_install = "Installeren";
m.plugin_install_and_reboot = "Installeren en herstarten";
m.plugin_cancel_install = "Installeren afbreken";
m.plugin_uninstall = "Deinstalleren";
m.plugin_uninstall_and_reboot = "Deinstalleren en herstarten";
m.plugin_cancel_uninstall = "Deinstallatie abfbreken";
m.plugin_update = "Updaten";
m.plugin_update_and_reboot = "Updaten en herstarten";
m.plugin_cancel_update = "Update afbreken";
m.plugin_enable = "Activeren";
m.plugin_enable_and_reboot = "Activeren en herstarten";
m.plugin_disable = "Deactiveren";
m.plugin_disable_and_reboot = "Deactiveren en herstarten";
m.plugin_list_too_new = "Deze versie van builder is te oud om de lijst met plugins te kunnen oproepen.";
m.unable_to_fetch_plugins = "Plugins kunnen niet worden opgeroepen";
m.plugin_load_timed_out = "Geen antwoord van de server.";
m.plugin_url_not_found = "Kon niet gevonden worden";
m.plugin_missing_dir = "De plugin-map {0} ontbreekt.";
m.plugin_not_a_dir = "De locatie van de plugin, {0}, is geen map, maar een document.";
m.plugin_header_missing = "Het header-ducument van de plugin {0} ontbreekt.";
m.plugin_header_not_file = "Het header-ducument van de plugin {0} is geen document.";
m.plugin_header_file_corrupted = "Het header-document {0} is verknoeid, heeft een syntax fout, of is geen JSON-document: {1}";
m.plugin_header_file_no_version = "Het header-document {0} heeft geen versieenthält keine Versions-Information.";
m.plugin_builder_too_old = "Deze versie van builder is voor deze plugin te oud. Update naar de nieuwste versie.";
m.plugin_id_mismatch = "De ID in het header-document ({0}) verschilt van de verwachte ID ({1}).";
m.plugin_version_invalid = "Het versienummer van de plugin is ongelidig.";
m.plugin_cant_verify = "Plugin kon niet worden Plugin konnte nicht getest worden: {0}";
m.plugin_unable_to_install = "{0} kon niet worden genistalleerd: {1}";
m.plugin_unable_to_uninstall = "{0} kon niet gedeinstalleerd worden: {1}";
m.plugin_disabled_builder_too_old = "De plugin \"{0}\" is gedeactiveerd. Deze versie van builder is voor deze plugin te oud.\nVereiste versie: {1}\nHuidige versie: {2}\nUpdate de builder en heractiveer de plugin.";
m.plugin_disabled_builder_too_new = "De plugin \"{0}\" is gedeactiveerd. Deze versie van de plugin is voor builder te oud.\nUpdate de plugin.";
m.cant_update_builder_too_old = ", nieuwe versie {0} is niet compatibel: Builder is te oud";
m.cant_update_builder_too_new = ", nieuwe versie {0} is niet compatibel: de plugin is te oud";
m.cant_install_builder_too_old = "; kan niet geinstalleerd worden: builder is te oud";
m.cant_install_builder_too_new = "; kan niet geinstalleerd worden: de plugin is te oud";
m.updates_available = "Updates beschikbaar";
m.plugin_download_failed = "Plugin-download kon niet worden voltooid. Probeert u het opnieuw.";


// Menus
m.menu_file = "Document";
m.menu_record = "Openen";
m.menu_run = "Afspelen";
m.menu_suite = "Suite";
m.menu_save = "Opslaan";
m.menu_save_to = "Opslaan als {0}";
m.menu_save_as = "Opslaan als...";
m.menu_export = "Exporteren...";
m.menu_convert = "Versie converteren...";
m.menu_convert_to = "Naar {0} converteren";
m.menu_discard = "Script sluiten";
m.menu_run_locally = "Script in de browser afspelen";
m.menu_run_on_rc = "Script op de Selenium server afspelen";
m.menu_run_suite_locally = "Suite in de browser afspelen";
m.menu_run_suite_on_rc = "Suite op Selenium server afspelen";
m.menu_suite_remove_script = "Script uit suite verwijderen";
m.menu_add_script_from_file = "Script Skript toevoegen";
m.menu_record_new_script = "Nieuw script opnemen";
m.menu_discard_suite = "Suite sluiten";
m.menu_save_suite = "Suite opslaan";
m.menu_save_suite_as = "Suite opslaan als...";
m.menu_save_suite_to = "Suite opslaan als {0}";
m.menu_export_suite = "Suite exporteren";
m.lose_changes_warning = "Als u doorgaat, verliest u al uw laatste aanpassingen.";
m.menu_debug = "Debug";
m.menu_disable_breakpoints = "Breakpoints deactiveren";
m.menu_enable_breakpoints = "Breakpoints activeren";
m.menu_clear_breakpoints = "Alle Breakpoints verwijderen";
m.clear_breakpoints_confirm = "Wilt u echt alle Breakpoints in dit script verwijderen?";
m.menu_playback_variables = "Variablen...";
m.menu_share_state_across_suite = "Scripts in een suite behouden cookies en variabelen";
m.menu_dont_share_state_across_suite = "√ Scripts in een suite behouden cookies en variabelen";

// Variables
m.variables = "Variablen";

// Script
m.untitled_script = "Zonder titel";
m.suite_has_unsaved_changes = "Deze versie van de suite is nog niet opgeslagen.";
m.suite_cannot_save_unsaved_scripts = "Suite kan niet opgeslagen worden: Alle scripts moeten in het zelfde formaat opgeslagen zijn.";
m.cannot_save_suite_due_to_mixed_versions = "Suite kan niet opgeslagen worden omdat niet alle scripts dezelfde Selenium versie hebben.";
m.stop_playback = "Afspelen stoppen";
m.continue_playback = "Doorgaan";
m.stopping = "Stop...";
m.clear_results = "Resultaat ongedaan maken";
m.connecting = "Verbind...";
m.record_verification = "Verificatie opnemen";
m.stop_recording = "Opname beindigen";
m.record_mouseovers = "Mouseovers opnemen";

// Convert dialog
m.script_conversion = "Converteren";
m.the_following_steps_cant_be_converted = "De volgende stappen konden niet geconverteerd worden";

// Export dialog
m.choose_export_format = "Exportformaat kiezen";
m.sel2_unsaveable_steps = "Dit script bevat stappen die niet naar Selenium 2 geconverteerd kunnen worden";
m.save = "Opslaan";
m.unsupported_steps = "Niet ondersteund";
m.export_as_X_to_Y = "Als {0} naar {1} exporteren";
m.save_as_X = "Als {0} opslaan";

// RC dialog
m.run_script = "Afspelen";
m.selenium_rc_settings = "Selenium RC instellingen";
m.rc_server_host_port = "Host:Port van de RC-Server";
m.rc_browser_string = "Browser-string";
m.rc_browser_version = "Browser-versie";
m.rc_platform = "Platform";

// Record dialog
m.start_recording_new_script_at = "Nieuw script opnemen op";

// Run all dialog
m.view_run_result = "Resultaat tonen";
m.running_scripts = "Scripts worden afgespeeld...";
m.stop = "Stop";
m.close = "Sluiten";
m.done_exclamation = "Beindigt!";

// Suite
m.cant_save_suite_must_save_as_html = "Suite kan niet opgeslagen worden. Sla eerst alle scripts op als HTML.";

// Gui
m.unsaved_changes_warning = "Alle niet opgeslagen verandering gaan erbij verloren.";

// UI
m.unable_to_read_file = "Document kan niet gelezen worden.";
m.select_a_file = "Document kiezen";

// Record
m.record_invalid_url = "De URL is ongeldig en kan niet geladen worden.";

// Sel 1
m.sel1_could_not_open_suite_script = "Suite kon niet geopend worden, omdat script {0} niet geopend kon worden.";
m.sel1_couldnt_save_suite = "Suite kon niet opgeslagen worden:\n{0}";
m.sel1_couldnt_export_script = "Script kon niet geopend worden:\n{0}";
m.sel1_playback_failed = "Mislukt";
m.sel1_unknown_failure_reason = "Onbekende fout";
m.sel1_test_stopped = "Afspelen afgebroken";

// Sel 2
m.save_as = "Opslaan als...";
m.sel2_cant_export_step_type = "Stap-type \"{0}\" kan niet geexporteerd worden.";
m.sel2_variable_not_set = "Variabel niet gedefinieerd: {0}.";
m.sel2_text_not_present = "Text \"{0}\" niet beschikbaar.";
m.sel2_body_text_does_not_match = "Body-tekst verschilt van \"{0}\".";
m.sel2_element_not_found = "Element niet gevonden.";
m.sel2_source_does_not_match = "Brontext komt niet overeen.";
m.sel2_element_text_does_not_match = "Element-tekst \"{0}\" komt niet overeen \"{1}\".";
m.sel2_url_does_not_match = "URL \"{0}\" komt niet overeen \"{1}\".";
m.sel2_title_does_not_match = "Titel \"{0}\" komt niet overeen \"{1}\".";
m.sel2_element_not_selected = "Element is niet geselecteerd.";
m.sel2_element_value_doesnt_match = "Element-waarde \"{0}\" komt niet overeen \"{1}\".";
m.sel2_attribute_value_doesnt_match = "\"{0}\"-Attribuut-waarde \"{1}\" komt niet overeen \"{2}\".";
m.sel2_cookie_value_doesnt_match = "\"{0}\"-cookie-waarde \"{1}\" komt niet overeen \"{2}\".";
m.sel2_no_cookie_found = "Geen cookie \"{0}\" gevonden.";
m.sel2_step_not_implemented_for_playback = "{0} is niet om af te spelen geimplementeerd.";
m.sel2_alert_text_does_not_match = "Dialoog-tekst \"{0}\" komt niet overeen \"{1}\".";
m.sel2_no_alert_present = "Geen dialoog beschikbaar.";
m.sel2_is = "is";
m.sel2_true = "waar";
m.sel2_false = "niet waar";
m.sel2_untitled_run = "Zonder titel";
m.sel2_server_error = "Server-fout";
m.sel2_must_playback_in_foreground = "Let op: Bij het afspelen moet het afspeel-venster in de voorgrond blijven.";
m.sel2_eval_failed = "Script-uitvoering mislukt.";
m.sel2_eval_false = "Script resultaat \"{0}\" komt niet met \"{1}\" overeen.";

// Step display
m.param_expr_info = "<br>Parameter-uitdrukking met de vorm  <i>${naam van de variable}</i> worden door de inhoud van deze variable vervangen.";
m.negate_assertion_or_verification = "Benodiging/verificatie omkeren";
m.find_a_different_target = "Anderes Zielelement aussuchen";
m.suggested_locator_alternatives = "Andere locators:";
m.step_edit_type = "Type veranderen";
m.step_delete = "Stap wissen";
m.step_new_above = "nieuwe stap erboven";
m.step_new_below = "nieuwe stap eronder";
m.step_copy = "kopieren";
m.step_cut = "knippen";
m.step_paste = "plakken";
m.step_record_before = "ervoor opnemen";
m.step_record_after = "erna opnemen";
m.step_run = "Stap afspelen";
m.step_run_from_here = "vanaf hier afspelen";
m.step_run_to_here = "tot hier afspelen";
m.step_add_breakpoint = "+ breakpoint";
m.step_remove_breakpoint = "- breakpoint";
m.playback_not_supported_warning = "Let op: dit stap-type kan niet worden afgespeeld.";
m.edit_p = "{0} veranderen";
m.not = "niet";
m.find = "Vinden";

// IO
m.script_is_empty = "Script is leeg.";
m.suite_is_empty = "Suite is leeg.";
m.suite = "Suite";
m.could_not_open_suite = "Suite kon niet geopend worden.";
m.sel1_no_table_tag = "Geen <table> in het suite-document";
m.sel1_no_command_found = "Onbekend commando in het testscript";

// Selenium 2 Categories
m.navigation_sel2_cat = "Navigeren";
m.input_sel2_cat = "Invoer";
m.misc_sel2_cat = "Andere";
m.assertion_sel2_cat = "Controleren";
m.verify_sel2_cat = "Verificatie";
m.wait_sel2_cat = "Wachten";
m.store_sel2_cat = "Opslaan";

// Selenium 2 step types
m.step_get = "ga naar";
m.step_goBack = "terug";
m.step_goForward = "voorwaars";
m.step_clickElement = "Element aanklikken";
m.step_setElementText = "Element-tekst vastleggen";
m.step_sendKeysToElement = "Element-tekst invoeren";
m.step_clickElementWithOffset = "Element met verschuiving aanklikken";
m.step_doubleClickElement = "Element dubbelklikken";
m.step_mouseOverElement = "Muis op element bewegen";
m.step_dragToAndDropElement = "drag&drop element";
m.step_clickAndHoldElement = "Element zonder loslaten aanklikken";
m.step_releaseElement = "Element loslaten";
m.step_setElementSelected = "Element selecteren";
m.step_clearSelections = "Alles deselecteren";
m.step_setElementNotSelected = "Element deselecteren";
m.step_submitElement = "Formulier versturen";
m.step_close = "Sluiten";
m.step_refresh = "opnieuw laden";
m.step_assertTextPresent = "Text beschikbaar? (nodig)";
m.step_verifyTextPresent = "Text beschikbaar? (verificatie)";
m.step_waitForTextPresent = "wachten tot tekst beschikbaar is";
m.step_storeTextPresent = "Text-aanwezigheid opslaan";
m.step_assertBodyText = "Body-tekst controleren (nodig)";
m.step_verifyBodyText = "Body-Text controleren (verificatie)";
m.step_waitForBodyText = "op Body-tekst wachten";
m.step_storeBodyText = "Body-tekst opslaan";
m.step_assertElementPresent = "Element beschikbaar? (nodig)";
m.step_verifyElementPresent = "Element beschikbaar? (verificatie)";
m.step_waitForElementPresent = "wacht op element-aanwezigheid";
m.step_storeElementPresent = "Element-aanwezigheid opslaan";
m.step_assertPageSource = "Brontext controleren (nodig)";
m.step_verifyPageSource = "Brontext controleren (verificatie)";
m.step_waitForPageSource = "op brontext wachten";
m.step_storePageSource = "Brontext opslaan";
m.step_assertText = "Element-tekst beschikbaar? (nodig)";
m.step_verifyText = "Element-tekst beschikbaar? (verificatie)";
m.step_waitForText = "op element-tekst wachten";
m.step_storeText = "Element-tekst opslaan";
m.step_assertCurrentUrl = "URL controleren (nodig)";
m.step_verifyCurrentUrl = "URL controleren (verificatie)";
m.step_waitForCurrentUrl = "op URL wachten";
m.step_storeCurrentUrl = "URL opslaan";
m.step_assertTitle = "Titel controleren (nodig)";
m.step_verifyTitle = "Titel controleren (verificatie)";
m.step_waitForTitle = "op titel wachten";
m.step_storeTitle = "Titel opslaan";
m.step_assertElementAttribute = "Attribuut controleren (nodig)";
m.step_verifyElementAttribute = "Attribuut controleren (verificatie)";
m.step_waitForElementAttribute = "op attribuut wachten";
m.step_storeElementAttribute = "Attribuut opslaan";
m.step_assertElementSelected = "Element geselecteerd? (nodig)";
m.step_verifyElementSelected = "Element geselecteerd? (verificatie)";
m.step_waitForElementSelected = "op Element-selectie wachten";
m.step_storeElementSelected = "Element-selectie opslaan";
m.step_assertElementValue = "Element-waarde controleren (nodig)";
m.step_verifyElementValue = "Element-waarde controleren (verificatie)";
m.step_waitForElementValue = "op Element-waarde wachten";
m.step_storeElementValue = "Element-waarde opslaan";
m.step_addCookie = "nieuw cookie";
m.step_deleteCookie = "Cookie verwijderen";
m.step_assertCookieByName = "Cookie-waarde controleren (nodig)";
m.step_verifyCookieByName = "Cookie-waarde controleren (verificatie)";
m.step_waitForCookieByName = "op Cookie-waarde wachten";
m.step_storeCookieByName = "Cookie-waarde opslaan";
m.step_assertCookiePresent = "Cookie-aanwezigheid controleren (nodig)";
m.step_verifyCookiePresent = "Cookie-aanwezigheid controleren (nodig)";
m.step_waitForCookiePresent = "op cookie wachten";
m.step_storeCookiePresent = "Cookie-aanwezigheid opslaan";
m.step_saveScreenshot = "Screenshot";
m.step_switchToFrame = "Frame wisselen";
m.step_switchToFrameByIndex = "Naar frame mit index wisselen";
m.step_switchWindow = "Venster wisselen";
m.step_switchToDefaultContent = "Zur hoofdvenster wisselen";
m.step_print = "Specificatie";
m.step_store = "Waarde opslaan";
m.step_pause = "Pauze";
m.step_assertAlertText = "Dialoog-tekst controleren (nodig)";
m.step_verifyAlertText = "Dialoog-tekst controleren (verificatie)";
m.step_waitForAlertText = "op dialoog-tekst wachten";
m.step_storeAlertText = "Dialoog-tekst opslaan";
m.step_assertAlertPresent = "Dialog-aanwezigheid controleren (nodig)";
m.step_verifyAlertPresent = "Dialog-aanwezigheid controleren (verificatie)";
m.step_waitForAlertPresent = "op dialog-aanwezigheid wachten";
m.step_storeAlertPresent = "Dialog-aanwezigheid opslaan";
m.step_answerAlert = "Dialog beantwoorden";
m.step_acceptAlert = "Dialog accepteren";
m.step_dismissAlert = "Dialog afbreken";
m.p_attributeName = "Attribuut-naam";
m.p_file = "Document";
m.p_locator = "Locator";
m.p_name = "Naam";
m.p_offset = "Verschuiving";
m.p_options = "Opties";
m.p_source = "Bron";
m.p_targetLocator = "Doel-locator";
m.p_text = "Text";
m.p_title = "Titel";
m.p_url = "URL";
m.p_value = "Waarde";
m.p_variable = "Variable";
m.p_waitTime = "Wachttijd";
m.p_identifier = "Identifikator";
m.p_index = "Index";
m.p_name = "Naam";

// Data-driven
m.menu_data = "Data";
m.no_source = "Geen";
m.manual_entry = "Manuele invoer";
m.json_file_path = "Pad JSON-document";
m.xml_file_path = "Pad XML-Document";
m.row = "Rij {0}";
m.inputs = "Inputs";
m.string = "Text";
m.integer = "Integer";
m.int = "Integer";



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
