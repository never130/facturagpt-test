import React from 'react';
import styles from './ColorSettings.module.css';

const ColorSettings = ({ config, onConfigChange }) => {
  const handleColorChange = (colorType, value) => {
    const colorMap = {
      dots: 'fgColor',
      corners: 'eyeColor',
      background: 'bgColor'
    };
    
    onConfigChange({ [colorMap[colorType]]: value });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Color</h3>
      
      <div className={styles.colorGroup}>
        <label className={styles.label}>Dots</label>
        <div className={styles.colorInputWrapper}>
          <input
            type="color"
            value={config.fgColor || '#000000'}
            onChange={(e) => handleColorChange('dots', e.target.value)}
            className={styles.colorInput}
          />
          <input
            type="text"
            value={config.fgColor || '#000000'}
            onChange={(e) => handleColorChange('dots', e.target.value)}
            className={styles.hexInput}
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      <div className={styles.colorGroup}>
        <label className={styles.label}>Corners</label>
        <div className={styles.colorInputWrapper}>
          <input
            type="color"
            value={config.eyeColor || config.fgColor || '#000000'}
            onChange={(e) => handleColorChange('corners', e.target.value)}
            className={styles.colorInput}
          />
          <input
            type="text"
            value={config.eyeColor || config.fgColor || '#000000'}
            onChange={(e) => handleColorChange('corners', e.target.value)}
            className={styles.hexInput}
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      <div className={styles.colorGroup}>
        <label className={styles.label}>Background</label>
        <div className={styles.colorInputWrapper}>
          <input
            type="color"
            value={config.bgColor || '#ffffff'}
            onChange={(e) => handleColorChange('background', e.target.value)}
            className={styles.colorInput}
          />
          <input
            type="text"
            value={config.bgColor || '#ffffff'}
            onChange={(e) => handleColorChange('background', e.target.value)}
            className={styles.hexInput}
            placeholder="#FFFFFF"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorSettings; 