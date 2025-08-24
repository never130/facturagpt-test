import React, { useState } from "react";
import TemplateArticleHelp from "../TemplateArticleHelp/TemplateArticleHelp";
// import styles from "./Security.module.css";
import { ReactComponent as ArrowDownBold } from "../../../assets/arrowDownBold.svg";
import { ReactComponent as SecurityGreenIcon } from "../../../assets/SecurityGreenIcon.svg";
import { ReactComponent as BlackWarningIcon } from "../../../assets/BlackWarningIcon.svg";
import { useTranslation } from "react-i18next";
import { ReactComponent as GreenExclamationIcon } from "../../../assets/GreenExclamationIcon.svg";
import styles from "../FirstSteeps/FirstSteeps.module.css";
const Security = ({ setSelectedCategory }) => {
  const { t } = useTranslation("helpPage");

  const [activeArticles, setActiveArticles] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
  });

  const handleClick = (index) => {
    setActiveArticles((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div>
      <TemplateArticleHelp
        title={t("security")}
        Icon={SecurityGreenIcon}
        setSelectedCategory={setSelectedCategory}
        validate={false}

      />
        <div className={styles.SteepCategory}>
          <section id="security">
          <h2>{t('security')}</h2>

            <p>{t('facturagpt_processes_your_data_securely')}</p>
            <p>
              {t('for_more_information_consult')}:{' '}
              <a href="https://facturagpt.com/terms" target="_blank">{t('terms_and_conditions')}</a>,{' '}
              <a href="https://facturagpt.com/privacy" target="_blank">{t('privacy_policy')}</a>
            </p>
          </section>

          <section id="accountSecurity">
            <h3>{t('account_security')}</h3>
            <p>{t('in_settings_you_can_manage')}:</p>
            <ul>
              <li>{t('email_verify_or_change')}</li>
              <li>{t('password_change_anytime')}</li>
              <li>{t('two_factor_auth_2fa')}</li>
              <li>{t('logout_all_devices')}</li>
            </ul>
          </section>

          <section id="howToEnable2FA">
            <h3>{t('how_to_enable_2fa')}</h3>
            <p>{t('2fa_adds_extra_security_layer')}</p>
            <p>{t('once_enabled_login_requires_password_and_code')}</p>
            <p><strong>{t('where_to_activate')}:</strong> {t('settings')} &gt; {t('security')} &gt; {t('activate_2fa')}</p>

            <ol className={styles.olstyle}>
              <li>{t('go_to_settings_security_and_click_2fa')}</li>
              <li>{t('scan_qr_with_auth_app')}</li>
              <li>{t('enter_temporary_code_to_verify')}</li>
              <li>{t('save_recovery_code_securely')}</li>
              <li>{t('confirm_and_activate')}</li>
            </ol>

            <div className={styles.card}>
              <GreenExclamationIcon />
              <div className={styles.cardContent}>
                <p>{t('if_someone_has_access_to_your_email')}</p>
              </div>
            </div>
          </section>

          <section id="resetPassword">
            <h3>{t('reset_password')}</h3>
            <p>{t('if_you_forgot_your_password')}:</p>
            <ol className={styles.olstyle}>
              <li>{t('go_to_facturagpt_login')}</li>
              <li>{t('click_forgot_password')}</li>
              <li>{t('enter_email_and_send_code')}</li>
              <li>{t('check_inbox_and_spam')}</li>
              <li>{t('enter_received_code')}</li>
              <li>{t('set_new_password_min_8_chars')}</li>
              <li>{t('confirm_to_complete')}</li>
            </ol>

            <p>{t('if_you_do_not_receive_email')}:</p>
            <ul>
              <li>{t('verify_email_is_correct')}</li>
              <li>{t('check_spam_promotions')}</li>
              <li>{t('resend_code_or_contact_support')}</li>
            </ul>
          </section>

          <section id="logout">
            <h3>{t('logout')}</h3>
            <p>{t('secure_logout_options')}:</p>
            <ul>
              <li>{t('from_profile_menu_avatar_shortcut_logout')}</li>
              <li>{t('from_settings_general_exit')}</li>
              <li>{t('from_settings_devices_close_all_sessions')}</li>
            </ul>
            <p>{t('confirmation_dialog_shown_before_logout')}</p>
          </section>

          <section id="workspaceAndTableSecurity">
            <h3>{t('workspace_and_table_security')}</h3>
            <ul>
              <li>{t('each_workspace_is_isolated')}</li>
              <li>{t('tables_configurable_as_public_private')}</li>
              <li>{t('only_users_with_permissions_can_modify')}</li>
              <li>{t('access_managed_when_inviting_or_in_settings')}</li>
            </ul>
            <p>
              {t('visit')}{' '}
              <a href="https://tudominio.com/ayuda/tu-cuenta" target="_blank">
                {t('help_center')} &gt; {t('your_account')}
              </a> {t('for_more_information')}
            </p>
          </section>

          <section id="agentSecurity">
            <h3>{t('agent_security')}</h3>
            <ul>
              <li>{t('agents_only_access_configured_data')}</li>
              <li>{t('can_be_restricted_to_specific_workspace')}</li>
              <li>{t('private_agents_accessible_only_to_authorized_users')}</li>
              <li>{t('all_interactions_logged_for_traceability')}</li>
            </ul>
          </section>

          <section id="documentCustody">
            <h3>{t('document_custody')}</h3>
            <ul>
              <li>{t('compliance_with_document_retention_laws')}</li>
              <li>{t('standard_period_4_years')}</li>
              <li>{t('extended_period_up_to_7_years')}</li>
              <li>{t('documents_stored_on_secure_servers')}</li>
            </ul>
            <p>
              {t('see')}{' '}
              <a href="https://tudominio.com/ayuda/documentos" target="_blank">
                {t('help_center')} &gt; {t('documents')}
              </a>
            </p>
          </section>

          <section id="paymentMethodsAndBankData">
            <h3>{t('payment_methods_and_bank_data')}</h3>
            <ul>
              <li>{t('card_data_encrypted_shows_last_4_digits')}</li>
              <li>{t('manage_changes_in_settings_subscription')}</li>
              <li>{t('facturagpt_does_not_store_cvv')}</li>
              <li>{t('payments_processed_via_certified_external_platforms')}</li>
            </ul>
          </section>

          <section id="deleteAccount">
            <h3>{t('delete_account')}</h3>
            <ol className={styles.olstyle}>
              <li>{t('go_to_settings_data_control')}</li>
              <li>{t('click_delete_account')}</li>
              <li>{t('enter_your_password')}</li>
              <li>{t('confirm_permanent_deletion')}</li>
            </ol>
            <div className={styles.card}>
              <GreenExclamationIcon />
              <div className={styles.cardContent}>
                <p>{t('irreversible_action_all_data_deleted')}</p>
              </div>
            </div>
          </section>

          <section id="privacyAndDataStoragePolicy">
            <h3>{t('privacy_and_data_storage_policy')}</h3>
            <ul>
              <li>{t('complies_with_iso_27001_9001_and_gdpr')}</li>
              <li>{t('conversations_not_stored_on_external_servers')}</li>
              <li>{t('constant_backups')}</li>
              <li>{t('configurable_retention_rules_in_advanced_settings')}</li>
            </ul>
          </section>

          <section id="securityRecommendations">
            <h3>{t('security_recommendations')}</h3>
            <ul>
              <li>{t('use_unique_and_strong_password')}</li>
              <li>{t('enable_login_and_security_notifications')}</li>
              <li>{t('review_and_close_active_sessions')}</li>
              <li>{t('set_appropriate_roles_in_workspaces')}</li>
              <li>{t('keep_workspaces_private_if_sensitive')}</li>
              <li>{t('limit_agent_access_to_needed_capabilities')}</li>
              <li>{t('activate_2fa_for_maximum_security')}</li>
              <li>{t('never_share_your_configuration_code')}</li>
            </ul>
          </section>
</div>
    </div>
  );
};

export default Security;
