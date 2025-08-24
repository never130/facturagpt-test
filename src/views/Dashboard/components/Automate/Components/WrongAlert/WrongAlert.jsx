import React from "react";
import { ReactComponent as WrongAlertIcon } from "../../../../assets/WrongAlert.svg";
import styles from "./WrongAlert.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WrongAlert = ({
  message,
  addConnection,
  customCss,
  close,
  setIsModalAutomate,
  setHideAutomate
}) => {
  const [t] = useTranslation("AutomatesComponent");

  return (
    <div className={styles.wrongAlert} style={customCss}>
      <div className={styles.leftSide}></div>
      <div className={styles.iconContainer}>
        <WrongAlertIcon className={styles.icon} />
      </div>
      <div className={styles.messageContainer}>
        <span className={styles.message}>
          {message}{" "}
          {addConnection ? (
            <Link to={addConnection}>{t("here")}</Link>
          ) : close ? (
            <button
              onClick={() => {
                close(false);
                setTimeout(() => {
                  setIsModalAutomate(true);
                  setHideAutomate(false)
                }, 300);
              }}
              className={styles.buttonClose}
            >
              {t("here")}
            </button>
          ) : null}
        </span>
      </div>
    </div>
  );
};

export default WrongAlert;
