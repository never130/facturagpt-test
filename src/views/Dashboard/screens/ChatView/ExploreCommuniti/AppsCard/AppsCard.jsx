import React from "react";
import styles from "../CardExplore/CardExplore.module.css";
import { ReactComponent as StarExplore } from "../../../../assets/starExplore.svg";
import { ReactComponent as ShieldExplore } from "../../../../assets/shieldExplore.svg";
import { ReactComponent as CirclesExplore } from "../../../../assets/circlesExplore.svg";
import { ReactComponent as ChatIconMarketplace } from "../../../../assets/chatIconMarketplace.svg";
import { ReactComponent as AutomateIconMarketplace } from "../../../../assets/automateIconMarketplace.svg";
import { ReactComponent as PadlockMarketplace } from "../../../../assets/padlockMarketplace.svg";
import { ReactComponent as StarMarketplace } from "../../../../assets/starMarketplace.svg";
import { ReactComponent as ImageDefaultMarketplace } from "../../../../assets/imageDefaultMarketplace.svg";
import { ReactComponent as ContactsIconMarketplace } from "../../../../assets/contactsIconMarketplace.svg";
import { ReactComponent as AssetsIconMarketplace } from "../../../../assets/assetsIconMarketplace.svg";
import { ReactComponent as DocsIconMarketplace } from "../../../../assets/docsIconMarketplace.svg";
import ImageEmpty from "../../../../assets/ImageEmpty.svg";

import { useTranslation } from "react-i18next";
import Button from "../../../../components/Button/Button";
import { setShowModal } from "../../../../../../slices/userSlices";
import { useDispatch } from "react-redux";

const AppsCard = ({ app }) => {
  const [t] = useTranslation("ChatView");
  const dispatch = useDispatch();
  return (
    <div
      className={styles.appsCard}
      onClick={() => {
        dispatch(
          setShowModal({
            modal: "infoExploreCommunity",
            type: "app",
            selectedOptionCommunity: app,
          })
        );
      }}
    >
      <div className={styles.appsCardImage}>
        {app?.image ? (
          <img src={app?.image} alt="ImageEmpty" />
        ) : (
          <div className={styles.imageDefault}></div>
        )}
      </div>
      <div className={styles.appsCardContent}>
        <div className={styles.appsInfo}>
          <p className={styles.appsCardTitle}>{app?.name || t("appName")}</p>
          <span>{app?.description || t("appDescription")}</span>
          <div className={styles.textContainer}>
            <span className={styles.colorGrey}>
              {t(`${t("usedBy")} 99 ${t("users")}`)}
            </span>
            <StarMarketplace />
            {/* <span>{review || t('noRatings')}</span> */}
            <span>4.5</span>
          </div>
        </div>

        <div className={styles.appTryApp}>
          <span>{app?.category || t("category")}</span>
          <div className={styles.appTryAppContainer}>
            <span className={styles.tryApp}>{t("tryApp")}</span>
            <span className={styles.priceApp}>{t("price")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppsCard;
