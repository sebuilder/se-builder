var m = {};
builder.translate.addLocale({'name':'pl', 'title': "Polski", 'mapping': m});

// General
m.ok = "OK";
m.cancel = "Anuluj";

// Locale selection GUI
m.select_locale = "Wybierz jezyk";
m.new_locale_after_restart = "Jezyk zostanie zmieniony po ponownym uruchomieniu Builder-a.";

// Startup view
m.open_script_or_suite = "Otworz skryp lub pakiet testów";
m.view_command_table = "Przejrzyj wspieranie komendy dla selenium 1 i 2";
m.manage_plugins = "Zarzadzaj pluginami"
m.start_recording_at = "Zacznik nagrywac od";
m.cookie_warning = "wszystkie ciasteczka zostana usuniete dla domeny w której toczy sie nagrywanie.";

// Steps table
m.steps_table = "Tabela kroków";
m.show_step_type_orphans = "Pokaz kroki Selenium 1 które nie maja odzwierciedlenia w Selenium 2.";
m.step_name = "Nazwa";
m.sel_1_translation = "Translacja Selenium 1";
m.negatable = "Negatable";
m.local_playback_available = "lokalna playlist-a";
m.yes = "tak"; // Yes means yes.
m.no = "nie";   // No means no.
// Oh no! Politics in our source code!

// Plugins
m.plugins_title = "pluginy";
m.plugins_back = "Powrót";
m.plugins_refresh = "Odswierz";
m.plugins_reboot = "Restart Builder-a";
m.plugins_loading = "ladowanie...";
m.plugins_downloading = "Sciaganie...";
m.plugin_disabled = "Zablokowany";
m.plugin_installed = "Zainstalowany";
m.plugin_installed_to_enable = "Zainstalowano, Odblokowanie po restarcie Restart";
m.plugin_installed_to_disable = "Zainstalowano, Zablokowanie po restarcie";
m.plugin_not_installed = "nie zainstalowany";
m.plugin_to_install = "zainstalowanie po restarcie";
m.plugin_to_uninstall = "odinstalowanie po restarcie";
m.plugin_to_update = "Zainstalowano, zaktualizowanie po restarcie";
m.plugin_update_available = ", dostepna aktualizacja do wersji {0}";
m.plugin_install = "Zainstaluj";
m.plugin_install_and_reboot = "Zainstaluj i zrestartuj";
m.plugin_cancel_install = "Przerwij instalacje";
m.plugin_uninstall = "Odinstaluj";
m.plugin_uninstall_and_reboot = "Odinstaluj i zrestartuj";
m.plugin_cancel_uninstall = "Przerwij Odinstalowywanie";
m.plugin_update = "Zaktualizuj";
m.plugin_update_and_reboot = "Zaktualizuj i zrestartuj";
m.plugin_cancel_update = "Przerwij aktualizacje";
m.plugin_enable = "Odblokuj";
m.plugin_enable_and_reboot = "Odblokuj i zrestartuj";
m.plugin_disable = "Zablokuj";
m.plugin_disable_and_reboot = "Zablokuj i zrestartuj";
m.plugin_list_too_new = "lista danych pluginu jest zbyt nowa. Zaktualizuj builder-a.";
m.unable_to_fetch_plugins = "Nie udalo sie wylistowac pluginów";
m.plugin_load_timed_out = "Uplynal limit czasu ladowania.";
m.plugin_url_not_found = "nie znaleziono";
m.plugin_missing_dir = "nie znaleziono folderu pluginu w {0}";
m.plugin_not_a_dir = "sciezka pluginu w {0} nie jest folderem tylko plikiem.";
m.plugin_header_missing = "brak naglówka pluginu w {0}.";
m.plugin_header_not_file = "naglówek pluginu w {0} nie jest plikiem.";
m.plugin_header_file_corrupted = "Plik naglówkowy w {0} jest uszkodzony, posiada blad skladniowy, badz nie jest plikiem JSON: {1}";
m.plugin_header_file_no_version = "Plik naglówkowy w {0} nie ma wersji naglowka.";
m.plugin_builder_too_old = "wersja builder-a jest za stara aby uzyc tego pluginu. Prosze zaktualizowac builder-a do najnowszej wersji.";
m.plugin_id_mismatch = "ID pluginu w naglowku ({0}) nie pasuje do oczekiwanego ID ({1}).";
m.plugin_version_invalid = "Nie poprawna wersja pluginu.";
m.plugin_cant_verify = "Nie mozna zweryfikowac pluginu: {0}";
m.plugin_unable_to_install = "nie mozna zainstalowac {0}: {1}";
m.plugin_unable_to_uninstall = "nie mozna odinstalowac {0}: {1}";
m.plugin_disabled_builder_too_old = "Zablokowany plugin \"{0}\": Ta wersja builder-a jest za stara.\n Minimalna wspierana wersja builder-a: {1}. Aktualna wersja builder-a: {2}.\nProsze zaktualizowac builder-a a nastepnie ponownie wlaczyc plugin.";
m.plugin_disabled_builder_too_new = "Zablokowany plugin \"{0}\": wersja pluginu jest za stara..\nMaksymalna wspierana wersja builder-a: {1}. Aktualna wersja builder-a: {2}.\n Sproboj zaktualizowac plugin.";
m.cant_update_builder_too_old = ",nie mozna zaktualizowac do wersji {0} : wersja builder-a nie jest aktualna";
m.cant_update_builder_too_new = ", nie mozna zaktualizowac do wersji {0} : wersja plugin-a jest za stara";
m.cant_install_builder_too_old = "; nie mozna zaktualizowac : versja builder-a nie jest aktualna";
m.cant_install_builder_too_new = "; nie mozna zaktualizowac : wersja plugin-a jest za stara";
m.updates_available = "Dostepne aktualizacje";
m.plugin_download_failed = "Nie udalo sie sciagnac pluginu.";

