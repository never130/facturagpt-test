import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';
import emailStyles from './EmailTooltip.module.css';
// import svgPaths from './imports/svg-mr8k9f3odm';



const EmailField = ({ title, email }) => {
  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldRow}>
        <div className={`${styles.fieldContent} ${emailStyles.emailField}`}>
          <div className={styles.fieldInfo}>
            <div className={styles.fieldHeader}>
              <div className={styles.fieldTitle}>
                <span className={styles.titleText}>{title}</span>
              </div>
            </div>
            <span className={`${styles.infoText} ${styles.infoTextUnderline}`}>{email}</span>
          </div>
          <div className={styles.icon}>
            {/* <svg className={emailStyles.emailIcon}>
              <g>
                <path d={svgPaths.pa3ff970} />
                <path d={svgPaths.p5c184f0} />
              </g>
            </svg> */}
          </div>
        </div>
      </div>
    </div>
  );
};



const EmailTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <EmailField title="Email" email="example@email.com" />
      <EmailField title="emailtitle" email="example@email.com" />
    </BaseTooltip>
  );
};

export default EmailTooltip;