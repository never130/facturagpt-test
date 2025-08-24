// components/SubcategoriesList/SubcategoriesList.jsx
import React, { useState } from "react";
import styles from "./SubcategoriesList.module.css";
import { useNavigate } from "react-router-dom";

const SubcategoriesList = ({ subcategories, onSelectSubCategory, selectedCategoryName, icon,setSelectedCategory,selectedCategory, handleScrollTo }) => {
    const navigate = useNavigate()
    const[activeSubcategory, setActiveSubcategory] = useState("createAccountAndActivateFirstToken");
    const setSelectedSubCategory = (id) => {        
        onSelectSubCategory(id);
        setActiveSubcategory(id);
    }
    console.log(subcategories);
    
  return (
    <div className={styles.subcategoriesContainer}>
      <span className={styles.title}>{icon} {selectedCategoryName}</span>
      <div className={styles.subcategoriesList}>
        {subcategories.map((sub, index) => (
          <button
            key={index}
                onClick={() => {
                          navigate(`/help/${selectedCategory}`);
                          setSelectedCategory(selectedCategory);
                          setSelectedSubCategory(sub.id);
                          handleScrollTo(sub.id);
                        }}
            className={`${styles.subcategoryItem} ${activeSubcategory == sub.id? styles.active : ""}`}
          >
            {sub.icon &&(
              <span>{sub.icon}</span>
            )}
            <span>{sub.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubcategoriesList;