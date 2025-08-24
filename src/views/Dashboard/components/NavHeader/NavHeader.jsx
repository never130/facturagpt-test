import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {ReactComponent as Logo} from "../../assets/FacturaLogoIconGreen.svg";
import { ReactComponent as SeeVideoIcon } from "../../assets/PlayIcon.svg";
import starIcon from "../../assets/starGroup.svg";
import SubtitleTemplate from "../SubtitleTemplate/SubtitleTemplate";
import styles from "./NavHeader.module.css";


const NavHeader = ({}) => {
  const { t } = useTranslation("Landing");

  const handleScrollToFacturation = () => {
    const facturationElement = document.getElementById("facturation");
    if (facturationElement) {
      const rect = facturationElement.getBoundingClientRect();
      const offsetTop =
        rect.top +
        window.pageYOffset -
        (window.innerHeight / 2 - rect.height / 2);

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsVideoOpen(false);
      }
    };

    if (isVideoOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isVideoOpen]);

  const handleClosePopup = () => {
    setIsVideoOpen(false);
  };

  
  const [idVariant, setIdVariant] = useState(() => {
    return localStorage.getItem("translationId") || "Factura";
  });
  
  useEffect(() => {
    const translationId = localStorage.getItem("translationId");
    if (translationId !== idVariant) {
      if(translationId){
        setIdVariant(translationId);
      }
    }
  }, [ localStorage.getItem("translationId")]);

  return (
    <div className={styles.navHeaderContainer}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "35px",
        }}
      >
        <Logo className={styles.logo}/>
        <div className={styles.navHeaderSubtitle}>
        
        
          <span className={styles.factura}> {idVariant == "Factura" ? idVariant : idVariant?.slice(0, -3) }</span>
          <span className={styles.gpt}>GPT</span>
        </div>
      </div>
      <img
        src={starIcon}
        className={`${styles.iconfloat} ${styles.starIconR} `}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <SubtitleTemplate
          text={t("description")}
          stylesProp={{ padding: "0 20px" }}
        />
        <div className={styles.navButtons}>
          <button
            onClick={() => setIsVideoOpen(true)}
            className={styles.button}
          >
            <SeeVideoIcon/>
            {t("seeVideo")} 
          </button>
        </div>
        <div className={styles.navHeaderTitle}>{t("3millionDocuments")}</div>
      </div>

      {isVideoOpen && (
        <div className={styles.videoPopupOverlay} onClick={handleClosePopup}>
          <div
            className={styles.videoPopupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={handleClosePopup}>
              ×
            </button>
            <div className={styles.videoWrapper}>
              <video
                controls
                autoPlay
                className={styles.video}
                src={"./assets/video.mp4"}
              >
                {t('yourBrowserNotSupportVideo')}
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavHeader;
