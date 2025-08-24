import React from 'react';
import styles from './OperationCard.module.css';

const OperationCard = ({ operator }) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (event) => {
    console.log('Drag start triggered for operator:', operator.title);
    setIsDragging(true);
    event.dataTransfer.setData('application/reactflow', 'operator');
    event.dataTransfer.setData('application/operator', JSON.stringify(operator));
    event.dataTransfer.effectAllowed = 'move';
    console.log('Drag data set:', {
      type: 'operator',
      operator: operator
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const getTypeColor = (type) => {
    const colors = {
      text: '#3b82f6',
      number: '#10b981',
      boolean: '#f59e0b',
      date: '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeLabel = (type) => {
    const labels = {
      text: 'T',
      number: 'N',
      boolean: 'B',
      date: 'D'
    };
    return labels[type] || '?';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`${styles.operationCard} ${isDragging ? styles.dragging : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.operatorInfo}>
          <h4 className={styles.operatorTitle}>
            {operator.symbol && <span className={styles.operatorSymbol}>{operator.symbol}</span>}
            {operator.title}
          </h4>
          <p className={styles.operatorDescription}>{operator.description}</p>
        </div>
        <div className={styles.typeBadge} style={{ backgroundColor: getTypeColor(operator.type) }}>
          {getTypeLabel(operator.type)}
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <span className={styles.supportedTypes}>
          {operator.supportedTypes?.join(', ') || operator.type}
        </span>
        <div className={styles.dragIndicator}>
          <div className={styles.dragDot}></div>
          <div className={styles.dragDot}></div>
          <div className={styles.dragDot}></div>
        </div>
      </div>
    </div>
  );
};

export default OperationCard; 