import React, { useState, useRef, useEffect } from "react";
import styles from "./FileInput.module.css";
import { useTranslation } from "react-i18next";

const EditableInput = ({ 
  configuration, 
  handleConfigurationChange,
  isTextarea = false,
  limit = 500,
  showLimit = true,
  label = 'Nombre de la Automatización',
  placeholder = 'Nombre de la Automatización',
  labelClassName = '',
  editable: _editable = false
 }) => {
  const { t } = useTranslation("accountSetting");
  const [sectionSelected, setSectionSelected] = useState(0);

  const [editable, setEditable] = useState(_editable);
  const [newValue, setNewValue] = useState("");
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
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(
        emailRegex.test(newValue) ? "" : t('emailAddressNotValid')
      );
    }
  }, [newValue]);

  useEffect(() => {
    if (
      configuration.inputValue &&
      JSON.stringify(configuration.inputValue) !== newValue
    ) {
      setNewValue(configuration?.inputValue);
    } else if (!configuration.inputValue) {
      setNewValue("");
    }
  }, [configuration.inputValue]);

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
      handleConfigurationChange("inputValue", newValue);
    }
    setEditable(!editable);
  };

  const options = true;
  const readOnly = false;
  const labelOptions = false;
  const type = "text";
  const initialValue = configuration?.inputValue || "";
  const typeclient = false;
  const verify = false;
  const name = t('automation');

  return (
    <div className={styles.editableInputContainer}>
      <div className={styles.editableInputHeader}>
        {!options && (
          <div
            onClick={handleEditClick}
            style={{ cursor: readOnly ? "not-allowed" : "pointer" }}
          >
            {editable ? t('save') : t('edit')}
          </div>
        )}
      </div>

      <div className={styles.editableInput}>
        {isTextarea ? (
          <div className={styles.textareaContainer}>
            <textarea
              resize="none"
              ref={inputRef}
              placeholder={placeholder}
              name={name}
              value={newValue}
              onChange={(e) => {
                setNewValue(e.target.value);
                handleConfigurationChange("inputValue", e.target.value);
              }}
              readOnly={readOnly !== undefined ? readOnly : !editable}
              className={`${styles.textarea} ${styles.inputTypeClient}`} 
            />
            <div>
              {showLimit && (
                <span>{newValue.length}/{limit}</span>
              )}
            </div>
          </div>
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
                setNewValue(e.target.value);
                handleConfigurationChange("inputValue", e.target.value);
              }}
              readOnly={readOnly !== undefined ? readOnly : !editable}
              className={styles.inputTypeClient}
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
                  {t('service')}
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
      {emailError && <span className={styles.error}>{emailError}</span>}
      {passwordError && <span className={styles.error}>{passwordError}</span>}
    </div>
  );
};

export default EditableInput;
