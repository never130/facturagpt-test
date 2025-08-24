import React, { useEffect, useRef, useState } from "react";
// import apiBackend from "@src/apiBackend.js";

import styles from "./NewAsset.module.css";
// import PayMethod from "../PayMethod/PayMethod";
import ModalTemplate from "../ModalTemplate/ModalTemplate";
import EditableInput from "../../screens/Contacts/EditableInput/EditableInput";
// import ProfileModalTemplate from "../ProfileModalTemplate/ProfileModalTemplate";
import { ParametersLabel } from "../ParametersLabel/ParametersLabel";
import Button from "../Button/Button";
// import CustomDropdown from "../CustomDropdown/CustomDropdown";
// import SelectTag from "./SelectTag/SelectTag";
import NewTag from "../NewTag/NewTag";
// import AddTemplate from "./AddTemplate/AddTemplate";
// import { ReactComponent as GreenMailIcon } from "../../assets/greenMailIcon.svg";
// import { ReactComponent as GreenWebIcon } from "../../assets/greenWebIcon.svg";
// import { ReactComponent as GreenPhoneIcon } from "../../assets/greenPhoneIcon.svg";
// import { ReactComponent as GrayTagIcon } from "../../assets/grayTagIcon.svg";
// import { ReactComponent as GreenCopyIcon } from "../../assets/greenCopyIcon.svg";
// import { ReactComponent as FileIcon } from "../../assets/fileIcon.svg";
import { ReactComponent as Pencil } from "../../assets/pencilEdit.svg";
import { ReactComponent as Lupa } from "../../assets/searchGray.svg"
import ImageEmpty from "../../assets/ImageEmpty.svg";
// import { ReactComponent as BlackCheckboxIcon } from "../../assets/blackCheckboxIcon.svg";
import { getOneContact } from "../../../../actions/contacts";
import { useDispatch, useSelector } from "react-redux";
import ContactsPopup from "../ContactsPopup/ContactsPopup";
import AddTax from "../AddTax/AddTax";
import AddDiscount from "../AddDiscount/AddDiscount";
import DynamicTable from "../../components/DynamicTable/DynamicTable";
// import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createAsset,
  deleteAssets,
  // getAllAssets,
  updateAsset,
  getAsset,
} from "../../../../actions/assets";
import useCloseOnEsc from "../../../../utils/useClose";
import { getAllDocsByContact } from "../../../../actions/docs";
import { useTranslation } from "react-i18next";
import { setAsset, setFatherNewAsset } from "../../../../slices/assetsSlices";

import VariableModal from "../VariableModal/VariableModal";

import { useNavigate, useParams } from "react-router-dom";
import AddLocation from "../AddLocation/AddLocation";
import SkeletonScreen from "../SkeletonScreen/SkeletonScreen";
import NavigationPopups from "../NavigationPopups/NavigationPopups";
import DeleteButton from "../DeleteButton/DeleteButton";
import CreateParameterPopup from "../CreateParameterPopup/CreateParameterPopup";
import { createTable, createTableData, createVariable, getTableDataById, getTableDataFiltered, getTables, getVariable, refreshTableInfo, updateTableData, createVariableTableData } from "../../../../actions/user";
import DeleteChatAgents from "../DeleteChatAgents/DeleteChatAgents";

// const ButtonLabelCommponentWithButton = ({
//   textHeader,
//   buttonText,
//   inputValue,
//   setInputValue,
//   typeInput = "text",
//   stylesButton,
//   fieldName,
// }) => {
//   const { t } = useTranslation("Assets");
//   const [addedLabel, setAddedLabel] = useState(false);
//   const [editing, setEditing] = useState(false);
//   return (
//     <LabelCommponent
//       textHeader={textHeader}
//       buttonText={buttonText}
//       editing={editing}
//       setEditing={setEditing}
//     >
//       {addedLabel ? (
//         <div className={styles.edit}>
//           <div className={styles.inputContainer}>
//             {typeInput == "number" ? (
//               <input
//                 type="number"
//                 disabled={!editing}
//                 value={inputValue}
//                 onChange={(e) => {
//                   const newValue = Number(e.target.value);
//                   if (newValue >= 0 && newValue <= 100) {
//                     setInputValue(fieldName, newValue);
//                   }
//                 }}
//                 min={0}
//                 max={100}
//               />
//             ) : (
//               <input
//                 type="text"
//                 disabled={!editing}
//                 value={inputValue}
//                 onChange={(e) => {
//                   setInputValue(fieldName, e.target.value);
//                 }}
//               />
//             )}
//           </div>
//           <div
//             className={styles.button}
//             onClick={() => setEditing((prev) => !prev)}
//           >
//             {editing ? t("save") : t("edit")}
//           </div>
//         </div>
//       ) : (
//         <Button
//           type="white"
//           headerStyle={{
//             textAlign: "start",
//             fontsize: "13px",
//             padding: "6px",
//             ...stylesButton,
//           }}
//           action={() => setAddedLabel(true)}
//         >
//           {buttonText}
//         </Button>
//       )}
//     </LabelCommponent>
//   );
// };

const LabelCommponent = ({ textHeader, children }) => {
  return (
    <div className={styles.ButtonLabelCommponent}>
      <div>
        {" "}
        <p>{textHeader}</p>{" "}
      </div>

      {children}
    </div>
  );
};

const CheckedInput = ({
  text,
  title,
  type,
  inputPlaceholder,
  setShowNewContact,
  showNewContact,
  setValueState,
  fieldName,
  value,
  valueChecked,
  valueCheckedName,
}) => {
  const { t } = useTranslation("Assets");
  const [isChecked, setIsChecked] = useState(valueChecked);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const contactsRef = useRef(null);



  useEffect(() => {
    setIsChecked(valueChecked);
  }, [valueChecked]);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setValueState(fieldName, contact?.contactName);
    setIsFocused(false);
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
  return (
    <div className={styles.CheckedInput}>
      {title && <p>{title}</p>}
      <div>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            setValueState(valueCheckedName, !valueChecked);
            setIsChecked((prev) => !prev);
          }}
        />
        <span>{text}</span>
      </div>

      {isChecked && (
        <input
          type="text"
          placeholder={inputPlaceholder || t("enterAValue")}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          value={value}
          onChange={(e) => setValueState(fieldName, e.target.value)}
        />
      )}
      {type === "supplier" && isFocused && value && (
        <ContactsPopup
          ref={contactsRef}
          handleContactClick={handleContactClick}
          setShowNewContact={setShowNewContact}
          type="contact"
          inputValue={value}
        />
      )}
    </div>
  );
};

