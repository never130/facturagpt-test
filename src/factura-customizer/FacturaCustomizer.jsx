import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './FacturaCustomizer.module.css';

import HeaderCard from '../views/Dashboard/components/HeaderCard/HeaderCard';
import Sidebar from './components/Sidebar/Sidebar';
import QRCodePreview from './components/QRCodePreview/QRCodePreview';
import SettingsPanel from './components/SettingsPanel/SettingsPanel';
import Button from '../views/Dashboard/components/Button/Button';

const initialQrConfig = {
  value: 'https://example.com',
  ecLevel: 'M',
  size: 220,
  quietZone: 10,
  bgColor: '#ffffff',
  fgColor: '#000000',
  logoImage: '',
  logoWidth: 60,
  logoHeight: 60,
  logoOpacity: 1,
  removeQrCodeBehindLogo: true,
  logoPadding: 0,
  qrStyle: 'squares',
  qrStyleName: 'Default',
  eyeRadius: null,
  eyeColor: '',
  dotShape: 'square',
  cornerShape: 'square',
};

const FacturaCustomizer = ({ initialConfig, onSave, onSelect, value, onClose }) => {
  const [qrConfig, setQrConfig] = useState({
    ...initialQrConfig,
    ...initialConfig,
    value: value || initialQrConfig.value,
    id: initialConfig?.id || `qr-${Date.now()}`
  }); const [activeSection, setActiveSection] = useState('QR Code Style');
  const qrCodeRef = useRef(null);
  const settingsPanelRef = useRef(null);
  const sectionRefs = useRef({
    'QR Code Style': React.createRef(),
    'Logo Settings': React.createRef(),
    'Color Palette': React.createRef(),
    'Advanced Style': React.createRef(),
  });

  const handleSave = useCallback(() => {
    onSave?.(qrConfig);
  }, [qrConfig, onSave]);

  const handleSelect = useCallback(() => {
    onSelect?.(qrConfig);
  }, [qrConfig, onSelect]);

  const handleConfigChange = useCallback((newConfig) => {
    setQrConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  }, []);

  const handleValueChange = useCallback(
    (event) => {
      handleConfigChange({ value: event.target.value });
    },
    [handleConfigChange]
  );

  const handleLogoChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          handleConfigChange({ logoImage: reader.result });
        };
        reader.readAsDataURL(file);
      }
    },
    [handleConfigChange]
  );

  const handleDownload = useCallback(() => {
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (svgElement) {
        try {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8',
          });
          const svgUrl = URL.createObjectURL(svgBlob);

          const img = new Image();
          img.onload = () => {
            const desiredSize = 1024;
            const canvas = document.createElement('canvas');
            canvas.width = desiredSize;
            canvas.height = desiredSize;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = qrConfig.bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, 0, 0, desiredSize, desiredSize);

            canvas.toBlob((blob) => {
              const url = URL.createObjectURL(blob);
              const downloadLink = document.createElement('a');
              downloadLink.download = 'qrcode.png';
              downloadLink.href = url;
              downloadLink.click();

              setTimeout(() => {
                URL.revokeObjectURL(url);
                URL.revokeObjectURL(svgUrl);
              }, 1000);
            }, 'image/png');
          };

          img.src = svgUrl;
        } catch (error) {
          console.error('Error generating QR code download:', error);
          alert('Failed to generate QR code download: ' + error.message);
        }
      } else {
        console.error(
          'Could not find SVG element within the QR code component.'
        );
        alert('Failed to initiate download. Could not find SVG element.');
      }
    } else {
      console.error('QR Code reference is not available.');
      alert('Failed to initiate download. QR Code reference not found.');
    }
  }, [qrConfig.bgColor, qrCodeRef]); const handleSectionChange = useCallback((section) => {
    setActiveSection(section);

    const sectionIdMap = {
      'QR Code Style': 'qr-code-style',
      'Logo Settings': 'logo-settings',
      'Color Palette': 'color-palette',
      'Advanced Style': 'advanced-style',
    };

    const sectionId = sectionIdMap[section];
    if (sectionId && settingsPanelRef.current) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const container = settingsPanelRef.current;
          const elementRect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          const targetPosition = element.offsetTop - 30;
          const startPosition = container.scrollTop;
          const distance = targetPosition - startPosition;

          let startTime = null;
          const duration = 500;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeInOutQuad = progress =>
              progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            container.scrollTop = startPosition + distance * easeInOutQuad(progress);

            if (elapsed < duration) {
              window.requestAnimationFrame(step);
            }
          }

          window.requestAnimationFrame(step);
        }
      }, 100);
    }
  }, [settingsPanelRef]);
  useEffect(() => {
    const handleScroll = () => {
      if (!settingsPanelRef.current) return;

      const sections = [
        document.getElementById('qr-code-style'),
        document.getElementById('logo-settings'),
      ].filter(Boolean);

      if (sections.length === 0) return;

      const sectionNameMap = {
        'qr-code-style': 'QR Code Style',
        'logo-settings': 'Logo Settings',
      };

      const container = settingsPanelRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const containerTop = container.getBoundingClientRect().top;

      let mostVisibleSection = null;
      let maxVisibleHeight = -1;

      sections.forEach(section => {
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top - containerTop;
        const sectionHeight = rect.height;

        const visibleTop = Math.max(0, sectionTop);
        const visibleBottom = Math.min(sectionTop + sectionHeight, containerHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (sectionTop <= 0 && -sectionTop < containerHeight / 2) {
          const adjustedVisibility = visibleHeight + (1 - Math.abs(sectionTop / 200));

          if (adjustedVisibility > maxVisibleHeight) {
            maxVisibleHeight = adjustedVisibility;
            mostVisibleSection = section;
          }
        }
        else if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          mostVisibleSection = section;
        }
      });

      if (mostVisibleSection && sectionNameMap[mostVisibleSection.id] &&
        sectionNameMap[mostVisibleSection.id] !== activeSection) {
        setActiveSection(sectionNameMap[mostVisibleSection.id]);
      }
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    const settingsPanel = settingsPanelRef.current;
    if (settingsPanel) {
      settingsPanel.addEventListener('scroll', throttledHandleScroll, { passive: true });

      setTimeout(handleScroll, 200);
    }

    return () => {
      if (settingsPanel) {
        settingsPanel.removeEventListener('scroll', throttledHandleScroll);
      }
    };
  }, [activeSection, settingsPanelRef]);

  return (
    <div className={styles.appContainer}>
      <HeaderCard
        title="QR"
        setState={onClose}
        headerStyle={{
          padding: '10px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        <div className={styles.actions}>          <Button
          type="white"
          action={onClose}
          title="Cancel customization"
          headerStyle={{
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px 16px'
          }}
        >
          Cancel
        </Button>          <Button
          type="green"
          action={handleSave}
          title="Save this QR style for future use"
        >
            Save
          </Button>
          <Button
            type="green"
            action={handleSelect}
            title="Apply this QR style to the current document"
          >
            Apply Style
          </Button>
        </div>
      </HeaderCard>
      <div className={styles.mainContent}>
        <div className={styles.contentArea}>
          <div className={styles.previewColumn}>
            <QRCodePreview config={qrConfig} qrCodeRef={qrCodeRef} onConfigChange={handleConfigChange} />
          </div>

          <SettingsPanel
            config={qrConfig}
            activeSection={activeSection}
            onConfigChange={handleConfigChange}
            onValueChange={handleValueChange} 
            onLogoChange={handleLogoChange}
            onDownload={handleDownload}
            settingsPanelRef={settingsPanelRef}
          />
        </div>
      </div>
    </div>
  );
};

export default FacturaCustomizer;
