import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';
import mediaStyles from './MediaTooltip.module.css';
// SVG paths will be defined inline for simplicity


const MediaField = ({ title, value, type }) => {
  const renderContent = () => {
    if (type === 'recorder') {
      return (
        <div className={mediaStyles.mediaContainer}>
          <div className={mediaStyles.mediaTitle}>{title}</div>
          <div className={mediaStyles.mediaValue}>{value}</div>
          <div className={mediaStyles.audioPlayer}>
            <div className={mediaStyles.playerContainer}>
              <div className={mediaStyles.playButton}>
                <svg>
                  <circle cx="16" cy="16" r="16" fill="#ECECF1" />
                  <polygon points="12,8 20,16 12,24" fill="#0D0D0D" />
                </svg>
              </div>
              <div className={mediaStyles.timeDisplay}>99:99:99</div>
            </div>
            <div className={mediaStyles.dateLabel}>date</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className={mediaStyles.mediaField}>
        <div className={mediaStyles.mediaTitle}>{title}</div>
        <div className={mediaStyles.mediaValue}>{value}</div>
      </div>
    );
  };

  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldRow}>
        <div className={styles.fieldContentStart}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};


const MediaTooltip = ({ className, type }) => {
  const getFields = () => {
    switch (type) {
      case 'chronometer':
        return [
          { title: "chronometertitle", value: "DD:HH:MM:SS" },
          { title: "chronometertitle", value: "DD:HH:MM:SS" }
        ];
      case 'recorder':
        return [
          { title: "recordertitle", value: "Transcription" },
          { title: "recordertitle", value: "Transcription" }
        ];
      case 'language':
        return [
          { title: "language", value: "" },
          { title: "language", value: "" }
        ];
      case 'formula':
        return [
          { title: "formulatitle", value: "Resultado" },
          { title: "formulatitle", value: "Resultado" }
        ];
      default:
        return [];
    }
  };

  return (
    <BaseTooltip className={className}>
      {getFields().map((field, index) => (
        <MediaField 
          key={index} 
          title={field.title} 
          value={field.value} 
          type={type}
        />
      ))}
    </BaseTooltip>
  );
};

export default MediaTooltip;