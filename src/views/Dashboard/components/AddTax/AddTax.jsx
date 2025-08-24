import React, { useEffect, useState } from "react";
import HeaderCard from "../HeaderCard/HeaderCard";
import styles from "./AddTax.module.css";
import DeleteButton from "../DeleteButton/DeleteButton";
import Button from "../Button/Button";
import DiscardChange from "../DiscardChange/DiscardChange";
import useCloseOnEsc from "../../../../utils/useClose";
import { createVariable, getVariable } from "../../../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const AddTax = ({
  setShowTaxModal,
  isAnimating,
  setTaxQuantity,
  setEditingTax
}) => {
  const [t] = useTranslation("InfoBill");
  const [selectedRow, setSelectedRow] = useState(null);
  const [taxes, setTaxes] = useState([]);
  const [taxName, setTaxName] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [isCompound, setIsCompound] = useState(false);
  const [selectedTax, setSelectedTax] = useState(0);
  const dispatch = useDispatch()
  const variables = useSelector((state) => state.variables.variables);


  const handleRowClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };

  const handleAddTax = async() => {
    if (taxName.trim() === "" || taxRate.trim() === "") return;

    const newTax = {
      title: taxName,
      quantity: `${taxRate}`,
      compound: isCompound ? "Si" : "No",
      type: "taxes",
    };

    
    await dispatch(createVariable({ variableData: newTax }));
  
    dispatch(getVariable({ type: "taxes" }));
    setTaxName("");
    setTaxRate("");
    setIsCompound(false);
  };
 
  useEffect(() => {
    dispatch(getVariable({ type: "taxes" }));
  }, [dispatch]);

  useEffect(() => {
    setTaxes(Array.isArray(variables.data) ? variables.data : []);
  }, [variables]);
  

  const handleDeleteTax = (index) => {
    setTaxes(taxes.filter((_, i) => i !== index));
    setSelectedRow(null);
  };
  const [showDiscardChange, setShowDiscardChange] = useState(false);
  const handleCloseNewClient = () => {
    setEditingTax && setEditingTax(true)
    setShowTaxModal(false);
    setTimeout(() => {
    }, 300);
  };


  useCloseOnEsc(setShowTaxModal)

  return (
    <div className={styles.overlay}>
      <div className={styles.bg} onClick={() => handleCloseNewClient()}></div>
      {showDiscardChange && (
        <DiscardChange
          actionSave={() => handleCloseNewClient()}
          actionDiscard={() => {
            setShowDiscardChange(false);
            handleCloseNewClient();
          }}
        />
      )}
      <div
        className={`${styles.addTaxContainer}  ${isAnimating ? styles.scaleDown : styles.scaleUp}`}
      >
        <HeaderCard title={t('selectTax')} setState={setShowTaxModal}>
          <Button type="white" action={() => handleCloseNewClient()}>
            {t('cancel')}
          </Button>
          <Button
            action={() => {
              setTaxQuantity(selectedTax);
              handleCloseNewClient();
            }}
          >
            {t('select')}
          </Button>
        </HeaderCard>
        <div className={styles.addTaxContent}>
          <div className={styles.taxes}>
            <div className={styles.column}>
              <p>{t('taxName')}</p>
              <input
                type="text"
                placeholder={t('taxName2')}
                value={taxName}
                onChange={(e) => setTaxName(e.target.value)}
              />
            </div>
            <div className={styles.column}>
              <p>{t('taxRate')}</p>
              <input
                type="number"
                placeholder="%"
                value={taxRate}
                onChange={(e) => {
                  if (e.target.value <= 100 && e.target.value >= 0)
                    setTaxRate(e.target.value);
                }}
                min={0}
                max={100}
              />
            </div>
            <div className={styles.compuesto}>
              <input
                type="checkbox"
                checked={isCompound}
                onChange={() => setIsCompound(!isCompound)}
              />
              <span>{t('compositeTax')}</span>
            </div>
          </div>
          <div className={styles.tableTaxes}>
            <button onClick={handleAddTax}>{t('addTax')}</button>
            <table>
              <thead>
                <tr>
                  <th className={styles.small}></th>
                  <th>{t('taxName')}</th>
                  <th>{t('taxRate')}</th>
                  <th>{t('compositeTax')}</th>
                  <th className={styles.small}></th>
                </tr>
              </thead>
              <tbody>
                {taxes.map((tax, index) => (
                  <tr
                  key={index}
                  className={selectedRow === index ? styles.selectedRow : ""}
                  onClick={() => {
                      selectedRow !== index
                        ? setSelectedTax(tax.quantity)
                        : setSelectedTax(0);
                      handleRowClick(index);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td className={styles.small}>
                      <input
                        type="checkbox"
                        checked={selectedRow === index}
                        readOnly
                      />
                    </td>
                    <td>{tax.title}</td>
                    <td>{tax.quantity}%</td>
                    <td>{tax.compound}</td>
                    <td className={styles.small}>
                      <DeleteButton
                        action={(e) => {
                          e.stopPropagation();
                          handleDeleteTax(index);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTax;
