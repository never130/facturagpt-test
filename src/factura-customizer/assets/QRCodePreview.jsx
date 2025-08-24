import React, { useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import QRCodeStyling from 'qr-code-styling';
import styles from './QRCodePreview.module.css';
import companyLogo from '../assets/factura-gpt-log.png';
import ActiveStyleTag from './ActiveStyleTag';

const QRCodePreview = ({ config, qrCodeRef, onRemoveStyle }) => {
  const qrContainerRef = useRef(null);
  const qrCodeObj = useRef(null);

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
    qrStyleName,
  } = config;

  const displayValue =
    value && value.trim() !== '' ? value : 'https://example.com';

  useEffect(() => {
    const effectiveLogoImage =
      logoImage === undefined ? companyLogo : logoImage;

    if (!qrContainerRef.current) return;

    if (!qrCodeObj.current) {
      qrCodeObj.current = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: displayValue,
        dotsOptions: {
          color: fgColor,
          type: qrStyle === 'dots' ? 'dots' : 'square',
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          color: eyeColor || fgColor,
          type: eyeRadius ? 'extra-rounded' : 'square',
        },
        cornersDotOptions: {
          color: eyeColor || fgColor,
          type: eyeRadius ? 'dot' : 'square',
        },
        qrOptions: {
          errorCorrectionLevel: ecLevel,
        },
        ...(effectiveLogoImage
          ? {
              image: effectiveLogoImage,
              imageOptions: {
                margin: logoPadding,
                imageSize: Math.max(0.1, Math.min(logoWidth / size, 0.4)),
                hideBackgroundDots: removeQrCodeBehindLogo,
                opacity: logoOpacity,
              },
            }
          : {}),
      });

      while (qrContainerRef.current.firstChild) {
        qrContainerRef.current.removeChild(qrContainerRef.current.firstChild);
      }

      qrCodeObj.current.append(qrContainerRef.current);
    } else {
      qrCodeObj.current.update({
        data: displayValue,
        width: size,
        height: size,
        dotsOptions: {
          color: fgColor,
          type: qrStyle === 'dots' ? 'dots' : 'square',
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          color: eyeColor || fgColor,
          type: eyeRadius ? 'extra-rounded' : 'square',
        },
        cornersDotOptions: {
          color: eyeColor || fgColor,
          type: eyeRadius ? 'dot' : 'square',
        },
        qrOptions: {
          errorCorrectionLevel: ecLevel,
        },
        ...(effectiveLogoImage
          ? {
              image: effectiveLogoImage,
              imageOptions: {
                margin: logoPadding,
                imageSize: Math.max(0.1, Math.min(logoWidth / size, 0.4)),
                hideBackgroundDots: removeQrCodeBehindLogo,
                opacity: logoOpacity,
              },
            }
          : { image: null }),
      });
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
  ]);

  const baseDefaults = {
    qrStyleName: 'Default',
    fgColor: '#000000',
    bgColor: '#ffffff',
    eyeColor: null,
    eyeRadius: null,
    ecLevel: 'M',
  };

  return (
    <div className={styles.qrCodePreviewContainer} ref={qrCodeRef}>
      <div className={styles.qrCodeWrapper} ref={qrContainerRef}></div>
      {onRemoveStyle && (
        <div className={styles.activeStylesContainer}>
          {qrStyleName && qrStyleName !== baseDefaults.qrStyleName && (
            <ActiveStyleTag
              label={`Style: ${qrStyleName}`}
              onRemove={() => onRemoveStyle('qrStyleName')}
            />
          )}
          {logoImage && (
            <ActiveStyleTag
              label={
                logoImage === companyLogo ? 'Logo: Default' : 'Logo: Custom'
              }
              onRemove={() => onRemoveStyle('logo')}
            />
          )}
          {fgColor !== baseDefaults.fgColor && (
            <ActiveStyleTag
              label={`Foreground: ${fgColor}`}
              onRemove={() => onRemoveStyle('fgColor')}
            />
          )}
          {bgColor !== baseDefaults.bgColor && (
            <ActiveStyleTag
              label={`Background: ${bgColor}`}
              onRemove={() => onRemoveStyle('bgColor')}
            />
          )}
          {eyeColor && eyeColor !== baseDefaults.eyeColor && (
            <ActiveStyleTag
              label={`Eye Color: ${eyeColor}`}
              onRemove={() => onRemoveStyle('eyeColor')}
            />
          )}
          {eyeRadius && eyeRadius !== baseDefaults.eyeRadius && (
            <ActiveStyleTag
              label={`Eye Shape: Rounded`}
              onRemove={() => onRemoveStyle('eyeRadius')}
            />
          )}
          {ecLevel !== baseDefaults.ecLevel && (
            <ActiveStyleTag
              label={`EC Level: ${ecLevel}`}
              onRemove={() => onRemoveStyle('ecLevel')}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodePreview;