// Menus
m.menu_file = "Plik";
m.menu_record = "Nagrywanie";
m.menu_run = "Uruchomienie";
m.menu_suite = "Pakiet";
m.menu_save = "Zapisz";
m.menu_save_to = "Zapisz do {0}";
m.menu_save_as = "Zapisz jako...";
m.menu_export = "exportuj...";
m.menu_convert = "Konwertuj do innej wersji...";
m.menu_convert_to = "Konwertuj do {0}";
m.menu_discard = "Porzuc i zacznij od nowa";
m.menu_run_locally = "Uruchom test lokalnie";
m.menu_run_on_rc = "Uruchom na serwerze Selenium";
m.menu_run_suite_locally = "Uruchom pakiet lokalnie";
m.menu_run_suite_on_rc = "Uruchom pakiet na serwerze Selenium ";
m.menu_suite_remove_script = "Usun aktualny scrypt";
m.menu_add_script_from_file = "Dodaj skrypt z pliku";
m.menu_record_new_script = "Zacznij nowy skrypy";
m.menu_discard_suite = "porzuc pakiet i zacznij ponownie";
m.menu_save_suite = "zapisz pakiet";
m.menu_save_suite_to = "Zapisz pakiet do {0}";
m.menu_save_suite_as = "Zapisz pakiet jako...";
m.menu_export_suite = "Exportuj pakiet";
m.lose_changes_warning = "Jezeli bedziesz kontynuowac stracisz wszystkie ostatnie zmiany.";
m.menu_debug = "debugowanie";
m.menu_disable_breakpoints = "Zablokuj punkt wstrzymania";
m.menu_enable_breakpoints = "Odblokuj punkt wstrzymania";
m.menu_clear_breakpoints = "wyczysc wszystkie punkty wstrzymania";
m.clear_breakpoints_confirm = "Czy jestes pewny ze chcesz usunac wszystkie punkty wstrzymania dla aktualnego skryptu?";
m.menu_playback_variables = "zmienne listy odtwarzania...";

// Variables
m.variables = "Zmienne";

// Script
m.untitled_script = "Skrypy bez tytulu";

