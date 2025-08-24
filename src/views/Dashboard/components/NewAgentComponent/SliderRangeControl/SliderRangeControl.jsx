import React from "react";
import styles from "./SliderRangeControl.module.css";
import VolumeSlider, { MinimalistVolumeSlider } from "../../VolumeSlider/VolumeSlider";
import Button from "../../Button/Button";

const valueToPercentage = (value, min, max) =>
  ((value - min) / (max - min)) * 100;

const percentageToValue = (percentage, min, max) =>
  Math.round(min + (percentage / 100) * (max - min));


export const SliderRangeControlWithoutButtons = ({
  subtitle = "Subtítulo",
  desc,
  fieldName = "tone",
  value = 50,
  onChange,
  leftButtonText = "Menor",
  rightButtonText = "Mayor",
  LeftIcon = null,
  RightIcon = null,
  min = 1,
  max = 5,
}) => {
  const currentValue = value || min;
  const handleChange = (newValue) => {
    onChange({ name: fieldName, newValue });
  };

  return (
    <div className={styles.MinimalistVolumeSliderContainer}>
      
      <div>
        <p>{subtitle}</p>
        <span>{desc}</span>
      </div>
      <MinimalistVolumeSlider  value={currentValue}
            onChange={(percentage) =>
              handleChange(percentage)
            }/>
    </div>
  )
}


const SliderRangeControl = ({
  subtitle = "Subtítulo",
  fieldName = "tone",
  value = 1,
  onChange,
  leftButtonText = "Menor",
  rightButtonText = "Mayor",
  LeftIcon = null,
  RightIcon = null,
  min = 1,
  max = 5,
}) => {
  const currentValue = value || min;

  const handleChange = (newValue) => {
    onChange({ name: fieldName, newValue });
  };

  return (
    <div>
      <p className={styles.subTitle}>{subtitle} (1-5)</p>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Button
          action={() =>
            handleChange(Math.max(min, currentValue - 1))
          }
          type="border"
          headerStyle={{
            flexBasis: "120px",
            flexShrink: 0,
            fontSize: "12px",
          }}
        >
          {LeftIcon && <LeftIcon />} {leftButtonText}
        </Button>

        <div style={{ flex: 1, height: "20px" }}>
          <VolumeSlider
            value={valueToPercentage(currentValue, min, max)}
            onChange={(percentage) =>
              handleChange(percentageToValue(percentage, min, max))
            }
          />
        </div>

        <Button
          action={() =>
            handleChange(Math.min(max, currentValue + 1))
          }
          type="border"
          headerStyle={{
            flexBasis: "120px",
            flexShrink: 0,
            fontSize: "12px",
          }}
        >
          {RightIcon && <RightIcon />} {rightButtonText}
        </Button>
      </div>
    </div>
  );
};

export default SliderRangeControl;
