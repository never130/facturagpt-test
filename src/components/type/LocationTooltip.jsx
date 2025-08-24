import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';
// import svgPaths from '../../imports/svg-mr8k9f3odm';


const LocationField = ({ title, address }) => {
  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldRow}>
        <div className={styles.fieldContentStart}>
          <div className={styles.fieldInfo}>
            <div className={styles.fieldHeader}>
              <div className={styles.fieldTitle}>
                <span className={styles.titleText}>{title}</span>
              </div>
            </div>
            <span className={styles.infoText}>{address}</span>
          </div>
          <div className={styles.icon}>
            {/* <svg>
              <g>
                <path 
                  d={svgPaths.p1539e500}
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.16667"
                />
                <path 
                  d={svgPaths.p37b99980}
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.16667"
                />
              </g>
            </svg> */}
            icon svg
          </div>
        </div>
      </div>
    </div>
  );
};


const LocationTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <LocationField 
        title="Ubicación" 
        address="Dirección, Población,  CP, Provincia, País" 
      />
      <LocationField 
        title="locationtitle" 
        address="ubicación" 
      />
    </BaseTooltip>
  );
};

export default LocationTooltip;