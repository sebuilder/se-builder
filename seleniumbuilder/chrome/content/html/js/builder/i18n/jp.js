var m = {};
builder.translate.addLocale({'name':'jp', 'title': "Japanese", 'mapping': m});

// General
m.ok = "OK";
m.cancel = "キャンセル";

// Locale selection GUI
m.select_locale = "言語を選択";
m.new_locale_after_restart = "再起動後に言語が変わります";

// Startup view
m.open_script_or_suite = "スクリプトかスイートを開く";
m.view_command_table = "Selenium1と2でサポートされているコマンドの表示";
m.manage_plugins = "プラグイン管理"
m.start_recording_at = "記録の開始";
m.cookie_warning = "記録しているすべてのCookieを削除します。";

// Steps table
m.steps_table = "ステップテーブル";
m.show_step_type_orphans = "Selenium2に対応していないSelenium1のステップを表示する。";
m.step_name = "名前";
m.sel_1_translation = "Selenium 1 Translation";
m.negatable = "Negatable";
m.local_playback_available = "ローカル再生";
m.yes = "yes"; // Yes means yes.
m.no = "no";   // No means no.
               // Oh no! Politics in our source code!

// Plugins
m.plugins_title = "プラグイン";
m.plugins_back = "戻る";
m.plugins_refresh = "更新";
m.plugins_reboot = "再起動";
m.plugins_loading = "ロード中...";
m.plugins_downloading = "ダウンロード中...";
m.plugin_disabled = "無効";
m.plugin_installed = "インストールされました";
m.plugin_installed_to_enable = "インストールされました。再起動後に有効になります。";
m.plugin_installed_to_disable = "インストールされました。再起動後に無効になります。";
m.plugin_not_installed = "インストールされていません";
m.plugin_to_install = "再起動後にインストール";
m.plugin_to_uninstall = "再起動後にアンインストール";
m.plugin_to_update = "インストールされました。再起動後に更新されます";
m.plugin_update_available = ", バージョン {0} に更新可能です";
m.plugin_install = "インストール";
m.plugin_install_and_reboot = "インストールと再起動";
m.plugin_cancel_install = "インストールのキャンセル";
m.plugin_uninstall = "アンインストール";
m.plugin_uninstall_and_reboot = "アンイストールと再起動";
m.plugin_cancel_uninstall = "アンインストールのキャンセル";
m.plugin_update = "更新";
m.plugin_update_and_reboot = "更新と再起動";
m.plugin_cancel_update = "更新のキャンセル";
m.plugin_enable = "有効";
m.plugin_enable_and_reboot = "有効と再起動";
m.plugin_disable = "無効";
m.plugin_disable_and_reboot = "無効と再起動";
m.plugin_list_too_new = "プラグインリストのデータ形式に対応していません。Builderを更新してください。";
m.unable_to_fetch_plugins = "プラグインを取得出来ません";
m.plugin_url_not_found = "見つかりません";
m.plugin_missing_dir = "{0} のプラグインディレクトリが見つかりません。";
m.plugin_not_a_dir = "{0} はプラグインディレクトリではなく、ファイルです。";
m.plugin_header_missing = "{0} のプラグインヘッダーが見つかりません。";
m.plugin_header_not_file = "{0} のプラグインヘッダーはファイルではありません。";
m.plugin_header_file_corrupted = "{0} のヘッダーファイルが破損しているか、構文エラーまたはJSONファイルではありません。: {1}";
m.plugin_header_file_no_version = "{0} のヘッダーにヘッダーバージョンがありません。";
m.plugin_builder_too_old = "Builderのバージョンがこのプラグインに対応していません。Builderを更新してください。";
m.plugin_id_mismatch = "({0}) のヘッダーのプラグインIDが予想値の({1}) と一致しません。";
m.plugin_cant_verify = "プラグインが見つかりません: {0}";
m.plugin_unable_to_install = "{0} をインストールできません: {1}";
m.plugin_unable_to_uninstall = "{0} をアンインストールできません: {1}";
m.plugin_disabled_builder_too_old = "Disabled plugin \"{0}\": Bulderのバージョンがプラグインに対応していません。.\n対応バージョン: {1} 現在のバージョン: {2}\nBuilderを更新して、プラグインを再度有効にして下さい。";
m.plugin_disabled_builder_too_new = "Disabled plugin \"{0}\": プラグインのバージョンが対応していません。\n対応バージョン: {1}. 現在のバージョン: {2}.\nプラグインを更新してください。";
m.cant_update_builder_too_old = ", バージョン {0} に更新できません。: Builderが最新ではありません";
m.cant_update_builder_too_new = ", バージョン {0} に更新できません。: プラグインが古すぎます";
m.cant_install_builder_too_old = "; インストール出来ません。: Builderが最新ではありません";
m.cant_install_builder_too_new = "; インストール出来ません。: プラグインが古すぎます";
m.updates_available = "利用可能なアップデート";
m.plugin_download_failed = "プラグインのダウンロードに失敗しました。";

