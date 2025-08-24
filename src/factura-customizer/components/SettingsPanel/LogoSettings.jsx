import React from 'react';
import styles from './LogoSettings.module.css';
import LogoSizeSelector from '../LogoSizeSelector/LogoSizeSelector';
import LogoPositionSelector from '../LogoPositionSelector/LogoPositionSelector';
import RemoveButton from '../../../components/shared/RemoveButton/RemoveButton';
import uploadIcon from '../../assets/upload-icon.svg';

const LogoUploadBox = ({ onChange }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange({ target: { files: e.dataTransfer.files } });
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    onChange(e);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div
      className={`${styles.logoUploadBox} ${
        dragActive ? styles.dragActive : ''
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      data-testid='logo-upload-box'
    >
      <input
        ref={inputRef}
        type='file'
        accept='image/png, image/jpeg'
        style={{ display: 'none' }}
        onChange={handleFileChange}
        data-testid='logo-upload-input'
      />
      <div className={styles.uploadIconWrapper}>
        <img
          src={uploadIcon}
          alt='Upload Icon'
          width='24'
          height='24'
          className={styles.uploadIcon}
        />
      </div>
      <button
        type='button'
        className={styles.uploadButton}
        onClick={handleButtonClick}
        tabIndex={0}
      >
        Upload logo
      </button>
      <div className={styles.uploadText}>
        <strong>Selecciona o arrastra tu archivo</strong>
      </div>
      <div className={styles.uploadDescription}>
        El tamaño de logo recomendado es de 500px máximo (ancho o alto).
        <br />
        Formatos aceptados: png y jpg.
      </div>
    </div>
  );
};

const LogoSettings = ({ config, onConfigChange, onLogoChange }) => (
  <div className={styles.logoSettingsContainer}>
    <LogoUploadBox onChange={onLogoChange} />
    {config.logoImage && (
      <div className={styles.logoPreviewContainer}>
        <img
          src={config.logoImage}
          alt='Logo Preview'
          className={styles.logoPreview}
        />
        <RemoveButton 
          onClick={() => onConfigChange({ 
            logoImage: '',
            logoWidth: 60,
            logoHeight: 60,
            logoOpacity: 1,
            logoPadding: 0,
            removeQrCodeBehindLogo: true
          })}
          title="Remove logo"
          className={styles.removeLogoButton}
        />
      </div>
    )}
    <div className={`${styles.logoOptionsContainer} ${config.logoImage ? styles.visible : styles.hidden}`}>
      <LogoSizeSelector config={config} onConfigChange={onConfigChange} />
      <LogoPositionSelector config={config} onConfigChange={onConfigChange} />
    </div>
  </div>
);

export default LogoSettings;
