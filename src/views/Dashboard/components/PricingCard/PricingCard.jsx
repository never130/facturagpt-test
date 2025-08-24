import React, { useEffect, useRef, useState } from "react";
import styles from "./PricingCard.module.css";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

export const PricingCard = ({
  title,
  price,
  selectedCard,
  setSelectedCard,
  index,
  min,
  sliderValue,
  setSliderValue,
  setFacturasTotales,
  sliding,
  buyBtn = true,
  compareSelected = false,
  customStyles,
}) => {
  const { t } = useTranslation("pricingCard");
  const handleClick = () => {
    setSelectedCard(index);
    const validSlidingValue = Number(sliding);
    setSliderValue(min);
    if (!isNaN(validSlidingValue)) {
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`${styles.card} ${customStyles && styles.pricingPageCard} ${styles.cardsPricing} ${compareSelected ? (selectedCard === index ? `${styles.selectedCard} ` : "") : selectedCard ? styles.selectedCard : ""}`}
    >
      <div
        className={`${styles.cardHeader} ${compareSelected ? (selectedCard === index ? styles.selectedCardHeader : "") : selectedCard ? styles.selectedCardHeader : ""}`}
      >
        {title}
      </div>
      <div className={styles.cardBody}>
        {price == t('price1') && (<span className={styles.ThousandCharacters}>{t('50ThousandCharacters')}</span>)}
        <p
          className={`${styles.price} ${compareSelected ? (selectedCard === index ? styles.selectedPrice : "") : selectedCard ? styles.selectedPrice : ""}`}
        >
          {price}
          {price !== t('price1') && price !== t('price1') && "€"}
        </p>
        {price !== t('price1') && (
        <span className={styles.subText}>{t("perPages")}</span>
        )}
        {buyBtn && (
          <button
            className={`${styles.button} ${compareSelected ? (selectedCard === index ? styles.selectedButton : "") : selectedCard ? styles.selectedButton : ""}`}
          >
            {t("purchase")}
          </button>
        )}
      </div>
    </div>
  );
};

const PricingCards = ({
  facturasTotales,
  setSliderValue,
  sliderValue,
  setFacturasTotales,
}) => {
  const { t } = useTranslation("pricingCard");
  const [selectedCard, setSelectedCard] = useState(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const cardsData = [
    {
      title: t("title1"),
      price: t("price1"),
      min: 0,
      max: 640000,
      sliding: 0,
    },
    {
      title: t("title2"),
      price: t("price2"),
      min: 640000,
      max: 1099999,
      sliding: 640000,
    },
    {
      title: t("title3"),
      price: t("price3"),
      min: 1100000,
      max: 1599999,
      sliding: 1100000,
    },
    {
      title: t("title4"),
      price: t("price4"),
      min: 1600000,
      max: 2049999,
      sliding: 1600000,
    },
    {
      title: t("title5"),
      price: t("price5"),
      min: 2050000,
      max: 2499999,
      sliding: 2050000,
    },
    {
      title: t("title6"),
      price: t("price6"),
      min: 2500000,
      max: 2949999,
      sliding: 2500000,
    },
    {
      title: t("title7"),
      price: t("price7"),
      min: 2950000,
      max: 3449999,
      sliding: 2950000,
    },
    {
      title: t("title8"),
      price: t("price8"),
      min: 3450000,
      max: 3899999,
      sliding: 3450000,
    },
    {
      title: t("title9"),
      price: t("price9"),
      min: 3900000,
      max: 4369999,
      sliding: 3900000,
    },
    {
      title: t("title10"),
      price: t("price10"),
      min: 4370000,
      max: 4849999,
      sliding: 4370000,
    },
    {
      title: t("title11"),
      price: t("price11"),
      min: 4850000,
      max: 5000000,
      sliding: 4850000,
    },
  ];

  useEffect(() => {
    cardsData.forEach((card, index) => {
      if (sliderValue >= card.min && sliderValue <= card.max) {
        setSelectedCard(index);
      }
    });
  }, [sliderValue, cardsData]);

  useEffect(() => {
    if (containerRef.current && selectedCard !== null) {
      const selectedCardElement = containerRef.current.children[selectedCard];
      if (selectedCardElement) {
        containerRef.current.scrollTo({
          left:
            selectedCardElement.offsetLeft -
            containerRef.current.offsetWidth / 2.35,
          behavior: "smooth",
        });
      }
    }
  }, [selectedCard]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    setSelectedCard(0);
  }, []);

  return (
    <section
      className={`${styles.cardContainer} section`}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ overflowX: "auto", cursor: isDragging ? "grabbing" : "grab" }}
    >
      {cardsData.map((card, index) => (
        <PricingCard
          key={index}
          index={index}
          selectedCard={selectedCard === index}
          setSelectedCard={setSelectedCard}
          title={card.title}
          price={card.price}
          min={card.min}
          sliderValue={sliderValue}
          setFacturasTotales={setFacturasTotales}
          setSliderValue={setSliderValue}
          sliding={card.sliding}
          compareSelected={false}
        />
      ))}
    </section>
  );
};

export default PricingCards;