// Menus
m.menu_file = "ファイル";
m.menu_record = "記録";
m.menu_run = "実行";
m.menu_suite = "スイート";
m.menu_save = "保存";
m.menu_save_to = "{0} として保存";
m.menu_save_as = "名前をつけて保存";
m.menu_export = "エクスポート";
m.menu_convert = "別バージョンへ変換...";
m.menu_convert_to = "{0} として変換";
m.menu_discard = "破棄して戻る";
m.menu_run_locally = "ローカルでテストを実行";
m.menu_run_on_rc = "Seleniumサーバーで実行";
m.menu_run_suite_locally = "ローカルでスイートを実行";
m.menu_run_suite_on_rc = "Seleniumサーバでスイートを実行";
m.menu_suite_remove_script = "現在のスクリプトを削除する";
m.menu_add_script_from_file = "ファイルからスクリプトを追加";
m.menu_record_new_script = "新しいスクリプトを記録";
m.menu_discard_suite = "スイートを破棄してやり直す";
m.menu_save_suite = "スイートの保存";
m.menu_save_suite_to = "{0} としてスイートを保存";
m.menu_save_suite_as = "名前をつけてスイートを保存";
m.menu_export_suite = "スイートのエクスポート";
m.lose_changes_warning = "続行すると、変更が失われます。";
m.menu_debug = "デバッグ";
m.menu_disable_breakpoints = "ブレークポイントの無効化";
m.menu_enable_breakpoints = "ブレークポイントの有効化";
m.menu_clear_breakpoints = "全てのブレークポイントをクリア";
m.clear_breakpoints_confirm = "現在のスクリプトからすべてのブレークポイントをクリアしてもよろしいですか？";
m.menu_playback_variables = "Playback variables...";

// Variables
m.variables = "Variables";

// Script
m.untitled_script = "無題スクリプト";

// Step display
m.suite_has_unsaved_changes = "スイートに変更が保存されていません。";
m.suite_cannot_save_unsaved_scripts = "スイートを保存出来ません。: 最初に同じ形式ですべてのスクリプトを保存します.";
m.cannot_save_suite_due_to_mixed_versions = "スイートを保存出来ません。: すべてのスクリプトは同じSeleniumのバージョンでなければなりません.";
m.stop_playback = "再生の停止";
m.continue_playback = "続行";
m.stopping = "停止...";
m.clear_results = "結果のクリア";
m.connecting = "接続中...";
m.record_verification = "検証を記録";
m.stop_recording = "記録を停止";

// Convert dialog
m.script_conversion = "変換";
m.the_following_steps_cant_be_converted = "次のステップは変換できません";

// Export dialog
m.choose_export_format = "エクスポート形式の選択";
m.sel2_unsaveable_steps = "このスクリプトは、まだSelenium2として保存することはできないステップが含まれています";
m.save = "保存";
m.unsupported_steps = "Unsupported";
m.export_as_X_to_Y = " {0} を {1}としてエクスポート";
m.save_as_X = "{0} として保存";

// RC dialog
m.run_script = "実行";
m.selenium_rc_settings = "Seleniumサーバー設定";
m.rc_server_host_port = "Selenium Server のホスト:ポート";
m.rc_browser_string = "ブラウザ設定";
m.rc_browser_version = "ブラウザバージョン";
m.rc_platform = "プラットフォーム";

// Record dialog
m.start_recording_new_script_at = "新しいスクリプトの記録を開始";

// Run all dialog
m.view_run_result = "結果の表示";
m.running_scripts = "スクリプトの実行...";
m.stop = "停止";
m.close = "閉じる";
m.done_exclamation = "Done!";

// Suite
m.cant_save_suite_must_save_as_html = "スイートを保存できません。すべてのテストスクリプトを保存してください。";

// Gui
m.unsaved_changes_warning = "未保存の変更は失われます!";

// UI
m.unable_to_read_file = "ファイルを読み込めません。";
m.select_a_file = "ファイルを選択";

// Record
m.record_invalid_url = "URLが有効でありません。";

// Sel 1
m.sel1_could_not_open_suite_script = "スイートを開くことができません:{0} のスクリプトを開くことができません";
m.sel1_couldnt_save_suite = "スイートを保存出来ません:\n{0}";
m.sel1_couldnt_export_script = "スクリプトをエクスポートできません:\n{0}";
m.sel1_playback_failed = "失敗";
m.sel1_unknown_failure_reason = "未知の失敗の理由";
m.sel1_test_stopped = "テストが停止しました";

