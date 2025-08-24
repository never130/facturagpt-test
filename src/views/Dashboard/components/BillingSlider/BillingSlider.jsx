import React, { useEffect, useState } from "react";
import styles from "./BillingSlider.module.css";
import star from "../../assets/star.svg";
import { useTranslation } from "react-i18next";

const BillingSlider = ({ sliderValue, setSliderValue,additionalInfo, setAdditionalInfo,displayValue, setDisplayValue }) => {
  const { t } = useTranslation("billingSlider");

  const calculateProgress = () => {
    const min = 0;
    const max = 100000;
    return ((sliderValue - min) / (max - min)) * 100; 
  };

  const marks = [
    { value: 1000, label: `${t("until")} 20`, position: "5%" }, 
    { value: 500000, label: "+20", position: "14%" }, 
    { value: 1000000, label: "+200", position: "23%" }, 
    { value: 1500000, label: "+500", position: "32%" }, 
    { value: 2000000, label: "+1K", position: "41%" }, 
    { value: 2500000, label: "2K", position: "50%" }, 
    { value: 3000000, label: "5K", position: "59%" }, 
    { value: 3500000, label: "+10K", position: "68%" }, 
    { value: 4000000, label: "+20K", position: "77%" }, 
    { value: 4500000, label: "+50K", position: "86%" }, 
    { value: 5000000, label: "+100K", position: "95%" }, 
  ];


  
  
  useEffect(() => {
    setAdditionalInfo(t("free"));
  }, [t]); 
  
  const getDisplayValues = (value) => {
    let newDisplayValue = "";
    let newAdditionalInfo = "";

    switch (true) {
      case value <= 2500:
        newDisplayValue = "0’00€";
        newAdditionalInfo = t('free');
        break;
      case value <= 12799:
        newDisplayValue = "4€";
        newAdditionalInfo = "0,20€";
        break;
      case value <= 22099:
        newDisplayValue = "38€";
        newAdditionalInfo = "0,19€";
        break;
      case value <= 31699:
        newDisplayValue = "92€";
        newAdditionalInfo = "0,18€";
        break;
      case value <= 41099:
        newDisplayValue = "172€";
        newAdditionalInfo = "0,16€";
        break;
      case value <= 49999:
        newDisplayValue = "322€";
        newAdditionalInfo = "0,15€";
        break;
      case value <= 59999:
        newDisplayValue = "712€";
        newAdditionalInfo = "0,13€";
        break;
      case value <= 68599:
        newDisplayValue = "1312€";
        newAdditionalInfo = "0,12€";
        break;
      case value <= 77999:
        newDisplayValue = "2412€";
        newAdditionalInfo = "0,11€";
        break;
      case value <= 86999:
        newDisplayValue = "5112€";
        newAdditionalInfo = "0,09€";
        break;
      case value <= 96599:
        newDisplayValue = "7612€";
        newAdditionalInfo = "0,05€";
        break;
      case value <= 100000:
        newDisplayValue = t('evenMore');
        newAdditionalInfo = t('contactSales');
        break;
      default:
        newDisplayValue = "0,00€";
        newAdditionalInfo = t('free');
    }
    
    if (
      newDisplayValue !== displayValue ||
      newAdditionalInfo !== additionalInfo
    ) {
      setDisplayValue(newDisplayValue);
      setAdditionalInfo(newAdditionalInfo);
    }
  };

  useEffect(() => {
    getDisplayValues(sliderValue);
  }, [sliderValue]);



  const handleChange = (event) => {
    setSliderValue(event.target.value);
    getDisplayValues(event.target.value); 
  };

  return (
    <div className={styles.container}>

      <div className={styles.sliderWrapper}>
 
        <input
          type="range"
          min="0"
          max="100000"
          value={sliderValue}
          onChange={handleChange}
          className={styles.slider}
          style={{
            background: `linear-gradient(to right, #16c098 ${calculateProgress()}%, rgba(91, 123, 253, 0.15) ${calculateProgress()}%)`,
          }}
        />
        <div className={styles.labels}>
          {marks.map((mark) => (
            <div
              key={mark.value}
              className={styles.mark}
              style={{ left: mark.position }}
            >
              <span className={styles.label}>{mark.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BillingSlider;
