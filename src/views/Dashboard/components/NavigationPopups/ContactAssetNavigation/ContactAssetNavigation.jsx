import React, { useState, useEffect, useRef } from "react";
import styles from "./ContactAssetNavigation.module.css";
import Button from "../../Button/Button";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from "react-i18next";
import SearchIconWithIcon from "../../SearchIconWithIcon/SearchIconWithIcon";
import useFocusShortcut from "../../../../../utils/useFocusShortcut";
import { clearDoc } from "@src/slices/docsSlices";
import lIcon from "../../../assets/lIcon.svg";
import { ReactComponent as RedTrash } from "../../../assets/redTrash.svg";
import { ReactComponent as Phone } from "../../../assets/phoneIcon.svg";
import { ReactComponent as GreenMailIcon } from "../../../assets/greenMailIcon.svg";
import { ReactComponent as GreenWebIcon } from "../../../assets/greenWebIcon.svg";
import { ReactComponent as GreenPhoneIcon } from "../../../assets/greenPhoneIcon.svg";
import { ReactComponent as GrayTagIcon } from "../../../assets/tagNewIcon.svg";
import { ReactComponent as GreenCopyIcon } from "../../../assets/greenCopyIcon.svg";
import { ReactComponent as ArrowDown } from "../../../assets/arrowDownGray.svg";
import ItemNavigation from "../ItemNavigation/ItemNavigation";
import { ReactComponent as BillingDetailIcon } from "../../../assets/billingDetailIcon.svg";
import { ReactComponent as ParametersIcon } from "../../../assets/parametersIcon.svg";
import { ReactComponent as IconForSee } from "../../../assets/iconForSee.svg";
import { ReactComponent as FilterIcon1InExplore } from "../../../assets/filterIcon1InExplore.svg"
import k from "../../../assets/k.svg";
import { ReactComponent as ComplementaryAndSubstitute } from "../../../assets/complementaryAndSubstituteIcon.svg";
import { ReactComponent as CharacterParamIcon } from "../../../assets/CharacterParamIcon.svg";
import { ReactComponent as TextBoxParamIcon } from "../../../assets/TextBoxParamIcon.svg";
import { ReactComponent as UnitMeasureParamIcon } from "../../../assets/UnitMeasureParamIcon.svg";
import { ReactComponent as DateParamIcon } from "../../../assets/DateParamIcon.svg";
import { ReactComponent as LocationParamIcon } from "../../../assets/LocationParamIcon.svg";
import { ReactComponent as ContactIdentification } from "../../../assets/contactIdentificationIcon.svg";
import { ReactComponent as TextBoxIcon } from "../../../assets/TextBoxIcon.svg";
import { ReactComponent as NumberIcon } from "../../../assets/NumberIcon.svg";
import { ReactComponent as UnitOfMeasurementIcon } from "../../../assets/UnitOfMeasurementIcon.svg";
import { ReactComponent as AmountIcon } from "../../../assets/AmountIcon.svg";
import { ReactComponent as CheckCircleFeatures } from "../../../assets/checkCircleFeatures.svg";
import { ReactComponent as DiscountIcon } from "../../../assets/DiscountIcon.svg";
import { ReactComponent as PercentageIcon } from "../../../assets/PercentageIcon.svg";
import { ReactComponent as DateIcon } from "../../../assets/DateIcon.svg";
import { ReactComponent as DateRangesIcon } from "../../../assets/DateRangesIcon.svg";
import { ReactComponent as LocationIcon } from "../../../assets/LocationIcon.svg";
import { ReactComponent as FilesMediaIcon } from "../../../assets/FilesMediaIcon.svg";
import { ReactComponent as listIcon } from "../../../assets/ListIconNew.svg";
import { ReactComponent as CategoryIcon } from "../../../assets/CategoryIcon.svg";
import { ReactComponent as TagIcon } from "../../../assets/TagIconNew.svg";
import { ReactComponent as StatusIcon } from "../../../assets/StatusIcon.svg";
import { ReactComponent as ChecklistIcon } from "../../../assets/ChecklistIcon.svg";
import { ReactComponent as EmailIcon } from "../../../assets/EmailIconNew.svg";
import { ReactComponent as PhoneIcon } from "../../../assets/phoneIcon.svg";
import { ReactComponent as ContactIcon } from "../../../assets/ContactIcon.svg";
import { ReactComponent as AssetIcon } from "../../../assets/AssetIcon.svg";
import { ReactComponent as UrlIcon } from "../../../assets/UrlIcon.svg";
import { ReactComponent as ChronometerIcon } from "../../../assets/ChronometerIcon.svg";
import { ReactComponent as VoiceRecorderIcon } from "../../../assets/VoiceRecorderIcon.svg";
import { ReactComponent as LanguageIcon } from "../../../assets/LanguageIcon.svg";
import { ReactComponent as FormulaIcon } from "../../../assets/FormulaIcon.svg";
import { ReactComponent as AssessmentIcon } from "../../../assets/AssessmentIcon.svg";
import { ReactComponent as PencilEditIcon } from "../../../assets/pencilEdit.svg";
import SortableItem from './SortableItem.jsx'
import QRCodeGenerator from "../../QRCodeGenerator/QRCodeGenerator";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { createVariable, getVariable, updateVariableTableData,getTableDataFiltered,deleteVariableTableData,createVariableTableData } from "../../../../../actions/user";
import ProfileModalTemplate from "../../ProfileModalTemplate/ProfileModalTemplate";
import DeleteButton from "../../DeleteButton/DeleteButton";
import { setCurrentTableNew } from "../../../../../slices/userSlices.js";
import DeleteChatAgents from "../../DeleteChatAgents/DeleteChatAgents";

