var m = {};
builder.translate.addLocale({'name':'pt-br', 'title': "Português brasileiro", 'mapping': m});

// General
m.ok = "OK";
m.cancel = "Cancelar";

// Locale selection GUI
m.select_locale = "Selecionar idioma";
m.new_locale_after_restart = "O idioma irá mudar após reiniciar o Builder.";

// Startup view
m.open_script_or_suite = "Abrir um script ou suíte";
m.view_command_table = "Ver comandos suportados para Selenium 1 e 2";
m.manage_plugins = "Gerenciar plugins";
m.start_recording_at = "Começar gravando em";
m.cookie_warning = "Isto irá limpar todos os cookies para o domínio que você está gravando.";

// Steps table
m.steps_table = "Tabela de Passos";
m.show_step_type_orphans = "Mostrar passos de Selenium 1 sem correspondentes de Selenium 2.";
m.step_name = "Nome";
m.sel_1_translation = "Tradução Selenium 1";
m.negatable = "Negável";
m.local_playback_available = "Playback Local";
m.yes = "sim"; // Sim quer dizer sim.
m.no = "não";   // Não quer dizer não.
               // Ó não! Política no nosso código fonte!

// Plugins
m.plugins_title = "Plugins";
m.plugins_back = "Voltar";
m.plugins_refresh = "Atualizar";
m.plugins_reboot = "Reiniciar o Builder";
m.plugins_loading = "Carregando...";
m.plugins_downloading = "Baixando...";
m.plugin_disabled = "Desabilitado";
m.plugin_installed = "Instalado";
m.plugin_installed_to_enable = "Instalado, Habilitado após reiniciar";
m.plugin_installed_to_disable = "Instalado, Desabilitado após reiniciar";
m.plugin_not_installed = "Não instalado";
m.plugin_to_install = "Instalado após reiniciar";
m.plugin_to_uninstall = "Desinstalado após reiniciar";
m.plugin_to_update = "Instalado, atualizado após reiniciar";
m.plugin_update_available = ", atualização para a versão {0} disponível";
m.plugin_install = "Instalar";
m.plugin_install_and_reboot = "Instalar e Reiniciar";
m.plugin_cancel_install = "Cancelar Instalação";
m.plugin_uninstall = "Desinstalar";
m.plugin_uninstall_and_reboot = "Desinstalar e Reiniciar";
m.plugin_cancel_uninstall = "Cancelar Desinstalação";
m.plugin_update = "Atualizar";
m.plugin_update_and_reboot = "Atualizar e Reiniciar";
m.plugin_cancel_update = "Cancelar Atualização";
m.plugin_enable = "Habilitar";
m.plugin_enable_and_reboot = "Habilitar e Reiniciar";
m.plugin_disable = "Desabilitar";
m.plugin_disable_and_reboot = "Desabilitar e Reiniciar";
m.plugin_list_too_new = "O formato de dados da lista de plugins é muito recente. Por favor atualize o Builder.";
m.unable_to_fetch_plugins = "Impossível baixar os plugins";
m.plugin_load_timed_out = "Time out ao carregar.";
m.plugin_url_not_found = "não encontrado";
m.plugin_missing_dir = "O diretório de plugins {0} está faltando.";
m.plugin_not_a_dir = "O diretório de plugins em {0} não é um diretório, é um arquivo.";
m.plugin_header_missing = "Cabeçalho do plugin em {0} está faltando.";
m.plugin_header_not_file = "Cabeçalho do plugin em {0} não é um arquivo.";
m.plugin_header_file_corrupted = "Arquivo de cabeçalho em {0} está corrompido, tem um erro de sintaxe, ou não é um arquivo JSON: {1}";
m.plugin_header_file_no_version = "Arquivo de cabeçalho em {0} não tem a versão do cabeçalho.";
m.plugin_builder_too_old = "Esta versão do Builder é muito antiga para usar este plugin. Por favor atualize para a versão mais recente.";
m.plugin_id_mismatch = "O ID do plugin no cabeçalho ({0}) não confere com o ID ({1}).";
m.plugin_version_invalid = "A versão do plugin é inválida.";
m.plugin_cant_verify = "Não foi possível verificar o plugin: {0}";
m.plugin_unable_to_install = "Não foi possível instalar {0}: {1}";
m.plugin_unable_to_uninstall = "Não foi possível desinstalar {0}: {1}";
m.plugin_disabled_builder_too_old = "Plugin desabilitado \"{0}\": Esta versão do Builder é muito antiga para este plugin.\nVersão mínima suportada do Builder: {1}. Versão atual do Builder: {2}.\nPor favor atualize o Builder, e então habilite novamente o plugin.";
m.plugin_disabled_builder_too_new = "Plugin desabilitado \"{0}\": Esta versão do plugin é muito antiga.\nVersão máxima suportada do Builder: {1}. Versão atual do Builder: {2}.\nTente atualizar o plugin.";
m.cant_update_builder_too_old = ", atualização para a versão {0} não pode ser aplicada: O Builder não está atualizado";
m.cant_update_builder_too_new = ", atualização para a versão {0} não pode ser aplicada: O plugin é muito antigo";
m.cant_install_builder_too_old = "; não foi possível instalar: O Builder não está atualizado";
m.cant_install_builder_too_new = "; não foi possível instalar: O plugin é muito antigo";
m.updates_available = "Atualizações Disponíveis";
m.plugin_download_failed = "O download do plugin falhou.";

