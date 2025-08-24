import React, { useRef, useState } from "react";
import LabelParameters from "../LabelParameters";
import ContactsPopup from "../../ContactsPopup/ContactsPopup";
import { useTranslation } from "react-i18next";
import styles from "../CreateParameterPopup.module.css";
import imageEmpty from '../../../assets/ImageEmpty.svg'
import {ReactComponent as SearchGray} from '../../../assets/searchGray.svg'
import { FaChevronDown } from "react-icons/fa";
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import DeleteButton from "../../DeleteButton/DeleteButton";


const Asset = ({
    parameterData,
    setParameterData,
    handleChange,
    editingInput,
    setEditingInput,
  }) => {
    const [t] = useTranslation("Contacts");

    const [newAsset, setNewAsset] = useState(false);
    const [newContact, setNewContact] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");
  
    const assetRef = useRef(null);

    // Función para manejar la selección/deselección de assets
    const handleAssetSelection = (assetId) => {
      setParameterData(prev => ({
        ...prev,
        asset: prev.asset?.map(asset => 
          asset._id === assetId 
            ? { ...asset, selected: !asset.selected }
            : asset
        ) || []
      }));
    };

    // Función para verificar si un asset está seleccionado
    const isAssetSelected = (asset) => {
      return asset.selected === true;
    };
  
    const handleContactClick = (asset) => {
      setInputValue('')
      // Agregar el asset con selected: false por defecto
      setParameterData((prev) => ({
        ...prev,
        asset: [...(prev.asset || []), { ...asset, selected: false }],
      }));
    };
  
    const handleBlur = (event) => {
      setTimeout(() => {
        if (
          assetRef.current &&
          !assetRef.current.contains(event.relatedTarget)
        ) {
          setIsFocused(false);
        }
      }, 100);
    };
    
    const handleDeleteContact = (idToRemove) => {
      setParameterData((prev) => ({
        ...prev,
        asset: (prev.asset || []).filter((c) => c._id !== idToRemove),
      }));
    };
    
    const handleSelectItem = (item) => {
      setInputValue('')
      // Agregar el item con selected: false por defecto
      setParameterData((prev) => ({
        ...prev,
        asset: [...(prev.asset || []), { ...item, selected: false }],
      }));
    };
  
  return (
    <div>
    {/* <LabelParameters
      value={parameterData.asset}
      text={"asset"}
      editingInput={editingInput}
      setEditingInput={setEditingInput}
    > */}
      <div className={styles.inputContainer}>
          <SearchGray/>
        <input
          type="text"
          placeholder={t("searchAsset")}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          className={styles.searchContactInput}
        /> 
        <FaChevronDown
           size={16}
           width={16}
           className={styles.chevronIcon}
           height={16}
           color={"#71717A"}
           />
        {isFocused && inputValue.length > 0 && (
          <ContactsPopup
            ref={assetRef}
            handleAssetClick={handleContactClick}
            type={"asset"}
            inputValue={inputValue}
            setNewContact={setNewContact}
            setNewAsset={setNewAsset}
            handleSelectItem={handleSelectItem}
              handleClickFocus={() => {}}
              />
        )}
      </div>
    {/* </LabelParameters> */}

    {parameterData?.asset?.map((asset) => (
       <div key={asset._id} className={styles.contactContent}>
       <div>
        <input 
          type="checkbox" 
          checked={isAssetSelected(asset)}
          onChange={() => handleAssetSelection(asset._id)}
          className={styles.contactCheckbox}
        />
       <img src={asset.image || imageEmpty} alt="" />
        <div className={styles.contactInfo}>
          <p>{asset.name ? asset.name : "substitute" in asset ? "Nombre del Activo": "accessPermitType" in asset ? "Elemento" :
              asset.contactName ? asset.contactName : "contactName" in asset ? "Nombre de la Cuenta" : 
              asset.documentTitle ? asset.documentTitle : "stateStripe" in asset ? "Nombre del documento" :
              "hidden" in asset ? "Nombre de variable" : ""}</p>
            <span style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{asset?.description ? asset.description : "substitute" in asset ? 'Descripción'  :
               asset.companyEmail ? asset.companyEmail :  "contactName" in asset ? 'Email adress, Dirección, Población, Provincia, Código Postal, País' : 
               asset.category ? asset.category : "stateStripe" in asset ? "Categoria" : asset.headers?.length ? asset.headers?.length :
               "accessPermitType" in asset ? "Numero de parámetros" :""}</span>
          {/* {(() => {
            const bills = asset?.infoBill || [];
            const selectedBill = bills.find((b) => b.default) || bills[0];

            if (!selectedBill) return null;

            return (
              <div>
                <span>{selectedBill.address || t('address')}</span>
                <span>{selectedBill.population || t('population')}</span>
                <span>{selectedBill.province || t('province')}</span>
                <span>{selectedBill.zipCode || t('zipCode')}</span>
                <span>{selectedBill.country || t('country')}</span>
              </div>
            );
          })()} */}
        </div>
       </div>
       <div className={styles.rightSectionAsset}>
       <p>10.00$</p>

<DeleteButton
action={() => handleDeleteContact(asset._id)}
type="black"
CustonIcon={WhiteXCloseIcon}
customIconStyles={{
  height: "20px",
  minWidth: "20px",
  maxWidth: "20px",
  background: "#6E6E80",
}}
/>
       </div>
      </div>
    ))}
  </div>
  )
}

export default Asset