const ContactAssetNavigation = ({
  type,
  setParameters,
  parameters,
  newContact,
  handleDelete,
  text,
  setShowCreateParameter,
  showCreateParameter,
  data,
  setImage,
  handleBtnsActions,
  setShowAddTags,
  showAddTags,
  copyClipboard,
  setTypeLocation,
  setLocationState,
  typeContainer,
  father,
  parametersRef,
  billingRef,
  contactRef,
  assetRef,
  financialRef,
  complementaryRef,
  parameterAssetRef,
  contactId,
  setShowCreateParameterFromPopup,
  tableType,
  contactTableId,
  assetTableId,
  saveParameter,
  showPopupNewAsset,
  setShowDeleteTableModalParameterPopup,
  setCurrentParameter,
  reloadVariable,
  setReloadVariable
}) => {
  const [t] = useTranslation("Contacts");
  const [isParametersVisible, setIsParameterVisible] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [draggingGroupId, setDraggingGroupId] = useState(null);
  const [showSubtitlesOnly, setShowSubtitlesOnly] = useState(false);
  const dragGroupRef = useRef(null);

  const location = useLocation()
  const navigate = useNavigate()
  const [showButtonAdd, setShowButtonAdd] = useState(false)
  const { tableView,currentTableNew, user } = useSelector(state => state.user)
  const { tables, tableDataMap } =
    useSelector((state) => state.user);
  const [showEye, setShowEye] = useState(false)
  const [showEyes, setShowEyes] = useState(false)
  const [showDeleteTableModal, setShowDeleteTableModal] = useState(null)
  const dispatch = useDispatch()

  const currentVariables = tableDataMap[assetTableId || contactTableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]?.variables

  // Limpiar el estado de arrastre grupal cuando termine el drag
  useEffect(() => {
    // console.log('entra en useEffect de activeId')
    if (!activeId) {
      // Agregar un pequeño delay para que se vea la reorganización
      const timer = setTimeout(() => {
        setDraggingGroupId(null);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [activeId]);

  useEffect(() => {
    if(tableView?.title !== "tableView"){
      dispatch(getVariable({type: "tableView"}))
    }
  },[])

  // Manejador para el inicio del arrastre
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    
    // Solo procesar si ya estamos en modo subtítulos
    if (showSubtitlesOnly) {
      const activeObject = parameters.find((p) => p.id === active.id);
      if (activeObject && activeObject.code) {
        console.log('🔄 Iniciando arrastre grupal para:', activeObject.code);
      }
    }
  };

  // Manejador para el primer click en un subtítulo
  const handleSubtitleClick = (code) => {
    if (!showSubtitlesOnly) {
      setShowSubtitlesOnly(true);
      setDraggingGroupId(code);
      
      // Posicionar scroll en el grupo del subtítulo
      setTimeout(() => {
        if (dragGroupRef.current) {
          dragGroupRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }, 100);
    }
  };

  // Manejador para cancelar el modo subtítulos
  const handleCancelSubtitleMode = () => {
    setShowSubtitlesOnly(false);
    setDraggingGroupId(null);
    setActiveId(null);
  };

  const addParameterColumn = async (name, id, type) => {

   await dispatch(updateVariableTableData({tableId: assetTableId,
     mainId: tableDataMap[assetTableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]._id,
      data: {addParameter: {name: name, id: id, type: type}}}))

    await dispatch(getTableDataFiltered({tableId: assetTableId}))


  }
//aca
const handleEditParameter = async (parameter, parameterName, parameterSubName, tableId) => {
  try {

    await dispatch(updateVariableTableData({tableId: assetTableId || contactTableId, 
      mainId: tableDataMap[assetTableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]._id,
       data: {editParameter: {name: parameterName, id: parameter.id}}}))
    await dispatch(getTableDataFiltered({tableId: assetTableId || contactTableId}))

  } catch (error) {
    console.error('Error al editar el parámetro:', error);
  }
};


  const handleHidden = async (boolean, parameter) => {

    await dispatch(updateVariableTableData({tableId: assetTableId,
       mainId: tableDataMap[assetTableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]._id,
        data: {hidden: boolean, parameter: parameter}}))

    await dispatch(getTableDataFiltered({tableId: assetTableId}))


  }


  const handleClick = (id) => {
    setActiveId(id);
  };

  const renderLinks = (items) =>
    items.map(({ id, label }) => (
      <li
        key={id}
        onClick={() => handleClick(id)}
        className={activeId === id ? styles.active : ""}
      >
        <a href={`#${id}`}>{label}</a>
      </li>
    ));



  const contactItems = [
    { id: "contactIdentification", label: t('contactIdentification'), Icon: ContactIdentification, ref: contactRef },
    { id: "billingDetails", label: t('billingDetails'), Icon: BillingDetailIcon, ref: billingRef },
    { id: "parameters", label: t('parameters'), Icon: ParametersIcon, ref: parametersRef },
  ];

  const assetItems = [
    { id: "assetIdentification", label: t('assetIdentification'), Icon: ContactIdentification, ref: assetRef },
    { id: "financialInformation", label: t('financialInformation'), Icon: BillingDetailIcon, ref: financialRef },
    { id: "complementaryAndSubstitute", label: t('complementaryAndSubstitute'), Icon: ComplementaryAndSubstitute, ref: complementaryRef },
    { id: "parameters", label: t('parameters'), Icon: ParametersIcon, ref: parameterAssetRef },
  ];

  const addParameter = () => {
    if (typeof showCreateParameter !== "undefined") {
      if (typeContainer == "popup") setShowCreateParameterFromPopup(true)
      else setShowCreateParameter(true);
    } else {
      setParameters((prev) => ({
        ...prev,
        parameters: [
          ...prev.parameters,
          { name: "", value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },
        ],
      }));
    }
  };

  // console.log('parameters', parameters)
  // console.log('assetTableId', assetTableId)

  useEffect(() => {
    // console.log('entra en el useEffect de assets que abre por showPopupNewAsset', parameters)

    // if (location?.pathname?.split("/")?.find(path => path == "assets") || tableType == "assets") {

    //   if (assetTableId) {
    //     let newParameters = []
    //     tableView?.parametersTables?.[assetTableId]?.forEach(parameter => {
    //       newParameters = [...newParameters, parameter]
    //     })

    //     // Separar objetos con code (subtítulos) y parámetros
    //     const codeObjects = newParameters.filter(item => item.code)
    //     const parameterObjects = newParameters.filter(item => !item.code)

    //     // Agrupar parámetros por category
    //     const groupedByCategory = {}
    //     parameterObjects.forEach(parameter => {
    //       if (parameter.category) {
    //         if (!groupedByCategory[parameter.category]) {
    //           groupedByCategory[parameter.category] = []
    //         }
    //         groupedByCategory[parameter.category].push(parameter)
    //       }
    //     })
    //     // console.log('entra en el useEffect de assets que abre por showPopupNewAsset')
    //     // console.log('showPopupNewAsset', showPopupNewAsset)
    //     // console.log('groupedByCategory', groupedByCategory)

    //     // Ordenar cada grupo por la regla de hidden
    //     Object.keys(groupedByCategory).forEach(category => {
    //       groupedByCategory[category].sort((a, b) => {
    //         const getPriority = (item) => {
    //           if (item.hasOwnProperty("hidden")) {
    //             return item.hidden ? 1 : 0;
    //           }
    //           return 2;
    //         };
    //         return getPriority(a) - getPriority(b);
    //       });
    //     });

    //     // console.log('groupedByCategory', groupedByCategory)
    //     // Construir el arreglo final: primero los objetos code, luego sus parámetros agrupados
    //     const finalArray = []
    //     codeObjects.forEach(codeObj => {
    //       finalArray.push(codeObj) // Agregar el objeto code
    //       if (groupedByCategory[codeObj.code]) {
    //         finalArray.push(...groupedByCategory[codeObj.code]) // Agregar sus parámetros
    //       }
    //     })

    //     // console.log('finalArray', finalArray)

    //     setParameters((prev) => ({
    //       ...prev,
    //       parameters: finalArray
    //     }));
    //   } 

    // }
    // else if (location?.pathname?.split("/")?.find(path => path == "contacts") || tableType == "contacts") {
    //   if (contactTableId) {
    //     let newParameters = []
    //     tableView?.parametersTables?.[contactTableId]?.forEach(parameter => {
    //       newParameters = [...newParameters, parameter]
    //     })

    //     // Separar objetos con code (subtítulos) y parámetros
    //     const codeObjects = newParameters.filter(item => item.code)
    //     const parameterObjects = newParameters.filter(item => !item.code)

    //     // Agrupar parámetros por category
    //     const groupedByCategory = {}
    //     parameterObjects.forEach(parameter => {
    //       if (parameter.category) {
    //         if (!groupedByCategory[parameter.category]) {
    //           groupedByCategory[parameter.category] = []
    //         }
    //         groupedByCategory[parameter.category].push(parameter)
    //       }
    //     })

    //     // Ordenar cada grupo por la regla de hidden
    //     Object.keys(groupedByCategory).forEach(category => {
    //       groupedByCategory[category].sort((a, b) => {
    //         const getPriority = (item) => {
    //           if (item.hasOwnProperty("hidden")) {
    //             return item.hidden ? 1 : 0;
    //           }
    //           return 2;
    //         };
    //         return getPriority(a) - getPriority(b);
    //       });
    //     });

    //     // Construir el arreglo final: primero los objetos code, luego sus parámetros agrupados
    //     const finalArray = []
    //     codeObjects.forEach(codeObj => {
    //       finalArray.push(codeObj) // Agregar el objeto code
    //       if (groupedByCategory[codeObj.code]) {
    //         finalArray.push(...groupedByCategory[codeObj.code]) // Agregar sus parámetros
    //       }
    //     })

    //     setParameters((prev) => ({
    //       ...prev,
    //       parameters: finalArray
    //     }));
    //   } 
    // }

  },
    [
      tableView?.parametersContacts,
      tableView?.parametersAssets,
      tableView?.parametersTables, 
      contactTableId,
      assetTableId,
      tableType,
      location.pathname,
      showPopupNewAsset
    ]);

    const parameterInfo = {
    textBox: {
      title: t("textBoxTitle"),
      description: t("textBoxDescription"),
      icon: <TextBoxIcon />,
      type: t("textBoxType"),
    },
    number: {
      title: t("numberTitle"),
      description: t("numberDescription"),
      icon: <NumberIcon />,
      type: t("numberType"),
    },
    unitOfMeasurement: {
      title: t("unitOfMeasurementTitle"),
      description: t("unitOfMeasurementDescription"),
      icon: <UnitOfMeasurementIcon />,
      type: t("unitOfMeasurementType"),
    },
    amount: {
      title: t("amountTitle"),
      description: t("amountDescription"),
      icon: <AmountIcon />,
      type: t("amountType"),
    },
    // discount: {
    //   title: t("discountTitle"),
    //   description: t("discountDescription"),
    //   icon: <DiscountIcon />,
    //   type: t("discountType"),
    // },
    percentage: {
      title: t("percentageTitle"),
      description: t("percentageDescription"),
      icon: <PercentageIcon />,
      type: t("percentageType"),
    },
    date: {
      title: t("dateTitle"),
      description: t("dateDescription"),
      icon: <DateIcon />,
      type: t("dateType"),
    },
    dateRanges: {
      title: t("dateRangesTitle"),
      description: t("dateRangesDescription"),
      icon: <DateRangesIcon />,
      type: t("dateRangesType"),
    },
    hour: {
      title: t("hourTitle"),
      description: t("hourDescription"),
      icon: <DateIcon />,
      type: t("hourType"),
    },
    dateAndHour: {
      title: t("dateAndHourTitle"),
      description: t("dateAndHourDescription"),
      icon: <DateIcon />,
      type: t("dateAndHourType"),
    },
    richTextEditor: {
      title: t("richTextEditorTitle"),
      description: t("richTextEditorDescription"),
      icon: <DateIcon />,
      type: t("richTextEditorType"),
    },
    html: {
      title: t("htmlTitle"),
      description: t("htmlDescription"),
      icon: <DateIcon />,
      type: t("htmlType"),
    },
    array: {
      title: t("arrayTitle"),
      description: t("arrayDescription"),
      icon: <DateIcon />,
      type: t("arrayType"),
    },
    object: {
      title: t("objectTitle"),
      description: t("objectDescription"),
      icon: <DateIcon />,
      type: t("objectType"),
    },
    location: {
      title: t("locationTitle"),
      description: t("locationDescription"),
      icon: <LocationIcon />,
      type: t("locationType"),
    },
    filesMedia: {
      title: t("filesMediaTitle"),
      description: t("filesMediaDescription"),
      icon: <FilesMediaIcon />,
      type: t("filesMediaType"),
    },
    List: {
      title: t("listTitle"),
      description: t("listDescription"),
      icon: <listIcon />,
      type: t("listType"),
    },
    category: {
      title: t("categoryTitle"),
      description: t("categoryDescription"),
      icon: <CategoryIcon />,
      type: t("categoryType"),
    },
    colorList: {
      title: t("colorListTitle"),
      description: t("colorListDescription"),
      icon: <CharacterParamIcon />,
      type: t("colorListType"),
    },
    tag: {
      title: t("tagTitle"),
      description: t("tagDescription"),
      icon: <TagIcon />,
      type: t("tagType"),
    },
    status: {
      title: t("statusTitle"),
      description: t("statusDescription"),
      icon: <StatusIcon />,
      type: t("statusType"),
    },
    checklist: {
      title: t("checklistTitle"),
      description: t("checklistDescription"),
      icon: <ChecklistIcon />,
      type: t("checklistType"),
    },
    json: {
      title: t("jsonTitle"),
      description: t("jsonDescription"),
      icon: <ChecklistIcon />,
      type: t("jsonType"),
    },
    xml: {
      title: t("xmlTitle"),
      description: t("xmlDescription"),
      icon: <ChecklistIcon />,
      type: t("xmlType"),
    },
    uuid: {
      title: t("uuidTitle"),
      description: t("uuidDescription"),
      icon: <ChecklistIcon />,
      type: t("uuidType"),
    },
    qr: {
      title: t("qrTitle"),
      description: t("qrDescription"),
      icon: <ChecklistIcon />,
      type: t("qrType"),
    },
    barCode: {
      title: t("barCodeTitle"),
      description: t("barCodeDescription"),
      icon: <ChecklistIcon />,
      type: t("barCodeType"),
    },
    digitalSignature: {
      title: t("digitalSignatureTitle"),
      description: t("digitalSignatureDescription"),
      icon: <ChecklistIcon />,
      type: t("digitalSignatureType"),
    },
    coordinates: {
      title: t("coordinatesTitle"),
      description: t("coordinatesDescription"),
      icon: <ChecklistIcon />,
      type: t("coordinatesType"),
    },
    audio: {
      title: t("audioTitle"),
      description: t("audioDescription"),
      icon: <LanguageIcon />,
      type: t("audioType"),
    },
    email: {
      title: t("emailTitle"),
      description: t("emailDescription"),
      icon: <EmailIcon />,
      type: t("emailType"),
    },
    phone: {
      title: t("phoneTitle"),
      description: t("phoneDescription"),
      icon: <PhoneIcon />,
      type: t("phoneType"),
    },
    contact: {
      title: t("contactTitle"),
      description: t("contactDescription"),
      icon: <ContactIcon />,
      type: t("contactType"),
    },
    asset: {
      title: t("assetTitle"),
      description: t("assetDescription"),
      icon: <AssetIcon />,
      type: t("assetType"),
    },
    url: {
      title: t("urlTitle"),
      description: t("urlDescription"),
      icon: <UrlIcon />,
      type: t("urlType"),
    },
    chronometer: {
      title: t("chronometerTitle"),
      description: t("chronometerDescription"),
      icon: <ChronometerIcon />,
      type: t("chronometerType"),
    },
    voiceRecorder: {
      title: t("voiceRecorderTitle"),
      description: t("voiceRecorderDescription"),
      icon: <VoiceRecorderIcon />,
      type: t("voiceRecorderType"),
    },
    language: {
      title: t("languageTitle"),
      description: t("languageDescription"),
      icon: <LanguageIcon />,
      type: t("languageType"),
    },
    assessment: {
      title: t("assessmentTitle"),
      description: t("assessmentDescription"),
      icon: <AssessmentIcon />,
      type: t("assessmentType"),
    },
    formula: {
      title: t("formulaTitle"),
      description: t("formulaDescription"),
      icon: <FormulaIcon />,
      type: t("formulaType"),
    },
  };

  // useEffect(() => {
  //   console.log('assetTableId', assetTableId)
  //   console.log('tableDataMap', tableDataMap)
  //   console.log('parameters', parameters)
  //   if(parameters?.length == 0 && assetTableId){
  //     const table = tableDataMap[assetTableId].filter(tab => tab?.hasOwnProperty("main"))[0]
  //     console.log('table', table)
  //     setParameters((prev) => ({
  //       ...prev,
  //       parameters: table?.variables
  //     }))
  //   }
  // }, [])

  useEffect(() => {
    // console.log('assetTableId', assetTableId)
    // console.log('tableDataMap', tableDataMap)
    // console.log('parameters', parameters)
    // console.log('entra en el useEffect de parameters')
    if(parameters?.length == 0 && assetTableId){
      const table = tableDataMap[assetTableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]
      // console.log('table', table)
      // console.log('table?.variables', table?.variables)
      setParameters((prev) => ({
        ...prev,
        parameters: table?.variables
      }))
    }
  }, [parameters])

  useEffect(() => {
    if(currentVariables?.length > 0){
      setParameters((prev) => ({
        ...prev,
        parameters: currentVariables
      }))
    }
  }, [ currentVariables ])

  useEffect(() => {
    //  console.log('entra en useEffect de assets tableView',parameters)
    // if (location?.pathname?.split("/")?.find(path => path === "assets") || tableType == "assets") {
    //   if (tableView?.title === "tableView") {
    //     if (tableView?.parametersTables?.[assetTableId]?.length == 0 || tableView?.parametersTables?.[assetTableId] === undefined) {

    //       // console.log('entra en useEffect de assets cuando no hay parametros')
    //       // const defaultParameters =  tableView.tables?.[assetTableId]?.map(column => {return {
    //       //   name: column.label, delete: false, noDelete: true, hidden: false, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type:column.type
    //       //   }})
    //       const fnContacts = async () => {
    //         console.log('entra en fnContacts')
    //         await dispatch(createVariable({
    //           variableData: {
    //             category: "tableView", title: "tableView", type: "tableView", parametersTables:
    //             {
    //               ...tableView.parametersTables, [assetTableId]:
    //               [
    //                 { name: "Identificación del activo", code: "assetIdentificate", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36)},

    //                 { name: "AssetName",subName:"Nombre", category: "assetIdentificate", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
    //                 { name: "Category",subName:"Categoría", category: "assetIdentificate", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
    //                 { name: "Lorem Ipsum...",subName:"Descripción", category: "assetIdentificate", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "percentage" },
    //                 { name: "5f4sa95df1ae9f1a9d1sf",subName:"#Código de referencia", category: "assetIdentificate", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "textBox" },
    //                 { name: "ContactName",subName:"Provedor", category: "assetIdentificate", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
    //                 { name: "location",subName:"Ubicación", category: "assetIdentificate", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
    //                 { name: "Contactos",subName:"Tabla", category: "assetIdentificate", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },


    //                 { name: "Información financiera", code: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },

    //                 { name: "Compra", subName: "Tipo", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
    //                 { name: "Tipo de gasto", subName: "Categoría", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
    //                 { name: "00,00 EUR", subName: "Base de importe", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
    //                 { name: "Impuesto", subName: "Impuesto", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "percentage" },
    //                 { name: "Retención", subName: "Retención", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "percentage" },
    //                 { name: "00,00 EUR", subName: "Costo de producción/adquisición", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
    //                 { name: "00,00 EUR", subName: "Recomended retail price (RRP)", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },
    //                 { name: "00,00 EUR", subName: "Suplemento", category: "financialInformation", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "amount" },


    //                 { name: "Insumo", code: "input", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), },
    //                 { name: "Texto", subName: "Valor", category: "input", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },
    //                 { name: "Texto", subName: "valor", category: "input", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },


    //                 { name: "Suplentes y sustitutos", code: "substitutes", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36)},
    //                 { name: "Texto", subName: "Valor", category: "substitutes", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },
    //                 { name: "Texto", subName: "valor", category: "substitutes", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },

    //                 { name: "Variantes", code: "variants", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },
    //                 { name: "Texto", subName: "Valor", category: "variants", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },
    //                 { name: "Texto", subName: "valor", category: "variants", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "asset" },

    //                 { name: "Nueva categoría", code: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },
    //                 { name: "Texto", subName: "Valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "phone" },
    //                 { name: "Texto", subName: "valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "url" },
    //                 { name: "Texto", subName: "Valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "chronometer" },
    //                 { name: "Texto", subName: "valor", category: "newCategory", delete: false, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type: "location" },




    //               ]
    //             }
    //           }
    //         }))

    //         await dispatch(getVariable({ type: 'tableView' }))
    //       }
    //       fnContacts()

    //     }
    //   }

    // } else if (location?.pathname?.split("/")?.find(path => path === "contacts") || tableType == "contacts") {
    //   if (tableView?.title === "tableView") {
    //     if (tableView?.parametersTables?.[contactTableId]?.length == 0 || tableView?.parametersTables?.[contactTableId] === undefined) {
    //     //  const defaultParameters =  tableView.tables?.[cont actTableId]?.map(column => {return {
    //     //   name: column.label, delete: false, noDelete: true, hidden: false, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36), type:column.type
    //     //   }})

    //       // console.log('entra en useEffect de contacts')
    //       const fnContacts = async () => {
    //         await dispatch(createVariable({
    //           variableData: {
    //             category: "tableView", title: "tableView", type: "tableView", parametersTables:
    //             {
    //               ...tableView.parametersTables, [contactTableId]: 
    //                 [
    //                   { name: "Dirección", category: true, delete: true, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },
    //                   { name: "Teléfono", category: true, delete: true, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },
    //                   { name: "Localidad", category: true, delete: true, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },
    //                   { name: "País", category: true, delete: true, noDelete: true, value: "", title: "", id: Date.now().toString(36) + Math.random().toString(36) },
    //                 ]
    //             }
    //           }
    //         }))

    //         await dispatch(getVariable({ type: 'tableView' }))
    //       }
    //       fnContacts()

    //     }
    //   }
    // }
  }, [tableView]);


  const validateParametersOrder = (localParameters, dbParameters) => {
    if (!localParameters || !dbParameters || localParameters.length !== dbParameters.length) {
      return false;
    }
    
    for (let i = 0; i < localParameters.length; i++) {
      if (localParameters[i]?.id !== dbParameters[i]?.id) {
        return false;
      }
    }
    
    return true;
  };

  useEffect(() => {
    // console.log('entra en el useEffect de assets que se actualiza por parametros',parameters)
    // No ejecutar este useEffect si estamos en modo subtítulos para evitar que sobrescriba el estado local
    // if (showSubtitlesOnly) {
    //   return;
    // }

    // if (location?.pathname?.split("/")?.find(path => path === "assets") || tableType == "assets") {
    //   if (assetTableId) {

    //     // console.log('esto es tableView?.parametersTables?.[assetTableId]', tableView?.parametersTables?.[assetTableId])
    //     // console.log('esto es parameters', parameters)

    //     const isOrderValid = validateParametersOrder(parameters, tableView?.parametersTables?.[assetTableId]);
    //     // console.log('isOrderValid', isOrderValid)
    //     if ((tableView?.parametersTables?.[assetTableId]?.length > 0 && parameters?.length !== tableView?.parametersTables?.[assetTableId]?.length)
    //        || (tableView?.parametersTables?.[assetTableId]?.length > 0 && !isOrderValid)) {



    //       let newParameters = []
    //       tableView?.parametersTables?.[assetTableId]?.forEach(parameter => {
    //         newParameters = [...newParameters, parameter]
    //       })
  
    //       // Separar objetos con code (subtítulos) y parámetros
    //       const codeObjects = newParameters.filter(item => item.code)
    //       const parameterObjects = newParameters.filter(item => !item.code)
  
    //       // Agrupar parámetros por category
    //       const groupedByCategory = {}
    //       parameterObjects.forEach(parameter => {
    //         if (parameter.category) {
    //           if (!groupedByCategory[parameter.category]) {
    //             groupedByCategory[parameter.category] = []
    //           }
    //           groupedByCategory[parameter.category].push(parameter)
    //         }
    //       })
    //       // console.log('useEffect de asset que se actualiza por parametros')
    //       // console.log('groupedByCategory', groupedByCategory)
  
    //       // Ordenar cada grupo por la regla de hidden
    //       Object.keys(groupedByCategory).forEach(category => {
    //         groupedByCategory[category].sort((a, b) => {
    //           const getPriority = (item) => {
    //             if (item.hasOwnProperty("hidden")) {
    //               return item.hidden ? 1 : 0;
    //             }
    //             return 2;
    //           };
    //           return getPriority(a) - getPriority(b);
    //         });
    //       });
  
    //       // console.log('groupedByCategory', groupedByCategory)
    //       // Construir el arreglo final: primero los objetos code, luego sus parámetros agrupados
    //       const finalArray = []
    //       codeObjects.forEach(codeObj => {
    //         finalArray.push(codeObj) // Agregar el objeto code
    //         if (groupedByCategory[codeObj.code]) {
    //           finalArray.push(...groupedByCategory[codeObj.code]) // Agregar sus parámetros
    //         }
    //       })
  
    //       // console.log('finalArray', finalArray)
  
    //       setParameters((prev) => ({
    //         ...prev,
    //         parameters: finalArray
    //       }));

    //     }
    //   }

    // } else if (location?.pathname?.split("/")?.find(path => path === "contacts") || tableType == "contacts") {
    //   if (contactTableId) {
    //     if (tableView?.parametersTables?.[contactTableId]?.length > 0 && parameters?.length !== tableView?.parametersTables?.[contactTableId]?.length) {

    //       let newParameters = []
    //       tableView?.parametersTables?.[contactTableId]?.forEach(parameter => {
    //         newParameters = [...newParameters, parameter]
    //       })

    //       const ordenado = newParameters.sort((a, b) => {
    //         const getPriority = (item) => {
    //           if (item.hasOwnProperty("hidden")) {
    //             return item.hidden ? 1 : 0;
    //           }
    //           return 2;
    //         };


    //         return getPriority(a) - getPriority(b);
    //       });

    //       setParameters((prev) => ({
    //         ...prev,
    //         parameters: ordenado
    //       }));

    //     }
    //   }
    // }

  }, [parameters, showSubtitlesOnly]);

  const [searchTerm, setSearchTerm] = useState("");

  const searchInputRef = useRef(null);



  useFocusShortcut(searchInputRef, "/");

  const sensors = useSensors(useSensor(PointerSensor));

  const filteredParameters = parameters?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.delete == false
  );
//aca
const reorderTableViewColumns = (newParameters, tableViewTables) => {
  if (!newParameters || !tableViewTables) return [];
  
  // Filtrar solo los parámetros que no están ocultos
  const visibleParameters = newParameters.filter(param => !param.hidden);
  // console.log('visibleParameters', visibleParameters)
  // Crear un Map para acceso rápido por nombre
  const tableViewMap = new Map();
  tableViewTables.forEach(col => {
    tableViewMap.set(col.id, col);
  });
  
  // Array para los elementos reordenados
  const reorderedColumns = [];
  
  // Primero agregar los parámetros visibles en el orden que aparecen en newParameters
  visibleParameters.forEach(param => {
    if (tableViewMap.has(param.id)) {
      reorderedColumns.push(tableViewMap.get(param.id));
      tableViewMap.delete(param.id); // Remover para no duplicar
    }
  });
  
  // Luego agregar al final todos los que no estaban en newParameters
  tableViewMap.forEach(col => {
    reorderedColumns.push(col);
  });
  
  return reorderedColumns;
};

      const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }
    console.log('active', active)
    console.log('over', over)

    let newCategory = null
    let activeObject = parameters.find((p) => p.id === active.id)
    const overObject = parameters.find((p) => p.id === over.id)
    
    if (!activeObject) return;

    if (activeObject.hasOwnProperty("category") && overObject.hasOwnProperty("category")) {
      newCategory = overObject.category
    } else if (activeObject.hasOwnProperty("category") && overObject.hasOwnProperty("code")) {
      newCategory = overObject.code
    }

    if (newCategory) {
      // Cambiar la categoría del objeto activo para que coincida con la nueva posición
      activeObject = {...activeObject, category: newCategory};
    }

    
    const oldIndex = parameters.findIndex((p) => p.id === active.id);
    const newIndex = parameters.findIndex((p) => p.id === over.id);

    console.log('oldIndex', oldIndex)
    console.log('newIndex', newIndex)
    
    if (oldIndex === newIndex) return;
    
    // Caso 1: Drag de un parámetro normal (sin code)
    if (!activeObject.code) {
      // Crear una copia del objeto activo con la nueva categoría si se cambió
      let updatedActiveObject = { ...activeObject };
      if (newCategory) {
        updatedActiveObject = { ...activeObject, category: newCategory };
      }
      
      // Crear un nuevo array con el objeto actualizado
      const updatedParameters = parameters.map(param => 
        param.id === activeObject.id ? updatedActiveObject : param
      );
      let newParameters = []
      if (activeObject.hasOwnProperty("category") && overObject.hasOwnProperty("code")) {
        // Encontrar la posición del objeto code
        const codeIndex = updatedParameters.findIndex(p => p.id === overObject.id);
        // Encontrar todos los parámetros de esa categoría
        const categoryParams = updatedParameters.filter(p => p.category === overObject.code);
        // La posición final debe ser después del último parámetro de la categoría
        const finalPosition = codeIndex + categoryParams.length;
        
        // Aplicar el reordenamiento con la posición forzada
         newParameters = arrayMove(updatedParameters, oldIndex, finalPosition);

        setParameters((prev) => ({
          ...prev,
          parameters: newParameters
        }));
      } else {
        // Comportamiento normal con arrayMove
         newParameters = arrayMove(updatedParameters, oldIndex, newIndex);
        
        setParameters((prev) => ({
          ...prev,
          parameters: newParameters
        }));
      }
      


      // // Aplicar el reordenamiento
      // const newParameters = arrayMove(updatedParameters, oldIndex, newIndex);
      
      // setParameters((prev) => ({
      //   ...prev,
      //   parameters: newParameters
      // }));
      
      // Actualizar en la base de datos

      // console.log('newParameters', newParameters)

      const fn = async () => {
        await dispatch(updateVariableTableData({tableId: assetTableId,
           mainId: tableDataMap[assetTableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]._id,
            data: {reorderParameters: {newParameters: newParameters}}}))
        await dispatch(getTableDataFiltered({tableId: assetTableId}))
      }
      fn()

      // Si la vista de subtítulos está activa, cerrarla después de reordenar
      if (showSubtitlesOnly) {
        handleCancelSubtitleMode();
      }
      return;
    }
    
    // Caso 2: Drag de un subtítulo (con code) - lógica especial para agrupación
    if (activeObject.code) {
      // Usar arrayMove para el reordenamiento básico
      const reorderedArray = arrayMove(parameters, oldIndex, newIndex);
      
      // Ahora reorganizar para mantener los parámetros agrupados con su subtítulo
      const finalArray = [];
      const processedSubtitles = new Set();
      
      for (let i = 0; i < reorderedArray.length; i++) {
        const item = reorderedArray[i];
        
        if (item.code && !processedSubtitles.has(item.code)) {
          // Agregar el subtítulo
          finalArray.push(item);
          processedSubtitles.add(item.code);
          
          // Agregar todos los parámetros asociados
          const associatedParameters = reorderedArray.filter(p => p.category === item.code);
          finalArray.push(...associatedParameters);
        } else if (!item.code && !item.category) {
          // Elementos sin categoría van al final
          finalArray.push(item);
        }
      }
      
      setParameters((prev) => ({
        ...prev,
        parameters: finalArray
      }))
      console.log('finalArray', finalArray)
      const fn = async () => {
        await dispatch(updateVariableTableData({tableId: assetTableId,
           mainId: tableDataMap[assetTableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]._id,
            data: {reorderParameters: {newParameters: finalArray}}}))
        await dispatch(getTableDataFiltered({tableId: assetTableId}))
      }
      fn()
    
    }
  

    // Cerrar vista de subtítulos si estaba activa
    if (showSubtitlesOnly) {
      handleCancelSubtitleMode();
    }

    // Finalizar drag
    setActiveId(null);
  };

  const [arrayText, setArrayText] = useState(
    [{ name: "Sin categoria (1)", id: 'cat1' }, { name: "Texto", id: "texto1" }, { name: "Texto", id: "texto2" }, { name: "Texto", id: "texto3" }, { name: "Texto", id: "texto4" }]
  )

  const handleDragEndText = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = arrayText.findIndex((p) => p.id === active.id);
      const newIndex = arrayText.findIndex((p) => p.id === over.id);

      const reordered = arrayMove(arrayText, oldIndex, newIndex);
      setArrayText(reordered);
    }
  };

  // console.log('esto es contactTableId',contactTableId)


  const deleteParameter = async (id) => {
    console.log('entra en la funcion deleteParameter')

    await dispatch(deleteVariableTableData({
      tableId: assetTableId,
      mainId: tableDataMap[assetTableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]._id,
      data: {id }
    }))

    await dispatch(getTableDataFiltered({tableId: assetTableId}))

  }


  const addParameterVisibleList = async (parameter) => {

    await dispatch(createVariableTableData({tableId: contactTableId || assetTableId,
      mainId: tableDataMap[contactTableId || assetTableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]._id,
      parameter: parameter}))
      await dispatch(getTableDataFiltered({tableId: contactTableId || assetTableId}))
  }

  const handleGetOneContact = async (contactId) => {
    try {
      navigate(`/admin/docs/${contactId}`);
    } catch (error) {
      console.error("Error al obtener el contacte:", error);
    }
  };


  const deleteParameterDB = async (parameter) => {

    console.log("parameter", parameter)

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

  // console.log('esto es data', data) 

  const addCategory = async () => {
    console.log('addCategory')

    const newCategory = {
      name: "nueva categoria",
      code: Date.now().toString(36) + Math.random().toString(36),
      delete: false,
      noDelete: false,
      value:"",
      title:"",
      id: Date.now().toString(36) + Math.random().toString(36),
    };

    await dispatch(createVariableTableData({tableId: contactTableId || assetTableId,
       mainId: tableDataMap[contactTableId || assetTableId]?.filter(tab => tab?.hasOwnProperty("main"))[0]._id,
       parameter: newCategory}))
    await dispatch(getTableDataFiltered({tableId: contactTableId || assetTableId}))



    saveParameter(newCategory, contactTableId || assetTableId);
  }

  let parametersGlobals = []
  if(tableView?.variables?.length > 0 && parameters?.length > 0){
     parametersGlobals = tableView?.variables.map(item => {
      const parameter = parameters.find(param => param.name == item.name)
      if(parameter){
        return {...item, local:true}
      }
      return item

    })
   
  }

  return (
    <div className={styles.ContactAssetNavigation}>
      <ProfileModalTemplate
        type={typeContainer}
        image={data.image}
        handleContactData={setImage}
        id={data._id}
        sticky={true}
        customStyle={{
          width: "150px",
          height: "150px",
          borderRadius: typeContainer === "popup" && father === "asset" && "8px"
        }}
      />
      <div className={styles.dataInfo}>
        <p>
          {type === "contact"
            ? data.contactName || t("contactName")
            : data.name || t("assetName")}
        </p>

        <span>
          {type === "contact" ? data.type || t("contactType") : data.type || t("assetType")}
        </span>

        {data?.selectedtags?.length > 0 && <div className={styles.tagsContainer2}>
         { data.selectedtags.map(tag => <span style={{backgroundColor: tag.color + '20', color:tag.color}}
          key={tag} className={styles.tag2}>{tag.name}  <span style={{color:tag.color}} onClick={() => console.log("")}  className={styles.x}>x</span></span>
         )}</div>}

      </div>
      {type === 'contact' ? (
        <div className={styles.btnContactInfoContainer}>
          <Button
            
            action={() => handleBtnsActions("clipboard")}
          >
            <GreenCopyIcon
              className={copyClipboard && styles.activeBtn}
            />
          </Button>
          <Button
            
            action={() => {
              setShowAddTags(true);
            }}
          >
            <GrayTagIcon
              className={showAddTags && styles.activeBtn}
            />
          </Button>
          {data?.companyPhoneNumber?.length > 0 && (
            <Button
              type="border"
              action={() => handleBtnsActions("callPhoneNumber")}
            >
              <GreenPhoneIcon />
            </Button>
          )}
          {data?.webSite && (
            <Button
              type="border"
              action={() => handleBtnsActions("website")}
            >
              <GreenWebIcon />
            </Button>
          )}
          {data?.companyEmail && (
            <Button
              type="border"
              action={() => handleBtnsActions("email")}
            >
              <GreenMailIcon />
            </Button>
          )}
        </div>
      ) : (

        <div className={styles.btnContactInfoContainer}>

          <Button
            
            action={() => handleBtnsActions("clipboard")}
          >
            <GreenCopyIcon
              className={copyClipboard && styles.activeBtn}
            />
          </Button>
          <Button
            
            action={() => {
              setShowAddTags(true);
            }}
          >
            <GrayTagIcon
              className={showAddTags && styles.activeBtn}
            />
          </Button>
          <Button
            
            action={() => {
              setTypeLocation('location')
              setLocationState(true)
            }}
          >
            <LocationParamIcon
              className={showAddTags && styles.activeBtn}
            />
          </Button>
   
        </div>
      )}
      {typeContainer !== "popup" &&

        <SearchIconWithIcon>
          <>
            <FilterIcon1InExplore />
            <div onClick={() => searchInputRef.current.focus()}
              style={{ marginLeft: "7px" }}
              className={styles.searchIconsWrappers}
            >
              <img src={k} alt="kIcon" />
            </div>

          </>
        </SearchIconWithIcon>
      }


    
      <div style={{ pointerEvents: "auto" }}>

        <ItemNavigation items={type === "contact" ? contactItems : assetItems}
          typeContainer={typeContainer}
          father={father}
        />
      </div>

      {
        typeContainer === "popup" &&
        <div className={styles.buttonsForSeeContainer}>
          {type === "contact" &&
            <button onClick={(e) => {
              e.stopPropagation();
              dispatch(clearDoc());
      
              handleGetOneContact(contactId);
            }} className={styles.buttonForSee} >

              <IconForSee /> {t('seeDocuments')} {`(${data.totalDocs})`}
            </button>
          }

        </div>
      }
      


      <div style={{ pointerEvents: "auto", position: "relative" }}>
      <div className={`${styles.expandableContainer} ${searchTerm.length > 0 && styles.searchOpen}`}>
        <ul>
          {parametersGlobals?.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((parameter, index) => {
            return <li key={parameter.id} className={styles.parameterItem} style={{
              all: "unset",
              padding: "4px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
             
              <span>{parameter.name}</span>
              <div style={{display:"flex", gap:"10px", alignItems: "center"}}>
             {parameter.local ? 
             <div className={styles.checkCircleFeatures}> <CheckCircleFeatures />  </div>
             :<div
                className={styles.addParameterColumn}
                onClick={() => addParameterVisibleList(parameter)}
              >
                +
              </div>}
              {!(parameter.noDelete) && <DeleteButton action={() => {
                 if(setShowDeleteTableModalParameterPopup) setShowDeleteTableModalParameterPopup(parameter.id)
                 else setShowDeleteTableModal(parameter.id)
                 
                }} />}
              </div>
            </li>
          }).slice(0, 8)}
        </ul>
      </div>


        <SearchIconWithIcon
          ref={searchInputRef}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          classNameIconRight={styles.searchContainerL}
          onClickIconRight={() => setIsFilterOpen(true)}
          placeholder={t("searchAutomations")}
          stylesComponent={{ padding: "0" }}
        >


          <>
            <FilterIcon1InExplore />
            <div onClick={() => searchInputRef.current.focus()}
              style={{ marginLeft: "7px" }}
              className={styles.searchIconsWrappers}
            >
              <img src={k} alt="kIcon" />
            </div>

          </>
        </SearchIconWithIcon>
      </div>

      <div style={{ pointerEvents: "auto", display:"flex", gap:"10px" }}>
      <Button
          action={addCategory}
          type="white"
          headerStyle={{
            borderRadius: "999px",
            padding: "4px 8px",
            width: "100%",
            fontSize:"10px"
          }}
        >
          {t("addCategory")}
        </Button>

        <Button
          action={addParameter}
          type="white"
          headerStyle={{
            borderRadius: "999px",
            padding: "4px 8px",
            width: "100%",
            fontSize:"10px"
          }}
        >
          {t("newParameterLinkeram")}
        </Button>
        <Button
          type="white"
          headerStyle={{
            borderRadius: "4px",
            padding: "8px",
            width: "50px",
            fontSize:"10px"
          }}
        >
         <PencilEditIcon style={{width: "12px", height: "12px"}} />
        </Button>
      </div>

  


      {/* <div
        className={styles.parameters}
        onClick={() => {
          setIsParameterVisible((prev) => !prev);
        }}
      >
        <ArrowDown
          style={{
            transform: isParametersVisible && "rotate(180deg)",
            transition: "all 300ms",
          }}
        />
        {t("parameters")}{" "}
        <span>
          {parameters?.length > 1 &&
            `(${parameters?.filter((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.delete == false
            ).length

            })`}
        </span>
      </div> */}


      <div
        className={styles.parametersContainer}
        style={{
          height: isParametersVisible ? "auto" : "0px",
          overflow: "hidden",
        }}
      >
        {/* Indicador de modo subtítulos */}
        {showSubtitlesOnly && (
          <div 
            ref={dragGroupRef}
            style={{
              // backgroundColor: 'rgba(0, 123, 255, 0.1)',
              // border: '1px solid rgba(0, 123, 255, 0.3)',
              // borderRadius: '6px',
              padding: '12px',
              margin: '8px 0',
              // textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* <span style={{
              fontSize: '14px',
              color: 'rgba(0, 123, 255, 0.8)',
              fontWeight: 500
            }}>
              🎯 Modo Subtítulos - Haz click en un subtítulo para arrastrarlo
            </span> */}
            <button
              onClick={handleCancelSubtitleMode}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                color: 'rgba(255, 0, 0, 0.8)',
                cursor: 'pointer'
              }}
            >
              ✕ Cerrar modo categorias
            </button>
          </div>
        )}
        

<DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={parameters?.filter(item => item.delete == false).map(p => p.id) || []} strategy={verticalListSortingStrategy}>
            <ul>
           
              {parameters?.filter((item) =>
                item.delete == false
              ).map((parameter, index) => (
                <SortableItem
                  tableId={assetTableId || contactTableId}
                  parameters={parameters?.filter(item => item.delete == false)}
                  key={parameter.id}
                  parameter={parameter}
                  index={index}
                  showEyes={showEyes}
                  setShowEyes={setShowEyes}
                  showButtonAdd={showButtonAdd}
                  setShowButtonAdd={setShowButtonAdd}
                  setShowEye={setShowEye}
                  showEye={showEye}
                  handleHidden={handleHidden}
                  addParameterColumn={addParameterColumn}
                  deleteParameter={deleteParameter}
                  isGroupDragging={draggingGroupId !== null}
                  groupId={draggingGroupId}
                  showSubtitlesOnly={showSubtitlesOnly}
                  onSubtitleClick={handleSubtitleClick}
                  searchTerm={searchTerm}
                  handleEditParameter={handleEditParameter}
                  addParameter={addParameter}
                  setCurrentParameter={setCurrentParameter}
                  data={data}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
       
       <div className={styles.parametersOpacityContainer} style={{display: searchTerm.length > 0 ? "block" : "none"}}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={parameters?.filter(item => item.delete == false).map(p => p.id) || []} strategy={verticalListSortingStrategy}>
            <ul>
           
              {parameters?.filter((item) =>
                item.delete == false
              ).map((parameter, index) => (
                <SortableItem
                  tableId={assetTableId || contactTableId}
                  parameters={parameters?.filter(item => item.delete == false)}
                  key={parameter.id}
                  parameter={parameter}
                  index={index}
                  showEyes={showEyes}
                  setShowEyes={setShowEyes}
                  showButtonAdd={showButtonAdd}
                  setShowButtonAdd={setShowButtonAdd}
                  setShowEye={setShowEye}
                  showEye={showEye}
                  handleHidden={handleHidden}
                  addParameterColumn={addParameterColumn}
                  deleteParameter={deleteParameter}
                  isGroupDragging={draggingGroupId !== null}
                  groupId={draggingGroupId}
                  showSubtitlesOnly={showSubtitlesOnly}
                  onSubtitleClick={handleSubtitleClick}
                  searchTerm={""}
                  handleEditParameter={handleEditParameter}
                  data={data}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        </div>
      </div>


      {
        !newContact && typeContainer !== "popup" && (assetTableId || contactTableId) &&  (
          <>
            <div className={styles.deleteContact} onClick={handleDelete}>
              <RedTrash className={styles.icon} /> {t("delete")} {text}
            </div>
            <QRCodeGenerator url={`https://facturagpt.com${location?.pathname}`} />
          </>

        )
      }

{showDeleteTableModal !== null && (
  console.log("showDeleteTableModal", showDeleteTableModal),
      <DeleteChatAgents
          user={user}
          variant={'confirm'}
          type={'parameterGlobal'}
          parametersGlobals={parametersGlobals}
          deleteParameterDB={deleteParameterDB}
          showDeleteTableModal={showDeleteTableModal}
          setShowDeleteTableModal={setShowDeleteTableModal}
        />
      )}
    </div >

  );
};

export default ContactAssetNavigation;
