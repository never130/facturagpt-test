import React from "react";
import styles from "./TemplateArticleHelp.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TemplateArticleHelp = ({ title, children,description,Icon,setSelectedCategory, validate=true }) => {
  const { t } = useTranslation("helpPage");
  const navigate = useNavigate()
  return (
    <div className={styles.templateArticleHelp}>
        <div className={styles.path}>
            <span onClick={() => {
              navigate(`/help`);
              setSelectedCategory(null)
            }}>{t("helpCenter")}</span> <p> &gt; {title}</p>
        </div>
        {validate &&(

          <h3 className={styles.title}><Icon/> {title}</h3>
        )
        }
      <h4 className={styles.description}>{description}</h4>
   
      {children && <div className={styles.additionalContent}>{children}</div>}
    </div>
  );
};

export default TemplateArticleHelp;
