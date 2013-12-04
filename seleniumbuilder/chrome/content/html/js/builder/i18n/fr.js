var m = {};
builder.translate.addLocale({'name':'fr', 'title': "Français", 'mapping': m});

// General
m.ok = "Valider";
m.cancel = "Annuler";

// Locale selection GUI
m.select_locale = "Sélectionner la langue";
m.new_locale_after_restart = "Le changement de langue sera effectif après un redémarrage de SeBuilder";

// Startup view
m.open_script_or_suite = "Ouvrir un script ou une suite";
m.view_command_table = "Voir les commandes disponibles pour Selenium 1 & 2";
m.manage_plugins = "Gérer les modules"
m.start_recording_at = "Démarrer l'enregistrement depuis";
m.cookie_warning = "Cette action va entrainer la suppression des cookies sur le domaine que vous êtes en train d'enregistrer";

// Steps table
m.steps_table = "Table des commandes disponibles";
m.show_step_type_orphans = "Afficher les commandes Selenium 1 qui n'ont pas de correspondance avec une commande Selenium 2.";
m.step_name = "Nom";
m.sel_1_translation = "Correspondance Selenium 1";
m.negatable = "Inversable";
m.local_playback_available = "Rejeu local";
m.yes = "oui"; // Yes means yes.
m.no = "non"; // No means no.
               // Oh no! Politics in our source code!

// Plugins
m.plugins_title = "Modules";
m.plugins_back = "Retour";
m.plugins_refresh = "Rafraichir";
m.plugins_reboot = "Redémarrer";
m.plugins_loading = "Chargement en cours...";
m.plugins_downloading = "Téléchargement en cours...";
m.plugin_disabled = "Désactivé";
m.plugin_installed = "Installé";
m.plugin_installed_to_enable = "Installé, actif après redémarrage";
m.plugin_installed_to_disable = "Installé, inactif après redémarrage";
m.plugin_not_installed = "Non installé";
m.plugin_to_install = "Installé après redémarrage";
m.plugin_to_uninstall = "Désinstallé après redémarrage";
m.plugin_to_update = "Installé, mis à jour après redémarrage";
m.plugin_update_available = ", mise à jour de la version {0} disponible";
m.plugin_install = "Installer";
m.plugin_install_and_reboot = "Installer et redémarrer";
m.plugin_cancel_install = "Annuler l'installation";
m.plugin_uninstall = "Désinstaller";
m.plugin_uninstall_and_reboot = "Désinstaller et redémarrer";
m.plugin_cancel_uninstall = "Annuler la désinstallation";
m.plugin_update = "Mettre à jour";
m.plugin_update_and_reboot = "Mettre à jour et redémarrer";
m.plugin_cancel_update = "Annuler la mise à jour";
m.plugin_enable = "Activer";
m.plugin_enable_and_reboot = "Activer et redémarrer";
m.plugin_disable = "Désactiver";
m.plugin_disable_and_reboot = "Désactiver et redémarrer";
m.plugin_list_too_new = "Le format de données de la liste des modules est trop récent. Veuillez mettre à jour SeBuilder.";
m.unable_to_fetch_plugins = "Impossible de télécharger les modules";
m.plugin_url_not_found = "non touvé";
m.plugin_missing_dir = "Le répertoire du module {0} n'existe pas.";
m.plugin_not_a_dir = "Le répertoire du module {0} n'est pas un répertoire, c'est un fichier.";
m.plugin_header_missing = "L'en-tête du module {0} n'existe pas.";
m.plugin_header_not_file = "L'en-tête du module {0} n'est pas un fichier.";
m.plugin_header_file_corrupted = "L'en-tête du fichier {0} est corrompu, a une erreur de syntaxe, ou n'est pas un fichier JSON: {1}";
m.plugin_header_file_no_version = "L'en-tête du fichier {0} ne possède pas de version.";
m.plugin_builder_too_old = "La version de SeBuilder est trop ancienne pour utiliser ce module. Veuillez procéder à une mise à jour.";
m.plugin_id_mismatch = "L'identifiant du module dans l'en-tête ({0}) ne correspond pas à l'identifiant attendu ({1}).";
m.plugin_cant_verify = "Impossible de vérifier le module: {0}";
m.plugin_unable_to_install = "Impossible d'installer {0}: {1}";
m.plugin_unable_to_uninstall = "Impossible de désinstaller {0}: {1}";
m.plugin_disabled_builder_too_old = "Module désactivé\"{0}\": La version de SeBuilder est trop ancienne pour utiliser ce module.\nVersion minimal supportée: {1}. Version actuelle: {2}.\nVeuillez mettre à jour SeBuilder, puis réactiver le module.";
m.plugin_disabled_builder_too_new = "Module désactivé\"{0}\": La version de SeBuilder est trop ancienne pour utiliser ce module.\nVersion minimal supportée: {1}. Version actuelle: {2}.\nEssayez de mettre à jour le module.";
m.cant_update_builder_too_old = ", Passage de la version {0} impossible: SeBuilder n'est pas à jour";
m.cant_update_builder_too_new = ", Passage de la version {0} impossible: les plugins sont trop anciens";
m.cant_install_builder_too_old = "; Installation impossible: SeBuilder n'est pas à jour";
m.cant_install_builder_too_new = "; Installation impossible: les plugins sont trop anciens";
m.updates_available = "Mises à jour disponibles";
m.plugin_download_failed = "Téléchargement du plug-in n'a pas pu être terminée. Essayez à nouveau.";

