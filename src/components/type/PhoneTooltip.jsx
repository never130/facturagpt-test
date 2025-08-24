import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';
import phoneStyles from './PhoneTooltip.module.css';
// import svgPaths from '../../imports/svg-mr8k9f3odm';


const PhoneField = ({ title, number }) => {
  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldRow}>
        <div className={`${styles.fieldContent} ${phoneStyles.phoneField}`}>
          <div className={styles.fieldInfo}>
            <div className={styles.fieldHeader}>
              <div className={styles.fieldTitle}>
                <span className={styles.titleText}>{title}</span>
              </div>
            </div>
            <span className={styles.infoText}>{number}</span>
          </div>
          <div className={styles.icon}>
            {/* <svg className={phoneStyles.phoneIcon}>
              <g clipPath="url(#clip0_1_877)">
                <path d={svgPaths.p3a6edb80} />
              </g>
              <defs>
                <clipPath id="clip0_1_877">
                  <rect fill="white" height="14" width="14" />
                </clipPath>
              </defs>
            </svg> */}
            icon svg
          </div>
        </div>
      </div>
    </div>
  );
};



const PhoneTooltip= ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <PhoneField title="Teléfono" number="999999" />
      <PhoneField title="phonetitle" number="999999" />
    </BaseTooltip>
  );
};

export default PhoneTooltip;