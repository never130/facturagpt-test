import React from 'react';
import styles from './AppIndicator.module.css';

const AppIndicator = ({ appData, isVisible, onClose }) => {
  if (!isVisible || !appData) {
    return null;
  }

  const getAppInfo = () => {
    try {
      if (typeof appData === 'string') {
        const data = JSON.parse(appData);
        return {
          name: String(data.name || 'Aplicación React'),
          description: String(data.description || 'Editor de código en tiempo real'),
          files: data.files ? Object.keys(data.files).length : 0,
          type: String('React App')
        };
      }
      return {
        name: String(appData.name || 'Aplicación React'),
        description: String(appData.description || 'Editor de código en tiempo real'),
        files: appData.files ? Object.keys(appData.files).length : 0,
        type: String('React App')
      };
    } catch (error) {
      return {
        name: String('Aplicación React'),
        description: String('Editor de código en tiempo real'),
        files: 0,
        type: String('React App')
      };
    }
  };

  const appInfo = getAppInfo();

  return (
    <div className={styles.appIndicator}>
      <div className={styles.indicatorContent}>
        <div className={styles.appInfo}>
          <span className={styles.appIcon}>⚛️</span>
          <div className={styles.appDetails}>
            <span className={styles.appName}>{appInfo.name}</span>
            <span className={styles.appDescription}>{appInfo.description}</span>
            <span className={styles.appStats}>
              📁 {String(appInfo.files)} archivos • {appInfo.type}
            </span>
          </div>
        </div>
        
        <button 
          className={styles.closeButton}
          onClick={onClose}
          title="Cerrar indicador"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AppIndicator; 