// Menus
m.menu_file = "Arquivo";
m.menu_record = "Gravar";
m.menu_run = "Executar";
m.menu_suite = "Suíte";
m.menu_save = "Salvar";
m.menu_save_to = "Salvar em {0}";
m.menu_save_as = "Salvar como...";
m.menu_export = "Exportar...";
m.menu_convert = "Converter para outra versão...";
m.menu_convert_to = "Converter para {0}";
m.menu_discard = "Descartar e começar novamente";
m.menu_run_locally = "Executar teste localmente";
m.menu_run_on_rc = "Executar em um servidor Selenium";
m.menu_run_suite_locally = "Executar suíte localmente";
m.menu_run_suite_on_rc = "Executar suíte em um servidor Selenium";
m.menu_suite_remove_script = "Remover o script atual";
m.menu_add_script_from_file = "Adicionar script do arquivo";
m.menu_record_new_script = "Gravar novo script";
m.menu_discard_suite = "Descartar suíte";
m.menu_save_suite = "Salvar suíte";
m.menu_save_suite_as = "Salvar suíte como...";
m.menu_save_suite_to = "Salvar suíte em {0}";
m.menu_export_suite = "Exportar suíte";

m.lose_changes_warning = "Se você continuar, você irá perder todas as suas alterações recentes.";
m.menu_debug = "Debug";
m.menu_disable_breakpoints = "√ Habilitar breakpoints";
m.menu_enable_breakpoints = "Habilitar breakpoints";
m.menu_clear_breakpoints = "Apagar todos os breakpoints";
m.clear_breakpoints_confirm = "Tem certeza que você deseja apagar todos os breakpoints do script atual?";
m.menu_playback_variables = "Variáveis de playback...";
m.menu_share_state_across_suite = "Compartilhar o estado ao longo da suíte";
m.menu_dont_share_state_across_suite = "√ Compartilhar o estado ao longo da suíte";
m.variables = "Variáveis";

// Script
m.untitled_script = "Script sem título";

// Step display
m.suite_has_unsaved_changes = "A Suíte tem alterações não salvas.";
m.suite_cannot_save_unsaved_scripts = "Não é possível salvar a suíte: Salve todos os scripts primeiro.";
m.cannot_save_suite_due_to_mixed_versions = "Não é possível salvar a suíte: Todos os scripts devem ser scripts de Selenium 1 ou Selenium 2.";
m.stop_playback = "Parar o Playback";
m.continue_playback = "Continuar";
m.stopping = "Parando...";
m.clear_results = "Limpar resultados";
m.connecting = "Conectando...";
m.record_verification = "Gravar uma verificação";
m.stop_recording = "Parar de gravar";
m.record_mouseovers = "Gravar mouseovers";

// Convert dialog
m.script_conversion = "Conversão";
m.the_following_steps_cant_be_converted = "Os seguintes passos não podem ser convertidos";

// Export dialog
m.choose_export_format = "Escolha o formato de exportação";
m.sel2_unsaveable_steps = "Este script contém passos que não podem ser salvos como Selenium 2 ainda";
m.save = "Salvar";
m.unsupported_steps = "Não suportado";
m.export_as_X_to_Y = "Exportar como {0} em {1}";
m.save_as_X = "Salvar como {0}";

// RC dialog
m.run_script = "Executar";
m.selenium_rc_settings = "Configurações do Selenium Server";
m.rc_server_host_port = "Host:Porta do Selenium Server";
m.rc_browser_string = "String do Browser";
m.rc_browser_version = "Versão do Browser";
m.rc_platform = "Platforma";

// Record dialog
m.start_recording_new_script_at = "Começar a gravar um novo script em";

// Run all dialog
m.view_run_result = "Ver Resultado";
m.running_scripts = "Rodando scripts...";
m.stop = "Parar";
m.close = "Fechar";
m.done_exclamation = "Pronto!";

// Suite
m.cant_save_suite_must_save_as_html = "Não é possível salvar a suíte. Por favor salve todos os scripts de teste para o disco como HTML primeiro.";

// Gui
m.unsaved_changes_warning = "Qualquer alteração não salva será perdida!";

// UI
m.unable_to_read_file = "Não foi possível ler o arquivo.";
m.select_a_file = "Selecione um Arquivo";

// Record
m.record_invalid_url = "A URL não é válida e não pode ser carregada.";

// Sel 1
m.sel1_could_not_open_suite_script = "Não foi possível abrir a suíte: Não foi possível abrir o script {0}";
m.sel1_couldnt_save_suite = "Não foi possível salvar a suíte:\n{0}";
m.sel1_couldnt_export_script = "Não foi possível exportar o script:\n{0}";
m.sel1_playback_failed = "Falhou";
m.sel1_unknown_failure_reason = "Motivo de falha desconhecido";
m.sel1_test_stopped = "O teste parou";

