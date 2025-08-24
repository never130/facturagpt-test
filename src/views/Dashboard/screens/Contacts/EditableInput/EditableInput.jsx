import React, { useState } from "react";
import styles from "./EditableInput.module.css";
import { ReactComponent as Minus } from "../../../assets/minus.svg";
import { ReactComponent as Pencil } from "../../../assets/pencilEdit.svg";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../../../components/CustomDropdown/CustomDropdown";
const PhoneNumberInput = ({ isEditing, onDelete, onChange }) => {
  return (
    <div className={styles.phoneContainer}>
      <select disabled={!isEditing}>
        <option value="34">España, (+34)</option>
        <option value="1">Estados Unidos, (+1)</option>
        <option value="52">México, (+52)</option>
        <option value="54">Argentina, (+54)</option>
        <option value="55">Brasil, (+55)</option>
        <option value="44">Reino Unido, (+44)</option>
        <option value="33">Francia, (+33)</option>
        <option value="49">Alemania, (+49)</option>
      </select>
      <input type="text" placeholder="000 000 000" disabled={!isEditing} />
      <div
        className={styles.delete}
        onClick={onDelete}
        style={{ background: !isEditing && "#dd7a84" }}
      >
        <Minus className={styles.icon} />
      </div>
    </div>
  );
};
const Categories = ({ onChange, isEditing }) => {
  return (
    <div>
      <select onChange={onChange} disabled={!isEditing}>
        <option value="34">España, (+34)</option>
        <option value="1">Estados Unidos, (+1)</option>
        <option value="52">México, (+52)</option>
        <option value="54">Argentina, (+54)</option>
        <option value="55">Brasil, (+55)</option>
        <option value="44">Reino Unido, (+44)</option>
        <option value="33">Francia, (+33)</option>
        <option value="49">Alemania, (+49)</option>
      </select>
    </div>
  );
};

const EditableInput = ({
  label,
  nameInput,
  placeholderInput,
  children,
  type = "text",
  onClick,
  isEditing,
  value,
  onChange,
  options = true,
  phone = false,
  rigthText,
  newFormat,
  optionsDropdown,
  containerType
}) => {
  const [phoneInputs, setPhoneInputs] = useState([]);
  const [t] = useTranslation("InfoContact");

  const toggleEditing = () => {
    onClick();
  };

  const addPhoneNumberInput = () => {
    setPhoneInputs((prevInputs) => [
      ...prevInputs,
      <PhoneNumberInput
        onChange={onChange}
        key={prevInputs.length}
        isEditing={isEditing}
        onDelete={() => removePhoneNumberInput(prevInputs.length)}
      />,
    ]);
  };

  const removePhoneNumberInput = (index) => {
    if (isEditing)
      setPhoneInputs((prevInputs) => prevInputs.filter((_, i) => i !== index));
  };

  return (
    <label className={styles.labelEditableInput}>
      <div className={styles.row}>
        <p style={{ fontSize: containerType === 'popup' &&  "12px",}}>
          <strong>{label} </strong>
          {rigthText && rigthText}
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          {options && !newFormat && (
            <div className={styles.button} onClick={toggleEditing}>
              {isEditing ? t("save") : t("edit")}
            </div>
          )}
          {phone && (
            <div className={styles.button} onClick={addPhoneNumberInput}>
              {t("addNew")}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: phone && "column",
        }}
      >
        {type === "categories" ? (
          <Categories onChange={onChange} isEditing={isEditing} />
        ) : phone === true ? (
          <>
            {phoneInputs.map((input, index) => (
              <PhoneNumberInput
                key={index}
                isEditing={isEditing}
                onDelete={() => removePhoneNumberInput(index)}
              />
            ))}
            <PhoneNumberInput
              isEditing={isEditing}
              onDelete={() => removePhoneNumberInput(phoneInputs.length)}
            />
          </>
        ) : type == "dropdown" ? (
          <>
          {!isEditing ? (
            <span>{value || placeholderInput}</span>
          ) : (
            <CustomDropdown
            options={optionsDropdown}
            customStyles={styles.noPadding}
            selectedOption={value }
            setSelectedOption={(option) =>
              onChange(option)
            }
          />
          )}
          {newFormat && (
            <div className={styles.buttonEdit} onClick={toggleEditing}>
              <Pencil />
            </div>
          )}
        </>
        ) : type == "textarea" ? (
          <>
            {!isEditing ? (
              <span>{value || placeholderInput}</span>
            ) : (
              <textarea
                type={type}
                placeholder={placeholderInput}
                value={value}
                disabled={!isEditing}
                name={nameInput}
                onChange={onChange}
                className={newFormat && styles.newFormatInputTextarea}
              ></textarea>
            )}
            {newFormat && (
              <div className={styles.buttonEdit} onClick={toggleEditing}>
                <Pencil />
              </div>
            )}
          </>
        ) : (
          <div
            className={newFormat && styles.inputTextareaContainer}
            style={{
              width: isEditing && "100%",
            }}
          >
           { containerType === 'popup' && (!isEditing ? (
            <div className={styles.textPopupContainer}>
              <span>{value || placeholderInput}</span>
            <div className={styles.buttonEdit} onClick={toggleEditing}>
                <Pencil />
              </div>
            </div>
            ) : (
              <div className={styles.inputPopupContainer} >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'start' }}>
               <span style={{width:"auto"}}>{value || placeholderInput}</span>
               <div className={styles.buttonEdit} onClick={toggleEditing}>
                <Pencil />
              </div>
                  </div>
              <input
                type={type}
                placeholder={placeholderInput}
                value={value}
                disabled={!isEditing}
                name={nameInput}
                onChange={onChange}
                className={newFormat && styles.newFormatInputTextarea}
              />
              </div>
            )) }
            { containerType !== 'popup' && (!isEditing ? (
              <span>{value || placeholderInput}</span>
            ) : (
              <input
                type={type}
                placeholder={placeholderInput}
                value={value}
                disabled={!isEditing}
                name={nameInput}
                onChange={onChange}
                className={newFormat && styles.newFormatInputTextarea}
              />
            ))}
            {newFormat && (
              containerType !== 'popup' &&(
              <div className={styles.buttonEdit} onClick={toggleEditing}>
                <Pencil />
              </div>)
            )}
          </div>
        )}
        {children}
      </div>
    </label>
  );
};

export default EditableInput;