const NewProduct = ({
  setShowNewAsset,
  showNewProduct,
  setShowNewClient,
  creatingBill,
  setShowNewContact,
  showNewContact,
  fn,
  setNewAsset,
  typeContainer,
  customStyleOverlay,
  customStyleNewContactContainer,
  customStylePopupNewContaier,
  customStyleFormNewProduct,
  customStyleContactinfo,
  customStyleColumnRightContactInfo,
  customStyleModalTemplateHeader,
  customStyleLeftSide,
  customStyleContentContainer,
  customStyleButtonContainer,
  customStyleButtonHeader,
  customStyleColumnDirection,
  customStyleModalTemplate,
  customStyleNavigationPopupsContainer,
  customStyleSectionContact,
  isGlobalTables,

  createData, tableId, headers,
  setShowPopupNewAsset,
  setShowCreateParameterFromPopup,
  tableType,
  showPopupNewAsset,
  setShowDeleteTableModalParameterPopup,
  setCurrentParameter,
  reloadVariable,
  setReloadVariable

}) => {
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [showCreateParameter, setShowCreateParameter] = useState(false)
  const { t } = useTranslation("Assets");
  const { assetId } = useParams();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnimatingModal, setIsAnimatingModal] = useState(false);
  const { asset, fatherNewAsset, idFatherNewAsset } = useSelector((state) => state.assets);
  const { category, user, tableDataMap, tables } = useSelector(state => state.user)
  const [billingDetails, setBillingDetails] = useState([]);
  const [assetState, setAssetState] = useState();
  const [typeLocation, setTypeLocation] = useState(null)
  const [locationParameter, setLocationParameter] = useState(null)
  const [showAddTags, setShowAddTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
const {  contactTableId } = useSelector((state) => state.contacts);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("")
  const [inputValueAssetPopup, setInputValueAssetPopup] = useState("")
  const [inputValueAssetPopup2, setInputValueAssetPopup2] = useState("")
  const [focused, setFocused] = useState(false)
  const [focused2, setFocused2] = useState(false)

   const contactsRef = useRef(null);
   const contactsRef2 = useRef(null);
    const [deleteCategory, setDeleteCategory] = useState(false)
    const {tableView} = useSelector(state => state.user)
      const assetRef = useRef(null)
  const financialRef = useRef(null)
  const complementaryRef = useRef(null)
  const parameterAssetRef = useRef(null)
  const [showDeleteTableModalParameter, setShowDeleteTableModalParameter] = useState(null)
  const [parametersGlobals, setParametersGlobals] = useState([])


  const handleAssetInsumoClick = (asset) => {
    setUserData((prev) => ({
      ...prev,
      insumo: [
        ...(Array.isArray(prev.insumo) ? prev.insumo : []),
        {
          id: asset._id,
          img: asset.image,
          name: asset.name,
          description: asset.description,
          unitPrice: asset.baseImport || 0,
          sku: 0,
          tax: asset.taxQuantity || 0,
        },
      ],
    }));

  }
  const handleAssetSubstituteClick = (asset) => {
    setUserData((prev) => ({
      ...prev,
      substitute: [
        ...(Array.isArray(prev.substitute) ? prev.substitute : []),
        {
          id: asset._id,
          img: asset.image,
          name: asset.name,
          description: asset.description,
          unitPrice: asset.baseImport || 0,
          sku: 0,
          tax: asset.taxQuantity || 0,
        },
      ],
    }));

  }


  const handleBlur = (event) => {
    setTimeout(() => {
      if (
        contactsRef.current &&
        !contactsRef.current.contains(event.relatedTarget)
      ) {
        setFocused(false);
      }
    }, 100);
  };
  const handleBlur2 = (event) => {
    setTimeout(() => {
      if (
        contactsRef2.current &&
        !contactsRef2.current.contains(event.relatedTarget)
      ) {
        setFocused2(false);
      }
    }, 100);
  };

  useEffect(() => {
    if(reloadVariable){
      setUserData((prev) => ({
        ...prev,
        ...tableDataMap[tableId]?.find(tab => tab._id === userData._id)
      }))
      setReloadVariable(false)
    }
  },[reloadVariable])

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const [userData, setUserData] = useState({
    category: t("selectAnOption"),
    parameters: [],
    tags: [],
    selectedtags: [],
    suppliesData: [],
    alternateData: [],
    insumo: [],
    substitute: [],
  });

  const [image, setImage] = useState({});

  const tableHeaders = [
    { label: t("nameOrDescription"), key: "name" },
    { label: t("unitPrice"), key: "unitPrice" },
    { label: 'SKU', key: "sku" },
    { label: t("tax"), key: "tax" },
    { label: t(""), key: "" },
  ];
  const tableHeadersDoc = [
    { label: t("IdTransaction"), key: "IdTransaction" },
    { label: t("total"), key: "total" },
    { label: t('date'), key: "date" },
  ];

  useEffect(() => {
    if (!asset && assetId) {
      
      const fn = async () => {
        let response
         response = await dispatch(getAsset({ id: assetId }));
       
        let row
      if(!response.payload){
        const res = await dispatch(getTables())
          const tables = res?.payload?.tables

           if (tables.length > 0) {
      for (let table of tables) {
        row =  await dispatch(getTableDataById({tableId:table._id, rowId:assetId}))
         if (row.payload?.data?.length > 0) {
          response = {payload:{data:{...row.payload?.data[0]}}}
           break;
           }
         }
        }
      }


       const responseDoc = await dispatch(
          getAllDocsByContact({
            contactId: response?.payload?.data?.contactId,
            search: "",
            limit: 10,
            skip: 0,
          })
        );

        setUserData(response.payload.data);
        setUserData((prev) => ({
          ...prev,
          docs: responseDoc?.payload?.docs
        }))
        response.payload.data &&
          response.payload.data.selectedTags &&
          setSelectedTags([...response.payload.data.selectedTags]);
      };
      setAssetState(true);
      fn();
    } else if (asset) {
      console.log('esto es asset', asset)

      setAssetState(true)
    };
  }, []);

  useEffect(() => {
    if (asset && Object.keys(asset).length > 0) {
      const fn = async () => {
        setUserData(asset);

        const responseDoc = await dispatch(
          getAllDocsByContact({
            contactId: asset?.contactId,
            search: "",
            limit: 10,
            skip: 0,
          })
        );
        setUserData((prev) => ({
          ...prev,
          docs: responseDoc?.payload?.docs
        }))
      }
      fn()
    }

    asset && asset.tags && setTags([...asset.tags]);
    asset && asset.selectedtags && setSelectedTags([...asset.selectedtags]);
  }, [asset]);


  const [editingIndices, setEditingIndices] = useState([]);

  const [inputsEditing, setInputsEditing] = useState({
    name: false,
    description: false,
    unitPrice: false,
    sku: false,
    baseImport: false,
    retailPrice: false,
    parameters: false,
    image: false,
  });

  useEffect(() => {
    const handleEditAll = (value) => {
      setInputsEditing((prevState) => {
        const updatedState = {};
        Object.keys(prevState).forEach((key) => {
          if (Array.isArray(prevState[key])) {
            updatedState[key] = prevState[key];
          } else {
            updatedState[key] = value;
          }
        });

        return updatedState;
      });
    };

    handleEditAll(creatingBill);
  }, [creatingBill]);

  const goTo =
  fatherNewAsset === "home"
    ? `/admin/home`
    : fatherNewAsset === "assets"
    ? `/admin/assets`
    : fatherNewAsset === "panel"
    ? null
    : fatherNewAsset === "panelWithAsset"
    ? `/admin/panel/${idFatherNewAsset}`
    : fatherNewAsset === "chat"
    ? `/admin/chat`
    : fatherNewAsset === "tables"
    ? `/admin/tables`
    : fatherNewAsset === "chatId"
    ? `/admin/chat/${idFatherNewAsset.agentId}/${idFatherNewAsset.chatId}`
    : fatherNewAsset === "agentId"
    ? `/admin/chat/${idFatherNewAsset}`
    : fatherNewAsset !== null
    ? `/admin/${fatherNewAsset}`
    : `/admin/tables`;

  const handleCloseNewClient = () => {

    if(setNewAsset|| setShowNewClient || setShowNewAsset){
      setIsAnimating(true);
      setTimeout(() => {
        setNewAsset && setNewAsset(false);
        setShowNewClient && setShowNewClient(false);
        setShowNewAsset && setShowNewAsset(false)
        dispatch(setFatherNewAsset(""));
    dispatch(setAsset(""));
        setIsAnimating(false);
      }, 250);
    }

  else if (goTo) {
    setIsAnimating(true);
    setTimeout(() => {
      navigate(goTo);
    }, 100);
     setTimeout(() => {
      dispatch(setFatherNewAsset(""));
      dispatch(setAsset(""));
      setIsAnimating(false);
    }, 300);
  } 

    // setIsAnimating(true);
    // setNewAsset && setNewAsset(false);
    // setTimeout(() => {
    //   setShowNewClient && setShowNewClient(false);
    //   fatherNewAsset === "home"
    //     ? navigate(`/admin/home`)
    //     : fatherNewAsset === "assets"
    //       ? navigate(`/admin/assets`)
    //       : fatherNewAsset === "panel"
    //         ? setNewAsset && setNewAsset(false)
    //         : fatherNewAsset === "panelWithAsset"
    //           ? navigate(`/admin/panel/${idFatherNewAsset}`)
    //           : fatherNewAsset === "chat"
    //             ? navigate(`/admin/chat`)
    //             : fatherNewAsset === "tables"
    //             ? navigate(`/admin/tables`)
    //             : fatherNewAsset === "chatId"
    //               ? navigate(`/admin/chat/${idFatherNewAsset.agentId}/${idFatherNewAsset.chatId}`)
    //               : fatherNewAsset === "agentId"
    //                 ? navigate(`/admin/chat/${idFatherNewAsset}`)
    //                 : setShowNewAsset ? setShowNewAsset(false)
    //                   : navigate(`/admin/tables`)
    //   dispatch(setFatherNewAsset(""));
    //   setIsAnimating(false);
    // }, 300);
  };

  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.key === "Escape") {
  //       setIsAnimating(true);
  //       setNewAsset && setNewAsset(false);
  //       setTimeout(() => {
  //         setShowNewClient && setShowNewClient(false);
  //         setIsAnimating(false);
  //         fatherNewAsset === "home"
  //           ? navigate(`/admin/home`)
  //           : fatherNewAsset === "assets"
  //             ? navigate(`/admin/assets`)
  //             : fatherNewAsset === "panel"
  //               ? setNewAsset && setNewAsset(false)
  //               : fatherNewAsset === "panelWithAsset"
  //                 ? navigate(`/admin/panel/${idFatherNewAsset}`)
  //                 : fatherNewAsset === "chat"
  //                   ? navigate(`/admin/chat`)
  //                   : fatherNewAsset === "tables"
  //               ? navigate(`/admin/tables`)
  //                   : fatherNewAsset === "chatId"
  //                     ? navigate(`/admin/chat/${idFatherNewAsset.agentId}/${idFatherNewAsset.chatId}`)
  //                     : fatherNewAsset === "agentId"
  //                       ? navigate(`/admin/chat/${idFatherNewAsset}`)
  //                       : setShowNewAsset ? setShowNewAsset(false)
  //                         : navigate(`/admin/tables`)
  //         dispatch(setFatherNewAsset(""));
  //       }, 250);
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  // console.log('esto es fatherNewAsset' , fatherNewAsset)
  //  console.log('esto es goTo', goTo)


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (goTo) {
          setIsAnimating(true);
          setTimeout(() => {
            navigate(goTo);
          }, 100);
          setTimeout(() => {
            setIsAnimating(false);
            dispatch(setFatherNewAsset(""));
            dispatch(setAsset(""));
          }, 300);
        } else{
          setIsAnimating(true);
          setTimeout(() => {
            setNewAsset && setNewAsset(false);
            setShowNewClient && setShowNewClient(false);
            // setShowNewAsset && setShowNewAsset(false)
            dispatch(setFatherNewAsset(""));
            dispatch(setAsset(""));
            setIsAnimating(false);
          }, 250);
        }
  
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  

  const dispatch = useDispatch();
  const handleGetOneClient = async (clientId) => {

    try {
      const response = await dispatch(
        getOneContact({ userId: user?.id, clientId })
      ).unwrap();
      navigate(`/admin/clients/${clientId}`);
    } catch (error) {
      console.error("Error al obtener el cliente:", error);
    }
  };
  const [taxState, setTaxState] = useState(false);
  const [discountState, setDiscountState] = useState(false);
  const [locationState, setLocationState] = useState(false);
  const [type, setType] = useState(t("selectAnOption"));
  const [location, setLocation] = useState(null);

  const [editingTax, setEditingTax] = useState(false);
  const [retention, setRetention] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);

  const handleTaxQuantityChange = (newTaxQuantity) => {
    setUserData((prev) => ({ ...prev, taxQuantity: newTaxQuantity }));
  };
  const handleDiscountQuantityChange = (newDiscountQuantity) => {
    setUserData((prev) => ({ ...prev, DiscountQuantity: newDiscountQuantity }));
  };
  const handleCheckedInputs = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssetData = (key, value) => {
    setImage({ [key]: value });
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  const headerTable = [
    {
      label: "Código",
      key: "code",
      type:"number"
    },
    {
      label: "Nombre o Descripción",
      key: "name",
      type:"textBox"
    },
    {
      label: "Proveedor",
      key: "supplier_name",
      type:"textBox"
    },
    {
      label: "Categoría",
      key: "category",
      type:"textBox"
    },
    {
      label: ["Cantidad", "(Último mes)"],
      key: "quantity",
      type:"number"
    },
    {
      label: "Generado",
      key: "generated",
      type:"number"
    },
    {
      label: "Precio máximo",
      key: "maxPrice",
      type:"number"
    },
    {
      label: "Precio mínimo",
      key: "minPrice",
      type:"number"
    },
    {
      label: "Precio medio",
      key: "averagePrice",
      type:"number"
    },
    {
      label: "Desde",
      key: "createdAt",
      type:"date"
    },
  ]

  const handleCreateAsset = async () => {

    if (isGlobalTables) {
      console.log('entra en el if de isGlobalTables')
      createData(tableId, headers, userData, 'assets');
      setShowNewContact(false);
    } else {
      console.log('entra en el else de isGlobalTables')
      let action;
      if (asset && Object.keys(asset).length > 0) {
        action = updateAsset({
          id: userData?._id,
          assetData: userData,
        });
      } else {

        const fn = async () => {
          let filteredTable
          const res = await dispatch(getTables())
          let tables = res?.payload?.tables
  
          let oldestContactTable = null;

          if(tables.length === 0){
            await dispatch(createTable({ headers: headerTable, name: "", type: "assets" })); 
            const res = await dispatch(getTables())
             tables = res?.payload?.tables
          }

for (let table of tables) {
  if (table.type === "assets") {
    if (
      !oldestContactTable ||
      new Date(table.createdAt) < new Date(oldestContactTable.createdAt)
    ) {
      oldestContactTable = table;
      filteredTable = table
    }
  }
}

// console.log('esto es filteredTable',filteredTable)

            if(!filteredTable){
              await dispatch(createTable({ headers: headerTable, name: "", type: "assets" })); 
            const res = await dispatch(getTables())
             tables = res?.payload?.tables

             for (let table of tables) {
              if (table.type === "assets") {
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
            // console.log('esto es tables',tables)
            // console.log('esto es filteredTable',filteredTable)

            console.log('entra en el await de createTableData')
            console.log('filteredTable', filteredTable)
await dispatch(
  createTableData({ tableId: filteredTable._id, headers: filteredTable.headers, data: userData, type:'assets' })
); await dispatch(refreshTableInfo({ tableId: filteredTable._id }))

await dispatch(getTableDataFiltered({tableId:filteredTable._id,
}));
        }
        fn()



        // action = createAsset({
        //   assetData: userData,
        // });
      }

      // try {
      //   await dispatch(action).unwrap();
      //   fn();
      // } catch (error) {
      //   console.error("Error en la operación del asset:", error);
      // }

    }
    handleCloseNewClient();
  };
  const handleDelete = async () => {
    try {
      await dispatch(deleteAssets({ clientSelected: userData._id })).unwrap();
      fn();
      handleCloseNewClient();
    } catch (error) {
      console.error("Error eliminando assets:", error);
    }
  };
  const [mockDocs, setMockDocs] = useState([

  ]);

  useCloseOnEsc(handleCloseNewClient);
  const searchDocsByAsset = async () => {
    const response = await dispatch(
      getAllDocsByContact({
        contactId: asset?.contactId,
        search: "",
        limit: 10,
        skip: 0,
      })
    );

    if (response.payload) {
      setMockDocs(response.payload.docs);
    }
  };
  useEffect(() => {
    searchDocsByAsset();
  }, [asset]);

  const [selectedInsumo, setSelectedInsumo] = useState('')
  const [selectedSubtitute, setSelectedSubtitute] = useState('')


  const handleDeleteInsumo = (id) => {
    setUserData((prev) => ({
      ...prev,
      insumo: prev.insumo.filter((insumo) => insumo.id !== id),
    }));
  };

  const handleChangeInsumo = (id, field, value) => {
    setUserData((prev) => ({
      ...prev,
      insumo: prev.insumo.map((insumo) =>
        insumo.id === id ? { ...insumo, [field]: value } : insumo
      ),
    }));
  };
  const handleDeleteSubstitute = (id) => {
    setUserData((prev) => ({
      ...prev,
      substitute: prev.substitute.filter((substitute) => substitute.id !== id),
    }));
  };

  const handleChangeSubstitute = (id, field, value) => {
    setUserData((prev) => ({
      ...prev,
      substitute: prev.substitute.map((substitute) =>
        substitute.id === id ? { ...substitute, [field]: value } : substitute
      ),
    }));
  };

  const renderRowInsumo = (row, index) => {
    const isEditing = selectedInsumo === row.id;



    return (
      <tr key={row.id} className={styles.insumoRow}>
        <td style={{ minWidth: "70px", width: "70px", maxWidth: "70px" }}>
          <div className={styles.infoInsumo}>
            <img src={row.img || ImageEmpty} alt="" />
            <div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => handleChangeInsumo(row.id, "name", e.target.value)}
                    placeholder={t("article")}
                  />
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleChangeInsumo(row.id, "description", e.target.value)}
                    placeholder={t("description")}
                  />
                </>
              ) : (
                <>
                  <p>{row.name || t("article")}</p>
                  <span>{row.description || t("description")}</span>
                </>
              )}
            </div>
          </div>
        </td>

        <td>
          {isEditing ? (
            <input
              type="number"
              value={row.unitPrice}
              onChange={(e) => handleChangeInsumo(row.id, "unitPrice", e.target.value)}
            />
          ) : (
            row.unitPrice
          )}
        </td>

        <td>
          {isEditing ? (
            <input
              type="text"
              value={row.sku}
              onChange={(e) => handleChangeInsumo(row.id, "sku", e.target.value)}
            />
          ) : (
            row.sku
          )}
        </td>

        <td>
          {isEditing ? (
            <input
              type="number"
              value={row.tax}
              onChange={(e) => handleChangeInsumo(row.id, "tax", e.target.value)}
            />
          ) : (
            `${row.tax}%`
          )}
        </td>

        <td style={{ width: "30px", minWidth: "30px", maxWidth: "30px" }}>
          <div className={styles.btnInsumoinfo}>
            <div className={styles.editBtn}>
              <Button
                type="button"
                action={() =>
                  setSelectedInsumo((prev) => (prev === row.id ? "" : row.id))
                }
              >
                <Pencil />
              </Button>
            </div>
            <DeleteButton action={() => handleDeleteInsumo(row.id)} />
          </div>
        </td>
      </tr>
    );
  };
  const renderRowSubstitute = (row, index) => {
    const isEditing = selectedSubtitute === row.id;

    return (
      <tr key={row.id} className={styles.insumoRow}>
        <td style={{ minWidth: "70px", width: "70px", maxWidth: "70px" }}>
          <div className={styles.infoInsumo}>
            <img src={row.img || ImageEmpty} alt="" />
            <div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => handleChangeSubstitute(row.id, "name", e.target.value)}
                    placeholder={t("article")}
                  />
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => handleChange(row.id, "description", e.target.value)}
                    placeholder={t("description")}
                  />
                </>
              ) : (
                <>
                  <p>{row.name || t("article")}</p>
                  <span>{row.description || t("description")}</span>
                </>
              )}
            </div>
          </div>
        </td>

        <td>
          {isEditing ? (
            <input
              type="number"
              value={row.unitPrice}
              onChange={(e) => handleChangeSubstitute(row.id, "unitPrice", e.target.value)}
            />
          ) : (
            row.unitPrice
          )}
        </td>

        <td>
          {isEditing ? (
            <input
              type="text"
              value={row.sku}
              onChange={(e) => handleChangeSubstitute(row.id, "sku", e.target.value)}
            />
          ) : (
            row.sku
          )}
        </td>

        <td>
          {isEditing ? (
            <input
              type="number"
              value={row.tax}
              onChange={(e) => handleChangeSubstitute(row.id, "tax", e.target.value)}
            />
          ) : (
            `${row.tax}%`
          )}
        </td>

        <td style={{ width: "30px", minWidth: "30px", maxWidth: "30px" }}>
          <div className={styles.btnInsumoinfo}>
            <div className={styles.editBtn}>
              <Button
                type="button"
                action={() =>
                  setSelectedSubtitute((prev) => (prev === row.id ? "" : row.id))
                }
              >
                <Pencil />
              </Button>
            </div>
            <DeleteButton action={() => handleDeleteSubstitute(row.id)} />
          </div>
        </td>
      </tr>
    );
  };
  const renderRowDoc = (row, index) => {
    const isEditing = selectedSubtitute === row.id;

    return (
      <tr key={row.id} className={styles.insumoRow}>
        <td style={{ minWidth: "70px", width: "70px", maxWidth: "70px" }}>
          <div className={styles.infoInsumo}>
            <img src={row.img || ImageEmpty} alt="" />
            <div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={row._id}
                    placeholder={t("article")}
                  />
                </>
              ) : (
                <>
                  <p>{row._id || t("article")}</p>
                </>
              )}
            </div>
          </div>
        </td>

        <td>
          {row.total}
        </td>
        <td>
          {row.date}
        </td>



      </tr>
    );
  };

  useEffect(() => {
    // console.log('esto es userData dentro del effect de actualizar userData.type', userData)
    setType(userData?.type);
  }, [userData?.type]);


  useEffect(() => {
    // console.log('esto es userData dentro del effect de actualizar tags', userData)
    setUserData((prev) => ({
      ...prev,
      selectedtags: selectedTags,
      tags: tags,
    }));
  }, [selectedTags, tags]);

  useEffect(() => {
    // console.log('esto es userData dentro del effect de actualizar userData.selectedtags,', userData)
    if(tableId || contactTableId){
      if(userData._id){
        // console.log('esto es userData dentro del effect de actualizar dentro del if')
        const fn = async () => {
        await dispatch(updateTableData({tableId: tableId || contactTableId, data: userData}))
        await dispatch(getTableDataFiltered({tableId: tableId || contactTableId}))
        await dispatch(refreshTableInfo({ tableId: tableId || contactTableId }));
        }
        fn()
      }
    }
  }, [userData.selectedtags, userData.tags])

  const dynamicTableRef = useRef(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  useEffect(() => {
    if (!selectedRowIndex) return;

    const onWheel = (e) => {
      setSelectedRowIndex(null);

      if (dynamicTableRef.current) {
        dynamicTableRef.current.scrollBy({
          top: e.deltaY,
          behavior: "auto",
        });
      }
    };

    document.addEventListener("wheel", onWheel, {
      passive: true,
      capture: true,
    });
    return () =>
      document.removeEventListener("wheel", onWheel, {
        capture: true,
      });
  }, [selectedRowIndex]);

  const [copyClipboard, setCopyclipboard] = useState(false)
  const [editingFileTitle, setEditingFileTitle] = useState(false)
  const inputTitleFile = useRef(null)


  useEffect(() => {
    if (editingFileTitle && inputTitleFile.current) {
      inputTitleFile.current.focus();
    }
  }, [editingFileTitle]);


  const handleBtnsActions = (type) => {
    if (!userData) return;

    const { companyPhoneNumber, webSite, companyEmail } = userData;
    switch (type) {
      case 'clipboard':
        navigator.clipboard.writeText(window.location.href)
          .then(() => console.log('URL copiada al portapapeles'))
          .catch((err) => console.error('Error al copiar al portapapeles:', err));
        setCopyclipboard(true)
        setTimeout(() => {
          setCopyclipboard(false)
        }, 5000);
        break;

      case 'callPhoneNumber':
        if (companyPhoneNumber?.length > 0) {
          const { code, number } = companyPhoneNumber[0];
          window.location.href = `tel:${code}${number}`;
        }
        break;

      case 'website':
        if (webSite) {
          const formattedWebsite = webSite.startsWith('http://') || webSite.startsWith('https://')
            ? webSite
            : `https://${webSite}`;
          window.open(formattedWebsite, '_blank');
        }
        break;

      case 'email':
        if (companyEmail) {
          window.location.href = `mailto:${companyEmail}`;
        }
        break;

      case "inputFileTitle":
        setEditingFileTitle((prev) => !prev)
        break;
      default:
        console.warn('Tipo de acción no reconocido:', type);
    }
  };


  const [localCategory, setLocalCategory] = useState(false)

  const fnCategoryFind = async () => {
    const { payload } = await dispatch(getVariable({ type: 'category' }))
    if (payload?.data[0]?.assets?.length > 0) { }
    else {
      dispatch(
        createVariable({
          variableData: {
            title: "category",
            type: "category",
            assets: [
              "other",
              "service",
              "product",
            ],
          },
        })
      );
    }
  }
  useEffect(() => {
    if (!localCategory) {
      fnCategoryFind()
      setLocalCategory(true)
    }
  }, [])


  const handleCategory = () => {
    const fn = async () => {
      let { payload } = await dispatch(getVariable({ type: 'category' }))
      if (payload?.data[0]?.assets?.length > 0) {
        if (payload?.data[0]?.assets?.find(cat => cat == inputValue)) {
          let newCategory = payload?.data[0]?.assets?.filter(cat => cat != inputValue)
          await dispatch(createVariable({ variableData: { title: "category", type: "category", assets: newCategory } }))
        } else {
          await dispatch(createVariable({ variableData: { title: "category", type: "category", assets: [...category.assets, inputValue] } }))
        }
        await dispatch(getVariable({ type: 'category' }))
      }
    }


    fn()
    setInputValue(null)
    setShowInput(false);
  }


  const handleDeleteCategory = (category) => {
    const fn = async () => {
      let { payload } = await dispatch(getVariable({ type: 'category' }))
      if (payload?.data[0]?.assets?.length > 0) {
        let newCategory = payload?.data[0]?.assets?.filter(cat => cat != category)
        await dispatch(createVariable({ variableData: { title: "category", type: "category", assets: newCategory } }))
      }
      await dispatch(getVariable({ type: 'category' }))
    }
    fn()
  }



  const saveParameter = async (parameter) => {

  if(parameter.hasOwnProperty("code")){
    if(tableView?.variables?.length > 0 )  await dispatch(createVariable(
      {variableData:{category: "tableView", title:"tableView", 
        type:"tableView",
        variables:[parameter,...tableView.variables ]}}))
        else await dispatch(createVariable({variableData:{category: "tableView", title:"tableView", type:"tableView", variables:[parameter ]}}))
      }else{
        const newParameter = {
          ...parameter,
          category: tableView?.variables?.length > 0 ? tableView?.variables?.[0]?.code : "",
        }
if(tableView?.variables?.length > 0 )  await dispatch(createVariable(
  {variableData:{category: "tableView", title:"tableView", 
    type:"tableView",
    variables:[tableView.variables[0], newParameter, ...tableView.variables.slice(1)]}}))
        else await dispatch(createVariable
          ({variableData:{category: "tableView", title:"tableView", 
            type:"tableView", variables:[newParameter ]}}))
      }

      await dispatch(createVariableTableData({tableId: userData.tableId,
         mainId: tableDataMap[userData.tableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]._id,
          parameter: parameter}))
          await dispatch(getVariable({type:'tableView'}))
          await dispatch(getTableDataFiltered({tableId: userData.tableId}))
    
  }

  const deleteParameterDB = async (parameter) => {

    if(tableView?.variables?.length > 0 && tableView?.variables?.find(param => param.id == parameter.id)){
    let newTable = tableView.variables.filter(param => param.id !== parameter.id)

    await dispatch(createVariable({
              variableData: {
                category: "tableView", title: "tableView", type: "tableView", variables: newTable,
              }
            }))
            await dispatch(getVariable({ type: 'tableView' }))
          }
  

  }


  return (
    <div className={typeContainer !== "popup" && styles.overlay} style={customStyleOverlay}>
      <div className={typeContainer !== "popup" && styles.bg} onClick={() => { typeContainer !== "popup" && handleCloseNewClient() }}></div>
      <div className={typeContainer !== "popup" ? styles.newProductContainer : styles.newProductContainerPopup} style={customStyleNewContactContainer}>
        <ModalTemplate
          text={t("asset")}
          typeTextHeader={
            asset && Object.keys(asset).length > 0 ? t("edit") : t("new")
          }
          reverseMobile={true}
          onClick={() => handleCloseNewClient()}
          isAnimating={isAnimating}
          newContact={!assetState}
          handleGetOneClient={handleGetOneClient}
          actionSave={handleCreateAsset}
          handleDelete={handleDelete}
          assets={true}
          type={typeContainer}
          father={"asset"}
          customStyleModalTemplateHeader={customStyleModalTemplateHeader}
          customStyleContentContainer={customStyleContentContainer}
          customStyleButtonContainer={customStyleButtonContainer}
          customStyleButtonHeader={customStyleButtonHeader}
          customStyleModalTemplate={customStyleModalTemplate}
          assetId={asset?._id}
          fn={fn}
          setShowPopupNewAsset={setShowPopupNewAsset}
          tableId={tableId}

        >
          <div className={styles.popupNewContaier} style={customStylePopupNewContaier}>
            <div className={styles.leftSide} style={customStyleLeftSide}>
              <NavigationPopups
                type={"asset"}
                setParameters={setUserData}
                parameters={userData?.parameters}
                handleDelete={handleDelete}
                text={t("asset")}
                showCreateParameter={showCreateParameter}
                setShowCreateParameter={setShowCreateParameter}
                newContact={setShowNewAsset}
                data={userData}
                setImage={handleAssetData}
                handleBtnsActions={handleBtnsActions}
                setShowAddTags={setShowAddTags}
                showAddTags={showAddTags}
                copyClipboard={copyClipboard}
                setSelectedTags={setSelectedTags}
                setTypeLocation={setTypeLocation}
                setLocationState={setLocationState}
                typeContainer={typeContainer}
                customStyleNavigationPopupsContainer={customStyleNavigationPopupsContainer}
                father={'asset'}
                assetRef={assetRef}
                financialRef={financialRef}
                complementaryRef={complementaryRef}
                parameterAssetRef={parameterAssetRef}
                setShowCreateParameterFromPopup={setShowCreateParameterFromPopup}
                tableType={tableType ? tableType : userData.type ?userData.type: null }
               assetTableId={contactTableId ? contactTableId : userData.tableId ? userData.tableId : tableId }
               saveParameter={saveParameter}
               showPopupNewAsset={showPopupNewAsset}
               setShowDeleteTableModalParameter={setShowDeleteTableModalParameter}
               setShowDeleteTableModalParameterPopup={setShowDeleteTableModalParameterPopup}
               setCurrentParameter={setCurrentParameter}
               reloadVariable={reloadVariable}
               setReloadVariable={setReloadVariable}
                
              />
            </div>
            {/* {typeContainer !== "popup" &&  */}
            <div style={{ pointerEvents: "auto" }}
              className={`${styles.newClientContainer} ${isAnimating ? styles.scaleDown : styles.scaleUp}`}
            >
              <form className={styles.formNewProduct} id="scrollContainer" style={customStyleFormNewProduct}>
                <div className={styles.contactinfo} style={customStyleContactinfo}>

                  <div className={styles.columnRightContactInfo} style={customStyleColumnRightContactInfo}>
                    {/* <div className={styles.btnContactInfoContainer}>
                      <div className={styles.fileInfo}>
                        <input
                          type="text"
                          placeholder={t("fileTitle")}
                          value={userData?.fileTitle}
                          disabled={!editingFileTitle}
                          ref={inputTitleFile}
                          onBlur={() => handleBtnsActions("inputFileTitle")}
                          onChange={(e) => {
                            setUserData((prev) => ({
                              ...prev,
                              fileTitle: e.target.value,
                            }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); 
                              handleBtnsActions("inputFileTitle");
                             
                            }
                          }}
                        />
                        <FileIcon />
                      </div>
                    </div> */}


                    <div className={`${styles.typeClient}`}>
                      {category?.assets ? (
                        category?.assets?.map((cat, index) => (
                          <React.Fragment key={cat}>
                            <button
                              className={`${styles.categoryButton} ${type == cat && styles.selected}`}
                              onClick={() => {
                                setUserData((prev) => ({
                                  ...prev,
                                  type: cat,
                                }));
                                setType(cat);
                                if (cat === "other") {
                                  setShowInput(true);
                                } else {
                                  setShowInput(false);
                                }
                              }}
                              type="button"
                            >
                              {t(cat)}

                              {cat !== "other" &&
                                cat !== "service" &&
                                cat !== "product" && (
                                  <div className={styles.deleteButtonContainer}>
                                    <DeleteButton
                                      action={(e) => {
                                        e.stopPropagation();
                                        setDeleteCategory(cat)
                                      }}
                                    />
                                  </div>
                                )}
                            </button>

                            {index === 0 && showInput && (
                              <input
                                value={inputValue}
                                ref={inputRef}
                                type="text"
                                onChange={(event) =>
                                  setInputValue(event.target.value)
                                }
                                placeholder="Nueva categoria"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleCategory();
                                  }
                                }}
                                style={{
                                  marginLeft: "8px",
                                  background: "white",
                                  width: "fit-content",
                                  outline: "none",
                                  border: "none",
                                }}
                              />
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <>
                          <button
                            className={type == t("other") && styles.selected}
                            onClick={() => {
                              setUserData((prev) => ({
                                ...prev,
                                type: t("other"),
                              }));
                              setType(t("other"));
                            }}
                            type="button"
                          >
                            {t("other")}
                          </button>

                          <button
                            className={type == t("service") && styles.selected}
                            onClick={() => {
                              setUserData((prev) => ({
                                ...prev,
                                type: t("service"),
                              }));
                              setType(t("service"));
                            }}
                            type="button"
                          >
                            {t("service")}
                          </button>
                          <button
                            className={type == t("product") && styles.selected}
                            onClick={() => {
                              setUserData((prev) => ({
                                ...prev,
                                type: t("product"),
                              }));
                              setType(t("product"));
                            }}
                            type="button"
                          >
                            {t("product")}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div ref={assetRef} className={styles.sectionContact} style={customStyleSectionContact}>
                  <h3 id="assetIdentification">{t("assetIdentification")}</h3>
                  <div className={styles.infoLabelIdentification}>
                    <div className={styles.label}>
                      {" "}
                      <div>
                        <EditableInput
                          label={t("name")}
                          nameInput={"name"}
                          placeholderInput={userData?.name || t("enterAName")}
                          isEditing={inputsEditing.name}
                          value={userData?.name}
                          onChange={(e) => {
                            setUserData({
                              ...userData,
                              name: e.target.value,
                            });
                          }}
                          onClick={() =>
                            setInputsEditing((prev) => ({
                              ...prev,
                              name: !prev.name,
                            }))
                          }
                          newFormat={true}
                        ></EditableInput>

                      </div>
                    </div>
                    <div className={styles.label}>
                      <EditableInput
                        label={t("description")}
                        nameInput={"descripcion"}
                        placeholderInput={t("specifiesCharacteristicsArticle")}
                        type="textarea"
                        isEditing={inputsEditing.description}
                        value={userData?.description}
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            description: e.target.value,
                          });
                        }}
                        onClick={() =>
                          setInputsEditing((prev) => ({
                            ...prev,
                            description: !prev.description,
                          }))
                        }
                        newFormat={true}
                      />
                    </div>

                    <div className={styles.label}>
                      <EditableInput
                        label={"# ID"}
                        nameInput={"code"}
                        placeholderInput={"#"}
                        isEditing={inputsEditing.code}
                        value={userData?.code}
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            code: e.target.value,
                          });
                        }}
                        onClick={() =>
                          setInputsEditing((prev) => ({
                            ...prev,
                            code: !prev.code,
                          }))
                        }
                        newFormat={true}
                      />
                    </div>

                    <div className={styles.infoContact}>
                      <div className={styles.label}>
                        <div className={styles.row}>
                          <CheckedInput
                            title={t("defaultProvider")}
                            text={t("checkIfYourAreOwner")}
                            inputPlaceholder={t("searchAndSelectSuppliers")}
                            type={"supplier"}
                            value={userData?.provider_default}
                            valueChecked={userData?.provider_default_checked}
                            setShowNewContact={setShowNewContact}
                            showNewContact={showNewContact}
                            setValueState={handleCheckedInputs}
                            fieldName="provider_default"
                            valueCheckedName={"provider_default_checked"}
                          />

                          <div className={styles.customLabel}>
                            <p>{t("storeOrWarehouse")}</p>
                            <Button
                              type="transparent"
                              action={() => {
                                setTypeLocation('location')
                                setLocationState(true)
                              }}
                              headerStyle={{
                                borderRadius: "3.2px",
                                border: " 1px solid var(--ced4da-border)",
                                background: "var(--fa-background)",
                                width: "100%",
                                justifyContent: "start",
                              }}
                            >
                              {t("addLocation")}
                            </Button>
                            <div className={styles.infoCustomLabel}>
                              {!editingLocation ? (
                                <span>
                                  {typeof userData?.name_store === "object"
                                    ? userData?.name_store?.email
                                    : userData?.name_store || t("nameStore")}
                                </span>
                              ) : (
                                <input
                                  type="text"
                                  value={
                                    typeof userData?.name_store === "object"
                                      ? userData.name_store.email
                                      : userData.name_store
                                  }
                                  placeholder={t("nameStore")}
                                  onChange={(e) => {
                                    setUserData({
                                      ...userData,
                                      name_store: e.target.value,
                                    });
                                  }}
                                  disabled={!editingLocation}
                                />
                              )}

                              <div className={styles.btnContainer}>
                                <Button
                                  type="button"
                                  action={() =>
                                    setEditingLocation((prev) => !prev)
                                  }
                                >
                                  <Pencil />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div ref={financialRef} className={styles.sectionContact} style={customStyleSectionContact}>
                  <h3 id="financialInformation">{t("financialInformation")}</h3>
                  <div className={styles.infoLabelIdentification}>
                    <div className={styles.row}>
                      <EditableInput
                        label={t("type")}
                        nameInput={"type"}
                        placeholderInput={t("purchaseSale")}
                        type="dropdown"
                        isEditing={inputsEditing.typeFinancialInformation}
                        value={userData?.typeFinancialInformation}
                        onChange={(option) => {
                          setUserData({
                            ...userData,
                            typeFinancialInformation: option,
                          });
                        }}
                        onClick={() =>
                          setInputsEditing((prev) => ({
                            ...prev,
                            typeFinancialInformation:
                              !prev.typeFinancialInformation,
                          }))
                        }
                        optionsDropdown={[t("purchase"), t("sale")]}
                        newFormat={true}
                      />

                      <EditableInput
                        label={t("typeOfExpense")}
                        nameInput={"typeOfExpense"}
                        placeholderInput={t("sale")}
                        type="dropdown"
                        isEditing={inputsEditing.typeOfExpense}
                        value={userData?.typeOfExpense}
                        onChange={(option) => {
                          setUserData({
                            ...userData,
                            typeOfExpense: option,
                          });
                        }}
                        onClick={() =>
                          setInputsEditing((prev) => ({
                            ...prev,
                            typeOfExpense: !prev.typeOfExpense,
                          }))
                        }
                        optionsDropdown={[t("purchase"), t("sale")]}
                        newFormat={true}
                      />
                    </div>

                    <div className={styles.row}>
                      <EditableInput
                        label={t("baseImport")}
                        nameInput={"baseImport"}
                        placeholderInput={"0.0"}
                        isEditing={inputsEditing.baseImport}
                        rigthText={t("retailPriceWithoutVat")}
                        value={userData?.baseImport}
                        type="number"
                        onChange={(e) => {
                          setUserData({
                            ...userData,
                            baseImport: e.target.value,
                          });
                        }}
                        onClick={() =>
                          setInputsEditing((prev) => ({
                            ...prev,
                            baseImport: !prev.baseImport,
                          }))
                        }
                        newFormat={true}
                      />
                      <div className={styles.taxRetentionContainer}>
                        <div className={styles.customLabel}>
                          <p>{t("tax")}</p>
                          <Button
                            type="transparent"
                            action={() => setTaxState(true)}
                            headerStyle={{
                              borderRadius: "3.2px",
                              border: " 1px solid var(--ced4da-border)",
                              background: "var(--fa-background)",
                              width: "100%",
                              justifyContent: "start",
                            }}
                          >
                            {t("addTax")}
                          </Button>
                          <div className={styles.infoCustomLabel}>
                            {!editingTax ? (
                              <span>{userData?.taxQuantity}%</span>
                            ) : (
                              <input
                                type="number"
                                value={userData?.taxQuantity}
                                onChange={(e) => {
                                  if (
                                    e.target.value >= 0 &&
                                    e.target.value <= 100
                                  ) {
                                    setUserData({
                                      ...userData,
                                      taxQuantity: e.target.value,
                                    });
                                  }
                                }}
                                min={0}
                                max={100}
                                disabled={!editingTax}
                              />
                            )}

                            <div className={styles.btnContainer}>
                              <Button
                                type="button"
                                action={() => setEditingTax((prev) => !prev)}
                              >
                                <Pencil />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className={styles.customLabel}>
                          <p>{t("retention")}</p>
                          <Button
                            type="transparent"
                            action={() => setDiscountState(true)}
                            headerStyle={{
                              borderRadius: "3.2px",
                              border: " 1px solid var(--ced4da-border)",
                              background: "var(--fa-background)",
                              width: "100%",
                              justifyContent: "start",
                            }}
                          >
                            {t("addRetention")}
                          </Button>
                          <div className={styles.infoCustomLabel}>
                            {!retention ? (
                              <span>{userData?.retentionQuantity}%</span>
                            ) : (
                              <input
                                type="number"
                                value={userData?.retentionQuantity}
                                onChange={(e) => {
                                  if (
                                    e.target.value >= 0 &&
                                    e.target.value <= 100
                                  ) {
                                    setUserData({
                                      ...userData,
                                      retentionQuantity: e.target.value,
                                    });
                                  }
                                }}
                                min={0}
                                max={100}
                                disabled={!retention}
                              />
                            )}

                            <div className={styles.btnContainer}>
                              <Button
                                type="button"
                                action={() => setRetention((prev) => !prev)}
                              >
                                <Pencil />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.row}>
                      <CheckedInput
                        title={t("costproduction")}
                        text={t("checkIfYouWantAddCostProduction")}
                        setValueState={handleCheckedInputs}
                        fieldName="costProduction"
                        value={userData?.costProduction}
                        valueChecked={userData?.costProduction_checked}
                        valueCheckedName={"costProduction_checked"}
                      />
                    </div>

                    <div className={styles.row}>
                      <CheckedInput
                        title={t("recommendedRetailPrice")}
                        text={t("checkIfYouwWantAddRecommendedPrice")}
                        setValueState={handleCheckedInputs}
                        fieldName="retail_price"
                        value={userData?.retail_price}
                        valueChecked={userData?.retail_price_checked}
                        valueCheckedName={"retail_price_checked"}
                      />
                      <CheckedInput
                        title={t("supplement")}
                        text={t("checkIfYouWantAddSurchage")}
                        setValueState={handleCheckedInputs}
                        fieldName="supplement"
                        value={userData?.supplement}
                        valueChecked={userData?.supplement_checked}
                        valueCheckedName={"supplement_checked"}
                      />
                    </div>
                  </div>
                </div>

                <div ref={complementaryRef} className={styles.sectionContact} style={customStyleSectionContact}>
                  <h3 id="complementaryAndSubstitute">
                    {t("complementaryAndSubstitute")}
                  </h3>
                  <div className={styles.infoLabelIdentification}>
                    <div
                      className={styles.inputContainer}
                    >
                      <Lupa />
                      <input
                        type="text"
                        placeholder={t("searchForAssets")}
                        onFocus={() => setFocused(true)}
                        onBlur={handleBlur}
                        onChange={(e) =>
                          setInputValueAssetPopup(e.target.value)
                        }
                        value={inputValueAssetPopup}
                        className={styles.searchContactInput}
                      />
                      {focused && inputValueAssetPopup.length > 0 && (
                        <ContactsPopup
                          ref={contactsRef}
                          handleAssetClick={handleAssetInsumoClick}
                          type={"asset"}
                          inputValue={inputValueAssetPopup}
                          father={"newAsset"}
                        />
                      )}
                    </div>
                    <Button
                      type="white"
                      action={() => {
                        setUserData((prev) => ({
                          ...prev,
                          insumo: [
                            ...(Array.isArray(prev.insumo) ? prev.insumo : []),
                            {
                              id: Date.now(),
                              img: "",
                              name: "",
                              description: "",
                              unitPrice: 0,
                              sku: 0,
                              tax: 0,
                            },
                          ],
                        }));
                      }}
                    >
                      {t("addInsumo")}
                    </Button>

                    {userData?.insumo?.length == 0 || !userData?.insumo ? (
                      ""
                    ) : (
                      <DynamicTable
                        columns={tableHeaders}
                        ref={dynamicTableRef}
                        data={userData?.insumo || []}
                        renderRow={renderRowInsumo}
                        hideCheckbox={true}
                      />
                    )}
                  </div>

                  <div className={styles.infoLabelIdentification}>
                    <div
                      className={styles.inputContainer}
                    >
                      <Lupa />
                      <input
                        type="text"
                        placeholder={t("searchForAssets")}
                        onFocus={() => setFocused2(true)}
                        onBlur={handleBlur2}
                        onChange={(e) =>
                          setInputValueAssetPopup2(e.target.value)
                        }
                        value={inputValueAssetPopup2}
                        className={styles.searchContactInput}
                      />
                      {focused2 && inputValueAssetPopup2.length > 0 && (
                        <ContactsPopup
                          ref={contactsRef2}
                          handleAssetClick={handleAssetSubstituteClick}
                          type={"asset"}
                          inputValue={inputValueAssetPopup2}
                          father={"newAsset"}
                        />
                      )}
                    </div>
                    <Button
                      type="white"
                      action={() => {
                        setUserData((prev) => ({
                          ...prev,
                          substitute: [
                            ...(Array.isArray(prev.substitute)
                              ? prev.substitute
                              : []),
                            {
                              id: Date.now(),
                              img: "",
                              name: "",
                              description: "",
                              unitPrice: 0,
                              sku: 0,
                              tax: 0,
                            },
                          ],
                        }));
                      }}
                    >
                      {t("addsubstitute")}
                    </Button>

                    {userData?.substitute?.length == 0 ||
                      !userData?.substitute ? (
                      ""
                    ) : (

                      <DynamicTable
                        columns={tableHeaders}
                        ref={dynamicTableRef}
                        data={userData?.substitute || []}
                        renderRow={renderRowSubstitute}
                        hideCheckbox={true}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.infoContact}>

                 
                  <div ref={parameterAssetRef} className={styles.label} >

                    {" "}
                    <ParametersLabel
                      parameters={userData?.parameters}
                      setContactDataInputs={setUserData}
                      editingIndices={editingIndices}
                      setEditingIndices={setEditingIndices}
                      showCreateParameter={showCreateParameter}
                      setShowCreateParameter={setShowCreateParameter}
                      customStyleColumnDirection={customStyleColumnDirection}
                    />
                  </div>

                </div>
                <div className={styles.sectionContact}>
                  <h3 id="transactions">
                    {t("transactions")}{" "}
                    {userData?.docs?.length > 0 &&
                      `(${userData?.docs?.length})`}
                  </h3>
                  <div className={styles.infoLabelIdentification}>
                    {userData?.docs?.length == 0 || !userData?.docs ? (
                      <SkeletonScreen
                        labelText={t("thisAssetNotHaveDoc")}
                        helperText={t("assetsListeredHere")}
                        showInput={true}
                        enableLabelClick={false}
                      />
                    ) : (
                      <DynamicTable
                        columns={tableHeadersDoc}
                        ref={dynamicTableRef}
                        data={userData?.docs || []}
                        renderRow={renderRowDoc}
                        hideCheckbox={true}
                      />
                    )}
                  </div>
                </div>
              </form>
            </div>

          </div>
        </ModalTemplate>
      </div>
      {taxState && (
        <AddTax
          setShowTaxModal={setTaxState}
          showTaxModal={taxState}
          isAnimating={isAnimatingModal}
          setIsAnimating={setIsAnimatingModal}
          setTaxQuantity={handleTaxQuantityChange}
        />
      )}
      {locationState && (
        <AddLocation
          setShowLocationModal={setLocationState}
          showLocationModal={locationState}
          isAnimating={isAnimatingModal}
          setIsAnimating={setIsAnimatingModal}
          setLocation={(location) => {
            typeLocation == 'parameter' ? setLocationParameter(location) :
              setUserData((prev) => ({
                ...prev,
                name_store: location,
              }))
          }}
          setBillingDetails={setBillingDetails}
          billingDetails={billingDetails}
          showButtonsOptions={false}
          setlocationParameters={setLocationParameter}
        />
      )}

      {deleteCategory &&
        <DeleteChatAgents
          user={user}
          setDeleteChats={setDeleteCategory}
          handleDeleteCategory={handleDeleteCategory}
          deleteCategory={deleteCategory}
          type={'newAsset'}
        />}

      {showAddTags && (
        <NewTag
          setShowNewTagModal={setShowAddTags}
          setSelectedTags={setSelectedTags}
          selectedTags={selectedTags}
          setTags={setTags}
          tags={tags}
        />
      )}
      {discountState && (
        <AddDiscount
          setShowDiscountModal={setDiscountState}
          isAnimating={isAnimatingModal}
          setIsAnimating={setIsAnimatingModal}
          setDiscountQuantity={handleDiscountQuantityChange}
          fatherSelectedDiscount={userData.DiscountQuantity}
        />
      )}
      {showVariableModal && (
        <VariableModal
          VariableModal={showVariableModal}
          setShowVariableModal={setShowVariableModal}
          type={"category"}
          uniqueVariable={true}
          setConfiguration={setUserData}
          configuration={userData}
        />
      )}

      {showCreateParameter && (
        <CreateParameterPopup
          saveParameter={saveParameter}
          setShowCreateParameter={setShowCreateParameter}
          setState={setUserData}
          setLocationState={setLocationState}
          setTypeLocation={setTypeLocation}
          locationParameter={locationParameter}
          setLocationParameter={setLocationParameter}
        />
      )}

  {showDeleteTableModalParameter && (
      <DeleteChatAgents
          user={user}
          variant={'confirm'}
          type={'parameterGlobal'}
          parametersGlobals={tableView?.variables || []}
          deleteParameterDB={deleteParameterDB}
          showDeleteTableModal={showDeleteTableModalParameter}
          setShowDeleteTableModal={setShowDeleteTableModalParameter}
        />
      )}
    </div>
  );
};

export default NewProduct;
