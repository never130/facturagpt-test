import React, { useState, useEffect } from 'react';
import ReactQRCode from 'react-qr-code';
import styles from './QRCodeGenerator.module.css';
import FacturaCustomizer from '../../../../factura-customizer/FacturaCustomizer';
import { useDispatch, useSelector } from 'react-redux';
import { saveQRConfig, selectQRConfig } from '@src/slices/qrCodeSlice';
import { fetchQRConfigurations } from '@src/actions/docs';
import { useAuth } from '../../../../hooks/useAuth';
import ModalBlackBgTemplate from '../../components/ModalBlackBgTemplate/ModalBlackBgTemplate';

import { ReactComponent as IconCopy } from '../../assets/icon-copy.svg';

const QRCodeGenerator = ({ url, onSave, onSelect, selectedConfig }) => {  const dispatch = useDispatch();
  const { user, loading } = useAuth();
  const { savedConfigs } = useSelector(state => state.qrCode);
  const [isHovered, setIsHovered] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [modalDimensions, setModalDimensions] = useState({
    width: window.innerWidth > 1024 ? "90vw" : "100vw",
    height: window.innerWidth > 1024 ? "50vh" : "85vh",
    maxWidth: "900px",
    maxHeight: "800px",
    minHeight: "600px"

  });

  useEffect(() => {
    dispatch(fetchQRConfigurations());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setModalDimensions({
        width: window.innerWidth > 1024 ? "90vw" : "100vw",
        height: window.innerWidth > 1024 ? "50vh" : "85vh",
        maxWidth: "900px",
        maxHeight: "600px"
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSaveConfig = (config) => {
    if (onSave) {
      onSave(config);
    }
  };
  const handleSelectConfig = (config) => {
    if (onSelect) {
      onSelect(config);
    }
  };

  const handleCloseEditor = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setShowEditor(false);
    }, 300); 
  };
  

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (!url) {
    return <div className={styles.container}>No URL provided</div>;
  }

  return (
    <div 
      className={styles.container}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.qrWrapper}>
        {selectedConfig ? (
          <ReactQRCode
            value={url}
            size={'100%'}
            bgColor={selectedConfig.bgColor || '#ffffff'}
            fgColor={selectedConfig.fgColor || '#000000'}
            level={selectedConfig.ecLevel || 'M'}
            style={{ width: '100%', height: 'auto' }}
          />
        ) : (
          <ReactQRCode
            value={url}
            size={'100%'}
            style={{ width: '100%', height: 'auto' }}
          />
        )}        {isHovered && user?.id && (
          <button
            className={styles.editButton}
            onClick={() => {
              setIsAnimating(false);
              setShowEditor(true);
            }}
          >
            Edit
          </button>
        )}
        <div>
          <IconCopy />
          <b>
          ····
          </b>
          485
          
        </div>
      </div>
      
      {savedConfigs && savedConfigs.length > 0 && (
        <div className={styles.savedConfigsContainer}>
          <div className={styles.savedConfigsList} >
            {savedConfigs.map((config, index) => (
              <div 
                key={config.id} 
                className={`${styles.savedConfigItem} ${selectedConfig?.id === config.id ? styles.selectedConfig : ''}`}
                onClick={() => handleSelectConfig(config)}
                style={{ 
                  filter: index === 0 ? 'grayscale(0)' : 'grayscale(1)',
                  backgroundColor: config.bgColor || '#ffffff',
                  borderColor: config.fgColor || '#000000' 
                }}
              >
                <div 
                  className={styles.colorPreview} 
                  style={{ backgroundColor: config.fgColor || '#000000' }}
                />
                <span className={styles.savedConfigItemText} style={{ color: config.fgColor || '#000000' }}>
                  {config.name || `Style ${config.id.split('-')[1].slice(0, 4)}`}
                </span>
              </div>
            ))}
          </div>
        </div>      )}      
        {showEditor && (
        <ModalBlackBgTemplate
          close={handleCloseEditor}
          isAnimating={isAnimating}
          customStyle={{
            ...modalDimensions,
            overflow: "hidden",
            padding: 0
          }}
        >
          <div className={styles.editorContent}>           
             <FacturaCustomizer 
              onClose={handleCloseEditor}
              initialConfig={selectedConfig}
              onSave={handleSaveConfig}
              onSelect={handleSelectConfig}
              value={url}
            />
          </div>
        </ModalBlackBgTemplate>
      )}
    </div>
  );
};

export default QRCodeGenerator;