// Menus
m.menu_file = "Fichier";
m.menu_record = "Enregistrer";
m.menu_run = "Lancer";
m.menu_suite = "Suite";
m.menu_save = "Sauvegarder";
m.menu_save_to = "Sauvegarder dans {0}";
m.menu_save_as = "Sauvegarder sous...";
m.menu_export = "Export...";
m.menu_convert = "Convertir dans une autre version...";
m.menu_convert_to = "Convertir dans {0}";
m.menu_discard = "Abandonner et recommencer";
m.menu_run_locally = "Lancer le test localement";
m.menu_run_on_rc = "Lancer sur un serveur Selenium"; 
m.menu_run_suite_locally = "Lancer la suite localement";
m.menu_run_suite_on_rc = "Lancer la suite sur un serveur Selenium";
m.menu_suite_remove_script = "Supprimer le script courant";
m.menu_add_script_from_file = "Ajouter un script depuis un fichier";
m.menu_record_new_script = "Enregistrer un nouveau script";
m.menu_discard_suite = "Abandonner la suite";
m.menu_save_suite = "Sauvegarder la suite";
m.menu_save_suite_as = "Sauvegarder la suite en tant que...";
m.menu_save_suite_to = "Sauvegarder la suite dans {0}";
m.menu_export_suite = "Export...";
m.menu_debug = "Debug";
m.menu_disable_breakpoints = "Désactiver les points d'arrêt";
m.menu_enable_breakpoints = "Activer les points d'arrêt";
m.menu_clear_breakpoints = "Supprimer tous les points d'arrêt";
m.menu_playback_variables = "variables de rejeu...";
m.clear_breakpoints_confirm = "Etes-vous sûr de vouloir effacer tous les points d'arrêt dans le script actuel?";
m.lose_changes_warning = "Si vous poursuivez, vous allez perdre toutes vos modifications récentes.";

// Variables
m.variables = "Variables";

// Script
m.untitled_script = "Sans nom Script";

// Step display
m.suite_has_unsaved_changes = "La suite a des changements non sauvegardés.";
m.suite_cannot_save_unsaved_scripts = "Sauvegarde de la suite impossible: veuillez commencer par sauvegarder tous les scripts.";
m.cannot_save_suite_due_to_mixed_versions = "Sauvegarde de la suite impossible: tous les scripts doivent être au même version de Selenium.";
m.stop_playback = "Arrêter le rejeu";
m.continue_playback = "Continuer";
m.stopping = "Arrêt en cours...";
m.clear_results = "Effacer les résultats";
m.connecting = "Connexion en cours...";
m.record_verification = "Enregistrer une vérification";
m.stop_recording = "Arrêter l'enregistrement";

// Convert dialog
m.script_conversion = "Conversion";
m.the_following_steps_cant_be_converted = "Les commandes suivantes ne peuvent pas être converties";

