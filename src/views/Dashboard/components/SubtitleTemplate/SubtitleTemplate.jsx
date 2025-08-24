import React from "react";
import styles from "./SubtitleTemplate.module.css";
const SubtitleTemplate = ({ text, stylesProp }) => {
  return (
    <h2 style={stylesProp} className={styles.SubtitleTemplate}>
      {text}
    </h2>
  );
};

export default SubtitleTemplate;
