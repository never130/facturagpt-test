import { useState } from "react";
import styles from "./PlanUpdatedModal.module.css";
import closeGray from "../../assets/closeGray.svg";
import greenTick from "../../assets/greenTick.svg";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import SeeHistory from "../SeeHistory/SeeHistory";
import { useTranslation } from "react-i18next";
const PlanUpdatedModal = ({ onClose, setSeeHistory, seeHistory }) => {
  const { t } = useTranslation("navbarAdmin");

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
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
      >
     
        <HeaderCard title={t('planUpdatedSuccessfully')} setState={handleClose}>
          <Button
            type="white"
            action={() => {
              onClose();
              setSeeHistory(true);
            }}
          >
            {t('viewHistory')}
          </Button>
          <Button action={handleClose}>{t('acept')}</Button>
        </HeaderCard>
        <div className={styles.upgradePlanContent}>
          <div className={styles.checkCircle}>
            <img src={greenTick} alt="greenTick" />
          </div>
          <span className={styles.upgradePlanText}>
            {t('billingWillBeIssued')}
          </span>
          <span className={styles.upgradePlanText}>
            {t('ifYouExceedYourCurrentPlan')}
          </span>
        </div>
     
      </div>
    </div>
  );
};

export default PlanUpdatedModal;
