import React from "react";
import styles from "./LabelInputComponent.module.css";
import { ReactComponent as EyePassword } from "../../assets/eyePassword.svg";
import { ReactComponent as EyePasswordSlash } from "../../assets/eyePasswordSlash.svg";

const LabelInputComponent = ({
  label,
  placeholder,
  inputType = "text",
  isSelect,
  options,
  value,
  setValue,
  maxLength,
  onKeyDown,
  showPassword,
  setShowPassword,
  customCssInput
}) => {
  return (
    <div className={styles.labelInputContainer}>
      <label className={styles.label} htmlFor="">
        {label}
      </label>
      {!isSelect ? (
        <div>

          <input
            className={styles.input}
            value={value}
            maxLength={maxLength}
            onChange={(e) => {
              const value = e.target.value;
              if (!maxLength) {
                setValue(value);
                return;
              }
              if (value.length <= maxLength) {
                setValue(value);
              }
            }}
            type={inputType}
            placeholder={placeholder}
            onKeyDown={onKeyDown && onKeyDown}
            style={customCssInput}
          />
           {label === "Contraseña" && <button
            onClick={() => setShowPassword(!showPassword)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "5px",
              position: "absolute",
              right: "0px", 
              top: "40px", 
            }}
          >
            {showPassword ? (
              <EyePassword className={styles.eye} />
            ) : (
              <EyePasswordSlash className={styles.eye} />
            )}
          </button>}
        </div>
      ) : (
        <select className={styles.select}>
          {options.map((option) => (
            <option key={option} value="">
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default LabelInputComponent;
