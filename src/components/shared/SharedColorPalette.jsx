import React from 'react';
import styles from './SharedColorPalette.module.css';

export const SHARED_COLOR_PALETTES = {
  QR_PALETTES: {
    Default: { fgColor: '#000000', bgColor: '#FFFFFF' },
    Vibrant: { fgColor: '#FF00FF', bgColor: '#FFFF00' },
    Monochrome: { fgColor: '#CCCCCC', bgColor: '#CCCCCC' },
    BlueOcean: { fgColor: '#0077CC', bgColor: '#E0F7FA' },
    Forest: { fgColor: '#228B22', bgColor: '#F0FFF0' },
    Sunset: { fgColor: '#FF8C00', bgColor: '#FFF8DC' },
    NeonLights: { fgColor: '#39FF14', bgColor: '#222222' },
    Corporate: { fgColor: '#004080', bgColor: '#F8F9FA' },
    Earthy: { fgColor: '#8B4513', bgColor: '#F5F5DC' },
    DarkMode: { fgColor: '#222222', bgColor: '#222222' },
    Custom: { fgColor: null, bgColor: null },
  },

  STANDARD_PALETTES: {
    Default: { primary: '#000000', secondary: '#FFFFFF', name: 'Default' },
    Vibrant: { primary: '#FF00FF', secondary: '#FFFF00', name: 'Vibrant' },
    Monochrome: { primary: '#CCCCCC', secondary: '#CCCCCC', name: 'Monochrome' },
    BlueOcean: { primary: '#0077CC', secondary: '#E0F7FA', name: 'Blue Ocean' },
    Forest: { primary: '#228B22', secondary: '#F0FFF0', name: 'Forest' },
    Sunset: { primary: '#FF8C00', secondary: '#FFF8DC', name: 'Sunset' },
    NeonLights: { primary: '#39FF14', secondary: '#222222', name: 'Neon Lights' },
    Corporate: { primary: '#004080', secondary: '#F8F9FA', name: 'Corporate' },
    Earthy: { primary: '#8B4513', secondary: '#F5F5DC', name: 'Earthy' },
    DarkMode: { primary: '#222222', secondary: '#222222', name: 'Dark Mode' },
  },

  PRESET_COLORS: [
    "#000000", "#6B46C1", "#D6BCFA", "#2B6CB0", "#90CDF4",
    "#E53E3E", "#ED8936", "#38A169", "#4FD1C5", "#ECC94B",
  ],

  CALENDAR_COLORS: [
    { hex: '#FF5733', label: 'Red' },
    { hex: '#33FF57', label: 'Green' },
    { hex: '#3357FF', label: 'Blue' },
    { hex: '#FF33F1', label: 'Pink' },
    { hex: '#F1FF33', label: 'Yellow' },
    { hex: '#33FFF1', label: 'Cyan' },
    { hex: '#FF8C33', label: 'Orange' },
    { hex: '#8C33FF', label: 'Purple' },
    { hex: '#33FF8C', label: 'Light Green' },
    { hex: '#FF3333', label: 'Bright Red' },
  ],
};

export const colorPaletteUtils = {
  findPaletteName: (colors, paletteType = 'QR_PALETTES') => {
    const palettes = SHARED_COLOR_PALETTES[paletteType];
    if (!palettes) return 'Custom';

    for (const [name, palette] of Object.entries(palettes)) {
      if (paletteType === 'QR_PALETTES') {
        if (colors.fgColor === palette.fgColor && colors.bgColor === palette.bgColor) {
          return name;
        }
      } else if (paletteType === 'STANDARD_PALETTES') {
        if (colors.primary === palette.primary && colors.secondary === palette.secondary) {
          return name;
        }
      }
    }
    return 'Custom';
  },

  getPalette: (paletteName, paletteType = 'QR_PALETTES') => {
    const palettes = SHARED_COLOR_PALETTES[paletteType];
    return palettes ? palettes[paletteName] : null;
  },

  getPaletteNames: (paletteType = 'QR_PALETTES') => {
    const palettes = SHARED_COLOR_PALETTES[paletteType];
    return palettes ? Object.keys(palettes) : [];
  },
};

const SharedColorPalette = ({ 
  config, 
  onConfigChange, 
  paletteType = 'QR_PALETTES',
  variant = 'grid',
  customStyles = {},
  showCustomOption = false,
  className = ''
}) => {
  const palettes = SHARED_COLOR_PALETTES[paletteType];
  
  if (!palettes) {
    console.warn(`SharedColorPalette: Unknown palette type "${paletteType}"`);
    return null;
  }

  const paletteNames = Object.keys(palettes);
  
  const selectedPaletteName = colorPaletteUtils.findPaletteName(config, paletteType);

  const handlePaletteSelect = (paletteName) => {
    const selected = palettes[paletteName];
    if (selected && (paletteType !== 'QR_PALETTES' || selected.fgColor !== null)) {
      onConfigChange(selected);
    }
  };

  const renderPaletteItem = (paletteName) => {
    const palette = palettes[paletteName];
    if (paletteName === 'Custom' && !showCustomOption) return null;
    
    const isSelected = selectedPaletteName === paletteName;
    
    return (
      <div
        key={paletteName}
        className={`${styles.paletteItem} ${styles[variant]} ${
          isSelected ? styles.selected : ''
        } ${className}`}
        onClick={() => handlePaletteSelect(paletteName)}
        title={paletteName}
        style={customStyles.paletteItem}
      >
        <div className={styles.previewContainer}>
          {paletteType === 'QR_PALETTES' && (
            <div
              className={styles.colorCircle}
              style={{ 
                backgroundColor: palette.fgColor || '#CCCCCC',
                border: `2px solid ${palette.bgColor || '#FFFFFF'}`
              }}
            />
          )}
          {paletteType === 'STANDARD_PALETTES' && (
            <div className={styles.colorPreview}>
              <div
                className={styles.primaryColor}
                style={{ backgroundColor: palette.primary }}
              />
              <div
                className={styles.secondaryColor}
                style={{ backgroundColor: palette.secondary }}
              />
            </div>
          )}
          {paletteType === 'PRESET_COLORS' && (
            <div
              className={styles.colorCircle}
              style={{ backgroundColor: palette }}
            />
          )}
        </div>
        <span className={styles.paletteName} style={customStyles.paletteName}>
          {palette.name || paletteName}
        </span>
      </div>
    );
  };

  return (
    <div 
      className={`${styles.sharedColorPalette} ${styles[variant]}`}
      style={customStyles.container}
    >
      <div className={styles.paletteGrid}>
        {paletteNames.map(renderPaletteItem)}
      </div>
    </div>
  );
};

export default SharedColorPalette; 