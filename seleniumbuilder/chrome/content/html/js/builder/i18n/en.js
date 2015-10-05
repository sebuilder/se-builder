var m = {};
builder.translate.addLocale({'name':'en', 'title': "English", 'mapping': m});

// General
m.ok = "OK";
m.cancel = "Cancel";

// Locale selection GUI
m.select_locale = "Select language";
m.new_locale_after_restart = "Language will change after Builder restart.";

// Startup view
m.open_script_or_suite = "Open a script or suite";
m.view_command_table = "View supported commands for Selenium 1 & 2";
m.manage_plugins = "Manage plugins"
m.start_recording_at = "Start recording at";
m.cookie_warning = "This will delete all cookies for the domain you're recording for.";

// Steps table
m.steps_table = "Steps Table";
m.show_step_type_orphans = "Show Selenium 1 steps that have no corresponding Selenium 2 step.";
m.step_name = "Name";
m.sel_1_translation = "Selenium 1 Translation";
m.negatable = "Negatable";
m.local_playback_available = "Local Playback";
m.yes = "yes"; // Yes means yes.
m.no = "no";   // No means no.
               // Oh no! Politics in our source code!
m.search = "Search";

// Plugins
m.plugins_title = "Plugins";
m.plugins_back = "Back";
m.plugins_refresh = "Refresh";
m.plugins_reboot = "Restart Builder";
m.plugins_loading = "Loading...";
m.plugins_downloading = "Downloading...";
m.plugin_disabled = "Disabled";
m.plugin_installed = "Installed";
m.plugin_installed_to_enable = "Installed, Enabled after Restart";
m.plugin_installed_to_disable = "Installed, Disabled after Restart";
m.plugin_not_installed = "Not Installed";
m.plugin_to_install = "Installed after Restart";
m.plugin_to_uninstall = "Uninstalled after Restart";
m.plugin_to_update = "Installed, Updated after Restart";
m.plugin_update_available = ", update to version {0} available";
m.plugin_install = "Install";
m.plugin_install_and_reboot = "Install and Restart";
m.plugin_cancel_install = "Cancel Install";
m.plugin_uninstall = "Uninstall";
m.plugin_uninstall_and_reboot = "Uninstall and Restart";
m.plugin_cancel_uninstall = "Cancel Uninstall";
m.plugin_update = "Update";
m.plugin_update_and_reboot = "Update and Restart";
m.plugin_cancel_update = "Cancel Update";
m.plugin_enable = "Enable";
m.plugin_enable_and_reboot = "Enable and Restart";
m.plugin_disable = "Disable";
m.plugin_disable_and_reboot = "Disable and Restart";
m.plugin_list_too_new = "Plugin list data format is too new. Please upgrade Builder.";
m.unable_to_fetch_plugins = "Unable to fetch plugins";
m.plugin_load_timed_out = "Loading timed out.";
m.plugin_url_not_found = "not found";
m.plugin_missing_dir = "Plugin directory at {0} missing.";
m.plugin_not_a_dir = "Plugin directory at {0} is not a directory, it's a file.";
m.plugin_header_missing = "Plugin header at {0} missing.";
m.plugin_header_not_file = "Plugin header at {0} is not a file.";
m.plugin_header_file_corrupted = "Header file at {0} is corrupted, has a syntax error, or is not a JSON file: {1}";
m.plugin_header_file_no_version = "Header file at {0} has no header version.";
m.plugin_builder_too_old = "This version of Builder is too old to use this plugin. Please upgrade to the newest version.";
m.plugin_id_mismatch = "The plugin ID in the header ({0}) does not match the expected ID ({1}).";
m.plugin_version_invalid = "The plugin's version is invalid.";
m.plugin_cant_verify = "Unable to verify plugin: {0}";
m.plugin_unable_to_install = "Could not install {0}: {1}";
m.plugin_unable_to_uninstall = "Could not uninstall {0}: {1}";
m.plugin_disabled_builder_too_old = "Disabled plugin \"{0}\": This version of Builder is too old for this plugin.\nMinimum supported Builder version: {1}. Current Builder version: {2}.\nPlease update Builder, then re-enable the plugin.";
m.plugin_disabled_builder_too_new = "Disabled plugin \"{0}\": This version of the plugin is too old.\nMaximum supported Builder version: {1}. Current Builder version: {2}.\nTry updating the plugin.";
m.cant_update_builder_too_old = ", update to version {0} cannot be applied: Builder is not up to date";
m.cant_update_builder_too_new = ", update to version {0} cannot be applied: Plugin is too old";
m.cant_install_builder_too_old = "; unable to install: Builder is not up to date";
m.cant_install_builder_too_new = "; unable to install: Plugin is too old";
m.updates_available = "Updates Available";
m.plugin_download_failed = "Plugin download failed to complete.";

