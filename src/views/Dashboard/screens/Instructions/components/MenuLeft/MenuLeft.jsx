import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MenuLeft.module.css';
import { operatorsData } from '../../data/operatorsData';
import SearchInput from '../SearchInput/SearchInput';
import CategoryAccordion from '../CategoryAccordion/CategoryAccordion';

const MenuLeft = () => {
  const [t] = useTranslation("ChatView");
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['text', 'number', 'boolean']));

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredOperators = operatorsData.filter(operator => 
    operator.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operator.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedOperators = filteredOperators.reduce((acc, operator) => {
    if (!acc[operator.category]) {
      acc[operator.category] = [];
    }
    acc[operator.category].push(operator);
    return acc;
  }, {});

  return (
    <div className={styles.menuLeft}>
      <div className={styles.menuHeader}>
        <h3>{t("Operators")}</h3>
        <SearchInput 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t("Search operators...")}
        />
      </div>

      <div className={styles.categoriesContainer}>
        {Object.entries(groupedOperators).map(([category, operators]) => (
          <CategoryAccordion
            key={category}
            category={category}
            operators={operators}
            isExpanded={expandedCategories.has(category)}
            onToggle={() => toggleCategory(category)}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuLeft; 