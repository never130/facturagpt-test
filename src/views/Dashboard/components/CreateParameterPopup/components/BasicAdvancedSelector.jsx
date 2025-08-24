import React from "react";
import styles from "./BasicAdvancedSelector.module.css";
import { useTranslation } from "react-i18next";

const BasicAdvancedSelector = ({ selectedMode, onModeChange }) => {
  const [t] = useTranslation("Contacts");

  return (
    <div className={styles.selectorContainer}>
      
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.modeButton} ${
            selectedMode === "basic" ? styles.active : ""
          }`}
          onClick={() => onModeChange("basic")}
        >
          {t("basic")}
        </button>
        <button
          className={`${styles.modeButton} ${
            selectedMode === "advanced" ? styles.active : ""
          }`}
          onClick={() => onModeChange("advanced")}
        >
          {t("advanced")}
        </button>
      </div>
    </div>
  );
};

export default BasicAdvancedSelector;
