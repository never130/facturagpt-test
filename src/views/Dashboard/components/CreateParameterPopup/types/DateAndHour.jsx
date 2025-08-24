import React from "react";
import BasicAdvancedSelector from "../components/BasicAdvancedSelector";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import { useTranslation } from "react-i18next";
import styles from "../CreateParameterPopup.module.css";
import OptionsSwitchComponent from "../../OptionsSwichComponent/OptionsSwitchComponent";
import Button from "../../Button/Button";

const DateAndHour = ({
  parameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
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
          {!parameterData?.dateAndHourRange && (
            <>
              <p className={styles.textContent}>{t("dateAndHour")}</p>
              <div className={styles.dateAndHourContainer}>
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
                  selectedOption={parameterData?.hour}
                  setSelectedOption={(option) =>
                    handleChange({ name: "hour", newValue: option })
                  }
                  father={"automate"}
                  placeholder={t("selectADate")}
                />
                {/* <p className={styles.textContent}>{t("date")}</p> */}
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
              </div>
            </>
          )}
          <div className={styles.corporateEmailContainer}>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"0"}
              blackBg={true}
              isChecked={parameterData?.dateAndHourRange || false}
              setIsChecked={(value) => {
                console.log("value", value);
                handleChange({ name: "dateAndHourRange", newValue: value });
              }}
            />
            <p>{t("dateAndHourRange")}</p>
          </div>
          {parameterData?.dateAndHourRange && (
            <>
              <div className={styles.dateAndHourRangeContainer}>
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
                  selectedOption={parameterData?.from}
                  setSelectedOption={(option) =>
                    handleChange({ name: "from", newValue: option })
                  }
                  father={"automate"}
                  placeholder={t("from")}
                />

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
                  selectedOption={parameterData?.to}
                  setSelectedOption={(option) =>
                    handleChange({ name: "to", newValue: option })
                  }
                  father={"automate"}
                  placeholder={t("to")}
                />
              </div>
              <div className={styles.dateAndHourRangeContainer}>
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
                    t("length"),
                    t("weight"),
                    t("volumen"),
                    t("time"),
                    t("speed"),
                  ]}
                  selectedOption={parameterData?.to}
                  setSelectedOption={(option) =>
                    handleChange({ name: "to", newValue: option })
                  }
                  father={"automate"}
                  placeholder={t("to")}
                />
              </div>
            </>
          )}
        </>
        {parameterData.mode !== "basic" && (
        <>
          <div className={styles.dateFormatContainer}>
            <p className={styles.textContent}>{t("hourFormat")}</p>

            <div className={styles.dateFormatOption}>
              <input
                type="radio"
                name="hourFormat"
                value="AM-PM"
                checked={parameterData?.hourFormat === "AM-PM"}
                onChange={() =>
                  handleChange({ name: "hourFormat", newValue: "AM-PM" })
                }
              />
              <p>AM-PM</p>
            </div>
            <div className={styles.dateFormatOption}>
              <input
                type="radio"
                name="hourFormat"
                value="24H"
                checked={parameterData?.hourFormat === "24H"}
                onChange={() =>
                  handleChange({ name: "hourFormat", newValue: "24H" })
                }
              />
              <p>24H</p>
            </div>

            <p className={styles.textContent}>{t("availablesHours")}</p>

            <div className={styles.availablesDaysContainer}>
              <div>
                <span>{t("minValue")}</span>

                <div className={styles.availablesHoursInput}>
                  <Button type="white">-</Button>
                  <input type="text" placeholder="00:00:00" />
                  <Button type="white">+</Button>
                </div>
              </div>
              <div>
                <span>{t("maxValue")}</span>
                <div className={styles.availablesHoursInput}>
                  <Button type="white">-</Button>
                  <input type="text" placeholder="00:00:00" />
                  <Button type="white">+</Button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.dateFormatContainer}>
            <p className={styles.textContent}>{t("dateFormat")}</p>

            <div className={styles.dateFormatOption}>
              <input
                type="radio"
                name="dateFormat"
                value="YYYY-MM-DD"
                checked={parameterData?.dateFormat === "YYYY-MM-DD"}
                onChange={() =>
                  handleChange({ name: "dateFormat", newValue: "YYYY-MM-DD" })
                }
              />
              <p>YYYY-MM-DD</p>
            </div>
            <div className={styles.dateFormatOption}>
              <input
                type="radio"
                name="dateFormat"
                value="MM-DD-YYYY"
                checked={parameterData?.dateFormat === "MM-DD-YYYY"}
                onChange={() =>
                  handleChange({ name: "dateFormat", newValue: "MM-DD-YYYY" })
                }
              />
              <p>MM-DD-YYYY</p>
            </div>
            <div className={styles.dateFormatOption}>
              <input
                type="radio"
                name="dateFormat"
                value="DD-MM-YYYY"
                checked={parameterData?.dateFormat === "DD-MM-YYYY"}
                onChange={() =>
                  handleChange({ name: "dateFormat", newValue: "DD-MM-YYYY" })
                }
              />
              <p>DD-MM-YYYY</p>
            </div>
            <div className={styles.dateFormatOption}>
              <input
                type="radio"
                name="dateFormat"
                value="DD Month YYYY"
                checked={parameterData?.dateFormat === "DD Month YYYY"}
                onChange={() =>
                  handleChange({
                    name: "dateFormat",
                    newValue: "DD Month YYYY",
                  })
                }
              />
              <p>DD Month YYYY</p>
            </div>
            <p className={styles.textContent}>{t("availablesDays")}</p>

            <div className={styles.availablesDaysContainer}>
              <div>
                <span>{t("minValue")}</span>
                <input type="text" placeholder="YYYY-MM-DD" />
              </div>
              <div>
                <span>{t("maxValue")}</span>
                <input type="text" placeholder="YYYY-MM-DD" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateAndHour;
