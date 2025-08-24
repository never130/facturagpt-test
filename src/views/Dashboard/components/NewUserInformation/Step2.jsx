import React from "react";
import styles from "./NewUserInformation.module.css";
import { ReactComponent as ImageEmpty } from "../../assets/ImageEmpty.svg";
import { ReactComponent as GreenStarIcon } from "../../assets/GreenStarIcon.svg";
import { useTranslation } from "react-i18next";
import Button from "../Button/Button";
const Step2 = () => {
  const { t } = useTranslation("navbarAdmin");
  return (
    <div className={styles.Step2Container}>
      <ImageEmpty />
      <p className={styles.youHaveBeenInvitedTo}>
        {t("youHaveBeenInvitedTo")} {' '} <strong> [Workspacename]</strong>
        <div className={styles.GreenStarIcon}>
          <GreenStarIcon />
        </div>
      </p>

      <div className={styles.infoUser}>
      <span className={styles.hasInvitedYouLike}>[firstname] {t('hasInvitedYouLike')}</span>
      <strong className={styles.green}>[accessrol]</strong>
      </div>
      <Button headerStyle={{borderRadius:"999px"}}>{t('aceptInvitation')}</Button>

      <span className={styles.cancel}>{t('cancel')}</span>

    </div>
  );
};

export default Step2;
