import React, { useEffect, useState } from "react";
import TemplateArticleHelp from "../TemplateArticleHelp/TemplateArticleHelp";
import styles from "./FirstSteeps.module.css";
import { ReactComponent as SettingGreenIcon } from "../../../assets/SettingGreenIcon.svg";
import { ReactComponent as SettingGrayIcon } from "../../../assets/SettingGrayIcon.svg";
import { ReactComponent as GrayDotsAppIcon } from "../../../assets/GrayDotsAppIcon.svg";
import { ReactComponent as ConectionsGrayIcon } from "../../../assets/ConectionsGrayIcon.svg";
import { ReactComponent as ArrowDownBold } from "../../../assets/arrowDownBold.svg";
import { ReactComponent as ShortCutIcon } from "../../../assets/ShortcutsIcon.svg";
import { ReactComponent as DataPersonalOne } from "../../../assets/DataPersonalOne.svg";
import { ReactComponent as DataPersonalTwo } from "../../../assets/DataPersonaltwo.svg";
import { ReactComponent as DataPersonalThree } from "../../../assets/DataPersonalThree.svg";
import { ReactComponent as DataPersonalFour } from "../../../assets/DataPersonalFOur.svg";
import { useTranslation } from "react-i18next";
import { ReactComponent as GreenExclamationIcon } from "../../../assets/GreenExclamationIcon.svg";

