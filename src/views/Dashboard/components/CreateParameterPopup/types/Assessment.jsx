import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "../CreateParameterPopup.module.css";
import OptionsSwitchComponent from "../../OptionsSwichComponent/OptionsSwitchComponent";

const Star = ({ fill = "empty", onClick, onMouseMove, onMouseLeave }) => {
  const fillColor = fill === "full" ? "#f5c518" : fill === "half" ? "url(#halfGrad)" : "none";
  return (
    <svg
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      stroke="#f5c518"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: "pointer", marginRight: 4 }}
    >
      <defs>
        <linearGradient id="halfGrad">
          <stop offset="50%" stopColor="#f5c518" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points="12 2 15.09 8.26 22 9.27 
                17 14.14 18.18 21.02 
                12 17.77 5.82 21.02 
                7 14.14 2 9.27 8.91 8.26 12 2"
        fill={fillColor}
      />
    </svg>
  );
};

const Assessment = ({
  parameterData,
  setParameterData,
  handleChange,
  editingInput,
  setEditingInput,
  setShowAddTags,
}) => {
  const [t] = useTranslation("Contacts");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (parameterData?.assessment) {
      setRating(parameterData.assessment);
    }
  }, [parameterData]);

  const handleMouseMove = (event, index) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const percentage = x / width;
    const hoverValue = percentage <= 0.5 ? index - 0.5 : index;
    setHoverRating(hoverValue);
  };

  const handleClick = (event, index) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const percentage = x / width;
    const value = percentage <= 0.5 ? index - 0.5 : index;
    setRating(value);

    setParameterData((prev) => ({
      ...prev,
      assessment: value,
    }));
  };

  const getFill = (index) => {
    const active = hoverRating || rating;
    if (active >= index) return "full";
    if (active >= index - 0.5) return "half";
    return "empty";
  };

  return (
  <div>
      <div className={styles.assessmentContainer}>
      <p className={styles.textContent}>{t("assessment")}</p>
      {parameterData?.percentageBarOrStars ? (
      <div className={styles.assessmentContent}>
        ({rating})
        <div style={{ display: "flex", alignItems: "center" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              fill={getFill(i)}
              onClick={(e) => handleClick(e, i)}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
      </div>
      ) : (
      <div className={styles.percentageBar}>
        <div className={styles.bar}>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="50"
            className={styles.slider}
            onChange={(e) => {
              const value = e.target.value;
              const slider = e.target;
              const percentage = value + '%';
              slider.style.background = `linear-gradient(to right, #10A37F 0%, #10A37F ${percentage}, #d3d3d3 ${percentage}, #d3d3d3 100%)`;
            }}
          />
        </div>
    </div>
      )}
    </div>

    <div className={styles.switchContainer}>
      {!parameterData?.percentageBarOrStars && (
            <p>{t("percentageBar")}</p>

      )}
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"0"}
              blackBg={true}
              isChecked={parameterData?.percentageBarOrStars || false}
              setIsChecked={(value) => {
                console.log("value", value);
                handleChange({ name: "percentageBarOrStars", newValue: value });
              }}
            />
            {parameterData?.percentageBarOrStars && (
            <p>{t("Stars")}</p>
            )}
          </div>
          <div className={styles.switchContainer}>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"0"}
              blackBg={true}
              isChecked={parameterData?.allowedHalvesAndDecimals || false}
              setIsChecked={(value) => {
                console.log("value", value);
                handleChange({ name: "allowedHalvesAndDecimals", newValue: value });
              }}
            />
            <p>{t("allowedHalvesAndDecimals")}</p>
          </div>
  </div>
  );
};

export default Assessment;
