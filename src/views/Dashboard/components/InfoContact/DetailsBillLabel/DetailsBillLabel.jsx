import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import styles from "./DetailsBillLabel.module.css";
import DetailsBillInputs from "../DetailsBillInputs/DetailsBillInputs";
import DeleteButton from "../../DeleteButton/DeleteButton";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { deleteBillingDetail } from "../../../../../actions/user";
import Button from "../../Button/Button";

const DetailsBillLabel = ({
  user, 
  billingDetails, 
  setBillingDetails,
  handleSave 
}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation("navbarAdmin");
  const { contact } = useSelector((state) => state.contacts);

  useEffect(() => {
    if (contact?.clientData?.infoBill) {
      setBillingDetails(contact.clientData.infoBill);
    } else {
      setBillingDetails([]);
    }
  }, [contact]);

  const handleAddBillingDetail = () => {
    setBillingDetails((prev) => [
      ...Array.isArray(prev) ? prev : [],
      {
        _id: uuidv4(),
        email: "",
        zipCode: "",
        population: "",
        province: "",
        country: "",
        default: false,
        dni: "",
        taxNumber: "",
      },
    ]);
    
  };

  const handleDeleteBillingDetail = async(id) => {
    await dispatch(deleteBillingDetail({email:user?.email, billingDetailId:id}))
    setBillingDetails((prev) => prev.filter((detail) => detail._id !== id));
  };

  const [selectedBillIndex, setSelectedBillIndex] = useState(null);
  const [currentBill, setCurrentBill] = useState({
    email: "",
    zipCode: "",
    population: "",
    province: "",
    country: "",
    default: false,
    dni: "",
    taxNumber: "",
  });

  const handleEditBillingDetail = (index) => {
    setSelectedBillIndex(index);
    setCurrentBill({ ...billingDetails[index] });
  };

  const handleBillingDetailChange = (field, value, index) => {
    setCurrentBill((prev) => {
      const updatedBill = { ...prev, [field]: value };

      if (field === "default" && value) {
        setBillingDetails((prevData) =>
          prevData.map((bill, i) =>
            i === index
              ? { ...bill, default: true }
              : { ...bill, default: false }
          )
        );
      }

      return updatedBill;
    });
  };

  const handleSaveBillingDetail = () => {
    if (selectedBillIndex !== null) {
      setBillingDetails((prev) => {
        const updatedInfoBill = [...prev];
        updatedInfoBill[selectedBillIndex] = { ...currentBill };
        return updatedInfoBill;
      });

      setSelectedBillIndex(null);
    }
  };

  return (
    <div className={styles.label}>
      <div>
        <div className={styles.detailsBill}>
          <div className={styles.optionsDetailsBill}>
            <Button type="white" headerStyle={{borderRadius:"999px"}} action={handleAddBillingDetail}>
              {t("add")}
            </Button>
            <Button  action={handleSave}>
              {t("save")}
            </Button>
          </div>
        </div>
        <div className={styles.infoBill}>
          {billingDetails?.length > 0 ? (
            billingDetails
              .sort((a, b) => (b.default === true) - (a.default === true))
              .map((bill, index) => (
                <div key={index} style={{ width: "100%" }}>
                  <div
                    className={styles.infoBillContainer}
                    style={{ flexDirection: "row" }}
                  >
                    <div className={styles.info}>
                      <p>
                        <span> {bill.email || t("address")},</span>
                        <span> {bill.population || t("population")},</span>
                        <span> {bill.province || t("province")},</span>
                        <span>{bill.zipCode || t("zipCode")},</span>
                        <span> {bill.country || t("country")}</span>
                      </p>
                      <div
                        className={styles.button}
                        type="button"
                        onClick={() => {
                          selectedBillIndex === index
                            ? handleSaveBillingDetail()
                            : handleEditBillingDetail(index);
                        }}
                      >
                        {selectedBillIndex === index ? t("save") : t("edit")}
                      </div>
                    </div>
                    <DeleteButton
                      action={() => handleDeleteBillingDetail(bill._id)}
                    />
                  </div>
                  {selectedBillIndex === index && (
                    <DetailsBillInputs
                    email={currentBill.email || ""}
                      population={currentBill.population || ""}
                      province={currentBill.province || ""}
                      zipCode={currentBill.zipCode || ""}
                      country={currentBill.country || ""}
                      defaultInput={currentBill.default}
                      handleChange={(key, value) =>
                        handleBillingDetailChange(key, value)
                      }
                      showCheckbox={true}
                    />
                  )}
                </div>
              ))
          ) : (
            <span>{t('noBillingDetails')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsBillLabel;
