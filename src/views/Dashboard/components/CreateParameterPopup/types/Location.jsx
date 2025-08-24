import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as AddBlack } from "../../../assets/addBlack.svg";
import { ReactComponent as BlackCheckboxIcon } from "../../../assets/blackCheckboxIcon.svg";
import { ReactComponent as Pencil } from "../../../assets/pencilEdit.svg";
import Button, { ButtonDiferentContentScreen } from '../../Button/Button';
import LabelParameters from '../LabelParameters';
import DetailsBillInputs from '../../InfoContact/DetailsBillInputs/DetailsBillInputs';
import PayMethod from '../../PayMethod/PayMethod';
import DeleteButton from '../../DeleteButton/DeleteButton';
import styles from '../../NewContact/NewContact.module.css';

const Location = ({ parameterData, handleChange, editingInput, setEditingInput, setTypeLocation, setLocationState, locationParameter }) => {
  const [t] = useTranslation("Contacts");
  
  // Estados locales para manejar la información de facturación
  const [currentBill, setCurrentBill] = useState({
    id: null,
    address: "",
    population: "",
    province: "",
    zipCode: "",
    country: "",
    default: false
  });
  
  const [selectedBillIndex, setSelectedBillIndex] = useState(null);
  
  // Estados para métodos de pago
  const [currentPayMethod, setCurrentPayMethod] = useState({
    bank: "",
    accountNumber: "",
    swift: "",
    routingNumber: "",
    currency: "",
    default: false,
  });
  
  const [editingIndexPayMethod, setEditingIndexPayMethod] = useState(null);

  // Función para agregar nueva información de facturación
  const handleAddBillingDetail = (e) => {
    e.preventDefault();
    const newBill = {
      id: Date.now(),
      address: "",
      population: "",
      province: "",
      zipCode: "",
      country: "",
      default: false
    };
    
    setCurrentBill(newBill);
    setSelectedBillIndex(newBill.id);
    
    // Actualizar parameterData
    const updatedInfoBill = [...(parameterData.infoBill || []), newBill];
    handleChange({
      name: "infoBill",
      newValue: updatedInfoBill
    });
  };

  // Función para guardar información de facturación
  const handleSaveBillingDetail = () => {
    if (selectedBillIndex !== null) {
      const updatedInfoBill = (parameterData.infoBill || []).map((bill) =>
        bill.id === selectedBillIndex ? { ...currentBill } : bill
      );
      
      handleChange({
        name: "infoBill",
        newValue: updatedInfoBill
      });
      
      setSelectedBillIndex(null);
      setCurrentBill({
        id: null,
        address: "",
        population: "",
        province: "",
        zipCode: "",
        country: "",
        default: false
      });
    }
  };

  // Función para editar información de facturación
  const handleEditBillingDetail = (id) => {
    const bill = (parameterData.infoBill || []).find(b => b.id === id);
    if (bill) {
      setCurrentBill(bill);
      setSelectedBillIndex(id);
    }
  };

  // Función para eliminar información de facturación
  const handleDeleteBillingDetail = (id) => {
    const updatedInfoBill = (parameterData.infoBill || []).filter(bill => bill.id !== id);
    handleChange({
      name: "infoBill",
      newValue: updatedInfoBill
    });
    
    if (selectedBillIndex === id) {
      setSelectedBillIndex(null);
      setCurrentBill({
        id: null,
        address: "",
        population: "",
        province: "",
        zipCode: "",
        country: "",
        default: false
      });
    }
  };

  // Función para manejar cambios en información de facturación
  const handleBillingDetailChange = (key, value, index, id) => {
    setCurrentBill(prev => {
      const updated = { ...prev, [key]: value };
      
      // Si se está marcando como default, desmarcar otros
      if (key === "default" && value === true) {
        const updatedInfoBill = (parameterData.infoBill || []).map(bill => ({
          ...bill,
          default: bill.id === id
        }));
        handleChange({
          name: "infoBill",
          newValue: updatedInfoBill
        });
      }
      
      return updated;
    });
  };

  // Función para agregar método de pago
  const addPayMethod = (e) => {
    e.preventDefault();
    const newPayMethod = { ...currentPayMethod, id: Date.now() };
    
    const updatedPayMethods = [...(parameterData.paymethod || []), newPayMethod];
    handleChange({
      name: "paymethod",
      newValue: updatedPayMethods
    });
    
    setCurrentPayMethod({
      bank: "",
      accountNumber: "",
      swift: "",
      routingNumber: "",
      currency: "",
      default: false,
    });
  };

  // Función para manejar cambios en métodos de pago
  const handlePayMethodChange = (field, value) => {
    setCurrentPayMethod(prev => {
      const updated = { ...prev, [field]: value };
      
      // Si se está marcando como default, desmarcar otros
      if (field === "default" && value === true) {
        const updatedPayMethods = (parameterData.paymethod || []).map(method => ({
          ...method,
          default: false
        }));
        handleChange({
          name: "paymethod",
          newValue: updatedPayMethods
        });
      }
      
      return updated;
    });
  };

  return (
    <div className={styles.newContactForm}>
      <div className={styles.infoLabel}>
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
            {parameterData?.infoBill?.length > 0 ? (
              [...parameterData.infoBill]
                .sort(
                  (a, b) =>
                    (b.default === true) - (a.default === true)
                )
                .map((bill, index) => (
                  <div key={bill.id} className={styles.billingDetailsContainer}>
                    <div
                      className={styles.infoBillContainer}
                      style={{ flexDirection: "row" }}
                    >
                      <div className={styles.info}>
                        <p>
                          {bill.default && <BlackCheckboxIcon />}
                          <span>
                            {bill.address || t("address")},
                          </span>
                          <span>
                            {bill.population || t("population")},
                          </span>
                          <span>
                            {bill.province || t("province")},
                          </span>
                          <span>
                            {bill.zipCode || t("zipCode")},
                          </span>
                          <span>
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
                          handleDeleteBillingDetail(bill.id)
                        }
                      />
                    </div>
                    {selectedBillIndex === bill.id && (
                      <>
                        <DetailsBillInputs
                          type="bill"
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

        {/* <div>
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
                    if (editingIndexPayMethod !== null) {
                      const updatedPayMethods = [...(parameterData.paymethod || [])];
                      updatedPayMethods[editingIndexPayMethod] = currentPayMethod;
                      
                      handleChange({
                        name: "paymethod",
                        newValue: updatedPayMethods
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
                    }
                  }}
                >
                  {t("save")}
                </Button>
              </div>
            </div>

            {Array.isArray(parameterData.paymethod) &&
              [...parameterData.paymethod]
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
                            const updatedPayMethods = [...(parameterData.paymethod || [])];
                            updatedPayMethods[editingIndexPayMethod] = currentPayMethod;
                            
                            handleChange({
                              name: "paymethod",
                              newValue: updatedPayMethods
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
                    
                    {editingIndexPayMethod === index && (
                      <PayMethod
                        method={currentPayMethod}
                        onChange={handlePayMethodChange}
                      />
                    )}
                  </div>
                ))}
          </div>
        </div> */}
      </div>
      
      {/* <LabelParameters value={parameterData.number} text={'textBox'} editingInput={editingInput} setEditingInput={setEditingInput} direction="column">
        <Button type="white" headerStyle={{ borderRadius: "999px" }} action={() => {
          setTypeLocation('parameter')
          setLocationState(true)
        }}>
          <AddBlack /> {t("addLocation")}
        </Button>
      </LabelParameters>
      {locationParameter?.email} */}
    </div>
  )
}

export default Location