// Menus
m.menu_file = "File";
m.menu_record = "Record";
m.menu_run = "Run";
m.menu_suite = "Suite";
m.menu_settings = "Script settings...";
m.menu_save = "Save";
m.menu_save_to = "Save to {0}";
m.menu_save_as = "Save as...";
m.menu_export = "Export...";
m.menu_convert = "Convert to other version...";
m.menu_convert_to = "Convert to {0}";
m.menu_discard = "Discard and start over";
m.menu_run_locally = "Run test locally";
m.menu_run_on_rc = "Run on Selenium Server";
m.menu_run_suite_locally = "Run suite locally";
m.menu_run_suite_on_rc = "Run suite on Selenium Server";
m.menu_suite_remove_script = "Remove current script";
m.menu_add_script_from_file = "Add script from file";
m.menu_record_new_script = "Record new script";
m.menu_discard_suite = "Discard suite and start over";
m.menu_save_suite = "Save suite";
m.menu_save_suite_to = "Save suite to {0}";
m.menu_save_suite_as = "Save suite as...";
m.menu_export_suite = "Export suite";
m.lose_changes_warning = "If you continue, you will lose all your recent changes.";
m.menu_debug = "Debug";
m.menu_disable_breakpoints = "√ Enable breakpoints";
m.menu_enable_breakpoints = "Enable breakpoints";
m.menu_clear_breakpoints = "Clear all breakpoints";
m.clear_breakpoints_confirm = "Are you sure you want to clear all breakpoints from the current script?";
m.menu_playback_variables = "Playback variables...";
m.menu_share_state_across_suite = "Share state across suite";
m.menu_dont_share_state_across_suite = "√ Share state across suite";

// Variables
m.variables = "Variables";

// Script
m.untitled_script = "Untitled Script";

// Step display
m.suite_has_unsaved_changes = "Suite has unsaved changes.";
m.suite_cannot_save_unsaved_scripts = "Can't save suite: Save all scripts in the same format first.";
m.cannot_save_suite_due_to_mixed_versions = "Can't save suite: All scripts must be of the same Selenium version.";
m.stop_playback = "Stop Playback";
m.continue_playback = "Continue";
m.stopping = "Stopping...";
m.clear_results = "Clear Results";
m.connecting = "Connecting...";
m.record_verification = "Record a verification";
m.stop_recording = "Stop recording";
m.record_mouseovers = "Record mouseovers";

// Convert dialog
m.script_conversion = "Conversion";
m.the_following_steps_cant_be_converted = "The following steps can't be converted";

// Export dialog
m.choose_export_format = "Choose export format";
m.sel2_unsaveable_steps = "This script contains steps that can't be saved as Selenium 2 yet";
m.save = "Save";
m.unsupported_steps = "Unsupported";
m.export_as_X_to_Y = "Export as {0} to {1}";
m.save_as_X = "Save as {0}";

// RC dialog
m.run_script = "Run";
m.selenium_rc_settings = "Selenium Server Settings";
m.rc_server_host_port = "Host:Port of Selenium Server";
m.rc_browser_string = "Browser String";
m.rc_browser_version = "Browser Version";
m.rc_platform = "Platform";

// Record dialog
m.start_recording_new_script_at = "Start recording a new script at";

// Run all dialog
m.view_run_result = "View Result";
m.running_scripts = "Running scripts...";
m.stop = "Stop";
m.close = "Close";
m.done_exclamation = "Done!";

// Suite
m.cant_save_suite_must_save_as_html = "Can't save suite. Please save all test scripts to disk as HTML first.";

// Gui
m.unsaved_changes_warning = "Any unsaved changes will be lost!";

// UI
m.unable_to_read_file = "Unable to read file, sorry.";
m.select_a_file = "Select a File";

// Record
m.record_invalid_url = "The URL is not valid and cannot be loaded.";

// Settings
m.script_settings = "Script Settings";
m.timeout_seconds = "Timeout (seconds)";

// Sel 1
m.sel1_could_not_open_suite_script = "Could not open suite: Could not open script {0}";
m.sel1_couldnt_save_suite = "Could not save suite:\n{0}";
m.sel1_couldnt_export_script = "Could not export script:\n{0}";
m.sel1_playback_failed = "Failed";
m.sel1_unknown_failure_reason = "Unknown Failure Reason";
m.sel1_test_stopped = "Test stopped";

