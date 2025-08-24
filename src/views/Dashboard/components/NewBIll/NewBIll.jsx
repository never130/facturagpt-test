import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./NewBIll.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa";
import Button, { ButtonDiferentContentScreen } from "../Button/Button";
import profileImage from "../../assets/profileIcon.svg";
import { getOneDocsById } from "@src/actions/docs";
import useCloseOnEsc from "../../../../utils/useClose";
import { useTranslation } from "react-i18next";
import SearchSVG from "../Automate/svgs/SearchSVG";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import NavigationPopups from "../NavigationPopups/NavigationPopups";
import { ReactComponent as ArrowSquare } from "../../assets/whiteArrowSquareIn.svg";
import { ReactComponent as ArrowSquareInGreen } from "../../assets/ArrowSquareInGreen.svg";
import KIcon from "../../assets/KIcon.svg";

import { ReactComponent as AddBlack } from "../../assets/addBlack.svg";
import { ReactComponent as GreenMailIcon } from "../../assets/greenMailIcon.svg";
import { ReactComponent as Pencil } from "../../assets/pencilEdit.svg";
import AiIcon2 from "../../assets/AIcon.svg";
import { ReactComponent as CloseXIcon } from "../../assets/CloseXIcon.svg";
import { ReactComponent as WhiteFolder } from "../../assets/whiteFolder.svg";
import { ReactComponent as BlackCheckboxIcon } from "../../assets/blackCheckboxIcon.svg";

import InputComponent from "../InputComponent/InputComponent";
import Advertency from "../Automate/Components/Advertency/Advertency";
import InfoClientBill from "../InfoBill/InfoClientBill/InfoClientBill";
import CustomAutomationsWrapper from "../CustomAutomationsWrapper/CustomAutomationsWrapper";
import OptionsSwitchComponent from "../OptionsSwichComponent/OptionsSwitchComponent";
import LogoSelector from "../LogoSelector/LogoSelector";
import CreateNotePopup from "../CreateNotePopup/CreateNotePopup";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import EditableInput from "../../screens/Contacts/EditableInput/EditableInput";
import DeleteButton from "../DeleteButton/DeleteButton";
import PayMethod from "../PayMethod/PayMethod";
import SearchIconWithIcon from "../SearchIconWithIcon/SearchIconWithIcon";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import AssetLine from "../AssetLine/AssetLine";
import VariableListModal from "../VariableListModal/VariableListModal";
import VariableModal from "../VariableModal/VariableModal";
import SelectLocation from "../SelectLocation/SelectLocation";
import AddDiscount from "../AddDiscount/AddDiscount";
import AddTax from "../AddTax/AddTax";
import { getUserFiles } from "../../../../actions/scaleway";
import CorporativeModalText from "../CorporativeModalText/CorporativeModalText";
import NewTag from "../NewTag/NewTag";
import { handleFileUpload } from "../../../../utils/pdfUtils";
import { createTable, createTableData, getTableDataById, getTableDataFiltered, getTables, refreshTableInfo } from "../../../../actions/user";