// Sel 2
m.save_as = "名前をつけて保存";
m.sel2_cant_export_step_type = " \"{0}\"のタイプのステップをエクスポートできません。";
m.sel2_variable_not_set = "変数設定されていません: {0}";
m.sel2_text_not_present = "存在しないテキスト";
m.sel2_body_text_does_not_match = "Bodyテキストが一致していません。";
m.sel2_element_not_found = "要素が見つかりません。";
m.sel2_source_does_not_match = "ソースが一致していません。";
m.sel2_element_text_does_not_match = "要素のテキストが一致していません。";
m.sel2_url_does_not_match = "URLが一致していません。";
m.sel2_title_does_not_match = "タイトルが一致しません。";
m.sel2_element_not_selected = "要素が選択されていません。";
m.sel2_element_value_doesnt_match = "要素の値が一致しません。";
m.sel2_attribute_value_doesnt_match = "属性値が一致しません。";
m.sel2_cookie_value_doesnt_match = "クッキーの値が一致しません。";
m.sel2_no_cookie_found = "この名前でクッキーが見つかりません。";
m.sel2_step_not_implemented_for_playback = "{0} の再生のために実装されていません。";
m.sel2_alert_text_does_not_match = "アラートテキストが一致しません。";
m.sel2_no_alert_present = "警告がありません";
m.sel2_is = "is";
m.sel2_true = "true";
m.sel2_false = "false";
m.sel2_untitled_run = "Untitled";
m.sel2_server_error = "サーバーエラー";
m.sel2_must_playback_in_foreground = "注：ローカル再生中にフォアグラウンドで再生ウィンドウを残しておく必要があります。";
m.sel2_eval_false = "Eval result \"{0}\" does not match \"{1}\".";

// Step display
m.param_expr_info = "<br>フォームのパラメータ表現 <i>${varname}</i> は変数 <i>varname</i>の内容に置換されます";
m.negate_assertion_or_verification = "アサーション/検証を無効";
m.find_a_different_target = "別のターゲットを見つける";
m.suggested_locator_alternatives = "代案:";
m.step_edit_type = "タイプ編集";
m.step_delete = "ステップの削除";
m.step_new_above = "ステップを上に追加";
m.step_new_below = "ステップを下に追加";
m.step_copy = "コピー";
m.step_cut = "切り取り";
m.step_paste = "貼り付け";
m.step_run = "ステップを実行";
m.step_run_from_here = "ここから実行";
m.step_run_to_here = "ここまで実行";
m.step_add_breakpoint = "ブレークポイントの追加";
m.step_remove_breakpoint = "ブレークポイントの削除";
m.playback_not_supported_warning = "警告：このステップタイプでは再生がサポートされません。";
m.edit_p = "{0} を編集";
m.not = "not";
m.find = "Find";

// IO
m.script_is_empty = "スクリプトが空です。";
m.suite_is_empty = "スイートは空です。";
m.suite = "スイート";
m.could_not_open_suite = "スイートを開くことができません";

// Selenium 1 Categories
m.action_cat = "アクション";
m.assertion_cat = "アサーション";
m.wait_cat = "wait";
m.other_cat = "other";
m.store_cat = "store";
m.clicks_cat = "clicks";
m.mouse_events_cat = "マウスイベント";
m.keyboard_events_cat = "キーボードイベント";
m.keyboard_modifiers_cat = "キーボード修飾子";
m.form_fields_cat = "フォームフィールド";
m.browsing_cat = "ブラウジング";
m.popups_and_menus_cat = "ポップアップとメニュー";
m.page_content_cat = "ページコンテンツ";
m.page_positioning_cat = "ページのポジショニング";
m.popups_cat = "ポップアップ";
m.browser_window_cat = "ブラウザウィンドウ";
m.form_fields_cat = "フォームフィールド";
m.selenium_cat = "selenium";
m.cookies_cat = "cookies";
m.common_cat = "common";
m.selenium_settings_cat = "Selenium設定";
m.screenshots_cat = "スクリーンショット";
m.cookies_cat = "クッキー";
m.special_cat = "special";
m.extensions_cat = "extensions";

// Selenium 2 Categories
m.navigation_sel2_cat = "Navigation";
m.input_sel2_cat = "Input";
m.misc_sel2_cat = "Misc";
m.assertion_sel2_cat = "アサーション";
m.verify_sel2_cat = "Verify";
m.wait_sel2_cat = "Wait";
m.store_sel2_cat = "Store";