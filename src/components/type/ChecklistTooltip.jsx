import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';
import checklistStyles from './ChecklistTooltip.module.css';
// import svgPaths from '../../imports/svg-nmcjl7opqt';



const ChecklistItem = ({ text, completed }) => {
  return (
    <div className={checklistStyles.checklistItem}>
      <div className={`${checklistStyles.checkbox} ${completed ? checklistStyles.checkboxChecked : checklistStyles.checkboxUnchecked}`}>
        <svg>
          {completed ? (
            <g>
              <path d="M6.5 2H3.5C2.39543 2 1.5 2.89543 1.5 4V7C1.5 8.10457 2.39543 9 3.5 9H6.5C7.60457 9 8.5 8.10457 8.5 7V4C8.5 2.89543 7.60457 2 6.5 2Z" />
              <path d="M2.5 4.5L4 6L6.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : (
            <g>
              <path d="M6.5 2H3.5C2.39543 2 1.5 2.89543 1.5 4V7C1.5 8.10457 2.39543 9 3.5 9H6.5C7.60457 9 8.5 8.10457 8.5 7V4C8.5 2.89543 7.60457 2 6.5 2Z" stroke="white" fill="none" strokeWidth="1" />
            </g>
          )}
        </svg>
      </div>
      <div className={`${checklistStyles.checklistText} ${completed ? checklistStyles.checklistTextCompleted : ''}`}>
        {text}
      </div>
    </div>
  );
};


const ChecklistField = ({ title, items }) => {
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
            {items.map((item, index) => (
              <ChecklistItem key={index} text={item.text} completed={item.completed} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



const ChecklistTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <div className={checklistStyles.checklistContainer}>
        <ChecklistField 
          title="checklisttitle" 
          items={[{ text: "list", completed: true }]} 
        />
        <ChecklistField 
          title="checklisttitle" 
          items={[
            { text: "list", completed: true },
            { text: "list", completed: true },
            { text: "list", completed: false }
          ]} 
        />
      </div>
    </BaseTooltip>
  );
};

export default ChecklistTooltip;