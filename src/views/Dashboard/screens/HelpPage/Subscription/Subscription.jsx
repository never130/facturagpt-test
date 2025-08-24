import React from 'react'
import { ReactComponent as GreenExclamationIcon } from "../../../assets/GreenExclamationIcon.svg";
import styles from "../FirstSteeps/FirstSteeps.module.css";
import TemplateArticleHelp from '../TemplateArticleHelp/TemplateArticleHelp';
import { useTranslation } from "react-i18next";
import { ReactComponent as TransactionsGreenIcon } from "../../../assets/TransactionsGreenIcon.svg";
import { ReactComponent as Star } from "../../../assets/star-alt.svg";

export default function Subscription({setSelectedCategory}) {
    const { t } = useTranslation(["helpPage", "ChatView"]);
  
  return (
    <div>
        <TemplateArticleHelp
        title={t('transactions')}
        Icon={Star}
        setSelectedCategory={setSelectedCategory}
        validate={false}
      />
        <div className={styles.SteepCategory}>
  <section id="subscription">
      <h2>{t('suscription')}</h2>
    <p>{t('subscription_description')}</p>
  </section>

  <section id="manageFromSettings">
    <h3>{t('manage_from_settings_subscription')}</h3>
    <p>{t('access_settings_subscription_to')}:</p>
    <ul>
      <li>{t('check_plan_status')}</li>
      <li>{t('review_limits_and_ia_token_usage')}</li>
      <li>{t('change_plan_or_cancel')}</li>
      <li>{t('manage_billing_and_payment_methods')}</li>
    </ul>
  </section>

  <section id="planTypes">
    <h3>{t('plan_types')}</h3>
    <p>{t('in_settings_subscription_you_can_manage')}</p>

    <h4>{t('business')}</h4>
    <p><strong>{t('ideal_size')}:</strong> {t('business_ideal_size')}</p>
    <p><strong>{t('typical_use')}:</strong> {t('business_typical_use')}</p>
    <p><strong>{t('key_benefit')}:</strong> {t('business_key_benefit')}</p>

    <h4>{t('enterprise')}</h4>
    <p><strong>{t('ideal_size')}:</strong> {t('enterprise_ideal_size')}</p>
    <p><strong>{t('typical_use')}:</strong> {t('enterprise_typical_use')}</p>
    <p><strong>{t('key_benefit')}:</strong> {t('enterprise_key_benefit')}</p>

    <h4>{t('corporation')}</h4>
    <p><strong>{t('ideal_size')}:</strong> {t('corporation_ideal_size')}</p>
    <p><strong>{t('typical_use')}:</strong> {t('corporation_typical_use')}</p>
    <p><strong>{t('key_benefit')}:</strong> {t('corporation_key_benefit')}</p>

    <h4>{t('partners')}</h4>
    <p><strong>{t('ideal_size')}:</strong> {t('partners_ideal_size')}</p>
    <p><strong>{t('typical_use')}:</strong></p>
    <ul>
      <li>{t('resell_under_own_brand')}</li>
      <li>{t('customize_for_specific_niches')}</li>
      <li>{t('integrate_with_own_or_client_systems')}</li>
    </ul>
    <p><strong>{t('key_benefit')}:</strong> {t('partners_key_benefit')}</p>

    <p>{t('each_plan_defines_limits')}</p>
  </section>

  <section id="iaTokenManagement">
    <h3>{t('ia_token_management')}</h3>
    <p>{t('facturagpt_uses_ia_tokens')}</p>
    <p>{t('in_subscription_panel_you_can')}:</p>
    <ul>
      <li>{t('check_current_token_balance')}</li>
      <li>{t('view_token_consumption')}</li>
      <li>{t('add_more_tokens_if_needed')}</li>
    </ul>
  </section>

  <section id="billingAndPaymentMethods">
    <h3>{t('billing_and_payment_methods')}</h3>
    <p>{t('from_subscription_you_can')}:</p>
    <ul>
      <li>{t('download_invoices')}</li>
      <li>{t('review_charges')}</li>
      <li>{t('change_payment_method')}</li>
    </ul>
  </section>

  <section id="planChangesAndCancellations">
    <h3>{t('plan_changes_and_cancellations')}</h3>
    <ul>
      <li>{t('upgrade_plan_anytime')}</li>
      <li>{t('cancel_plan_from_this_section')}</li>
    </ul>
  </section>

  <section id="supportAndCommercialContact">
    <h3>{t('support_and_commercial_contact')}</h3>
    <p>{t('for_questions_about_subscription')}:</p>
    <p>
      {t('contact_tech_support')}{' '}
      <a href="mailto:info@facturagpt.com">info@facturagpt.com</a>
    </p>
  </section>

  <section id="currentPlan">
    <h3>{t('current_plan')}</h3>
    <p>{t('check_modify_expand_your_plan')}</p>
    <p><strong>{t('where_to_find_it')}:</strong> {t('settings')} &gt; {t('get_plus')}</p>
  </section>

  <section id="checkYourPlan">
    <h3>{t('check_your_plan')}</h3>
    <ul>
      <li><strong>{t('last_billing')}:</strong> {t('last_charge_date_with_history_option')}</li>
      <li><strong>{t('current_plan')}:</strong> {t('shows_active_plan_and_limits')}</li>
      <li><strong>{t('billing_date')}:</strong> {t('automatic_renewal_day_visible')}</li>
      <li><strong>{t('spending_limit')}:</strong> {t('set_monthly_cap_to_avoid_overcosts')}</li>
    </ul>
  </section>

  <section id="subscriptionHistory">
    <h3>{t('subscription_history')}</h3>
    <p>{t('click_view_history_to_see_all_invoices')}</p>
    <p>{t('you_can_set_destination_folder_for_invoices')}</p>
    <p>{t('if_vat_added_in_settings_account')}</p>
    <p>{t('in_each_record_you_can_access')}:</p>
    <ul>
      <li>{t('invoiced_amount')}</li>
      <li>{t('issue_date')}</li>
      <li>{t('payment_method_used')}</li>
      <li>{t('download_receipt_digital')}</li>
    </ul>
  </section>

  <section id="spendingLimit">
    <h3>{t('spending_limit')}</h3>
    <p>{t('consumption_in_facturagpt_calculated_by_pages')}</p>
    <p>{t('from_settings_subscription_you_can')}:</p>
    <ul>
      <li>{t('check_pages_used_in_real_time')}</li>
      <li>{t('set_additional_spending_limit')}</li>
    </ul>
    <p>{t('usage_limits_linked_to_plan')}</p>
    <ul>
      <li>{t('upgrade_plan_immediate_capacity_increase')}</li>
      <li>{t('automatic_renewal_next_cycle')}</li>
    </ul>
  </section>

  <section id="invitationCodes">
    <h3>{t('invitation_codes')}</h3>
    <p>{t('facturagpt_offers_referral_system')}:</p>
    <ul>
      <li>{t('share_your_code_with_others')}</li>
      <li>{t('for_each_user_who_registers_and_pays')}:
        <ul>
          <li>{t('get_10_percent_discount_accumulable')}</li>
        </ul>
      </li>
    </ul>
    <p>{t('you_will_see')}:</p>
    <ul>
      <li>{t('your_personal_code')}</li>
      <li>{t('how_to_add_invitation_code')}</li>
    </ul>
  </section>

  <section id="usageTips">
    <h3>{t('usage_tips')}</h3>
    <ul>
      <li>{t('set_spending_limit_for_third_party_workspaces')}</li>
      <li>{t('review_processed_documents_periodically')}</li>
      <li>{t('use_invitation_code_to_reduce_monthly_cost')}</li>
      <li>{t('change_payment_method_before_card_expires')}</li>
      <li>{t('check_invoice_history_for_accounting')}</li>
      <li>{t('monetize_workspaces_bots_for_passive_income')}</li>
      <li>
        {t('access')}{' '}
        <a href="https://tudominio.com/ayuda/comunidad" target="_blank">
          {t('help_center')} &gt; {t('help_center_community')}
        </a> {t('to_learn_how_to_publish_monetize')}
      </li>
      <li>{t('contact_sales_for_custom_setup')}</li>
    </ul>
  </section>
</div>

    </div>
  )
}
