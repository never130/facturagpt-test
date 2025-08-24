import React, { useState, useRef, useEffect } from "react";
import styles from "./EditableInput.module.css";
import { useTranslation } from "react-i18next";

const EditableInput = ({
  label,
  initialValue = "",
  value,
  onSave,
  type = "text",
  verify = false,
  name,
  placeholder,
  labelOptions = false,
  options = false,
  readOnly,
  isTextarea = false, 
  typeclient = false,
  info,
  onEnter,
  oneRow=false,
  limit = 10000000000,
  showLimit,
  labelClassName,
  textareaInputClassname
}) => {
  const { t } = useTranslation("accountSetting");
  const [sectionSelected, setSectionSelected] = useState(0);

  const [editable, setEditable] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (editable) {
      inputRef.current?.focus();
      if (isTextarea) {
        inputRef.current.style.height = "auto"; 
        inputRef.current.style.height = inputRef.current.scrollHeight + "px";
      }
    }
  }, [editable, newValue]);
  useEffect(() => {
    setNewValue(value);
  }, [value]); 

  useEffect(() => {
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(
        emailRegex.test(newValue) ? "" : t('emailAddressNotValid')
      );
    }
  }, [newValue]);
  const handlePasswordVerify = () => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\-;:'",.<>?]{8,}$/;
    setPasswordError(
      passwordRegex.test(newValue)
        ? ""
        : t('8CharacterAtLeast')
    );
  };

  const handleEditClick = () => {
    if (editable) {
      onSave({ name, newValue });
    }
    setEditable(!editable);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault(); 
      onEnter(newValue); 
    }
  };
  return (
    <div className={styles.editableInputContainer} style={{
      flexDirection:oneRow ? '':'column'
    }}>
      <div className={styles.editableInputHeader}>
        <p>
          {!labelOptions && <span className={labelClassName}>{label}</span>}{" "}
          {info && <span className={styles.info}>{info}</span>}
        </p>
        {!oneRow && (
          <div
          className={styles.button}
            onClick={handleEditClick}
            style={{ cursor: readOnly ? "not-allowed" : "pointer" }}
          >
            {editable ? t('save') : t('edit')}
          </div>
        )}
      </div>

      <div className={styles.editableInput}>
      {!options && oneRow && (
          <div
          className={styles.button}
            onClick={handleEditClick}
            style={{ cursor: readOnly ? "not-allowed" : "pointer" }}
          >
            {editable ? t('save') : t('edit')}
          </div>
        )}
        {initialValue !== "" && <span>{initialValue}</span>}
        {isTextarea ? (
          <textarea
            ref={inputRef}
            placeholder={placeholder}
            name={name}
            value={newValue}
            onKeyDown={handleKeyDown} 
            onChange={(e) => {
              const value = e.target.value;
            
              if (value?.length <= newValue?.length || value?.length <= limit) {
                setNewValue(value);
              }
            }}
            readOnly={readOnly !== undefined ? readOnly : !editable}
            className={`${styles.textarea} ${textareaInputClassname}`} 
          />
        ) : (
          <div style={{ display: "flex", gap: "20px" }}>
            {" "}
            <input
              ref={inputRef}
              type={type}
              placeholder={placeholder}
              name={name}
              value={newValue}
              onChange={(e) => {
                const value = e.target.value;
              
                if (value?.length <= newValue?.length || value?.length <= limit) {
                  setNewValue(value);
                }
              }}
              readOnly={readOnly !== undefined ? readOnly : !editable}
              className={`${styles.inputTypeClient} ${textareaInputClassname}`}
            />
            {typeclient && (
              <div
                className={`${styles.typeClient} ${readOnly ? styles.typeClientActivate : styles.typeClientDisabled}`}
              >
                <button
                  className={sectionSelected == 0 && styles.selected}
                  onClick={() => setSectionSelected(0)}
                  type="button"
                  disabled={readOnly}
                >
                  {t('servicio')}
                </button>
                <button
                  className={sectionSelected == 1 && styles.selected}
                  onClick={() => setSectionSelected(1)}
                  type="button"
                  disabled={readOnly}
                >
                  {t('product')}
                </button>
              </div>
            )}
          </div>
        )}
        {verify && editable && (
          <span
            className={styles.verify}
            onClick={handlePasswordVerify}
            style={{ cursor: "pointer" }}
          >
            {t("verify")}
          </span>
        )}
      </div>
      {limit && showLimit&& (
        <span className={styles.limit}>
          {newValue?.length || 0}/{limit}
        </span>
      )}
      {emailError && <span className={styles.error}>{emailError}</span>}
      {passwordError && <span className={styles.error}>{passwordError}</span>}
    </div>
  );
};

export default EditableInput;
