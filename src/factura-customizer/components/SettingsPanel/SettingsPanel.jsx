import React from 'react';
import styles from './SettingsPanel.module.css';
import Section from '../Section/Section';
import StyleSelector from '../StyleSelector/StyleSelector';
import DotsShape from '../DotsShape/DotsShape';
import CornersStyle from '../CornersStyle/CornersStyle';
import ColorSettings from '../ColorSettings/ColorSettings';
import LogoSettings from './LogoSettings';
import ColorPaletteSelector from '../ColorPaletteSelector/ColorPaletteSelector';
import AdvancedOptions from '../AdvancedOptions/AdvancedOptions';
import Button from '../Button/Button';

const SettingsPanel = ({
  config,
  activeSection,
  onConfigChange,
  onLogoChange,
  onDownload,
  settingsPanelRef,
}) => {  return (
    <div className={styles.settingsPanelWrapper}>
      <div ref={settingsPanelRef} className={styles.settingsPanel}>
        <Section
          id='qr-code-style'
          title='QR Code Style'
          className={`${styles.qrStyleSection} ${
            activeSection === 'QR Code Style' ? styles.activeSection : ''
          }`}
        >
        <StyleSelector config={config} onConfigChange={onConfigChange} />
        <DotsShape config={config} onConfigChange={onConfigChange} />
        <CornersStyle config={config} onConfigChange={onConfigChange} />
        <ColorSettings config={config} onConfigChange={onConfigChange} />
      </Section>

      <Section
        id='logo-settings'
        title='Logo Settings'
        className={`${styles.logoSection} ${
          activeSection === 'Logo Settings' ? styles.activeSection : ''
        }`}
      >
        <LogoSettings
          config={config}
          onConfigChange={onConfigChange}
          onLogoChange={onLogoChange}
        />
      </Section>
      </div>
    </div>
  );
};

export default SettingsPanel;