// Export dialog
m.choose_export_format = "Choisir le format d'export";
m.sel2_unsaveable_steps = "Le script contient des commandes qui ne peuvent pas (encore) être sauvegardées en tant que script Selenium 2";
m.save = "Sauvegarder";
m.unsupported_steps = "Non supporté";
m.export_as_X_to_Y = "Export en tant que {0} dans {1}";
m.save_as_X = "Sauvegarder en tant que {0}";

// RC dialog
m.run_script = "Lancer";
m.selenium_rc_settings = "Paramètres Selenium RC";
m.rc_server_host_port = "Hôte:Port du serveur RC";
m.rc_browser_string = "Navigateur";
m.rc_browser_version = "Version du navigateur";
m.rc_platform = "Platforme";

// Record dialog
m.start_recording_new_script_at = "Commencer l'enregistrement d'un nouveau script à partir de";

// Run all dialog
m.view_run_result = "Voir les résultats";
m.running_scripts = "Scripts en cours...";
m.stop = "Arrêter";
m.close = "Fermer";
m.done_exclamation = "Terminé!";

// Suite
m.cant_save_suite_must_save_as_html = "Sauvegarde de la suite impossible. Veuillez commencer par sauvegarder tous les scripts de test au format HTML.";

// Gui
m.unsaved_changes_warning = "Toutes les modifications non sauvegardées vont être perdues!";

// UI
m.unable_to_read_file = "Lecture du fichier impossible, désolé.";
m.select_a_file = "Sélectionner un Fichier";

// Record
m.record_invalid_url = "L'URL est invalide et la page ne peut être chargée.";

// Sel 1
m.sel1_could_not_open_suite_script = "Ouverture de la suite impossible: Ouverture du fichier impossible {0}";
m.sel1_couldnt_save_suite = "Sauvegarde de la suite impossible:\n{0}";
m.sel1_couldnt_export_script = "Export du script impossible:\n{0}";
m.sel1_playback_failed = "Echec";
m.sel1_unknown_failure_reason = "Erreur inconnue";
m.sel1_test_stopped = "Test arrêté";

// Sel 2
m.save_as = "Enregistrer sous...";
m.sel2_cant_export_step_type = "Impossible d'exporter l'étape du type \"{0}\".";
m.sel2_variable_not_set = "Variable non configurée: {0}.";
m.sel2_text_not_present = "Texte absent.";
m.sel2_body_text_does_not_match = "Le contenu de l'élément \"Body\" ne correspond pas.";
m.sel2_element_not_found = "Element non trouvé.";
m.sel2_source_does_not_match = "Le code source ne correspond pas.";
m.sel2_element_text_does_not_match = "L'élément textuel ne correspond pas.";
m.sel2_url_does_not_match = "L'URL ne correspond pas.";
m.sel2_title_does_not_match = "L'élément \"Title\" ne correspond pas.";
m.sel2_element_not_selected = "Elément non sélectionné.";
m.sel2_element_value_doesnt_match = "La valeur de l'élément ne correspond pas.";
m.sel2_attribute_value_doesnt_match = "La valeur de l'attribut ne correspond pas.";
m.sel2_cookie_value_doesnt_match = "La valeur du cookie ne correspond pas.";
m.sel2_no_cookie_found = "Aucun cookie trouvé avec ce nom.";
m.sel2_step_not_implemented_for_playback = "{0} non implementé(e) pour le rejeu.";
m.sel2_alert_text_does_not_match = "texte d'alerte \"{0}\" ne correspond pas à \"{1}\".";
m.sel2_no_alert_present = "pas d'alerte presente.";
m.sel2_is = "est";
m.sel2_true = "vrai";
m.sel2_false = "faux";
m.sel2_untitled_run = "Sans titre";
m.sel2_server_error = "Erreur serveur";
m.sel2_must_playback_in_foreground = "Remarque: Lors du rejeu, la fenêtre active doit rester au premier plan.";
m.sel2_eval_false = "le résultat de l'évaluation \"{0}\" ne correspond pas à \"{1}\".";

