import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";


import { deleteAuth, deleteAutomation, getUserDevices } from "../../../../actions/automate";
import {
  setDeleteAuthData,
  setDeleteAuthDrive,
  setSelectedEmailConnection,
} from "../../../../slices/automateSlices";
import { AutomateDataComponent } from "../../../Dashboard/components/Automate/utils/automatesJson";
import {ReactComponent as CheckDropdown} from "../../assets/checkCustomDropdown.svg";
import english_flag from "../../assets/english_flag.svg";
import spanish_flag from "../../assets/spain_flag.svg";
import CardAutomate from "../Automate/Components/CardAutomate/CardAutomate";
import Deletebutton from "../DeleteButton/DeleteButton";
import styles from "./CustomDropdown.module.css";
import { ReactComponent as TableLockClose } from "../../assets/tableLockClose.svg";
import { setShowModal } from "../../../../slices/userSlices";

const CustomDropdown = ({
  editable = true,
  options = [],
  selectedOption,
  setSelectedOption,
  hasObject,
  emailsDropdown,
  height = "35px",
  borderRadius = "4px",
  placeholder,
  textStyles = {
    fontWeight: 500,
    color: "var(--_3d3c42-color)",
    marginLeft: "6px",
    userSelect: "none",
  },
  multioption,
  customStyles = {},
  customStylesOptions = {},
  stateStripe,
  biggerWidth,
  acceptButton = false,
  contentTelematel,
  customOptions,
  CustomDropdownOptionStyles,
  AIModels = false,
  type,
  typeContent,
  configuration,
  handleConfigurationChange,
  deleteSelectedEmail,
  formAutomateContainerRef,
  fromHeader,
  selectedColor,
  setSelectedColor,
  backgroundColor,
  setIcon,
  father,
  fnUpDateDoc,
  generalStyleFilterSort,
  generalDropdownHeader,
  arrowColorCustom,
  arrowSizeCustom,
  translate,
  setTableSelectedColor,
  tableSelectedColor,
  initialColor,
  typeIcons = {},
  currentColor,
  setCurrentColor,
  initialTablesColorMapArray
}) => {
  const [t] = useTranslation(["Preview","AutomatesComponent"]);
  const data = AutomateDataComponent();
  const dropdownRef = useRef(null);
  const selectorRef = useRef(null);
  const popupRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const [markRender, setMarkRender] = useState(false);
  const [selectedAutomations, setSelectedAutomations] = useState([]);
  const [pagination, setPagination] = useState(false)



  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user?.user?.id);

  const addFilterPath = (nuevoFiltro) => {
    if(father != "tables"){
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('limit', nuevoFiltro);

    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    }, { replace: true });
  }
  }

  if(father != "tables"){
  useEffect(() => {
    if (location.search) {
      let path = location.search.slice(1,)
      if (path.includes("&")) {
        path = path.split("&").filter(filter => {
          let type = filter.split("=").slice(0, 1)
          if (type == "limit") return true
          else return false
        })
        const [type, limi] = path.join("").split("=")
        if (limi && limi != selectedOption) {
          setTimeout(() => {
            addFilterPath(limi)
          }, 150)
          setSelectedOption(limi)
        }
      } else {
        if (path.split("=")[0] == "limit") {
          const [type, limi] = path.split("=")
          if (limi && limi != selectedOption) {
            setTimeout(() => {
              addFilterPath(limi)
            }, 150)
            setSelectedOption(limi)
          }
        }
      }
    }
  }, [location.search])
  }

  const handleToggle = (e) => {
    if (editable) {
      e.stopPropagation();
      setIsOpen((prev) => !prev);
    }
  };

  const handleOptionClick = (option, index) => {

    if (type == "pagination") {
      addFilterPath(option)
    }

    fnUpDateDoc && fnUpDateDoc(index)

    if (fromHeader && option.email) {
      setSelectedOption(option);
      setIsOpen(false);

    } else {
      setSelectedOption(option);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (placeholder === t("selectOneMoreFlows")) {
      const telematel = data.find((ele) => ele.type === placeholder);
      if (telematel) {
        setMarkRender(telematel);
      }
    }
    if (type === "pagination") { setPagination(true) }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const colorMap = {
    [t("Paid")]: "#009F7A",
    [t("pending")]: "#FF9D00",
    [t("defaulted")]: "#FF5500",
    [t("due")]: "#C5221F",
    [t("voided")]: "#8A0300",
    [t('draft')]:"#4F5660"
  };
  const tablesColorMap = {
    [t("#0000ff")]: "#0000ff",
    [t("#10a37f")]: "#10a37f",
    [t("#F6851b")]: "#F6851b",
    [t("#000000")]: "#000000",
    [t("#d4af37")]: "#d4af37",
  };

 

  const [tablesColorMapArray, setTablesColorMapArray] = useState(initialTablesColorMapArray || [])
  useEffect(() => {
    if (
      configuration?.automateSelected &&
      JSON.stringify(configuration?.automateSelected) !==
      JSON.stringify(selectedAutomations)
    ) {
      setSelectedAutomations(configuration?.automateSelected);
    }
  }, [configuration?.automateSelected]);

  let content = [];

  if (customOptions) {
    content = options.map((automate, index) => {
      return data
        .filter((ele) => ele.type === automate.type)
        .map((ele) => (
          <>
            <CardAutomate
              fullContent={true}
              type={type}
              typeContent={typeContent}
              key={`${automate.id}-${ele.id}`}
              name={ele?.automateName}
              nameTitle={automate.inputValue || t("automationName")}
              image={ele.image}
              automationData={automate}
              isBorders={true}
              last={
                index === data.length - 1 &&
                ele.id ===
                data.filter((e) => e.type === automate.type).slice(-1)[0]?.id
              }
              contentTelematel={contentTelematel || "contentTelematel"}
              id={ele.id}
              prueba="elementoPrueba"
            />
          </>
        ));
    });
  }

  const [popupPosition, setPopupPosition] = useState("bottom");

  const updatePopupPosition = () => {

    if (father === 'automate') setPopupPosition("top");
    if (
      isOpen &&
      selectorRef.current &&
      popupRef.current &&
      formAutomateContainerRef?.current
    ) {
      const selectorRect = selectorRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      const parentRect =
        formAutomateContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const spaceBelow = Math.min(
        windowHeight - selectorRect.bottom,
        parentRect.bottom - selectorRect.bottom
      );
      const spaceAbove = Math.min(
        selectorRect.top,
        parentRect.bottom - parentRect.top
      );
      if (father === 'automate') setPopupPosition("top");
      else if (spaceBelow >= popupRect.height) {
        setPopupPosition("bottom");
      } else if (spaceAbove >= popupRect.height) {
        setPopupPosition("top");
      } else {
        setPopupPosition("bottom");
      }
    }
  };
  useEffect(() => {
    if (isOpen) {
      updatePopupPosition();

      const handleResize = () => updatePopupPosition();
      const handleScroll = () => updatePopupPosition();

      window.addEventListener("resize", handleResize);

      if (formAutomateContainerRef?.current) {
        formAutomateContainerRef.current.addEventListener(
          "scroll",
          handleScroll
        );
      }
      return () => {
        window.removeEventListener("resize", handleResize);

        if (formAutomateContainerRef?.current) {
          formAutomateContainerRef.current.removeEventListener(
            "scroll",
            handleScroll
          );
        }
      };
    }
  }, [isOpen, formAutomateContainerRef]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={pagination ? `${styles.dropdownContainer} ` : `${styles.dropdownContainer}`}
      style={father === 'automate' && pagination ? { width: "auto", flex: "none" } : father === 'automate' ? { width: "auto", flex: "none" } : father == "ChatToken" ? { width: "auto", flex: "none", margin: "5px" } : {}}
      ref={dropdownRef}
    >
      <div
        id="selectorRef"
        style={{
          height,
          borderRadius,
          background: backgroundColor || stateStripe && "transparent",
          minWidth: pagination ? "30px" : "100px",
          padding: pagination ? "0px 6px 0px 0px" : "0px 12px",
          ...generalStyleFilterSort,
          // width: father == "tablesType" && isOpen ? "150px" : father == "tablesType" && !isOpen ? "10px" : ""
        }}
        className={`${emailsDropdown ? styles.emailsFilterSort : styles.filterSort} ${!editable && styles.disabledBtn} ${customStyles}`}
        onClick={(e) => {
          e.stopPropagation();
          if (options.length === 0) return;
          handleToggle(e);
        }}
        ref={selectorRef}
        onBlur={() => setIsOpen(false)}
      >
        <div
          style={{
            ...textStyles,
            color: stateStripe ? selectedColor :  textStyles.colorHeader,
            ...generalDropdownHeader
          }}
          className={styles.dropdownHeader}
        >
          {Array.isArray(selectedOption) && selectedOption.length > 0 ? (
            selectedOption.join(", ")
          ) : Array.isArray(selectedOption) && selectedOption.length === 0 ? (
            placeholder || t("selectAnOption")
          ) : selectedOption == "es" ? (
            <>
              <img src={spanish_flag} />
              Español
            </>
          ) : selectedOption == "en" ? (
            <>
              <img src={english_flag} />
              Inglés
            </>
          ) : (
            (selectedAutomations.length > 0 &&
              selectedAutomations.map((ele, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "white",
                      color: "#000000",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      border: "1px solid rgb(196, 196, 196)",
                    }}
                  >
                    {ele.inputValue || t("noName")}
                  </div>
                );
              })) ||
              translate ? t(selectedOption) :  father == "docHome" ? <span style={{color:initialColor}}> {selectedOption}</span> :
              father == 'tablesType'? <div className={styles.iconContainerWhite} style={{backgroundColor:currentColor}} > 
              {typeIcons[selectedOption]}
               </div>
              
              :  selectedOption ||
            (content.length <= 0 && customOptions && t("noAutomations")) ||
            (emailsDropdown && options.length <= 0 && t("notAddedYet")) ||
            father == "tableStats" ? <span style={{display: "flex", gap: "5px", fontSize: "14px", alignItems: "center"}}>{placeholder} {placeholder == "new Table" ? <TableLockClose  style={{width:"12px", height:"12px"}} /> : ""}</span> : placeholder ||
            t("selectAnOption")
          )}
        </div>
        {fromHeader && selectedOption ? (
          <button
            className={styles.deleteEmailFormHeader}
            onClick={() => {
              setSelectedOption(null);
              handleConfigurationChange(deleteSelectedEmail || "selectedEmailConnection", null);
            }}
          >
            X
          </button>
        ) : fromHeader && options.length === 0 ? null : (
          editable && (
            <FaChevronDown
              size={arrowSizeCustom ? arrowSizeCustom : 16}
              width={16}
              height={16}
              fill={arrowColorCustom ? arrowColorCustom : selectedColor ? selectedColor : "" }
              className={styles.chevronIcon}
              color={stateStripe ? selectedColor : generalDropdownHeader ? "black" : arrowColorCustom ? arrowColorCustom : "#71717A"}
              style={{
                transform: isOpen ? "rotate(180deg)" : "",
                transition: "transform 0.3s ease-in-out",
                marginLeft: "0",
                height: typeContent === "popup" && "12px",
                width: typeContent === "popup" && "12px",


              }}
            />
          )
        )}
        {acceptButton && (
          <div className={styles.acceptButton}>{t("acept")}</div>
        )}
      </div>
      {isOpen && editable && (
        <div
          className={
            contentTelematel || customOptions
              ? styles.dropdownOptionsTelematel
              : styles.dropdownOptions
          }
          style={{
            width: biggerWidth ? "150%" : pagination ? "auto" : father == "tablesType" ? "175px" : "",
            top: popupPosition === "bottom" ? "100%" : "auto",
            bottom: popupPosition === "top" ? "100%" : "auto",
            ...customStylesOptions
          }}
          ref={popupRef}
          id="popupRef"
        >
          {multioption
            ? options.map((category, index) => (

              <div key={index}>
                <div className={styles.subcategoryTitle}>
                  {category.title}
                </div>
                {category.items.map((item, subIndex) => (
                  <div

                    key={subIndex}
                    style={{
                      color: textStyles.color,
                      fontWeight: textStyles.fontWeight,
                    }}
                    className={`${styles.dropdownOption} `}
                    onClick={() => {
                      setSelectedOption && handleOptionClick(item.value);
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            ))
            : JSON.stringify(options) ===
              JSON.stringify(["XML", "JSON", "PDF", "PNG", "JPG", "HTML"])
              ? options.map((option, index) => (
                <div
                  key={index}
                  style={{
                    fontWeight: textStyles.fontWeight,
                    color:
                      option == "HTML"
                        ? "var(--_8e8eb7-color)"
                        : textStyles.color,
                  }}
                  className={
                    option == "HTML"
                      ? styles.dropdownOptionHover
                      : styles.dropdownOption
                  }
                  onClick={() => {
                    if (option !== "HTML") {
                      setSelectedOption &&
                        handleOptionClick(hasObject ? option.value : option);
                      setSelectedColor && setSelectedColor(colorMap[option]);
                      setTableSelectedColor && setTableSelectedColor(tablesColorMap[option])
                      setIcon && setIcon(index)
                    }
                  }}
                >
                  {hasObject ? (
                    option.label
                  ) : option == "es" ? (
                    <>
                      <img src={spanish_flag} />
                      Español
                    </>
                  ) : option == "en" ? (
                    <>
                      <img src={english_flag} />
                      Inglés
                    </>
                  ) : (
                    <>
                      {option}
                    </>
                  )}
                  {emailsDropdown && (
                    <Deletebutton action={() => console.log("eliminando")} />
                  )}
                </div>
              ))
              : customOptions
                ? content.map((option, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        fontWeight: textStyles.fontWeight,
                        color: stateStripe
                          ? colorMap[option] : tableSelectedColor ? tablesColorMap[option]
                          : textStyles.color,
                        backgroundColor: "var(--white-background)",
                      }}
                      className={styles.dropdownOption}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOption &&
                          handleOptionClick(
                            hasObject ? option.value : option
                          );
                        setSelectedColor && setSelectedColor(colorMap[option]);
                        setTableSelectedColor && setTableSelectedColor(tablesColorMap[option])
                        setIcon && setIcon(index)
                      }}
                    >
                      <input
                        type="checkbox"
                        style={{ marginLeft: "10px" }}
                        checked={selectedAutomations.find(
                          (ele) => ele.id === options[index].id
                        )}
                        onChange={(e) => {
                          e.stopPropagation();
                          setSelectedAutomations((prev) => {
                            const findAutomate = selectedAutomations.find(
                              (ele) => ele.id === options[index].id
                            );
                            if (findAutomate) {
                              const newSelectedAutomations = prev.filter(
                                (automationId) =>
                                  automationId.id !== options[index].id
                              );
                              handleConfigurationChange(
                                "automateSelected",
                                newSelectedAutomations
                              );
                              return newSelectedAutomations;
                            } else {
                              const newSelectedAutomations = [
                                ...prev,
                                options[index],
                              ];
                              handleConfigurationChange(
                                "automateSelected",
                                newSelectedAutomations
                              );
                              return newSelectedAutomations;
                            }
                          });

                        }}
                      />
                      {option}
                      {emailsDropdown && (
                        <Deletebutton
                          action={() =>
                            dispatch(
                              deleteAutomation({
                                automationId: options[index].id,
                                userId: userId,
                              })
                            )
                          }
                        />
                      )}
                    </div>
                  );
                })
                : options.map((option, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        fontWeight: textStyles.fontWeight,
                        color: stateStripe
                          ? colorMap[option] : tableSelectedColor ? tablesColorMap[option]
                          : textStyles.color,
                        backgroundColor: pagination && option == selectedOption ? "var(--e4fff9-background)" : "",
                        width: pagination && "auto",
                        padding: currentColor && currentColor == tablesColorMapArray[index] ? "6px" : "8px",
                        paddingLeft: currentColor && currentColor == tablesColorMapArray[index] ? "6px" : father == "tablesType" ?  "10px" : "8px"
                      }}
                      className={`${styles.dropdownOption} ${CustomDropdownOptionStyles} 
                        `}
                      onClick={() => {
                        if (!AIModels) {
                          
                            setSelectedOption && father == "tablesType" ? 
                            handleOptionClick(
                             {color: tablesColorMapArray[index], type: option}, index
                            ): setSelectedOption ?
                            handleOptionClick(
                              hasObject ? option.value : father == "tablesType" ? tablesColorMapArray[index] : option, index
                            ): null
                          setSelectedColor && setSelectedColor(colorMap[option]);
                            setTableSelectedColor && setTableSelectedColor(tablesColorMap[option])
                          setIcon && setIcon(index)
                          setCurrentColor && setCurrentColor(tablesColorMapArray[index])
                        } else {
                          setSelectedOption && AIModels && father == "tablesType" ?
                            handleOptionClick(
                             {color: tablesColorMapArray[index], type: option}, index
                            ): setSelectedOption && AIModels ?
                            handleOptionClick(
                              hasObject ? option.value : father == "tablesType" ? tablesColorMapArray[index] : option, index
                            ): null
                          setSelectedColor && setSelectedColor(colorMap[option]);
                          setTableSelectedColor && setTableSelectedColor(tablesColorMap[option])
                          setIcon && setIcon(index)
                          setCurrentColor && setCurrentColor(tablesColorMapArray[index])
                        }
                      }}
                    >
                      {hasObject ? (
                        <>
                          {option.icon && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {option.icon}
                              <span>{option.label}</span>
                            </div>
                          )}
                          {!option.icon && option.label}
                        </>
                      ) : option == "es" ? (
                        <>
                          <img src={spanish_flag} />
                          Español
                        </>
                      ) : option == "en" ? (
                        <>
                          <img src={english_flag} />
                          Inglés
                        </>
                      ) : option.email && fromHeader ? (
                        option.email
                      ) : father == "ChatToken" ? (
                        <>
                          <option.icon />
                          {option.text.slice(0, 15)}
                        </>
                      ) : (
                        <>
                          {translate ? t(option) : 
                          father == "tablesType" ? <div style={{display:"flex", gap:"5px",    alignItems: "center",
                            background: currentColor == tablesColorMapArray[index] ? "white" : "transparent",
                            borderRadius: "4px", padding:"2px 8px",
                            }}> 
                            <div className={ (option == "docs" || option == "assets" || option == "contacts")  && styles.iconContainer}>
                            {typeIcons[option]}
                            </div>
                            <div style={{backgroundColor: currentColor == tablesColorMapArray[index] ? "#f4f4f4" : "transparent", gap:"5px",
                               display:"flex", alignItems:"center", padding:"1px", borderRadius:"4px"}} > 
                           
                            
                            <div style={{background: tablesColorMapArray[index],
    padding: '5px',
    height: '5px',
    width: '5px',
    borderRadius: "100%"}}></div> 
    
    <input type="text" value={tablesColorMapArray[index]} 
    onChange={(e)=>setTablesColorMapArray(prev=>{
      const newArray = [...prev]
      newArray[index] = e.target.value
      return newArray
    })}
    onClick={(e)=>e.stopPropagation()}
    onKeyDown={(e)=>{
      if(e.key == "Enter"){
        e.stopPropagation()
      setSelectedOption &&
      handleOptionClick({color: tablesColorMapArray[index], type: option}, index
      );
      setCurrentColor && setCurrentColor(tablesColorMapArray[index])
      }
    }
  }
  onBlur={(e)=>{
    e.stopPropagation()
    setSelectedOption &&
    handleOptionClick(
      {color: tablesColorMapArray[index], type: option}, index
    );
    setCurrentColor && setCurrentColor(tablesColorMapArray[index])
  }}
     style={{width:"80px", border:"none", background: "#f4f4f4",
      borderRadius: "4px"}}/></div>
       {currentColor == tablesColorMapArray[index] &&  <CheckDropdown style={{width:"12px", height:"12px"}} />}
        </div> 
     

     : tableSelectedColor ? <div style={{display:"flex", gap:"5px"}}> 
     <div style={{background: tablesColorMap[option],
      padding: '5px',
      height: '5px',
      width: '5px',
      borderRadius: "100%"}}></div> 
      <span style={{color:"71717a"}}> {option}</span>  </div>

     : option}
                        </>
                      )}
                      {emailsDropdown && (
                        <Deletebutton
                          action={(e) => {
                            e.stopPropagation();
                            console.log('delete',option)
                            dispatch(setShowModal({
                              modal: 'deleteChats',
                              type: 'automation',
                              variant: 'confirm',
                              // automation: option,
                              // typeAutomate: type,
                              action: async () => {
                               await dispatch(deleteAuth(option._id || option.id));
                                type === "Gmail" &&
                               await dispatch(setDeleteAuthData(option._id));
                                type === "Google Drive" &&
                                  await dispatch(setDeleteAuthDrive(option.id));
                                await dispatch(setSelectedEmailConnection(""));
                                await handleConfigurationChange(deleteSelectedEmail || "selectedEmailConnection", null);
                                setIsOpen(false);
                                type === "WhatsApp" &&
                                  await dispatch(getUserDevices(userId));
                                console.log('se esta eliminando desde el dropdown')
                              }
                            }))
                          }}
                        />
                      )}
                    </div>
                  );
                })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
