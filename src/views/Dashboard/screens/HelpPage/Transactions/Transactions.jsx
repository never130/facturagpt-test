import React, { useState } from "react";
import TemplateArticleHelp from "../TemplateArticleHelp/TemplateArticleHelp";
// import styles from "./Transactions.module.css";
import { ReactComponent as ArrowDownBold } from "../../../assets/arrowDownBold.svg";
import { ReactComponent as ConectionsGrayIcon } from "../../../assets/ConectionsGrayIcon.svg";
import { ReactComponent as PenIconOutline } from "../../../assets/PenIconOutlineGray.svg";
import { ReactComponent as TransactionsGreenIcon } from "../../../assets/TransactionsGreenIcon.svg";
import { useTranslation } from "react-i18next";
import { ReactComponent as GreenExclamationIcon } from "../../../assets/GreenExclamationIcon.svg";
import styles from "../FirstSteeps/FirstSteeps.module.css";
const Transactions = ({setSelectedCategory}) => {
  const { t } = useTranslation("helpPage");

 

  return (
    <div>
      <TemplateArticleHelp
      title={t("system_activity")}
        Icon={TransactionsGreenIcon}
        setSelectedCategory={setSelectedCategory}
        validate={false}

      />
       <div className={styles.SteepCategory}>
  <section id="activity">
      <h2>{t('system_activity')}</h2>
    
    <p>{t('system_activity_description')}</p>
    <p>{t('everything_stored_with_date_user_action')}</p>
  </section>

  <section id="mainFunctions">
    <h3>{t('main_functions')}</h3>
    <p>{t('from_activity_section_you_can')}</p>
    <ul>
      <li>{t('view_real_time_actions_notifications')}</li>
      <li>{t('visualize_automated_tasks_daily_weekly_monthly')}</li>
      <li>{t('receive_alerts_for_processes_relevant_info')}</li>
      <li>{t('access_complete_log_list')}</li>
    </ul>
    <p>{t('each_workspace_has_own_activity')}</p>
  </section>

  <section id="activityAgenda">
    <h3>{t('activity_agenda')}</h3>
    <p>{t('each_event_shows')}</p>
    <ul>
      <li>{t('exact_date_time')}</li>
      <li>{t('responsible_user')}</li>
      <li>{t('action_performed')}</li>
      <li>{t('direct_link_to_affected_resource')}</li>
      <li>{t('status_success_error_pending')}</li>
    </ul>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('tip_use_searcher_to_filter_by_user_or_resource')}</p>
      </div>
    </div>
    <p>
      {t('notification_settings_in')}{' '}
      <a href="#" target="_blank">
        {t('settings')} &gt; {t('account')}
      </a>
    </p>
  </section>

  <section id="whatIsRecorded">
    <h3>{t('what_is_recorded_in_activity')}</h3>
    <p>{t('activity_shows_chronological_timeline')}</p>
    <ul>
      <li>{t('document_creation_upload_edit_delete')}</li>
      <li>{t('automations_successful')}</li>
      <li>{t('dates_names_locations_folders_tags')}</li>
      <li>{t('agent_actions_programmed_responses')}</li>
    </ul>

    <div className={styles.textGray}>{t('why_is_it_important')}</div>
    <ul>
      <li>{t('audit_actions_clearly')}</li>
      <li>{t('identify_incidents_or_blocks')}</li>
      <li>{t('prepare_fiscal_audits_comply_policies')}</li>
    </ul>

    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('tip_use_searcher_to_filter_by_user_role_notification')}</p>
      </div>
    </div>
    <p>
      {t('notification_settings_in')}{' '}
      <a href="#" target="_blank">
        {t('settings')} &gt; {t('account')}
      </a>
    </p>
  </section>

  <section id="activityTimeline">
    <h3>{t('activity_timeline')}</h3>
    <p>{t('allows_chronological_view_all_actions')}</p>
    <p>{t('each_notification_includes')}</p>
    <ul>
      <li>{t('action_type')}</li>
      <li>{t('responsible_user')}</li>
      <li>{t('date_time')}</li>
      <li>{t('affected_object')}</li>
    </ul>

    <p>{t('in_each_record_you_can')}</p>
    <ul>
      <li>{t('view_complete_details')}</li>
      <li>{t('open_linked_documents')}</li>
      <li>{t('share_secure_links')}</li>
    </ul>
  </section>

  <section id="activityCalendar">
    <h3>{t('activity_calendar')}</h3>
    <p>{t('three_visualization_modes_available')}</p>
    <ul>
      <li><strong>{t('day_view')}</strong>: {t('detailed_operational_planning')}</li>
      <li><strong>{t('week_view')}</strong>: {t('workload_control')}</li>
      <li><strong>{t('month_view')}</strong>: {t('accounting_closure_reviews_planning')}</li>
    </ul>
  </section>

  <section id="notificationTypes">
    <h3>{t('notification_types')}</h3>
    <p>{t('facturagpt_sends_real_time_notifications_about')}</p>

    <h4>{t('workspaces')}</h4>
    <ul>
      <li>{t('invitations_to_new_workspaces')}</li>
      <li>{t('plan_limit_reached')}</li>
      <li>{t('uses_or_sales_in_community')}</li>
    </ul>

    <h4>{t('automations')}</h4>
    <ul>
      <li>{t('successful_execution')}</li>
      <li>{t('execution_errors')}</li>
    </ul>

    <h4>{t('agents')}</h4>
    <ul>
      <li>{t('agent_messages')}</li>
      <li>{t('automation_execution')}</li>
      <li>{t('community_publications')}</li>
      <li>{t('plan_merge_limit_reached')}</li>
    </ul>

    <h4>{t('documents')}</h4>
    <ul>
      <li>{t('upload_new_documents')}</li>
      <li>{t('status_changes_annotations')}</li>
      <li>{t('approvals')}</li>
      <li>{t('deletions')}</li>
    </ul>

    <h4>{t('tables')}</h4>
    <ul>
      <li>{t('new_tables_created')}</li>
      <li>{t('updates')}</li>
      <li>{t('deletions')}</li>
    </ul>
  </section>

  <section id="howToReceiveNotifications">
    <h3>{t('how_to_receive_notifications')}</h3>
    <p>{t('you_can_configure_reception_via')}</p>
    <ul>
      <li>{t('internal_plus_email_real_time')}</li>
      <li>{t('internal_only_default')}</li>
    </ul>
  </section>

  <section id="usageRecommendations">
    <h3>{t('usage_recommendations')}</h3>
    <ul>
      <li>{t('use_agenda_to_monitor_specific_tasks_recent_flows')}</li>
      <li>{t('use_calendar_for_weekly_reviews_workload_distribution')}</li>
      <li>{t('use_kanban_coming_soon_for_visual_project_tracking')}</li>
      <li>{t('sync_with_google_outlook_for_full_visibility')}</li>
      <li>{t('consider_activity_as_official_audit_record')}</li>
    </ul>
  </section>
</div>
    </div>
  );
};

export default Transactions;
