import React, { useState } from "react";
import TemplateArticleHelp from "../TemplateArticleHelp/TemplateArticleHelp";

import styles from "../YourAccount/YourAccount.module.css";
import { ReactComponent as SettingGreenIcon } from "../../../assets/SettingGreenIcon.svg";
import { ReactComponent as Flag_of_UnitedStates } from "../../../assets/Flag_of_UnitedStates.svg";
import { ReactComponent as Flag_of_Spain } from "../../../assets/Flag_of_Spain.svg";
import { ReactComponent as Flag_of_Portugal } from "../../../assets/Flag_of_Portugal.svg";
import { ReactComponent as Flag_of_Italy } from "../../../assets/Flag_of_Italy.svg";
import { ReactComponent as Flag_of_French } from "../../../assets/Flag_of_French.svg";
import { ReactComponent as Flag_of_German } from "../../../assets/Flag_of_German.svg";
import { ReactComponent as MoonIcon } from "../../../assets/moonIconHelpCenter.svg";
import { ReactComponent as SunIcon } from "../../../assets/sunIconHelpCenter.svg";
import { ReactComponent as BlackIcon } from "../../../assets/BlackCuadrado.svg";
import { ReactComponent as SemiCircleIcon } from "../../../assets/SemiCircle.svg";
import { ReactComponent as BlackCircleIcon } from "../../../assets/BlackCircle.svg";
import { ReactComponent as CLassyIcon } from "../../../assets/CLassyIcon.svg";
import { ReactComponent as CLassyRounded } from "../../../assets/CLassyRounded.svg";
import { ReactComponent as ExtraRounded } from "../../../assets/ExtraRoundedIcon.svg";
import { ReactComponent as IconInvteUser } from "../../../assets/ProfileIconInvite.svg";

