import React, { useState } from "react";
import TemplateArticleHelp from "../TemplateArticleHelp/TemplateArticleHelp";
// import styles from "./ContactManagement.module.css";
import { ReactComponent as ArrowDownBold } from "../../../assets/arrowDownBold.svg";
import { ReactComponent as ConectionsGrayIcon } from "../../../assets/ConectionsGrayIcon.svg";
import { ReactComponent as FilterIconBars } from "../../../assets/S3/filterIconBars.svg";
import { ReactComponent as ContactsGreenIcon } from "../../../assets/ContactsGreenIcon.svg";
import { ReactComponent as DownloadButtonIcon } from "../../../assets/DownloadButtonIcon.svg";
import { useTranslation } from "react-i18next";
import { ReactComponent as GreenExclamationIcon } from "../../../assets/GreenExclamationIcon.svg";
import styles from "../FirstSteeps/FirstSteeps.module.css";

const ContactManagement = ({setSelectedCategory}) => {
  const { t } = useTranslation("helpPage");


  return (
    <div>
      <TemplateArticleHelp
        title={t('agents')}
        Icon={ContactsGreenIcon}
        setSelectedCategory={setSelectedCategory}
        validate={false}

      />
        <div className={styles.SteepCategory}>
  <section id="agents">
    <h2>{t('agents')}</h2>
    <p>{t('agents_description')}</p>
    <p>
      {t('agents_require_token')}{' '}
      <a href="https://tudominio.com/ayuda/tu-cuenta" target="_blank">
        {t('help_center')} &gt; {t('your_account')}
      </a>
    </p>
  </section>

  <section id="whatAreAgents">
    <h3>{t('what_are_agents')}</h3>
    <p>{t('agent_is_ia_system')}</p>
    <ul>
      <li>{t('answer_questions_on_data')}</li>
      <li>{t('execute_automations')}</li>
      <li>{t('access_docs_tables')}</li>
      <li>{t('connect_external_apps')}</li>
    </ul>
    <p>{t('think_of_them_as_mini_apps')}</p>
  </section>

  <section id="whereToFindAgents">
    <h3>{t('where_to_find_agents')}</h3>
    <ol className={styles.olstyle}>
      <li>{t('go_to_conversations_section')}</li>
      <li>{t('opens_last_active_conversation')}</li>
      <li>{t('click_new_chat')}</li>
      <li>{t('new_thread_with_agent')}</li>
    </ol>
    <p>{t('general_chat_description')}</p>
  </section>

  <section id="availableCapabilities">
    <h3>{t('available_capabilities')}</h3>
    <p>{t('each_agent_can_have_capabilities')}</p>
    <ul>
      <li>{t('natural_language_conversation')}</li>
      <li>{t('access_documents')}</li>
      <li>{t('access_tables')}</li>
      <li>{t('execute_automations')}</li>
      <li>{t('web_scraping')}</li>
      <li>{t('code_generation')}</li>
      <li>{t('process_images_attachments')}</li>
      <li>{t('multimodal_support')}</li>
    </ul>

    <h4>{t('extra_capabilities')}</h4>
    <ul>
      <li>{t('web_search')}</li>
      <li>{t('image_generation')}</li>
      <li>{t('code_interpreter_data_analysis')}</li>
      <li>{t('workspace_access')}</li>
      <li>{t('tables_permissions')}</li>
      <li>{t('automations_permissions')}</li>
    </ul>

    <h4>{t('coming_soon')}</h4>
    <ul>
      <li>{t('app_code_editor')}</li>
      <li>{t('document_editor')}</li>
      <li>{t('bluetooth_connection')}</li>
    </ul>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('tip_activate_only_needed_capabilities')}</p>
      </div>
    </div>
    <p>{t('note_some_capabilities_require_tokens')}</p>
  </section>

  <section id="agentGeneralVsCustom">
    <h3>{t('agent_general_vs_custom')}</h3>
    <div className={styles.textGray}>{t('general_agent')}</div>
    <ul>
      <li>{t('general_agent_all_functions')}</li>
      <li>{t('team_can_query_freely')}</li>
      <li>{t('anyone_can_start_conversation')}</li>
      <li>{t('automate_across_docs_third_party')}</li>
      <li>{t('can_be_public_or_private')}</li>
    </ul>

    <div className={styles.textGray}>{t('custom_agents')}</div>
    <ul>
      <li>{t('custom_agents_specific_roles')}</li>
      <li>{t('only_owner_admin_can_create')}</li>
      <li>{t('only_invited_team_can_converse')}</li>
      <li>{t('automate_across_docs_third_party')}</li>
      <li>{t('can_be_public_or_private')}</li>
    </ul>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('tip_use_custom_for_repetitive_tasks')}</p>
      </div>
    </div>
  </section>

  <section id="voiceAndAccessibility">
    <h3>{t('voice_and_accessibility')}</h3>
    <p>{t('agents_can_be_used_with')}</p>
    <ul>
      <li>{t('voice_input')}</li>
      <li>{t('spoken_responses')}</li>
      <li>{t('send_read_voice_messages')}</li>
    </ul>
    <p>{t('voice_functions_improve_accessibility')}</p>

    <h4>{t('wave_icon_direct_recording')}</h4>
    <p><strong>{t('location')}:</strong> {t('top_right_navigation_bar')}</p>
    <p><strong>{t('function')}:</strong> {t('records_voice_sends_to_general_chat')}</p>
    <p>{t('fastest_way_to_interact')}</p>

    <h4>{t('speaker_icon_message_reader')}</h4>
    <p><strong>{t('location')}:</strong> {t('bottom_of_each_conversation')}</p>
    <p><strong>{t('function')}:</strong> {t('reads_last_message_aloud')}</p>
    <p>{t('auto_read_if_enabled')}</p>
    <p>{t('click_any_message_to_read')}</p>
    <p>{t('improves_accessibility')}</p>

    <h4>{t('microphone_icon_voice_recorder')}</h4>
    <p><strong>{t('location')}:</strong> {t('next_to_text_field_in_chats')}</p>
    <p><strong>{t('function')}:</strong> {t('records_voice_to_text')}</p>
    <p>{t('transcription_editable')}</p>
    <p>{t('common_uses')}:</p>
    <ul>
      <li>{t('dictate_questions_commands')}</li>
      <li>{t('perform_queries_while_multitasking')}</li>
      <li>{t('facilitate_input_for_users_with_difficulties')}</li>
    </ul>
  </section>

  <section id="shareAndMonetizeAgents">
    <h3>{t('share_and_monetize_agents')}</h3>
    <p>{t('from_agent_info_section_you_can')}</p>
    <ul>
      <li>{t('publish_agent_for_others')}</li>
      <li>{t('set_free_or_paid')}</li>
      <li>{t('monetize_with_licenses_subscriptions')}</li>
    </ul>
    <p>
      {t('public_agents_receive_ratings')}{' '}
      <a href="https://tudominio.com/ayuda/comunidad" target="_blank">
        {t('help_center')} &gt; {t('help_center_community')}
      </a>
    </p>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('important_public_agent_never_shares_private_data')}</p>
      </div>
    </div>
  </section>

  <section id="createAndConfigureAgent">
    <h3>{t('create_and_configure_agent')}</h3>
    <ol className={styles.olstyle}>
      <li>{t('go_to_agents_new_agent')}</li>
      <li>{t('set_name_description')}</li>
      <li>{t('configure_visibility')}</li>
      <li>{t('define_tone')}</li>
      <li>{t('adjust_ia_temperature')}</li>
      <li>{t('select_capabilities')}</li>
      <li>{t('save_and_activate')}</li>
    </ol>
    <p>
      {t('learn_more_at')}{' '}
      <a href="https://tudominio.com/ayuda/automatizaciones" target="_blank">
        {t('help_center')} &gt; {t('help_center_automations')}
      </a>
    </p>
  </section>

  <section id="temperatureAndToneSettings">
    <h3>{t('temperature_and_tone_settings')}</h3>
    <p>{t('this_section_defines_style')}</p>

    <table className={styles.table}>
      <thead>
        <tr>
          <th>{t('parameter')}</th>
          <th>{t('description')}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{t('tone')}</td>
          <td>{t('style_language')}</td>
        </tr>
        <tr>
          <td>{t('detail_level')}</td>
          <td>{t('amount_depth_info')}</td>
        </tr>
        <tr>
          <td>{t('age_experience')}</td>
          <td>{t('technical_vocabulary')}</td>
        </tr>
        <tr>
          <td>{t('availability')}</td>
          <td>{t('proactivity_in_responses')}</td>
        </tr>
        <tr>
          <td>{t('use_of_emojis')}</td>
          <td>{t('visual_expressiveness')}</td>
        </tr>
        <tr>
          <td>{t('inclusive_language')}</td>
          <td>{t('attention_to_neutrality')}</td>
        </tr>
        <tr>
          <td>{t('formality')}</td>
          <td>{t('style_of_address')}</td>
        </tr>
        <tr>
          <td>{t('precision')}</td>
          <td>{t('level_of_rigor')}</td>
        </tr>
        <tr>
          <td>{t('coherence')}</td>
          <td>{t('logic_between_responses')}</td>
        </tr>
        <tr>
          <td>{t('emotional_language')}</td>
          <td>{t('emotional_charge')}</td>
        </tr>
      </tbody>
    </table>

    <p>{t('you_can_edit_delete_temperatures')}</p>
  </section>

  <section id="howToAddNewTemperature">
    <h3>{t('how_to_add_new_temperature')}</h3>
    <ol className={styles.olstyle}>
      <li>{t('click_add_temperature')}</li>
      <li>{t('assign_descriptive_name')}</li>
      <li>{t('adjust_10_values_slider')}</li>
      <li>{t('write_short_description')}</li>
      <li>{t('use_test_button')}</li>
      <li>{t('save_changes')}</li>
    </ol>
    <p>{t('you_can_have_as_many_temperatures_as_needed')}</p>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('tip_think_of_temperature_as_emotional_functional_profile')}</p>
      </div>
    </div>
  </section>

  <section id="programmedResponses">
    <h3>{t('programmed_responses')}</h3>
    <p>{t('facturagpt_agents_allow_configured_responses')}</p>
    <p>{t('simple_rules_for_automatic_replies')}</p>

    <div className={styles.textGray}>{t('useful_for')}</div>
    <ul>
      <li>{t('welcome_messages')}</li>
      <li>{t('frequent_clarifications')}</li>
      <li>{t('quick_instructions')}</li>
      <li>{t('custom_error_messages')}</li>
    </ul>

    <h4>{t('how_to_configure')}</h4>
    <ol className={styles.olstyle}>
      <li>{t('access_agent_settings')}</li>
      <li>{t('go_to_behavior_tab')}</li>
      <li>{t('click_new_programmed_response')}</li>
      <li>
        <p><strong>{t('when_user_asks_about')}:</strong> {t('add_keywords_phrases')}</p>
        <p><strong>{t('agent_should_respond')}:</strong> {t('define_message')}</p>
        <p><strong>{t('activation_frequency')}:</strong> {t('set_days_hours')}</p>
      </li>
      <li>{t('add_multiple_triggers_responses')}</li>
    </ol>
  </section>

  <section id="uploadAndScraping">
    <h3>{t('upload_and_scraping')}</h3>
    <p>{t('upload_documents_to_agent_chat')}</p>
    <p>{t('web_scraping_give_url')}</p>

    <p>{t('agent_processes_and_can')}</p>
    <ul>
      <li>{t('extract_key_variables')}</li>
      <li>{t('classify_in_tables')}</li>
      <li>{t('generate_summaries_reports')}</li>
    </ul>
  </section>

  <section id="visibilitySharePublish">
    <h3>{t('visibility_share_publish')}</h3>
    <p>{t('in_facturagpt_you_can_decide_who_has_access')}</p>

    <h4>{t('private_default')}</h4>
    <ul>
      <li>{t('only_you_can_see_use')}</li>
      <li>{t('ideal_for_personal_flows')}</li>
      <li>{t('not_visible_to_others')}</li>
      <li>{t('can_share_with_workspace')}</li>
      <li>{t('agent_visible_to_team')}</li>
      <li>{t('activate_from_capabilities_tab')}</li>
    </ul>

    <h4>{t('public_community')}</h4>
    <ul>
      <li>{t('published_in_marketplace')}</li>
      <li>{t('any_user_can_find_try_save')}</li>
      <li>{t('monetize_with_payment_or_subscription')}</li>
      <li>{t('protect_with_access_key')}</li>
      <li>{t('add_access_key_optional')}</li>
    </ul>
    <p>
      {t('in_explore_community_discover_agents')}{' '}
      <a href="https://tudominio.com/ayuda/comunidad" target="_blank">
        {t('help_center')} &gt; {t('help_center_community')}
      </a>
    </p>
  </section>

  <section id="bestPracticesPrompts">
    <h3>{t('best_practices_prompts')}</h3>
    <ul>
      <li>{t('be_clear_and_specific')}</li>
      <li>{t('define_output_format')}</li>
      <li>{t('use_table_document_variables')}</li>
      <li>{t('reuse_prompt_templates')}</li>
    </ul>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('tip_create_prompt_agent')}</p>
      </div>
    </div>
  </section>

  <section id="effectivePromptExamples">
    <h3>{t('effective_prompt_examples')}</h3>
    <ul>
      <li>{t('action_source_condition_output')}</li>
      <li>{t('summarize_translate')}</li>
      <li>{t('classification')}</li>
      <li>{t('generation_with_format')}</li>
      <li>{t('chained_actions')}</li>
      <li>{t('comparison_analysis')}</li>
      <li>{t('simulation')}</li>
    </ul>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('tip_always_request_output_format')}</p>
      </div>
    </div>
  </section>
</div>
    </div>
  );
};

export default ContactManagement;
