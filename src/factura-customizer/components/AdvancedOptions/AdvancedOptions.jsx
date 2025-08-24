import React from 'react';
import styles from './AdvancedOptions.module.css';
import Dropdown from '../Dropdown/Dropdown';

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

const AdvancedOptions = ({ config, onConfigChange }) => {
  const [selectedDotShape, setSelectedDotShape] = React.useState('rounded');
  const [selectedCornerShape, setSelectedCornerShape] =
    React.useState('Extra rounded');
  const [selectedInnerShape, setSelectedInnerShape] =
    React.useState('Extra rounded');

  const dotShapes = [
    'square',
    'rounded',
    'dots',
    'classy',
    'classy rounded',
    'extra rounded',
  ];
  const cornerShapes = ['default', 'extra rounded'];

  const handleEcLevelChange = (selectedDisplayName) => {
    const levelValue = ecLevelMap[selectedDisplayName];
    if (levelValue) {
      onConfigChange({ ecLevel: levelValue });
    }
  };

  const handleCornerShapeChange = (shape) => {
    setSelectedCornerShape(shape);
    if (onConfigChange) {
      onConfigChange({ cornerShape: shape });
    }
  };

  const handleInnerShapeChange = (shape) => {
    setSelectedInnerShape(shape);
    if (onConfigChange) {
      onConfigChange({ innerShape: shape });
    }
  };

  const handleDotShapeChange = (shape) => {
    setSelectedDotShape(shape);
    if (onConfigChange) {
      onConfigChange({ dotShape: shape });
    }
  };

  const currentEcLevelName = findEcLevelDisplayName(config.ecLevel || 'M');

  return (
    <div className={styles.advancedOptions}>
      <p className={styles.description}>
        Fine-tune your QR code with advanced style options. <br />
        Click "Apply Custom Style" when finished.
      </p>

      <div className={styles.optionGroup}>
        <label className={styles.label}>Dots Shape</label>
        <div className={styles.buttonGrid}>
          {dotShapes.map((shape) => (
            <button
              key={shape}
              className={`${styles.shapeButton} ${
                selectedDotShape === shape ? styles.selected : ''
              }`}
              onClick={() => handleDotShapeChange(shape)}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inlineGroup}>
        <div className={styles.optionGroup} style={{ flex: 1 }}>
          <label className={styles.label}>Corner Squares</label>
          <Dropdown
            options={cornerShapes}
            selectedOption={selectedCornerShape}
            onSelect={handleCornerShapeChange}
          />
        </div>
        <div className={styles.optionGroup} style={{ flex: 1 }}>
          <label className={styles.label}>Píxeles interiores</label>
          <Dropdown
            options={cornerShapes}
            selectedOption={selectedInnerShape}
            onSelect={handleInnerShapeChange}
          />
        </div>
      </div>

      <div className={styles.optionGroup}>
        <label className={styles.label}>Error Correction</label>
        <Dropdown
          options={ecLevelDisplayNames}
          selectedOption={currentEcLevelName}
          onSelect={handleEcLevelChange}
        />
        <p className={styles.smallDescription}>
          Higher correction allows for more damage to the QR code but reduces
          data capacity.
        </p>
      </div>
    </div>
  );
};

export default AdvancedOptions;