const NewBIll = ({ setShowNewBill,
   getDocuments,
   typeContainer,
  customStyleOverlay,
  customStyleNewContactContainer,
  customStylePopupNewContaier,
  customStyleColumnRightContactInfo,
  customStyleModalTemplateHeader,
  customStyleLeftSide,
  customStyleContentContainer,
  customStyleButtonContainer,
  customStyleButtonHeader,
  customStyleColumnDirection,
  customStyleModalTemplate,
  customStyleNavigationPopupsContainer,
  fatherDoc ,

  isGlobalTables,
  createData, tableId, headers ,
  tableType,
  idDOcument
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("navbarAdmin");

  const { contact } = useSelector((state) => state.contacts);
  const navigate = useNavigate();
  const { user, fatherNewBill, fatherIdNewBill } = useSelector((state) => state.user);
  const [hasNote, setHasNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [typeVariableModal, setTypeVariableModal] = useState("category");
  const [showVariableListModal, setShowVariableListModal] = useState(false);
  const [beforeApproveDocument,setBeforeApproveDocument] = useState(false)
  const [seeBill, setSeeBill] = useState(false);
  const [isClosing , setIsClosing ] = useState(false)

  const [showAddTags, setShowAddTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [updatingDoc, setUpdatingDoc] = useState(fatherDoc ? true  : false);

  const [isLoading, setIsLoading] = useState(false);

  const [showCorporativeModal, setShowCorporativeModal] = useState(false);
  const [corporativeTitle, setCorporativeTitle] = useState("");
  const [corporativeMessage, setCorporativeMessage] = useState("");

  const { id, contactId, docsId } = useParams();

  const [stateDoc, setStateDoc] = useState(fatherDoc ? {...fatherDoc} : {
    _id: uuidv4(), 
    type: 'bill',
    status: 'draft'
  });


  useEffect(() => {
    if (docsId || idDOcument) {
      const fn = async () => {
        let response
         response = await dispatch(
          getOneDocsById({
            docId: docsId || idDOcument,
          })
        );
        let row
              if(!response.payload){
                const res = await dispatch(getTables())
                  const tables = res?.payload?.tables
        
                   if (tables.length > 0) {
                    console.log('tables', tables)
              for (let table of tables) {

                row =  await dispatch(getTableDataById({tableId:table._id, rowId:docsId}))
                 if (row.payload?.data?.length > 0) {
                  response = {payload:{doc:{...row.payload?.data[0]}}}
                   break;
                   }
                 }
                }
              }

        if (response?.payload?.doc) {
          setStateDoc(response.payload.doc);
          setUpdatingDoc(true);
          setInfoBill(response.payload.doc);
        }
      };
      fn();
    }
  }, [docsId, dispatch,id]);

  const handleAddNote = () => {
    setHasNote(true);
    setNoteText("");
  };




  const [editingNote, setEditingNote] = useState(false);
  const [editorContentFinal, setEditorContentFinal] = useState("");


  const [createdNote, setCreatedNote] = useState(false);
  const [noteColor, setNoteColor] = useState("tagGreen");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [approveDocument, setApproveDocument] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNewContactPopup, setShowNewContactPopup] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);


  const handleCloseAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (setShowNewBill) {
        setShowNewBill(false);
      } else {
        fatherNewBill == "tables"
          ? navigate(`/admin/tables`)
          :fatherNewBill == "chat"
          ? navigate(`/admin/chat`)
            : fatherNewBill === "chatId"
            ? navigate(`/admin/chat/${fatherIdNewBill.agentId}/${fatherIdNewBill.chatId}`)
              : fatherNewBill === "agentId"
              ? navigate(`/admin/chat/${fatherIdNewBill}`)
              : fatherNewBill === "home"
                 ? navigate(`/admin/home`)
                 : fatherNewBill !== null
                 ? navigate(`/admin/${fatherNewBill}`)
                        : navigate(`/admin/tables`)
          // : navigate(`/admin/docs/${contactId}`);
      }
    }, 300); // Duración de la animación en CSS
  };

  // useCloseOnEsc(setShowNewBill, `/admin/docs/${contactId}`);
  useCloseOnEsc(handleCloseAnimation, `/admin/tables`);



  const [infoBill, setInfoBill] = useState(fatherDoc ? {...fatherDoc} : {
    _id: uuidv4(),
    stateStripe: t("Paid"),
    location: user?.id,
    contactId: id,
  });

 
  const [location, setLocation] = useState(user?.id + "/");
  const [pdfUrl, setPdfUrl] = useState(null);

  const [selectedPdf, setSelectedPdf] = useState(null);

  const handleCreateBill = () => {};
  const handleDelete = () => {};
  const [showContent, setShowContent] = useState({
    info1: false,
    info2: false,
    info3: false,
  });

  const [startDate, setStartDate] = useState("");
  const startDateInputRef = useRef(null);
  const [showStartDate, setShowStartDate] = useState(false);
  const handleLabelClickStartDate = () => {
    if (startDateInputRef.current) {
      startDateInputRef.current.showPicker(); 
    }
  };

  const [endDate, setEndDate] = useState("");
  const endDateInputRef = useRef(null);
  const [showEndDate, setShowEndDate] = useState(false);
  const handleLabelClickEndDate = () => {
    if (endDateInputRef.current) {
      endDateInputRef.current.showPicker(); 
    }
  };
  const corporativeFileInputRef = useRef(null);
  const signatureFileInputRef = useRef(null);
  const profileFileInputRef = useRef(null);

  const handleConfigurationChange = (key, value) => {
    setInfoBill((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddImageClick = (type) => {
    if (type === "corporativeLogos" && corporativeFileInputRef.current) {
      corporativeFileInputRef.current.click();
    }
    if (type === "signatureImages" && signatureFileInputRef.current) {
      signatureFileInputRef.current.click();
    }
    if (type === "profileImage" && profileFileInputRef.current) {
      profileFileInputRef.current.click();
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setInfoBill((prev) => ({
      ...prev,
      ...(type === "corporativeLogos"
        ? {
            corporativeLogos: [...(prev.corporativeLogos || []), imageUrl],
          }
        : {
            signatureImages: [...(prev.signatureImages || []), imageUrl],
          }),
    }));
  };

  const handleDeleteLogo = (urlToRemove, type) => {
    setInfoBill((prev) => ({
      ...prev,
      ...(type === "corporativeLogos"
        ? {
            corporativeLogos: prev.corporativeLogos?.filter(
              (url) => url !== urlToRemove
            ),
          }
        : {
            signatureImages: prev.signatureImages?.filter(
              (url) => url !== urlToRemove
            ),
          }),
    }));
  };

  const handleChange = ({ name, newValue }) => {
    setInfoBill({ ...infoBill, [name]: newValue });
  };
  const [editingPaymethod, setEditingPayMethod] = useState(false);

  const [inputsEditing, setInputsEditing] = useState({
    invoiceNumber: false,
    reference: false,
  });
  const [currentPayMethod, setCurrentPayMethod] = useState({
    bank: "",
    accountNumber: "",
    swift: "",
    routingNumber: "",
    currency: "",
    default: false,
  });

  const [editingIndexPayMethod, setEditingIndexPayMethod] = useState(null);

  const addPayMethod = () => {
    setInfoBill((prevData) => ({
      ...prevData,
      paymethod: [...(prevData.paymethod || []), { ...currentPayMethod }],
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

  const handlePayMethodChange = (field, value) => {
    setCurrentPayMethod((prev) => {
      const updatedPayMethod = { ...prev, [field]: value };

      if (field === "default" && value) {
        setInfoBill((prevData) => ({
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

  const [searchTermTitle, setSearchTermTitle] = useState("");
  const [searchTermAsset, setSearchTermAsset] = useState("");

  const searchInputRefAsset = useRef(null);
  useFocusShortcut(searchInputRefAsset, "k");

  const searchInputRefTitle = useRef(null);
  useFocusShortcut(searchInputRefTitle, "k");

  const [editableIndexes, setEditableIndexes] = useState([]); 

  const [disabledTitles, setDisabledTitles] = useState([]);
  const [disabledAssets, setDisabledAssets] = useState([]);

  const toggleTitleEdit = (index) => {
    setDisabledTitles((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const toggleAssetEdit = (index) => {
    setDisabledAssets((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const deleteTitle = (index) => {
    setInfoBill((prev) => ({
      ...prev,
      titles: prev.titles.filter((_, i) => i !== index),
    }));
    setDisabledTitles((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteAssetLine = (index) => {
    setInfoBill((prev) => ({
      ...prev,
      assetLines: prev.assetLines.filter((_, i) => i !== index),
    }));
    setDisabledAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const [newAsset, setNewAsset] = useState(false);
  const [parametersEditing, setParametersEditing] = useState({});
  const [articlesEditing, setArticlesEditing] = useState({});
  const [editBaseImport, setEditBaseImport] = useState({});
  const [editQuantity, setEditQuantity] = useState({});
  const [editTotal, setEditTotal] = useState({});
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showTaxModalNavigation, setShowTaxModalNavigation] = useState(false);
  const [showDiscountModalNavigation, setShowDiscountModalNavigation] =
    useState(false);
  const [taxQuantity, setTaxQuantity] = useState();
  const [editingTax, setEditingTax] = useState(false);
  const [discountQuantity, setDiscountQuantity] = useState();
  const [editingDiscount, setEditingDiscount] = useState(false);
  const [existCreateFolder, setExistCreateFolder] = useState(false);

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
  const handleEditQuantity = (id) => {
    setEditQuantity((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleEditTotal = (id) => {
    setEditTotal((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteActivo = (id) => {
    setInfoBill((prev) => prev.filter((param) => param.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setInfoBill((prev) => ({
      ...prev,
      assetLines: prev.assetLines.map((article) =>
        article.id === id ? { ...article, [field]: value } : article
      ),
    }));
  };

  const handleInputChangeDiscount = (id, value) => {
    setInfoBill((prev) =>
      prev.map((article) =>
        article._id === id
          ? { ...article, DiscountQuantity: { quantity: value } }
          : article
      )
    );
  };

  const handleDeleteAsset = async (id) => {};

  const addAssetsLine = () => {
    setInfoBill((prev) => ({
      ...prev,
      assetLines: [
        ...(prev.assetLines || []),
        {
          id: Date.now(),
          name: "",
          description: "",
          image: "",
          quantity: 0,
          baseImport: 0,
          tax: 0,
          discount: 0,
          total: 0,
          parameters: [],
        },
      ],
    }));
  };


  const headerTable =  [
    {
      label: "ID Transacción",
      key: "documentTitle",
      type:"number"
    },
    {
      label: "Descripción y Categoria",
      key: "description",
      type:"textBox"
    },
    {
      label: "Notas",
      key: "tag",
      type:"textBox"
    },
    {
      label: "Total",
      key: "total",
      type:"number"
    },
    {
      label: "Fecha",
      key: "date",
      type:"date"
    },
    {
      label: "Vencimiento",
      key: "expirationDate",
      type:"number"
    },
    {
      label: "Método de Pago",
      key: "payMethod",
      type:"number"
    },
    {
      label: "Estado",
      key: "state",
      type:"textBox"
    },
    {
      label: "Artículos",
      key: "items",
      type:"textBox"
    },
  ]

  const fileInputRef = useRef(null);
  const [selectedAssetLine, setSelectedAssetLine] = useState();
  const saveDocument = async (type) => {
    
   if(isGlobalTables){
    createData(tableId, headers,infoBill,'docs');
    
    handleCloseAnimation()
    // setShowNewBill(false);
   }else{

     if (!infoBill.documentTitle ) {
       setShowCorporativeModal(true);
       setCorporativeTitle(t("nameAndFileIsRequired"));
       setCorporativeMessage(t("nameFileRequiredCreateTransaction"));
       return;
     }
 
     setIsLoading(true);
 
     try {


      const fn = async () => {
        let filteredTable
        const res = await dispatch(getTables())
        let tables = res?.payload?.tables

        let oldestContactTable = null;

        if(tables.length === 0){
          await dispatch(createTable({ headers: headerTable, name: "", type: "docs" })); 
          const res = await dispatch(getTables())
           tables = res?.payload?.tables
        }

for (let table of tables) {
if (table.type === "docs") {
  if (
    !oldestContactTable ||
    new Date(table.createdAt) < new Date(oldestContactTable.createdAt)
  ) {
    oldestContactTable = table;
    filteredTable = table;
  }
}
}



if(!filteredTable){
  await dispatch(createTable({ headers: headerTable, name: "", type: "docs" })); 
const res = await dispatch(getTables())
 tables = res?.payload?.tables

 for (let table of tables) {
  if (table.type === "docs") {
    if (
      !oldestContactTable ||
      new Date(table.createdAt) < new Date(oldestContactTable.createdAt)
    ) {
      oldestContactTable = table;
      filteredTable = table
    }
  }
}
}

await dispatch(
createTableData({ tableId: filteredTable._id, headers: filteredTable.headers, data: infoBill, type:'docs' })
); await dispatch(refreshTableInfo({ tableId: filteredTable._id }))

await dispatch(getTableDataFiltered({tableId:filteredTable._id,
}));
      }
      fn()


 
     } catch (error) {
       console.error("Error en saveDocument:", error);
     } finally {
       setIsLoading(false);
       if (setShowNewBill) {
        if(getDocuments) {
          getDocuments();
        }
        handleCloseAnimation()
        //  setShowNewBill(false);
       } else {
        handleCloseAnimation()

        // fatherNewBill == "tables"?
        // navigate(`/admin/tables`):
        //  navigate(`/admin/docs/${contactId}`);
       }
     }
   }

  };

  const saveDraft = () => {
    saveDocument('defaulted')
  }


  const handlePercentageChange = async (value, field, isPercentage = false) => {
    setInfoBill((prev) => {
      const subtotal = prev.subtotal || 0;
      const parsedValue = parseFloat(value);

     
      if (!value || isNaN(parsedValue)) {
        return prev;
      }

      const updatedDoc = { ...prev };
      let computedValue;
      let computedPercentage;

      if (isPercentage) {
        computedValue = Number(((parsedValue / 100) * subtotal).toFixed(2)); 
        computedPercentage = Number(parsedValue.toFixed(2)); 
      } else {
        computedValue = Number(parsedValue.toFixed(2)); 
        computedPercentage = Number(
          ((parsedValue / subtotal) * 100).toFixed(2)
        ); 
      }
      updatedDoc[field] = computedValue;

     
      if (field === "discount") {
        updatedDoc.discountPercentage = computedPercentage;
      } else if (field === "tax") {
        updatedDoc.taxPercentage = computedPercentage;
      }

     
      const discount =
        field === "discount" ? computedValue : prev.discount || 0;
      const tax = field === "tax" ? computedValue : prev.tax || 0;
      const effectiveSubtotal = field === "subtotal" ? computedValue : subtotal;
      const total = field === "total" ? computedValue : prev.total || 0;
      if (field === "total") {
        updatedDoc.subtotal = Number((total + discount - tax).toFixed(2));
      } else if (["discount", "tax", "subtotal"].includes(field)) {
        updatedDoc.total = Number(
          (effectiveSubtotal - discount + tax).toFixed(2)
        );
      }
      
      return updatedDoc;
    });
  };

  const handleBtnsActions = (type) => {};


  useEffect(() => {
    setInfoBill((prev) => ({
      ...prev,
      selectedtags: selectedTags,
      tags: tags,
    }));
  }, [selectedTags, tags]);


  const handleUploadFile = async(nameDoc,id,type,infoBill) => {
    const userLocalStorage = localStorage.getItem("user");
    const parsedUser = userLocalStorage
      ? JSON.parse(userLocalStorage)
      : null;


      if (parsedUser) {
        const res = await handleFileUpload(infoBill.pdfFile, user?.id + "/", nameDoc, id,type,infoBill);
      
        if (res && !res.error && res.status === 200) {
          if(getDocuments){
            getDocuments()
          }
      const response = await dispatch(
            getUserFiles({ userId: user.id, token: parsedUser.accessToken })
          ).unwrap();
        } else {
          console.error("No se pudo subir el archivo. No se actualizarán los archivos del usuario.");
        }
      }
      

    
  };
  

  return (
    <div style={customStyleOverlay}>
      <div
        className={typeContainer !== "popup" && styles.bg}
        onClick={() => { if(typeContainer !== "popup"){ handleCloseAnimation() }}}
      ></div>
      <div className={`${typeContainer !== "popup" && styles.newContactContainer} ${isClosing ? styles.closing : ''}`} style={ customStyleNewContactContainer}>
        <ModalTemplate
          actionSave={handleCreateBill}
          onClick={() => { handleCloseAnimation() }}
          typeTextHeader={t("new")}
          text={t("bill")}
          isAnimating={isAnimating}
          className={`${styles.newContactContainer} `}
          newContact={true}
          selectedContact={contact}
          reverseMobile={true}
          handleDelete={handleDelete}
          setShowNewBill={setShowNewBill}
          bill={true}
          saveDocument={saveDocument}
          saveDraft={saveDraft}
          type={typeContainer}
           father={"transaction"}
          customStyleModalTemplateHeader={customStyleModalTemplateHeader}
          customStyleContentContainer={customStyleContentContainer}
          customStyleButtonContainer={customStyleButtonContainer}
          customStyleButtonHeader={customStyleButtonHeader}
          customStyleModalTemplate={customStyleModalTemplate}
          setSeeBill={setSeeBill}
          docId={fatherDoc ? fatherDoc?._id : stateDoc?._id }
          tableId={tableId}
        >
          <div
            className={`${styles.loading} ${isLoading ? styles.active : ""}`}
          />
          <div className={styles.popupNewContaier} style={customStylePopupNewContaier}>
            <div className={styles.leftSide} style={customStyleLeftSide}>
              <NavigationPopups
                type={"bill"}
                setParameters={setStateDoc}
                parameters={stateDoc.parameters}
                newContact={true}
                handleDelete={handleDelete}
                text={t("bill")}
                setInfoBill={setInfoBill}
                infoBill={infoBill}
                addAssetsLine={addAssetsLine}
                setShowNewBill={setShowNewBill}
                setShowDiscountModalNavigation={setShowDiscountModalNavigation}
                setShowTaxModalNavigation={setShowTaxModalNavigation}
                docsId={docsId}
                beforeApproveDocument={beforeApproveDocument}
                setBeforeApproveDocument={setBeforeApproveDocument}
                handleBtnsActions={handleBtnsActions}
                setShowAddTags={setShowAddTags}
                showAddTags={showAddTags}
                setSelectedTags={setSelectedTags}
                fileInputRef={fileInputRef}
                typeContainer={typeContainer}
                customStyleNavigationPopupsContainer={customStyleNavigationPopupsContainer}
                setSeeBill={setSeeBill}
                seeBill={seeBill}
                tableType={tableType}
              />
            </div>
            <div className={styles.containerNewContactForm} style={customStyleColumnRightContactInfo}>
              <form
                className={styles.newContactForm}
                id="scrollContainer"
              >
                <div className={styles.sectionContact}>
                  <h3 id="generalInformation">{t("generalInformation")}</h3>
                  <div className={styles.infoLabelIdentification}>
                    <div className={styles.documentTitle}>

                      <EditableInput
                          label={t("documentTitle")}
                          nameInput={"documentTitle"}
                          placeholderInput={infoBill?.documentTitle || t("documentTitle")}
                          isEditing={inputsEditing.documentTitle}
                          value={infoBill?.documentTitle}
                          onChange={(e) => {
                            setInfoBill({
                              ...infoBill,
                              documentTitle: e.target.value,
                            });
                          }}
                          onClick={() =>
                            setInputsEditing((prev) => ({
                              ...prev,
                              documentTitle: !prev.documentTitle,
                            }))
                          }
                          newFormat={true}
                        ></EditableInput>
                      
                    </div>

                    <div className={styles.type}>
                      <p>{t("type")}</p>
                      <div className={styles.dropdownContainer}>
                        <div className={styles.dropdownsLeft} style={customStyleColumnDirection}>
                          <div
                            className={styles.dropdown}
                            onClick={() => {
                              setTypeVariableModal("category");
                              setShowVariableListModal(true);
                            }}
                          >
                            {infoBill?.category ? (
                              <>
                                {infoBill?.category?.title}
                                <FaChevronDown className={styles.chevronIcon} />
                              </>
                            ) : (
                              <>
                                {t("selectCategory")}{" "}
                                <img
                                  src={AiIcon2}
                                  alt="Icono"
                                  height={"15px"}
                                />{" "}
                                <FaChevronDown className={styles.chevronIcon} />
                              </>
                            )}
                          </div>
                          <div
                            className={styles.dropdown}
                            onClick={() => {
                              setTypeVariableModal("concept");
                              setShowVariableListModal(true);
                            }}
                          >
                            {infoBill?.concept ? (
                              <>
                                {infoBill?.concept?.title}
                                <FaChevronDown className={styles.chevronIcon} />
                              </>
                            ) : (
                              <>
                                {t("concept")}
                                <FaChevronDown className={styles.chevronIcon} />
                              </>
                            )}
                          </div>
                          {showVariableListModal && (
                            <VariableListModal
                              type={typeVariableModal}
                              setShowVariableListModal={
                                setShowVariableListModal
                              }
                              setShowVariableModal={setShowVariableModal}
                              setSelectedVariable={setInfoBill}
                              customStyles={{
                                left:
                                  typeVariableModal == "category"
                                    ? "0px"
                                    : "450px",
                                top: "100%",
                                width: "49%",
                              }}
                            />
                          )}
                          {showVariableModal && (
                            <VariableModal
                              setShowVariableModal={setShowVariableModal}
                              VariableModal={showVariableModal}
                              type={typeVariableModal}
                            />
                          )}
                        </div>
                      </div>
                      <span className={styles.infoSpan}>
                        {t("classifyOrganizeYourInvoice")}
                      </span>
                    </div>

                    <div className={styles.contentInnerContainer}>
                      <span className={styles.titleContentInput}>
                        {t("ubication")}
                      </span>
                      <InputComponent
                        readOnly={true}
                        value={infoBill?.location?.replace(user.id, "Inicio")}
                        textButton={
                          true === "dont show" ? "" : t("selectUbication")
                        }
                        placeholder="/Inicio"
                        icon={<SearchSVG />}
                        action={() => setShowLocationModal(true)}
                        graySelectLocationBtn={true}
                      />
                      <span className={styles.infoSpan}>
                        {t("selectSaveDocument")}
                      </span>
                      <Advertency text={t("firtsDayMonth")} />
                    </div>

                    <InfoClientBill
                      textareaPlaceHolder={t("billingAddressRecipient")}
                      urlImg={profileImage}
                      placeholderInput={t("searchContact")}
                      setShowNewContact={setShowNewContactPopup}
                      contact={infoBill?.contact}
                      setStateContact={(option) => {
                        setInfoBill((prev) => ({
                          ...prev,
                          contact: option,
                        }));
                      }}
                      textHeader={t("contact")}
                      type="contact"
                    />

                    <div className={styles.sendByMail}>
                      <input
                        type="checkbox"
                        checked={infoBill?.sendByMail}
                        onChange={(e) => {
                          setInfoBill((prev) => ({
                            ...prev,
                            sendByMail: e.target.checked,
                          }));
                        }}
                      />
                      <span className={styles.infoSpan}>{t("sendByMail")}</span>
                    </div>

                    <CustomAutomationsWrapper
                      Icon={<WhiteFolder />}
                      showContent={showContent.info2}
                    >
                      <div
                        className={`${styles.infoContainerWrapper}`}
                
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {showContent.info2 && <GreenFileDesk />}
                          <div className={styles.infoContainer}>
                            <div>{t("wantSaveRecurrentDoc")}</div>
                            <span>{t("selectFrequencyRecurrentDoc")}</span>
                          </div>
                        </div>
                        <OptionsSwitchComponent
                          border={"none"}
                          marginLeft={"auto"}
                          isChecked={infoBill?.createRecurrentDocument || false}
                          setIsChecked={(value) =>
                            handleConfigurationChange(
                              "createRecurrentDocument",
                              value
                            )
                          }
                          blackBg={true}
                        />
                      </div>
                      <div
                        className={`${styles.contentContainer} ${infoBill?.createRecurrentDocument ? styles.active : styles.disabled}`}
                      >
                        <div className={styles.contentInput}>
                          <span className={styles.quantityContainer}>
                            <div className={styles.quantityContent}>
                              <div
                                className={styles.quantityContent}
                                style={{ position: "relative" }}
                                onClick={() => setShowStartDate(!showStartDate)}
                              >
                                <p>{t("issueDate")}</p>
                                <label
                                  onClick={handleLabelClickStartDate}
                                  style={{
                                    cursor: "pointer",
                                    width: "100%",
                                    background: "#f4f4f4",
                                    height: "35px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: 0,
                                  }}
                                >
                                  {startDate ? startDate : t("from")}
                                </label>
                                <input
                                  ref={startDateInputRef}
                                  id="startDate"
                                  type="date"
                                  onChange={(e) => {
                                    setStartDate(e.target.value);
                                    handleConfigurationChange(
                                      "startDate",
                                      e.target.value
                                    );
                                  }}
                                  value={startDate}
                                  style={{
                                    position: "absolute",
                                    top: "100%", 
                                    left: "0",
                                    width: "1px", 
                                    height: "1px",
                                    opacity: 0,
                                    pointerEvents: "none", 
                                  }}
                                />
                              </div>
                            </div>

                            <div
                              className={styles.quantityContent}
                              style={{ position: "relative" }}
                              onClick={() => setShowEndDate(!showEndDate)}
                            >
                              {t("ending")}
                              <label
                                onClick={handleLabelClickEndDate}
                                style={{
                                  cursor: "pointer",
                                  width: "100%",
                                  background: "#f4f4f4",
                                  height: "35px",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: 0,
                                }}
                              >
                                {endDate ? endDate : t("until")}
                              </label>
                              <input
                                ref={endDateInputRef}
                                id="endDate"
                                type="date"
                                min={startDate}
                                onChange={(e) => {
                                  setEndDate(e.target.value);
                                  handleConfigurationChange(
                                    "endDate",
                                    e.target.value
                                  );
                                }}
                                value={endDate}
                                style={{
                                  position: "absolute",
                                  top: "100%", 
                                  left: "0",
                                  width: "1px", 
                                  height: "1px",
                                  opacity: 0,
                                  pointerEvents: "none",
                                }}
                                onBlur={() => setShowEndDate(false)}
                              />
                            </div>
                          </span>
                        </div>
                        {true && (
                          <>
                            <CustomAutomationsWrapper
                              Icon={<ArrowSquare />}
                              showContent={infoBill?.renameFilesAutomatically}
                            >
                              <div
                                className={styles.infoContainerWrapper}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  {infoBill?.renameFilesAutomatically && (
                                    <ArrowSquareInGreen
                                      height="65px"
                                      width="65px"
                                    />
                                  )}
                                  <div className={styles.infoContainer}>
                                    <div>{t("automaticallyRenameFiles")}</div>
                                    <span>{t("setClearCustomNames")}</span>
                                  </div>
                                </div>
                                <OptionsSwitchComponent
                                  border={"none"}
                                  marginLeft={"auto"}
                                  isChecked={
                                    infoBill?.renameFilesAutomatically || false
                                  }
                                  setIsChecked={(value) =>
                                    handleConfigurationChange(
                                      "renameFilesAutomatically",
                                      value
                                    )
                                  }
                                  blackBg={true}
                                />
                              </div>
                              <div
                                className={`${styles.contentContainer} ${infoBill?.renameFilesAutomatically ? styles.active : styles.disabled}`}
                              >
                                <InputComponent
                                  value={infoBill?.renameFile}
                                  setValue={(value) =>
                                    handleConfigurationChange(
                                      "renameFileValue",
                                      value
                                    )
                                  }
                                  placeholder={t(
                                    "write[id][title]toCustomDocuments"
                                  )}
                                />
                              </div>
                            </CustomAutomationsWrapper>
                          </>
                        )}
                      </div>
                    </CustomAutomationsWrapper>

                    <Button type="white">
                      <GreenMailIcon /> {t("seeMessage")}
                    </Button>

                    <div className={styles.logoSelectorContainer}>
                      <LogoSelector
                        text={t("logo")}
                        logos={infoBill?.corporativeLogos}
                        selectedLogo={infoBill?.selectedCorporativeLogo}
                        onAddLogo={() =>
                          handleAddImageClick("corporativeLogos")
                        }
                        onDeleteLogo={(logo) =>
                          handleDeleteLogo(logo, "corporativeLogos")
                        }
                        onSelectLogo={(logo) =>
                          handleChange({
                            name: "selectedCorporativeLogo",
                            newValue: logo,
                          })
                        }
                        fileInputRef={corporativeFileInputRef}
                        onFileChange={(e) =>
                          handleFileChange(e, "corporativeLogos")
                        }
                        buttonDown={true}
                      />

                      <LogoSelector
                        text={t("signature")}
                        logos={infoBill?.signatureImages}
                        selectedLogo={infoBill?.selectedSignatureImage}
                        onAddLogo={() => handleAddImageClick("signatureImages")}
                        onDeleteLogo={(logo) =>
                          handleDeleteLogo(logo, "signatureImages")
                        }
                        onSelectLogo={(logo) =>
                          handleChange({
                            name: "selectedSignatureImage",
                            newValue: logo,
                          })
                        }
                        fileInputRef={signatureFileInputRef}
                        onFileChange={(e) =>
                          handleFileChange(e, "signatureImages")
                        }
                        buttonDown={true}
                      />
                    </div>

                    <Button
                      type="button"
                      action={() => {
                        setHasNote(true);
                        setEditingNote(false);
                      }}
                      headerStyle={{
                        width: "fit-content",
                      }}
                    >
                      {t("addNote")}
                    </Button>

                    <div className={styles.addNote}>
                      {createdNote && (
                        <div className={`${styles.note} ${styles[noteColor]}`}>
                          <div className={styles.text}>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: editorContentFinal,
                              }}
                            ></span>
                          </div>
                          <div
                            className={styles.button}
                            onClick={() => {
                              handleAddNote();
                              setEditingNote(true);
                            }}
                          >
                            {t("editNote")}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.sectionContact}>
                  <h3 id="invoiceHeader">{t("invoiceHeader")}</h3>
                  <div className={styles.infoLabelIdentification}>
                    <div className={styles.datesInvoiceHeaderContainer} style={customStyleColumnDirection}>
                      <div className={styles.datesInvoiceHeader}>
                        <p>{t("date")}</p>
                        <CustomDropdown
                          options={[
                            "25 Dec 2025",
                            "25 Dec 2025",
                            "25 Dec 2025",
                          ]}
                          selectedOption={infoBill?.date || []}
                          height="31px"
                          textStyles={{
                            fontWeight: 300,
                            color: "#1E0045",
                            fontSize: "13px",
                            marginLeft: "6px",
                            userSelect: "none",
                          }}
                          setSelectedOption={(selected) =>
                            setInfoBill((prev) => ({
                              ...prev,
                              date: selected,
                            }))
                          }
                        />
                      </div>

                      <div className={styles.datesInvoiceHeader}>
                        <p>{t("experationDate")}</p>
                        <CustomDropdown
                          options={[
                            "25 Dec 2025",
                            "25 Dec 2025",
                            "25 Dec 2025",
                          ]}
                          selectedOption={infoBill?.experationDate || []}
                          height="31px"
                          textStyles={{
                            fontWeight: 300,
                            color: "#1E0045",
                            fontSize: "13px",
                            marginLeft: "6px",
                            userSelect: "none",
                          }}
                          setSelectedOption={(selected) =>
                            setInfoBill((prev) => ({
                              ...prev,
                              experationDate: selected,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className={styles.invoiceInfo}>
                      <EditableInput
                        label={t("invoiceNumber")}
                        nameInput={"invoiceNumber"}
                        placeholderInput={
                          infoBill?.invoiceNumber || t("autogenerated")
                        }
                        isEditing={inputsEditing.invoiceNumber}
                        value={infoBill?.invoiceNumber}
                        onChange={(e) => {
                          setInfoBill((prev) => ({
                            ...prev,
                            invoiceNumber: e.target.value,
                          }));
                        }}
                        onClick={() =>
                          setInputsEditing((prev) => ({
                            ...prev,
                            invoiceNumber: !prev.invoiceNumber,
                          }))
                        }
                        newFormat={true}
                      />
                      <EditableInput
                        label={t("reference")}
                        nameInput={"reference"}
                        placeholderInput={infoBill?.reference || "F0001"}
                        isEditing={inputsEditing.reference}
                        value={infoBill?.reference}
                        onChange={(e) => {
                          setInfoBill((prev) => ({
                            ...prev,
                            reference: e.target.value,
                          }));
                        }}
                        onClick={() =>
                          setInputsEditing((prev) => ({
                            ...prev,
                            reference: !prev.reference,
                          }))
                        }
                        newFormat={true}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.sectionContact}>
                  <div className={styles.sectionHeader}>
                    <div className={styles.sectionheaderLeft}>
                      <h3 id="invoiceFooter">{t("invoiceFooter")}</h3>{" "}
                      <span>{t("conditionsPayMethod")} </span>{" "}
                      <Pencil
                        onClick={() => setEditingPayMethod((prev) => !prev)}
                      />
                    </div>

                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={infoBill?.conditionsChecked}
                        onChange={(e) => {
                          setInfoBill((prev) => ({
                            ...prev,
                            conditionsChecked: e.target.checked,
                          }));
                        }}
                      />
                      <span
                        className={`${styles.slider} ${styles.bgBlack}`}
                      ></span>
                    </label>
                  </div>
                  {infoBill?.conditionsChecked && (
                    <div className={styles.infoLabelIdentification}>
                      <textarea
                        disabled={!editingPaymethod}
                        placeholder={t("paymentDueWithin15Days")}
                        value={infoBill?.conditionsPaymethod}
                        onChange={(e) => {
                          setInfoBill((prev) => ({
                            ...prev,
                            conditionsPaymethod: e.target.value,
                          }));
                        }}
                      ></textarea>
                    </div>
                  )}
                </div>

                <div className={styles.sectionContact}>
                  <h3 id="advanceOptions">{t("advanceOptions")}</h3>
                  <div className={styles.infoLabelIdentification}>
                    <div className={styles.checkboxTextContainer}>
                      <input
                        type="checkbox"
                        checked={infoBill?.equivalenceSurcharge}
                        onChange={(e) => {
                          setInfoBill((prev) => ({
                            ...prev,
                            equivalenceSurcharge: e.target.checked,
                          }));
                        }}
                      />
                      <span className={styles.infoSpan}>
                        {t("equivalenceSurcharge")}
                      </span>
                    </div>

                    <div className={styles.checkboxTextContainer}>
                      <input
                        type="checkbox"
                        checked={infoBill?.amountAlreadyPaid}
                        onChange={(e) => {
                          setInfoBill((prev) => ({
                            ...prev,
                            amountAlreadyPaid: e.target.checked,
                          }));
                        }}
                      />
                      <span className={styles.infoSpan}>
                        {t("amountAlreadyPaid")}
                      </span>

                      {infoBill?.amountAlreadyPaid && (
                        <input
                          type="text"
                          onChange={(e) => {
                            setInfoBill((prev) => ({
                              ...prev,
                              amountAlreadyPaidQuantity: e.target.value,
                            }));
                          }}
                          className={styles.inputTextCheckbox}
                          placeholder="0.0 €"
                        />
                      )}
                    </div>

                    <div className={` ${styles.expensesContainer}`}>
                      <div className={styles.checkboxTextContainer}>
                        <input
                          type="checkbox"
                          checked={infoBill?.addOutPocketExpensesEnabled}
                          onChange={(e) => {
                            setInfoBill((prev) => ({
                              ...prev,
                              addOutPocketExpensesEnabled: e.target.checked,
                              addOutPocketExpenses: e.target.checked
                                ? prev.addOutPocketExpenses
                                : [], 
                            }));
                          }}
                        />
                        <span className={styles.infoSpan}>
                          {t("addOutPocketExpenses")}
                        </span>
                      </div>

                      {infoBill?.addOutPocketExpensesEnabled &&
                        infoBill?.addOutPocketExpenses?.map(
                          (expense, index) => (
                            <div key={index} className={styles.expenseItem}>
                              <input
                                type="text"
                                placeholder={t("pocketExpenses")}
                                value={expense.title}
                                onChange={(e) => {
                                  const updatedExpenses = [
                                    ...infoBill?.addOutPocketExpenses,
                                  ];
                                  updatedExpenses[index].title = e.target.value;
                                  setInfoBill((prev) => ({
                                    ...prev,
                                    addOutPocketExpenses: updatedExpenses,
                                  }));
                                }}
                              />
                              <input
                                type="number"
                                placeholder={'0,0 €'}
                                value={expense.quantity}
                                className={styles.expenseQuantity}
                                onChange={(e) => {
                                  const updatedExpenses = [
                                    ...infoBill?.addOutPocketExpenses,
                                  ];
                                  updatedExpenses[index].quantity =
                                    e.target.value;
                                  setInfoBill((prev) => ({
                                    ...prev,
                                    addOutPocketExpenses: updatedExpenses,
                                  }));
                                }}
                              />
                              <DeleteButton
                                type="black"
                                action={() => {
                                  const updatedExpenses =
                                    infoBill?.addOutPocketExpenses.filter(
                                      (_, i) => i !== index
                                    );
                                  setInfoBill((prev) => ({
                                    ...prev,
                                    addOutPocketExpenses: updatedExpenses,
                                  }));
                                }}
                                colorIcon={'white'}
                                CustonIcon={CloseXIcon}
                                customIconStyles={{
                                  padding: "5px",
                                  cursor: "pointer",
                                }}
                              />
                            </div>
                          )
                        )}

                      {infoBill?.addOutPocketExpensesEnabled && (
                        <Button
                          type="white"
                          headerStyle={{
                            width: "fit-content",
                            borderRadius: "999px",
                          }}
                          action={() => {
                            setInfoBill((prev) => ({
                              ...prev,
                              addOutPocketExpenses: [
                                ...(prev.addOutPocketExpenses || []),
                                { title: "", quantity: "" },
                              ],
                            }));
                          }}
                        >
                          {t("addOutPocketExpenses")}
                        </Button>
                      )}
                    </div>

                    <div className={styles.checkboxTextContainer}>
                      <input
                        type="checkbox"
                        checked={infoBill?.includePersonalIncomeTax}
                        onChange={(e) => {
                          setInfoBill((prev) => ({
                            ...prev,
                            includePersonalIncomeTax: e.target.checked,
                          }));
                        }}
                      />
                      <span className={styles.infoSpan}>
                        {t("includePersonalIncomeTax")}
                      </span>

                      {infoBill?.includePersonalIncomeTax && (
                        <input
                          type="text"
                          onChange={(e) => {
                            setInfoBill((prev) => ({
                              ...prev,
                              includePersonalIncomeTaxQuantity: e.target.value,
                            }));
                          }}
                          className={styles.inputTextCheckbox}
                          placeholder="0.0 €"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.sectionContact}>
                  <div className={styles.payMethodsheader} style={customStyleColumnDirection}>
                    <h3 id="paymentMethods">{t("paymentMethods")}</h3>
                    <ButtonDiferentContentScreen
                        threshold={768}
                        smallContent={<AddBlack/>}
                        largeContent={   <><AddBlack/>{t("addPayMethod")}</>}
                        buttonProps={{ type: "white", action: (e) => addPayMethod(e) ,   headerStyle: {borderRadius: "999px"}}}
                        />
                  </div>
                  {infoBill?.paymethod?.length > 0 && (
                    <div className={styles.infoLabelIdentification}>
                      <div>
                        <div className={styles.payMethodInfoBill}>
                          <div className={styles.detailsBill}>
                            <div className={styles.optionsDetailsBill}>
                              <Button
                                action={() => {
                                  setInfoBill((prev) => {
                                    const updatedPayMethods = [
                                      ...prev.paymethod,
                                    ];
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

                          {Array.isArray(infoBill.paymethod) &&
                            [...infoBill.paymethod]
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
                                          setInfoBill((prev) => {
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
                  )}
                </div>

                <div className={styles.sectionContact}>
                  <div className={styles.conceptHeader}>
                    <h3 id="concepts">{t("concepts")}</h3>

                    <div className={styles.btnsConcept}>
                      <Button
                        type="white"
                        headerStyle={{ borderRadius: "999px" }}
                        action={() => {
                          setInfoBill((prev) => ({
                            ...prev,
                            titles: [...(prev.titles || []), { name: "" }],
                          }));
                        }}
                      >
                   <AddBlack/>     {t("addTitle")}
                      </Button>

                      <Button
                        type="white"
                        headerStyle={{ borderRadius: "999px" }}
                        action={addAssetsLine}
                      >
                     <AddBlack/>   {t("addAssetLine")}
                      </Button>
                    </div>
                  </div>
                  <div className={styles.conceptContent}>
                    <SearchIconWithIcon
                      ref={searchInputRefTitle}
                      searchTerm={searchTermTitle}
                      setSearchTerm={setSearchTermTitle}
                      classNameIconRight={styles.searchContainerL}
                      onClickIconRight={() => setIsFilterOpen(true)}
                      placeholder={t("searchAutomations")}
                      stylesComponent={{ padding: "0" }}
                    >
                      <>
                        <div
                          style={{ marginLeft: "5px" }}
                          className={styles.searchIconsWrappers}
                        >
                          <img src={KIcon} alt="kIcon" />
                        </div>
                      </>
                    </SearchIconWithIcon>
                    {infoBill?.titles?.filter((title) =>
                      title.name
                        ?.toLowerCase()
                        .includes(searchTermTitle.toLowerCase())
                    )?.length > 0 && (
                      <div className={styles.infoLabelIdentification}>
                        {infoBill?.titles
                          ?.filter((title) =>
                            title.name
                              ?.toLowerCase()
                              .includes(searchTermTitle.toLowerCase())
                          )
                          .map((title, index) => {
                            const isEditable = editableIndexes.includes(index);

                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <input
                                  type="text"
                                  value={title.name}
                                  disabled={disabledTitles[index]}
                                  onChange={(e) => {
                                    const newTitles = [...infoBill.titles];
                                    newTitles[index].name = e.target.value;
                                    setInfoBill((prev) => ({
                                      ...prev,
                                      titles: newTitles,
                                    }));
                                  }}
                                  placeholder={t("sectionTitle")}
                                  className={styles.inputTitle}
                                />

                                <Pencil
                                  onClick={() => toggleTitleEdit(index)}
                                />
                                <DeleteButton
                                  onClick={() => deleteTitle(index)}
                                />
                              </div>
                            );
                          })}
                      </div>
                    )}
                    <SearchIconWithIcon
                      ref={searchInputRefAsset}
                      searchTerm={searchTermAsset}
                      setSearchTerm={setSearchTermAsset}
                      classNameIconRight={styles.searchContainerL}
                      onClickIconRight={() => setIsFilterOpen(true)}
                      placeholder={t("searchAutomations")}
                      stylesComponent={{ padding: "0" }}
                    >
                      <>
                        <div
                          style={{ marginLeft: "5px" }}
                          className={styles.searchIconsWrappers}
                        >
                          <img src={KIcon} alt="kIcon" />
                        </div>
                      </>
                    </SearchIconWithIcon>
                    {infoBill?.assetLines
                          ?.filter((line) =>
                            line.name
                              ?.toLowerCase()
                              .includes(searchTermAsset.toLowerCase())
                          )?.length > 0 && (
                      <div className={styles.infoLabelIdentification}>
                        {infoBill?.assetLines
                          ?.filter((line) =>
                            line.name
                              ?.toLowerCase()
                              .includes(searchTermAsset.toLowerCase())
                          )
                          .map((line, index) => (
                            <AssetLine
                              key={line.id}
                              article={line}
                              id={line.id}
                              articlesEditing={articlesEditing}
                              editBaseImport={editBaseImport}
                              editQuantity={editQuantity}
                              editTotal={editTotal}
                              toggleArticleEditing={toggleArticleEditing}
                              handleDeleteActivo={handleDeleteActivo}
                              setShowTaxModal={setShowTaxModal}
                              setShowDiscountModal={setShowDiscountModal}
                              handleEditBaseImport={handleEditBaseImport}
                              handleEditQuantity={handleEditQuantity}
                              handleEditTotal={handleEditTotal}
                              handleInputChange={handleInputChange}
                              handleDeleteAsset={handleDeleteAsset}
                              setNewAsset={setNewAsset}
                              taxQuantity={taxQuantity}
                              setEditingTax={setEditingTax}
                              editingTax={editingTax}
                              handleInputChangeDiscount={
                                handleInputChangeDiscount
                              }
                              discountQuantity={discountQuantity}
                              editingDiscount={editingDiscount}
                              setSelectedAssetLine={setSelectedAssetLine}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                {showLocationModal && (
                  <SelectLocation
                    onClose={() => setShowLocationModal(false)}
                    setSelectedLocationNew={(option) => {
                      setInfoBill((prev) => ({
                        ...prev,
                        location: option,
                      }));
                    }}
                    selectedLocationNew={infoBill?.location}
                    showNewFolder={false}
                    setIsLoading={setIsLoading}
                    existCreateFolder={existCreateFolder}
                  />
                )}
              </form>
            </div>
          </div>
        </ModalTemplate>

        {showCorporativeModal && (
          <CorporativeModalText
            title={corporativeTitle}
            message={corporativeMessage}
            setState={setShowCorporativeModal}
          />
        )}
        {hasNote && (
          <>
            <CreateNotePopup
              hasNote={hasNote}
              setHasNote={setHasNote}
              noteColor={noteColor}
              setNoteColor={setNoteColor}
              setCreatedNote={setCreatedNote}
              editorContentFinal={editorContentFinal}
              setEditorContentFinal={setEditorContentFinal}
              setEditingNote={setEditingNote}
              editingNote={editingNote}
              isAnimating={isAnimating}
              setIsAnimating={setIsAnimating}
            />
          </>
        )}
        {showDiscountModal && (
          <AddDiscount
            setShowDiscountModal={setShowDiscountModal}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            setEditingDiscount={setEditingDiscount}
            setDiscountQuantity={(value) => {
              handleInputChange(selectedAssetLine, "DiscountQuantity", value);
            }}
          />

  
        )}
        {showTaxModal && (
          <AddTax
            setShowTaxModal={setShowTaxModal}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            setTaxQuantity={(value) => {
              handleInputChange(selectedAssetLine, "taxQuantity", value);
            }}
            setEditingTax={setEditingTax}
          />
        )}

        {showDiscountModalNavigation && (
          <AddDiscount
            showDiscountModal={showDiscountModal}
            setShowDiscountModal={setShowDiscountModalNavigation}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            setDiscountQuantity={(value) => {
              setInfoBill((prev) => ({
                ...prev,
                discount: value.quantity,
                discountPercentage: value.quantity,
              }));
            }}
            handlePercentageChange={handlePercentageChange}
          />
        )}
        {showTaxModalNavigation && (
          <AddTax
            setShowTaxModal={setShowTaxModalNavigation}
            showTaxModal={showTaxModal}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            setTaxQuantity={(value) => {
              setInfoBill((prev) => ({
                ...prev,
                tax: value,
                taxPercentage: value,
              }));
            }}
            handlePercentageChange={handlePercentageChange}
          />
        )}
    {showAddTags && (
          <NewTag
            setShowNewTagModal={setShowAddTags}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
            setTags={setTags}
            tags={tags}
          />
        )}

      </div>
    </div>
  );
};

export default NewBIll;
