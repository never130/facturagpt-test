import React, { useState } from "react";
import styles from "./ConfirmationPopup.module.css";
import HeaderCard from "../HeaderCard/HeaderCard";
import { useTranslation } from "react-i18next";
const ConfirmationPopup = ({
  onClose,
  title,
  message,
  handleAccept,
  customStyles,
  customStylesMessage,
  titleMessage,
  handleCloseNewClient,
  openModalAutomate
}) => {
  const [t] = useTranslation("Preview");
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      openModalAutomate && openModalAutomate()
    }, 300);
  };

  const onAccept = async () => {
    setLoading(true);
    handleCloseNewClient && handleCloseNewClient()
    handleAccept()
      .then(() => {})
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
        handleClose();
      });
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        handleClose();
      }}
      className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : ""}`}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`${styles.modalContent} ${isClosing ? styles.scaleDown : ""}`}
        style={customStyles}
      >
     
        <HeaderCard title={title} setState={handleClose}>
          <div className={styles.footerContainer}>
            <div onClick={handleClose} className={styles.newFolderButton}>
              {t('cancel')}
            </div>
            <div onClick={onAccept} className={styles.selectButton}>
              {loading ? t('procesing') : t('acept')}
            </div>
          </div>
        </HeaderCard>
        <div className={styles.contentContainer}>
          {titleMessage && (
            <h1 className={styles.titleMessage}>{titleMessage}</h1>
          )}
          <p className={styles.messageText} style={customStylesMessage}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
