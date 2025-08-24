import React from "react";
import styles from "./ModalBlackBgTemplate.module.css";
const ModalBlackBgTemplate = ({
  children,
  isAnimating,
  close,
  customStyle,
  cssToPanelAutomate,
  father,
  customZIndex
}) => {
  const cssFrom = cssToPanelAutomate ? styles.cssToPanelAutomate : styles.modalBlackContent;
  return (
    <div className={styles.ModalBlackBgTemplate} style={{zIndex:father == "newContact" || father == "newAsset" ? "5": customZIndex || "4"}}>
      <div className={styles.bgModalBlackBgTemplate} onClick={close}></div>
      <div
        style={customStyle}
        className={`${cssFrom} ${isAnimating ? styles.scaleDown : styles.scaleUp}`}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalBlackBgTemplate;
