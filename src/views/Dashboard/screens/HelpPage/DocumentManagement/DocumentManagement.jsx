import React, { useState } from "react";
import TemplateArticleHelp from "../TemplateArticleHelp/TemplateArticleHelp";
// import styles from "./DocumentManagement.module.css";

import styles from "../FirstSteeps/FirstSteeps.module.css";
import { ReactComponent as GreenDotsAppIcon } from "../../../assets/GreenDotsAppIcon.svg";
import { ReactComponent as ArrowDownBold } from "../../../assets/arrowDownBold.svg";
import { ReactComponent as ConectionsGrayIcon } from "../../../assets/ConectionsGrayIcon.svg";
import { ReactComponent as HouseIcon } from "../../../assets/HouseIcon.svg";
import { ReactComponent as ArrowRightText } from "../../../assets/arrowRightText.svg";
import { ReactComponent as FilterIconBars } from "../../../assets/S3/filterIconBars.svg";
import { useTranslation } from "react-i18next";
import { ReactComponent as GreenExclamationIcon } from "../../../assets/GreenExclamationIcon.svg";

const DocumentManagement = ({ setSelectedCategory }) => {
  const { t } = useTranslation("helpPage");

 
  return (
    <div>
      <TemplateArticleHelp
        title={t("automations")}
        Icon={GreenDotsAppIcon}
        setSelectedCategory={setSelectedCategory}
        validate={false}

      />
       <div className={styles.SteepCategory}>
  <section id="automations">
    <h2>{t('automations')}</h2>
    
    <p>{t('automations_description')}</p>
  </section>

  <section id="whatAreAutomations">
    <h3>{t('what_are_automations')}</h3>
    <p>{t('automation_definition')}</p>

    <p>{t('system_workflow')}</p>
    <ul>
      <li><strong>{t('trigger')}</strong>: {t('example_trigger')}</li>
      <li><strong>{t('condition')}</strong>: {t('example_condition')}</li>
      <li><strong>{t('action')}</strong>: {t('example_action')}</li>
    </ul>

    <p>{t('example_flow')}</p>
  </section>

  <section id="apiActions">
    <h3>{t('what_is_api_action')}</h3>
    <p>{t('action_is_step_in_flow')}</p>
    <ul>
      <li>{t('create_classify_document')}</li>
      <li>{t('update_variable_table')}</li>
      <li>{t('send_notification_email')}</li>
      <li>{t('connect_external_app')}</li>
    </ul>
    <p>{t('automation_can_have_multiple_actions')}</p>
  </section>

  <section id="whyActiveToken">
    <h3>{t('why_need_active_token')}</h3>
    <p>{t('token_is_security_key')}</p>
    <p>{t('without_token_automation_fails')}</p>
    <p>
      {t('tokens_are_consumed')}{' '}
      <a href="#" target="_blank">
        {t('help_center')} &gt; {t('help_center_subscription')}
      </a>
    </p>
  </section>

  <section id="whatAreAutomationsFor">
    <h3>{t('what_are_automations_for')}</h3>
    <ul>
      <li>{t('automate_classification_tagging')}</li>
      <li>{t('generate_quotes_invoices')}</li>
      <li>{t('send_payment_reminders')}</li>
      <li>{t('update_table_records')}</li>
      <li>{t('orchestrate_data_between_apps')}</li>
      <li>{t('maintain_control_traceability')}</li>
    </ul>
    <p>{t('example_flow')}</p>
  </section>

  <section id="howToAccessAutomations">
    <h3>{t('how_to_access_automations')}</h3>
    <ol className={styles.olstyle}>
      <li>{t('from_sidebar_click_automations')}</li>
      <li>
        {t('shortcut')}: <kbd>⌘ + W</kbd> ({t('mac')}) {t('or')} <kbd>Shift + Ctrl + W</kbd> ({t('windows')})
      </li>
      <li>{t('from_chat_describe_flow')}</li>
    </ol>
  </section>

  <section id="glossary">
    <h3>{t('glossary')}</h3>
    <ul>
      <li><strong>{t('token')}</strong>: {t('glossary_token')}</li>
      <li><strong>{t('scenario')}</strong>: {t('glossary_scenario')}</li>
      <li><strong>{t('trigger')}</strong>: {t('glossary_trigger')}</li>
      <li><strong>{t('filters_conditions')}</strong>: {t('glossary_filters_conditions')}</li>
      <li><strong>{t('operators')}</strong>: {t('glossary_operators')}</li>
      <li><strong>{t('action')}</strong>: {t('glossary_action')}</li>
      <li><strong>{t('offset')}</strong>: {t('glossary_offset')}</li>
      <li><strong>{t('data_mapper')}</strong>: {t('glossary_data_mapper')}</li>
      <li><strong>{t('endpoint')}</strong>: {t('glossary_endpoint')}</li>
    </ul>
    <p>{t('example_flow')}</p>
  </section>

  <section id="configureAutomation">
    <h3>{t('how_to_configure_automation')}</h3>
    <ol className={styles.olstyle}>
      <li>
        <h4>{t('access_create_flow')}</h4>
        <p>{t('go_to_automations_sidebar_or_shortcut')}</p>
        <p>{t('double_click_to_edit_or_new')}</p>
        <p>{t('configuration_modes')}</p>
        <ul>
          <li>{t('conversational_ia_assistance')}</li>
          <li>{t('manual_mode')}</li>
        </ul>
        <p>
          {t('start_flows_from_chat')}{' '}
          <a href="https://tudominio.com/ayuda/agentes" target="_blank">
            {t('help_center')} &gt; {t('help_center_agents')}
          </a>
        </p>
      </li>
      <li>
        <h4>{t('select_start_action_app')}</h4>
        <p>{t('assign_clear_name_to_flow')}</p>
        <p>{t('choose_starting_point')}</p>
        <ul>
          <li>{t('send_emails_notifications')}</li>
          <li>{t('process_documents')}</li>
          <li>{t('connect_external_apps')}</li>
          <li>{t('update_table_records')}</li>
        </ul>
      </li>
      <li>
        <h4>{t('configure_key_data_identification')}</h4>
        <p>{t('select_trigger')}</p>
        <p>{t('offset_time')}</p>
        <ul>
          <li>{t('immediate_default')}</li>
          <li>30 min, 1h, 6h, 12h</li>
        </ul>
        <p>{t('no_offset_max_15min_delay')}</p>
        <p>{t('upload_sample_doc_auto_recognition')}</p>
      </li>
      <li>
        <h4>{t('add_conditions_advanced_filters')}</h4>
        <ol className={styles.olstyle}>
          <li>{t('click_add_rule')}</li>
          <li>{t('name_condition_descriptively')}</li>
          <li>{t('define_filters_manually_or_ia')}</li>
          <li>{t('save_filter')}</li>
        </ol>
      </li>
      <li>
        <h4>{t('data_mapper_field_mapping')}</h4>
        <p>{t('relate_fields_between_systems')}</p>
      </li>
      <li>
        <h4>{t('set_document_save_location')}</h4>
        <p>{t('define_destination_folder')}</p>
        <p>{t('customize_names_with_variables')}</p>
        <ul>
          <li>[id], [title], [date], [contactid], [totalamount]</li>
          <li>[category], [status], [type], [workspace]</li>
        </ul>
        <p>{t('additional_options')}</p>
        <ul>
          <li>{t('document_category_status')}</li>
          <li>{t('add_color_notes_tags')}</li>
        </ul>
      </li>
      <li>
        <h4>{t('activate_notifications_alerts')}</h4>
        <p>{t('configure_auto_alerts')}</p>
        <ul>
          <li>{t('success_execution_message')}</li>
          <li>{t('errors_interruptions')}</li>
        </ul>
        <p>{t('compatible_channels')}</p>
      </li>
      <li>
        <h4>{t('customize_orchestrator_agent')}</h4>
        <p>{t('assign_flow_to_agent')}</p>
        <p>{t('only_agents_with_automation_active')}</p>
        <p>{t('in_multiagent_environments')}</p>
      </li>
      <li>
        <h4>{t('save_and_activate_automation')}</h4>
        <p>{t('click_save_to_confirm')}</p>
        <p>{t('flow_appears_as_active')}</p>
        <p>{t('you_can_pause_edit_duplicate')}</p>
        <div className={styles.card}>
          <GreenExclamationIcon />
          <div className={styles.cardContent}>
            <p>{t('tip_start_simple_add_logic')}</p>
          </div>
        </div>
      </li>
    </ol>
  </section>

  <section id="externalAppIntegration">
    <h3>{t('external_app_integration')}</h3>
    <p>{t('facturagpt_allows_connect_apps')}</p>
    <p>{t('each_connection_can_be_trigger_or_destination')}</p>

    <div className={styles.textGray}>{t('connect_with')}</div>
    <ul>
      <li><strong>{t('email')}</strong>: Gmail, Outlook</li>
      <li><strong>{t('storage')}</strong>: Drive, Dropbox, SharePoint</li>
      <li><strong>{t('erp_crm')}</strong>: SAP, Odoo, Salesforce, HubSpot</li>
      <li><strong>{t('communication')}</strong>: Slack, Teams, WhatsApp</li>
      <li><strong>{t('payments_banks')}</strong>: Stripe, Revolut, bancos locales</li>
    </ul>
    <p>
      {t('all_connections_managed_in')}{' '}
      <a href="#" target="_blank">
        {t('settings')} &gt; {t('connected_apps')}
      </a>
    </p>
  </section>

  <section id="addNewConnection">
    <h3>{t('how_to_add_new_connection')}</h3>
    <ol className={styles.olstyle}>
      <li>
        {t('go_to_automations_new_or_from_chat')}
        <p>
          <a href="https://tudominio.com/ayuda/agentes" target="_blank">
            {t('help_center')} &gt; {t('help_center_agents')}
          </a>
        </p>
      </li>
      <li>{t('choose_app_to_connect')}</li>
      <li>{t('in_config_step_click_add_connection')}</li>
      <li>{t('login_with_secure_token')}</li>
      <li>{t('app_available_as_input_or_output')}</li>
    </ol>
    <p>{t('if_disconnect_app_associated_flows_stop')}</p>
  </section>

  <section id="connectionTypes">
    <h3>{t('connection_types')}</h3>
    <h4>{t('automation_trigger_input')}</h4>
    <ul>
      <li>{t('gmail_invoice_attachment')}</li>
      <li>{t('new_file_in_drive_folder')}</li>
      <li>{t('external_webhook_event')}</li>
      <li>{t('iot_monitoring_data')}</li>
    </ul>

    <h4>{t('automation_destination_output')}</h4>
    <ul>
      <li>{t('save_to_dropbox_onedrive_drive')}</li>
      <li>{t('send_to_erp_crm')}</li>
      <li>{t('send_emails_notifications')}</li>
    </ul>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>
          {t('for_advanced_solutions_contact_team')}
        </p>
      </div>
    </div>
  </section>

  <section id="automationManagement">
    <h3>{t('automation_management')}</h3>
    <div className={styles.textGray}>{t('permissions_access_control')}</div>
    <ul>
      <li><strong>{t('workspace_owner')}</strong>: {t('full_control_all_automations')}</li>
      <li><strong>{t('workspace_admin')}</strong>: {t('create_edit_pause_delete')}</li>
      <li><strong>{t('workspace_editor')}</strong>: {t('create_modify_according_to_permissions')}</li>
      <li><strong>{t('collaborators')}</strong>: {t('can_view_use_if_connected')}</li>
    </ul>

    <div className={styles.textGray}>{t('overview_automation_panel')}</div>
    <p>{t('each_row_shows_key_info')}</p>
    <ul>
      <li>{t('automation_name')}</li>
      <li>{t('assigned_orchestrator_agent')}</li>
      <li>{t('last_execution_date')}</li>
      <li>{t('status_active_inactive')}</li>
      <li>{t('connected_apps')}</li>
    </ul>

    <p>{t('you_can_sort_filter_by')}</p>
    <ul>
      <li>{t('flow_type_input_output')}</li>
      <li>{t('name')}</li>
      <li>{t('status')}</li>
      <li>{t('connected_app')}</li>
      <li>{t('last_execution_date')}</li>
    </ul>
  </section>

  <section id="executionHistory">
    <h3>{t('execution_history')}</h3>
    <p>{t('open_saved_automation_for_details')}</p>
    <ul>
      <li>{t('complete_flow_configuration')}</li>
      <li>{t('counter_associated_automations')}</li>
      <li>{t('number_active_connections')}</li>
      <li>{t('current_status_and_workspaces')}</li>
    </ul>
    <p>
      {t('all_flows_logged_in_activity')}{' '}
      <a href="https://tudominio.com/ayuda/actividad" target="_blank">
        {t('help_center')} &gt; {t('help_center_activity')}
      </a>
    </p>
  </section>

  <section id="availableActionsMenu">
    <h3>{t('available_actions_menu')}</h3>
    <ul>
      <li><strong>{t('edit')}</strong>: {t('modify_flow_apply_immediately')}</li>
      <li><strong>{t('duplicate')}</strong>: {t('create_exact_copy_suffix')}</li>
      <li><strong>{t('deactivate')}</strong>: {t('pause_execution_temporarily')}</li>
      <li><strong>{t('delete')}</strong>: {t('permanently_delete_automation')}</li>
    </ul>
    <p>{t('only_owner_admin_can_delete')}</p>
  </section>

  <section id="automateFromAgentConversations">
    <h3>{t('automate_from_agent_conversations')}</h3>
    <p>{t('facturagpt_allows_agents_to_execute')}</p>
    <p>{t('benefit_less_steps_more_agility')}</p>

    <div className={styles.textGray}>{t('what_can_you_do_from_chat')}</div>
    <ul>
      <li>{t('create_execute_flows_natural_language')}</li>
      <li>{t('use_at_variables_in_real_time')}</li>
      <li>{t('assign_automations_to_orchestrator')}</li>
    </ul>
    <p>
      {t('more_info_in')}{' '}
      <a href="https://tudominio.com/ayuda/agentes" target="_blank">
        {t('help_center')} &gt; {t('help_center_agents')}
      </a>
    </p>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('if_api_not_available_contact_sales')}</p>
      </div>
    </div>
  </section>

  <section id="enableOrchestratorAgents">
    <h3>{t('how_to_enable_orchestrator_agents')}</h3>
    <p>{t('give_agents_automation_power_two_ways')}</p>
    <ul>
      <li>
        <strong>{t('from_automation_config')}</strong>: {t('select_agent_that_can_run_flow')}
      </li>
      <li>
        <strong>{t('from_agent_config')}</strong>: {t('go_to_capabilities_activate_automate')}
      </li>
    </ul>
  </section>

  <section id="commonErrorsAndOptimization">
    <h3>{t('common_errors_and_optimization_tips')}</h3>
    <div className={styles.textGray}>{t('common_errors')}</div>
    <ul>
      <li>{t('expired_or_disconnected_token')}</li>
      <li>{t('too_generic_conditions')}</li>
      <li>{t('incorrect_field_mapping')}</li>
      <li>{t('inactive_automation')}</li>
    </ul>

    <div className={styles.textGray}>{t('error_types')}</div>
    <ul>
      <li><strong>api_error</strong>: {t('api_error_description')}</li>
      <li><strong>card_error</strong>: {t('card_error_description')}</li>
      <li><strong>idempotency_error</strong>: {t('idempotency_error_description')}</li>
      <li><strong>invalid_request_error</strong>: {t('invalid_request_error_description')}</li>
    </ul>

    <div className={styles.textGray}>{t('http_status_summary')}</div>
    <ul>
      <li><strong>200</strong>: {t('http_200_ok')}</li>
      <li><strong>400</strong>: {t('http_400_bad_request')}</li>
      <li><strong>401</strong>: {t('http_401_unauthorized')}</li>
      <li><strong>402</strong>: {t('http_402_request_failed')}</li>
      <li><strong>403</strong>: {t('http_403_forbidden')}</li>
      <li><strong>404</strong>: {t('http_404_not_found')}</li>
      <li><strong>409</strong>: {t('http_409_conflict')}</li>
      <li><strong>424</strong>: {t('http_424_external_dependency_failed')}</li>
      <li><strong>429</strong>: {t('http_429_too_many_requests')}</li>
      <li><strong>500-504</strong>: {t('http_5xx_server_errors')}</li>
    </ul>
  </section>

  <section id="bestPractices">
    <h3>{t('best_practices')}</h3>
    <ul>
      <li>{t('use_clear_names_for_automations')}</li>
      <li>{t('reuse_saved_automations')}</li>
      <li>{t('start_simple_one_trigger_one_action')}</li>
      <li>{t('test_each_flow_before_activating')}</li>
      <li>{t('enable_error_notifications_for_critical')}</li>
      <li>{t('combine_with_agents_for_flexibility')}</li>
      <li>{t('set_specific_rules_to_avoid_errors')}</li>
      <li>{t('monitor_execution_from_panel')}</li>
      <li>{t('if_api_not_available_contact_sales')}</li>
    </ul>
  </section>

  <section id="practicalExamples">
    <h3>{t('practical_examples')}</h3>
    <div className={styles.examplesGrid}>
      <div>
        <strong>{t('obra_gpt')}</strong>
        <p>{t('obra_gpt_description')}</p>
        <p>{t('construction_reforms')}</p>
      </div>
      <div>
        <strong>{t('tienda_gpt')}</strong>
        <p>{t('tienda_gpt_description')}</p>
        <p>{t('local_commerce_ecommerce')}</p>
      </div>
      <div>
        <strong>{t('horeca_gpt')}</strong>
        <p>{t('horeca_gpt_description')}</p>
        <p>{t('restaurant_food')}</p>
      </div>
      <div>
        <strong>{t('salud_gpt')}</strong>
        <p>{t('salud_gpt_description')}</p>
        <p>{t('health_care')}</p>
      </div>
      <div>
        <strong>{t('turismo_gpt')}</strong>
        <p>{t('turismo_gpt_description')}</p>
        <p>{t('travel_hospitality')}</p>
      </div>
      <div>
        <strong>{t('deporte_gpt')}</strong>
        <p>{t('deporte_gpt_description')}</p>
        <p>{t('fitness_performance')}</p>
      </div>
      <div>
        <strong>{t('recibo_gpt')}</strong>
        <p>{t('recibo_gpt_description')}</p>
        <p>{t('corporate_expenses')}</p>
      </div>
      <div>
        <strong>{t('agro_gpt')}</strong>
        <p>{t('agro_gpt_description')}</p>
        <p>{t('agriculture_environment')}</p>
      </div>
      <div>
        <strong>{t('eventos_gpt')}</strong>
        <p>{t('eventos_gpt_description')}</p>
        <p>{t('event_management')}</p>
      </div>
      <div>
        <strong>{t('edu_gpt')}</strong>
        <p>{t('edu_gpt_description')}</p>
        <p>{t('education_training')}</p>
      </div>
      <div>
        <strong>{t('hogar_gpt')}</strong>
        <p>{t('hogar_gpt_description')}</p>
        <p>{t('home_consumption')}</p>
      </div>
      <div>
        <strong>{t('logistica_gpt')}</strong>
        <p>{t('logistica_gpt_description')}</p>
        <p>{t('logistics_distribution')}</p>
      </div>
      <div>
        <strong>{t('inmo_gpt')}</strong>
        <p>{t('inmo_gpt_description')}</p>
        <p>{t('real_estate')}</p>
      </div>
      <div>
        <strong>{t('legal_gpt')}</strong>
        <p>{t('legal_gpt_description')}</p>
        <p>{t('legal_advice')}</p>
      </div>
      <div>
        <strong>{t('talento_gpt')}</strong>
        <p>{t('talento_gpt_description')}</p>
        <p>{t('hr_training')}</p>
      </div>
      <div>
        <strong>{t('finanzas_gpt')}</strong>
        <p>{t('finanzas_gpt_description')}</p>
        <p>{t('taxes_accounting')}</p>
      </div>
      <div>
        <strong>{t('auto_gpt')}</strong>
        <p>{t('auto_gpt_description')}</p>
        <p>{t('fleet_mobility')}</p>
      </div>
      <div>
        <strong>{t('industria_gpt')}</strong>
        <p>{t('industria_gpt_description')}</p>
        <p>{t('industry_manufacturing')}</p>
      </div>
      <div>
        <strong>{t('startup_gpt')}</strong>
        <p>{t('startup_gpt_description')}</p>
        <p>{t('startups_investment')}</p>
      </div>
    </div>
  </section>

  <section id="contactNow">
    <h3>{t('contact_now')}</h3>
  </section>
</div>
    </div>
  );
};

export default DocumentManagement;
