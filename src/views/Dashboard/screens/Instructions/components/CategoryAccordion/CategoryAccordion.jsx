import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import styles from './CategoryAccordion.module.css';
import OperationCard from '../OperationCard/OperationCard';

const CategoryAccordion = ({ category, operators, isExpanded, onToggle }) => {
  const categoryIcons = {
    text: '📝',
    number: '🔢',
    boolean: '✅',
    date: '📅',
    list: '📋',
    range: '📊',
    comparison: '🔍',
    advanced: '⚙️',
    null: '🚫'
  };

  const categoryColors = {
    text: '#3b82f6',
    number: '#10b981',
    boolean: '#f59e0b',
    date: '#8b5cf6',
    list: '#ef4444',
    range: '#06b6d4',
    comparison: '#f97316',
    advanced: '#6b7280',
    null: '#9ca3af'
  };

  return (
    <div className={styles.categoryAccordion}>
      <button 
        className={styles.categoryHeader}
        onClick={onToggle}
        style={{ borderLeftColor: categoryColors[category] }}
      >
        <div className={styles.categoryInfo}>
          <span className={styles.categoryIcon}>{categoryIcons[category]}</span>
          <span className={styles.categoryTitle}>{category}</span>
          <span className={styles.operatorCount}>({operators.length})</span>
        </div>
        {isExpanded ? (
          <ChevronDown className={styles.expandIcon} size={16} />
        ) : (
          <ChevronRight className={styles.expandIcon} size={16} />
        )}
      </button>
      
      {isExpanded && (
        <div className={styles.operatorsList}>
          {operators.map((operator, index) => (
            <OperationCard 
              key={`${operator.title}-${index}`}
              operator={operator}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryAccordion; 