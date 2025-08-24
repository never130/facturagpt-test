import React, { useState } from "react";
import TemplateArticleHelp from "../TemplateArticleHelp/TemplateArticleHelp";
// import styles from "./AssetManagement.module.css";
import { ReactComponent as ArrowDownBold } from "../../../assets/arrowDownBold.svg";
import { ReactComponent as BlackWarningIcon } from "../../../assets/BlackWarningIcon.svg";
import { ReactComponent as ConectionsGrayIcon } from "../../../assets/ConectionsGrayIcon.svg";
import { ReactComponent as HouseIcon } from "../../../assets/HouseIcon.svg";
import { ReactComponent as RocketIcon } from "../../../assets/rocketIcon.svg";
import { ReactComponent as ArrowRightText } from "../../../assets/arrowRightText.svg";
import { ReactComponent as FilterIconBars } from "../../../assets/S3/filterIconBars.svg";
import { ReactComponent as AssetsGreenIcon } from "../../../assets/AssetsGreenIcon.svg";
import styles from "../FirstSteeps/FirstSteeps.module.css";
import { ReactComponent as GreenExclamationIcon } from "../../../assets/GreenExclamationIcon.svg";

import { ReactComponent as ContactsGreenIcon } from "../../../assets/ContactsGreenIcon.svg";
import { ReactComponent as DownloadButtonIcon } from "../../../assets/DownloadButtonIcon.svg";
import { useTranslation } from "react-i18next";
const AssetManagement = ({setSelectedCategory}) => {
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
        title={t('documents')}
        Icon={AssetsGreenIcon}
        setSelectedCategory={setSelectedCategory}
        validate={false}

      />
        <div className={styles.SteepCategory}>
        <section id="documents">
          <h2>{t('documents')}</h2>
          <p>{t('documents_description')}</p>
          <p>{t('facturagpt_turns_files_into_knowledge')}</p>
        </section>

        <section id="whatIsDocumentsSection">
          <h3>{t('what_is_documents_section')}</h3>
          <p>{t('your_central_repository')}</p>
          <ul>
            <li>{t('save_files_different_formats')}</li>
            <li>{t('extract_key_info_automatically')}</li>
            <li>{t('relate_docs_to_tables_agents_automations')}</li>
            <li>{t('maintain_history_states_traceability')}</li>
          </ul>
          <p>{t('everything_you_upload_linked_to_workspace')}</p>
        </section>

        <section id="waysToWorkWithDocuments">
          <h3>{t('ways_to_work_with_documents')}</h3>
          <ul>
            <li>{t('manual_upload_drag_drop_or_new')}</li>
            <li>{t('capture_with_camera')}</li>
            <li>{t('from_chat_write_upload')}</li>
            <li>{t('via_automation_collect_from_email_drive')}</li>
            <li>{t('generate_new_document_from_previous')}</li>
          </ul>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>
                {t('for_advanced_cases_contact_sales')}{' '}
                <a href="mailto:sales@facturagpt.com">{t('contact_sales_team')}</a>
              </p>
            </div>
          </div>
        </section>

        <section id="documentActions">
          <h3>{t('document_actions')}</h3>
          <ul>
            <li>{t('share_document_with_users_workspaces')}</li>
            <li>{t('duplicate_document_to_reuse')}</li>
            <li>{t('send_email_via_different_methods')}</li>
            <li>{t('download_original_format')}</li>
            <li>{t('add_internal_notes_for_follow_up')}</li>
            <li>{t('move_to_another_folder_third_party')}</li>
            <li>{t('print_without_downloading')}</li>
            <li>{t('find_automations_to_add_or_active')}</li>
            <li>{t('interact_via_chat_or_with_agents')}</li>
            <li>{t('generate_modify_new_from_existing')}</li>
          </ul>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>
                {t('tip_enable_auto_upload_from_email_drive')}{' '}
                <a href="https://tudominio.com/ayuda/automatizaciones" target="_blank">
                  {t('help_center')} &gt; {t('help_center_automations')}
                </a>
              </p>
            </div>
          </div>
        </section>

        <section id="supportedFileTypes">
          <h3>{t('supported_file_types')}</h3>
          <p>{t('facturagpt_supports')}</p>
          <ul>
            <li><strong>{t('documents')}</strong>: PDF, DOCX, ODT</li>
            <li><strong>{t('spreadsheets')}</strong>: XLSX, CSV</li>
            <li><strong>{t('images')}</strong>: JPG, PNG, TIFF, SVG</li>
            <li><strong>{t('compressed_files')}</strong>: ZIP (with automatic PDF extraction)</li>
          </ul>
          <p>{t('recommended_use_pdf_for_optimal_recognition')}</p>
        </section>

        <section id="folderStructureNavigation">
          <h3>{t('folder_structure_navigation')}</h3>
          <p>{t('navigation_breadcrumbs')}</p>
          <p>{t('assign_colors_labels_for_quick_identification')}</p>
          <p>{t('combine_folders_with_filters')}</p>
          <div className={styles.card}>
            <GreenExclamationIcon />
            <div className={styles.cardContent}>
              <p>{t('tip_use_clear_folder_structure')}</p>
            </div>
          </div>
        </section>

        <section id="advancedFilters">
          <h3>{t('advanced_filters')}</h3>
          <p>{t('you_can_filter_by')}</p>
          <ul>
            <li>{t('upload_or_issue_date')}</li>
            <li>{t('user_who_uploaded')}</li>
            <li>{t('document_type')}</li>
            <li>{t('document_status')}</li>
            <li>{t('extracted_variables')}</li>
          </ul>
        </section>

        <section id="documentOverview">
          <h3>{t('document_overview')}</h3>
          <p>{t('each_document_has_enriched_preview')}</p>
          <ul>
            <li>{t('file_content')}</li>
            <li>{t('recognized_variables')}</li>
            <li>{t('action_history')}</li>
            <li>{t('relations_with_tables_automations')}</li>
          </ul>
        </section>

        <section id="dataExtraction">
          <h3>{t('data_extraction')}</h3>
          <p>{t('data_extraction_triggers')}</p>
          <ol className={styles.olstyle}>
            <li>
              <strong>{t('when_uploading_from_documents_section')}</strong>: {t('system_auto_recognizes_type_and_applies_model')}
            </li>
            <li>
              <strong>{t('sending_file_from_chat_scraping')}</strong>: {t('agent_processes_with_ia_and_extracts_values')}
            </li>
            <li>
              <strong>{t('from_active_automation')}</strong>: {t('configure_flows_to_receive_and_extract_without_manual_input')}
            </li>
          </ol>
          <p>
            {t('see_article_in')}{' '}
            <a href="https://tudominio.com/ayuda/tablas" target="_blank">
              {t('help_center')} &gt; {t('help_center_tables')}
            </a> {t('to_see_variable_types')}
          </p>
          <p>{t('custom_variables_configured_on_demand')}</p>
        </section>

        <section id="documentStatesAndApproval">
          <h3>{t('document_states_and_approval')}</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('state')}</th>
                <th>{t('description')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{t('invalid')}</td>
                <td>{t('invalid_description')}</td>
              </tr>
              <tr>
                <td>{t('error')}</td>
                <td>{t('error_description')}</td>
              </tr>
              <tr>
                <td>{t('empty')}</td>
                <td>{t('empty_description')}</td>
              </tr>
              <tr>
                <td>{t('draft')}</td>
                <td>{t('draft_description')}</td>
              </tr>
              <tr>
                <td>{t('in_progress')}</td>
                <td>{t('in_progress_description')}</td>
              </tr>
              <tr>
                <td>{t('registered')}</td>
                <td>{t('registered_description')}</td>
              </tr>
              <tr>
                <td>{t('sent')}</td>
                <td>{t('sent_description')}</td>
              </tr>
              <tr>
                <td>{t('paid')}</td>
                <td>{t('paid_description')}</td>
              </tr>
              <tr>
                <td>{t('approved')}</td>
                <td>{t('approved_description')}</td>
              </tr>
              <tr>
                <td>{t('not_approved')}</td>
                <td>{t('not_approved_description')}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="usageRecommendations">
          <h3>{t('usage_recommendations')}</h3>
          <ul>
            <li>{t('upload_legible_or_digitized_text')}</li>
            <li>{t('use_specific_categories')}</li>
            <li>{t('create_automations_for_repetitive_docs')}</li>
            <li>{t('leverage_extracted_variables')}</li>
          </ul>
          <p>{t('this_enables_internal_control_and_traceability')}</p>
        </section>

        <section id="addAnnotation">
          <h3>{t('add_annotation')}</h3>
          <ol className={styles.olstyle}>
            <li>{t('click_add_note')}</li>
            <li>
              <p>{t('write_note_text_and_customize')}</p>
              <ul>
                <li><strong>{t('color')}</strong>: {t('choose_color_for_visual_diff')}</li>
                <li><strong>{t('format')}</strong>: {t('apply_bold_italic_underline')}</li>
                <li><strong>{t('alignment')}</strong>: {t('adjust_text_position')}</li>
                <li><strong>{t('links')}</strong>: {t('add_visible_links')}</li>
              </ul>
            </li>
            <li>{t('click_save_or_cancel')}</li>
          </ol>
          <p>{t('notes_available_in_tables_records')}</p>
        </section>

        <section id="sendDocumentByEmail">
          <h3>{t('send_document_by_email')}</h3>
          <ol className={styles.olstyle}>
            <li>{t('open_document_you_want')}</li>
            <li>{t('click_send_email_in_actions_tab')}</li>
            <li>{t('select_change_email_connection')}</li>
            <li>{t('fill_to_field')}</li>
            <li>{t('add_subject')}</li>
            <li>
              <p>{t('write_email_message')}</p>
              <ul>
                <li>{t('use_generate_with_ia')}</li>
                <li>{t('use_dynamic_tags_like_name')}</li>
                <li>{t('format_with_bold_lists_emojis_links')}</li>
              </ul>
            </li>
            <li>
              <p>{t('save_message_as_template')}</p>
              <p>{t('note_subject_used_as_template_name')}</p>
            </li>
            <li>{t('attach_more_files')}</li>
            <li>{t('click_send_to_finish')}</li>
          </ol>
        </section>

        <section id="createBillableDocuments">
          <h3>{t('create_billable_documents')}</h3>
          <p>{t('facturagpt_allows_generate_invoices')}</p>

          <ol className={styles.olstyle}>
            <li>
              <h4>{t('click_plus_sidebar')}</h4>
              <p>{t('select_new_billable_or_from_agent')}</p>
            </li>
            <li>
              <h4>{t('choose_document_type')}</h4>
              <p>{t('invoice_quote_sales_order_purchase_order_delivery_note')}</p>
            </li>
            <li>
              <h4>{t('fill_general_info')}</h4>
              <ul>
                <li>{t('document_title')}</li>
                <li>{t('category_concept_for_classification')}</li>
                <li>{t('folder_location')}</li>
                <li>{t('issue_due_dates')}</li>
                <li>{t('invoice_number_auto_or_manual')}</li>
                <li>{t('customer_supplier_contact')}</li>
                <li>{t('add_logo_signature')}</li>
              </ul>
            </li>
            <li>
              <h4>{t('add_payment_conditions_methods')}</h4>
              <ul>
                <li>{t('custom_payment_terms_footer')}</li>
                <li>{t('select_payment_methods')}</li>
              </ul>
            </li>
            <li>
              <h4>{t('add_concepts_lines')}</h4>
              <p>{t('add_product_service_lines')}</p>
              <ul>
                <li>{t('quantities_unit_prices_taxes_discounts')}</li>
              </ul>
            </li>
            <li>
              <h4>{t('configure_advanced_options')}</h4>
              <ul>
                <li>{t('equivalence_surcharge')}</li>
                <li>{t('reimbursable_expenses')}</li>
                <li>{t('retentions_irpf')}</li>
                <li>{t('custom_fields_sector_specific')}</li>
              </ul>
              <p>{t('options_adapt_to_complex_operations')}</p>
            </li>
            <li>
              <h4>{t('review_document_summary')}</h4>
              <ul>
                <li>{t('verify_calculations')}</li>
                <li>{t('check_dates')}</li>
                <li>{t('confirm_contact_payment_method')}</li>
                <li>{t('ensure_all_data_complete')}</li>
              </ul>
              <p>{t('this_step_reduces_issues_claims')}</p>
            </li>
            <li>
              <h4>{t('save_define_next_step')}</h4>
              <ul>
                <li>{t('save_as_draft')}</li>
                <li>{t('preview_before_download')}</li>
                <li>{t('save_and_send')}</li>
              </ul>
            </li>
          </ol>
        </section>

        <section id="documentSecurityTraceability">
          <h3>{t('document_security_traceability')}</h3>
          <p>{t('you_can_locate_each_document_via')}</p>
          <ul>
            <li>{t('folder_logic_like_directory_tree')}</li>
            <li>{t('add_internal_notes_labels')}</li>
            <li>{t('access_logs_action_history')}</li>
            <li>{t('version_history')}</li>
            <li>{t('edit_lock_for_approved')}</li>
            <li>{t('encryption_digital_signature')}</li>
            <li>{t('download_audit_logs')}</li>
          </ul>
        </section>

        <section id="activity">
          <h3>{t('activity')}</h3>
          <p>{t('shows_complete_interaction_history')}</p>
          <ul>
            <li>{t('state_changes')}</li>
            <li>{t('edits_by_user_or_automations')}</li>
            <li>{t('automations_triggered')}</li>
            <li>{t('users_who_modified_approved')}</li>
            <li>{t('exact_times_dates')}</li>
          </ul>
        </section>

        <section id="documentManagementOptions">
          <h3>{t('document_management_options')}</h3>
          <p>{t('when_clicking_three_dots')}</p>
          <ul>
            <li><strong>{t('edit')}</strong>: {t('modify_metadata_update_tags_states')}</li>
            <li><strong>{t('add_annotation')}</strong>: {t('use_labels_internal_notes')}</li>
            <li><strong>{t('download')}</strong>: {t('get_in_original_or_other_formats')}</li>
            <li><strong>{t('share')}</strong>: {t('send_email_or_copy_secure_link')}</li>
            <li><strong>{t('delete')}</strong>: {t('permanently_remove_from_workspace')}</li>
          </ul>
          <p>{t('these_actions_maintain_document_integrity')}</p>
        </section>

        <section id="advancedSearch">
          <h3>{t('advanced_search')}</h3>
          <p>{t('once_documents_uploaded_organized')}</p>
          <ol className={styles.olstyle}>
            <li>{t('click_funnel_icon_advanced_filters')}</li>
            <li>{t('adjust_criteria')}</li>
            <li>{t('click_search_to_show_results')}</li>
            <li>{t('click_cancel_to_clear_filters')}</li>
          </ol>
          <p>{t('complies_with_audit_requirements')}</p>
        </section>
      </div>
    </div>
  );
};

export default AssetManagement;