// Sel 2
m.save_as = "Save as...";
m.sel2_cant_export_step_type = "Cannot export step of type \"{0}\".";
m.sel2_variable_not_set = "Variable not set: {0}.";
m.sel2_text_not_present = "Text \"{0}\" not present.";
m.sel2_body_text_does_not_match = "Body text does not match \"{0}\".";
m.sel2_element_not_found = "Element not found.";
m.sel2_source_does_not_match = "Source does not match.";
m.sel2_element_text_does_not_match = "Element text \"{0}\" does not match \"{1}\".";
m.sel2_url_does_not_match = "URL \"{0}\" does not match \"{1}\".";
m.sel2_title_does_not_match = "Title \"{0}\" does not match \"{1}\".";
m.sel2_element_not_selected = "Element not selected.";
m.sel2_element_value_doesnt_match = "Element value \"{0}\" does not match \"{1}\".";
m.sel2_attribute_value_doesnt_match = "\"{0}\" attribute value \"{1}\" does not match \"{2}\".";
m.sel2_css_value_doesnt_match = "\"{0}\" CSS property value \"{1}\" does not match \"{2}\".";
m.sel2_cookie_value_doesnt_match = "\"{0}\" cookie value \"{1}\" does not match \"{2}\".";
m.sel2_no_cookie_found = "Cookie \"{0}\" not found.";
m.sel2_step_not_implemented_for_playback = "{0} not implemented for playback.";
m.sel2_alert_text_does_not_match = "Alert text \"{0}\" does not match \"{1}\".";
m.sel2_no_alert_present = "No alert present.";
m.sel2_is = "is";
m.sel2_true = "true";
m.sel2_false = "false";
m.sel2_untitled_run = "Untitled";
m.sel2_server_error = "Server Error";
m.sel2_must_playback_in_foreground = "Note: Must leave playback window in foreground during local playback.";
m.sel2_eval_failed = "Script evaluation failed.";
m.sel2_eval_false = "Eval result \"{0}\" does not match \"{1}\".";
m.sel2_bypass = "ByPass step \{0}\"";

// Step display
m.param_expr_info = "<br>Parameter expressions of the form <i>${varname}</i> are replaced by the contents of the variable <i>varname</i>";
m.negate_assertion_or_verification = "Negate assertion/verification";
m.find_a_different_target = "Find a different target";
m.suggested_locator_alternatives = "Suggested alternatives:";
m.step_edit_type = "edit type";
m.step_delete = "delete step";
m.step_new_above = "new step above";
m.step_new_below = "new step below";
m.step_copy = "copy";
m.step_cut = "cut";
m.step_paste = "paste";
m.step_record_before = "record before";
m.step_record_after = "record after";
m.step_run = "run step";
m.step_run_from_here = "run from here";
m.step_run_to_here = "run to here";
m.step_add_breakpoint = "add breakpoint";
m.step_remove_breakpoint = "remove breakpt";
m.playback_not_supported_warning = "Warning: playback not supported for this step type.";
m.edit_p = "edit {0}";
m.not = "not";
m.find = "Find";

// IO
m.script_is_empty = "Script is empty.";
m.suite_is_empty = "Suite is empty.";
m.suite = "Suite";
m.could_not_open_suite = "Could not open suite";
m.sel1_no_table_tag = "Failed to load test suite: <table> tag not found";
m.sel1_no_command_found = "Unknown command in test script";
m.unable_to_fetch_data = "Unable to fetch external data for script playback: {0}";
m.unable_to_load_file = "Unable to load file {0}.";

// Selenium 1 Categories
m.action_cat = "action";
m.assertion_cat = "assertion";
m.wait_cat = "wait";
m.other_cat = "other";
m.store_cat = "store";
m.clicks_cat = "clicks";
m.mouse_events_cat = "mouse events";
m.keyboard_events_cat = "keyboard events";
m.keyboard_modifiers_cat = "keyboard modifiers";
m.form_fields_cat = "form fields";
m.browsing_cat = "browsing";
m.popups_and_menus_cat = "popups and menus";
m.page_content_cat = "page content";
m.page_positioning_cat = "page positioning";
m.popups_cat = "popups";
m.browser_window_cat = "browser window";
m.form_fields_cat = "form fields";
m.selenium_cat = "selenium";
m.cookies_cat = "cookies";
m.common_cat = "common";
m.selenium_settings_cat = "selenium settings";
m.screenshots_cat = "screenshots";
m.cookies_cat = "cookies";
m.special_cat = "special";
m.extensions_cat = "extensions";

// Selenium 2 Categories
m.navigation_sel2_cat = "Navigation";
m.input_sel2_cat = "Input";
m.misc_sel2_cat = "Misc";
m.assertion_sel2_cat = "Assertion";
m.verify_sel2_cat = "Verify";
m.wait_sel2_cat = "Wait";
m.bypass_sel2_cat = "ByPass";
m.bookmarklet_sel2_cat = "BookmarkLets";
m.store_sel2_cat = "Store";

// Data-driven
m.menu_data = "Data";
m.no_source = "No Data";
m.manual_entry = "Manual Entry";
m.json_file_path = "JSON File Path";
m.xml_file_path = "XML File Path";
m.csv_file_path = "CSV File Path";
m.csv_parse_error = "CSV parse error: {0}";
m.row = "Row {0}"
m.inputs = "Inputs";
m.string = "String";
m.integer = "Integer";
m.int = "Integer";



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
