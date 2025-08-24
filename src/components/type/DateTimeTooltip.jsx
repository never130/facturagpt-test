import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';


const DateTimeField = ({ title, value, multiline }) => {
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
            <div className={`${styles.infoText} ${multiline ? styles.infoTextMultiline : ''}`}>
              {value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const DateTimeTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <DateTimeField title="datetitle" value="99/99/9999" />
      <DateTimeField title="betweendatestitle" value={`Del 99/99/9999\nHasta 99/99/9999`} multiline />
      <DateTimeField title="hourtitle" value="00:00:00.00 · 00:00:00.00" />
      <DateTimeField title="datetime" value="99/99/9999" />
      <DateTimeField title="datetime" value={`Del 99/99/9999\nHasta 99/99/9999\n00:00:00.00`} multiline />
    </BaseTooltip>
  );
};

export default DateTimeTooltip;