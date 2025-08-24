import React from "react";
import styles from "./CustomAutomationsWrapper.module.css";

const CustomAutomationsWrapper = ({
  color = "var(--e6fff9-background)",
  Icon,
  children,
  showContent,
  minWidth,
  customCss,
  className,
  hiddenTest
}) => {
  return (
    <div
      className={`${styles.wrapper} ${showContent ? styles.open : ""} ${className || ""}`}
      style={{
        customCss,
        overflow: hiddenTest ? "hidden" : "visible"
      }}
    >
      <div
        style={{
          backgroundColor: color,
          width: showContent && "10px",
        }}
        className={styles.leftContainer}
      >
        {!showContent && Icon}
      </div>
      <div 
        className={styles.rightContainer} 
        style={{
          customCss,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default CustomAutomationsWrapper;
