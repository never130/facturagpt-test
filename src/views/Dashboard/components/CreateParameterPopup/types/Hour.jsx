import React from 'react'
import BasicAdvancedSelector from '../components/BasicAdvancedSelector'
import CustomDropdown from '../../CustomDropdown/CustomDropdown'
import styles from '../CreateParameterPopup.module.css'
import OptionsSwitchComponent from '../../OptionsSwichComponent/OptionsSwitchComponent'
import { useTranslation } from 'react-i18next'
import Button from '../../Button/Button'

const Hour = ({parameterData, handleChange}) => {
    const [t] = useTranslation("");
  const handleModeChange = (mode) => {
    handleChange({ name: "mode", newValue: mode });
  };
  return (
    <div>
    <BasicAdvancedSelector
      selectedMode={parameterData.mode}
      onModeChange={handleModeChange}
    />
    
      <>
        {!parameterData?.hourRange && (
          <>
            <p className={styles.textContent}>{t("hour")}</p>
            <CustomDropdown
              editable={true}
              editing={true}
              options={[
                t("hour"),
                t("minute"),
                t("second"),
              ]}
              selectedOption={parameterData?.hour}
              setSelectedOption={(option) =>
                handleChange({ name: "hour", newValue: option })
              }
              father={"automate"}
              placeholder={t("selectAnHour")}
            />
          </>
        )}

        <div className={styles.corporateEmailContainer}>
          <OptionsSwitchComponent
            border={"none"}
            marginLeft={"0"}
            blackBg={true}
            isChecked={parameterData?.hourRange || false}
            setIsChecked={(value) => {
              console.log("value", value);
              handleChange({ name: "hourRange", newValue: value });
            }}
          />
          <p>{t("hourRange")}</p>
        </div>
        {parameterData?.hourRange && (
          <>
            <CustomDropdown
              editable={true}
              editing={true}
              options={[t("today")]}
              selectedOption={parameterData?.fromHour}
              setSelectedOption={(option) =>
                handleChange({ name: "fromHour", newValue: option })
              }
              father={"automate"}
              placeholder={t("from")}
            />{" "}
            <CustomDropdown
              editable={true}
              editing={true}
              options={[
                t("today"),
                t("yesterday"),
                t("tomorrow"),
                t("lastWeek"),
                t("nextWeek"),
                t("lastMonth"),
                t("nextMonth"),
                t("lastYear"),
                t("nextYear"),
              ]}
              selectedOption={parameterData?.toHour}
              setSelectedOption={(option) =>
                handleChange({ name: "toHour", newValue: option })
              }
              father={"automate"}
              placeholder={t("to")}
            />
          </>
        )}
      </>
      {parameterData.mode !== "basic" && (
      <div className={styles.dateFormatContainer}>
            <p className={styles.textContent}>{t("hourFormat")}</p>

            <div className={styles.dateFormatOption}>
              <input
                type="radio"
                name="hourFormat"
                value="AM-PM"
                checked={parameterData?.hourFormat === "AM-PM"}
                onChange={() => handleChange({ name: "hourFormat", newValue: "AM-PM" })}
              />
              <p>AM-PM</p>
            </div>
            <div className={styles.dateFormatOption}>
              <input
                type="radio"
                name="hourFormat"
                value="24H"
                checked={parameterData?.hourFormat === "24H"}
                onChange={() => handleChange({ name: "hourFormat", newValue: "24H" })}
              />
              <p>24H</p>
            </div>
         
            <p className={styles.textContent}>{t("availablesHours")}</p>
      
      <div className={styles.availablesDaysContainer}>
<div>
<span>{t('minValue')}</span>

<div className={styles.availablesHoursInput}>
  <Button type='white'>-</Button>
  <input type="text" placeholder="00:00:00"/>
  <Button type='white'>+</Button>
</div>

</div>
<div>
<span>{t('maxValue')}</span>
<div className={styles.availablesHoursInput}>
  <Button type='white'>-</Button>
  <input type="text" placeholder="00:00:00"/>
  <Button type='white'>+</Button>
</div>

</div>
      </div>
      </div>
    )}
  </div>
  )
}

export default Hour