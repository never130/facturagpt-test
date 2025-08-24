import React from 'react';
import styles from './ColorPaletteSelector.module.css';
import { SHARED_COLOR_PALETTES, colorPaletteUtils } from '../../../components/shared';
import ColorPicker from '../../../views/Dashboard/components/ColorPicker/ColorPicker';

const palettes = SHARED_COLOR_PALETTES.QR_PALETTES;
const paletteNames = Object.keys(palettes);

const rgbaToHex = (rgba) => {
  if (!rgba || rgba.startsWith('#')) {
    return rgba; 
  }
  
  const rgbaMatch = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (!rgbaMatch) {
    return rgba; 
  }
  
  const r = parseInt(rgbaMatch[1]);
  const g = parseInt(rgbaMatch[2]);
  const b = parseInt(rgbaMatch[3]);
  
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

const ColorPaletteSelector = ({ config, onConfigChange }) => {
  const [activeTab, setActiveTab] = React.useState('Background');
  const [showGradientColorPicker, setShowGradientColorPicker] = React.useState(false);
  const [showDotsColorPicker, setShowDotsColorPicker] = React.useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = React.useState(false);
  const [presetColors, setPresetColors] = React.useState(['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']);

  const selectedPaletteName = colorPaletteUtils.findPaletteName(config, 'QR_PALETTES');

  const handlePaletteSelect = (paletteName) => {
    const selected = colorPaletteUtils.getPalette(paletteName, 'QR_PALETTES');
    if (selected && selected.fgColor !== null) {
      onConfigChange({
        fgColor: selected.fgColor,
        bgColor: selected.bgColor,
      });
    }
  };

  const handleColorPickerClick = (colorType) => {
    setActiveTab(colorType); 
    switch (colorType) {
      case 'Gradient':
        setShowGradientColorPicker(true);
        break;
      case 'Dots':
        setShowDotsColorPicker(true);
        break;
      case 'Background':
        setShowBgColorPicker(true);
        break;
    }
  };

  const handleTabClick = (tabName) => {
    handleColorPickerClick(tabName);
  };

  const handleGradientColorChange = (color) => {
    const hexColor = rgbaToHex(color);
    onConfigChange({ eyeColor: hexColor, gradientColor: hexColor });
  };

  const handleDotsColorChange = (color) => {
    const hexColor = rgbaToHex(color);
    onConfigChange({ fgColor: hexColor, dotsColor: hexColor });
  };

  const handleBgColorChange = (color) => {
    const hexColor = rgbaToHex(color);
    onConfigChange({ bgColor: hexColor });
  };

  const tabs = [
    {
      name: 'Gradient',
      isActive: activeTab === 'Gradient',
      onClick: () => handleTabClick('Gradient')
    },
    {
      name: 'Dots',
      isActive: activeTab === 'Dots',
      onClick: () => handleTabClick('Dots')
    },
    {
      name: 'Background',
      isActive: activeTab === 'Background',
      onClick: () => handleTabClick('Background')
    }
  ];

  return (
    <div className={styles.colorPaletteSelector}>
      <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.name}
            className={`${styles.tab} ${tab.isActive ? styles.activeTab : ''}`}
            onClick={tab.onClick}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className={styles.colorValuesContainer}>
        <div className={styles.colorValueRow}>
          <span className={styles.colorLabel}>Gradient</span>
          <div 
            className={styles.colorValueDisplay}
            onClick={() => handleColorPickerClick('Gradient')}
          >
            <div
              className={styles.colorDot}
              style={{ backgroundColor: config.gradientColor || '#333333' }}
            />
            <span className={styles.colorHex}>{(config.gradientColor || '#333333').toUpperCase()}</span>
          </div>
        </div>

        <div className={styles.colorValueRow}>
          <span className={styles.colorLabel}>Dots</span>
          <div 
            className={styles.colorValueDisplay}
            onClick={() => handleColorPickerClick('Dots')}
          >
            <div
              className={styles.colorDot}
              style={{ backgroundColor: config.dotsColor || config.fgColor || '#333333' }}
            />
            <span className={styles.colorHex}>{(config.dotsColor || config.fgColor || '#333333').toUpperCase()}</span>
          </div>
        </div>

        <div className={styles.colorValueRow}>
          <span className={styles.colorLabel}>Background</span>
          <div 
            className={styles.colorValueDisplay}
            onClick={() => handleColorPickerClick('Background')}
          >
            <div
              className={styles.colorDot}
              style={{ backgroundColor: config.bgColor || '#F8F8F8' }}
            />
            <span className={styles.colorHex}>{(config.bgColor || '#F8F8F8').toUpperCase()}</span>
          </div>
        </div>
      </div>
      <div className={styles.grid}>
        {paletteNames.map((paletteName) => {
          const palette = palettes[paletteName];
          if (paletteName === 'Custom') return null;
          return (
            <div
              key={paletteName}
              className={`${styles.paletteItem} ${
                selectedPaletteName === paletteName ? styles.selected : ''
              }`}
              onClick={() => handlePaletteSelect(paletteName)}
              title={paletteName}
            >
              <div className={styles.previewPlaceholder}>
                <div
                  className={styles.colorCircle}
                  style={{ backgroundColor: palette.fgColor }}
                ></div>
              </div>
              <span className={styles.paletteName}>{paletteName}</span>
            </div>
          );
        })}
      </div>
      {showGradientColorPicker && (
        <ColorPicker
          color={config.gradientColor || '#333333'}
          setColor={handleGradientColorChange}
          presetColors={presetColors}
          setPresetColors={setPresetColors}
          setShowColorPicker={setShowGradientColorPicker}
        />
      )}

      {showDotsColorPicker && (
        <ColorPicker
          color={config.dotsColor || config.fgColor || '#333333'}
          setColor={handleDotsColorChange}
          presetColors={presetColors}
          setPresetColors={setPresetColors}
          setShowColorPicker={setShowDotsColorPicker}
        />
      )}

      {showBgColorPicker && (
        <ColorPicker
          color={config.bgColor || '#F8F8F8'}
          setColor={handleBgColorChange}
          presetColors={presetColors}
          setPresetColors={setPresetColors}
          setShowColorPicker={setShowBgColorPicker}
        />
      )}
    </div>
  );
};

export default ColorPaletteSelector;
