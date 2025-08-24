import React, { useState, useRef, useEffect } from "react";
import styles from "./Carousel.module.css";
import { FaStar } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import rightTicks from "../../assets/rightTicks.svg";
import icon1 from "../../assets/reviewIcon1.svg";
import icon2 from "../../assets/reviewIcon2.svg";
import icon3 from "../../assets/reviewIcon3.svg";
import icon4 from "../../assets/reviewIcon4.svg";
import { useTranslation } from "react-i18next";
const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const cardsRef = useRef();
  const { t } = useTranslation("Landing");

  const specificId = localStorage.getItem("translationId");
  const imageVariants = {
    facturagpt: [icon1, icon2, icon3, icon4],
    edugpt: [icon3, icon4, icon1, icon2],
    autogpt: [icon2, icon3, icon4, icon1],
    clinicgpt: [icon1, icon2, icon3, icon4],
    
  };
  
const selectedImages = imageVariants[specificId] || imageVariants["facturagpt"]; 
 const reviews = [
  {
    id: 1,
    name: 'Logística Hernández',
    stars: 5,
    text: t("logisticaHernandezReview"),
    img: selectedImages[0],
    work:t('logisticaHernandezWork')
  },
  {
    id: 2,
    name: 'ReformasObraNuevaJLM',
    stars: 5,
    text: t('ReformasObraNuevaJLMReview'),
    img: selectedImages[1],
    work:t('ReformasObraNuevaJLMWork')
  },
  {
    id: 3,
    name: t("Montlaw"),
    stars: 5,
    text: t("MontlawReview"),
    img: selectedImages[2],
    work:t('MontlawWork')
  },
  {
    id: 4,
    name: 'Marketia',
    stars: 5,
    text: t("MarketiaReview"),
    img: selectedImages[3],
    work:t('MarketiaWork')
  },
  {
    id: 5,
    name: 'Yöu People',
    stars: 5,
    text: t("youPeopleReview"),
    img: selectedImages[0],
    work:t('youPeopleWork')
  }
];

  const updateIsMobile = () => {
    setIsMobile(window.innerWidth < 900);
  };

  useEffect(() => {
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const transitionEnd = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(transitionEnd);
  }, [currentIndex]);

  const translateX = isMobile
    ? -currentIndex * 85
    : -(currentIndex - 1) * (100 / 3);

  return (
    <div className={styles.reviewContainer} initial="hidden" animate="visible">
      <div className={styles.carousel}>
        <div
          className={styles.cardsContainer}
          ref={cardsRef}
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isAnimating ? "transform 0.5s ease-in-out" : "none",
          }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className={`${styles.card} ${
                index === currentIndex ? styles.activeCard : ""
              }`}
            >
              <p className={styles.text}>{review.text}</p>
              <div className={styles.cardContent}>
                <div className={styles.clientName}>
                  <img src={review.img} alt="" />
                  <div>
                    <h3 className={styles.clientName}>{review.name}</h3>
                    <div className={styles.stars}>
                      {Array(review.stars)
                        .fill(0)
                        .map((_, i) => (
                          <FaStar key={i} />
                        ))}
                    </div>
                  </div>
                </div>
                <img src={rightTicks} alt="rightTicks" />
              </div>
              <span className={styles.work}>{review?.work}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.controls}>
        <button className={styles.controlButton} onClick={handlePrev}>
          <FaArrowLeft />
        </button>
        <button className={styles.controlButton} onClick={handleNext}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
