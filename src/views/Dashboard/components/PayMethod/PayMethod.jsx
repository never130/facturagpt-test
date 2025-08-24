import React, { useState } from "react";
import styles from "./PayMethod.module.css";
import { ReactComponent as Minus } from "../../assets/minus.svg";
import { useTranslation } from "react-i18next";

const PayMethod = ({ method, onChange,containerType }) => {
  const [t] = useTranslation("InfoContact");
  const handleInputChange = (key, value) => {
    onChange(key, value); 
  };
  return (
    <div className={styles.payMethodContainer}>
      <div className={styles.payInfo} style={containerType === "popup" ? { flexDirection: "column" } : {}}>
        <div>
          <span>{t('bank')}</span>
          <select style={containerType === "popup" ?{ padding:"4px", borderRadius: "4px", width: "100%" }: {}}
            value={method?.bank || ""}
            onChange={(e) => handleInputChange("bank", e.target.value)}
          >
            <option value="BBVA">{t('BBVA')}</option>
            <option value="Santander">{t('Santander')}</option>
            <option value="Citibank">{t('Citibank')}</option>
            <option value="Chase">{t('Chase')}</option>
          </select>
        </div>
        <div>
          <span>{t('accountNumber')}</span>
          <input style={containerType === "popup" ?{ padding:"4px", borderRadius: "4px", width: "100%" }: {}}
            type="text"
            value={method?.accountNumber || ""}
            onChange={(e) => handleInputChange("accountNumber", e.target.value)}
          />
        </div>
        <div>
          <span>{t('swiftBic')}</span>
          <input style={containerType === "popup" ?{ padding:"4px", borderRadius: "4px", width: "100%" }: {}}
            type="text"
            value={method?.swift || ""}
            onChange={(e) => handleInputChange("swift", e.target.value)}
          />
        </div>
        <div>
          <span>{t('routingNumber')}</span>
          <input style={containerType === "popup" ?{ padding:"4px", borderRadius: "4px", width: "100%" }: {}}
            type="text"
            value={method?.routingNumber || ""}
            onChange={(e) => handleInputChange("routingNumber", e.target.value)}
          />
        </div>
        <div>
          <span>{t('currency')}</span>
          <input style={containerType === "popup" ?{ padding:"4px", borderRadius: "4px", width: "100%" }: {}}
            type="text"
            value={method?.currency || ""}
            onChange={(e) => handleInputChange("currency", e.target.value)}
          />
        </div>
      </div>
      <div className={styles.defaultBank} style={containerType === "popup" ? { gap: "0px",whiteSpace: "nowrap",padding: "20px 0px"} : {}}>
        <div>
          <input
            type="checkbox"
            checked={method?.default || false}
            onChange={(e) => handleInputChange("default", e.target.checked)}
          />
          <p>{t('defaultBank')}</p>
        </div>
        <div className={styles.delete}>
          <Minus className={styles.icon} />
        </div>
      </div>
    </div>
  );
};

export default PayMethod;
