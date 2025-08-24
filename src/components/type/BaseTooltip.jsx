import React from 'react';
import styles from './Tooltip.module.css';



const BaseTooltip = ({ children, className, wide = false }) => {
  return (
    <div className={`${styles.tooltipContainer} ${className || ''}`}>
      <div className={styles.arrow}>
        <div className={styles.arrowShape}>
          <div className={styles.arrowBox} />
        </div>
      </div>
      <div className={`${styles.popup} ${wide ? styles.popupWide : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default BaseTooltip;