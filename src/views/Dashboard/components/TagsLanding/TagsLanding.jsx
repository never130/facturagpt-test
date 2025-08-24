import React from "react";
import styles from "./TagsLanding.module.css";
import { ReactComponent as Arrow } from "../../assets/grayArrow.svg";
import { useTranslation } from "react-i18next";

import sandClockIcon from "../../assets/sandClockIcon.svg";
import checkedIconGreen from "../../assets/checkedIconGreen.svg";
import trafficLightIcon from "../../assets/trafficLightIcon.svg";
import ManagePartner from "../../assets/managePartner.svg";
import MedalIcon from "../../assets/medalIcon.svg";
import RingIcon from "../../assets/ringIcon.svg";
import PencilPaperIcon from "../../assets/pencilPaperIcon.svg";
import StadisticsIcon from "../../assets/stadisticsIcon.svg";
import MoneyIcon from "../../assets/moneyIcon.svg";
import PaperClipsIcon from "../../assets/paperClipsIcon.svg";
import RocketIcon from "../../assets/rocketIcon.svg";
import { useState, useEffect } from "react";
import Scroller from "../../screens/ChatView/ChatTags/Scroller";

const TagsLanding = () => {
  const { t } = useTranslation("Landing");

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

 

  const tags1 = [
    { img: sandClockIcon, text: t("saveTime") },
    { img: checkedIconGreen, text: t("realTimeData") },
    { img: trafficLightIcon, text: t("reduceErrors") },
    { img: ManagePartner, text: t("manageContacts") },
  ];
  
  const tags2 = [
    { img: MedalIcon, text: t("manageAssets") },
    { img: RingIcon, text: t("receiveNotifications") },
    { img: PencilPaperIcon, text: t("issueInvoices") },
    { img: StadisticsIcon, text: t("analyzeData") },
  ];
  
  const tags3 = [
    { img: MoneyIcon, text: t("automatePayments") },
    { img: PaperClipsIcon, text: t("connectThirdParties") },
    { img: RocketIcon, text: t("chatWithFacturaGPT") },
  ];
const ScrollerContent = [...tags1, ...tags2, ...tags3];
const renderTags = (tags) =>
  tags.map((tag, index) => (
    <div key={index} className={styles.tag}>
      <img src={tag.img} alt="" />
      {tag.text} <Arrow />
    </div>
  ));
       return(
        <>
        {width >= 768 ? (

            <div className={styles.TagsLandingContainer}>
              <div className={styles.tagLanding}>{renderTags(tags1)}</div>
              <div className={styles.tagLanding}>{renderTags(tags2)}</div>
              <div className={styles.tagLanding}>{renderTags(tags3)}</div>
            </div>
       ):(
       <>
        <Scroller
          direction="left"
          speed="slow"
          handleChat={() => {}}
          isArray={true}
          content={ScrollerContent}
        />
        </>
       )}
        </>
  
       )
};

export default TagsLanding;
