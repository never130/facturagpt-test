import React from "react";
import styles from "./Reviews.module.css";
import Carousel from "../Carousel/Carousel";
import FAQ from "../Faqs/Faqs";
import diagonalArrow from "../../assets/diagonalArrow.svg";
import { useTranslation } from "react-i18next";
import SubtitleTemplate from "../SubtitleTemplate/SubtitleTemplate";
import TagsLanding from "../TagsLanding/TagsLanding";
import CircleProgressBar from "../CircleProgressBar/CircleProgressBar";

const Reviews = () => {
  const { t } = useTranslation("Landing");
  return (
    <div className={styles.reviewsContainer}>
      <section className={`${styles.reviewsSection} section`}>
        <h2 className={styles.reviewsTitle}><strong>{t('pay')}</strong> {' '} {t('forWhat')} {' '} <strong>{t('youUse')}</strong> {' '} {t('withOur')} {' '} <strong>{t('packs')}</strong> {' '} {t('flexibles')} </h2>
 
        <div className={styles.startsFrom}>
          <div>
            <span>{t("plan")}</span>
            <span>{t("basic")}</span>
          </div>
          {t("priceSubTitle")}
        </div>
        <div className={styles.price}>
          €15 <span>/{t("priceTime")}</span>
        </div>
        <SubtitleTemplate
          text={t("taxesNotIncluded")}
          stylesProp={{ padding: "0 20px", fontWeight: "200" }}
        />
        <TagsLanding />
      </section>
      <section className={`${styles.CarrouselContainer} section`}>
        <h2 className={styles.reviewsTitle}>{t("title")}</h2>
        <SubtitleTemplate
          text={t("subTitle")}
          stylesProp={{ padding: "0 20px", maxWidth: "100%" }}
        />
        <Carousel />
      </section>

      <FAQ />
      <CircleProgressBar />

      <section className={`${styles.startNowSection} section`}>
        <h2 className={styles.reviewsTitle} style={{width:"100%"}}>{t("joinUsTitle")}</h2>
        <SubtitleTemplate
          text={t("joinUsSubTitle")}
          stylesProp={{ padding: "0 20px" }}
        />

        <a href="/freetrial" className={styles.startButton}>
          {t("joinUsButton")} <img src={diagonalArrow} />
        </a>
      </section>
    </div>
  );
};

export default Reviews;
