import React, { useEffect, useRef, useState } from "react";
import styles from "./InfoContact.module.css";
import check from "../../assets/checkProgram.svg";
import { ReactComponent as Phone } from "../../assets/phoneIcon.svg";
import PayMethod from "../PayMethod/PayMethod";
import DeleteButton from "../DeleteButton/DeleteButton";
import DetailsBillInputs from "./DetailsBillInputs/DetailsBillInputs";
import { useNavigate } from "react-router-dom";
import ProfileImage from "../ProfileImage/ProfileImage";
import EditableInput from "../../screens/Contacts/EditableInput/EditableInput";
import FlagPhoneDropdown from "../FlagPhoneDropdown/FlagPhoneDropdown";
import { useTranslation } from "react-i18next";
const InfoContact = ({ 
  stateContact, 
  setStateContact 
}) => {
  const [t] = useTranslation("InfoContact");
  const navigate = useNavigate();
  const [selectedBillIndex, setSelectedBillIndex] = useState(null); 
  const [editingIndexPayMethod, setEditingIndexPayMethod] = useState(null);
  const [originalState, setOriginalState] = useState(stateContact);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const normalizedState = { ...stateContact };

    if (
      Array.isArray(stateContact?.companyPhoneNumber) &&
      typeof stateContact?.companyPhoneNumber[0] === "string"
    ) {
      normalizedState.companyPhoneNumber = stateContact?.companyPhoneNumber.map(
        (phone) => {
          const match = phone.match(/^(\+\d{1,4})(\d{6,})$/); 
          if (match) {
            return {
              code: match[1],
              number: match[2],
            };
          }
          return { code: "", number: phone }; 
        }
      );
    }

    setOriginalState(normalizedState);
  }, [stateContact]);

  const [currentBill, setCurrentBill] = useState({
    direccion: "",
    poblacion: "",
    provincia: "",
    codigoPostal: "",
    pais: "",
    default: false,
    dni: "",
    taxNumber: "",
  });
  const [currentPayMethod, setCurrentPayMethod] = useState({
    bank: "",
    accountNumber: "",
    swift: "",
    routingNumber: "",
    currency: "",
    default: false,
  });


  const handlePayMethodChange = (field, value) => {
    setCurrentPayMethod((prev) => {
      const updatedPayMethod = { ...prev, [field]: value };
      
      if (field === "default" && value) {
        setContactData((prevData) => ({
          ...prevData,
          paymethod: prevData.paymethod.map((method) =>
            method === updatedPayMethod
              ? { ...method, default: true }
              : { ...method, default: false }
          ),
        }));
      }

      return updatedPayMethod;
    });
  };

  const handleDeleteBillingDetail = (index) => {
    setOriginalState((prev) => {
      const updatedInfoBill = prev.infoBill.filter((_, i) => i !== index); 
      return { ...prev, infoBill: updatedInfoBill };
    });

    if (selectedBillIndex === index) {
      setSelectedBillIndex(null);
      setInputsEditing((prev) => ({ ...prev, info: false }));
    }
  };

  const handleEditBillingDetail = (index) => {
    setSelectedBillIndex(index); 
    setCurrentBill({ ...stateContact.infoBill[index] }); 
    setInputsEditing((prev) => ({ ...prev, info: true })); 
  };
  const handleBillingDetailChange = (field, value, index) => {
    setCurrentBill((prev) => {
      const updatedBill = { ...prev, [field]: value };

      if (field === "default" && value) {
        setOriginalState((prevData) => ({
          ...prevData,
          infoBill: prevData.infoBill.map((bill, i) =>
            i === index
              ? { ...bill, default: true }
              : { ...bill, default: false }
          ),
        }));
      }

      return updatedBill;
    });
  };

  const handleSaveBillingDetail = () => {
    if (selectedBillIndex !== null) {
      setOriginalState((prev) => {
        const updatedInfoBill = [...prev.infoBill];
        updatedInfoBill[selectedBillIndex] = { ...currentBill }; 

        return { ...prev, infoBill: updatedInfoBill };
      });

      setInputsEditing((prev) => ({ ...prev, info: false })); 
      setSelectedBillIndex(null); 
    }
  };

  const [inputsEditing, setInputsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    web: false,
    info: false,
    dni: false,
    taxNumber: false,
    billingDetails: [],
  });
  const handleAddBillingDetail = () => {
    setOriginalState((prevData) => ({
      ...prevData,
      infoBill: [
        ...prevData.infoBill,
        {
          direccion: "",
          poblacion: "",
          provincia: "",
          codigoPostal: "",
          pais: "",
          default: false,
          dni: "",
          taxNumber: "",
        },
      ],
    }));
  };

  const addPayMethod = () => {
    setOriginalState((prevData) => ({
      ...prevData,
      paymethod: [...prevData.paymethod, { ...currentPayMethod }],
    }));
    setCurrentPayMethod({
      bank: "",
      accountNumber: "",
      swift: "",
      routingNumber: "",
      currency: "",
      default: false,
    });
  };
  const addPhoneNumber = () => {
    handleContactData("companyPhoneNumber", (prev = []) => [
      ...prev,
      { code: "", number: "" }, 
    ]);
  };
  const removePhoneNumber = (index) => {
    handleContactData("companyPhoneNumber", (prev = []) => {
      return prev.filter((_, i) => i !== index);
    });
  };
  const handleContactData = (field, value) => {
    setOriginalState((prev) => ({
      ...prev,
      [field]:
        typeof value === "function"
          ? value(prev[field]) 
          : field === "cardNumber"
            ? formatCardNumber(value)
            : value,
    }));
  };

  const handleChangePhoneNumbers = (index, field, value) => {
    if (field === "number" && /[^0-9]/.test(value)) {
      return; 
    }

    setOriginalState((prevState) => {
      const updatedNumbers = [...(prevState.companyPhoneNumber || [])];
      if (!updatedNumbers[index])
        updatedNumbers[index] = { code: "", number: "" };
      updatedNumbers[index] = {
        ...updatedNumbers[index],
        [field]: value,
      };

      return {
        ...prevState,
        companyPhoneNumber: updatedNumbers,
      };
    });
  };

  const hasChanges = () => {
    return JSON.stringify(originalState) !== JSON.stringify(stateContact);
  };

  const handleSaveClick = () => {
    setStateContact(originalState);
    setShowSaved(true);
  };

  return (
    <div>
      {hasChanges() && (
        <div className={styles.saveContact} onClick={handleSaveClick}>
          {t("saveContactFutureTransaction")}
        </div>
      )}
      {showSaved && (
        <div className={styles.seeTransactions}>
          <div>
            {t("saved")} <img src={check} alt="" />
          </div>
          <button onClick={() => navigate(`/admin/docs/${stateContact?._id}`)}>
            {t("seeTransactions")}
          </button>
        </div>
      )}

      <div className={styles.typeClient}>
        <ProfileImage
          customStyles={{
            minWidth: "110px",
            height: "110px",
          }}
        />
        <div className={styles.btnSectionsSelector}>

          <button
            className={originalState?.type == "contact" && styles.selected}
            onClick={() =>
              setOriginalState((prev) => ({ ...prev, type: "contact" }))
            }
            type="button"
          >
            {t("contact")}
          </button>

          <button
            className={originalState?.type == "company" && styles.selected}
            onClick={() =>
              setOriginalState((prev) => ({ ...prev, type: "company" }))
            }
            type="button"
          >
            {t("company")}
          </button>

          <button
            className={originalState?.type == "client" && styles.selected}
            onClick={() =>
              setOriginalState((prev) => ({ ...prev, type: "client" }))
            }
            type="button"
          >
            {t("client")}
          </button>
          <button
            className={originalState?.type == "supplier" && styles.selected}
            onClick={() =>
              setOriginalState((prev) => ({ ...prev, type: "supplier" }))
            }
            type="button"
          >
            {t("supplier")}
          </button>
          <button
            className={originalState?.type == "worker" && styles.selected}
            onClick={() =>
              setOriginalState((prev) => ({ ...prev, type: "worker" }))
            }
            type="button"
          >
            {t("worker")}
          </button>
        </div>
      </div>
      <div className={styles.detailsContainer}>
        <EditableInput
          label={t("fullName")}
          nameInput={"nombre"}
          placeholderInput={originalState?.contactName || "John Doe"}
          isEditing={inputsEditing.name}
          value={originalState?.contactName}
          onChange={(e) => {
            handleContactData("contactName", e.target.value);
          }}
          onClick={() =>
            setInputsEditing((prev) => ({
              ...prev,
              name: !prev.name,
            }))
          }
        ></EditableInput>
        <EditableInput
          label={t("email")}
          nameInput={"email"}
          placeholderInput={"johndoe@gmail.com"}
          isEditing={inputsEditing.email}
          value={originalState?.companyEmail}
          onChange={(e) => {
            handleContactData("companyEmail", e.target.value);
          }}
          onClick={() =>
            setInputsEditing((prev) => ({
              ...prev,
              email: !prev.email,
            }))
          }
        />

        <label className={styles.phoneNumber}>
          <div className={styles.headerPhoneNumer}>
            {" "}
            <p>
              <strong>{t("phone")}</strong>
            </p>
            <div className={styles.buttonPhoneContainer}>
              <div
                className={styles.button}
                onClick={() =>
                  setInputsEditing((prev) => ({
                    ...prev,
                    phone: !prev.phone,
                  }))
                }
              >
                {inputsEditing.phone ? t("save") : t("edit")}
              </div>
              <div className={styles.button} onClick={addPhoneNumber}>
                {t("addNumberPhone")}
              </div>
            </div>
          </div>
          <div
            className={
              originalState?.companyPhoneNumber?.length >= 1
                ? styles.phoneContainer
                : styles.phoneContainerUnknown
            }
          >
            {originalState?.companyPhoneNumber?.length >= 1 ? (
              originalState.companyPhoneNumber.map((phone, index) => (
                <div key={index} className={styles.phoneRow}>
                  <FlagPhoneDropdown
                    options={phone.code} 
                    setSelectedOptionProp={(option) => {
                      handleChangePhoneNumbers(index, "code", option);
                    }}
                    editing={inputsEditing.phone}
                  />
                  <a
                    href={`tel:${phone.code || ""}${phone.number || ""}`}
                    style={{ cursor: "pointer" }}
                  >
                    <Phone />
                  </a>
                  <input
                    type="number"
                    disabled={!inputsEditing.phone}
                    placeholder={t("phoneNumber")}
                    className={styles.inputEdit}
                    value={phone.number || ""} 
                    onChange={(e) =>
                      handleChangePhoneNumbers(index, "number", e.target.value)
                    }
                  />
                  <DeleteButton action={() => removePhoneNumber(index)} />
                </div>
              ))
            ) : (
              <div className={styles.unknown}>{t("unknow")}</div>
            )}
          </div>
        </label>

        <EditableInput
          label={t("corporateWebsite")}
          nameInput={"web"}
          placeholderInput={"www.web.com"}
          isEditing={inputsEditing.web}
          value={originalState?.webSite}
          onChange={(e) => {
            handleContactData("webSite", e.target.value);
          }}
          onClick={() =>
            setInputsEditing((prev) => ({ ...prev, web: !prev.web }))
          }
        />
        <label>
          <div>
            <div className={styles.detailsBill}>
              <p>
                <strong>{t("billingDetails")}</strong>
              </p>
              <div className={styles.optionsDetailsBill}>
                <div className={styles.button} onClick={handleAddBillingDetail}>
                  {t("addBillingDetails")}
                </div>

                <div
                  className={styles.button}
                  onClick={handleSaveBillingDetail}
                >
                  {t("saveBillingDetails")}
                </div>
              </div>
            </div>
            <div className={styles.infoBill}>
              {originalState?.infoBill?.length > 0 ? (
                originalState?.infoBill
                  .sort((a, b) => (b.default === true) - (a.default === true))
                  .map((bill, index) => (
                    <div style={{ width: "100%" }}>
                      {" "}
                      <div
                        key={index}
                        className={styles.infoBillContainer}
                        style={{ flexDirection: "row" }}
                      >
                        <div className={styles.info}>
                          <p>
                            {" "}
                            <span> {bill?.direccion || t("address")},</span>
                            <span> {bill?.poblacion || t("population")},</span>
                            <span> {bill?.provincia || t("province")},</span>
                            <span>{bill?.codigoPostal || t("zipCode")},</span>
                            <span> {bill?.pais || t("country")}</span>
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              selectedBillIndex === index
                                ? handleSaveBillingDetail()
                                : handleEditBillingDetail(index);
                            }}
                            className={styles.button}
                          >
                            {selectedBillIndex === index
                              ? t("save")
                              : t("edit")}
                          </button>
                        </div>
                        <DeleteButton
                          action={() => handleDeleteBillingDetail(index)}
                        />
                      </div>
                      {selectedBillIndex === index && (
                        <>
                          <DetailsBillInputs
                            direccion={currentBill.direccion || ""}
                            poblacion={currentBill.poblacion || ""}
                            provincia={currentBill.provincia || ""}
                            codigoPostal={currentBill.codigoPostal || ""}
                            pais={currentBill.pais || ""}
                            defaultInput={currentBill.default}
                            handleChange={(key, value) =>
                              handleBillingDetailChange(key, value)
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
        </label>

        <EditableInput
          label={t("identityDocument")}
          nameInput={"DNI"}
          placeholderInput={originalState?.dni || t("identityNumber")}
          isEditing={inputsEditing.dni}
          value={originalState?.dni}
          onChange={(e) => {
            handleContactData("dni", e.target.value);
          }}
          onClick={() =>
            setInputsEditing((prev) => ({
              ...prev,
              dni: !prev.dni,
            }))
          }
        />

        <EditableInput
          label={t("taxNumber")}
          nameInput={"taxNumber"}
          placeholderInput={originalState?.taxNumber || t("cifOther")}
          isEditing={inputsEditing.taxNumber}
          value={originalState?.taxNumber}
          onChange={(e) => {
            handleContactData("taxNumber", e.target.value);
          }}
          onClick={() =>
            setInputsEditing((prev) => ({
              ...prev,
              taxNumber: !prev.taxNumber,
            }))
          }
        />
        <label>
          <div style={{ marginBottom: "20px" }}>
            <div className={styles.detailsBill}>
              <p>{t("paymentMethods")}</p>
              <div className={styles.optionsDetailsBill}>
                <div className={styles.button} onClick={addPayMethod}>
                  {t("addPaymentMethod")}
                </div>
                <div
                  onClick={() => {
                    setOriginalState((prev) => {
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
                  className={styles.button}
                >
                  {t("savePaymentMethod")}
                </div>
              </div>
            </div>

            {Array.isArray(originalState?.paymethod) &&
              originalState?.paymethod
                .sort((a, b) => (b.default === true) - (a.default === true))
                .map((method, index) => (
                  <div key={index} className={styles.infoBillContainer}>
                    <div className={styles.info}>
                      <p>
                        <span>{method.bank || t("bank")}, </span>
                        <span>
                          {method.accountNumber || t("accountNumber")},{" "}
                        </span>
                        <span> {method.swift || t("swiftBic")}, </span>
                        <span>
                          {method.routingNumber || t("routingNumber")},{" "}
                        </span>
                        <span> {method.currency || t("currency")}</span>
                      </p>
                      <DeleteButton />
                    </div>
                    <div
                      className={styles.button}
                      onClick={() => {
                        if (editingIndexPayMethod === index) {
                          setOriginalState((prev) => {
                            const updatedPayMethods = [...prev.paymethod];
                            updatedPayMethods[editingIndexPayMethod] =
                              currentPayMethod;
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
                    >
                      {editingIndexPayMethod == index ? t("save") : t("edit")}
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
        </label>
      </div>
    </div>
  );
};

export default InfoContact;
