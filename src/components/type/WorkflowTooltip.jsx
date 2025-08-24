import React from 'react';
import BaseTooltip from './BaseTooltip';
// import styles from './Tooltip.module.css';
import workflowStyles from './WorkflowTooltip.module.css';
// SVG paths will be defined inline for simplicity



const StatusItem = ({ label, type }) => {
  return (
    <div className={workflowStyles.menuItem}>
      <div className={workflowStyles.menuItemContent}>
        <div className={workflowStyles.menuItemInner}>
          <div className={`${workflowStyles.statusDot} ${workflowStyles[`dot${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}>
            <svg>
              <g>
                <path d="M6.5 2H3.5C2.39543 2 1.5 2.89543 1.5 4V7C1.5 8.10457 2.39543 9 3.5 9H6.5C7.60457 9 8.5 8.10457 8.5 7V4C8.5 2.89543 7.60457 2 6.5 2Z" />
                <path d="M5 3.5C5 3.22386 5.22386 3 5.5 3C5.77614 3 6 3.22386 6 3.5C6 3.77614 5.77614 4 5.5 4C5.22386 4 5 3.77614 5 3.5Z" />
              </g>
            </svg>
          </div>
          <div className={workflowStyles.statusLabel}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};


const WorkflowTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <div className={workflowStyles.workflowContainer}>
        <div className={workflowStyles.workflowButton}>
          <div className={workflowStyles.lockIcon}>
            <svg viewBox="0 0 16 16">
              <path d="M4 7V5a4 4 0 1 1 8 0v2h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1zM6 5v2h4V5a2 2 0 1 0-4 0z" fill="white" />
            </svg>
          </div>
          <div className={workflowStyles.buttonText}>
            Aprobar Documento
          </div>
        </div>
        
        <div className={workflowStyles.statusRow}>
          <div className={workflowStyles.statusText}>
            Aprovado
          </div>
          <div className={workflowStyles.statusIcon}>
            <svg viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.707 6.293l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L7 8.172l3.293-3.293a1 1 0 0 1 1.414 1.414z" fill="#10A37F" />
            </svg>
          </div>
        </div>

        <div className={workflowStyles.workflowContainer}>
          <StatusItem label="Invalid" type="invalid" />
          <StatusItem label="Invalid" type="invalid" />
          <StatusItem label="Error" type="error" />
          <StatusItem label="Empty" type="empty" />
          <StatusItem label="Draft" type="draft" />
          <StatusItem label="Processing" type="processing" />
          <StatusItem label="Registered" type="registered" />
          <StatusItem label="Sent" type="sent" />
          <StatusItem label="Paid" type="paid" />
          <StatusItem label="Custom" type="custom" />
        </div>
      </div>
    </BaseTooltip>
  );
};

export default WorkflowTooltip;