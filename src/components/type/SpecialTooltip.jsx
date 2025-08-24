import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';
// SVG paths will be defined inline for simplicity


const SpecialField = ({ title, value, type, hasIcon = false, hasCopyButton = false }) => {
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
              {value}
            </div>
          </div>
          {hasIcon && (
            <div className={styles.icon}>
              <svg viewBox="0 0 16 16">
                <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" fill="white" />
              </svg>
            </div>
          )}
          {hasCopyButton && (
            <button style={{
              backgroundColor: '#f3f3f3',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px'
            }}>
              <div style={{ width: '12px', height: '12px' }}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 4V2.5C8 2.22386 8.22386 2 8.5 2H15.5C15.7761 2 16 2.22386 16 2.5V4H20V6H4V4H8ZM6 8V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V8H6ZM8 10V18H10V10H8ZM12 10V18H14V10H12Z"
                    stroke="#666666"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


const SpecialTooltip = ({ className, type }) => {
  const getFields = () => {
    switch (type) {
      case 'unit':
        return [{ title: "unittitle", value: "00 unit", hasIcon: false }];
      case 'currency':
        return [{ title: "currencytitle", value: "EUR", hasIcon: false }];
      case 'uuid':
        return [{ title: "uiidtitle", value: "jeklwjwljclwncknk", hasCopyButton: true }];
      case 'input':
        return [{ title: "Nombre", value: "Numero de identidad", hasIcon: false }];
      case 'path':
        return [{ title: "", value: "/home", hasIcon: false }];
      default:
        return [];
    }
  };

  return (
    <BaseTooltip className={className}>
      {getFields().map((field, index) => (
        <SpecialField 
          key={index} 
          title={field.title} 
          value={field.value} 
          type={type}
          hasIcon={field.hasIcon}
          hasCopyButton={field.hasCopyButton}
        />
      ))}
    </BaseTooltip>
  );
};

export default SpecialTooltip;