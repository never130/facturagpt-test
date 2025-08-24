import React, { useRef, useState } from "react";
import styles from "./InfoBill.module.css";
import NewAsset from "../NewAsset/NewAsset";
import InfoClientBill from "./InfoClientBill/InfoClientBill";
import profileImage from "../../assets/profileIcon.svg";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import ContactsPopup from "../ContactsPopup/ContactsPopup";
import AssetLine from "../AssetLine/AssetLine";
import { ReactComponent as AssettSectionIcon } from "../../assets/AssettSectionIcon.svg";
import { ReactComponent as ContactSectionIcon } from "../../assets/ContactSectionIcon.svg";
import { ReactComponent as DocSectionIcon } from "../../assets/DocSectionIcon.svg";
import { ReactComponent as Lupa } from "../../assets/searchGray.svg";
import { deleteAssets, setDocIdInAsset } from "../../../../actions/assets";
import { useDispatch, useSelector } from "react-redux";
import { getOneDocsById } from "../../../../actions/docs";
import { useTranslation } from "react-i18next";
import DocSection from "./DocSection/DocSection";
import SkeletonScreen from "../SkeletonScreen/SkeletonScreen";
import { CalendarContextProvider } from "../../screens/CalendarView/CalendarContext";
import SearchIconWithIcon from "../SearchIconWithIcon/SearchIconWithIcon";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import lIcon from "../../assets/lIcon.svg";

const InfoBill = ({
  stateAsset,
  setStateAsset,
  stateContact,
  setStateContact,
  stateDoc,
  setStateDoc,
}) => {
  const dispatch = useDispatch();
  const [t] = useTranslation("InfoBill");

  const contactsRef = useRef(null);
  const [newAsset, setNewAsset] = useState(false);
  const [parametersEditing, setParametersEditing] = useState({});
  const [articlesEditing, setArticlesEditing] = useState({});
  const [editBaseImport, setEditBaseImport] = useState({});
  const [seeArticles, setSeeArticles] = useState(true);
  const [parameters, setParameters] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showNewContactPopup, setShowNewContactPopup] = useState(false);
  const [taxQuantity, setTaxQuantity] = useState();
  const [editingTax, setEditingTax] = useState(false);
  const [discountQuantity, setDiscountQuantity] = useState();
  const [editingDiscount, setEditingDiscount] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("")

  const [expandedId, setExpandedId] = useState(null);
  const [indexSelected, setIndexSelected] = useState(null)
  const [update, setUpdate] = useState(false)

