import React from 'react'
import BasicAdvancedSelector from '../components/BasicAdvancedSelector'
import { useTranslation } from 'react-i18next'
import styles from '../CreateParameterPopup.module.css'
import Button from '../../Button/Button'
import EditableField from '../components/EditableField'
const Coordinates = ({parameterData, handleChange}) => {
    const { t } = useTranslation();

    
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

        <div>
            
            <EditableField
            title={t("latitude")}
            type="text"
            name="latitude"
            value={parameterData.latitude}
            onChange={handleChange}
            placeholder={`00°00'0.00" N, 0°00'00.00" E`}
          />
           <EditableField
            title={t("longitude")}
            type="text"
            name="longitude"
            value={parameterData.longitude}
            onChange={handleChange}
            placeholder="0.0000"
          />
        </div>
        {parameterData.mode !== "basic" && (
        <div>
               <div className={`${styles.advancedModeTextbox} ${styles.coordinatesPrecision}`}>
          <div>
            <p>{t("coordinatesPrecision")}</p>
            <div>
              <Button 
                type="white" 
                action={() => handleDecrement("coordinatesPrecision")}
              >
                -
              </Button>
              <input
                type="number"
                name="coordinatesPrecision"
                value={parameterData.coordinatesPrecision || 0}
                onChange={handleChange}
              />
              <Button 
                type="white" 
                action={() => handleIncrement("coordinatesPrecision")}
              >
                +
              </Button>
            </div>
          </div>
          </div>
<div className={styles.dateFormatContainer}>
<p className={styles.textContent}>{t("coordinatesFormat")}</p>

          <div className={styles.dateFormatOption}>
                <input
                  type="radio"
                  name="coordinatesFormat"
                  value="decimal/degrees"
                  checked={parameterData?.coordinatesFormat === "decimal/degrees"}
                  onChange={() => handleChange({ name: "coordinatesFormat", newValue: "decimal/degrees" })}
                  />
                <p>decimal/degrees</p>
              </div>
          <div className={styles.dateFormatOption}>
                <input
                  type="radio"
                  name="coordinatesFormat"
                  value="minutes/seconds"
                  checked={parameterData?.coordinatesFormat === "minutes/seconds"}
                  onChange={() => handleChange({ name: "coordinatesFormat", newValue: "minutes/seconds" })}
                  />
                <p>minutes/seconds</p>
              </div>
                  </div>
        </div>
      )}
    </div>
  )
}

export default Coordinates