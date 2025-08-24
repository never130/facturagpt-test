import React from "react";
import star from "../../assets/starPlus.svg";
import styles from "./GetPlusButton.module.css";
import { useTranslation } from "react-i18next";
const GetPlusButton = ({ action }) => {
  const { t } = useTranslation("navbarAdmin");

  return (
    <button className={styles.GetPlusButton} onClick={action}>
      {t('getPlus')} <img src={star} alt="Icon" />
    </button>
  );
};

export default GetPlusButton;
