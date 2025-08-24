import React, { useEffect, useRef, useState } from "react";
import Button from "../../Button/Button";
import styles from "./EditableRow.module.css";
import { useTranslation } from "react-i18next";


const EditableRow = ({
  name,
  value,
  onValueChange,
  isReadOnly,
  type,
  isPercentage,

  action,
  percentValue,
}) => {
  const [t] = useTranslation("Preview");
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value); 
  const inputRef = useRef(null);
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setInputValue(newValue);
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]); 

  const handleSave = () => {
    if (editing) {
      onValueChange(Number(inputValue), type, false);
    }
    setEditing(!editing);
  };

  return (
    <div className={styles.EditableRowContainer}>
      <label>
        <p>{name}:</p>
        <Button type="button" action={handleSave}>
          {editing ? t("save") : t("edit")}
        </Button>
      </label>

      {isPercentage && (
        <button
          onClick={action}
          className={styles.addPercent}
          disabled={!editing}
        >
          {t("add")} {name}
        </button>
      )}

      <div className={styles.infoTotal}>
        <input
          ref={inputRef}
          type="number"
          value={inputValue} 
          onChange={handleChange}
          disabled={!editing}
        />
        {isPercentage && !isReadOnly && (
          <>
            <span>{percentValue || "0"}%</span>
          </>
        )}
      </div>
    </div>
  );
};

export default EditableRow;
