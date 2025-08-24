import React, { useState } from "react";
import TemplateArticleHelp from "../TemplateArticleHelp/TemplateArticleHelp";
import styles from "./Team.module.css";
import { ReactComponent as SettingGreenIcon } from "../../../assets/TeamWithHearthGreenIcon.svg";
import { ReactComponent as ArrowDownBold } from "../../../assets/arrowDownBold.svg";
import { useTranslation } from "react-i18next";

const Team = ({setSelectedCategory}) => {
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
        title={t("team")}
        description={t('teamDescription')}
        Icon={SettingGreenIcon}
        setSelectedCategory={setSelectedCategory}
      >
        <div className={styles.articlesContent}>
          <div className={styles.article}>
            <div
              className={styles.articleTitle}
              onClick={() => handleClick(1)} 
            >
              {t('accessPermissions')} <ArrowDownBold />
            </div>
            <div
              className={styles.articleInfo}
              style={{
                height: activeArticles[1] ? "auto" : "0px", 
                overflow: "hidden", 
              }}
            >
            {t('teamInfoDescription')}
              <br />
              <br />
              {t('typesRoles')}
              <ul>
                <li>
                  <strong>{t('editorTitle')}</strong> {t('editorDescription')}
                </li>
                <li>
                  <strong>{t('collaboratorTitle')}</strong> {t('collaboratorDesc')}
                </li>
              </ul>
              <br />
              {t('AccessLevel')}
              <br />
              {t('bothEditorsAndContributors')}
              <ul>
                <li>
                  <strong>{t("fullAccess")}</strong> {t('completeSynchronization')}
                </li>
                <li>
                  <strong>{t("restrictedAccess")}</strong> {t('limitedAccess')}
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.article}>
            <div
              className={styles.articleTitle}
              onClick={() => handleClick(2)} 
            >
              {t('configurationDigital')} <ArrowDownBold />
            </div>
            <div
              className={styles.articleInfo}
              style={{
                height: activeArticles[2] ? "auto" : "0px", 
                overflow: "hidden", 
              }}
            >
            {t('facturagptTools')}

            <br />
            <br />
            <strong>
          {t('signingSystem')}
            </strong>
            <ul>
                <li>{t('signingSystem1')}</li>
                <li>{t("signingSystem2")}</li>
                <li>{t('signingSystem3')}</li>
            </ul>

            <br />
            <strong>{t('digitalSignature')}</strong>
            <ul>
                <li>{t('digitalSignature1')}</li>
                <li>{t('digitalSignature2')}</li>
                <li>{t('digitalSignature3')}</li>
            </ul>
            </div>
          </div>

          <div className={styles.article}>
            <div
              className={styles.articleTitle}
              onClick={() => handleClick(3)} 
            >
              {t('mergePlan')} <ArrowDownBold />
            </div>
            <div
              className={styles.articleInfo}
              style={{
                height: activeArticles[3] ? "auto" : "0px", 
                overflow: "hidden", 
              }}
            >
            {t('mergePlanDesc')}
            <ol>
                <li>{t('mergePlan1')}</li>
                <li>{t('mergePlan2')}</li>
                <li>{t('mergePlan3')}</li>
                <li>{t('mergePlan4')}</li>
            </ol>
            <br />
            <br />
            {t('idealForCompanies')}
            </div>
          </div>

        </div>
      </TemplateArticleHelp>
    </div>
  );
};

export default Team;
