import React, { useEffect, useState } from "react";
import HeaderCard from "../HeaderCard/HeaderCard";
import styles from "./AddLocation.module.css";
import Button from "../Button/Button";
import DiscardChange from "../DiscardChange/DiscardChange";
import useCloseOnEsc from "../../../../utils/useClose";
import { createVariable, getVariable } from "../../../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DetailsBillLabelCorporative from "../InfoContact/DetailsBillLabel/DetailsBillLabelCorporative/DetailsBillLabelCorporative";
const AddLocation = ({
  setShowLocationModal,
  isAnimating,
  setIsAnimating,
  setLocation,
  billingDetails, 
  setBillingDetails,
  showButtonsOptions
}) => {
  const [t] = useTranslation("InfoBill");
  const [selectedRow, setSelectedRow] = useState(null);
  const [Locationes, setLocationes] = useState([]);
  const [LocationName, setLocationName] = useState("");
  const [population, setPopulation] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [province, setProvince] = useState('')
  const [country, setCountry] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [selectedBill,setSelectedBill]= useState(null)
  const dispatch = useDispatch()
  const variables = useSelector((state) => state.variables.variables);

  const handleRowClick = (index) => {
    setSelectedRow(index === selectedRow ? null : index);
  };
  
  const handleAddLocation = async () => {
    if (billingDetails.length > 0) {
      await Promise.all(
        billingDetails.map((detail) =>
          dispatch(
            createVariable({
              variableData: {
                ...detail,
                type: "location",
                title: detail.email,
              },
            })
          ).unwrap() 
        )
      );
  
    }
  
    await dispatch(getVariable({ type: "location" }));
  };
  

  useEffect(() => {
    if (variables?.data?.length && billingDetails.length === 0) {
      const clonedData = variables.data.map(detail => ({ ...detail }));
      setBillingDetails(clonedData);
    }
  }, [variables, billingDetails.length]);
  
  

  useEffect(() => {
    dispatch(getVariable({ type: "location" }));
  }, []);

  useEffect(() => {
    setLocationes(Array.isArray(variables.data) ? variables.data : []);
  }, [variables]);


  const handleDeleteLocation = (index) => {
    setLocationes(Locationes.filter((_, i) => i !== index));
    setSelectedRow(null);
  };
  const [showDiscardChange, setShowDiscardChange] = useState(false);
  const handleCloseNewClient = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowLocationModal(false);
      setIsAnimating(false);
    }, 300);
  };

  useCloseOnEsc(setShowLocationModal)



  const handleSaveUpgrade = async () => {
    handleAddLocation()
  };

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
        className={`${styles.addLocationContainer}  ${isAnimating ? styles.scaleDown : styles.scaleUp}`}
      >
        <HeaderCard title={t('selectLocation')} setState={setShowLocationModal}>
          <Button type="white" action={() => handleCloseNewClient()}>
            {t('cancel')}
          </Button>
          <Button
  action={() => {
    setLocation(selectedBill)
    handleCloseNewClient();
  }}
>
  {t('select')}
</Button>

        </HeaderCard>
        <div className={styles.addLocationContent}>


        <DetailsBillLabelCorporative
            user={variables}
            billingDetails={billingDetails}
            setBillingDetails={setBillingDetails}
            handleSave={handleSaveUpgrade}
            showButtonsOptions={showButtonsOptions}
            setSelectedBill={setSelectedBill}
            selectedBill={selectedBill}
            />
            </div>
       
      </div>
    </div>
  );
};

export default AddLocation;
