import React, { useState } from "react";
import TemplateArticleHelp from "../TemplateArticleHelp/TemplateArticleHelp";
// import styles from "../FirstSteeps/FirstSteeps.module.css";
import styles from "../HelpCenter.module.css";
import { ReactComponent as GreenDotsAppIcon } from "../../../assets/GreenDotsAppIcon.svg";

import { ReactComponent as GreenExclamationIcon } from "../../../assets/GreenExclamationIcon.svg";
import { ReactComponent as Lockicon } from "../../../assets/LockIconHelp.svg";
import { ReactComponent as LockiconOpen } from "../../../assets/LockOpenIcon.svg";
import { ReactComponent as MenuNavigationIcon } from "../../../assets/MenuNavigationIcon.svg";
import { ReactComponent as AddTag } from "../../../assets/AddTagIcon.svg";

import { useTranslation } from "react-i18next";
import ParameterNavigation from "../../../components/NavigationPopups/ParameterNavigation/ParameterNavigation";
const Table = ({setSelectedCategory}) => {
  const { t } = useTranslation("helpPage");

  return (
    <div>
      <TemplateArticleHelp
        title={t("dynamic_tables")}
        Icon={GreenDotsAppIcon}
        setSelectedCategory={setSelectedCategory}
        validate={false}

      />
        <div className={styles.SteepCategory}>
  <section id="dynamicTables">
    <h2>{t('dynamic_tables')}</h2>
    
    <p>{t('dynamic_tables_description')}</p>

    <p>{t('tables_as_smart_repositories')}</p>

    <div className={styles.textGray}>{t('what_are_tables_for')}</div>
    <ul>
      <li>{t('structure_info_visually')}</li>
      <li>{t('save_data_from_sources')}</li>
      <li>{t('use_data_as_conditions')}</li>
      <li>{t('query_classify_edit')}</li>
      <li>{t('connect_elements_metrics')}</li>
    </ul>
    <div className={styles.card}>
          <GreenExclamationIcon />
          <div className={styles.cardContent}>
            <p>{t('each_workspace_has_own_tables')}</p>
          </div>
        </div>
  </section>

  <section id="accessAndPermissions">
    <h3>{t('access_and_permissions')}</h3>
    <p>{t('you_can_access_tables_via')}</p>
    <ul >
      <li>{t('sidebar_tables')}</li>
      <li>
        {t('shortcut')}: <kbd>⌘+T</kbd> ({t('mac')}) {t('or')} <kbd>Shift+Ctrl+T</kbd> ({t('windows')})
      </li>
      <li>{t('from_chat_with_mentions')}</li>
    </ul>
    <p>{t('each_workspace_has_own_tables')}</p>

    <div className={styles.textGray}>{t('permissions_by_role')}</div>
    <ul>
      <li><strong>{t('collaborator')}</strong>: {t('collaborator_permissions')}</li>
      <li><strong>{t('editor_admin_owner')}</strong>: {t('editor_admin_owner_permissions')}</li>
    </ul>
  </section>

  <section id="planLimits">
    <h3>{t('limits_by_plan')}</h3>
    <p>{t('limits_depend_on_subscription')}</p>
    <ul>
      <li>{t('free_plan_limit')}</li>
      <li>{t('basic_plan_limit')}</li>
      <li>{t('autonomous_plan_limit')}</li>
      <li>{t('professional_plan_limit')}</li>
      <li>{t('business_plan_limit')}</li>
      <li>{t('enterprise_plan_limit')}</li>
      <li>{t('corporate_plan_limit')}</li>
    </ul>

    <p>{t('if_you_reach_limit')}</p>
    <ul>
      <li>{t('delete_old_tables')}</li>
      <li>{t('pay_for_extra_tables')}</li>
      <li>
        {t('upgrade_plan')}{' '}
        <a href="https://tudominio.com/ayuda/suscripcion" target="_blank">
          {t('help_center')} &gt; {t('help_center_subscription')}
        </a>
      </li>
    </ul>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('performance_recommendation')}</p>
      </div>
    </div>
  </section>

  <section id="tableTypesAndUseCases">
    <h3>{t('table_types_and_use_cases')}</h3>
    <div className={styles.tableWrapper}>
      <table className={styles.customTable}>
        <thead>
          <tr>
            <th>{t('table_type')}</th>
            <th>{t('main_use')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t('assets')}</td>
            <td>{t('inventory_tracking')}</td>
          </tr>
          <tr>
            <td>{t('contacts')}</td>
            <td>{t('manage_clients_suppliers')}</td>
          </tr>
          <tr>
            <td>{t('documents')}</td>
            <td>{t('structure_files_financial')}</td>
          </tr>
          <tr>
            <td>{t('custom_table')}</td>
            <td>{t('full_flexibility_fields')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section id="defaultTables">
    <h3 className={styles.textGray}>{t('default_tables')}</h3>
    <p>{t('default_tables_on_workspace_creation')}</p>
    <ul>
      <li>{t('contacts')}→ {t('manage_key_entities')}</li>
      <li>{t('assets')}→ {t('control_inventory_products')}</li>
      <li>{t('documents')}→ {t('classify_and_structure_files')}</li>
    </ul>
    <p>{t('default_tables_essential_for')}</p>
      <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('tables_update_automatically')}</p>
      </div>
    </div>
  </section>

  <section id="customTables">
    <h3 className={styles.textGray}>{t('custom_tables')}</h3>
    <p>{t('beyond_defaults_create_custom')}</p>
      <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('structured_contacts_enhance_ia')}</p>
      </div>
    </div>

    <div className={styles.semibold}>{t('examples_of_use')}</div>
    <ul>
      <li>{t('architectural_plans')}</li>
      <li>{t('technical_sheets')}</li>
      <li>{t('contracts_clauses')}</li>
      <li>{t('payroll_employees')}</li>
    </ul>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('tip_use_custom_tables_for_automations')}</p>
      </div>
    </div>
  </section>

  <section id="whatYouCanDoInTables">
    <h3>{t('what_you_can_do_in_tables')}</h3>
    <ul>
      <li>{t('edit_table_name_color_icon')}</li>
      <li>{t('delete_records_if_permitted')}</li>
      <li>{t('reorder_columns_manually')}</li>
      <li>{t('search_filter_by_status')}</li>
      <li>{t('query_from_chat_with_at')}</li>
      <li>{t('use_ia_for_reports')}</li>
    </ul>

    <h3 className={styles.textGray}>{t('table_options_menu')}</h3>
    <p>{t('next_to_table_name_youll_find')}</p>
    <ul>
      <li><strong>{t('import')}</strong>: {t('upload_data_from_file')}</li>
      <li><strong>{t('export')}</strong>: {t('download_table_csv')}</li>
      <li><strong>{t('talk_to_table_ia')}</strong>: {t('start_conversational_analysis')}</li>
      <li><strong>{t('duplicate_table')}</strong>: {t('create_exact_copy')}</li>
      <li><strong>{t('add_record')}</strong>: {t('open_manual_form')}</li>
      <li><strong>{t('add_tag')}</strong>: {t('tag_for_search')}</li>
      <li><strong>{t('delete_table')}</strong>: {t('permanently_delete_table')}</li>
    </ul>
     <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('tables_update_automatically')}</p>
      </div>
    </div>
  </section>


  <section id="createNewTableStepByStep">
    <h3>{t('create_new_table_step_by_step')}</h3>
    <ol className={styles.olstyle}>
      <li >
        <p className={`${styles.semibold} ${styles.InLine}`}>{t('click_new_table_sidebar')} <MenuNavigationIcon/></p>
      </li>
      <li>
        <p className={styles.semibold}>{t('choose_table_type')}</p>
        
        <ul>
          <span>{t("choose_between_default_options")}</span>
          <li>{t('assets_for_products')}</li>
          <li>{t('contacts_for_clients')}</li>
          <li>{t('documents_for_files')}</li>
          <li>{t('custom_table_for_any_data')}</li>
        </ul>
      </li>
      <li>
        <p className={styles.semibold}>{t('configure_table_visibility')}</p>
        <span className={styles.InLine} style={{color:"#6E6E80"}}>
          <span  className={styles.InLine}><Lockicon/> {t("private_")}</span>
          <span  className={styles.InLine}><LockiconOpen/>{t("public_")}</span>
        </span>
        <ul>
          <li><span className={styles.semibold}>{t('public')}</span>: {t('visible_to_all_workspace')}</li>
          <li><span className={styles.semibold}>{t('private')}</span>: {t('visible_only_to_you')}</li>
          <li>{t('can_modify_later')}</li>
        </ul>
      </li>
      <li>
        <p className={styles.semibold}>{t('assign_tags_optional')}</p>
        <span  className={styles.InLine}><AddTag/>{t('critery_or_utils_notes')}</span>
      </li>
      <li>
        <p className={styles.semibold}>{t('save_and_start_working')}</p>
        <ul>
          <span>
            { t('create_instruction') }
          </span>
          <ul>
            <li>{t('add_manual') }</li>
            <li>{t('add_scanned') }</li>
            <li>{t('add_automated') }</li>
            <li>{t('add_import') }</li>
          </ul>
        </ul>
      </li>
    </ol>
      <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('only_owner_admin_editor_can_create_public_tables')}</p>
      </div>
    </div>
  </section>

  <section id="documentsTable">
    <h3>{t('documents_table')}</h3>
    <p>{t('documents_table_registers_all')}</p>
    <p>{t('every_time_you_upload')}</p>

    <div className={styles.textGray}>{t('what_you_can_do_with_documents_table')}</div>
    <ul>
      <li>{t('recognize_structured_data')}</li>
      <li>{t('share_collaboratively')}</li>
      <li>{t('visualize_search_filter')}</li>
      <li>{t('relate_documents_to_entities')}</li>
      <li>{t('export_migrate_via_flows')}</li>
      <li>{t('notify_create_alerts')}</li>
      <li>{t('interact_with_chat')}</li>
    </ul>
  </section>

  <section id="linkDocumentToDynamicTable">
    <h3>{t('link_new_document_to_table')}</h3>
    <ol className={styles.olstyle}>
      <li>
        <p>{t('ways_to_add_document')}</p>
        <ul>
          <li>{t('from_tables_section_upload')}
              <span>{t('table_documents_in')}</span>
          </li>
          <li>
            {t('buttom_new_doc')}
            <ul>
              <span>{t('from_here_can_upload')}</span>
              <li>{t('upload_file_manual')}</li>
              <li>{t('generate_document_via_ia')}</li>
            </ul>
          </li>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>
                {t('visite_agents_chat_to_generate_ia_docs')}
              </p>
            </div>
          </div>
          
          <li>
            {t('via_automation')}{' '}
          </li>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
            <p href="#" target="_blank">
              {t('help_center')} &gt; {t('help_center_automations') } {t('to_look_configuration')}
            </p>
            </div>
          </div>
        </ul>
      </li>
      <li>{t('select_destination_folder')}</li>
      <li>{t('edit_suggested_variables')}</li>
      <li>
        <p>{t('facturagpt_will_analyze')}</p>
        <p>{t('variables_extracted_updated')}</p>
      </li>
    </ol>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>
          {t('learn_more_about_upload')}{' '}
          <a href="#" target="_blank">
            {t('help_center')} &gt; {t('help_center_documents')}
          </a>
        </p>
      </div>
    </div>
  </section>

  <section id="contacts">
    <h3>{t('contacts')}</h3>
    <p>{t('contacts_table_centralizes_info')}</p>
    <p>{t('although_create_custom_tables')}</p>

    <div className={styles.textGray}>{t('what_are_contacts_for')}</div>
    <ul>
      <li>{t('segment_by_type')}</li>
      <li>{t('configure_payment_conditions')}</li>
      <li>{t('visualize_key_metrics')}</li>
      <li>{t('relate_to_documents_assets')}</li>
      <li>{t('automate_flows_based_on')}</li>
    </ul>
 
    <h3 className={styles.textGray}>{t('contact_actions')}</h3>
    <p>{t('from_contacts_table_or_individual')}</p>
    <ul>
      <li>{t('edit_delete_contacts')}</li>
      <li>{t('add_custom_variables')}</li>
      <li>{t('tag_categorize')}</li>
      <li>{t('view_related_documents')}</li>
      <li>{t('attach_files')}</li>
      <li>{t('use_chat_with_ia')}</li>
    </ul>
  </section>

  <section id="createNewContact">
    <h3>{t('how_to_create_new_contact')}</h3>
    <ol className={styles.olstyle}>
      <li>
        <h4>{t('manual_upload')}</h4>
          <div className={styles.InLine}>
            <div className={styles.gptVideo}></div>
            <div>
              <ol className={styles.olstyle}>
                  <li>{t('go_to_tables_contacts_add')}</li>
                  <li>{t('click_new_contact')}</li>
                  <li>{t('fill_main_fields')}</li>
                  <li>{t('add_tags_categories')}</li>
                  <li>{t('add_additional_variables')}</li>
                  <li>{t('save_contact')}</li>
              </ol>
            </div>
          </div>
      </li>
      <li>
        <h4>{t('auto_scan_from_documents')}</h4>
        <span>{t('facturagpt_detects_contact_data')}</span>
        <span style={{color: '#10A37F'}}>
          <a style={{color: '#10A37F'}} href="#" target="_blank">
            {t('help_center')} &gt; {t('help_center_documents')}
          </a>
        </span>
      </li>
      <li>
        <h4>{t('automated_flows_for_contacts')}</h4>
        <span>{t('automate_contact_creation')}</span>
        <ul>
          <li>{t('extract_data_important')}</li>
          <li>{t('create_new_contact_table')}</li>
          <li>{t('add_necesary_variable')}</li>
        </ul>
        <span>
          {t('learnind_to_do')}
          <a style={{color: '#10A37F'}} href="https://tudominio.com/ayuda/automatizaciones" target="_blank">
            {t('help_center')} &gt; {t('help_center_automations')}
          </a>
        </span>
      </li>
      <li>
        <h4>{t('import_contacts_from_file')}</h4>
        <ol className={styles.olstyle}>
          <li>{t('click_three_dots_contacts')}</li>
          <li>{t('select_import')}</li>
          <li>{t('upload_csv_xls')}</li>
          <li>{t('check_template_optional')}</li>
          <li>{t('contacts_created_automatically')}</li>
        </ol>
      </li>
    </ol>
  </section>

  <section id="assets">
    <h3>{t('assets')}</h3>
    <p>{t('assets_table_manage_inventory')}</p>
    <p>{t('each_asset_impacts_directly')}</p>

    <div className={styles.textGray}>{t('what_are_assets_for')}</div>
    <ul>
      <li>{t('register_products_services')}</li>
      <li>{t('control_inventory_locations')}</li>
      <li>{t('analyze_asset_evolution')}</li>
      <li>{t('associate_invoices_contracts')}</li>
      <li>{t('automate_management_processes')}</li>
    </ul>
  </section>

  <section id="assetActions">
    <h3 className={styles.textGray}>{t('asset_actions')}</h3>
    <ul>
      <li>{t('edit_delete_assets')}</li>
      <li>{t('add_tags_categories')}</li>
      <li>{t('view_key_metrics')}</li>
      <li>{t('view_usage_patterns')}</li>
      <li>{t('assign_relations')}</li>
      <li>{t('attach_tech_docs')}</li>
      <li>{t('detect_duplicates')}</li>
      <li>{t('manage_locations')}</li>
      <li>{t('use_automations')}</li>
      <li>{t('query_update_via_chat')}</li>
    </ul>
  </section>

  <section id="createNewAsset">
    <h3>{t('how_to_create_new_asset')}</h3>
    <ol className={styles.olstyle}>
      <div className={styles.InLine}>
        <div className={styles.gptVideo}></div>
        <li>
          <h4>{t('manual_upload')}</h4>
          <ol className={styles.olstyle}>
            <li>{t('go_to_tables_assets_add')}</li>
            <li>{t('click_new_asset')}</li>
            <li>{t('enter_fields_name_type')}</li>
            <li>{t('add_tags_variables')}</li>
            <li>{t('save_asset')}</li>
          </ol>
        </li>
      </div>
      <li>
        <h4>{t('scan_from_documents')}</h4>
        <p>
          {t('facturaGtp_detected_active')}
          <a style={{color: '#10A37F'}} href="#" target="_blank">
            {t('help_center')} &gt; {t('help_center_documents')}
          </a>
        </p>
      </li>
      <li>
        <h4>{t('automated_flows')}</h4>
        <p>
          {t('automatize_creation')}
          <a style={{color: '#10A37F'}} href="#" target="_blank">
            {t('help_center')} &gt; {t('help_center_automations')}
          </a>
        </p>
      </li>
      <li>
        <h4>{t('import_assets_from_file')}</h4>
        <ol className={styles.olstyle}>
          <li>{t('click_three_dots_assets')}</li>
          <li>{t('select_import')}</li>
          <li>{t('upload_csv_xls')}</li>
          <li>{t('check_template_optional')}</li>
          <li>{t('assets_created_automatically')}</li>
        </ol>
      </li>
    </ol>
  </section>

  <section id="tableVisibility">
    <h3>{t('table_visibility')}</h3>
    <ul>
      <li><span className={styles.semibold}>{t('public')}</span >→ {t('visible_to_all_members')}</li>
      <li><span className={styles.semibold}>{t('private')}</span >→ {t('visible_only_to_you_or_invited')}</li>
    </ul>
     <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        
        <p>{t('if_workspace_published_community')}</p>
        
      </div>
    </div>
  </section>

  <section id="importExportData">
    <h3>{t('import_export_data')}</h3>
    <ul>
      <li><span className={styles.semibold}>{t('import')}</span >: {t('from_csv_excel_google_sheets_api')}</li>
      <li><span className={styles.semibold}>{t('export')}</span >: {t('download_csv_excel')}</li>
      <li><span className={styles.semibold}>{t('automation')}</span >: {t('keep_tables_synced_with_crms')}</li>
    </ul>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>        
        <p>{t('remember_connect_table_with_automations')}</p>
      </div>
    </div>
  </section>

  <section id="variablesTypesAndBestPractices">
    <h3>{t('variables_types_and_best_practices')}</h3>
    <p>{t('variables_are_the_base')}</p>

    <div className={styles.semibold}>{t('what_are_variables_for')}</div>
    <ul>
      <li>{t('customize_visible_fields')}</li>
      <li>{t('automate_flows_conditions')}</li>
      <li>{t('filter_group_classify')}</li>
      <li>{t('make_intelligent_queries')}</li>
      <li>{t('feed_chat_responses_with_at')}</li>
    </ul>

    <p className={styles.semibold}>{t('types_of_variables')}</p>
    <ul>
      <li>
        <span className={styles.semibold}>{t('global_variables')}</span>: {t('columns_added_to_table')}
        <ul>
          <li>{t('managed_from_table_config')}</li>
          <li>{t('used_for_filters_conditions')}</li>
          <li>{t('example_add_proveedor_column')}</li>
        </ul>
      </li>
      <li>
        <span className={styles.semibold}>{t('per_record_variables')}</span >: {t('values_entered_per_row')}
      </li>
    </ul>

    <div className={styles.textGray}>{t('where_are_variables_used')}</div>
    <ul>
      <span>{t('var_can_add_and_use_in')}</span>
      <li><span className={styles.semibold}>→{t('contacts')}</span>: {t('variables_contacts_examples')}</li>
      <li><span className={styles.semibold}>→{t('assets')}</span>: {t('variables_assets_examples')}</li>
      <li><span className={styles.semibold}>→{t('documents')}</span>: {t('variables_documents_examples')}</li>
      <li><span className={styles.semibold}>→{t('custom_tables')}</span>: {t('variables_custom_tables_examples')}</li>
    </ul>
  </section>

  <section id="availableVariableTypes">
    <h3 className={styles.textGray}>{t('available_variable_types')}</h3>
    <div className={styles.variableTypesGrid}>
      <ParameterNavigation 
        FunctionsValidation={false}
      />
    </div>
  </section>

  <section id="howToAddVariables">
    <h3 className={styles.textGray}>{t('how_to_add_variables')}</h3>
    <span>{t('can_add_variables_fast_shape')}</span>
    <ol className={styles.olstyle}>
      <li>
        <h4>{t('from_record_view')}</h4>
        <ol className={styles.olstyle}>
          <li>{t('open_record_in_table')}</li>
          <li>{t('click_new_variable')}</li>
          <li>{t('select_type')}</li>
          <li>{t('enter_name_values')}</li>
          <li>{t('save_immediately')}</li>
        </ol>
        <p>{t('enable_create_another')}</p>
      </li>
      <li>
        <h4>{t('from_chat')}</h4>
        <ol className={styles.olstyle}>
          <li>{t('mention_record_at')}</li>
          <li>{t('use_commands_add_variable')}</li>
          <li>{t('ia_suggests_variables')}</li>
          <li>{t('confirm_save_interactive')}</li>
          <li>{t('applied_automatically')}</li>
        </ol>
      </li>
      <li>
        <h4>{t('via_automated_flows')}</h4>
        <p>{t('automate_creation_update')}
          <a href="#" style={{color:"#10A37F"}} target="_blank">
            {t('help_center')} &gt; {t('help_center_automations')}
          </a></p>
      

         <div className={styles.card}>
          <GreenExclamationIcon />
          <div className={styles.cardContent}>        
            <p>{t('contact_sales_for_advanced')}</p>
          </div>
        </div>
      </li>
      <li>
        <h4>{t('from_table_settings_global_variable')}</h4>
        <ol className={styles.olstyle}>
          <li>{t('go_to_table')}</li>
          <li>{t('click_three_dots_edit_columns')}</li>
          <li>{t('add_new_global_variable')}</li>
          <li>{t('save_as_column')}</li>
        </ol>
      </li>
    </ol>
  </section>

  <section id="dataTableRelationships">
    <h3>{t('data_table_relationships')}</h3>
    <p>{t('relationships_allow_connect')}</p>

    <h4 className={styles.textGray}>{t('types_of_relationships')}</h4>
    <ul>
      <li><span className={styles.semibold}>1:1</span>: {t('one_to_one_description')}</li>
      <li><span className={styles.semibold}>1:N</span>: {t('one_to_many_description')}</li>
      <li><span className={styles.semibold}>N:N</span>: {t('many_to_many_description')}</li>
      <p>{t('example_one_to_many')}</p>
    </ul>

    <h4 className={styles.textGray}>{t('relationships_between_global_variables')}</h4>
    <p>{t('link_columns_between_tables')}</p>
    <ul>
      <li>
        <span className={styles.semibold}>{t('example1')}</span >
        <ul>
          <li>
          {t('example1_description')}
          </li>
          <li>
          {t('example1_subdescription')}
          </li>
        </ul>
      </li>
        <li>
          <span className={styles.semibold}>
          {t('example2')}
          </span>
          <ul>
            <li>{t('example2_description')}</li>
            <li>{t('example2_subdescription')}</li>
          </ul>
        </li>
    </ul>
  </section>

  <section id="createRelationshipFromChat">
    <h3 className={styles.textGray}>{t('create_relationship_from_chat')}</h3>
    <div>
      <p>{t('use_mentions_with_at')}</p>
      <p>@Factura.Email = @Contactos.Email @Mantenimiento.ActivoID = @Inventario.ActivoID</p>
    </div>

    <div className={styles.gptVideo}></div>

  </section>

  <section id="createRelationshipFromTables">
    <h3 className={styles.textGray}>{t('create_relationship_from_tables')}</h3>
    <ol className={styles.olstyle}>
      <li>{t('go_to')}<em>{t('go_to_tables_select_table_add_relation')}</em></li>
      <li>{t('define_relation_type')}</li>
      <li>{t('select_other_table_variable')}</li>
      <li>{t('save_relation_appears')}</li>
    </ol>
    <div className={styles.gptVideo}></div>

  </section>

  <section id="advancedFunctionsWithIA">
    <h3>{t('advanced_functions_with_ia_and_best_practices')}</h3>
    <ul>
    <h3 className={styles.textGray}>{t('advanced_functions_with_ia')}</h3>
      <li>{t('table_ia_query_natural_language')}</li>
      <li>{t('auto_generation_from_documents')}</li>
      <li>{t('smart_summaries_ask_ia')}</li>
      <li>{t('queries_with_at_calls')}</li>
    </ul>
  </section>

  <section id="bestPracticesAndUsageTips">
    <h3 className={styles.textGray}>{t('best_practices_and_usage_tips')}</h3>
    <ul>
    <span className={styles.semibold}>{t('table_structure_and_setup')}</span>
      <li>{t('define_structure_with_globals')}</li>
      <li>{t('use_clear_names_no_spaces')}</li>
      <li>{t('use_dropdowns_tags_colors')}</li>
      <li>{t('use_booleans_for_conditions')}</li>
      <li>{t('use_date_variables_for_tracking')}</li>
    </ul>

    <ul>
    <span className={styles.semibold}>{t('automation_operational_intelligence')}</span>
      <li>{t('use_variables_as_conditions')}</li>
      <li>{t('relate_variables_between_tables')}</li>
      <li>{t('activate_classification_automations')}</li>
      <li>{t('leverage_chat_with_ia')}</li>
    </ul>

    <ul>
    <span className={styles.semibold}>{t('document_management_analysis')}</span>
      <li>{t('attach_relevant_files')}</li>
      <li>{t('query_key_metrics')}</li>
      <li>{t('visualize_patterns_history')}</li>
    </ul>

    <ul>
    <span className={styles.semibold}>{t('data_maintenance_consistency')}</span>
      <li>{t('periodic_import_export')}</li>
      <li>{t('connect_to_external_sources')}</li>
      <li>{t('review_duplicates_standardize')}</li>
    </ul>

    <ul>
    <span className={styles.semibold}>{t('access_visibility')}</span>
      <li>
        {t('configure_visibility_sensitive')}
        <ul>
          <li>{t('public_share_data')}</li>
          <li>{t('private_sensible_data')}</li>
        </ul>
        </li>
    </ul>

    <ul>
    <span className={styles.semibold}>{t('advanced_customization')}</span>
      <li>{t('create_custom_tables_fields')}</li>
      <li>{t('add_any_variable_type')}</li>
      <li>{t('create_dynamic_filters')}</li>
      <li>{t('reuse_variables_between_tables')}</li>
    </ul>
  </section>
</div>
    </div>
  );
};

export default Table;