import { useTranslation } from "react-i18next";
import { ReactComponent as GreenExclamationIcon } from "../../../assets/GreenExclamationIcon.svg";
const YourAccount = ({setSelectedCategory}) => {
  const { t } = useTranslation("helpPage");
const coins = [
  {
    text: "United States Dollar",
    code: "US$",
    abrev: "USD"
  },
  {
    text: "Euro",
    code: "€",
    abrev: "EUR "
  },
  {
    text: "British Pound",
    code: "£",
    abrev: "GBP"
  },
  {
    text: "Australian Dollar",
    code: "A$",
    abrev: "AUD"
  },
  {
    text: "Canadian Dollar",
    code: "CA$",
    abrev: "CAD"
  },
  {
    text: "Israeli Sheke",
    code: "₪",
    abrev: "ILS "
  },
  {
    text: "Brazilian Real",
    code: "R$",
    abrev: "BRL"
  },
  {
    text: "Hong Kong Dollar",
    code: "HK$",
    abrev: "HKD"
  },
  {
    text: "Swedish Krona",
    code: "SEK",
    abrev: "SEK"
  },
  {
    text: "New Zealand Dollar",
    code: "NZ$",
    abrev: "NZD"
  },
  {
    text: "Singapore Dollar",
    code: "SGD",
    abrev: "SGD"
  },
  {
    text: "Chinese Renminbi Yuan",
    code: "CN¥",
    abrev: "CNY"
  },
  {
    text: "Swiss Franc",
    code: "CHF",
    abrev: "CHF"
  },
  {
    text: "South African Rand",
    code: "ZAR",
    abrev: "ZAR"
  },
  {
    text: "Indian Rupee",
    code: "INR",
    abrev: " ₹"
  },
  {
    text: "Malaysian Ringgit",
    code: "MYR",
    abrev: "MYR"
  },
  {
    text: "Mexican Peso",
    code: "MXN",
    abrev: "MX$"
  },
  {
    text: "Pakistani Rupee",
    code: "PKR",
    abrev: "PKR"
  },
  {
    text: "Philippine Peso",
    code: "₱",
    abrev: "PHP"
  },
  {
    text: "New Taiwan Dollar",
    code: "NT$",
    abrev: "TWD"
  },
  {
    text: "Thai Baht",
    code: "THB",
    abrev: "THB"
  },
  {
    text: "Turkish New Lira",
    code: "TRY",
    abrev: "TRY"
  },
  {
    text: "United Arab Emirates Dirham",
    code: "AED",
    abrev: "AED"
  }
]
const languageFlags = [
  {
    code: "es",
    text:"Español",
    label:"Español",
    flag:<Flag_of_Spain/>
  },
  {
    code: "en",
    text:"English",
    label: "English",
    flag:<Flag_of_UnitedStates/>
  },
  {
    code: "pt",
    text:"Português",
    label: "Português",
    flag:<Flag_of_Portugal/>
  },
  {
    code: "it",
    text:"Italiano",
    label: "Italiano",
    flag:<Flag_of_Italy/>
  },

  {
    code: "fr",
    text:"Français",
    label: "Français",
    flag:<Flag_of_French/>
  },
 
  {
    code: "de",
    text:"Deutsch",
    label: "Deutsch",
    flag:<Flag_of_German/>
  },
];

  return (
    <div>
      <TemplateArticleHelp
           title={t("yourAccount")}
        Icon={SettingGreenIcon}
        setSelectedCategory={setSelectedCategory}
        validate={false}

      />
      <div className={styles.SteepCategory}>
  <section id="controlPanel">
    <h2>{t('yourAccount')}</h2>
    <p>
      {t('your_account_description')}
    </p>

    <h3>{t('dashboard')}</h3>
    <p>{t('dashboard_description')}</p>

    <div className={styles.textGray}>{t('where_to_find_it')}</div>
    <ol className={styles.olstyle}>
      <li>{t('dashboard_navbar')}</li>
      <li>{t('dashboard_avatar_menu')}</li>
      <li>
        {t('shortcut')}: <kbd>Shift + Ctrl + H</kbd> ({t('or')} <kbd>⌘ + Ctrl + H</kbd> {t('on_mac')})
      </li>
    </ol>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('each_workspace_has_own_dashboard')}</p>
      </div>
    </div>
    <div className={styles.gptVideo}></div>
    <div className={styles.textGray}>{t('what_you_can_do_here')}</div>
    <ul>
      <li>{t('view_income_expenses_by_period')}</li>
      <li>{t('analyze_total_balance')}</li>
      <li>{t('control_storage_and_credits')}</li>
      <li>{t('review_monthly_consumption')}</li>
      <li>{t('estimate_pending_taxes')}</li>
      <li>{t('consult_income_expenses_categories')}</li>
      <li>{t('monitor_assets_contacts_documents')}</li>
      <li>{t('filter_by_status_period_category')}</li>
    </ul>

    <div className={styles.textGray}>{t('main_dashboard_sections')}</div>
    <ul>
      <li><strong>{t('storage')}</strong>: {t('storage_description')}</li>
      <li><strong>{t('total_billed')}</strong>: {t('total_billed_description')}</li>
      <li><strong>{t('total_expenses')}</strong>: {t('total_expenses_description')}</li>
      <li><strong>{t('total_balance')}</strong>: {t('total_balance_description')}</li>
      <li><strong>{t('tax_estimation')}</strong>: {t('tax_estimation_description')}</li>
      <li><strong>{t('income_expenses_trend')}</strong>: {t('income_expenses_trend_description')}</li>
      <li><strong>{t('credit_history')}</strong>: {t('credit_history_description')}</li>
      <li><strong>{t('categories')}</strong>: {t('categories_description')}</li>
      <li><strong>{t('documents')}</strong>: {t('documents_description')}</li>
      <li><strong>{t('contacts')}</strong>: {t('contacts_description')}</li>
      <li><strong>{t('assets')}</strong>: {t('assets_description')}</li>
    </ul>

    <div className={styles.textGray}>{t('usage_tips')}</div>
    <ul>
      <li>{t('review_dashboard_weekly')}</li>
      <li>{t('use_filters_for_precision')}</li>
      <li>{t('complement_with_chat_prompts')}</li>
      <li>{t('monitor_storage_and_consumption')}</li>
      <li>{t('delete_old_docs_or_upgrade_plan')}</li>
    </ul>
  </section>

  <section id="news_and_opportunities">
    <h3>{t('news_and_opportunities')}</h3>
    <p>{t('news_and_opportunities_description')}</p>

    <p>
      <strong>
        {t('where_to_find_it')}
      </strong>
      {t('click_news_on_top_nav')}
    </p>

    <div >
      <p>
        {t('configure_preferences')} <br />
        {t('preferences_adapt_based_on')}
      </p>
      </div>
    <ol>
      <li>{t('follow_topic_in_news_panel')}</li>
      <li>{t('manage_preferences_in_settings_general')}</li>
    </ol>
    <div className={styles.gptVideo}></div>
    <h4 className={styles.textGray}>{t('tabs_available')}</h4>
    <ol style={{display:"flex", flexDirection: "column", gap:"20px"}}>
      <li>
        <strong>{t('news')}</strong>: 
        <ul>
          <li>{t('news_description')}</li>
          <li>{t('auto_updated_results')}</li>
          <li>{t('filter_by_source_location_relevance_date')}</li>
          <li>{t('click_ia_button_for_more_context')}</li>
        </ul>
      </li>
      <li>
        <strong>{t('opportunities')}</strong>: 
        <ul>
          <li>{t('opportunities_description')}</li>
        </ul>
      </li>
      <li>
        <strong>{t('images')}</strong>: 
        <ul>
          <li>{t('images_description')}</li>
          <li>{t('search_filter_images')}</li>
          <li>{t('download_images_directly')}</li>
          <li>{t('modify_images_with_ia')}</li>
        </ul>
      </li>
      <li>
        <strong>{t('videos')}</strong>: 
        <ul>
          <li>{t('videos_description')}</li>
          <li>{t('search_filter_videos')}</li>
          <li>{t('use_auto_transcription')}</li>
        </ul>
      </li>
    </ol>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('discard_or_report_results')}</p>
      </div>
    </div>
  </section>

  <section id="access_to_settings">
    <h3>{t('access_to_settings')}</h3>
    <div>{t('where_to_find_it')}</div>

    <ol className={styles.olstyle}>
      <li>{t('click_avatar_top_right')}</li>
      <li>{t('select_settings')}</li>
      <li>{t('access_all_sections')}</li>
    </ol>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>
          {t('shortcut')}: <kbd>⌘ + S</kbd> ({t('mac')}) {t('or')} <kbd>Shift + Ctrl + S</kbd> ({t('windows')})
        </p>
      </div>
    </div>
  </section>

  <section id="general_settings">
    <h3>{t('general_settings')}</h3>
    <p>{t('general_settings_description')} <br />
      {t('where_to_find_it')} {t('settings_general')}
    </p>
    <p>{t('customize_basic_preferences')}</p>

    <h4 className={styles.textGray}>{t('current_subscription')}</h4>
    <p>
      {t('view_or_upgrade_plan')}{' '}
    </p>
     <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>
          {t('view_or_upgrade_plan')}{' '}
          <a href="#" target="_blank">
            {t('help_center')} &gt; {t('help_center_subscription')}
          </a>
        </p>
      </div>
    </div>

    <h4 className={styles.textGray}>{t('color')}</h4>
    <p>{t('customize_interface_color')}</p>
    <p>{t('default_green_brand')}</p>

    <h4 className={styles.textGray}>{t('interface_language')}</h4>
    <p>{t('select_language')}</p>
    <div className={styles.containerFlags}>
      {languageFlags.map((flag) =>(
        <div className={styles.contentFlags}>
          <p>
            {flag.flag}
          </p>
          <p>
            {flag.label}
          </p>
        </div>
      ))}
    </div>
    <p>{t('language_auto_detected')}</p>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('language_per_user_note')}</p>
      </div>
    </div>

    <h3 className={styles.textGray}>{t('currencies_available')}</h3>
    <p>{t("can_define_languaje")}</p>
     <div className={`${styles.coinContainer}`}>
        {coins.map((coin) => (
          <span key={coin.code} className={styles.coinItem}>
            <span>{coin.text}</span> <span>{coin.abrev} - {coin.code}</span>
          </span>
        ))}
      </div>

    <h4 className={styles.textGray}>{t('date_time_format')}</h4>
    <p style={{fontWeight:'500'}}>{t('available_date_formats')}:</p>
    <ul>
      <li>AAAA-MM-DD (ISO 8601)</li>
      <li>DD-MM-AAAA</li>
      <li>MM-DD-AAAA</li>
    </ul>
    <p style={{fontWeight:'500'}}>{t('available_time_formats')}:</p>
    <ul>
      <li>{t('am_pm_12_hours')}</li>
      <li>{t('24_hours')}</li>
    </ul>

    <h4 className={styles.textGray}>{t('dark_light_mode')}</h4>
    <div >
      <p>{t('active_or_desactive')}</p>
      <p className={styles.IconContainer}><SunIcon/><strong>{t('light')}</strong>: {t('light_mode_description')}</p>
      <p className={styles.IconContainer}><MoonIcon/><strong>{t('dark')}</strong>: {t('dark_mode_description')}</p>
    </div>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>
          {t('shorcut_windos_everywhere')}
        </p>
      </div>
    </div>
  </section>

  <section id="qrCodes">
    <h3>{t('qr_codes')}</h3>
    <p>{t('customize_qr_for_brand')}</p>

    <ol className={styles.olstyle}>
      <li>
        <span >{t('go_to_qr_section')} {t('settings_account_qr')}</span>
      </li>
      <li>
        <p >{t('configure_your_qr')}</p>
        <div>
          <span>{t('name')}: {t('descriptive_name_for_design')}</span> <br />
          <span>{t('shape')}: {t('select_shape_for_pixels_corners')}</span> <br />
          <div className={styles.IconContainer} style={{width:"100%"}}>
            <div style={{width:'50%'}}>
              <h4 >Pixeles</h4>
              <div className={styles.InLine}>
                <div className={styles.InLine}>
                  <BlackIcon/>
                  <p>Square</p>
                </div>
                <div className={styles.InLine}>

                  <SemiCircleIcon/>
                  <p>Rounded</p>
                </div>
                <div className={styles.InLine}>
                  
                  <BlackCircleIcon/>
                  <p>Dots</p>
                </div>
              </div>
            </div>
            <div style={{width:'50%'}}>
              <h4 >Esquinas</h4>
              <div className={styles.InLine}>
                <div className={styles.InLine}>
                  <CLassyIcon/>
                  <p>Classy</p>
                </div>
                <div className={styles.InLine}>
                  <CLassyRounded/>
                  <p>Classy Rounded</p>
                </div>
                <div className={styles.InLine}>
                  <ExtraRounded/>
                  <p>Extra Rounded</p>
                </div>
              </div>
            </div>
          </div>
          <span>{t('color')}: {t('use_hex_codes_for_colors')}</span> <br />
          <span>{t('logo')}: {t('add_logo_center')}</span> <br />
        </div>
      </li>
      <li>
        <h4>{t('save_and_reuse_style')}</h4>
        <p>{t('select_saved_style_future_docs')}</p>
      </li>
    </ol>
    <div className={styles.gptVideo}></div>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('qr_correction_level_recommendation')}</p>
      </div>
    </div>
  </section>

  <section id="account_profile">
    <h3>{t('account_profile')}</h3>
    <span>{t('account_profile_description')}</span>
    <div><span className={styles.semibold}>{t('where_to_find_it')}</span> {t('settings_account')}</div>

    <ul>
      <span>{t("Basic_data")}</span>
      <li><span className={styles.semibold}>{t('profile_photo')}</span>: {t('click_to_upload_new')}</li>
      <li><span className={styles.semibold}>{t('full_name')}</span>: {t('enter_name_for_docs')}</li>
      <li><span className={styles.semibold}>{t('phone')}</span>: {t('optional_for_internal_comm')}</li>
      <li><span className={styles.semibold}>{t('payment_methods')}</span>:
        {t('add_save_cards')}
        <ul>
            <li><span className={styles.semibold}>{t('fiscal_address')}:</span> {t('add_one_or_more_addresses')}
              <ul>
                <li>Dirección completa.</li>
                <li>Ciudad y provincia.</li>
                <li>Código postal.</li>
                <li>País.</li>
              </ul>
            </li>
        </ul>
       </li>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>{t('onlyCargos_method_default')}</p>
            </div>
          </div>
        <li>
          <span className={styles.semibold}>{t('fiscal_number')}</span>: {t('enter_nif_cif_vat')}
        </li>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>{t('ifYouOwnerWorkspace')}</p>
            </div>
          </div>
        <li>
          <span className={styles.semibold}>{t('identity_document')}</span>: {t('add_dni_nie_passport')}
        </li>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>{t('ifYouMemberAddDocs')}</p>
            </div>
          </div>
        <li><span className={styles.semibold}>{t('corporate_website')}</span>: {t('add_company_website')}</li>
        <li><span className={styles.semibold}>{t('corporate_logo')}</span>: {t('upload_logos_png_jpg_svg')}</li>
        <li><span className={styles.semibold}>{t('signature')}</span>: {t('upload_signature_image')}</li>
    </ul>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('keep_account_updated_benefits')}</p>
      </div>
    </div>
  </section>

  <section id="device_session_management">
    <h3>{t('device_session_management')}</h3>
    <span>{t('manage_active_sessions')}</span>

    <div>
      <span className={styles.semibold}>

      {t('where_to_find_it')}
      </span>
      {t('settings_devices')}
      </div>

    <ul>
      <span>
        {t('settings_devices_find')}
      </span>
      <li>{t('view_active_devices')}</li>
      <li>{t('close_single_session')}</li>
      <li>{t('close_all_sessions')}</li>
    </ul>
    <div className={styles.gptVideo}></div>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('ifWorfManyDevices')}</p>
      </div>
    </div>
    <h3>{t('security_recommendations')}</h3>
    <ul>
      <li>{t('always_logout_shared_computer')}</li>
      <li>
        {t('enable_2fa_for_security')}{' '}
        <a href="#" target="_blank" style={{color: "#10A37F"}}>
          {t('help_center_security')}
        </a>
      </li>
    </ul>
  </section>

  <section id="speech_and_accessibility">
    <h3>{t('speech_and_accessibility')}</h3>
    <span>{t('voice_input_output_functions')}</span>

    <div>
      <span className={styles.semibold}>
        {t('where_to_find_it')}
      </span>
        {t('settings_speech')}
    </div>

    <h4>{t('available_options')}</h4>
    <ul>
      <li><strong>{t('voice')}</strong>: {t('choose_female_or_male')}</li>
      <li><strong>{t('language')}</strong>: {t('select_manually_or_auto')}</li>
    </ul>

    <span className={styles.textGray}>{t('accessibility_features')}</span>
    <ul>
      <li>{t('read_aloud_chat_responses')}</li>
      <li>{t('voice_commands_via_mic')}</li>
      <li>{t('read_selected_text')}</li>
    </ul>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>
          {t('learn_more_at')}{' '}
          <a href="https://tudominio.com/ayuda/agentes" target="_blank">
            {t('help_center')} &gt; {t('help_center_agents')}
          </a>
        </p>
      </div>
    </div>
  </section>

  <section id="workspaces">
    <h3>{t('workspaces')}</h3>
    <span>{t('workspace_description')}</span>

    <div>
      <span className={styles.semibold}>{t('where_to_find_it')}</span>
      <span>{t('settings_workspaces')}</span>
    </div>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>
          {t('each_workspace_independent')}{' '}
        </p>
      </div>
    </div>
    <h3 className={styles.textGray}>{t('what_you_can_do_here')}</h3>
    <ul>
      <li>{t('view_your_workspaces')}</li>
      <li>{t('switch_active_workspace')}</li>
    </ul>
    <ul>
      <span className={styles.semibold}>{t('CHange_workspace')}</span>
      <li>{t('edit_workspace_if_permitted')}</li>
      <li>{t('create_new_workspace')}</li>
    <span>{t('switch_is_immediate')}</span>
    </ul>

    <ul>
      <span className={styles.semibold}>{t("acceptOrReject")}</span>
      <li>{t("intitation_pending")}</li>
      <li>{t("youCanAcceptOrReject")}</li>
    </ul>
    <ul>
      <span className={styles.semibold}>{t("edit_workspace_if_permiss")}</span> <br />
      <span>{t("users_rol_permisos")}</span>
      <li>{t("EditSettingsSpace")}</li>
      <li>{t("inviteNewMembers")}</li>
    </ul>

    <h3 className={styles.textGray}>{t('create_new_workspace_steps')}</h3>
    <p className={styles.semibold}>Pasos:</p>
    <ol className={styles.olstyle}>
      <li>
        <p className={styles.semibold}>{t('access_settings_workspaces')}</p>
        <ul>
          <li>{t("access_settings_workspaces2")}</li>
          <li>{t("clickNewSpace")}</li>
        </ul>
      </li>
      <li>
        <p className={styles.semibold}>{t('complete_basic_info')}</p>
        <ul>
          <li>{t('workspace_name')}</li>
          <li>{t('upload_image_or_logo')}</li>
        </ul>
      </li>
      <li>
        <p className={styles.semibold}>{t('define_visibility_roles')}</p>
        <ul>
          <li>{t('private_only_invited')}</li>
          <li>
            {t('public_visible_community')}
            <ul>
              <li>{t('select_category')}</li>
              <li>{t('choose_pricing_mode')}</li>
              <li>{t('addPrice')}</li>
            </ul>
          </li>
          <span>{t('set_default_role')}</span>
        </ul>

      </li>
      <li>
        <p className={styles.semibold}>{t('advanced_security')}</p>
        <ul>
          <li>{t('add_modification_password')}</li>
          <li>{t('restrict_external_agents')}</li>
        </ul>
      </li>
      <li>
        <p className={styles.semibold}>{t('invite_members')}</p>
        <ul>
          <li>{t('add_emails_assign_roles')}</li>
        </ul>
      </li>
      <li>
        <p className={styles.semibold}>{t('save_and_activate')}</p>
      </li>
    </ol>
    <div className={styles.gptVideo}></div>
      <ul>
        <p className={styles.textGray}>{t('edite_getout')}</p>
        <p>
          {t('settings_spaces')}{' '}
          ({t('owners_admins_only')})
        </p>
        <ul>
          <li>{t('manage_settings')}</li>
          <li>{t('invite_users')}</li>
          <li>{t('assign_roles')}</li>
        </ul>
      </ul>
    <h4 className={styles.textGray}>{t('owner_only_actions')}</h4>
    <ul>
      <li>{t('change_name_logo')}</li>
      <li>{t('configure_visibility')}</li>
      <li>{t('activate_deactivate_monetization')}</li>
      <li>{t('add_modification_password_owner')}</li>
      <li>{t('transfer_ownership')}</li>
    </ul>

    <p>{t('delete_workspace')}</p>
    <ol className={styles.olstyle}>
      <li>
        <p>{t('go_to_settings_workspace')}</p>
        <span>{t("or_click_buttom_options")}</span>
      </li>
      <li className={styles.semibold}>{t('select_delete')}</li>
      <li className={styles.semibold}>{t('confirm_with_password')}</li>
    </ol>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('deletion_is_irreversible')}</p>
      </div>
    </div>
  </section>

  <section id="invite_team_roles_access">
    <h3>{t('invite_team_roles_access')}</h3>
    <span>{t('manage_team_members')}</span>

    <div>
      <div> <span className={styles.semibold}>{t('where_to_find_it')}</span> {t('settings_team')}</div> 
    </div>

    <h4 className={styles.textGray}>{t('invitations')}</h4>
    <p><strong>{t('who_can_invite')}</strong></p>
    <ul>
      <li>{t('owner_and_admin_can_invite')}</li>
      <li>{t('editor_can_invite_if_permitted')}</li>
    </ul>

    <p><strong>{t('requirements_before_invite')}</strong></p>
    <ul>
      <p>{t('each_user')}</p>
      <li>{t('name_email_required')}</li>
      <li>{t('assign_role_access')}</li>
      <li>{t('optional_digital_signature')}</li>
    </ul>

    <h4>{t('steps_to_invite')}</h4>
    <ol className={styles.olstyle}>
      <li>{t('go_to_settings_team')}</li>
      <li>
        <div className={styles.InLine}>
          {t('click_invite')}
            <button className={styles.InLine} style={{padding:'10px', borderRadius:'10px', background:"#10A37F", border:"transparent", color:"white"}}>{t('invite')}
              <IconInvteUser/>
            </button>
        
        </div>
      </li>
      <li>{t('enter_emails_comma_separated')}</li>
      <li>{t('select_role')}</li>
      <li>{t('add_message_optional')}</li>
      <li>{t('click_send')}</li>
    </ol>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('remeberIfyouuGestioneFirstChangeWOrkspace')}</p>
      </div>
    </div>
    <div className={styles.gptVideo}></div>

    <h4 className={styles.textGray}>{t('team_management')}</h4>
    <ul>
      <span>{t('settings_do')}</span>
      <li>{t('view_all_members')}</li>
      <li>{t('assign_modify_roles')}</li>
      <li>{t('edit_specific_permissions')}</li>
      <li>{t('control_folder_access')}</li>
    </ul> 
      <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('remeberIfyouuGestioneFirstChangeWOrkspace')}</p>
      </div>
    </div>
    <h4 className={styles.textGray}>{t('access_levels')}</h4>
    <div className={styles.tableWrapper}>
      <table className={styles.customTable}>
        <thead>
          <tr>
            <th style={{ width: '30%' }}>{t('access')}</th>
            <th style={{ width: '70%' }}>{t('description')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.semibold}>{t('owner')}</td>
            <td>{t('owner_description')}</td>
          </tr>
          <tr>
            <td className={styles.semibold}>{t('admin')}</td>
            <td>{t('admin_description')}</td>
          </tr>
          <tr>
            <td className={styles.semibold}>{t('editor')}</td>
            <td>{t('editor_description')}</td>
          </tr>
          <tr>
            <td className={styles.semibold}>{t('collaborator')}</td>
            <td>{t('collaborator_description')}</td>
          </tr>
        </tbody>
      </table>
    </div>     

    <h4 className={styles.textGray}>{t('customizable_roles')}</h4>
    <p>{t('create_custom_roles')}</p>

    <h4 className={styles.textGray}>{t('permission_settings')}</h4>
    <p>{t('access_permissions_per_user')}</p>
    <ul>
      <li>
        <ul>
          <span>Accesos generales (nivel Admin)</span>
          <li>Aprobar o anular documentos.</li>
          <li>Modificar estados de documentos.</li>
          <li>Eliminar automatizaciones.</li>
        </ul>
      </li>
      <li>
        <ul>
          <span>Gestión de datos sincronizados (nivel Editor)</span>
            <li>Invitar nuevos usuarios.</li>
            <li>Crear y modificar registros (ej. contactos, activos, documentos).</li>
            <li>Eliminar tablas sincronizadas.</li>
        </ul>
      </li>
      <li>
        <ul>
          <span>Restricciones</span>
            <li>Bloquear configuraciones globales → impide modificar parámetros críticos como contactos, activos o variables generales.</li>
            <li>Acceso limitado por carpeta (ubicación) → restringe el acceso del usuario a una ruta o carpeta específica.</li>
            
        </ul>
      </li>
    </ul>

    <h4 className={styles.textGray}>{t('best_practices')}</h4>
    <ul>
      <li>{t('assign_clear_roles')}</li>
      <li>{t('use_custom_roles_for_specific_cases')}</li>
      <li>{t('review_accesses_periodically')}</li>
      <li>{t('combine_roles_restrictions')}</li>
    </ul>
  </section>
     
  <section id="connected_apps_llms">
    <h3>{t('connected_apps_llms')}</h3>
    <span>{t('connect_manage_models_apps')}</span>

    <div className={styles.semibold}>
      <span>{t('where_to_find_it')}</span>
      <span>{t('settings_connected_apps')}</span>
    </div>
    <h3 className={styles.textGray}>{t("what_you_do_from_here")}</h3>
    <ul>
      <li>{t('connect_llms_via_api_key')}</li>
      <li>{t('view_connected_apps_status')}</li>
    </ul>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>
          {t('each_workspace_has_own_connections')}
          
        </p>
      </div>
    </div>
    <h3 className={styles.textGray}>{t("apps_connected_across_fluje")}</h3>
    <p>{t('integrations_in_automations')}</p>
    
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>
          {t('learn_more_at')}{' '}
          <a href="#" target="_blank">
            {t('help_center')} &gt; {t('help_center_automations')}
          </a>
        </p>
      </div>
    </div>
  </section>

  <section id="llmTokens">
    <h3 className={styles.textGray}>{t('llm_tokens')}</h3>
    <p>{t('activate_valid_token')}</p>

    <h5>{t('what_is_a_token')}</h5>
    <ul>
      <span className={styles.semibold}>{t('token_security_key')}</span>
      <li>{t('associated_external_account')}</li>
      <li>{t('check_token_costs')}</li>
    </ul>

    <h5>{t('invalid_token')}</h5>
    <ul>
      <li>{t('chat_alert')}</li>
      <li>{t('automations_paused')}</li>
      <li>{t('reasons_invalid_token')}</li>
    </ul>

    <h5>{t('multiple_tokens')}</h5>
    <ul>
      <span>{t('register_multiple_tokens')}</span>
      <li>{t('agentsToken')}</li>
      <li>{t('generalToken')}</li>
      <li>{t('automatizeToken')}</li>
    </ul>

    <h5>{t('no_token')}</h5>
    <ul>
      <span>{t('facturagpt_no_default_token')}</span>
      <li>{t('functions_requiring_token')}</li>
      <li>{t('clasificationsInteligent')}</li>
      <li>{t('queryNaturalLanguaje')}</li>
      <li>{t('convensionalAgents')}</li>
    </ul>

    <h5 className={styles.textGray}>{t('how_to_add_manage_tokens')}</h5>
    <ol>
      <li>
        <p className={styles.semibold}>{t('via_connected_apps')}</p>
        <ul>
          <li>{t('go_to_settings_connected_apps')}</li>
          <li>{t("add_change_delete_tokens")}</li>
        </ul>
      </li>
      <li>
         <p className={styles.semibold}>{t('via_chat')}</p>
        <ul>
        
          <li>{t('paste_token_in_chat')}</li>
          <li>{t("facturagtp_detected")}</li>
        </ul>
      </li>
    </ol>

    <h4>{t('where_get_token')}</h4>
    <ul>
      <li>
        OpenAI:
      </li>
      <li>
        {t('openai_api_key_link')}
        <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener">
      </a>

      </li>
      <li>
        {t('openai_org_id_link')}
        <a href="https://platform.openai.com/account/org-settings" target="_blank" rel="noopener">
      </a>
      </li>
      <li>
        Claude (Anthropic): {t('coming_soon_beta')}
      </li>
      <li>
        Gemini (Google): {t('private_testing_soon')}
      </li>
      <li>{t('other_models_coming')}</li>
    </ul>
    <div className={styles.gptVideo}></div>

    <h4 className={styles.textGray}>{t('revoke_token')}</h4>
    <p>{t("if_you_want_to_delete_token_dont_uses")}</p>
    <ol className={styles.olstyle}>
      <li>{t('go_to_settings_connected_apps')}</li>
      <li>{t('find_app_model')}</li>
      <li>{t('click_disconnect')}</li>
    </ol>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('after_disconnect_functions_stop')}</p>

      </div>
    </div>
    <h4 className={styles.textGray}>{t('best_practices')}</h4>
    <ul>
      <li>{t('token_best_practices')}</li>
      <li>{t('combine_distincts_apps_and_models')}</li>
    </ul>
  </section>

  <section id="data_control">
    <h3>{t('data_control')}</h3>
    <p>{t('centralized_data_management')}</p>

    <div >
      <span className={styles.semibold}>{t('where_to_find_it')}</span>
        <span>{t('settings_data_control')}</span>

    </div>

    <h4 className={styles.textGray}>{t('data_export')}</h4>
    <ul>
      <p>{t("you_can_dowload_formats")}</p>
      <li>{t('export_personal_data')}</li>
      <li>{t('export_contacts')}</li>
      <li>{t('export_assets')}</li>
    </ul>
    <div className={styles.gptVideo}></div>

    <h4 className={styles.textGray}>{t('data_deletion')}</h4>
      <p>{t('you_can_delete_concrects_data')}</p>
    <ul>
    <p>{t('personal_actions')} ({t('affect_your_account')})</p>
      <li>{t('delete_all_notifications')}</li>
      <li>{t('delete_account_permanently')}</li>
    </ul>

    <p>{t('global_actions')} ({t('affect_workspace_only_owners')})</p>
    <ul>
      <li>{t('delete_all_contacts')}</li>
      <li>{t('delete_all_assets')}</li>
      <li>{t('delete_all_workspace_data')}</li>
    </ul>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('actions_cannot_be_undone')}</p>
      </div>
    </div>
  </section>
</div>
      </div>
  );
};

export default YourAccount;
