import React from "react";
import styles from "./LinesLandingSection.module.css";
import { ReactComponent as LinesLandingSectionImg } from "../../assets/linesLandingSection.svg";
import { ReactComponent as ArrowDiagonal } from "../../assets/arrowDiagonalWhite.svg";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LinesLandingSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("Landing");

  return (
    <section className={`${styles.linesContainer} section`}>
   
      <h3>
     {t('completeSuite')}
      </h3>
      <div className={styles.imgContainerLines}>
        {" "}
        <LinesLandingSectionImg />
      </div>

      <p>{t("findYourConnection")}</p>
      <Button
        headerStyle={{
          borderRadius: "999px",
          background: "#10a37e68",
          alignItems: "center",
          display: "flex",
          gap: "10px",
        }}
        action={() => navigate("/contact")}
      >
        {t("contactSales")} <ArrowDiagonal style={{ height: "8px" }} />
      </Button>
    </section>
  );
};

export default LinesLandingSection;
