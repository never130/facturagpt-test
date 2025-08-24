import React, { useEffect, useState } from "react";
import styles from "./Packs.module.css";
import Reviews from "../../components/Reviews/Reviews";
import { useTranslation } from "react-i18next";
import LinesLandingSection from "../../components/LinesLandingSection/LinesLandingSection";
import FlowSection from "../../components/FlowSection/FlowSection";
import SubtitleTemplate from "../../components/SubtitleTemplate/SubtitleTemplate";
import { ReactComponent as EntradaIcon } from "../../assets/entradaIcon.svg";
import { ReactComponent as EstructuracionIcon } from "../../assets/estructuracionIcon.svg";
import { ReactComponent as SalidaIcon } from "../../assets/salidaIcon.svg";
const wrapFirstWordInSpan = (text) => {
  if (!text) return "";
  const words = text.split(" ");
  const firstWord = words[0];
  const restOfText = words.slice(1).join(" ");
  return (
    <>
      <span>{firstWord}</span> {restOfText}
    </>
  );
};
const Packs = () => {
  const { t } = useTranslation("Landing");

  const steps = [
    {
      icon: <EntradaIcon className={styles.icon} />,
      step: t("step1"),
      title: t('login'),
      description: <>
      {t('connectAnd')} {' '}<span>{t('syncInformationInput')}</span> {' '}{t('inAnyFileFormat')}
      </>,
    },
    {
      icon: <EstructuracionIcon className={styles.icon} />,
      step: t("step2"),
      title: t('structureTheData'),
      description: <>
      <span>{t('recognize')}</span> {' '}{t('allVariablesAnyTypeDocument')} {' '}{t('whatImportant')}
      </>,
    },
    {
      icon: <SalidaIcon className={styles.icon} />,
      step: t("step3"),
      title:t('saves80Times'),
      description: <>
      {t('your100AutomatedProccess')} {' '}<span className={styles.greenWordDescription}>{t('talkToHim')}</span>
      </>,
    },
  ];


  return (
    <div className={styles.packsContainer}>
      <div className={styles.stepsContainer} id="facturation">
        <section className={`${styles.wrapper} section`}>
          <div className={styles.stepContainer}>
            <div>
              <h2>{t("packsTitle")}</h2>
              <h3>{t("helpYou")}</h3>
            </div>
            <div className={styles.stepsContent}>
              {steps.map((step, index) => (
                <div key={index} className={styles.card}>
          <div className={styles.iconContainer}>{step.icon}</div>

                  <p className={styles.step}>{step.step}</p>
                  <h4 className={styles.title}>{wrapFirstWordInSpan(step.title)}</h4>
                  <SubtitleTemplate text={step.description} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <LinesLandingSection />
      </div>

    

      <section className="section"	>
        <div
        className={styles.programsContainer}
        >
          <div className={styles.extensionsTitle}>
            <h2>{t("createConnectConsultData")}</h2>
          </div>
          <div>
            <SubtitleTemplate
              text={<>
              {t('we')} {' '} <span>{t('adapt')}</span>{' '} {t('toAnySituation')} {' '} <span>{t('sector')}</span> <br /> {' '} {t('thanksToOur')} {' '} <span>{t('synchronization')}</span> {' '} {t('withThirdPartyPlatforms')}, {' '} <span>{t('weComplement')}</span> {' '} {t('yourCurrentInfrastructure')} {' '} <span>{t('efficient')}</span> {' '} {t('creatingA')} {' '} <span>{t('privateEnviroment')}</span> {' '} {t('forYourBusiness')}
              </>}
              stylesProp={{ padding: "0 20px" }}
            />
        </div>
          <FlowSection />
        </div>
      </section>
      <Reviews />
    </div>
  );
};

export default Packs;
