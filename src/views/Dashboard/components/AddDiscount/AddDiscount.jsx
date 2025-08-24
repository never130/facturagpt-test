import React, { useEffect, useState } from "react";
import HeaderCard from "../HeaderCard/HeaderCard";
import styles from "./AddDiscount.module.css";
import DeleteButton from "../DeleteButton/DeleteButton";
import Button from "../Button/Button";
import DiscardChange from "../DiscardChange/DiscardChange";
import useCloseOnEsc from "../../../../utils/useClose";
import { useDispatch, useSelector } from "react-redux";
import { createVariable, getVariable,deleteVariable} from "../../../../actions/user";
import { useTranslation } from "react-i18next";

const AddDiscount = ({
  setShowDiscountModal,
  isAnimating,
  setDiscountQuantity,
  fatherSelectedDiscount,
  setEditingDiscount,
  typeVariable
}) => {
  const [t] = useTranslation("InfoBill");
  const [selectedRow, setSelectedRow] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [discountName, setDiscountName] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const variables = useSelector((state) => state.variables.variables);
  const dispatch = useDispatch()
  const handleRowClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };



  const handleAddDiscount = async () => {
    if (discountName.trim() === "" || discountRate.trim() === "") return;
  
    const newDiscount = {
      title: discountName,
      quantity: `${discountRate}`,
      type: typeVariable || "discount",
    };
  
    await dispatch(createVariable({ variableData: newDiscount }));
  
    dispatch(getVariable({ type:typeVariable|| "discount" }));
       setDiscountName("");
    setDiscountRate("");
  };

  
  
  useEffect(() => {
    dispatch(getVariable({ type:typeVariable|| "discount" }));
  }, [dispatch]);

  useEffect(() => {
    setDiscounts(Array.isArray(variables.data) ? variables.data : []);
  }, [variables]);
  

  const [showDiscardChange, setShowDiscardChange] = useState(false);

  const handleCloseNewClient = () => {
    setEditingDiscount && setEditingDiscount(true)
    setShowDiscountModal(false);
    setTimeout(() => {
    }, 300);
  };

  useCloseOnEsc(setShowDiscountModal)

  const handleDeleteDiscount = (discount,index) => {


    if(selectedDiscount? selectedDiscount._id: fatherSelectedDiscount._id === discount._id) alert(t('ClickOnDiscountAndThenSelect'))
    else {setDiscounts(discounts.filter(dis => dis._id !== discount._id))


    dispatch(deleteVariable({variableId:discount._id}))}
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.bg} onClick={() => handleCloseNewClient()}></div>
      {showDiscardChange && (
        <DiscardChange
          actionSave={() => handleCloseNewClient()}
          actionDiscard={() => {
            setShowDiscardChange(false);
            setShowDiscountModal(false);
          }}
        />
      )}
      <div
        className={`${styles.addTaxContainer} ${isAnimating ? styles.scaleDown : styles.scaleUp}`}
      >
        <HeaderCard
          title={t('selectDiscount')}
          setState={setShowDiscountModal}
        >
          <Button type="white" action={() => handleCloseNewClient()}>
            {t('cancel')}
          </Button>
          <Button
            action={() => {
              handleCloseNewClient();

              if(selectedDiscount){
                if(fatherSelectedDiscount && fatherSelectedDiscount._id === selectedDiscount._id){
                dispatch(deleteVariable({variableId:selectedDiscount._id}))
                setDiscountQuantity({
                  title: "cero",
                  quantity: 0,
                  type: "discount",
                })
              }else setDiscountQuantity(selectedDiscount);
            } 
              else setDiscountQuantity({
                title: "cero",
                quantity: 0,
                type: "discount",
              })
            }}
          >
            {t('select')}
          </Button>
        </HeaderCard>
        <div className={styles.addTaxContent}>
          <div className={styles.taxes}>
            <div className={styles.columnLeft}>
              <p>{t('discountName')}</p>
              <input
                type="text"
                placeholder={t('discountName2')}
                value={discountName}
                onChange={(e) => setDiscountName(e.target.value)}
              />
            </div>
            <div className={styles.column}>
              <p>{t('discountApplied')}</p>
              <input
                type="number"
                placeholder="%"
                value={discountRate}
                onChange={(e) => {
                  if (e.target.value <= 100 && e.target.value >= 0)
                    setDiscountRate(e.target.value);
                }}
                min={0}
                max={100}
              />
            </div>
          </div>
          <div className={styles.tableTaxes}>
            <button onClick={handleAddDiscount}>{t('addDiscount')}</button>
            <table>
              <thead>
                <tr>
                  <th className={styles.small}></th>
                  <th>{t('taxName')}</th>
                  <th>{t('discountApplied')}</th>
                  <th className={styles.small}></th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount, index) => (
                  <tr
                    key={index}
                    className={selectedRow === index ? styles.selectedRow : ""}
                    onClick={() => {
                      selectedRow !== index
                        ? setSelectedDiscount(discount)
                        : setSelectedDiscount({
                          title: "cero",
                          quantity: 0,
                          type: "discount",
                        });
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
                    <td>{discount.title}</td>
                    <td>{discount.quantity}%</td>
                    <td className={styles.small}>
                      <DeleteButton
                        action={(e) => {
                          e.stopPropagation();
                          handleDeleteDiscount(discount,index);
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

export default AddDiscount;
