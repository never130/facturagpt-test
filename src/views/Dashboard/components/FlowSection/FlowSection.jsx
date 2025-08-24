import React from "react";
import styles from "./FlowSection.module.css";
import { ReactComponent as IntegrationIcon } from "../../assets/IntegrationIcon.svg";
import { ReactComponent as RecognitionIcon } from "../../assets/RecognitionIcon.svg";
import { ReactComponent as StructuringIcon } from "../../assets/StructuringIcon.svg";
import { ReactComponent as InteractionIcon } from "../../assets/InteractionIcon.svg";
import SubtitleTemplate from "../SubtitleTemplate/SubtitleTemplate";
import { useTranslation } from "react-i18next";

const FlowSection = () => {
  const { t } = useTranslation("Landing"); 

  const steps = [
    {
      icon: <IntegrationIcon className={styles.icon} />,
      title: t("integration"),
      description: t("setUpYourAccounts"),
    },
    {
      icon: <RecognitionIcon className={styles.icon} />,
      title: t("recognition"),
      description: t("extractRelevantInformation"),
    },
    {
      icon: <StructuringIcon className={styles.icon} />,
      title: t("structuring"), 
      description: t("sortAndClasifyVariables"),
    },
    {
      icon: <InteractionIcon className={styles.icon} />,
      title: t("interaction"), 
      description: t("drawInformesConclusions"),
    },
  ];

  return (
    <div className={styles.stepsContainer}>
      {steps.map((step, index) => (
        <div key={index} className={styles.steps}>
          <div className={styles.iconContainer}>{step.icon}</div>
          <h3>{step.title}</h3>
          <SubtitleTemplate
            text={step.description}
            stylesProp={{ fontSize: "17px" }}
          />
        </div>
      ))}
    </div>
  );
};

export default FlowSection;
