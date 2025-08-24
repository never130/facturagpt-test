import React, { useState } from 'react';
import ReactQRCode from 'react-qr-code';
import styles from './QRCodeGenerator.module.css';
import QRCodeEditor from '../QRCodeEditor/QRCodeEditor';

const QRCodeGenerator = ({ url, onSave, onSelect, selectedConfig }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [localConfig, setLocalConfig] = useState(selectedConfig);

  const handleSave = (config) => {
    setLocalConfig(config);
    onSave?.(config);
  };

  const handleSelect = (config) => {
    setLocalConfig(config);
    onSelect?.(config);
  };

  return (
    <div
      className={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.qrWrapper}>
        {localConfig || selectedConfig ? (
          <ReactQRCode
            value={url}
            size={'100%'}
            bgColor={
              localConfig?.bgColor || selectedConfig?.bgColor || '#ffffff'
            }
            fgColor={
              localConfig?.fgColor || selectedConfig?.fgColor || '#000000'
            }
            level={localConfig?.ecLevel || selectedConfig?.ecLevel || 'M'}
            style={{ width: '100%', height: 'auto' }}
          />
        ) : (
          <ReactQRCode
            value={url}
            size={'100%'}
            style={{ width: '100%', height: 'auto' }}
          />
        )}

        {isHovered && (
          <button
            className={styles.editButton}
            onClick={() => setShowEditor(true)}
          >
            Edit
          </button>
        )}
      </div>

      <QRCodeEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        onSave={handleSave}
        onSelect={handleSelect}
        initialValue={url}
        initialConfig={localConfig || selectedConfig}
      />
    </div>
  );
};

export default QRCodeGenerator;
