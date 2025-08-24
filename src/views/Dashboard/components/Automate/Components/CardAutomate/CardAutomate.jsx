import React, { useEffect, useRef, useState } from "react";
import styles from "./cardAutomate.module.css";
import CircleDeleteSVG from "../../svgs/CircleDeleteSVG";
import { ReactComponent as PencilEdit } from "../../../../assets/pencilEdit.svg";
import { useDispatch, useSelector } from "react-redux";
import { setAutomateSelected } from "../../../../../../slices/automateSlices";
import { useTranslation } from "react-i18next";
import { formatAgoDate } from "../../../../../../utils/agoDateUtil";
import { useLocation, useNavigate } from "react-router-dom";
import OptionsSwitchComponent from "../../../OptionsSwichComponent/OptionsSwitchComponent";
import { ReactComponent as ThreeVerticalPoints } from '../../../DashboardComponents/Main/assets/threeVerticalPoints.svg'
import { setRoleAutomateSlice, setSelectedAutomationDataSlice, setTypeContentAutomateSlice, setShowModal, setSelectedAutomateToDeleteSlice, setIsEditingAutomation } from "../../../../../../slices/userSlices";
import OptionsPopup from "../../../OptionsPopup/OptionsPopup";

const CardAutomate = ({
  name,
  image,
  available = true,
  typeContent,
  type,
  fullContent,
  isActive,
  onCardClick,
  last,
  fromPanel,
  automationData,
  nameTitle,
  contentTelematel,
  id,
  labelsNames,
  actionsVariables,
  customStyles,
  action,
  fromWhere,
  searchTerm,
  description,
  rol,
  setRoleAutomate,
  index,
  showDeletePopup = () => { },
  setShowDeletePopup,
  setSelectedAutomateToDelete,
  close,
  data_contain_styles = {},
  setHideAutomate,
  loadingTime: _loadingTime = null,
  pencilUniqueClickeable,
  selectAutomate,
  handleShowContentAutomate,
  showDeleteButton = true,
  editAutomate,
  allowDoubleClick = false,
  canSetEditingAutomation = false
}) => {
  const [t] = useTranslation("Preview");

  const dispatch = useDispatch();

  const [variables, setVariables] = useState([]);
  const { automateSelected } = useSelector((state) => state.automate);
  const [iconSkeleton, setIconSkeleton] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()
  const [isChecked, setIsChecked] = useState(false)

  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0)

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    switch (_loadingTime) {
      case "Default":
        setLoadingTime(150)
        break;
      case "15 Minutes":
        setLoadingTime(150)
        break;
      case "30 Minutes":
        setLoadingTime(300)
        break;
      case "1 Hour":
        setLoadingTime(600)
        break;
      case "6 Hours":
        setLoadingTime(3600)
        break;
      case "12 Hours":
        setLoadingTime(7200)
      default:
        break;
    }
  }, [_loadingTime])


  useEffect(() => {
    if (loadingTime > 0) {
      setCurrentTime(loadingTime);
      setIsLoading(true);

      const interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime <= 1) {
            return loadingTime;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsLoading(false);
      setCurrentTime(0);
    }
  }, [loadingTime]);

  const addFilterPath = (nuevoFiltro) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('filter');
  }

  useEffect(() => {
    if (labelsNames) {
      const filtros = [];

      labelsNames.forEach((filtro) => {
        filtro.conditions.forEach((variable) => {
          filtros.push(variable);
        });
      });
      setVariables(filtros);
    }
  }, [labelsNames]);

  const carouselRef = useRef(null);

  useEffect(() => {
    const handleWheelScroll = (event) => {
      if (carouselRef.current) {
        event.preventDefault();
        carouselRef.current.scrollLeft += event.deltaY > 0 ? 50 : -50;
      }
    };

    const currentRef = carouselRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleWheelScroll, {
        passive: false,
      });
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleWheelScroll);
      }
    };
  }, []);

  const findTerm = (text, highlight) => {
    if (!highlight.trim()) return <span style={{ fontWeight: "400" }}>{text}</span>;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return (
      <span style={{ fontWeight: "400" }}>
        {parts.map((part, i) => {
          if (part.toLowerCase() === highlight.toLowerCase()) {
            return (
              <strong style={{ color: "black" }} key={i}>
                {part}
              </strong>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };


  const popupButtonRef = useRef([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  useEffect(() => {
    if (!selectedRowIndex) return;

    const onWheel = (e) => {
      setSelectedRowIndex(null);

      if (dynamicTableRef.current) {
        dynamicTableRef.current.scrollBy({
          top: e.deltaY,
          behavior: 'auto',
        });
      }
    };

    document.addEventListener('wheel', onWheel, {
      passive: true,
      capture: true,
    });
    return () =>
      document.removeEventListener('wheel', onWheel, {
        capture: true,
      });
  }, [selectedRowIndex]);

  const handleActions = (e, rowIndex, contact) => {
    e.stopPropagation();
    setSelectedRowIndex(selectedRowIndex === rowIndex ? null : rowIndex);
  };

  // Función para manejar clic simple y doble clic
  const handleCardClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Establecer que NO se está editando por defecto (clic simple)
    // Solo si se permite ejecutar setIsEditingAutomation
    if (canSetEditingAutomation) {
      dispatch(setIsEditingAutomation('chat'));
    }
    
    const automateWithLabels = {
      ...automateSelected,
      labels: [
        {
          name: "",
          conditions: [
            {
              title: "",
              description: "",
            },
          ],
          newCondition: {
            title: "",
            description: "",
          },
          filters: [
            {
              id: Date.now(),
              conditionCurrency: {
                title: "",
                description: "",
              },
              conditionOperator: "CONTAINS",
              conditionValue: "",
              type: "Condition",
            },
          ],
        },
      ],
    };

    if (selectAutomate) {
      selectAutomate(automationData)
      return
    }
    console.log('type',type)
    setRoleAutomate && setRoleAutomate(rol)
    dispatch(setRoleAutomateSlice(rol))

    onCardClick && onCardClick(id)
    if (fromPanel) {
      available && typeContent ? typeContent(type, automateWithLabels) : handleShowContentAutomate(type, automateWithLabels)
      if (automationData.id && window.location.search) {

        addFilterPath()
        setTimeout(() => {

          window.history.pushState(
            {},
            "",
            `${window.location.pathname}?automation=${automationData.id}`
          );
        }, 300)
      } else {
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}`
        );

      }
    } else {

      if (!labelsNames && available) {
        typeContent ? typeContent(type, automationData) :
          handleShowContentAutomate(type, automationData)
      } else {
        action && action();
      }

      if (fromWhere === "selectedAutomate") {
        dispatch(setAutomateSelected(automationData));
        addFilterPath()

        setTimeout(() => {

          window.history.pushState(
            {},
            "",
            `${window.location.pathname}?automation=${automationData.id}`
          );
        }, 300)
      }
    }
  };

  // Función para manejar doble clic
  const handleCardDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Establecer que SÍ se está editando (doble clic)
    // Solo si se permite ejecutar setIsEditingAutomation
    if (canSetEditingAutomation) {
      dispatch(setIsEditingAutomation('setting'));
    }
    
    const automateWithLabels = {
      ...automateSelected,
      labels: [
        {
          name: "",
          conditions: [
            {
              title: "",
              description: "",
            },
          ],
          newCondition: {
            title: "",
            description: "",
          },
          filters: [
            {
              id: Date.now(),
              conditionCurrency: {
                title: "",
                description: "",
              },
              conditionOperator: "CONTAINS",
              conditionValue: "",
              type: "Condition",
            },
          ],
        },
      ],
    };

    if (selectAutomate) {
      selectAutomate(automationData)
      return
    }

    setRoleAutomate && setRoleAutomate(rol)
    dispatch(setRoleAutomateSlice(rol))

    onCardClick && onCardClick(id)
    if (fromPanel) {
      available && typeContent ? typeContent(type, automateWithLabels) : handleShowContentAutomate(type, automateWithLabels)
      if (automationData.id && window.location.search) {

        addFilterPath()
        setTimeout(() => {

          window.history.pushState(
            {},
            "",
            `${window.location.pathname}?automation=${automationData.id}`
          );
        }, 300)
      } else {
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}`
        );

      }
    } else {

      if (!labelsNames && available) {
        typeContent ? typeContent(type, automationData) :
          handleShowContentAutomate(type, automationData)
      } else {
        action && action();
      }

      if (fromWhere === "selectedAutomate") {
        dispatch(setAutomateSelected(automationData));
        addFilterPath()

        setTimeout(() => {

          window.history.pushState(
            {},
            "",
            `${window.location.pathname}?automation=${automationData.id}`
          );
        }, 300)
      }
    }
  };


  return (
    <React.Fragment key={id}>
      <div
        onClick={handleCardClick}
        {...(allowDoubleClick && { onDoubleClick: handleCardDoubleClick })}
        className={`${contentTelematel === "contentTelematel" ? styles.contentTelematel : styles.content} 
        ${fromPanel && styles.content_panel} 
        ${isActive ? styles.content_active : ""}
        ${!available ? styles.content_disabled : ""}
        `}
        style={{
          borderBottom: !last && !fromPanel && "1px solid #e2f4f0",
          cursor: labelsNames && "default",
          ...customStyles,
        }}
      >
        <div className={styles.data_contain} style={data_contain_styles}>
          <div className={`${styles.icon} ${_loadingTime !== null ? styles.panelAutomate : ''} ${contentTelematel && `${styles.boxShadow}`}`}>
            {isLoading && (
              <div className={styles.progressContainer}>
                <svg className={styles.progressSvg} viewBox="0 0 36 36">
                  <path
                    className={styles.progressBackground}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={styles.progressBar}
                    strokeDasharray={`${(currentTime / loadingTime) * 100}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className={styles.timerText}>{formatTime(currentTime)}</div>
              </div>
            )}
            <img
              className={styles.image}
              src={image}
              alt="logo"
              onLoad={() => setIconSkeleton(true)}
              style={contentTelematel ? { width: "34px", height: "34px", border:"1px solid var(--f0-border)", borderRadius:"100%" }: { width: "34px", height: "34px", border:"1px solid var(--f0-border)", borderRadius:"100%"}}
            />
          </div>
          <div className={styles.title}>
            {nameTitle ? (
              <div
                style={{
                  fontSize: "14px",
                  margin: "0px",
                  ...customStyles,
                  color: searchTerm ? "gray" : "#222222",
                }}
              >
                {searchTerm ? findTerm(nameTitle, searchTerm) : nameTitle}{" "}

              </div>
            ) : fullContent ? (
              <div style={{
                fontSize: "14px",
                margin: "0px",
                ...customStyles,
                color: "#222222",
              }}>
                {t("noTitleIn")} {automationData?.type}{" "}

              </div>
            ) : null}

            {labelsNames ? (
              <div className={styles.labelsContainer} ref={carouselRef}>
                {variables.map((variable) => {
                  return (
                    <button
                      className={styles.buttonLabel}
                      onClick={(e) => {
                        e.stopPropagation();
                        actionsVariables && actionsVariables(variable);
                      }}
                    >
                      <span>{variable.title}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p
                style={{
                  marginBottom: !fromPanel && "4px",
                  marginTop: nameTitle && "4px",
                  ...customStyles,
                  fontWeight: searchTerm ? "300" : "400",
                  margin: "4px 0px",
                  fontSize: description ? "12px" : "13px",
                  color: "#717171"
                }}
                className={styles.automate_name}
              >
                {searchTerm ? findTerm(name, searchTerm) : name}
              </p>
            )}

            {description && (
              <div style={{ fontSize: "10px" }}>{description}</div>
            )}
          </div>
        </div>
        {fullContent && (
          <div className={styles.buttons_contains}>
            <div className={styles.redContainer}>
              <button style={{ all: "unset" }}>
                234
              </button>
            </div>
            <div className={styles.greenContainer}>
              <button style={{ all: "unset" }}>
                234
              </button>
            </div>


            <OptionsSwitchComponent blackBg={true}
              isChecked={isChecked} setIsChecked={setIsChecked} />

            <div className={styles.edit} onClick={(e) => e.stopPropagation()}>
              <div
                ref={(el) => (popupButtonRef.current[index] = el)}
                onClick={(e) => {
                  e.stopPropagation()
                  // Establecer que SÍ se está editando
                  // dispatch(setIsEditingAutomation(true));
                  // editAutomate && editAutomate(automationData)
                  handleActions(e, index)
                }}
                className={styles.dotsOptions}
              >
                <ThreeVerticalPoints />
              </div>
            </div>
          </div>
        )}

      </div>
      {selectedRowIndex === index && (
        <div className={styles.optionsPopupContainer} >
          <OptionsPopup
            style={{
              position: "fixed",
              top:
                popupButtonRef.current[index].getBoundingClientRect().top +
                popupButtonRef.current[index].offsetHeight,
              left: popupButtonRef.current[index].getBoundingClientRect().left +
                popupButtonRef.current[index].offsetWidth - 175,
            }}
            close={() => {
              setSelectedRowIndex(null);
            }}
            options={[
              {
                label: t("edit"),
                onClick: (e) => {
                  e.stopPropagation();
                  // Establecer que SÍ se está editando
                  dispatch(setIsEditingAutomation('setting'));
                  if (setRoleAutomate) setRoleAutomate(rol)
                  else dispatch(setRoleAutomateSlice(rol))
                  typeContent ? typeContent(automationData.type, automationData, true) :
                    handleShowContentAutomate(automationData.type, automationData, true)
                  setSelectedRowIndex(null);
                },
              },
              {
                label: t("delete"),
                onClick: (e) => {
                  e.stopPropagation();
                  dispatch(setSelectedAutomateToDeleteSlice(automationData))
                  dispatch(setShowModal("deleteAutomate"))
                  setSelectedRowIndex(null);
                },
              },
            ]}
          />
        </div>
      )}
    </React.Fragment>
  );
};

export default CardAutomate;
