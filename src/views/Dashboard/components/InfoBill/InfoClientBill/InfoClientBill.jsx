import React, { useState, useRef, useEffect } from "react";
import styles from "./InfoClientBill.module.css";
import emptyImage from "../../../assets/ImageEmpty.svg";
import { ReactComponent as Lupa } from "../../../assets/searchGray.svg";
import ContactsPopup from "../../ContactsPopup/ContactsPopup";
import { useDispatch } from "react-redux";
import { getOneDocsById, updateContactId } from "../../../../../actions/docs";
import { createAsset } from "../../../../../actions/assets";
import { useTranslation } from "react-i18next";
import NewAsset from "../../NewAsset/NewAsset";
import NewContact from "../../NewContact/NewContact";
import SearchIconWithIcon from "../../SearchIconWithIcon/SearchIconWithIcon";
import useFocusShortcut from "../../../../../utils/useFocusShortcut";
import lIcon from "../../../assets/lIcon.svg";

const InfoClientBill = ({
  setShowNewContact,
  textareaPlaceHolder,
  textHeader,
  placeholderInput,
  showSearch = true,
  type,
  contact,
  setStateContact,
  stateDoc,
  setStateAsset,
}) => {
  const dispatch = useDispatch();
  const [t] = useTranslation("InfoBill");

  const [newAsset, setNewAsset] = useState(false);
  const [newContact, setNewContact] = useState(false);
  const [editing, setEditing] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [toggleInputs, setToggleInput] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [showContact, setShowContact] = useState(true);

  const contactsRef = useRef(null);

  const handleContactClick = (contact) => {
    setShowContact(true);
    setStateContact(contact);
    setEditing(true);
    setInputValue(contact.contactName);
    setIsFocused(false);
  };

  const handleSaveContact = async () => {
    if (!stateDoc?._id || !contact?._id) {
      console.error('Document ID or Contact ID is missing');
      return;
    }

    if (!stateDoc._id.includes('uuidv4')) {
      try {
        await dispatch(
          updateContactId({
            docId: stateDoc._id,
            contactId: contact._id,
          })
        );
      } catch (error) {
        console.error('Error updating contact:', error);
      }
    }
    setEditing(false);
  };

  const handleAssetClick = async(asset) => {
    try {
      const modifiedAsset = {
        ...asset,
        _rev: undefined,
        _id: undefined,
        docId: stateDoc._id,
      };
      
      await dispatch(
        createAsset({
          assetData: modifiedAsset,
        })
      );

      if (stateDoc._id && !stateDoc._id.includes('uuidv4')) {
        const response = await dispatch(
          getOneDocsById({
            docId: stateDoc._id,
          })
        );
        if (response.payload) {
          setStateAsset(response.payload.assets);
        }
      } else {
        setStateAsset(prevAssets => [...prevAssets, modifiedAsset]);
      }
    } catch (error) {
      console.error('Error handling asset click:', error);
    }
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

  const searchInputRef = useRef(null);

  useFocusShortcut(searchInputRef, "/");



  return (
    <div className={styles.columnInfoBill}>
      {showSearch && (
        <div className={styles.headerInfoBill}>
          <p>{textHeader}</p>
          <div className={styles.search}>
            {!contact || !showContact ? (
              <div className={styles.searchContactContainer}>
                <Lupa
                  className={styles.icon}
                  onClick={() => setToggleInput((prev) => !prev)}
                />
              </div>
            ) : (
              <>
                <div
                  className={styles.button}
                  onClick={() => {
                    setEditing(true);
                    setShowContact(false);
                    setStateContact({});
                  }}
                >
                  {t('deleteContact')}
                </div>
                <div
                  className={styles.button}
                  onClick={() => {
                    if (editing) {
                      handleSaveContact();
                    } else {
                      setEditing(true);
                    }
                  }}
                >
                  {editing ? t('save') : t('edit')}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {contact && showContact ? (
        <div className={styles.info}>
          <img src={contact?.image || emptyImage} alt="Profile picture" />
          <div className={styles.profile}>
            <input
              disabled={!editing}
              value={contact?.contactName}
              onChange={(e) =>
                setStateContact((prev) => ({
                  ...prev,
                    contactName: e.target.value,
                 
                }))
              }
            />
               <span className={styles.infoSpan}>
                        {t("typeContactName")}
                      </span>
            <textarea
              disabled={!editing}
              value={contact?.address}
              placeholder={textareaPlaceHolder}
              onChange={(e) =>
                setStateContact((prev) => ({
                  ...prev,
                    address: e.target.value,
               
                }))
              }
            />
          </div>
        </div>
      ) : toggleInputs ? (
        <div
          className={styles.inputContainerNew}
          // style={{ background: !editing && "transparent" }}
        >
          <div className={styles.searchContainer}>
          <SearchIconWithIcon
            ref={searchInputRef}
            searchTerm={inputValue}
            setSearchTerm={setInputValue}
            onFocusP={() => setIsFocused(true)}
            onBlurP={handleBlur}
 
            classNameIconRight={styles.searchContainerL}
          >
              <img
                src={lIcon}
                alt="filterIcon"
                className={styles.searchContainerIcon}
              />
          </SearchIconWithIcon>
        </div>

          {isFocused && inputValue.length > 0 && (
            <ContactsPopup
              ref={contactsRef}
              handleContactClick={handleContactClick}
              handleAssetClick={handleAssetClick}
              setShowNewContact={setShowNewContact}
              type={type}
              inputValue={inputValue}
              setNewContact={setNewContact}
              setNewAsset={setNewAsset}
            />
          )}
        </div>
      ) : (
        <textarea
          placeholder={textareaPlaceHolder}
          disabled={!editing}
        ></textarea>
      )}
      {newContact && <NewContact setNewContact={setNewContact}/>}
      {newAsset && (<NewAsset  setNewAsset={setNewAsset}/>)} 
    </div>
  );
};

export default InfoClientBill;
