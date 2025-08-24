import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../CreateParameterPopup.module.css";
import BasicAdvancedSelector from "../components/BasicAdvancedSelector";

import MiniWordDocs from "../../Automate/Components/SectionsAutomate/MiniWordDocs/MiniWordDocs";


import Button from "../../Button/Button";
import EditableField from "../components/EditableField";
const RichTextEditor = ({
  parameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const [t] = useTranslation("");

  const handleModeChange = (mode) => {
    handleChange({ name: "mode", newValue: mode });
  };
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
        selectedMode={parameterData.mode}
        onModeChange={handleModeChange}
      />
      <p className={styles.textContent}>{t("richTextEditor")}</p>
       
        <div>
          {/* <MiniWordDocs
            configuration={parameterData}
            handleConfigurationChange={(key, value) =>
              handleChange({ name: "noteText", newValue: value })
            }
            initialContent={parameterData.noteText}
            autoResize={true}
            customStyles={{
              width: "100%",
            }}
          /> */}
          <div className={styles.richTextEditorControls}>
            <Button>{t("generateWithAI")}</Button>
          </div>
        </div>
        {parameterData.mode !== "basic" && (
        <div>
          <div className={styles.advancedModeTextbox}>
          
            <div>
              <p>{t("minValue")}</p>
              <div>
                <Button type="white" action={() => handleDecrement("minValue")}>
                  -
                </Button>
                <input
                  type="number"
                  name="minValue"
                  value={parameterData.minValue || 0}
                  onChange={handleChange}
                />
                <Button type="white" action={() => handleIncrement("minValue")}>
                  +
                </Button>
              </div>
            </div>
            <div>
              <p>{t("maxValue")}</p>
              <div>
                <Button type="white" action={() => handleDecrement("maxValue")}>
                  -
                </Button>
                <input
                  type="number"
                  name="maxValue"
                  value={parameterData.maxValue || 0}
                  onChange={handleChange}
                />
                <Button type="white" action={() => handleIncrement("maxValue")}>
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
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
