// Category.jsx
import React from 'react';
import styles from './Category.module.css';

const Category = ({ id, category, icon, subcategories, selectedCategory, updateCategory }) => {
  const isSelected = selectedCategory === id;

  const handleCategoryUpdate = () => {
    updateCategory(id);
  };

  return (
    <div className={styles.categoryClass}>
      <button 
        className={`${styles.buttonClass} ${isSelected ? styles.activeButton : ''}`}
        onClick={handleCategoryUpdate}
        aria-pressed={isSelected}
      >
        {icon} {category}
      </button>
    </div>
  );
};

export default Category;