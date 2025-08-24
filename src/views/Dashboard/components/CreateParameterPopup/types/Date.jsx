import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as CircleLock } from "../../../assets/GrayClock.svg";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import styles from "../CreateParameterPopup.module.css";
import LabelParameters from "../LabelParameters";
import BasicAdvancedSelector from "../components/BasicAdvancedSelector";
import OptionsSwitchComponent from "../../OptionsSwichComponent/OptionsSwitchComponent";
const Date = ({
  parameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const [t] = useTranslation("");
  const handleModeChange = (mode) => {
    handleChange({ name: "mode", newValue: mode });
  };

  console.log("parameterData?.dateRange", parameterData?.dateRange);
  return (
    // <div>
    //   <LabelParameters
    //     value={parameterData.date}
    //     text={"date"}
    //     editingInput={editingInput}
    //     setEditingInput={setEditingInput}
    //   >
    <div>
      <BasicAdvancedSelector
        selectedMode={parameterData.mode}
        onModeChange={handleModeChange}
      />
        <>
          {!parameterData?.dateRange && (
            <>
              <p className={styles.textContent}>{t("date")}</p>
              <CustomDropdown
                editable={true}
                editing={true}
                options={[
                  t("length"),
                  t("weight"),
                  t("volumen"),
                  t("time"),
                  t("speed"),
                ]}
                selectedOption={parameterData?.date}
                setSelectedOption={(option) =>
                  handleChange({ name: "date", newValue: option })
                }
                father={"automate"}
                placeholder={t("selectADate")}
              />
            </>
          )}

          <div className={styles.corporateEmailContainer}>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"0"}
              blackBg={true}
              isChecked={parameterData?.dateRange || false}
              setIsChecked={(value) => {
                console.log("value", value);
                handleChange({ name: "dateRange", newValue: value });
              }}
            />
            <p>{t("dateRange")}</p>
          </div>
          {parameterData?.dateRange && (
            <>
              <CustomDropdown
                editable={true}
                editing={true}
                options={[t("today")]}
                selectedOption={parameterData?.from}
                setSelectedOption={(option) =>
                  handleChange({ name: "from", newValue: option })
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
                selectedOption={parameterData?.to}
                setSelectedOption={(option) =>
                  handleChange({ name: "to", newValue: option })
                }
                father={"automate"}
                placeholder={t("to")}
              />
            </>
          )}
        </>
        
        {parameterData.mode !== "basic" && (
        <div className={styles.dateFormatContainer}>
              <p className={styles.textContent}>{t("dateFormat")}</p>

              <div className={styles.dateFormatOption}>
                <input
                  type="radio"
                  name="dateFormat"
                  value="YYYY-MM-DD"
                  checked={parameterData?.dateFormat === "YYYY-MM-DD"}
                  onChange={() => handleChange({ name: "dateFormat", newValue: "YYYY-MM-DD" })}
                />
                <p>YYYY-MM-DD</p>
              </div>
              <div className={styles.dateFormatOption}>
                <input
                  type="radio"
                  name="dateFormat"
                  value="MM-DD-YYYY"
                  checked={parameterData?.dateFormat === "MM-DD-YYYY"}
                  onChange={() => handleChange({ name: "dateFormat", newValue: "MM-DD-YYYY" })}
                />
                <p>MM-DD-YYYY</p>
              </div>
              <div className={styles.dateFormatOption}>
                <input
                  type="radio"
                  name="dateFormat"
                  value="DD-MM-YYYY"
                  checked={parameterData?.dateFormat === "DD-MM-YYYY"}
                  onChange={() => handleChange({ name: "dateFormat", newValue: "DD-MM-YYYY" })}
                />
                <p>DD-MM-YYYY</p>
              </div>
              <div className={styles.dateFormatOption}>
                <input
                  type="radio"
                  name="dateFormat"
                  value="DD Month YYYY"
                  checked={parameterData?.dateFormat === "DD Month YYYY"}
                  onChange={() => handleChange({ name: "dateFormat", newValue: "DD Month YYYY" })}
                />
                <p>DD Month YYYY</p>
              </div>
              <p className={styles.textContent}>{t("availablesDays")}</p>
        
        <div className={styles.availablesDaysContainer}>
<div>
  <span>{t('minValue')}</span>
<input value={parameterData?.minValueDate} type="text" placeholder="YYYY-MM-DD" onChange={(e) => handleChange({ name: "minValueDate", newValue: e.target.value })}/>

</div>
<div>
  <span>{t('maxValue')}</span>
<input value={parameterData?.maxValueDate} type="text" placeholder="YYYY-MM-DD" onChange={(e) => handleChange({ name: "maxValueDate", newValue: e.target.value })}/>

</div>
        </div>
        </div>
      )}
    </div>
    //   </LabelParameters>
    // </div>
  );
};

export default Date;
