import React from 'react';
import stylesBilling from './billingDetails.module.css';
import styles from "../../views/Dashboard/components/NewContact/NewContact.module.css";
import { useTranslation } from "react-i18next";
import Button, { ButtonDiferentContentScreen } from "../../views/Dashboard/components/Button/Button";
import DeleteButton from "../../views/Dashboard/components/DeleteButton/DeleteButton";
import DetailsBillInputs from "../../views/Dashboard/components/InfoContact/DetailsBillInputs/DetailsBillInputs";
import PayMethod from "../../views/Dashboard/components/PayMethod/PayMethod";
import { ReactComponent as AddBlack } from "../../views/Dashboard/assets/addBlack.svg";
import { ReactComponent as Pencil } from "../../views/Dashboard/assets/pencilEdit.svg";
import { ReactComponent as BlackCheckboxIcon } from "../../views/Dashboard/assets/blackCheckboxIcon.svg";


const BillingDetails = ({
    contactData,
    handleSaveBillingDetail,
    handleAddBillingDetail,
    selectedBillIndex,
    handleEditBillingDetail,
    setCurrentBill,
    currentBill,
    addPayMethod,
    handleBillingDetailChange,
    setCurrentPayMethod,
    editingIndexPayMethod,
    setEditingIndexPayMethod,
    currentPayMethod,
    handlePayMethodChange,
    setContactData,
    handleDeleteBillingDetail
}) => {
    const [t] = useTranslation("Contacts");

    return (
        <div className={stylesBilling.billingContainer}>
            <h1 className={stylesBilling.title}>{t('billingDetails')}</h1>
            <div className={stylesBilling.containerForm}>
                <div>
                    <div className={styles.detailsBill}>
                        <p>
                            <strong>{t("address")}</strong>
                        </p>
                        <div className={styles.optionsDetailsBill}>
                            <ButtonDiferentContentScreen
                                threshold={768}
                                smallContent={<AddBlack />}
                                largeContent={
                                    <>
                                        <AddBlack />
                                        {t("addAddress")}
                                    </>
                                }
                                buttonProps={{
                                    type: "white",
                                    action: (e) => handleAddBillingDetail(e),
                                    headerStyle: { borderRadius: "999px" },
                                }}
                            />

                            <Button type="green" action={handleSaveBillingDetail}>
                                {t("save")}
                            </Button>
                        </div>
                    </div>
                    <div className={styles.infoBill}>
                        {contactData?.infoBill?.length > 0 ? (
                            [...contactData.infoBill]
                                .sort(
                                    (a, b) =>
                                        (b.default === true) - (a.default === true)
                                )
                                .map((bill, index) => (
                                    <div className={styles.billingDetailsContainer}>
                                        {" "}
                                        <div
                                            key={index}
                                            className={styles.infoBillContainer}
                                            style={{ flexDirection: "row" }}
                                        >
                                            <div className={styles.info}>
                                                <p>
                                                    {" "}
                                                    {bill.default && <BlackCheckboxIcon />}
                                                    <span>
                                                        {" "}
                                                        {bill.address || t("address")},
                                                    </span>
                                                    <span>
                                                        {" "}
                                                        {bill.population || t("population")},
                                                    </span>
                                                    <span>
                                                        {" "}
                                                        {bill.province || t("province")},
                                                    </span>
                                                    <span>
                                                        {" "}
                                                        {bill.zipCode || t("zipCode")},
                                                    </span>
                                                    <span>
                                                        {" "}
                                                        {bill.country || t("country")}
                                                    </span>

                                                </p>
                                            </div>
                                            <div
                                                onClick={() => {
                                                    selectedBillIndex === bill.id
                                                        ? handleSaveBillingDetail()
                                                        : handleEditBillingDetail(bill.id);
                                                }}
                                                className={styles.editPencilContainer}
                                            >
                                                <Pencil />
                                            </div>
                                            <DeleteButton
                                                action={() =>
                                                    handleDeleteBillingDetail(currentBill.id)
                                                }
                                            />
                                        </div>
                                        {selectedBillIndex === bill.id && (
                                            <>
                                                <DetailsBillInputs
                                                    address={currentBill.address || ""}
                                                    population={currentBill.population || ""}
                                                    province={currentBill.province || ""}
                                                    zipCode={currentBill.zipCode || ""}
                                                    country={currentBill.country || ""}
                                                    defaultInput={currentBill.default}
                                                    selectedBillIndex={index}
                                                    selectedBillId={currentBill.id}
                                                    handleChange={(key, value) =>
                                                        handleBillingDetailChange(
                                                            key,
                                                            value,
                                                            index,
                                                            currentBill.id
                                                        )
                                                    }
                                                    showCheckbox={true}
                                                />
                                            </>
                                        )}
                                    </div>
                                ))
                        ) : (
                            <span>{t("noBillingDetails")}</span>
                        )}
                    </div>
                </div>

                <div>
                    <div className={styles.payMethodInfoBill}>
                        <div className={styles.detailsBill}>
                            <p>{t("payMethod")}</p>
                            <div className={styles.optionsDetailsBill}>
                                <ButtonDiferentContentScreen
                                    threshold={768}
                                    smallContent={<AddBlack />}
                                    largeContent={
                                        <>
                                            <AddBlack />
                                            {t("addPayMethod")}
                                        </>
                                    }
                                    buttonProps={{
                                        type: "white",
                                        action: (e) => addPayMethod(e),
                                        headerStyle: { borderRadius: "999px" },
                                    }}
                                />
                                <Button
                                    action={() => {
                                        setContactData((prev) => {
                                            const updatedPayMethods = [...prev.paymethod];
                                            if (editingIndexPayMethod !== null) {
                                                updatedPayMethods[editingIndexPayMethod] =
                                                    currentPayMethod;
                                            }
                                            return {
                                                ...prev,
                                                paymethod: updatedPayMethods,
                                            };
                                        });
                                        setEditingIndexPayMethod(null); 
                                        setCurrentPayMethod({
                                            bank: "",
                                            accountNumber: "",
                                            swift: "",
                                            routingNumber: "",
                                            currency: "",
                                            default: false,
                                        });
                                    }}
                                >
                                    {t("save")}
                                </Button>
                            </div>
                        </div>

                        {Array.isArray(contactData.paymethod) &&
                            [...contactData.paymethod]
                                .sort(
                                    (a, b) =>
                                        (b.default === true) - (a.default === true)
                                )
                                .map((method, index) => (
                                    <div
                                        key={index}
                                        className={styles.infoBillContainer}
                                    >
                                        <div className={styles.info}>
                                            <p className={styles.infoPayMethod}>
                                                {method.default && <BlackCheckboxIcon />}

                                                <span>{method.bank || t("bank")}, </span>
                                                <span>
                                                    {method.accountNumber ||
                                                        t("accountNumber")}
                                                    ,{" "}
                                                </span>
                                                <span>
                                                    {" "}
                                                    {method.swift || t("swiftBic")},{" "}
                                                </span>
                                                <span>
                                                    {method.routingNumber ||
                                                        t("routingNumber")}
                                                    ,{" "}
                                                </span>
                                                <span>
                                                    {" "}
                                                    {method.currency || t("currency")}
                                                </span>
                                            </p>
                                            <div
                                                onClick={() => {
                                                    if (editingIndexPayMethod === index) {
                                                        setContactData((prev) => {
                                                            const updatedPayMethods = [
                                                                ...prev.paymethod,
                                                            ];
                                                            updatedPayMethods[
                                                                editingIndexPayMethod
                                                            ] = currentPayMethod;
                                                            return {
                                                                ...prev,
                                                                paymethod: updatedPayMethods,
                                                            };
                                                        });

                                                        setEditingIndexPayMethod(null);
                                                        setCurrentPayMethod({
                                                            bank: "",
                                                            accountNumber: "",
                                                            swift: "",
                                                            routingNumber: "",
                                                            currency: "",
                                                            default: false,
                                                        });
                                                    } else {
                                                        setCurrentPayMethod(method);
                                                        setEditingIndexPayMethod(index);
                                                    }
                                                }}
                                                className={styles.editPencilContainer}
                                            >
                                                <Pencil />
                                            </div>
                                            <DeleteButton />
                                        </div>


                                        {editingIndexPayMethod == index && (
                                            <PayMethod
                                                method={currentPayMethod}
                                                onChange={handlePayMethodChange}
                                            />
                                        )}
                                    </div>
                                ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingDetails;
