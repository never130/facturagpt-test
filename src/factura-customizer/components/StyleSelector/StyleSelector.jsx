import React from 'react';
import styles from './StyleSelector.module.css';
import {
  corporateQr,
  defaultQr,
  elegantQr,
  executiveQr,
  minimalQr,
  modernQr,
  neonQr,
  techwaveQr,
  vintageQr,
  abstractQr,
} from '../../assets';

const styleImages = {
  Default: defaultQr,
  Executive: executiveQr,
  Techwave: techwaveQr,
  'Elegant Gold': elegantQr,
  Minimalist: minimalQr,
  Corporate: corporateQr,
  Neon: neonQr,
  Vintage: vintageQr,
  'Modern Minimal': modernQr,
  Abstract: abstractQr,
};

const stylesData = [
  {
    name: 'Default',
    preview: defaultQr,
    qrStyle: 'squares',
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    eyeRadius: null,
    eyeColor: null,
    dotShape: 'square',
    cornerShape: 'square',
  },
  {
    name: 'Executive',
    preview: executiveQr,
    qrStyle: 'dots',
    fgColor: '#1A1A2E',
    bgColor: '#F8F9FA',
    eyeRadius: [6, 6, 6, 6],
    eyeColor: '#16213E',
    dotShape: 'dots',
    cornerShape: 'extra-rounded',
  },
  {
    name: 'Techwave',
    preview: techwaveQr,
    qrStyle: 'classy-rounded',
    fgColor: '#00D4FF',
    bgColor: '#0A0E27',
    eyeRadius: [12, 12, 12, 12],
    eyeColor: '#FF6B6B',
    dotShape: 'classy-rounded',
    cornerShape: 'extra-rounded',
  },
  {
    name: 'Elegant Gold',
    preview: elegantQr,
    qrStyle: 'rounded',
    fgColor: '#FFD700',
    bgColor: '#1C1C1C',
    eyeRadius: [8, 8, 8, 8],
    eyeColor: '#FFA500',
    dotShape: 'rounded',
    cornerShape: 'square',
  },
  {
    name: 'Minimalist',
    preview: minimalQr,
    qrStyle: 'extra-rounded',
    fgColor: '#6C757D',
    bgColor: '#FFFFFF',
    eyeRadius: [20, 20, 20, 20],
    eyeColor: '#495057',
    dotShape: 'extra-rounded',
    cornerShape: 'extra-rounded',
  },
  {
    name: 'Corporate',
    preview: corporateQr,
    qrStyle: 'classy',
    fgColor: '#2C3E50',
    bgColor: '#ECF0F1',
    eyeRadius: [4, 4, 4, 4],
    eyeColor: '#34495E',
    dotShape: 'classy',
    cornerShape: 'square',
  },
  {
    name: 'Neon',
    preview: neonQr,
    qrStyle: 'rounded',
    fgColor: '#39FF14',
    bgColor: '#000000',
    eyeRadius: [15, 15, 15, 15],
    eyeColor: '#FF073A',
    dotShape: 'rounded',
    cornerShape: 'extra-rounded',
  },
  {
    name: 'Vintage',
    preview: vintageQr,
    qrStyle: 'classy-rounded',
    fgColor: '#8B4513',
    bgColor: '#F5DEB3',
    eyeRadius: [10, 10, 10, 10],
    eyeColor: '#A0522D',
    dotShape: 'classy-rounded',
    cornerShape: 'dot',
  },
  {
    name: 'Modern Minimal',
    preview: modernQr,
    qrStyle: 'square',
    fgColor: '#212529',
    bgColor: '#F8F9FA',
    eyeRadius: [2, 2, 2, 2],
    eyeColor: '#495057',
    dotShape: 'square',
    cornerShape: 'dot',
  },
  
  {
    name: 'Abstract',
    preview: abstractQr,
    qrStyle: 'dots',
    fgColor: '#9C27B0',
    bgColor: '#E1F5FE',
    eyeRadius: [18, 18, 18, 18],
    eyeColor: '#673AB7',
    dotShape: 'dots',
    cornerShape: 'dot',
  },
];

const StyleSelector = ({ config, onConfigChange }) => {
  const selectedStyleName = config.qrStyleName || 'Default';

  const handleStyleSelect = (styleName) => {
    const selectedStyle = stylesData.find((style) => style.name === styleName);
    if (selectedStyle) {
      onConfigChange({
        qrStyle: selectedStyle.qrStyle,
        fgColor: selectedStyle.fgColor,
        bgColor: selectedStyle.bgColor,
        eyeRadius: selectedStyle.eyeRadius,
        eyeColor: selectedStyle.eyeColor,
        qrStyleName: styleName,
        dotShape: selectedStyle.dotShape,
        cornerShape: selectedStyle.cornerShape,
      });
    }
  };

  return (
    <div className={styles.styleSelector}>
      <div className={styles.selectedStyleDisplay}>
        <span className={styles.selectedStyleLabel}>
          Selected Style: <span className={styles.selectedStyleName}>{selectedStyleName}</span>
        </span>
      </div>
      <div className={styles.grid}>
        {stylesData.map((style) => (
          <div
            key={style.name}
            className={`${styles.styleItem} ${
              selectedStyleName === style.name ? styles.selected : ''
            }`}
            onClick={() => handleStyleSelect(style.name)}
            title={style.name}
          >
            <img
              src={styleImages[style.name]}
              alt={`${style.name} preview`}
              className={styles.previewImage}
            />
            <span className={styles.styleName}>{style.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
