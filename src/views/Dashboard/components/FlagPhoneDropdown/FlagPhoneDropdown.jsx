import React from "react";
import { countryFlags } from "../../../../utils/flags";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import styles from "./FlagPhoneDropdown.module.css";
import { useTranslation } from "react-i18next";
const FlagPhoneDropdown = ({ setSelectedOptionProp, options, editing }) => {
  const [t] = useTranslation("InfoContact");

  return (
    <CustomDropdown
      editable={editing}
      setSelectedOption={setSelectedOptionProp}
      customStyles={styles.FlagsDropdown}
      editing={editing}
      hasObject={true}
      options={countryFlags}
      selectedOption={
        options ? (
          <>
            {
              countryFlags.find((country) => options.startsWith(country.value))
                ?.label
            }
            {
              countryFlags.find((country) => options.startsWith(country.value))
                ?.value
            }
          </>
        ) : (
          t("selectCountry")
        )
      }
    />
  );
};

export default FlagPhoneDropdown;
