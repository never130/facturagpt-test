import React, { useState, useRef, useEffect } from "react";
import CustomAutomationsWrapper from "../../../CustomAutomationsWrapper/CustomAutomationsWrapper";
import styles from "./DataToSync.module.css";
import { ReactComponent as GrayChevron } from "../../../../assets/grayChevron.svg";
import { ReactComponent as GreenTable } from "../../../../assets/TableGreen.svg";
import { ReactComponent as WhiteTable } from "../../../../assets/WhiteTable.svg";
import lIcon from "../../../../assets/lIcon.svg";

import { ReactComponent as SearchIcon } from "../../../../assets/searchGray.svg";
import { IoIosArrowDown, IoIosArrowBack } from "react-icons/io";
import CardAutomate from "../CardAutomate/CardAutomate";

import { json as Telematel } from "../../utils/endPoints/Telematel";
import { json as GoogleSheets } from "../../utils/endPoints/GoogleSheets";
import { json as Ftp } from "../../utils/endPoints/Ftp";
import { json as Xml } from "../../utils/endPoints/Xml";
import { json as EsPublico } from "../../utils/endPoints/EsPublicoGestiona";
import { json as AgencyTribut } from "../../utils/endPoints/LeyAntifraude";
import { json as Odoo } from "../../utils/endPoints/Odoo";
import { json as Wolters } from "../../utils/endPoints/Wolters";
import { json as Whatsapp } from "../../utils/endPoints/Whatsapp";
import { json as Holded } from "../../utils/endPoints/Holded";

import { useDispatch, useSelector } from "react-redux";
import {
  setShowEndPointVariables,
  setVariableSelectedToEnpoint,
} from "../../../../../../slices/automateSlices";
import DeleteButton from "../../../DeleteButton/DeleteButton";
import { useTranslation } from "react-i18next";
import { getVariable } from "../../../../../../actions/user";
import Button from "../../../Button/Button";
import SearchIconWithIcon from "../../../SearchIconWithIcon/SearchIconWithIcon";
import useFocusShortcut from "../../../../../../utils/useFocusShortcut";

const endpoints = [
  Telematel,
  GoogleSheets,
  Ftp,
  Xml,
  EsPublico,
  AgencyTribut,
  Odoo,
  Wolters,
  Whatsapp,
  Holded,
];

