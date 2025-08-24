import React, { useState } from 'react';
import styles from './FilterDocs.module.css';
import filterDocs from './filterDocs.json';

const FilterDocs = ({labels, setLabels,indexLabelToTitleDescription,incrementarVariable,setShowProgressBar,setFilterDocsSelected}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  const handleItemClick = (item) => {
    const updatedLabels = JSON.parse(JSON.stringify(labels));
    let index = indexLabelToTitleDescription || 0;
         if (updatedLabels[index]) {
        updatedLabels[index].conditions = [
          ...updatedLabels[index].conditions,
          ...item.items,
        ];
 
          if(labels[index]?.name === "") updatedLabels[index].name = item.title
            else {
          incrementarVariable()
          setShowProgressBar(true);
          setFilterDocsSelected(item.title)
        }
      

        updatedLabels[index].conditionCurrency =
          updatedLabels[index].conditions[0];
          setLabels(updatedLabels);
      }

  };

  return (
    <div className={styles.container}>
      {!selectedCategory ? (
        <div className={styles.categoriesContainer}>
          <div className={styles.categoriesScroll}>
            {Object.entries(filterDocs).map(([key, value]) => (
              <div
                key={key}
                className={styles.categoryItem}
                onClick={() => handleCategoryClick(key)}
              >
                <span className={styles.categoryIcon}>{value.icon}</span>
                <span className={styles.categoryTitle}>{value.title}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.itemsContainer}>
          <div className={styles.itemsScroll}>
            <div className={styles.backButton} onClick={handleBackClick}>
              <span className={styles.backIcon}>←</span>
            </div>
            {filterDocs[selectedCategory].items.map((item, index) => (
              <div
                key={index}
                className={styles.item}
                onClick={() => handleItemClick(item)}
              >
                <span className={styles.itemIcon}>{item.icon}</span>
                <span className={styles.itemTitle}>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDocs;
