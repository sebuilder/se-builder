var m = {};
builder.translate.addLocale({'name':'fr-FR', 'title': "Français", 'mapping': m});

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
m.plugin_cancel_install = "Annuler l'installation";
m.plugin_uninstall = "Désinstaller";
m.plugin_cancel_uninstall = "Annuler la désinstallation";
m.plugin_update = "Mettre à jour";
m.plugin_cancel_update = "Annuler la mise à jour";
m.plugin_enable = "Activer";
m.plugin_disable = "Désactiver";
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

// Menus
m.menu_file = "Fichier";
m.menu_record = "Enregistrer";
m.menu_run = "Lancer";
m.menu_suite = "Suite";
m.menu_save = "Sauvegarder";
m.menu_convert = "Convertir dans une autre version...";
m.menu_discard = "Abandonner et recommencer";
m.menu_run_locally = "Lancer le test localement";
m.menu_run_on_rc = "Lancer sur un serveur Selenium"; 
m.menu_run_suite_locally = "Lancer la suite localement";
m.menu_run_suite_on_rc = "Lancer la suite sur un serveur Selenium";
m.menu_suite_remove_script = "Supprimer le script courant";
m.menu_add_script_from_file = "Ajouter un script depuis un fichier";
m.menu_record_new_script = "Enregistrer un nouveau script";
m.menu_discard_suite = "Abandonner et recommencer";
m.menu_save_suite = "Sauvegarder la suite";
m.menu_save_suite_as = "Sauvegarder la suite en tant que...";
m.lose_changes_warning = "Si vous poursuivez, vous allez perdre toutes vos modifications récentes.";

// Script
m.untitled_script = "Sans nom Script";

// Step display
m.suite_has_unsaved_changes = "La suite a des changements non sauvegardés.";
m.suite_cannot_save_unsaved_scripts = "Sauvegarde de la suite impossible: veuillez commencer par sauvegarder tous les scripts au format HTML.";
m.cannot_save_suite_due_to_mixed_versions = "Sauvegarde de la suite impossible: tous les scripts doivent être au format Selenium 1.";
m.stop_playback = "Arrêter le rejeu";
m.stopping = "Arrêt en cours...";
m.clear_results = "Effacer les résultats";
m.connecting = "Connection en cours...";
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
m.save_as_X_to_Y = "Sauvegarder en tant que {0} dans {1}";

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
m.cant_save_suite_must_be_sel1 = "Sauvegarde de la suite impossible: Tous les scripts de la suite doivent être au format Selenium 1.";

// Gui
m.unsaved_changes_warning = "Toutes les modifications non sauvegardées vont être perdues!";

// UI
m.unable_to_read_file = "Lecture du fichier impossible, désolé.";
m.select_a_file = "Sélectionner un Fichier";

// Record
m.record_invalid_url = "L'URL est invalide et la page ne peut être chargée.";

// Sel 1
m.sel1_could_not_open_suite_script = "Ouverture de la suite impossible: Ouverture du fichier impossible {0}";
m.sel1_couldnt_save_suite = "Sauvegarde de la suite impossible.";
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
m.sel2_is = "est";
m.sel2_true = "vrai";
m.sel2_false = "faux";
m.sel2_untitled_run = "Sans titre";
m.sel2_server_error = "Erreur serveur";

// Step display
m.param_expr_info = "<br>Parameter expressions of the form <i>${varname}</i> are replaced by the contents of the variable <i>varname</i>";
m.negate_assertion_or_verification = "Assertion négative/vérification";
m.find_a_different_target = "Trouver une cible différente";
m.suggested_locator_alternatives = "Suggestions alternatives:";
m.step_edit_type = "Editer la commande";
m.step_delete = "Supprimer la commande";
m.step_new_above = "Ajouter une commande avant";
m.step_new_below = "Ajouter une commande après";
m.step_run = "Lancer la commande";
m.step_run_from_here = "Lancer depuis cette commande";
m.step_run_to_here = "Lancer jusqu'à cette commande";
m.playback_not_supported_warning = "Attention: le rejeu n'est pas supporté pour ce type de commande";
m.edit_p = "Editer {0}";
m.not = "non";

