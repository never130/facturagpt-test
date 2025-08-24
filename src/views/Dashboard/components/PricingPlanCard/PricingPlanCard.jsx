import React from "react";
import styles from "./PricingPlanCard.module.css";
import tick from "../../assets/pricingCardTick.svg";
import { useNavigate } from "react-router-dom";
const PricingPlanCard = ({
  title,
  price,
  features,
  priceTag,
  sliderValue,
  documentos,
}) => {
  const navigate = useNavigate();
  const getDocumentPrice = () => {
    if (sliderValue <= 9000) return 0;
    if (sliderValue <= 19000) return 0.2;
    if (sliderValue <= 29000) return 0.19;
    if (sliderValue <= 39000) return 0.18;
    if (sliderValue <= 49000) return 0.16;
    if (sliderValue <= 59000) return 0.15;
    if (sliderValue <= 69000) return 0.13;
    if (sliderValue <= 79000) return 0.12;
    if (sliderValue <= 89000) return 0.11;
    if (sliderValue <= 94000) return 0.09;
    if (sliderValue <= 99000) return 0.05;
    return 0.05;
  };
  const documentPrice = getDocumentPrice();
  const calculatePrice = () => {
    if (sliderValue == 100) return "¿Aún más?";
    if (sliderValue <= 9000) return 0;
    if (sliderValue <= 19000) return "4";
    if (sliderValue <= 29000) return "38";
    if (sliderValue <= 39000) return "92";
    if (sliderValue <= 49000) return "172";
    if (sliderValue <= 59000) return "322";
    if (sliderValue <= 69000) return "712";
    if (sliderValue <= 79000) return "1.312";
    if (sliderValue <= 89000) return "2.412";
    if (sliderValue <= 94000) return "5.112";
    if (sliderValue <= 99000) return "7.612";
    return price;
  };

  const calculatedPrice = calculatePrice();

  return (
    <div className={styles.pricingCardContainer}>
      <div className={styles.pricingBox}>
        <p className={styles.price}>
          <strong>
            {calculatedPrice === "¿Aún más?"
              ? calculatedPrice
              : `${calculatedPrice}€`}{" "}
          </strong>
          {calculatedPrice !== "¿Aún más?" && (
            <span className={styles.perMonth}>/mes</span>
          )}
        </p>
        {priceTag && <span className={styles.priceTag}>{priceTag}</span>}
        {sliderValue > 9 && sliderValue <= 99000 && (
          <p className={styles.docPrice}>
            {getDocumentPrice().toFixed(2)}€ por documento
          </p>
        )}
      </div>
      <div className={styles.planDetails}>
        {title !== "¿Aún más?" ? (
          <h2 className={styles.planTitle}>
            Plan <strong>{title}</strong>
          </h2>
        ) : (
          ""
        )}
        <ul className={styles.featuresList}>
          {features.map((feature, index) => (
            <li key={index} className={styles.featureItem}>
              <img src={tick} alt="tick" />
              {feature}
            </li>
          ))}
        </ul>
        <button
          className={styles.button}
          onClick={() => navigate("/freetrial")}
        >
          Comience su prueba gratuita
        </button>
      </div>
    </div>
  );
};

export default PricingPlanCard;