const toggleExpanded = (id, index) => {
  if(id === expandedId){
    setExpandedId(null);
  setIndexSelected(null)
  }else{
    setExpandedId(prev => (prev === id ? null : id));
    setIndexSelected(index)
  }
};


  const toggleEditing = (id) => {
    setParametersEditing((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleArticleEditing = (id) => {
    setArticlesEditing((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEditBaseImport = (id) => {
    setEditBaseImport((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddParameter = () => {
    const newParameter = {
      id: Date.now(),
      name: `${t("parameter")} ${parameters.length + 1}`,
      value: `${t("parameterValue")} ${parameters.length + 1}`,
    };
    setParameters((prev) => [...prev, newParameter]);
  };



  const handleDeleteActivo = (id) => {
    setStateAsset((prev.assets || []).filter((param) => param.id !== id));
  };
  

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setStateDoc((prevState) => {
        const oldIndex = prevState.assets.findIndex((item) => item._id === active.id);
        const newIndex = prevState.assets.findIndex((item) => item._id === over.id);
  
        if (oldIndex === -1 || newIndex === -1) return prevState;
  
        const newAssets = arrayMove(prevState.assets, oldIndex, newIndex);
  
        return {
           newAssets
        };
      });
    }
  };
  
  const handleDragEndParameters = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setParameters((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };
  const handleInputChange = (id, field, value, index) => {
    setUpdate(index);
    setStateAsset((prevAssets) =>
      prevAssets.map((article) =>
        article._id === id ? { ...article, [field]: value } : article
      )
    );
  };
  
  
  const handleInputChangeDiscount = (id, value) => {
    setStateAsset((prevState) => {
      const updatedAssets = prevState.assets.map((article) =>
        article._id === id
          ? { ...article, DiscountQuantity: { quantity: value } }
          : article
      );
      return {
     updatedAssets,
      };
    });
  };
  

  const handleDeleteAsset = async (id) => {
    try {
      await dispatch(deleteAssets({ clientSelected: id }));
  
      if (stateDoc?._id && !stateDoc._id.includes("uuidv4")) {
        const response = await dispatch(
          getOneDocsById({
            docId: stateDoc._id,
          })
        );
  
        if (response.payload) {
          setStateDoc((prev) => ({
            ...prev,
            ...response.payload.doc,
          }));
          setStateAsset(response.payload.assets || [],)
        }
      } else {
        setStateAsset(prev.assets.filter((asset) => asset._id !== id))
    
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      setStateAsset( prev.assets.filter((asset) => asset._id !== id))
   
    }
  };
  


  const getFilterOptions = (label) => {
    return label.conditions.length > 0
      ? label.conditions
      : [t("noOptionsAvailable")];
  };

  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.target.classList.add(styles.dragging);
  };

  const [startDate, setStartDate] = useState("");
  const startDateInputRef = useRef(null);
  const [showStartDate, setShowStartDate] = useState(false);
  const handleLabelClickStartDate = () => {
    if (startDateInputRef.current) {
      startDateInputRef.current.showPicker(); 
    }
  };

  const endDateInputRef = useRef(null);
 

  const [selectedSection,setSelectedSection] = useState(0)

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

  const handleAssetClick = async (asset) => {
    
 setStateAsset((prev) => ([...(prev || []), asset]))
 const res =await dispatch(setDocIdInAsset({id:asset._id, docId:stateDoc._id}))
    setIsFocused(false);
  };
  const searchInputRef = useRef(null);

  useFocusShortcut(searchInputRef, "/");



  return (
    <div className={styles.infoBillContainer}>
      <div className={styles.btnSectionsSelector}>
        <button
          onClick={() => setSelectedSection(0)}
          className={selectedSection === 0 ? styles.sectionSelect : ''}
        >
          <DocSectionIcon />
        </button>
        <button
          onClick={() => setSelectedSection(1)}
          className={selectedSection === 1 ? styles.sectionSelect : ''}
        >
          <ContactSectionIcon />
        </button>
        <button
          onClick={() => setSelectedSection(2)}
          className={selectedSection === 2 ? styles.sectionSelect : ''}
        >
          <AssettSectionIcon />
        </button>
      </div>
      {selectedSection === 0 ? (
  <CalendarContextProvider>
        <DocSection stateDoc={stateDoc} setStateDoc={setStateDoc} />
  </CalendarContextProvider>
      ) : selectedSection === 1 ? (
        <div>
          <InfoClientBill
            textareaPlaceHolder={t("textareaPlaceHolderContact")}
            urlImg={profileImage}
            placeholderInput={t("placeholderInputContact")}
            setShowNewContact={setShowNewContactPopup}
            contact={stateContact}
            setStateContact={setStateContact}
            stateDoc={stateDoc}
            textHeader={t("textHeader")}
            type="contact"
            setNewAssetFather={setNewAsset}
          />
        </div>
      ) : selectedSection === 2 ? (
        <>
          <div
            className={styles.inputContainerNew}
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
         
            {isFocused && inputValue?.length > 0 && (
              <ContactsPopup
                ref={contactsRef}
                handleAssetClick={handleAssetClick}
                type={"asset"}
                inputValue={inputValue}
                setNewAsset={setNewAsset}
              />
            )}
          </div>

          {stateAsset?.length > 0 ? (
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={stateAsset.map((item) => item._id)}>
                <div
                  className={styles.parametersInfo}
                  style={{
                    height: seeArticles ? "auto" : "0px",
                    padding: seeArticles ? "20px 0" : "0px",
                    borderBottom: !seeArticles && "1px solid transparent",
                  }}
                >
                  <div className={styles.articleBill}>
                    {stateAsset.map((item, index) => (
                      <AssetLine
                        update={update}
                        setUpdate={setUpdate}
                        endItem={stateAsset.length-1}
                        index={index}
                        indexSelected={indexSelected}
                        expanded={expandedId === item._id}
                        toggleExpanded={() => toggleExpanded(item._id, index)}
                        key={item._id}
                        article={item}
                        id={item._id}
                        articlesEditing={articlesEditing}
                        editBaseImport={editBaseImport}
                        toggleArticleEditing={toggleArticleEditing}
                        handleDeleteActivo={handleDeleteActivo}
                        setShowTaxModal={setShowTaxModal}
                        setShowDiscountModal={setShowDiscountModal}
                        handleEditBaseImport={handleEditBaseImport}
                        handleInputChange={handleInputChange}
                        handleDeleteAsset={handleDeleteAsset}
                        setNewAsset={setNewAsset}
                        taxQuantity={taxQuantity}
                        setEditingTax={setEditingTax}
                        editingTax={editingTax}
                        handleInputChangeDiscount={handleInputChangeDiscount}
                        discountQuantity={discountQuantity}
                        editingDiscount={editingDiscount}
                      />
                    ))}
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className={styles.skeletonScreenInfoBill}>
              <SkeletonScreen
                labelText={t("noAssetFound")}
                helperText={t("yourAssetsListedHere")}
                showInput={true}
                enableLabelClick={false}
              />
            </div>
          )}
        </>
      ) : (
        ""
      )}

    
      {newAsset && <NewAsset setNewAsset={setNewAsset} />}
    </div>
  );
};

export default InfoBill;
