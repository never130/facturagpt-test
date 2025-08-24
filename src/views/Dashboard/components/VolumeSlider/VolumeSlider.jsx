import React, { useEffect, useState } from "react";
import styles from "./VolumeSlider.module.css";

export const MinimalistVolumeSlider = ({ value = 50, onChange }) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (val) => {
    setInternalValue(val);
    onChange?.(val);
  };

  return (
    <div className={styles.volumeSliderContainerMinimal}>
      <div className={styles.sliderContainerMinimal}>
        <div className={styles.sliderLineMinimal} />
        <div
          className={styles.sliderActiveLineMinimal}
          style={{
            width: `${Math.abs(internalValue - 50)}%`,
            left: `${internalValue > 50 ? 50 : internalValue}%`,
          }}
        />
        <div
          className={styles.sliderIndicatorMinimal}
          style={{ left: `${internalValue}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={internalValue}
          onChange={(e) => handleChange(Number(e.target.value))}
          className={styles.nativeSliderMinimal}
        />
      </div>
    </div>
  );
};

const VolumeSlider = ({ value, onChange }) => {
    return (
        <div className={styles.volumeSliderContainer}>
            <div className={styles.sliderContainer}>
                <div
                    className={styles.sliderBackground}
                    style={{ width: `${value}%` }}
                ></div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={styles.volumeSlider}
                />
            </div>
        </div>
    );
};

export default VolumeSlider;
