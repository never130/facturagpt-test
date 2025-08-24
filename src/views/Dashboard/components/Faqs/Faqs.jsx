import React, { useState } from "react";
import styles from "./Faqs.module.css";
import showMoreIcon from "../../assets/showMoreIcon.svg";
import arrowDown from "../../assets/arrowRightContact.png";
import { useTranslation } from "react-i18next";
const FAQ = ({father,showContactButton}) => {
  const { t } = useTranslation("Landing");

  const faqsDefault  = [
    {
      question: t("whatIsFacturaGpt"),
      answer: t("whatIsFacturaGptAnswer"),
    },
    {
      question: t("whatFormatAccept"),
      answer: t("whatFormatAcceptAnswer"),
    },
    {
      question: t("howDoesFacturaHelp"),
      answer: t("howDoesFacturaHelpAnswer"),
    },
    ,
    {
      question: t("canOtherSoftwareBeIntegrated"),
      answer: t("canOtherSoftwareBeIntegratedAnswer"),
    },
    {
      question: t("canTryFacturaBeforePurchasing"),
      answer: t("canTryFacturaBeforePurchasingAnswer"),
    },
    {
      question: t("doesFacturaTerchnicalSupport"),
      answer: t("doesFacturaTerchnicalSupportAnswer"),
    },
    {
      question: t("usefulForSmallBusinesses"),
      answer: t("usefulForSmallBusinessesAnswer"),
    },
    {
      question: t("facturaWorkWithoutInternet"),
      answer: t("facturaWorkWithoutInternetAnswer"),
    },
    {
      question: t("facturaAllowMultipleCompanies"),
      answer: t("facturaAllowMultipleCompaniesAnswer"),
    },
    {
      question: t("facturaCustomizedCompanyNeed"),
      answer: t("facturaCustomizedCompanyNeedAnswer"),
    },
    {
      question: t("isFacturaSafe"),
      answer: t("isFacturaSafeAnswer"),
    },
    {
      question: t("whatDifferentiatesFacturaSimilarSolutions"),
      answer: t("whatDifferentiatesFacturaSimilarSolutionsAnswer"),
    },
    {
      question: t("facturaUpdateAutomatically"),
      answer: t("facturaUpdateAutomaticallyAnswer"),
    },
  ];
  const faqsByFather = {
    pricing: [
      {
        question: t("pricingQuestion1"),
        answer: t("pricingAnswer1"),
      },
      {
        question: t("pricingQuestion2"),
        answer: t("pricingAnswer2"),
      },
      {
        question: t("pricingQuestion3"),
        answer: t("pricingAnswer3"),
      },
      {
        question: t("pricingQuestion4"),
        answer: t("pricingAnswer4"),
      },
      {
        question: t("pricingQuestion5"),
        answer: t("pricingAnswer5"),
      },
      {
        question: t("pricingQuestion6"),
        answer: t("pricingAnswer6"),
      },
      {
        question: t("pricingQuestion7"),
        answer: t("pricingAnswer7"),
      },
      {
        question: t("pricingQuestion8"),
        answer: t("pricingAnswer8"),
      },
      {
        question: t("pricingQuestion9"),
        answer: t("pricingAnswer9"),
      },
    ],
    };

  const faqs = father && faqsByFather[father] ? faqsByFather[father] : faqsDefault;
  const [activeIndexes, setActiveIndexes] = useState([]);

  const toggleFAQ = (index) => {
    if (activeIndexes.includes(index)) {
      setActiveIndexes(activeIndexes.filter((i) => i !== index));
    } else {
      setActiveIndexes([...activeIndexes, index]);
    }
  };

  return (
    <section className={`${styles.faqSection} section`}>
      <h2>{t("titleFaq")}</h2>
      <div className={styles.faqContainer}>
        {faqs.map((faq, index) => (
          <div key={index} className={styles.faqItem}>
            <button
              className={styles.faqQuestion}
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span
                className={`${styles.icon} 
                `}
              >
                <img src={showMoreIcon} alt="" />
              </span>
            </button>
            <div
              className={`${styles.faqAnswer} ${
                activeIndexes.includes(index) ? styles.show : ""
              }`}
            >
              <span>
                {faq.answer.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </span>
            </div>
          </div>
        ))}
      {showContactButton && (
          <p className={styles.contact}>
          {t("moreInfo")}{" "}
          <a href="/contact">
            {t("contact")} <img src={arrowDown} alt="" />
          </a>
        </p>
      )}
      </div>
    </section>
  );
};

export default FAQ;
