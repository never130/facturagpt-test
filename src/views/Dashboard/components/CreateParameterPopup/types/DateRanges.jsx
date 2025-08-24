import React from 'react';
import { useTranslation } from "react-i18next";
import { ReactComponent as CircleLock } from '../../../assets/GrayClock.svg';
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import styles from "../CreateParameterPopup.module.css";
import LabelParameters from "../LabelParameters";
const DateRanges = ({
  parameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const [t] = useTranslation("Contacts");

  return (
    <>
      <LabelParameters
        value={parameterData.dateFrom}
        text={"dateRange"}
        editingInput={editingInput}
        setEditingInput={setEditingInput}
      >
        <div className={styles.dateRanges}>
          <div className={styles.dateContainer}>
            <CircleLock />
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
              selectedOption={parameterData?.dateFrom}
              setSelectedOption={(option) =>
                handleChange({ name: "dateFrom", newValue: option })
              }
              father={"automate"}
            />
          </div>
          <div className={styles.dateContainer}>
            <CircleLock />
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
              selectedOption={parameterData?.dateUntil}
              setSelectedOption={(option) =>
                handleChange({ name: "dateUntil", newValue: option })
              }
              father={"automate"}
            />
          </div>
        </div>
      </LabelParameters>
    </>
  )
}

export default DateRanges