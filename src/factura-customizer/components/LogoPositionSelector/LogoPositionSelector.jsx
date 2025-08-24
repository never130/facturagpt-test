import React from 'react';
import styles from './LogoPositionSelector.module.css';
import {hideDots,
  showDots,
  smallMargin,
  largeMargin,
  mediumMargin,
  showThrough} from '../../assets';

const LogoPositionSelector = ({ config, onConfigChange }) => {
  const getPositionConfig = (positionName) => {
    switch (positionName) {
      case 'Centered (Hide Dots)':
        return {
          logoPadding: 0,
          removeQrCodeBehindLogo: true,
        };
      case 'Centered (Show Dots)':
        return {
          logoPadding: 0,
          removeQrCodeBehindLogo: false,
        };
      case 'Small Margin':
        return {
          logoPadding: 3,
          removeQrCodeBehindLogo: true,
          logoWidth: Math.max(65, config.logoWidth || 60), 
          logoHeight: Math.max(65, config.logoHeight || 60),
        };
      case 'Medium Margin':
        return {
          logoPadding: 6,
          removeQrCodeBehindLogo: true,
          logoWidth: Math.max(72, config.logoWidth || 60), 
          logoHeight: Math.max(72, config.logoHeight || 60),
        };
      case 'Large Margin':
        return {
          logoPadding: 10,
          removeQrCodeBehindLogo: true,
          logoWidth: Math.max(80, config.logoWidth || 60), 
          logoHeight: Math.max(80, config.logoHeight || 60),
        };
      case 'Overlay (Show Through)':
        return {
          logoPadding: 0,
          removeQrCodeBehindLogo: false,
          logoOpacity: 0.8, 
        };
      default:
        return {
          logoPadding: 0,
          removeQrCodeBehindLogo: true,
        };
    }
  };

  const getCurrentPosition = () => {
    const { logoPadding = 0, removeQrCodeBehindLogo = true, logoOpacity = 1, logoWidth = 60, logoHeight = 60 } = config;
    
    if (logoPadding === 0 && removeQrCodeBehindLogo && logoOpacity === 1 && logoWidth <= 60) {
      return 'Centered (Hide Dots)';
    } else if (logoPadding === 0 && !removeQrCodeBehindLogo && logoOpacity === 1 && logoWidth <= 60) {
      return 'Centered (Show Dots)';
    } else if (logoPadding === 3 && removeQrCodeBehindLogo && logoWidth >= 65) {
      return 'Small Margin';
    } else if (logoPadding === 6 && removeQrCodeBehindLogo && logoWidth >= 72) {
      return 'Medium Margin';
    } else if (logoPadding === 10 && removeQrCodeBehindLogo && logoWidth >= 80) {
      return 'Large Margin';
    } else if (logoPadding === 0 && !removeQrCodeBehindLogo && logoOpacity < 1) {
      return 'Overlay (Show Through)';
    }
    
    return 'Centered (Hide Dots)'; 
  };

  const selectedPosition = getCurrentPosition();

  const positions = [
    { name: 'Centered (Hide Dots)', icon: hideDots },
    { name: 'Centered (Show Dots)', icon: showDots },
    { name: 'Small Margin', icon: smallMargin },
    { name: 'Medium Margin', icon: mediumMargin },
    { name: 'Large Margin', icon: largeMargin },
    { name: 'Overlay (Show Through)', icon: showThrough },
  ];

  const handlePositionSelect = (positionName) => {
    const newConfig = getPositionConfig(positionName);
    onConfigChange(newConfig);
  };

  const currentSelectedVisual = selectedPosition;

  return (
    <div className={styles.logoPositionSelector}>
      <label className={styles.label}>Logo Position</label>
      <div className={styles.grid}>
        {positions.map((position) => (
          <div
            key={position.name}
            className={`${styles.positionItem} ${
              currentSelectedVisual === position.name ? styles.selected : ''
            }`}
            onClick={() => handlePositionSelect(position.name)}
            title={position.name}
          >
            <img 
              src={position.icon} 
              alt={position.name}
              className={styles.positionIcon}
            />
            <span className={styles.positionName}>{position.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoPositionSelector;
