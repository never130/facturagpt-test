import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import facturaLogo from "../../assets/newFacturaGPTGreenIcon.svg";
import styles from "./FreeTrial.module.css";
import openai from "../../assets/openaiIcon.svg";
import mail from "../../assets/emailIcon.svg";
import { ReactComponent as GoogleLogo } from "../../assets/googleLogo.svg";

import lock from "../../assets/LockIcon.svg";

import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import CookiePopup from "../../components/CookiePopup/CookiePopup";
import FooterLanding from "../../components/FooterLanding/FooterLanding";

const FreeTrial = () => {
  const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();
  const { t } = useTranslation("freeTrial");
  const navigate = useNavigate();

  React.useEffect(
      () => {
        const translationId = localStorage.getItem("translationId");
        document.title = `${translationId?.replace(translationId
            ?.slice(translationId?.length - 3, translationId?.length),'GPT')
            ?.toUpperCase() || t("facturaGPT")} - ${t('FreeTrial')}`;
      },[]
  )

  return (
   <>
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div id={styles.logo}>
          <img src={facturaLogo} alt="FacturaGPT" id={styles.LogoGPT} />
          <p>
            Factura<span>GPT</span>
          </p>
        </div>
        <div className={styles.btnContainer}>
          <button
            onClick={() => navigate("/register")}
            className={styles.signInButton}
          >
            <img src={mail} alt="Mail Icon" />
            {t("registerButton")}
          </button>
          <button onClick={() => loginWithRedirect()}>
            <GoogleLogo width="20" />
            <span>{t("loginAIButton")}</span>
          </button>
        </div>

        <p>
          {t("optionLogin")} <a href="/login">{t("login")}</a>
        </p>

        <p className={styles.policy}>
          {t("termAndCon")}
          <a href="terms">{t("termAndConLink")}</a>
        </p>
        <p className={styles.safety}>
          <img src={lock} alt="Lock Icon" />
          {t("security")}
        </p>
      </div>
      <CookiePopup />
    </div>
      <FooterLanding/>
      </>
  );
};

export default FreeTrial;