// Step display
m.param_expr_info = "<br>Parameter expressions of the form <i>${varname}</i> are replaced by the contents of the variable <i>varname</i>";
m.negate_assertion_or_verification = "Assertion négative/vérification";
m.find_a_different_target = "Trouver une cible différente";
m.suggested_locator_alternatives = "Suggestions alternatives:";
m.step_edit_type = "Editer la commande";
m.step_delete = "Supprimer la commande";
m.step_new_above = "Ajouter une commande avant";
m.step_new_below = "Ajouter une commande après";
m.step_copy = "Copier";
m.step_cut = "Couper";
m.step_paste = "Coller";
m.step_run = "Lancer la commande";
m.step_run_from_here = "Lancer depuis cette commande";
m.step_run_to_here = "Lancer jusqu'à cette commande";
m.step_add_breakpoint = "Ajouter un point d'arrêt";
m.step_remove_breakpoint = "Supprimer un point d'arrêt";
m.playback_not_supported_warning = "Attention: le rejeu n'est pas supporté pour ce type de commande";
m.edit_p = "Editer {0}";
m.not = "non";
m.find = "Trouver";

// IO
m.script_is_empty = "Script est vide.";
m.suite_is_empty = "Suite est vide.";
m.suite = "Suite";
m.could_not_open_suite = "Ouverture de la suite impossible";


// Selenium 1 Categories
m.action_cat = "action";
m.assertion_cat = "assertion";
m.wait_cat = "attente";
m.other_cat = "autre";
m.store_cat = "stocke";
m.clicks_cat = "clics";
m.mouse_events_cat = "événements de souris";
m.keyboard_events_cat = "événements clavier";
m.keyboard_modifiers_cat = "saisies clavier";
m.form_fields_cat = "formulaire";
m.browsing_cat = "navigation";
m.popups_and_menus_cat = "popups et menus";
m.page_content_cat = "contenu";
m.page_positioning_cat = "positionnement";
m.popups_cat = "popups";
m.browser_window_cat = "navigation entre fenêtres";
m.selenium_cat = "selenium";
m.cookies_cat = "cookies";
m.common_cat = "commun";
m.selenium_settings_cat = "préférences";
m.screenshots_cat = "captures d'écran";
m.cookies_cat = "cookies";
m.special_cat = "special";
m.extensions_cat = "extensions";

// Selenium 2 Categories
m.navigation_sel2_cat = "Navigation";
m.input_sel2_cat = "Evênements";
m.misc_sel2_cat = "Autre";
m.assertion_sel2_cat = "Assertion";
m.verify_sel2_cat = "Vérification";
m.wait_sel2_cat = "Attente";
m.store_sel2_cat = "Affectation";


