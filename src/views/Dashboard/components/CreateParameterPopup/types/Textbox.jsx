import React, { useState } from "react";
import styles from "../CreateParameterPopup.module.css";
import { useTranslation } from "react-i18next";
import LabelParameters from "../LabelParameters";
import BasicAdvancedSelector from "../components/BasicAdvancedSelector";
import Button from "../../../components/Button/Button";
import EditableField from "../components/EditableField";

const Textbox = ({
  parameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const [t] = useTranslation("Contacts");

  const handleIncrement = (fieldName) => {
    const currentValue = parameterData[fieldName] || 0;
    handleChange({ target: { name: fieldName, value: currentValue + 1 } });
  };

  const handleDecrement = (fieldName) => {
    const currentValue = parameterData[fieldName] || 0;
    if (currentValue > 0) {
      handleChange({ target: { name: fieldName, value: currentValue - 1 } });
    }
  };

  return (
    <div>
      <BasicAdvancedSelector
        selectedMode={parameterData.mode || "basic"}
        onModeChange={(mode) =>
          handleChange({ target: { name: "mode", value: mode } })
        }
      />

      {/* <LabelParameters value={parameterData.number} text={'textBox'} editingInput={editingInput} setEditingInput={setEditingInput} direction="column"> */}
        <>
          <p className={styles.textContent}>{t("textBox")}</p>

          <textarea
            name="textBox"
            value={parameterData.textBox}
            onChange={handleChange}
            placeholder={t("parameterValue")}
          />
        </>
        
        {parameterData.mode !== "basic" && (
          <div className={styles.advancedModeTextbox}>
            <div>
              <p>{t("minLength")}</p>
              <div>
                <Button 
                  type="white" 
                  action={() => handleDecrement("minLength")}
                >
                  -
                </Button>
                <input
                  type="number"
                  name="minLength"
                  value={parameterData.minLength || 0}
                  onChange={handleChange}
                />
                <Button 
                  type="white" 
                  action={() => handleIncrement("maxLength")}
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <p>{t("maxLength")}</p>
              <div>
                <Button 
                  type="white" 
                  action={() => handleDecrement("maxLength")}
                >
                  -
                </Button>
                <input
                  type="number"
                  name="maxLength"
                  value={parameterData.maxLength || 0}
                  onChange={handleChange}
                />
                <Button 
                  type="white" 
                  action={() => handleIncrement("maxLength")}
                >
                  +
                </Button>
              </div>
            </div>
          
          
            <EditableField
              title={t("regex")}
              type="text"
              name="regex"
              value={parameterData.regex}
              onChange={handleChange}
              placeholder="~[a-zA-Z]+$"
              defaultValue="~[a-zA-Z]+$"
            />
          </div>
        )}
      {/* </LabelParameters> */}
    </div>
  );
};

export default Textbox;
