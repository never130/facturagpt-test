import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';



const DataField = ({ title, value, currency }) => {
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
            <div className={styles.infoText}>
              {value}{currency && ` ${currency}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const DataTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <DataField title="importtitle" value="00,00" currency="EUR" />
      <DataField title="textboxtitle" value="Textbox" />
      <DataField title="numbertitle" value="value" />
      <DataField title="percentagettitle" value="20% (June, 10-July, 20)" />
    </BaseTooltip>
  );
};

export default DataTooltip;