// Sel 2
m.save_as = "Salvar como...";
m.sel2_cant_export_step_type = "Não é possível exportar o passo do tipo \"{0}\".";
m.sel2_variable_not_set = "Variável não definida: {0}.";
m.sel2_text_not_present = "Texto não presente.";
m.sel2_body_text_does_not_match = "O texto do corpo não confere.";
m.sel2_element_not_found = "Elemento não encontrado.";
m.sel2_source_does_not_match = "O código não confere.";
m.sel2_element_text_does_not_match = "O texto do elemento não confere.";
m.sel2_url_does_not_match = "A URL não confere.";
m.sel2_title_does_not_match = "O título não confere.";
m.sel2_element_not_selected = "Elemento não selecionado.";
m.sel2_element_value_doesnt_match = "O valor do elemento não confere.";
m.sel2_attribute_value_doesnt_match = "O valor do atributo não confere.";
m.sel2_cookie_value_doesnt_match = "O valor do cookie não confere.";
m.sel2_no_cookie_found = "Não foi encontrado nenhum cookie com este nome.";
m.sel2_step_not_implemented_for_playback = "{0} não implementado para playback.";
m.sel2_alert_text_does_not_match = "O texto do alerta não confere.";
m.sel2_no_alert_present = "Nenhum alerta presente.";
m.sel2_is = "é";
m.sel2_true = "verdadeiro";
m.sel2_false = "falso";
m.sel2_untitled_run = "Sem Título";
m.sel2_server_error = "Erro do Servidor";
m.sel2_must_playback_in_foreground = "Nota: É necessário deixar a janela de playback em primeiro plano durante o playback local.";
m.sel2_eval_failed = "A avaliação do script falhou.";
m.sel2_eval_false = "Resultado da avaliação \"{0}\" não confere com \"{1}\".";

// Step display
m.param_expr_info = "<br>Expressões de parâmetro no formato <i>${varname}</i> são substituídos pelo conteúdo da variável <i>varname</i>";
m.negate_assertion_or_verification = "Negar asserção/verificação";
m.find_a_different_target = "Encontrar alvo diferente";
m.suggested_locator_alternatives = "Alternativas sugeridas:";
m.step_edit_type = "editar tipo";
m.step_delete = "apagar passo";
m.step_new_above = "novo passo acima";
m.step_new_below = "novo passo abaixo";
m.step_copy = "copiar";
m.step_cut = "cortar";
m.step_paste = "colar";
m.step_record_before = "gravar antes";
m.step_record_after = "gravar depois";
m.step_run = "executar passo";
m.step_run_from_here = "executar daqui";
m.step_run_to_here = "executar até aqui";
m.step_add_breakpoint = "adicionar breakpoint";
m.step_remove_breakpoint = "remover breakpoint";
m.playback_not_supported_warning = "Aviso: playback não suportado para este tipo de passo.";
m.edit_p = "editar {0}";
m.not = "não";
m.find = "Encontrar";

// IO
m.script_is_empty = "O script está vazio.";
m.suite_is_empty = "A suíte está vazia.";
m.suite = "Suite";
m.could_not_open_suite = "Não foi possível abrir a suíte";

// Selenium 1 Categories
m.action_cat = "ação";
m.assertion_cat = "asserção";
m.wait_cat = "espera";
m.other_cat = "outro";
m.store_cat = "gravação";
m.clicks_cat = "cliques";
m.mouse_events_cat = "eventos do mouse";
m.keyboard_events_cat = "eventos do teclado";
m.keyboard_modifiers_cat = "modificadores do teclado";
m.form_fields_cat = "campos de formulário";
m.browsing_cat = "navegação";
m.popups_and_menus_cat = "popups e menus";
m.page_content_cat = "conteúdo da página";
m.page_positioning_cat = "posicionamento da página";
m.popups_cat = "popups";
m.browser_window_cat = "janela do browser";
m.form_fields_cat = "campos do formulário";
m.selenium_cat = "selenium";
m.cookies_cat = "cookies";
m.common_cat = "comum";
m.selenium_settings_cat = "configurações do selenium";
m.screenshots_cat = "screenshots";
m.cookies_cat = "cookies";
m.special_cat = "especial";
m.extensions_cat = "extensões";

// Selenium 2 Categories
m.navigation_sel2_cat = "Navegação";
m.input_sel2_cat = "Entrada";
m.misc_sel2_cat = "Etc";
m.assertion_sel2_cat = "Asserção";
m.verify_sel2_cat = "Verificação";
m.wait_sel2_cat = "Espera";
m.store_sel2_cat = "Gravação";
m.menu_data = "Dados";
m.no_source = "Sem Dados";
m.manual_entry = "Entrada Manual";
m.json_file_path = "Caminho do arquivo JSON";
m.xml_file_path = "Caminho do arquivo XML";
m.row = "Linha {0}";
m.inputs = "Entradas";
m.string = "String";
m.integer = "Inteiro";
m.int = "Inteiro";



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
