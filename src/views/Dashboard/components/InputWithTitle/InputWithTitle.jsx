import React from "react";
import styles from "./InputWithTitle.module.css";

const InputWithTitle = ({
  bgColor = "var(--f5-background)",
  title,
  placeholder,
  value,
  onChange,
  width = "100%",
  type = "text",
  rightElement = null,
  maxLength,
  titleColor = "var(--_5d-color)",
  textStyles = {
    fontSize: "13px",
    fontWeight: 400,
    color: "var(--_5d-color)",
  },
  inputHeight = "44px",
  onKeyDownProp,
  inputClassname
}) => {

  return (
    <div style={{ width }} className={styles.inputWithTitleContainer}>
      {title && (
        <h2 style={{ color: titleColor }} className={styles.inputTitle}>
          {title}
        </h2>
      )}
      <div
        style={{ backgroundColor: bgColor, height: inputHeight }}
        className={styles.inputContainer}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          className={`${styles.inputWithTitle} ${inputClassname}`}
          onKeyDown={onKeyDownProp}
        />
        {rightElement && rightElement}
      </div>
    </div>
  );
};

export default InputWithTitle;
