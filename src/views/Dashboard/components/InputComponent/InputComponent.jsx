import React from "react";
import styles from "./InputComponent.module.css";
import DeleteButton from "../DeleteButton/DeleteButton";
import { ReactComponent as CloseVector } from "../../assets/CloseVector.svg";

const InputComponent = ({
  icon,
  placeholder,
  textButton,
  typeInput,
  value,
  setValue,
  readOnly,
  action,
  options = [],
  onKeyDown,
  fromImport,
  fromRemitentes,
  graySelectLocationBtn,
  whiteSelectLocationBtn
}) => {

  return (
    <div className={fromRemitentes ? styles.remitentesInputContainer : styles.inputContainer}>
      <div className={fromRemitentes ? styles.remitentesInputWrapper : styles.inputWrapper}>
        {icon && <div className={styles.iconContainer}>{icon}</div>}
        {typeInput === "select" ? (
          <select
            className={styles.inputField}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={readOnly}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <>
            {fromRemitentes &&
              options.map((option, index) => (
                <div className={styles.remitenteOption} key={index}>
                  {option}
                  <DeleteButton action={() => action(index)} CustonIcon={CloseVector} />
                </div>
              ))}
            <input
              readOnly={readOnly}
              className={styles.inputField}
              value={
                value === "/Inicio/"
                  ? "/Inicio/"
                  : fromImport
                    ? `/Inicio${value?.indexOf("/") !== -1 ? value?.slice(value.indexOf("/")) : ""}`
                    : value
              }
              onChange={(e) => setValue(e.target.value)}
              type={typeInput}
              placeholder={placeholder}
              onKeyDown={onKeyDown}
            />
          </>
        )}
      </div>
      {textButton && (
        <p onClick={action} className={`${styles.actionText} ${graySelectLocationBtn && styles.graySelectLocationBtn} ${whiteSelectLocationBtn && styles.whiteSelectLocationBtn}`}>
          {textButton}
        </p>
      )}
    </div>
  );
};

export default InputComponent;
