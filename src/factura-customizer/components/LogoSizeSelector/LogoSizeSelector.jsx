import React from 'react';
import styles from './LogoSizeSelector.module.css';

const sizeMap = {
  XS: { width: 32, height: 32 },
  S: { width: 56, height: 56 },
  M: { width: 80, height: 80 },
  L: { width: 104, height: 104 },
  XL: { width: 128, height: 128 },
  XXL: { width: 152, height: 152 },
};

const sizes = Object.keys(sizeMap);

const findClosestSizeName = (currentWidth) => {
  let closest = 'M';
  let minDiff = Infinity;
  for (const [name, { width }] of Object.entries(sizeMap)) {
    const diff = Math.abs(width - currentWidth);
    if (diff < minDiff) {
      minDiff = diff;
      closest = name;
    }
  }
  return closest;
};

const LogoSizeSelector = ({ config, onConfigChange }) => {
  const selectedSize = findClosestSizeName(config.logoWidth || 60);

  const handleSelect = (size) => {
    const dims = sizeMap[size];
    if (dims) {
      onConfigChange({
        logoWidth: dims.width,
        logoHeight: dims.height,
      });
    }
  };

  return (
    <div className={styles.logoSizeSelector}>
      <label className={styles.label}>Logo Size</label>
      <div className={styles.sizeOptions}>
        {sizes.map((size) => (
          <button
            key={size}
            className={`${styles.sizeButton} ${
              selectedSize === size ? styles.selected : ''
            }`}
            onClick={() => handleSelect(size)}
            type="button"
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LogoSizeSelector;
