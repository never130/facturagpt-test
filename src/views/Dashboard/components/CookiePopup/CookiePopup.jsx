import React, { useState, useEffect } from "react";
import styles from "./CookiePopup.module.css";
import { ReactComponent as Arrow } from "../../assets/arrowDiagonalWhite.svg";
import { ReactComponent as Close } from "../../assets/closeGray.svg";
import { ReactComponent as ArrowDownBold } from "../../assets/grayChevron.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HelpComponent = ({ setShowHelp }) => {
  const { t } = useTranslation("Landing");
  const navigate = useNavigate();

  const handleClose = () => {
    setShowHelp(false);
    sessionStorage.setItem("showHelp", "false");
  };

  return (
    <div className={styles.HelpComponent}>
      <div className={styles.helpText}>
        <p>{t("helpText")} 🚀</p>
        <Close className={styles.icon} onClick={handleClose} />
      </div>
      <div
        className={styles.helpContentArrow}
        onClick={() => navigate("/contact")}
      >
        <Arrow />
      </div>
    </div>
  );
};

const CookiePopup = () => {
  const { t } = useTranslation("Landing");
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(() => {
    return sessionStorage.getItem("showHelp") !== "false";
  });

  useEffect(() => {
    const cookiesAccepted = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookiesAccepted="));

    if (!cookiesAccepted) {
      setVisible(true);
    }

    const prevPage = sessionStorage.getItem("prevPage");

    if (
      prevPage !== location.pathname &&
      sessionStorage.getItem("showHelp") !== "false"
    ) {
      setShowHelp(true);
      sessionStorage.setItem("showHelp", "true");
    }

    sessionStorage.setItem("prevPage", location.pathname);
  }, [location.pathname]);

  const handleResponse = (accepted) => {
    if (accepted) {
      document.cookie = "cookiesAccepted=true; path=/; max-age=31536000";
    }
    setVisible(false);

    setTimeout(() => {
      if (sessionStorage.getItem("showHelp") !== "false") {
        setShowHelp(true);
        sessionStorage.setItem("showHelp", "true");
      }
    }, 5000);
  };

  return (
    <>
      {visible ? (
        <div className={styles.cookiePopup}>
          <div className={styles.textCookies}>
            <p>{t("weUseCookies")}</p>
            <span>
              {t("checkOur")} <a href="/terms">{t("linkText")}</a>{" "}
              {t("clickAcceptAll")}
            </span>
          </div>
          <div className={styles.buttons}>
            <button onClick={() => handleResponse(true)} className={styles.acceptButton}>
              {t("acceptAll")}
            </button>
            <button onClick={() => handleResponse(false)} className={styles.recjectButton}>
              {t("rejectNonEssential")} {' '} <ArrowDownBold/>
            </button>
          </div>
        </div>
      ) : (
        showHelp && <HelpComponent setShowHelp={setShowHelp} />
      )}
    </>
  );
};

export default CookiePopup;