const YourAccount = ({setSelectedCategory, setSelectedSubCategory}) => {
  const { t } = useTranslation("helpPage");
  
const shortcuts = [
  {
    keys: ['⌘', 'Shift', 'Ctrl', 'S'],
    action: 'Ajustes',
  },
  {
    keys: ['⌘', 'Shift', 'Ctrl', 'space'],
    action: 'Chat',
    hasIcon: true,
  },
  {
    keys: ['⌘', 'Shift', 'Ctrl', 'W'],
    action: 'Lista de Workspaces',
  },
  {
    keys: ['Shift', 'Alt', 'D'],
    action: 'Nuevo documento',
    hasIcon: true,
  },
  {
    keys: ['⌘', 'Shift', 'Ctrl', 'H'],
    action: 'Panel',
  },
  {
    keys: ['Shift', 'Alt', 'A'],
    action: 'Nuevo Activo',
    hasIcon: true,
  },
  {
    keys: ['⌘', 'Shift', 'Ctrl', 'A'],
    action: 'Agents',
  },
  {
    keys: ['Shift', 'Alt', 'C'],
    action: 'Nuevo contacto',
    hasIcon: true,
  },
  {
    keys: ['⌘', 'Shift', 'Ctrl', 'F'],
    action: 'Workflows',
  },
  {
    keys: ['⌘', 'Ctrl', 'J'],
    action: 'Modo oscuro',
  },
  {
    keys: ['⌘', 'Shift', 'Ctrl', 'T'],
    action: 'Tablas',
  },
];

  
  const renderKey = (key) => {
  if (key === 'cmd') return '⌘';
  if (key === 'shift') return '⇧';
  if (key === 'ctrl') return '⌃';
  if (key === 'alt') return '⌥';
  if (key === 'space') return '␣';
  return key;
};

  return (
    <div>
      <TemplateArticleHelp
           title={t("firstSteeps")}
        Icon={SettingGreenIcon}
        setSelectedCategory={setSelectedCategory}
        validate={false}

      />

    <div className={styles.SteepCategory}>

        <section id="whatIsFacturaGPT">
        <div>
          <h2>{t('firstSteeps')}</h2>
          <p>{t('first_steps_welcome')}</p>
        </div>
          <h3>{t('what_is_facturagpt_title')}</h3>
          <p>{t('what_is_facturagpt_description')}</p>
          <p>{t('what_is_facturagpt_benefits')}</p>

          <ul>
            <li>{t('facturagpt_feature_upload')}</li>
            <li>{t('facturagpt_feature_automations')}</li>
            <li>{t('facturagpt_feature_agents')}</li>
            <li>{t('facturagpt_feature_workspaces')}</li>
          </ul>

          <div className={styles.card}>
            <div>
              <GreenExclamationIcon />
            </div>
            <div className={styles.cardContent}>
              <p>
                {t('more_details')}{' '}
                <a href="https://tudominio.com/ayuda/tu-cuenta" target="_blank">
                  {t('help_center_account')} &gt; {t('help_center_account')}
                </a>
              </p>
            </div>
          </div>

          <h3 id="sessionsKeyNavbar">{t('navigation_menu_title')}</h3>
          <ul>
            <li>{t('navigation_panel')}</li>
            <li>{t('navigation_conversations')}</li>
            <li>{t('navigation_agents')}</li>
            <li>{t('navigation_documents')}</li>
            <li>{t('navigation_tables')}</li>
            <li>{t('navigation_automations')}</li>
            <li>{t('navigation_activity')}</li>
            <li>{t('navigation_more')}</li>
            <li>{t('navigation_subscription')}</li>
            <li>{t('navigation_feedback')}</li>
          </ul>
        </section>

        <section id="sessionsKeyNavbar">
          <div className={styles.subtitle}>{t('chat_queries_title')}</div>

          <p>
            {t('chat_access_intro')}{' '}
            <kbd>⌘ + {t('space')}</kbd> (Mac) {t('or')} <kbd>Alt + {t('space')}</kbd> (Windows).
          </p>

          <p>{t('chat_functionality')}</p>

          <div className={styles.textGray}>{t('how_at_works')}</div>
          <p>{t('at_command_description')}</p>
          <p>{t('at_command_context')}</p>

          <p>{t('at_command_suggestions_title')}</p>
          <ul>
            <li>{t('at_suggestion_documents')}</li>
            <li>{t('at_suggestion_contacts')}</li>
            <li>{t('at_suggestion_assets')}</li>
            <li>{t('at_suggestion_variables')}</li>
            <li>{t('at_suggestion_operators')}</li>
          </ul>

          <div className={styles.card}>
            <div>
              <GreenExclamationIcon />
            </div>
            <div className={styles.cardContent}>
              <p>
                {t('at_feature_text_only')}{' '}
                <a href="https://tudominio.com/ayuda/agentes" target="_blank">
                  {t('help_center')} &gt; {t('help_center_agents')}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="registerSteeptoSteep">
          <h3>{t('register_steps_title')}</h3>

          <ol className={styles.olstyle}>
            <li>
              <h4>{t('register_step_1_title')}</h4>
              <p>
                {t('register_step_1_description')}{' '}
                <a href="https://facturagpt.com" target="_blank">facturagpt.com</a> {t('and_click')} "{t('try_free')}".
              </p>
            </li>

            <li>
              <h4>{t('register_step_2_title')}</h4>
              <ul>
                <li>{t('register_step_2_name_email')}</li>
                <li>{t('register_step_2_secure_password')}</li>
                <li>{t('register_step_2_accept_terms')}</li>
                <li>{t('register_step_2_create_account')}</li>
              </ul>
            </li>

            <li>
              <h4>{t('register_step_3_title')}</h4>
              <ul>
                <li>{t('register_step_3_verification_email')}</li>
                <li>{t('register_step_3_paste_code')}</li>
              </ul>

              <p className={styles.textGray}>{t('if_email_not_found')}</p>
              <ul>
                <li>{t('check_spam_folder')}</li>
                <li>{t('resend_verification_email')}</li>
              </ul>
            </li>

            <li>
              <h4>{t('register_step_4_title')}</h4>
            </li>
          </ol>

          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>
                {t('enable_2fa_for_security')} →
                <a href="#">{t('help_center_security')}</a>
              </p>
            </div>
          </div>
        </section>

        <section id="firstepsBeforeRegister">
          <div className={styles.textGray}>{t('first_steps_before_register')}</div>
          <ol className={styles.olstyle}>
            <li>
              <p>{t('complete_your_info')}</p>
              <div className={styles.DataPersonaContainer}>
                <div>
                  <DataPersonalOne />
                </div>
                <ul>
                  <li>{t('optimize_experience')}</li>
                  <li>{t('profile_photo')}</li>
                  <li>{t('full_name')}</li>
                  <li>{t('display_name')}</li>
                </ul>
              </div>
            </li>

            <li>
              <p>{t('create_workspace_or_invite')}</p>
              <div className={styles.DataPersonaContainer}>
                <div>
                  <DataPersonalTwo />
                </div>
                <div>
                  <p>
                    <span>{t('workspace_is_your_operations_center')}</span><br />
                    {t('workspace_functions')}
                  </p>
                  <ul>
                    <li>{t('workspace_new_assign_name')}</li>
                    <li>{t('workspace_new_upload_icon')}</li>
                    <li>{t('workspace_new_configure_owner')}</li>
                  </ul>
                  <div className={styles.card} style={{ height: '30px', margin: '29px 0 0 0' }}>
                    <GreenExclamationIcon />
                    <div className={styles.cardContent}>
                      <p>{t('workspace_new_must_create')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.DataPersonaContainer}>
                <div>
                  <DataPersonalThree />
                </div>
                <div>
                  <ul>
                    <li>{t('workspace_invitation_accept')}</li>
                  </ul>
                  <div className={styles.card} style={{ height: '30px', margin: '45px 0 0 0' }}>
                    <GreenExclamationIcon />
                    <div className={styles.cardContent}>
                      <p>{t('workspace_invitation_revoked')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <p>{t('congratulations_account_active')}</p>
              <div className={styles.DataPersonaContainer}>
                <div>
                  <DataPersonalFour />
                </div>
                <div className={styles.containerVideo}>
                  <div style={{ height: '500px' }}>VIDEO</div>
                  <p>{t('intro_video_recommendation')}</p>
                  <div className={styles.card}>
                    <GreenExclamationIcon />
                    <div className={styles.cardContent}>
                      <p>{t('activate_ia_token_to_start')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </section>

        <section id="first_token_activation">
          <h3>{t('first_token_activation')}</h3>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span><strong>{t('token_component_1')}</strong> </span>
            <span>{t('token_component_2')}</span>
            <span>{t('token_component_3')}</span>
            <span>{t('token_component_4')}</span>
          </div>

          <p>{t('token_before_using')}</p>

          <div className={styles.textGray}>{t('where_to_enter_token')}</div>
          <p>{t('different_ways_to_connect')}</p>

          <ol>
            <li>
              <span>{t('token_method_settings')}</span>
              <ol className={styles.olstyle}>
                <li>{t('token_settings_step_1')}</li>
                <li>{t('token_settings_step_2')}</li>
                <li>{t('token_settings_step_3')}</li>
                <li>{t('token_settings_step_4')}</li>
                <li>{t('token_settings_step_5')}</li>
              </ol>
            </li>
            <li>
              <h4>{t('token_method_chat')}</h4>
              <ul>
                <li>{t('token_chat_paste')}</li>
              </ul>
            </li>
          </ol>

          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>
                {t('token_important_consumption')}{' '}
                <a href="https://tudominio.com/ayuda/suscripcion" target="_blank">
                  {t('help_center')} &gt; {t('help_center_subscription')}
                </a>
              </p>
            </div>
          </div>

          <div className={styles.textGray}>{t('where_get_token')}</div>

          <h4>{t('token_openai_title')}</h4>
          <ul>
            <li>
              <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener">
                {t('token_openai_api_key_link')}
              </a>
            </li>
            <li>
              <a href="https://platform.openai.com/account/org-settings" target="_blank" rel="noopener">
                {t('token_openai_org_id_link')}
              </a>
            </li>
          </ul>

          <h4>{t('token_other_models_title')}</h4>
          <ul>
            <li>{t('token_other_models_beta')}</li>
          </ul>

          <h4>{t('token_third_party_title')}</h4>
          <p>{t('token_third_party_description')}</p>
        </section>

        <section id="workspace_creation_title">
          <h3>{t('workspace_creation_title')}</h3>
          <p>
            {t('workspace_description')}<br />
            <strong>{t('workspace_steps')}</strong>
          </p>
          <ol className={styles.olstyle}>
            <li>{t('workspace_step_1')}</li>
            <li>{t('workspace_step_2')}</li>
            <li>{t('workspace_step_3')}</li>
            <li>{t('workspace_step_4')}</li>
            <li>{t('workspace_step_5')}</li>
          </ol>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>
                {t('learn_more_at')}{' '}
                <a href="#" target="_blank">
                  {t('help_center')} &gt; {t('help_center_account')} &gt; {t('help_center_workspace')}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="upload_first_document_title">
          <h3>{t('upload_first_document_title')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{t('document_component_1')}</span>
            <span><strong>{t('document_component_2')}</strong></span>
            <span>{t('document_component_3')}</span>
            <span>{t('document_component_4')}</span>
          </div>

          <ol className={styles.olstyle}>
            <li>
              <h3>{t('upload_document_step_1_title')}</h3>
              <p>{t('upload_document_step_1_intro')}</p>
              <ul>
                <li>{t('upload_method_file')}</li>
                <li>{t('upload_method_drag_drop')}</li>
                <li>{t('upload_method_camera')}</li>
              </ul>
            </li>
            <li>
              <h3>{t('save_organize_title')}</h3>
              <p>{t('save_organize_step_1')}</p>
              <p>{t('save_organize_ai_recognition')}</p>
            </li>
            <li>
              <h3>{t('advanced_options_title')}</h3>
              <ul>
                <li>{t('advanced_option_auto_upload')}</li>
                <li>{t('advanced_option_generate_with_ia')}</li>
              </ul>
              <div className={styles.card}>
                <GreenExclamationIcon />
                <div className={styles.cardContent}>
                  <p>
                    {t('learn_more_about_ia_documents')}{' '}
                    <a href="https://tudominio.com/ayuda/documentos" target="_blank">
                      {t('help_center')} &gt; {t('help_center_documents')}
                    </a>{' '}
                    {t('or_ask_in_chat')}{' '}
                    <a href="https://tudominio.com/ayuda/agentes" target="_blank">
                      {t('help_center')} &gt; {t('help_center_agents')}
                    </a>
                  </p>
                </div>
              </div>
            </li>
          </ol>
          <span>{t('supported_formats')}</span><br />
          <span>{t('build_your_private_library')}</span>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>
                {t('tip_convert_to_table')}{' '}
                <a href="https://tudominio.com/ayuda/tablas" target="_blank">
                  {t('help_center')} &gt; {t('help_center_tables')}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="automate_first_flow_title">
          <h3>{t('automate_first_flow_title')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{t('automation_component_1')}</span>
            <span>{t('automation_component_2')}</span>
            <span><strong>{t('automation_component_3')}</strong></span>
            <span>{t('automation_component_4')}</span>
          </div>
          <p>{t('automation_intro')}</p>
          <p>{t('three_ways_to_create_flow')}</p>
          <p>{t('automation_method_chat')}</p>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>{t('automation_method_chat_reminder')}</p>
            </div>
          </div>
          <p>{t('automation_method_menu')}</p>
          <p>{t('automation_method_manual')}</p>
          <h3>{t('automation_setup_steps')}</h3>
          <ul>
            <li>{t('automation_step_connect_source')}</li>
            <li>{t('automation_step_define_conditions')}</li>
            <li>{t('automation_step_choose_actions')}</li>
            <li>{t('automation_step_connect_apis')}</li>
          </ul>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>
                {t('for_advanced_cases')}{' '}
                <a href="#" target="_blank">
                  {t('help_center')} &gt;  {t('help_center_automations')}
                </a>{' '}
                {t('or_contact_team')}
              </p>
            </div>
          </div>
          <p>{t('automation_benefits')}</p>
        </section>

        <section id="activate_first_agent_title">
          <h3>{t('activate_first_agent_title')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{t('automation_component_1')}</span>
          <span>{t('automation_component_2')}</span>
            <span>{t('automation_component_3')}</span>
            <span><strong>{t('automation_component_4')}</strong></span>
          </div>
          <p>{t('agent_description')}</p>
          <ol className={styles.olstyle}>
            <li>{t('agent_step_1')}</li>
            <li>
              <h3>{t('agent_step_2_title')}</h3>
              <p>{t('agent_step_2_description')}</p>
            </li>
            <li>
              <h3>{t('agent_step_3_title')}</h3>
              <p>{t('agent_step_3_intro')}</p>
              <ul>
                <li>{t('agent_prompt_instructions')}</li>
                <li>{t('agent_temperature_adjust')}</li>
              </ul>
            </li>
            <li>
              <h3>{t('agent_step_4_title')}</h3>
              <ul>
                <li>{t('agent_capabilities_access')}</li>
                <li>{t('agent_behavior_auto_responses')}</li>
              </ul>
            </li>
            <li>
              <h3>{t('agent_step_5_title')}</h3>
              <p>{t('agent_visibility_options')}</p>
            </li>
            <li>
              <h3>{t('agent_step_6_title')}</h3>
              <p>{t('agent_test_before_use')}</p>
            </li>
          </ol>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>
                {t('more_info_at')}{' '}
                <a href="" target="_blank">
                  {t('help_center')} &gt;  {t('help_center_agents')}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="useCases">
          <h3>{t('useCases')}</h3>
          <ul>
            <li>{t('use_case_freelancers_title')}</li>
            <li>{t('use_case_freelancers_ideal_for')}</li>
            <li>{t('use_case_freelancers_benefits')}</li>
            <li>{t('use_case_freelancers_scale_if')}</li>
          </ul>
          <ul>
            <li>{t('use_case_sme_title')}</li>
            <li>{t('use_case_sme_ideal_for')}</li>
            <li>{t('use_case_sme_benefits')}</li>
            <li>{t('use_case_sme_scale_if')}</li>
          </ul>
          <ul>
            <li>{t('use_case_corporate_title')}</li>
            <li>{t('use_case_corporate_ideal_for')}</li>
            <li>{t('use_case_corporate_benefits')}</li>
            <li>{t('use_case_corporate_scale_if')}</li>
          </ul>
          <ul>
            <li>{t('use_case_partners_title')}</li>
            <li>{t('use_case_partners_ideal_for')}</li>
            <li>{t('use_case_partners_benefits')}</li>
            <li>{t('use_case_partners_scale_if')}</li>
          </ul>
        </section>

        <section id="quick_glossary_and_shortcuts">
          <h3>{t('quick_glossary_and_shortcuts')}</h3>
          <p className={styles.textGray}>{t('Glosario')}</p>
          <ul>
            <li>{t('glossary_workspace')}</li>
            <li>{t('glossary_role')}</li>
            <li>{t('glossary_tables')}</li>
            <li>{t('glossary_automation')}</li>
            <li>{t('glossary_agent')}</li>
            <li>{t('glossary_token')}</li>
            <li>{t('glossary_variables')}</li>
            <li>{t('glossary_status')}</li>
          </ul>
          <div className={styles.subtitle}>
            <h3>{t('shortcuts')}</h3>
          </div>
          <div className={styles.shortcutsContainer}>
            {shortcuts.map((item, index) => (
              <div key={index} className={styles.shortcutsCard}>
                <div className={styles.shortcuts}>
                  {item.hasIcon && <ShortCutIcon />}
                  {item.keys.map((k, i) => (
                    <React.Fragment key={i}>
                      {renderKey(k)}
                      {i < item.keys.length - 1 && ' + '}
                    </React.Fragment>
                  ))}
                </div>
                <p className={styles.action}>{t(item.action)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
  </div>
        
    );
  };

  export default YourAccount;
