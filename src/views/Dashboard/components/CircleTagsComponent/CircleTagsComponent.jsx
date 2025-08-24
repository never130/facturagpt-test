import React, { useState } from "react";
import styles from "./CircleTagsComponent.module.css";

const CircleTagsComponent = ({
  color,
  renderAllTags = false,
  selectedTag,
  setSelectedTag,
}) => {

  const tags = [
    "tagWhite",
    "tagRed",
    "tagOrange",
    "tagYellow",
    "tagGreen",
    "tagBlue",
    "tagViolet",
    "tagPink",
  ];

  const handleTagClick = (tag) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag); 
  };
  
  return (
    <div className={styles.tags}>
      {renderAllTags ? (
        tags.map((tag) => (
          <span
            key={tag}
            className={`${styles.tag} ${styles[tag]}  ${selectedTag === tag ? styles.selected : ""}`}
            onClick={() => handleTagClick(tag)}
            style={{ marginLeft: "0" }}
          ></span>
        ))
      ) : (
        <span className={`${styles.tag} ${styles[color]}`}></span>
      )}
    </div>
  );
};

export default CircleTagsComponent;