// Step display
m.suite_has_unsaved_changes = "Pakiet ma nie zapisane zmiany.";
m.suite_cannot_save_unsaved_scripts = "Nie mozna zapisac pakietu: Zapisz najpierw wszystkie skrypty w tym samym formacie.";
m.cannot_save_suite_due_to_mixed_versions = "Nie mozna zapisac pakietu: Wszystkie skrypty musza byc w tej samej wersji Selenium.";
m.stop_playback = "Zatrzymaj odtwarzanie";
m.continue_playback = "Kontynuuj";
m.stopping = "Zatrzymaj...";
m.clear_results = "Wyczysc rezultaty";
m.connecting = "laczenie...";
m.record_verification = "Zapis sprawdzania";
m.stop_recording = "przerwij zapis";

// Convert dialog
m.script_conversion = "Przeksztalcenie";
m.the_following_steps_cant_be_converted = "nastepujace kroki nie moga zostac przeksztalcone.";

// Export dialog
m.choose_export_format = "wybierz format eksportu";
m.sel2_unsaveable_steps = "Ten skrypt zawiera kroki które nie moga byc zapisane w formacie Selenium 2";
m.save = "Zapisz";
m.unsupported_steps = "nieobslugiwany";
m.export_as_X_to_Y = "Wyeksportuj {0} do {1}";
m.save_as_X = "Zapisz jako {0}";

// RC dialog
m.run_script = "Uruchom";
m.selenium_rc_settings = "Ustawienia serwera Selenium";
m.rc_server_host_port = "Host:Port serwera Selenium";
m.rc_browser_string = "nazwa przegladarki";
m.rc_browser_version = "Wersja przegladarki";
m.rc_platform = "Platforma";

// Record dialog
m.start_recording_new_script_at = "Zacznij nagrywanie nowego skryptu w";

// Run all dialog
m.view_run_result = "Przejrzyj rezultaty";
m.running_scripts = "biezace skrypty...";
m.stop = "Przerwij";
m.close = "Zamknij";
m.done_exclamation = "Skonczone!";

// Suite
m.cant_save_suite_must_save_as_html = "Nie mozna zapisac pakietu. Zapisz najpierw wszystkie skrypty testu na dysk do formatu HTML.";

// Gui
m.unsaved_changes_warning = "Wszystkie nie zapisane zmiany zostana utracone!";

// UI
m.unable_to_read_file = "Nie mozna odczytac pliku.";
m.select_a_file = "Wybierz plik";

// Record
m.record_invalid_url = "Nie prawidlowy adres URL";

// Sel 1
m.sel1_could_not_open_suite_script = "Nie mozna otworzyc pakietu: Nie mozna otworzyc skryptu {0}";
m.sel1_couldnt_save_suite = "Nie mozna zapisac pakietu:\n{0}";
m.sel1_couldnt_export_script = "Nie mozna wyeksportowac skryptu:\n{0}";
m.sel1_playback_failed = "niepowodzenie";
m.sel1_unknown_failure_reason = "nieznany powód niepowodzenia";
m.sel1_test_stopped = "Test zatrzymany";

// Sel 2
m.save_as = "Zapisz jako...";
m.sel2_cant_export_step_type = "Nie mozna wyeksportowac kroku typu  \"{0}\".";
m.sel2_variable_not_set = "Nie ustawiona wartosc zmiennej: {0}.";
m.sel2_text_not_present = "Tekst \"{0}\" nie wystapil.";
m.sel2_body_text_does_not_match = "Cialo tekstu nie pasuje \"{0}\".";
m.sel2_element_not_found = "Nie znaleziono elementu.";
m.sel2_source_does_not_match = "Zrodlo nie pasuje.";
m.sel2_element_text_does_not_match = "Tekst elementu \"{0}\" nie pasuje do \"{1}\".";
m.sel2_url_does_not_match = "URL \"{0}\" nie pasuje do \"{1}\".";
m.sel2_title_does_not_match = "Tytul \"{0}\" nie pasuje do \"{1}\".";
m.sel2_element_not_selected = "Nie zaznaczony element.";
m.sel2_element_value_doesnt_match = "wartosc elementu \"{0}\" nie pasuje do \"{1}\".";
m.sel2_attribute_value_doesnt_match = "\"{0}\" wartosc atrybutu \"{1}\" nie pasuje do \"{2}\".";
m.sel2_cookie_value_doesnt_match = "\"{0}\" wartosc ciasteczka \"{1}\" nie pasuje do \"{2}\".";
m.sel2_no_cookie_found = "nie znaleziono ciasteczka \"{0}\" ";
m.sel2_step_not_implemented_for_playback = "{0} nie zostal zaimplementowany dla playback.";
m.sel2_alert_text_does_not_match = "Tekst alertu \"{0}\" nie pasuje do \"{1}\".";
m.sel2_no_alert_present = "nie wystapil alert";
m.sel2_is = "jest";
m.sel2_true = "prawdziwy";
m.sel2_false = "nie prawdziwy";
m.sel2_untitled_run = "Bez tytulu";
m.sel2_server_error = "Blad serwera";
m.sel2_must_playback_in_foreground = "Notka: Must leave playback window in foreground during local playback.";
m.sel2_eval_false = "Eval result \"{0}\" does not match \"{1}\".";

