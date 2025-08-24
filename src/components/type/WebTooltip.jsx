import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';
import webStyles from './WebTooltip.module.css';
// import svgPaths from '../../imports/svg-mr8k9f3odm';


const WebField = ({ title, url }) => {
  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldRow}>
        <div className={`${styles.fieldContent} ${webStyles.webField}`}>
          <div className={styles.fieldInfo}>
            <div className={styles.fieldHeader}>
              <div className={styles.fieldTitle}>
                <span className={styles.titleText}>{title}</span>
              </div>
            </div>
            <span className={styles.infoText}>{url}</span>
          </div>
          <div className={webStyles.webIcon}>
            {/* <svg>
              <path d={svgPaths.p22ead400} />
            </svg> */}
            icon path
          </div>
        </div>
      </div>
    </div>
  );
};


const WebTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <WebField title="Web" url="example.com" />
      <WebField title="webtitle" url="example.com" />
    </BaseTooltip>
  );
};

export default WebTooltip;