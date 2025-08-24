import React, { useState } from "react";
import TemplateArticleHelp from "../TemplateArticleHelp/TemplateArticleHelp";
// import styles from "./ControlPanel.module.css";
import { ReactComponent as ArrowDownBold } from "../../../assets/arrowDownBold.svg";
import { ReactComponent as DotsNotification } from "../../../assets/DotsNotificationGray.svg";
import { ReactComponent as ConectionsGrayIcon } from "../../../assets/ConectionsGrayIcon.svg";
import { ReactComponent as ControlPanelGreenIcon } from "../../../assets/ControlPanelGreenIcon.svg";
import { useTranslation } from "react-i18next";
import { ReactComponent as GreenExclamationIcon } from "../../../assets/GreenExclamationIcon.svg";
import styles from "../FirstSteeps/FirstSteeps.module.css";

const ControlPanel = ({setSelectedCategory}) => {
  const { t } = useTranslation("helpPage");

  return (
    <div>
      <TemplateArticleHelp
        title={t('community')}
        Icon={ControlPanelGreenIcon}
        setSelectedCategory={setSelectedCategory}
        validate={false}

      />
        <div className={styles.SteepCategory}>
  <section id="community">
      <h2>{t('community')}</h2>
    <p>{t('community_description')}</p>
    <p>{t('ideal_place_to_learn_discover_expand')}</p>
  </section>

  <section id="whatIsCommunity">
    <h3>{t('what_is_community')}</h3>
    <p>{t('community_functions_as_internal_marketplace')}</p>
    <ul>
      <li>{t('explore_agents_created_by_others_or_publish_yours')}</li>
      <li>{t('discover_public_or_paid_automations_ready_to_use')}</li>
      <li>{t('access_shared_lists_variables_templates')}</li>
    </ul>
  </section>

  <section id="exploreResources">
    <h3>{t('explore_all_resources')}</h3>
    <ul>
      <li>{t('search_by_category_or_sector')}</li>
      <li>{t('filter_by_popularity_downloads_ratings')}</li>
      <li>{t('review_usage_metrics_and_comments_before_installing')}</li>
    </ul>
    <p>{t('example_enter_workspace_with_ready_automations')}</p>
  </section>

  <section id="usageMetricsAndRatings">
    <h3>{t('usage_metrics_and_ratings')}</h3>
    <p>{t('each_published_resource_shows_key_info')}</p>
    <ul>
      <li><strong>{t('number_of_uses_or_accesses')}</strong>: {t('how_many_users_installed_or_ran_it')}</li>
      <li><strong>{t('average_rating_stars')}</strong>: {t('aggregated_score_based_on_feedback')}</li>
    </ul>

    <h4>{t('where_to_rate_resources')}</h4>
    <ul>
      <li>{t('rate_directly_from_community')}</li>
      <li><strong>{t('automations')}</strong>: {t('from_settings_workspace_rate_option')}</li>
      <li><strong>{t('agents')}</strong>: {t('from_interactive_chat_after_session')}</li>
      <li><strong>{t('table_templates')}</strong>: {t('via_options_button_three_dots_rate')}</li>
    </ul>
  </section>

  <section id="publishResourceStepByStep">
    <h3>{t('publish_any_resource_step_by_step')}</h3>
    <ol className={styles.olstyle}>
      <li>{t('access_community_from_your_workspace')}</li>
      <li>
        {t('add_resource_title_description_tags')}
      </li>
      <li>
        {t('activate_public_visibility_in_community')}
        <ul>
          <li>{t('choose_free_or_paid')}</li>
          <li>{t('add_access_key_optional')}</li>
        </ul>
      </li>
      <li>{t('click_save_and_publish')}</li>
    </ol>
    <div className={styles.card}>
      <GreenExclamationIcon />
      <div className={styles.cardContent}>
        <p>{t('remember_when_publishing_you_share_only_configuration')}</p>
      </div>
    </div>
  </section>

  <section id="publishAndMonetizeResources">
    <h3>{t('publish_and_monetize_resources')}</h3>
    <p>{t('facturagpt_allows_you_to_monetize')}</p>
    <ul>
      <li>{t('one_time_price_or_subscription')}</li>
      <li>{t('receive_payments_directly_to_your_account')}</li>
      <li>{t('view_statistics_usage_downloads_sales')}</li>
    </ul>
  </section>

  <section id="communityRecommendations">
    <h3>{t('community_recommendations')}</h3>
    <ul>
      <li>{t('provide_real_value')}</li>
      <li>{t('describe_your_resource_well')}</li>
      <li>{t('keep_it_updated')}</li>
      <li>{t('be_transparent_about_limitations')}</li>
    </ul>
  </section>
</div>
    </div>
  );
};

export default ControlPanel;
