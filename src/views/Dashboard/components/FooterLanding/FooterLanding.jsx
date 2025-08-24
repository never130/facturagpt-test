import React, { useEffect, useState } from "react";
import styles from "./FooterLanding.module.css";
import { ReactComponent as BlackInstagramIcon } from "../../assets/BlackInstagramIcon.svg";
import { ReactComponent as BlackLinkedinIcon } from "../../assets/BlackLinkedinIcon.svg";
import { ReactComponent as ArrowGray } from "../../assets/arrowDownGray.svg";
import { languageFlags } from "../../../../utils/flags";

import i18n from "../../../../i18";
import { useTranslation } from "react-i18next";

const FooterLanding = ({variant}) => {
  const currentYear = new Date().getFullYear(); 
  const handleLanguage = (lng) => {
    localStorage.setItem("language", lng);
    i18n.changeLanguage(lng);
  };
  const { t } = useTranslation("Landing");
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);

  const [idVariant, setIdVariant] = useState(() => {
    return localStorage.getItem("translationId") || "Factura";
  });
  
  useEffect(() => {
    const translationId = localStorage.getItem("translationId");
    if (translationId !== idVariant) {
      setIdVariant(translationId);
    }
  }, [ localStorage.getItem("translationId")]);


  return (
    <footer className={styles.footer}>
      <div className={styles.leftSection}>
        <p className={styles.name}>  {idVariant?.slice(0, -3) || 'Factura'}GPT
         &copy; {currentYear}</p>
        <a href="https://www.instagram.com/facturagpt/?igsh=MXA4NGdnY3p3YWRxZw%3D%3D&utm_source=qr#">
          <BlackInstagramIcon className={styles.icon} />
        </a>
        <a href="https://www.instagram.com/facturagpt/?igsh=MXA4NGdnY3p3YWRxZw%3D%3D&utm_source=qr#">
          <BlackLinkedinIcon className={styles.icon} />
        </a>
      </div>
      <div className={styles.rightSection}>
        <a href="/login" className={styles.link}>
          {t("login")}
        </a>
        <a href="/register" className={styles.link}>
          {t("register")}
        </a>
        <a href="/contact" className={styles.link}>
          {t("contact")}
        </a>
        <a href="/terms" className={styles.link}>
          {t("terms")}
        </a>
        <a href="/help" className={styles.link}>
          {t("help")}
        </a>
        <div className={styles.flags}>
          {" "}
          <div
            className={`${styles.language} ${styles.languagecontainer}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowLanguageOptions((prev) => !prev);
            }}
          >
            <span className={styles.languageHover}>
            {t("language")}
              <ArrowGray className={styles.icon} />
            </span>
            <div
              className={`${styles.languageDropdown} ${showLanguageOptions && styles.showLanguageOptions}`}
            >
              {languageFlags.map((item) => (
                <div
                  key={item.code || item.value} 
                  className={styles.dropdownItem}
                  onClick={() => {
                    handleLanguage(item.text);
                  }}
                >
                  {item.flag}
                  {item.value}
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLanding;
