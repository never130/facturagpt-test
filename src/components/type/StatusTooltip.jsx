import React from 'react';
import BaseTooltip from './BaseTooltip';
import styles from './Tooltip.module.css';
import statusStyles from './StatusTooltip.module.css';


const StatusField = ({ status, text }) => {
  const getStatusClasses = () => {
    switch (status) {
      case 'approved':
        return {
          text: statusStyles.statusApproved,
          dot: statusStyles.dotApproved
        };
      case 'pending':
        return {
          text: statusStyles.statusPending,
          dot: statusStyles.dotPending
        };
      case 'cancelled':
        return {
          text: statusStyles.statusCancelled,
          dot: statusStyles.dotCancelled
        };
    }
  };

  const statusClasses = getStatusClasses();

  return (
    <div className={styles.fieldContainer}>
      <div className={styles.fieldRow}>
        <div className={styles.fieldContentStart}>
          <div className={`${statusStyles.statusContainer} ${statusStyles.statusField}`}>
            <div className={statusStyles.statusDot}>
              <svg viewBox="0 0 6 6" fill="none">
                <circle cx="3" cy="3" r="3" className={statusClasses.dot} />
              </svg>
            </div>
            <div className={statusStyles.statusContainer}>
              <div className={`${statusStyles.statusText} ${statusClasses.text}`}>
                {text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const StatusTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <StatusField status="approved" text="Aprovado" />
      <StatusField status="pending" text="Pendiente" />
      <StatusField status="cancelled" text="Anulado" />
    </BaseTooltip>
  );
};

export default StatusTooltip;