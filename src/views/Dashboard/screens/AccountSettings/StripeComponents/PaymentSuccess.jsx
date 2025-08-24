import React from "react";
import styles from "./PaymentSuccess.module.css";
import { useTranslation } from "react-i18next";

const PaymentSuccess = ({ onClose }) => {
  const [t] = useTranslation('dashboard')
  return (
    <div className={styles.modal}>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
          <span className={styles.checkmark}>&#10003;</span>
        </div>
      </div>
      <h2 className={styles.title}>{t('paymentSuccessful')}</h2>
      <p className={styles.message}>
        {t('transactionCompletedSuccesfully')}
      </p>
      <button className={styles.dashboardButton} onClick={onClose}>
        {t('accept')}
      </button>
    </div>
  );
};

export default PaymentSuccess;
