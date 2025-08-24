import React, { useEffect, useRef, useState }  from "react";
import styles from './ContactAssetNavigation.module.css'
import { FaChevronUp } from "react-icons/fa";

import {
  useSortable,
} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import { ReactComponent as PencilForPopup } from "../../../assets/pencilForPopup.svg";
import { ReactComponent as EyePassword } from "../../../assets/eyePassword.svg";
import { ReactComponent as GrabIcon } from "../../../assets/grabIcon.svg";
import { ReactComponent as Icon1OfText } from "../../../assets/icon1OfText.svg";
import { ReactComponent as Icon2OfText } from "../../../assets/icon2OfText.svg";
import { ReactComponent as Icon3OfText } from "../../../assets/icon3OfText.svg";
import { ReactComponent as Icon4OfText } from "../../../assets/icon4OfText.svg";
import { ReactComponent as EyePasswordSlash } from "../../../assets/eyePasswordSlash.svg";
import { ReactComponent as ContactIdentification } from "../../../assets/contactIdentificationIcon.svg";
import { ReactComponent as TextBoxIcon } from "../../../assets/TextBoxIcon.svg";
import { ReactComponent as NumberIcon } from "../../../assets/NumberIcon.svg";
import { ReactComponent as UnitOfMeasurementIcon } from "../../../assets/UnitOfMeasurementIcon.svg";
import { ReactComponent as AmountIcon } from "../../../assets/AmountIcon.svg";
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
import DeleteButton from "../../DeleteButton/DeleteButton";
import { useTranslation } from "react-i18next";
const SortableItem = ({ parameter, 
  index, 
  showEyes, 
  showButtonAdd, 
  setShowEyes, 
  setShowButtonAdd, 
  setShowEye, 
  showEye, 
  handleHidden, 
  addParameterColumn, 
  deleteParameter,
  type, father,
  action,TruncatedText,
  typeIcons,
  isOpen,isHover,
  isGroupDragging = false,
  groupId = null,
  showSubtitlesOnly = false,
  onSubtitleClick = null,
  searchTerm = "",
  parameters = [],
  handleEditParameter = null,
  tableId = null,
  tableData = null,
  addParameter = null,
  setCurrentParameter = null,
  data = null
}) => {
    const {
      attributes,
      listeners,
      setActivatorNodeRef,
      setNodeRef,
      transform,
      transition,

    } = useSortable({ id: parameter.id || parameter._id});

    const [t] = useTranslation("Contacts");
    const [isEditing, setIsEditing] = useState(false);
    const [parameterName, setParameterName] = useState(parameter.name);
    const [parameterSubName, setParameterSubName] = useState(parameter.subName);
    const firstInputRef = useRef(null);
    useEffect(() => {
      if (isEditing && firstInputRef.current) {
        firstInputRef.current.focus();
        // if (firstInputRef.current.select) {
        //   firstInputRef.current.select();
        // }
      }
    }, [ isEditing ]);
    const getAdjacentCodeColumns = () => {
      const currentIndex = parameters.findIndex(p => p.id === parameter.id);
      if (currentIndex === -1) return { hasPreviousCode: false, hasNextCode: false };
      
      const previousColumn = parameters[currentIndex - 1];
      const nextColumn = parameters[currentIndex + 1];
      
      // Si es el último elemento del arreglo, considerar que tiene un "code" por debajo
      const isLastElement = currentIndex === parameters.length - 1;
      
      return {
        hasPreviousCode: previousColumn && previousColumn.hasOwnProperty('code'),
        hasNextCode: (nextColumn && nextColumn.hasOwnProperty('code')) || isLastElement
      };
    };

    const { hasPreviousCode, hasNextCode } = getAdjacentCodeColumns();

    // console.log('hasPreviousCode', hasPreviousCode)
    // console.log('hasNextCode', hasNextCode)

  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      // Ocultar parámetros cuando se está arrastrando un subtítulo
      ...(isGroupDragging && parameter.category && !parameter.code && {
        opacity: 0,
        transform: CSS.Transform.toString(transform) + ' scale(0.95)',
        maxHeight: 0,
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }),
      // Efecto visual para el subtítulo que se está arrastrando
      ...(isGroupDragging && parameter.code && groupId === parameter.code && {
        transform: CSS.Transform.toString(transform) + ' scale(1.05)',
        boxShadow: '0 8px 25px rgba(0, 123, 255, 0.3)',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        border: '2px solid rgba(0, 123, 255, 0.5)',
        borderRadius: '8px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000
      }),
      // Efecto visual para otros subtítulos durante el arrastre grupal
      ...(isGroupDragging && parameter.code && groupId !== parameter.code && {
        transform: CSS.Transform.toString(transform) + ' scale(1.02)',
        backgroundColor: 'rgba(200, 200, 200, 0.1)',
        border: '1px solid rgba(200, 200, 200, 0.3)',
        borderRadius: '6px',
        transition: 'all 0.2s ease'
      }),
      // Solo mostrar subtítulos en modo subtítulos - pero mantener el espacio para el drag
      ...(showSubtitlesOnly && parameter.category && !parameter.code && {
        opacity: 0.3,
        maxHeight: '20px',
        overflow: 'hidden',
        margin: '2px 0',
        padding: '2px 0',
        transition: 'all 0.2s ease'
      }),
      // Efecto visual para subtítulos en modo subtítulos
      ...(showSubtitlesOnly && parameter.code && {
        cursor: 'grab',
        backgroundColor: 'rgba(0, 123, 255, 0.05)',
        border: '1px solid rgba(0, 123, 255, 0.2)',
        borderRadius: '6px',
        transform: CSS.Transform.toString(transform) + ' scale(1.02)',
        transition: 'all 0.2s ease'
      }),
      ...(!showSubtitlesOnly && parameter.category && {
        backgroundColor: 'white',
        padding: '3px 5px',
        // backgroundColor:hasPreviousCode ? 'green' : hasNextCode ? 'red' : 'white',
        paddingTop: hasPreviousCode ? '8px' : '3px',
        paddingBottom: hasNextCode ? '8px' : '3px',
        borderBottomLeftRadius: hasNextCode ? '4px' : 'none',
        borderBottomRightRadius: hasNextCode ? '4px' : 'none',
        borderTopLeftRadius: hasPreviousCode ? '4px' : 'none',
        borderTopRightRadius: hasPreviousCode ? '4px' : 'none',
      }),
      ...(!showSubtitlesOnly && parameter.code && {
        padding: '10px 0px',
      })
    };



    const handleClick = () => {
      console.log('esto es el handle click')
      if (parameter.code && !showSubtitlesOnly) {
        onSubtitleClick(parameter.code);
      }
    };

    // Filtrar por search term
    if (searchTerm && !parameter.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return null;
    }

    const agentItems = [
              { id: "textBox", label: t('textBox'),Icon:TextBoxIcon },
              { id: "number", label: t('number'),Icon:NumberIcon },
              { id: "unitOfMeasurement", label: t('unitOfMeasurement'),Icon:UnitOfMeasurementIcon },
              { id: "amount", label: t('amount'),Icon:AmountIcon },
              { id: "discount", label: t('discount'),Icon:DiscountIcon },
              { id: "percentage", label: t('percentage'),Icon:PercentageIcon },
              { id: "date", label: t('date'),Icon:DateIcon },
              { id: "dateRanges", label: t('dateRanges'),Icon:DateRangesIcon },
              { id: "location", label: t('location'),Icon:LocationIcon },
              { id: "filesMedia", label: t('filesMedia'),Icon:FilesMediaIcon },
              { id: "list", label: t('list'),Icon:listIcon },
              { id: "category", label: t('category'),Icon:CategoryIcon },
              { id: "colorList", label: t('colorList'),Icon:ContactIdentification },
              { id: "tag", label: t('tag'),Icon:TagIcon },
              { id: "status", label: t('status'),Icon:StatusIcon },
              { id: "checklist", label: t('checklist'),Icon:ChecklistIcon },
              { id: "email", label: t('email'),Icon:EmailIcon },
              { id: "phone", label: t('phone'),Icon:PhoneIcon },
              { id: "contact", label: t('contact'),Icon:ContactIcon },
              { id: "asset", label: t('asset'),Icon:AssetIcon },
              { id: "url", label: t('Url'),Icon:UrlIcon },
              { id: "chronometer", label: t('chronometer'),Icon:ChronometerIcon },
              { id: "voiceRecorder", label: t('voiceRecorder'),Icon:VoiceRecorderIcon },
              { id: "language", label: t('language'),Icon:LanguageIcon },
              { id: "formula", label: t('formula'),Icon:FormulaIcon },
              { id: "assessment", label: t('assessment'),Icon:AssessmentIcon },
            ];

        const itemSelected = agentItems.find(item => item.id === parameter.type);

        
      

  if(father !== "homeExplorerTable"){
    return (

      <li
        className={type === "popup" && styles.displayList}
        ref={setNodeRef}
        style={style}
        onClick={handleClick}
        onMouseEnter={() => {
          setShowEyes(index);
          setShowButtonAdd(index);
        }}
        onMouseLeave={() => {
          setShowEyes(null);
          setShowButtonAdd(null);
        }}
      >
        <div className={styles.contentParameterItemContainer}>
        <div
          className={`${styles.infoParameterItem} ${parameter.id === "cat1" ? styles.lessCategoryContainer : type === "popup" ? styles.textAndDragContainer : ""}`}
        >
           {parameter.code && (
          <GrabIcon
            ref={(showSubtitlesOnly && parameter.code) ? setActivatorNodeRef : parameter.hasOwnProperty("category") ? setActivatorNodeRef : null}
            {...((showSubtitlesOnly && parameter.code) ? listeners :  parameter.hasOwnProperty("category") ? listeners : {} )}
            {...((showSubtitlesOnly && parameter.code )? attributes : parameter.hasOwnProperty("category") ? attributes : {})}
            onClick={!showSubtitlesOnly && parameter.code ? handleClick : undefined}
            style={{ 
              cursor: showSubtitlesOnly ? "grab" : "pointer", 
              margin: "0px 10px 0px 2px", 
              outline: "none" 
            }}
          />)}
         

           <div className={styles.textParameter}>
              {itemSelected && itemSelected?.Icon && (
                <div className={styles.iconParameterContainer}>
                <itemSelected.Icon ref={setActivatorNodeRef}
            {...listeners}
            {...attributes} fill={'black'} color={'black'} className={styles.iconParameter} />
                </div>
                )}
             {/* {parameter.name} */}
             <div className={styles.textParameterContainer}>

             {!isEditing ?(
              <span className={styles.nameParameter} style={{fontSize: !(parameter.hasOwnProperty("type") ) && "12px"}}>
             {parameter.hasOwnProperty("type") && parameter?.name?.length >= 21 ? parameter.name.slice(0,20) + "..." :
             !(parameter.hasOwnProperty("type")) && parameter?.name?.length >= 23 ? parameter.name.slice(0,22) + "..." : parameter?.name} 
             </span>) : 
             
             <input ref={firstInputRef} onBlur={(e) => {e.stopPropagation()
              setIsEditing(false)
              handleEditParameter(parameter, parameterName, parameterSubName, tableId)
             }} 
             onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                setIsEditing(false);
                handleEditParameter(parameter, parameterName, parameterSubName, tableId);
              }
            }}
             onClick={(e) => {e.stopPropagation()}} 
             onFocus={(e) => {e.stopPropagation()}} 
             style={{all:"unset", backgroundColor: "white", border: "none", color: "black", 
             fontSize: parameter.hasOwnProperty("type") ?  "10px" : "12px"}} type="text" value={parameterName} onChange={(e) => {
              e.stopPropagation();
              setParameterName(e.target.value)}}/>}
             {parameter.hasOwnProperty("subName") && !isEditing ?
             <span className={styles.subNameParameter}>{ data[parameter.name] ? ( typeof data[parameter.name] === "string" ? data[parameter.name] : "ver variable") : parameter?.subName?.length >= 21 ? parameter.subName.slice(0,20) + "..." : parameter?.subName}</span> 
             : parameter.hasOwnProperty("subName") && isEditing ? 
             
             <input  onBlur={(e) => {e.stopPropagation()
              setIsEditing(false)
              handleEditParameter(parameter, parameterName, parameterSubName, tableId)
             }} 
             onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                setIsEditing(false);
                handleEditParameter(parameter, parameterName, parameterSubName, tableId);
              }
            }}
             style={{all:"unset", backgroundColor: "white", border: "none", color: "#717171", 
              fontSize:"10px"}} type="text" value={parameterSubName} onChange={(e) => {setParameterSubName(e.target.value)}}/>: ""}
             
            </div>
       
            </div>
        </div>  
        <div style={{display: "flex", gap: "5px", alignItems: "center"}}>
        <PencilForPopup
          style={{cursor: "pointer"}}
          onMouseDown={(e) => { e.preventDefault(); }}
          onClick={(e) => {
          e.stopPropagation();
          if(parameter.hasOwnProperty("category")) {
            addParameter();
            setCurrentParameter({...parameter, rowId: data._id});
          } 
          else {
            if (!isEditing) {
              setIsEditing(true);
            } else {
              setIsEditing(false);
              handleEditParameter(parameter, parameterName, parameterSubName, tableId);
            }
          }
        }}/>
        {parameter.hasOwnProperty("hidden") && <span
          className={`${styles.icon} ${
            showEyes === index ? styles.visible : ""
          }`}
          onClick={() => setShowEye(!showEye)}
        >
          {parameter.hasOwnProperty("hidden") &&
            (parameter?.hidden ? (
              <EyePasswordSlash
                onClick={() => handleHidden(false, parameter)}
                className={styles.eye}
              />
            ) : (
              <EyePassword
                onClick={() => handleHidden(true, parameter)}
                className={styles.eye}
              />
            ))}
        </span>}

        {parameter.id !== "cat1" && 
          // showButtonAdd === index &&
          parameter.hasOwnProperty("type") &&
          !parameter.hasOwnProperty("hidden") && (
            <div
              className={styles.addParameterColumn}
              onClick={() => addParameterColumn(parameter.name, parameter.id, parameter.type)}
            >
              +
            </div>
          )}
        <DeleteButton
          action={(e) =>{
            e.stopPropagation()
            deleteParameter(parameter.id)}}

        />
        {parameter.code && <button className={styles.plusCategory}>
          +
          </button>}
        </div>
        </div>
      </li>
    );}
    else if (father == "homeExplorerTable"){
      return (

      <li
      
        ref={setNodeRef}
        style={style}
        onMouseEnter={() => {
        }}
        onMouseLeave={() => {;
        }}
      >
        <div className={styles.menuSections} >
          <GrabIcon
            ref={setActivatorNodeRef}
            {...listeners}
            {...attributes}
            style={{ cursor: "grab", margin: "0 10px", outline: "none", display:isOpen && "none"}}
          />

                    <div
                            key={parameter._id}
                            className={styles.menuItem}
                            onClick={() => {action()}}
                            onMouseEnter={(e) => isHover(e, tableData.name)}
                            onMouseLeave={(e) => isHover(null)}
                        >
                            <div className={`${styles.menuItemIcon} ${styles.iconTable}`} style={{color:tableData.color}}>
                                {typeIcons[tableData.type] || typeIcons['contacts']}
                                 {(parameter.rowCount - 1) > 0 && isOpen &&  (
                                <label>{(parameter.rowCount - 1)}</label>
                            )}
                            </div>
                            { !isOpen && tableData.name && <TruncatedText style={{ width: "100%" }} text={tableData.name} />}
                            {(parameter.rowCount - 1) > 0 && (
                                <label>{(parameter.rowCount - 1)}</label> 
                            )}
                        </div>

        </div>
    

 
      </li>
    );}


  };
  
  export default SortableItem