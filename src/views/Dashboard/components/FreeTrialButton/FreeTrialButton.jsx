import React from "react";
import { useTranslation } from "react-i18next";
import diagonalArrow from "../../assets/diagonalArrow.svg";
import styles from "./FreeTrialButton.module.css";

const FreeTrialButton = () => {
  const { t } = useTranslation("Landing");
  return (
    <a href="/freetrial" className={styles.startButton}>
      {t("tryFree")} <img src={diagonalArrow} />
    </a>
  );
};

export default FreeTrialButton;