// Selenium 2 step types
m.step_get = "Ouvrir la page";
m.step_goBack = "Reculer d'une page";
m.step_goForward = "Avancer d'une page";
m.step_clickElement = "Cliquer";
m.step_setElementText = "Coller le texte";
m.step_sendKeysToElement = "Saisir";
m.step_clickElementWithOffset = "Cliquer-déplacer";
m.step_doubleClickElement = "Double-cliquer";
m.step_mouseOverElement = "Positionner le curseur";
m.step_dragToAndDropElement = "Glisser-Déposer";
m.step_clickAndHoldElement = "Cliquer sans lâcher";
m.step_releaseElement = "Rélâcher";
m.step_setElementSelected = "Sélectionner";
m.step_clearSelections = "Tout désélectionner";
m.step_setElementNotSelected = "Désélectionner";
m.step_submitElement = "Soumettre le formulaire";
m.step_close = "Fermer la page";
m.step_refresh = "Raffraichir la page";
m.step_assertTextPresent = "Vérifier la présence du texte (bloquant)";
m.step_verifyTextPresent = "Vérifier la présence du texte";
m.step_waitForTextPresent = "Attendre la présence du texte";
m.step_storeTextPresent = "Affecter la présence du texte";
m.step_assertBodyText = "Vérifier le document (bloquant)";
m.step_verifyBodyText = "Vérifier le document";
m.step_waitForBodyText = "Attendre le document";
m.step_storeBodyText = "Affecter le document";
m.step_assertElementPresent = "Vérifier la balise (bloquant)";
m.step_verifyElementPresent = "Vérifier la balise";
m.step_waitForElementPresent = "Attendre la balise";
m.step_storeElementPresent = "Affecter la balise";
m.step_assertPageSource = "Vérifier le code source (bloquant)";
m.step_verifyPageSource = "Vérifier le code source";
m.step_waitForPageSource = "Attendre le code source";
m.step_storePageSource = "Affecter le code source";
m.step_assertText = "Vérifier le contenu de la balise (bloquant)";
m.step_verifyText = "Vérifier le contenu de la balise";
m.step_waitForText = "Attendre le contenu de la balise";
m.step_storeText = "Affecter le contenu de la balise";
m.step_assertCurrentUrl = "Vérifier l'URL (bloquant)";
m.step_verifyCurrentUrl = "Vérifier l'URL";
m.step_waitForCurrentUrl = "Attendre la page";
m.step_storeCurrentUrl = "Affecter l'URL";
m.step_assertTitle = "Vérifier le titre (bloquant)";
m.step_verifyTitle = "Vérifier le titre";
m.step_waitForTitle = "Attendre le titre";
m.step_storeTitle = "Affecter le titre";
m.step_assertElementAttribute = "Vérifier l'attribut d'une balise(bloquant)";
m.step_verifyElementAttribute = "Vérifier l'attribut d'une balise";
m.step_waitForElementAttribute = "Attendre l'attribut d'une balise";
m.step_storeElementAttribute = "Affecter l'attribut d'une balise";
m.step_assertElementSelected = "Vérifier la sélection (bloquant)";
m.step_verifyElementSelected = "Vérifier la sélection";
m.step_waitForElementSelected = "Attendre la sélection";
m.step_storeElementSelected = "Affecter la sélection";
m.step_assertElementValue = "Vérifier la valeur d'un composant (bloquant)";
m.step_verifyElementValue = "Vérifier la valeur d'un composant";
m.step_waitForElementValue = "Attendre la valeur d'un composant";
m.step_storeElementValue = "Affecter la valeur d'un composant";
m.step_addCookie = "Ajouter un cookie";
m.step_deleteCookie = "Supprimer un cookie";
m.step_assertCookieByName = "Vérifier le contenu du cookie (bloquant)";
m.step_verifyCookieByName = "Vérifier le contenu du cookie";
m.step_waitForCookieByName = "Attendre le contenu du cookie";
m.step_storeCookieByName = "Affecter le contenu du cookie";
m.step_assertCookiePresent = "Vérifier (bloquant)";
m.step_verifyCookiePresent = "Vérifier la présence du cookie";
m.step_waitForCookiePresent = "Attendre la présence du cookie";
m.step_storeCookiePresent = "Affecter la présence du cookie";
m.step_saveScreenshot = "Effectuer une capture d'écran";
m.step_switchToFrame = "Changer de cadre (FRAME)";
m.step_switchToFrameByIndex = "Changer de cadre (FRAME) par index";
m.step_switchToWindow = "Changer de fenêtre ou d'onglet";
m.step_switchToDefaultContent = "Revenir au cadre principal";
m.step_print = "Afficher la donnée";
m.step_store = "Affecter le texte";
m.step_pause = "Effectuer une pause";
m.step_assertAlertText = "Vérifier le message d'alerte (bloquant)";
m.step_verifyAlertText = "Vérifier le message d'alerte";
m.step_waitForAlertText = "Attendre le message d'alerte";
m.step_storeAlertText = "Affecter le message d'alerte";
m.step_assertAlertPresent = "Vérifier la présence d'une alerte (bloquant)";
m.step_verifyAlertPresent = "Vérifier la présence d'une alerte ";
m.step_waitForAlertPresent = "Attendre l'affichage d'une alerte ";
m.step_storeAlertPresent = "Affecter la présence d'une alerte ";
m.step_assertEval = "Vérifier le script (bloquant)";
m.step_verifyEval = "Vérifier le script";
m.step_waitEval = "Attendre la fin du script";
m.step_storeEval = "Affecter le résultat du script";
m.step_answerAlert = "Compléter la boite de dialogue";
m.step_acceptAlert = "Acquitter la boite de dialogue";
m.step_dismissAlert = "Répudier la boite de dialogue";
m.p_attributeName = "Attribut";
m.p_file = "Fichier";
m.p_locator = "Localisation";
m.p_name = "Nom";
m.p_offset = "Déplacement";
m.p_options = "Options";
m.p_source = "Source";
m.p_targetLocator = "Cible";
m.p_text = "Texte";
m.p_title = "Titre";
m.p_url = "URL";
m.p_value = "Valeur";
m.p_variable = "Variable";
m.p_waitTime = "délais d'attente";
m.p_identifier = "Identifiant";
m.p_index = "Index";