// Step display
m.param_expr_info = "<br>Parameter expressions of the form <i>${varname}</i> are replaced by the contents of the variable <i>varname</i>";
m.negate_assertion_or_verification = "Negate assertion/verification";
m.find_a_different_target = "Znajdz inny cel";
m.suggested_locator_alternatives = "Sugerowane alternatywy:";
m.step_edit_type = "edytuj krok";
m.step_delete = "usun krok";
m.step_new_above = "wstaw nowy krok nad";
m.step_new_below = "wstaw nowy krok pod";
m.step_copy = "skopiuj";
m.step_cut = "wytnij";
m.step_paste = "wklej";
m.step_run = "uruchom krok";
m.step_run_from_here = "Uruchom od tego miejsca";
m.step_run_to_here = "Uruchom do tego miejsca";
m.step_add_breakpoint = "add breakpoint";
m.step_remove_breakpoint = "remove breakpt";
m.playback_not_supported_warning = "Ostrzerzenie: brak wsparcia dla tego typu kroku.";
m.edit_p = "Edytuj {0}";
m.not = "nie";
m.find = "Znajdz";

// IO
m.script_is_empty = "Skrypt jest pusty.";
m.suite_is_empty = "Pakiet jest pusty.";
m.suite = "Pakiet";
m.could_not_open_suite = "Nie mozna otworzyc pakietu.";

// Selenium 1 Categories
m.action_cat = "akcja";
m.assertion_cat = "asercja";
m.wait_cat = "czekanie";
m.other_cat = "inne";
m.store_cat = "przechowywalnia";
m.clicks_cat = "kliki";
m.mouse_events_cat = "zdarzenia myszy";
m.keyboard_events_cat = "zdarzenia klawiatury";
m.keyboard_modifiers_cat = "modyfikatory klawiaturowe";
m.form_fields_cat = "pola formularza";
m.browsing_cat = "przegladanie";
m.popups_and_menus_cat = "okienko i menu";
m.page_content_cat = "zawartosc strony";
m.page_positioning_cat = "pozycja strony";
m.popups_cat = "okienko";
m.browser_window_cat = "okno przegladarki";
m.form_fields_cat = "pola formularza";
m.selenium_cat = "selenium";
m.cookies_cat = "ciasteczka";
m.common_cat = "wspólny";
m.selenium_settings_cat = "ustawienia selenium";
m.screenshots_cat = "zrzut ekranu";
m.cookies_cat = "ciasteczko";
m.special_cat = "special";
m.extensions_cat = "extensions";

// Selenium 2 Categories
m.navigation_sel2_cat = "Nawigacja";
m.input_sel2_cat = "Pole";
m.misc_sel2_cat = "Misc";
m.assertion_sel2_cat = "asercja";
m.verify_sel2_cat = "Verify";
m.wait_sel2_cat = "czekaj";
m.store_sel2_cat = "przechowywalnia";

// Data-driven
m.menu_data = "Dane";
m.no_source = "Brak";
m.manual_entry = "Reczne wprowadzanie";