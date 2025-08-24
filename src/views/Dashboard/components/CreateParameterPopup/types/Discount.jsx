import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as AddBlack } from "../../../assets/addBlack.svg";
import { ButtonDiferentContentScreen } from "../../Button/Button";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import styles from "../CreateParameterPopup.module.css";
import LabelParameters from "../LabelParameters";
const Discount = ({
  parameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const [t] = useTranslation("Contacts");
  const [selectedType, setSelectedType] = useState("all");

  const discountTypes = [
    { key: "all", label: t("all") },
    { key: "percentage", label: t("percentage") },
    { key: "fixed", label: t("fixedAmount") },
    { key: "free_shipping", label: t("freeShipping") },
  ];

  const filteredDiscounts =
  selectedType === "all"
    ? parameterData.discounts
    : parameterData?.discounts?.filter((d) => d.type === selectedType);

  return (
    <div>
      <LabelParameters
        value={parameterData.discount}
        text={"discount"}
        editingInput={editingInput}
        setEditingInput={setEditingInput}
      >
        <div className={styles.discountContainer}>
          <ButtonDiferentContentScreen
            threshold={768}
            smallContent={<AddBlack />}
            largeContent={
              <>
                <AddBlack />
                {t("newDiscount")}
              </>
            }
            buttonProps={{
              type: "white",
              action: (e) => addPayMethod(e),
              headerStyle: { borderRadius: "999px" },
            }}
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
            selectedOption={parameterData?.discount}
            setSelectedOption={(option) =>
              handleChange({ name: "discount", newValue: option })
            }
            father={"automate"}
          />
        </div>
      </LabelParameters>
{editingInput && (

     <>
      <div className={styles.discountTypeButtons}>
        {discountTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => setSelectedType(type.key)}
            className={`${styles.discountTypeButton} ${
              selectedType === type.key ? styles.activeButton : ""
            }`}
          >
            {type.label} <span> {filteredDiscounts?.length || 0}</span>
          </button>
        ))}
      </div>

      <div className={styles.discountsList}>
        {filteredDiscounts?.length > 0 ? (
          filteredDiscounts.map((discount, index) => (
            <div key={index}></div>
          ))
        ) : (
          <></>
        )}
      </div>
      </>
)}
  
    </div>
  );
};

export default Discount;
