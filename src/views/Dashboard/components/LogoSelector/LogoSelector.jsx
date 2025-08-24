import React from "react";
import styles from "./LogoSelector.module.css";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import facturaGPT from "../../assets/FacturaLogoIconGreen.svg";

const LogoSelector = ({
  logos = [],
  selectedLogo,
  onAddLogo,
  onDeleteLogo,
  onSelectLogo,
  fileInputRef,
  onFileChange,
  text,
  buttonDown = false,
}) => {
  const [t] = useTranslation("Preview");
  const { user } = useSelector((state) => state.user)
  return (
    <div className={styles.labelLogoSelector}>
      <div className={styles.row}>
        <p>{text}</p>
        {!buttonDown && <Button action={onAddLogo} type="white"headerStyle={{borderRadius:"999px"}} >{t('add')} {text}</Button>}
      </div>
      <div className={styles.logoCorporativo}>
        {logos?.length === 0 && (
          <div className={styles.container}>
            <span>{t('notYetAddedLogo')}</span>
          </div>
        )}
        {logos?.map((logo) => (
          <div className={styles.container} key={logo}>
            <input
              checked={selectedLogo === logo}
              onChange={() => onSelectLogo(logo)}
              type="radio"
              name="corporativeLogo"
              className={styles.radioInputLogoSelector}
            />
        <img
  src={logo}
  alt={t('corporateLogo')}
  onError={(e) => {
    e.target.onerror = null; 
    e.target.src = facturaGPT;
  }}
/>

            <div className={styles.delete} onClick={() => onDeleteLogo(logo)}>
              -
            </div>
          </div>
        ))}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={onFileChange}
      />
      {buttonDown && (
        <Button type="white" headerStyle={{ width: "100%" }} action={onAddLogo}>
          {t('addYour')} {text}
        </Button>
      )}
    </div>
  );
};

export default LogoSelector;
