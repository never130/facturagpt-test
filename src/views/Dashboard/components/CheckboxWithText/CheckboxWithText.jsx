import React from "react";
import styles from "./CheckboxWithText.module.css";

const CheckboxWithText = ({
  state,
  setState,
  text,
  disabled = false,
  from,
}) => {
  return (
    <div className={styles.checkboxWithTextContainer}>
      <input
        type="checkbox"
        onChange={(e) => setState(e.target.checked)}
        value={state}
        checked={state}
        disabled={disabled}
      />

      {!from && <span className={styles.text}>{text}</span>}
    </div>
  );
};

export default CheckboxWithText;