const DataToSync = ({
  configuration,
  handleConfigurationChange,
  setTypeVariableModal,
  setShowVariableModal,
  type,
}) => {
  const [t] = useTranslation("AutomatesComponent");
  const { variableSelectedToEnpoint } = useSelector((state) => state.automate);

  const [variablesEnpoints, setVariablesEnpoints] = useState([]);
  const [indexInterno, setIndexInterno] = useState(0);
  const [indexSelected, setIndexSelected] = useState(0);
  const [indexAutomate, setIndexAutomate] = useState(0);
  const [indexJson, setIndexJson] = useState(null);
  const [inputSearchEnpoints, setInputSearchEnpoints] = useState("");
  const [showAllEndPoints, setShowAllEndPoints] = useState(false);
  const [showContent, setShowContent] = useState({
    info1: false,
    info2: false,
    info3: false,
    info4: false,
    info5: false,
    info6: false,
    info7: false,
    info8: false,
    info9: false,
  });

  const [showInput, setShowInput] = useState(false);
  const [wasDoubleClicked, setWasDoubleClicked] = useState(false);
  const containerRef = useRef(null);
  const clickTimeout = useRef(null);
  const [variableValue, setVariableValue] = useState('')
  const DOUBLE_CLICK_DELAY = 250;

  const [showAllInfoFormAutomatel, setShowAllInfoFormAutomatel] =
    useState(null);
  const [showSelectorModule, setShowSelectorModule] = useState(false);
  const [moduleSelected, setModuleSelected] = useState("Selecciona un Module");
  const [showDeleteModule, setShowDeleteModule] = useState(false);
  const [showIndexJsonVariable, setShowIndexJsonVariable] = useState({});
  const dispatch = useDispatch();

  const inputSearchEnpointRef = useRef(null);


  const handleClick = () => {
    if (clickTimeout.current !== null) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;

      setShowVariableModal(true);
      setTypeVariableModal('global');
      setShowInput(false);
    } else {
      clickTimeout.current = setTimeout(() => {
        setShowInput(true);
        clickTimeout.current = null;
      }, DOUBLE_CLICK_DELAY);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    if (variableSelectedToEnpoint) {
      setVariablesEnpoints((prev) => {
        const newVariablesEnpoints = JSON.parse(JSON.stringify(prev));
        newVariablesEnpoints[indexAutomate][indexInterno].data[
          indexSelected
        ].nameVariable = variableSelectedToEnpoint;
        newVariablesEnpoints[indexAutomate][indexInterno].data[
          indexSelected
        ].show = true;
        if (indexJson !== null && indexJson !== undefined) {
          newVariablesEnpoints[indexAutomate][indexInterno].data[
            indexSelected
          ].data[indexJson].show = true;
          newVariablesEnpoints[indexAutomate][indexInterno].data[
            indexSelected
          ].data[indexJson].nameVariable = variableSelectedToEnpoint;
        }
        handleConfigurationChange("variablesEnpoints", newVariablesEnpoints);
        return newVariablesEnpoints;
      });
      dispatch(setVariableSelectedToEnpoint(""));
    }
  }, [variableSelectedToEnpoint]);




  useEffect(() => {
    if (
      configuration.variablesEnpoints &&
      JSON.stringify(configuration.variablesEnpoints) !==
      JSON.stringify(variablesEnpoints)
    ) {
      setVariablesEnpoints(configuration.variablesEnpoints);
      setShowAllEndPoints(true);
    } else if (!configuration.variablesEnpoints) {
      setVariablesEnpoints([]);
    }
  }, [type, configuration.variablesEnpoints]);


  useEffect(() => {
    if (
      configuration?.inputSearchEnpoints &&
      JSON.stringify(configuration.inputSearchEnpoints) !==
      JSON.stringify(inputSearchEnpoints)
    ) {
      setInputSearchEnpoints(configuration.inputSearchEnpoints);
    }
  }, [configuration.inputSearchEnpoints]);

  useEffect(() => {
    if (
      configuration?.showContentDataToSync &&
      JSON.stringify(configuration.showContentDataToSync) !==
      JSON.stringify(showContent)
    ) {
      setShowContent(configuration.showContentDataToSync);
    } else if (
      configuration?.showContentDataToSync === null ||
      configuration?.showContentDataToSync === "" ||
      configuration?.showContentDataToSync === undefined
    ) {
      setShowContent({
        info1: false,
        info2: false,
        info3: false,
        info4: false,
        info5: false,
        info6: false,
        info7: false,
        info8: false,
        info9: false,
      });
    }
  }, [configuration.showContentDataToSync]);

  const findTerm = (text, highlight, index) => {
    const truncatedText =
      showAllInfoFormAutomatel === index
        ? text
        : text.length > 120
          ? text.slice(0, 120) + "..."
          : text;
    if (!highlight.trim())
      return (
        <span className={styles.infoContainerSpan}>
          {truncatedText}{" "}
          {text.length > 120 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllInfoFormAutomatel((prev) =>
                  prev === index ? null : index
                );
              }}
              className={styles.buttonShowMore}
            >
              {showAllInfoFormAutomatel === index ? "ver menos" : "ver mas"}
            </button>
          ) : (
            ""
          )}
        </span>
      );

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = truncatedText.split(regex);

    return (
      <span className={styles.infoContainerSpan}>
        {parts.map((part, i) => {
          if (part.toLowerCase() === highlight.toLowerCase()) {
            return (
              <strong style={{ color: "black" }} key={i}>
                {part}
              </strong>
            );
          }
          return (
            <span style={{ fontWeight: "400" }} key={i}>
              {part}
            </span>
          );
        })}
        {text.length > 120 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAllInfoFormAutomatel((prev) =>
                prev === index ? null : index
              );
            }}
            className={styles.buttonShowMore}
          >
            {showAllInfoFormAutomatel === index ? "ver menos" : "ver mas"}
          </button>
        ) : (
          ""
        )}
      </span>
    );
  };
  const variables = useSelector((state) => state.variables.variables);


  useEffect(() => {
    dispatch(getVariable({ type: 'global', search: variableValue }));
  }, [dispatch, type, showInput, variableValue]);


  const searchInputRef = useRef(null);

  useFocusShortcut(searchInputRef, "/");
  const searchInputRefEndpoint = useRef(null);



  return (
    <CustomAutomationsWrapper
      Icon={<WhiteTable />}
      showContent={showContent.info2}
      minWidth={40}
    >
      <div
        className={styles.infoContainerWrapper}
        onClick={() =>
          setShowContent((prev) => {
            handleConfigurationChange("showContentDataToSync", {
              ...prev,
              info2: !prev.info2,
            });
            return { ...prev, info2: !prev.info2 };
          })
        }
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {showContent.info2 && <GreenTable />}
          <div className={styles.infoContainer}>
            <div>{t("dataSegmenter")}</div>
            <span>{t("matchFieldsBetweenSystems")}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

          <GrayChevron
            style={{
              transform: showContent.info2 ? "rotate(180deg)" : "",
              transition: "transform 0.3s ease-in-out",
              fill: '#71717A'
            }}
          />
        </div>
      </div>
      <div
        className={`${styles.contentContainer} ${showContent.info2 ? styles.active : styles.disabled}`}
      >
        <div className={styles.contentContainerWrapper}>
          <div style={{ marginTop: "14px" }}>
            <label htmlFor="endpoints" className={styles.labelInput}>
              {t("selectEndpoint")}
            </label>
            <div>
              <div className={styles.searchContainer}>
                <SearchIconWithIcon
                  ref={searchInputRefEndpoint}
                  searchTerm={inputSearchEnpoints}
                  setSearchTerm={(value) => {
                    if (
                      !configuration.showAllEndPoints ||
                      configuration.variablesEnpoints?.length === 0 ||
                      !configuration.variablesEnpoints
                    ) {
                      const findEndPoints = endpoints.find((endpoint) => {
                        return endpoint[0].type === type;
                      });
                      if (moduleSelected === "Selecciona un Module") {
                        setVariablesEnpoints([findEndPoints]);
                      }
                    }
                    setInputSearchEnpoints(value);
                    handleConfigurationChange(
                      "inputSearchEnpoints",
                      value
                    );
                  }}

                  classNameIconRight={styles.searchContainerL}
                >
                  {endpoints
                    ?.find((endpoint) => {
                      return endpoint[0].type === type;
                    })
                    ?.filter((endpoint) => {
                      return endpoint.module;
                    })?.length > 0 ? (
                    <>
                      <button
                        className={styles.buttonInputSearchEndPoints}
                        onClick={() => {
                          setShowSelectorModule((prev) => !prev);
                        }}
                      >
                        {moduleSelected} <c />
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.buttonInputSearchEndPoints}
                      onClick={() => {
                        setModuleSelected("Selecciona un Module");
                        setInputSearchEnpoints("");
                        if (
                          !configuration.showAllEndPoints ||
                          configuration.variablesEnpoints?.length === 0 ||
                          !configuration.variablesEnpoints
                        ) {
                          const findEndPoints = endpoints.find((endpoint) => {
                            return endpoint[0].type === type;
                          });

                          setVariablesEnpoints([findEndPoints]);
                          setShowAllEndPoints(true);
                        }
                        handleConfigurationChange("showAllEndPoints", true);
                        handleConfigurationChange("inputSearchEnpoints", "");
                      }}
                    >
                      Todos
                    </button>
                  )}
                </SearchIconWithIcon>
              </div>

              <div className={styles.customSelector}>

                {showSelectorModule && (
                  <div className={styles.optionsContainer}>
                    {endpoints
                      ?.find((endpoint) => {
                        return endpoint[0].type === type;
                      })
                      ?.map((endpoint, index) => {
                        return (
                          <React.Fragment key={index}>
                            {endpoint.module ? (
                              <div
                                className={styles.selectorOption}
                                onMouseEnter={() =>
                                  endpoint.module === moduleSelected &&
                                  setShowDeleteModule(true)
                                }
                                onMouseLeave={() =>
                                  endpoint.module === moduleSelected &&
                                  setShowDeleteModule(false)
                                }
                              >
                                <div
                                  onClick={(e) => {
                                    setModuleSelected(endpoint.module);
                                    if (!configuration.showAllEndPoints || configuration.variablesEnpoints?.length === 0 || !configuration.variablesEnpoints) {
                                      const findEndPoints = endpoints.find(
                                        (endpoint) => { return endpoint[0].type === type; }
                                      );
                                      const findEndPointsModule =
                                        findEndPoints.find((point) => {
                                          return (point.module === endpoint.module);
                                        });
                                      setVariablesEnpoints([[findEndPointsModule],]);
                                      setShowSelectorModule(false);
                                    }
                                  }}
                                  className={styles.option}
                                >
                                  {" "}
                                  {endpoint.module}
                                </div>
                                {endpoint.module === moduleSelected && showDeleteModule && (
                                  <div
                                    onClick={() => {
                                      setModuleSelected("Selecciona un Module");
                                      setShowDeleteModule(false);
                                      setShowSelectorModule(false);
                                      setVariablesEnpoints([]);
                                    }}
                                    className={styles.deleteOption}
                                  >
                                    Borrar
                                  </div>
                                )}
                              </div>
                            ) : (
                              ""
                            )}
                          </React.Fragment>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {showAllEndPoints ? (
            <div>

              {variablesEnpoints?.map((Endpoint, automateIndex) => {
                const endpointData = Endpoint?.length > 0 ? Endpoint : [];
                const allEndPoints = endpointData?.map(
                  (endpoint, internoIndex) => {
                    const endpointName = endpoint?.name;
                    const endpointImage = endpoint?.image;

                    if (
                      endpointName.toLowerCase().includes(inputSearchEnpoints.toLowerCase()) ||
                      endpoint.description.toLowerCase().includes(inputSearchEnpoints.toLowerCase())
                    ) {
                      return (
                        <div key={internoIndex}>
                          <div className={styles.cardContainer}>
                            <CardAutomate
                              name={findTerm(endpoint.description, inputSearchEnpoints, internoIndex)}
                              image={endpointImage}
                              nameTitle={
                                <>
                                  {findTerm(endpointName, inputSearchEnpoints)}{" "}
                                  <button className={styles["method" + endpoint.method]} >
                                    {endpoint.method}
                                  </button>
                                </>
                              }
                              customStyles={{
                                fontSize: "12px",
                                borderTopRightRadius: "8px",
                                borderTopLeftRadius: "8px",
                                height: "100%",
                              }}
                              action={() => {
                                setVariablesEnpoints((prev) => {
                                  const updated = JSON.parse(JSON.stringify(prev));
                                  updated[automateIndex][internoIndex].show = !updated[automateIndex][internoIndex].show;
                                  handleConfigurationChange("variablesEnpoints", updated);
                                  return updated;
                                });
                              }}
                            />
                          </div>

                          {variablesEnpoints[automateIndex][internoIndex].show && (
                            <div className={styles.variablesContainer}>
                              {endpoint?.data?.map((variable, varIndex) => {
                                return (
                                  <div className={styles.variableItemContainer} >
                                    <div
                                      key={varIndex}
                                      className={styles.variableItem}
                                      onClick={(e) => {
                                        setShowIndexJsonVariable((prev) => ({ ...prev, [varIndex]: !prev[varIndex], }));
                                      }}
                                    >
                                      {variable.type !== "json" ? (
                                        <input
                                          type="checkbox"
                                          onChange={(e) => {
                                            if (!e.target.checked) {
                                              setVariablesEnpoints(
                                                (prev) => {
                                                  const updated = JSON.parse(JSON.stringify(prev));
                                                  updated[automateIndex][internoIndex].data[varIndex].show = false;
                                                  updated[automateIndex][internoIndex].data[varIndex].nameVariable = "";
                                                  handleConfigurationChange("variablesEnpoints", updated);
                                                  return updated;
                                                }
                                              );
                                            }
                                            setIndexAutomate(automateIndex);
                                            setIndexInterno(internoIndex);
                                            setIndexSelected(varIndex);
                                            setIndexJson(null);
                                            dispatch(
                                              setShowEndPointVariables(
                                                e.target.checked
                                              )
                                            );
                                          }}
                                          checked={variablesEnpoints[automateIndex][internoIndex].data[varIndex].nameVariable}
                                        />
                                      ) : (
                                        <IoIosArrowDown
                                          style={{ paddingLeft: "3px" }}
                                        />
                                      )}
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: "2px",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                          }}
                                        >
                                          <b className={styles.title}>
                                            {findTerm(variable.title, inputSearchEnpoints)}
                                          </b>
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "5px",
                                            }}
                                          >
                                            <label className={styles.typeVariable}>{variable.type}</label>

                                            {
                                              variable.nameVariable && (
                                                <>
                                                  <b className={styles.title}>
                                                    <span>{variable.nameVariable}</span>
                                                    <DeleteButton
                                                      action={() => {
                                                        setVariablesEnpoints(prev => {
                                                          const updated = JSON.parse(JSON.stringify(prev));

                                                          if (updated[automateIndex]?.[internoIndex]?.data?.[varIndex]) {
                                                            updated[automateIndex][internoIndex].data[varIndex].nameVariable = "";
                                                            updated[automateIndex][internoIndex].data[varIndex].show = false;

                                                            if (indexJson !== null && indexJson !== undefined) {
                                                              const innerData = updated[automateIndex][internoIndex].data[varIndex].data?.[indexJson];
                                                              if (innerData) {
                                                                innerData.nameVariable = "";
                                                                innerData.show = false;
                                                              }
                                                            }
                                                          }

                                                          handleConfigurationChange("variablesEnpoints", updated);
                                                          return updated;
                                                        });
                                                      }}
                                                    />
                                                  </b>
                                                </>
                                              )
                                            }

                                          </div>
                                          {variable.required && !variable.nameVariable && (
                                            <div
                                              style={{
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              *
                                            </div>
                                          )}
                                        </div>
                                        <div style={{ fontSize: "12px" }}>
                                          {findTerm(variable.description, inputSearchEnpoints)}
                                        </div>
                                      </div>
                                    </div>
                                    {variable.type === "json" && showIndexJsonVariable[varIndex] && variable.data?.map((item, index) => {

                                      return (
                                        <div key={index} className={styles.type} >
                                          <input
                                            type="checkbox"
                                            onChange={(e) => {

                                              if (!e.target.checked) {
                                                setVariablesEnpoints(
                                                  (prev) => {
                                                    const updated = JSON.parse(JSON.stringify(prev));
                                                    updated[automateIndex][internoIndex].data[varIndex].data[index].show = false;
                                                    updated[automateIndex][internoIndex].data[varIndex].data[index].nameVariable = "";
                                                    handleConfigurationChange("variablesEnpoints", updated);
                                                    return updated;
                                                  }
                                                );
                                              }
                                              setIndexAutomate(automateIndex);
                                              setIndexInterno(internoIndex);
                                              setIndexJson(index);
                                              setIndexSelected(varIndex);
                                              dispatch(setShowEndPointVariables(e.target.checked));
                                            }}
                                            checked={variablesEnpoints[automateIndex][internoIndex].data[varIndex].data[index].nameVariable}
                                          />
                                          <div className={styles.titleDescription} >
                                            <div
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                              }}
                                            >
                                              <div
                                                className={styles.title}
                                                style={{
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                {item.title}
                                              </div>
                                              {variablesEnpoints[automateIndex][internoIndex].data[varIndex].data[index].nameVariable && (
                                                <div className={styles.title} >
                                                  {
                                                    variablesEnpoints[automateIndex][internoIndex].data[varIndex].data[index].nameVariable
                                                  }
                                                  <DeleteButton
                                                    action={() => {
                                                      setVariablesEnpoints(
                                                        (prev) => {
                                                          const updated = JSON.parse(JSON.stringify(prev));
                                                          if (
                                                            updated[automateIndex]?.[internoIndex]?.data?.[varIndex]?.data[index]
                                                          ) {
                                                            updated[automateIndex][internoIndex].data[varIndex].data[index].nameVariable = "";
                                                          }
                                                          handleConfigurationChange(
                                                            "variablesEnpoints",
                                                            updated
                                                          );
                                                          return updated;
                                                        }
                                                      );
                                                    }}
                                                  />
                                                </div>
                                              )}
                                            </div>
                                            <div>{item.description}</div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    {variable.type !== "json" && variable._id && (
                                      <DeleteButton
                                        action={() => {
                                          setVariablesEnpoints((prev) => {
                                            const updated = JSON.parse(JSON.stringify(prev));

                                            const endpointGroup = updated[automateIndex]?.[internoIndex];
                                            if (!endpointGroup || !Array.isArray(endpointGroup.data)) return prev;

                                            endpointGroup.data = endpointGroup.data.filter((v) => v._id !== variable._id);

                                            updated[automateIndex][internoIndex] = endpointGroup;

                                            handleConfigurationChange("variablesEnpoints", updated);

                                            return updated;
                                          });

                                          setIndexJson(null);
                                        }}
                                      />
                                    )}
                                  </div>
                                );
                              })}

                              {
                                endpoint.editable > 0 && (
                                  <div ref={containerRef}>
                                    {showInput ? (
                                      <div className={styles.variableContainer}>

                                        <div className={styles.searchContainer}>
                                          <SearchIconWithIcon
                                            ref={searchInputRef}
                                            searchTerm={variableValue}
                                            setSearchTerm={setVariableValue}

                                            classNameIconRight={styles.searchContainerL}
                                          >
                                            <img
                                              src={lIcon}
                                              alt="filterIcon"
                                              className={styles.searchContainerIcon}
                                            />
                                          </SearchIconWithIcon>
                                        </div>

                                        {variables.data.map((variable) => (
                                          <label key={variable._id} className={styles.variableItem}>
                                            <input
                                              checked={
                                                variablesEnpoints?.[automateIndex]?.[internoIndex]?.data?.some(
                                                  (v) => v._id === variable._id
                                                ) || false
                                              }

                                              type="checkbox"
                                              onChange={() => {
                                                const updatedEndpoints = [...variablesEnpoints];
                                                const endpointGroup = [...updatedEndpoints[automateIndex]];

                                                const targetEndpoint = { ...endpointGroup[internoIndex] };
                                                const existing = targetEndpoint.data.find(v => v.title === variable.title);

                                                if (!existing) {
                                                  targetEndpoint.data = [...targetEndpoint.data, variable];
                                                } else {
                                                  targetEndpoint.data = targetEndpoint.data.filter(v => v.title !== variable.title);
                                                }

                                                endpointGroup[internoIndex] = targetEndpoint;
                                                updatedEndpoints[automateIndex] = endpointGroup;
                                                handleConfigurationChange("variablesEnpoints", updatedEndpoints);
                                                setVariablesEnpoints(updatedEndpoints);

                                              }}
                                            />

                                            <div className={styles.infoVariable}>
                                              <div className={styles.infoVariableTop}>
                                                <p>{variable.title}</p>
                                                <span className={styles.typeVariable}>{variable.type}</span>
                                                {variable.required && (<span className={styles.required}>*</span>)}
                                              </div>
                                              <span>{variable?.description}</span>
                                            </div>

                                          </label>
                                        ))}
                                        <Button type="white" headerStyle={{ width: "100%" }} action={() => {
                                          setShowVariableModal(true);
                                          setTypeVariableModal('global');
                                          setShowInput(false);
                                        }}>
                                          <span>{t('addVariable')}</span>
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button type="white" headerStyle={{ width: "100%" }} action={handleClick}>
                                        <span>{t('addVariable')}</span>
                                      </Button>
                                    )}
                                  </div>
                                )

                              }
                            </div>
                          )}
                        </div>
                      );
                    }
                  }
                );
                return allEndPoints;
              })}
            </div>
          ) : (
            <div>
              {variablesEnpoints?.length > 0 &&
                variablesEnpoints.map((Endpoint, automateIndex) => {
                  const endpointData = Endpoint?.length > 0 && Endpoint;
                  const allEndPoints = endpointData?.map(
                    (endpoint, internoIndex) => {
                      const endpointName = endpoint?.name || `Automate ${automateIndex + 1}`;
                      const endpointImage = endpoint?.image;
                      const key = `automate${automateIndex}`;

                      if (endpointName.toLowerCase().includes(inputSearchEnpoints.toLowerCase()) || endpoint.description.toLowerCase().includes(inputSearchEnpoints.toLowerCase())) {
                        return (
                          <div key={internoIndex}>
                            <div className={styles.cardContainer}>
                              <CardAutomate
                                name={findTerm(endpoint.description, inputSearchEnpoints, automateIndex)}
                                image={endpointImage}
                                nameTitle={
                                  <>
                                    {findTerm(endpointName, inputSearchEnpoints)}{" "}
                                    <button className={styles["method" + endpoint.method]} >
                                      {endpoint.method}
                                    </button>
                                  </>
                                }
                                customStyles={{
                                  fontSize: "12px",
                                  borderTopRightRadius: "8px",
                                  borderTopLeftRadius: "8px",
                                  height: "100%",
                                }}
                                action={() => {
                                  setVariablesEnpoints((prev) => {
                                    const updated = JSON.parse(JSON.stringify(prev));
                                    updated[automateIndex][internoIndex].show = !updated[automateIndex][internoIndex].show;
                                    handleConfigurationChange("variablesEnpoints", updated);
                                    return updated;
                                  });
                                }}
                              />
                            </div>

                            {variablesEnpoints[automateIndex][internoIndex]
                              .show && (
                                <div className={styles.variablesContainer}>
                                  {endpoint?.data?.map(
                                    (variable, varIndex) => {
                                      return (
                                        <div className={styles.variableItemContainer} >
                                          <div
                                            key={varIndex}
                                            className={styles.variableItem}
                                            onClick={(e) => {

                                              setShowIndexJsonVariable(
                                                (prev) => ({
                                                  ...prev,
                                                  [varIndex]: !prev[varIndex],
                                                })
                                              );
                                            }}
                                          >
                                            {variable.type !== "json" ? (
                                              <input
                                                type="checkbox"
                                                onChange={(e) => {

                                                  if (!e.target.checked) {
                                                    setVariablesEnpoints(
                                                      (prev) => {
                                                        const updated = JSON.parse(JSON.stringify(prev));
                                                        updated[automateIndex][internoIndex].data[varIndex].show = false;
                                                        updated[automateIndex][internoIndex].data[varIndex].nameVariable = "";
                                                        handleConfigurationChange(
                                                          "variablesEnpoints",
                                                          updated
                                                        );
                                                        return updated;
                                                      }
                                                    );
                                                  }
                                                  setIndexAutomate(automateIndex);
                                                  setIndexInterno(internoIndex);
                                                  setIndexSelected(varIndex);
                                                  setIndexJson(null);
                                                  dispatch(
                                                    setShowEndPointVariables(
                                                      e.target.checked
                                                    )
                                                  );
                                                }}
                                                checked={variablesEnpoints[automateIndex][internoIndex].data[varIndex].nameVariable}
                                              />
                                            ) : (
                                              <IoIosArrowDown style={{ paddingLeft: "3px" }} />
                                            )}
                                            <div
                                              style={{
                                                display: "flex",
                                                gap: "2px",
                                                flexDirection: "column",
                                              }}
                                            >
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: "5px",
                                                }}
                                              >
                                                <b className={styles.title}>
                                                  {findTerm(variable.title, inputSearchEnpoints)}
                                                </b>
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                  }}
                                                >
                                                  <label>
                                                    {variable.type}
                                                  </label>
                                                  {variable.type !== "json" &&
                                                    variable.nameVariable && (
                                                      <span className={styles.title} >
                                                        {variable.nameVariable}
                                                        <DeleteButton
                                                          action={() => {
                                                            setVariablesEnpoints(
                                                              (prev) => {
                                                                const updated = JSON.parse(JSON.stringify(prev));
                                                                if (
                                                                  updated[automateIndex]?.[internoIndex]?.data?.[varIndex]
                                                                ) {
                                                                  updated[automateIndex][internoIndex].data[varIndex].nameVariable = "";
                                                                }
                                                                handleConfigurationChange("variablesEnpoints", updated);
                                                                return updated;
                                                              }
                                                            );
                                                            setIndexJson(null);
                                                          }}
                                                        />
                                                      </span>
                                                    )}
                                                </div>
                                                {variable.required &&
                                                  !variable.nameVariable && (
                                                    <div
                                                      style={{
                                                        fontSize: "14px",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      *
                                                    </div>
                                                  )}
                                              </div>
                                              <div className={styles.infoDescription} >
                                                {findTerm(variable.description, inputSearchEnpoints)}
                                              </div>
                                            </div>
                                          </div>
                                          {variable.type === "json" &&
                                            showIndexJsonVariable[varIndex] &&
                                            variable.data?.map(
                                              (item, index) => {
                                                return (
                                                  <div
                                                    key={index}
                                                    className={styles.type}
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      onChange={(e) => {
                                                        if (!e.target.checked) {
                                                          setVariablesEnpoints(
                                                            (prev) => {
                                                              const updated = JSON.parse(JSON.stringify(prev));
                                                              updated[automateIndex][internoIndex].data[varIndex].data[index].show = false;
                                                              updated[automateIndex][internoIndex].data[varIndex].data[index].nameVariable = "";
                                                              handleConfigurationChange("variablesEnpoints", updated);
                                                              return updated;
                                                            }
                                                          );
                                                        }
                                                        setIndexAutomate(automateIndex);
                                                        setIndexInterno(internoIndex);
                                                        setIndexJson(index);
                                                        setIndexSelected(varIndex);
                                                        dispatch(
                                                          setShowEndPointVariables(
                                                            e.target.checked
                                                          )
                                                        );
                                                      }}
                                                      checked={variablesEnpoints[automateIndex][internoIndex].data[varIndex].data[index].nameVariable}
                                                    />
                                                    <div className={styles.titleDescription} >
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: "4px",
                                                        }}
                                                      >
                                                        <div className={styles.title} style={{ fontWeight: "bold", }} >
                                                          {item.title}
                                                        </div>
                                                        {variablesEnpoints[automateIndex][internoIndex].data[varIndex].data[index].nameVariable && (
                                                          <div className={styles.title} >
                                                            {
                                                              variablesEnpoints[automateIndex][internoIndex].data[varIndex].data[index].nameVariable
                                                            }
                                                            <DeleteButton
                                                              action={() => {
                                                                setVariablesEnpoints(
                                                                  (prev) => {
                                                                    const updated = JSON.parse(JSON.stringify(prev));
                                                                    if (updated[automateIndex]?.[internoIndex]?.data?.[varIndex].data[index].nameVariable) {
                                                                      updated[automateIndex][internoIndex].data[varIndex].data[index].nameVariable = "";
                                                                    }
                                                                    handleConfigurationChange("variablesEnpoints", updated);
                                                                    return updated;
                                                                  }
                                                                );
                                                              }}
                                                            />
                                                          </div>
                                                        )}
                                                      </div>
                                                      <div className={styles.infoDescription}>
                                                        {item.description}
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            )}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                          </div>
                        );
                      }
                    }
                  );
                  return allEndPoints;
                })}
            </div>
          )}
        </div>
      </div>
    </CustomAutomationsWrapper>
  )

};

export default DataToSync;
