import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./PlanSelector.module.css";
import { ReactComponent as FreelancePeopleIcon } from "../../../assets/FreelancePeopleIcon.svg";
import { ReactComponent as ProfesionalPeopleIcon } from "../../../assets/ProfesionalPeopleIcon.svg";
import { ReactComponent as CorporationPeopleIcon } from "../../../assets/CorporationPeopleIcon.svg";
import { ReactComponent as PartnersPeopleIcon } from "../../../assets/PartnersPeopleIcon.svg";
import { ReactComponent as CheckCircleFeatures } from "../../../assets/checkCircleFeatures.svg";
import { ReactComponent as GrayDiagonalArrow } from "../../../assets/GrayDiagonalArrow.svg";
import { ReactComponent as ArrowDiagonal } from "../../../assets/diagonalArrowWhite.svg";
import { ReactComponent as GreenCheck } from "../../../assets/GreenCheckCircle.svg";
const PlanSelector = () => {
  const { t } = useTranslation(["pricingCard", "Landing"]);

  const [planType, setPlanType] = useState("Freelance");
  const [billingType, setBillingType] = useState('monthly');

  const planTypes = [
    {
      value: "1-5",
      key: "Freelance",
      label: t('freelance'),
      icon: <FreelancePeopleIcon />, 
    },
    {
      value: "5-20",
      key: "Professional",
      label: t('professional'),
      icon: <ProfesionalPeopleIcon />,
    },
    {
      value: "+25",
      label: t('corporation'),
      key: "Corporation",
      icon: <CorporationPeopleIcon />,
    },
    {
      value: "",
      label: t('partners'),
         key: "Partners",
      icon: <PartnersPeopleIcon />,
    },
  ];

  const plansByType = {
    Freelance: [
      {
        title: t("basic"),
        features: [
          t("features_basic1"),
          t("features_basic2"),
          t("features_basic3"),
          t("features_basic4"),
          t("features_basic5"),
          t("features_basic6"),
          t("features_basic7"),
          t("features_basic8"),
          t("features_basic9"),
          t("features_basic10"),
        ],
        info: [t("info_free1"), t("info_free2")],
        pricing: {
          monthly: "15",
          yearly: "144",
        },
        saving: "180,00",
      },
      {
        title: t("autonomous"),
        features: [
          t("features_autonomous1"),
          t("features_autonomous2"),
          t("features_autonomous3"),
          t("features_autonomous4"),
          t("features_autonomous5"),
          t("features_autonomous6"),
          t("features_autonomous7"),
          t("features_autonomous8"),
          t("features_autonomous9"),
          t("features_autonomous10"),
        ],
        info: [t("info_plus1")],
        pricing: {
          monthly: "50",
          yearly: "480",
        },
        saving: "600,00",
      },
    ],
    Professional: [
      {
        title: t("professional"),
        features: [
          t("features_professional1"),
          t("features_professional2"),
          t("features_professional3"),
          t("features_professional4"),
          t("features_professional5"),
          t("features_professional6"),
          t("features_professional7"),
          t("features_professional8"),
          t("features_professional9"),
          t("features_professional10"),
        ],
        info: [t("info_pro1"), t("info_pro2")],
        pricing: {
          monthly: "70,00",
          yearly: "672",
        },
        saving: "840,00",
      },
      {
        title: t("business"),
        features: [
          t("features_business1"),
          t("features_business2"),
          t("features_business3"),
          t("features_business4"),
          t("features_business5"),
          t("features_business6"),
          t("features_business7"),
          t("features_business8"),
          t("features_business9"),
          t("features_business10"),
        ],
        info: [t("info_enterprise1"), t("info_enterprise2")],
        pricing: {
          monthly: "150",
          yearly: "1.440",
        },
        saving: "1.800,00",
      },
    ],
    Corporation: [
      {
        title: t("corporation"),
        features: [
          t("features_corporation1"),
          t("features_corporation2"),
          t("features_corporation3"),
          t("features_corporation4"),
          t("features_corporation5"),
          t("features_corporation6"),
          t("features_corporation7"),
          t("features_corporation8"),
          t("features_corporation9"),
          t("features_corporation10"),
        ],
        info: [t("info_enterprise1"), t("info_enterprise2")],
        pricing: {
          monthly: "500",
          yearly: "4.800",
        },
        saving: "6.000,00",
      },
      {
        title: t("personalized"),
        features: [
          t("features_personalized1"),
          t("features_personalized2"),
          t("features_personalized3"),
          t("features_personalized4"),
        ],
        info: [t("info_enterprise1"), t("info_enterprise2")],
        pricing: {
          monthly: "",
          yearly: "",
        },
        saving: "",
      },
    ],
    Partners: [
      {
        title: t("personalized"),
        features: [
          t("features_personalized1"),
          t("features_personalized2"),
          t("features_personalized3"),
          t("features_personalized4"),
        ],
        info: [t("info_enterprise1"), t("info_enterprise2")],
        pricing: {
          monthly: "",
          yearly: "",
        },
        saving: "",
      },
      {
        title: t("planReseller"),
        features: [
          t("features_planReseller1"),
          t("features_planReseller2"),
          t("features_planReseller3"),
          t("features_planReseller4"),
          t("features_planReseller5"),
          t("features_planReseller6"),
        ],
        info: [t("info_enterprise1"), t("info_enterprise2")],
        pricing: {
          monthly: "",
          yearly: "",
        },
        saving: "",
      },
    ],
  };

  return (
    <div className={styles.containerPlanSelector}>
      <div className={styles.planTypeSelector}>
        {planTypes.map((type) => (
          <button
            key={type.label}
            className={`${styles.planTypeButton} ${planType === type.key ? styles.active : ""}`}
            onClick={() => setPlanType(type.key)}
          >
            <span className={styles.planTypeLabel}>{type.label}</span>
            <div className={styles.quantity}>
              <span className={styles.planTypeIcon}>{type.icon}</span>
              {type.value && (
                <span className={styles.planTypeLabel}>{type.value}</span>
              )}
            </div>
          </button>
        ))}
      </div>
      {planType !== t('Partners') && (
        <div className={styles.planTypeSelector}>
          <button
            className={`${billingType === 'monthly' ? styles.activeBilling : ""} ${styles.planTypeButton} ${styles.planSelector}`}
            onClick={() => setBillingType('monthly')}
          >
            {t("monthly")}
            <div className={styles.quantity}>-20%</div>
          </button>
          <button
            className={`${billingType === 'yearly' ? styles.activeBilling : ""} ${styles.planTypeButton} ${styles.planSelector}`}
            onClick={() => setBillingType('yearly')}
          >
            {t("yearly")}
          </button>
        </div>
      )}

      <div className={styles.cardsContainer}>
        {plansByType[planType]?.map((plan, index) => (
          <div key={index} className={styles.card}>
            <h3>
              {plan.title.split(" ").length > 1 &&
              plan.title === t("planReseller") ? (
                <>
                  <span>{plan.title.split(" ")[0]}</span>{" "}
                  {plan.title.split(" ").slice(1).join(" ")}
                </>
              ) : (
                plan.title
              )}
            </h3>

            <ul className={styles.listFeatures}>
              {plan.features.map((feature, idx) => (
                <li key={idx}>
                  {plan.title !== t('personalized') ? (
                    <CheckCircleFeatures />
                  ) : (
                    <GreenCheck />
                  )}
                  {feature}
                </li>
              ))}
            </ul>
 
            {plan.title !== t('personalized') && plan.title !== t('planReseller') ? (
              <>
                <div className={styles.pricing}>
                  <p className={styles.price}>{plan.pricing[billingType]}€</p>{" "}
                  <span>{billingType === 'yearly' && `${plan.saving}€`}</span>
                </div>
                <a href="#" className={styles.hireButton}>
                  {t("hire")} <ArrowDiagonal />
                </a>
              </>
            ) : (
              <div className={styles.contactUsButton}>
                {t("contactUs")} <GrayDiagonalArrow />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanSelector;
