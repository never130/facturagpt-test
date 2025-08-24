import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import imageEmpty from '../../../assets/ImageEmpty.svg';
import { ReactComponent as SearchGray } from '../../../assets/searchGray.svg';
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import ContactsPopup from "../../ContactsPopup/ContactsPopup";
import DeleteButton from "../../DeleteButton/DeleteButton";
import styles from "../CreateParameterPopup.module.css";
import LabelParameters from "../LabelParameters";
import { getAllContacts } from "../../../../../actions/contacts";
import { useDispatch } from "react-redux";


const Contact = ({
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

  const contactsRef = useRef(null);
  const dispatch = useDispatch();

  // Función para manejar la selección/deselección de contactos
  const handleContactSelection = (contactId) => {
    setParameterData(prev => ({
      ...prev,
      contact: prev.contact?.map(contact => 
        contact._id === contactId 
          ? { ...contact, selected: !contact.selected }
          : contact
      ) || []
    }));
  };

  // Función para verificar si un contacto está seleccionado
  const isContactSelected = (contact) => {
    return contact.selected === true;
  };
 
  const handleContactClick = (contact) => {
    setInputValue('')
    // Agregar el contacto con selected: false por defecto
    setParameterData((prev) => ({
      ...prev,
      contact: [...(prev.contact || []), { ...contact, selected: false }],
    }));
  };

  const handleBlur = (event) => {
    setTimeout(() => {
      if (
        contactsRef.current &&
        !contactsRef.current.contains(event.relatedTarget)
      ) {
        setIsFocused(false);
      }
    }, 100);
  };
  
  const handleDeleteContact = (idToRemove) => {
    setParameterData((prev) => ({
      ...prev,
      contact: (prev.contact || []).filter((c) => c._id !== idToRemove),
    }));
  };

  const handleSelectItem = (item) => {
    setInputValue('')
    // Agregar el item con selected: false por defecto
    setParameterData((prev) => ({
      ...prev,
      contact: [...(prev.contact || []), { ...item, selected: false }],
    }));
  };
  
  console.log('parameterData', parameterData?.contact)
  return (
    <div>
      {/* <LabelParameters
        value={parameterData.Contact}
        text={"contact"}
        editingInput={editingInput}
        setEditingInput={setEditingInput}
      > */}
      <p className={styles.textContent}>{t('contact')}</p>
   <div className={styles.contactContainer}>
   <div className={styles.inputContainer}>
            <SearchGray/>
          <input
            type="text"
            placeholder={t("searchContact")}
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
              ref={contactsRef}
              handleContactClick={handleContactClick}
              setShowNewContact={() => {}}
              type={"chat"}
              inputValue={inputValue}
              setNewContact={setNewContact}
              setNewAsset={setNewAsset}
              handleSelectItem={handleSelectItem}
              handleClickFocus={() => {}}
            />
          )}
        </div>
      {/* </LabelParameters> */}

      {parameterData?.contact?.map((contact) => (
        <div key={contact._id} className={styles.contactContent}>
         <div>
          <input 
            type="checkbox" 
            checked={isContactSelected(contact)}
            onChange={() => handleContactSelection(contact._id)}
            className={styles.contactCheckbox}
          />
         <img src={contact.image || imageEmpty} alt="" />
          <div className={styles.contactInfo}>
            <p>{contact.name ? contact.name : "substitute" in contact ? "Nombre del Activo": "accessPermitType" in contact ? "Elemento" :
                contact.contactName ? contact.contactName : "contactName" in contact ? "Nombre de la Cuenta" : 
                contact.documentTitle ? contact.documentTitle : "stateStripe" in contact ? "Nombre del documento" :
                "hidden" in contact ? "Nombre de variable" : ""}</p>
              <span style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{contact?.description ? contact.description : "substitute" in contact ? 'Descripción'  :
                 contact.companyEmail ? contact.companyEmail :  "contactName" in contact ? 'Email adress, Dirección, Población, Provincia, Código Postal, País' : 
                 contact.category ? contact.category : "stateStripe" in contact ? "Categoria" : contact.headers?.length ? contact.headers?.length :
                 "accessPermitType" in contact ? "Numero de parámetros" :""}</span>
            {/* {(() => {
              const bills = contact?.infoBill || [];
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
          <DeleteButton
        action={() => handleDeleteContact(contact._id)}
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
      ))}
   </div>
    </div>
  );
};

export default Contact;
