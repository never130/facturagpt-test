import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import QRCodeStyling from 'qr-code-styling';
import styles from './QRCodePreview.module.css';
import companyLogo from '../../assets/factura-gpt-log.png';
import Dropdown from '../Dropdown/Dropdown';
import RemoveButton from '../../../components/shared/RemoveButton/RemoveButton';

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

const ecLevelMap = {
  'L - Low (7%)': 'L',
  'M - Medium (15%)': 'M',
  'Q - Quartile (25%)': 'Q',
  'H - High (30%)': 'H',
};
const ecLevelDisplayNames = Object.keys(ecLevelMap);

const findEcLevelDisplayName = (levelValue) => {
  for (const [name, value] of Object.entries(ecLevelMap)) {
    if (value === levelValue) {
      return name;
    }
  }
  return 'M - Medium (15%)';
};

const staticSavedStyles = [
  {
    id: 1,
    name: 'Default',
    preview: defaultQr,
    isSelected: false
  },
  {
    id: 2,
    name: 'Executive',
    preview: executiveQr,
    isSelected: true
  }
];

const QRCodePreview = ({ config, qrCodeRef, onConfigChange }) => {
  const qrContainerRef = useRef(null);
  const qrCodeObj = useRef(null);
  const [lightMode, setLightMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const {
    value,
    size = 256,
    bgColor = '#ffffff',
    fgColor = '#000000',
    ecLevel = 'M',
    logoImage,
    logoWidth = 60,
    logoHeight = 60,
    logoOpacity = 1,
    removeQrCodeBehindLogo = true,
    logoPadding = 0,
    qrStyle = 'squares',
    eyeRadius,
    eyeColor,
    dotShape = 'square',
    cornerShape = 'square',
  } = config;

  const displayValue =
    value && value.trim() !== '' ? value : 'https://example.com';

  React.useEffect(() => {
    const isLightMode = bgColor === '#ffffff' && fgColor === '#000000';
    const isDarkMode = bgColor === '#000000' && fgColor === '#ffffff';

    setLightMode(isLightMode);
    setDarkMode(isDarkMode);
  }, [bgColor, fgColor]);

  const handleEcLevelChange = (selectedDisplayName) => {
    const levelValue = ecLevelMap[selectedDisplayName];
    if (levelValue && onConfigChange) {
      onConfigChange({ ecLevel: levelValue });
    }
  };

  const handleLightModeToggle = () => {
    const newLightMode = !lightMode;
    setLightMode(newLightMode);

    if (newLightMode && onConfigChange) {
      onConfigChange({
        bgColor: '#ffffff',
        fgColor: '#000000'
      });
      if (darkMode) {
        setDarkMode(false);
      }
    }
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode && onConfigChange) {
      onConfigChange({
        bgColor: '#000000',
        fgColor: '#ffffff'
      });
      if (lightMode) {
        setLightMode(false);
      }
    }
  };

  const handleStyleDelete = (styleId) => {
  };

  const currentEcLevelName = findEcLevelDisplayName(ecLevel);

  useEffect(() => {
    if (!qrContainerRef.current) return;

    if (!qrCodeObj.current) {
      qrCodeObj.current = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: displayValue,
        dotsOptions: {
          color: fgColor,
          type: dotShape || (qrStyle === 'dots' ? 'dots' : 'square'),
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          color: eyeColor || fgColor,
          type: cornerShape || 'square',
        },
        cornersDotOptions: {
          color: eyeColor || fgColor,
          type: cornerShape || 'square',
        },
        qrOptions: {
          errorCorrectionLevel: ecLevel,
        },
        ...(logoImage && logoImage.trim() !== '' ? {
          image: logoImage,
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: logoPadding,
            imageSize: Math.max(0.1, Math.min(logoWidth / size, 0.4)),
            hideBackgroundDots: removeQrCodeBehindLogo,
            opacity: logoOpacity,
            position: 'center',
          },
        } : {}),
      });

      while (qrContainerRef.current.firstChild) {
        qrContainerRef.current.removeChild(qrContainerRef.current.firstChild);
      }

      qrCodeObj.current.append(qrContainerRef.current);
    } else {
      const hasLogo = logoImage && logoImage.trim() !== '';

      if (!hasLogo && qrCodeObj.current._options && qrCodeObj.current._options.image) {
        while (qrContainerRef.current.firstChild) {
          qrContainerRef.current.removeChild(qrContainerRef.current.firstChild);
        }

        qrCodeObj.current = new QRCodeStyling({
          width: size,
          height: size,
          type: 'svg',
          data: displayValue,
          dotsOptions: {
            color: fgColor,
            type: dotShape || (qrStyle === 'dots' ? 'dots' : 'square'),
          },
          backgroundOptions: {
            color: bgColor,
          },
          cornersSquareOptions: {
            color: eyeColor || fgColor,
            type: cornerShape || 'square',
          },
          cornersDotOptions: {
            color: eyeColor || fgColor,
            type: cornerShape || 'square',
          },
          qrOptions: {
            errorCorrectionLevel: ecLevel,
          },
        });

        qrCodeObj.current.append(qrContainerRef.current);
      } else {
        qrCodeObj.current.update({
          data: displayValue,
          width: size,
          height: size,
          dotsOptions: {
            color: fgColor,
            type: dotShape || (qrStyle === 'dots' ? 'dots' : 'square'),
          },
          backgroundOptions: {
            color: bgColor,
          },
          cornersSquareOptions: {
            color: eyeColor || fgColor,
            type: cornerShape || 'square',
          },
          cornersDotOptions: {
            color: eyeColor || fgColor,
            type: cornerShape || 'square',
          },
          qrOptions: {
            errorCorrectionLevel: ecLevel,
          },
          ...(hasLogo ? {
            image: logoImage,
            imageOptions: {
              crossOrigin: 'anonymous',
              margin: logoPadding,
              imageSize: Math.max(0.1, Math.min(logoWidth / size, 0.4)),
              hideBackgroundDots: removeQrCodeBehindLogo,
              opacity: logoOpacity,
              position: 'center',
            },
          } : {}),
        });
      }
    }
  }, [
    displayValue,
    size,
    bgColor,
    fgColor,
    ecLevel,
    logoImage,
    logoWidth,
    logoHeight,
    logoOpacity,
    removeQrCodeBehindLogo,
    logoPadding,
    qrStyle,
    eyeRadius,
    eyeColor,
    dotShape,
    cornerShape,
  ]);

  return (
    <div className={styles.qrCodePreviewContainer} ref={qrCodeRef}>
      <div className={styles.qrCodeWrapper} ref={qrContainerRef}></div>
      <div className={styles.savedStylesSection}>
        <div className={styles.addNewStyleButton}>
          <span className={styles.plusIcon}>+</span>
          <span className={styles.newStyleText}>Nuevo estilo</span>
        </div>

        <div className={styles.savedStylesGrid}>
          {staticSavedStyles.map((style) => (
            <div key={style.id} className={styles.savedStylePreviewContainer}>
              <img
                src={style.preview}
                alt={style.name}
                className={styles.savedStylePreview}
              />
              <RemoveButton
                onClick={() => handleStyleDelete(style.id)}
                className={`${styles.removeSavedStyleButton} ${style.isSelected ? styles.selectedRemoveButton : ''}`}
                title={`Remove ${style.name} style`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.modeToggleSection}>
        {lightMode ? (
          <div className={styles.modeToggleItem}>
            <span className={styles.modeLabel}>Light mode</span>
            <div
              className={`${styles.toggleSwitch} ${lightMode ? styles.toggleActive : ''}`}
              onClick={handleLightModeToggle}
            >
              <div className={styles.toggleSlider}></div>
            </div>
          </div>
        ) : (
          <div className={styles.modeToggleItem}>
            <span className={styles.modeLabel}>Dark mode</span>
            <div
              className={`${styles.toggleSwitch} ${darkMode ? styles.toggleActive : ''}`}
              onClick={handleDarkModeToggle}
            >
              <div className={styles.toggleSlider}></div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.errorCorrectionSection}>
        <h3 className={styles.sectionTitle}>Error Correction</h3>
        <div className={styles.errorCorrectionContent}>
          <Dropdown
            options={ecLevelDisplayNames}
            selectedOption={currentEcLevelName}
            onSelect={handleEcLevelChange}
          />
          <p className={styles.errorCorrectionDescription}>
            Higher correction allows for more damage to the QR code but reduces data capacity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodePreview;
