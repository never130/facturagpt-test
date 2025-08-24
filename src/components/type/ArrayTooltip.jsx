import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';
import arrayStyles from './ArrayTooltip.module.css';


const ArrayField = ({ title, items, variant = 'green' }) => {
  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldRow}>
        <div className={styles.fieldContentStart}>
          <div className={styles.fieldInfo}>
            <div className={`${arrayStyles.arrayContainer} ${styles.fieldHeaderFull}`}>
              <div className={arrayStyles.arrayTitle}>
                {title}
              </div>
              <div className={arrayStyles.arrayContainer}>
                {items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`${arrayStyles.arrayItem} ${variant === 'blue' ? arrayStyles.arrayItemBlue : ''}`}
                  >
                    <div className={arrayStyles.arrayText}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const ArrayTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className} wide>
      <ArrayField title="arraytitle" items={["list", "list", "list"]} variant="green" />
      <ArrayField title="arraytitle" items={["list", "list", "list"]} variant="blue" />
    </BaseTooltip>
  );
};

export default ArrayTooltip;