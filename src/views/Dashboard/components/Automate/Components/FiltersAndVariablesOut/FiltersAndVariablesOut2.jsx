import React, { useEffect, useRef, useState } from "react";
import styles from "./FiltersAndVariablesOut2.module.css";
import { ReactComponent as WindMagic } from "../../../../assets/WindMagic.svg";
import { ReactComponent as Editor } from "../../../../assets/editor.svg";
import { ReactComponent as Retry } from "../../../../assets/Retryvetor.svg";
import { ReactComponent as DragDrop } from "../../../../assets/DragAndDrop3.svg";
import { ReactComponent as IconCamera } from "../../../../assets/camera-solid.svg";
import { useDispatch, useSelector } from "react-redux";
import { createLabelTitleDescription } from "../../../../../../actions/automate";
import { setLabelTitleDescription } from "../../../../../../slices/automateSlices";
import { useTranslation } from "react-i18next";
import {formatAgoDate} from "../../../../../../utils/agoDateUtil";


import { setNotification } from "@src/slices/notificationsSlices";
import { filterImageGpt } from "@src/actions/automate";
import Button from "../../../Button/Button";
import DeleteButton from "../../../DeleteButton/DeleteButton";
import FiltersLabelOptionsTemplate from "../FiltersLabelOptionsTemplate/FiltersLabelOptionsTemplate";

const FiltersAndVariablesOut2 = ({
  configuration,
  handleConfigurationChange,
  from,
  formAutomateContainerRef,
  type,
  buttonValue = "Generar",
  setShowVariableModal,
  setTypeVariableModal,
  selectedAutomates,
  setSelectedAutomates
}) => {
  const [t] = useTranslation(["AutomatesComponent","Preview"]);
  const { user } = useSelector((state) => state.user)
  const [fileKeywords, setFileKeywords] = useState([]);
  const [labels, setLabels] = useState([]);
  const [editIndex, setEditIndex] = useState(0);
  const [editConditionIndex, setEditConditionIndex] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [symbolSelected, setSymbolSelected] = useState("$");
  const [showSelectCurrencyPopup, setShowSelectCurrencyPopup] = useState(false);
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [inputFileKeywords, setInputFileKeywords] = useState("");
  const [inputFileEmails, setInputFileEmails] = useState("");
  const [errorInputFileEmails, setErrorInputFileEmails] = useState("");
  const [fileArrayEmails, setFileArrayEmails] = useState([]);
  const [bodyArrayKeywords, setBodyArrayKeywords] = useState([]);
  const [inputBodyKeywords, setInputBodyKeywords] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [indexLabelToTitleDescription, setIndexLabelToTitleDescription] =
    useState(null);
  const [titleDescription, setTitleDescription] = useState({
    title: "",
    description: "",
    value: "",
  });
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

  const dispatch = useDispatch();
  const { tokenGPT } = useSelector((state) => state.user.user);
  const automate = useSelector((state) => state.automate);
  const MAX_LENGTH = 300;
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const [promptIncorrect, setPromptIncorrect] = useState(false);

  const setPromptIncorrectFunction = () => {
    if (
      labels[indexLabelToTitleDescription]?.conditions[
        labels[0]?.conditions?.length - 1
      ]?.description === "Prompt enviado incorrecto"
    ) {
      setPromptIncorrect(true);
      labels[indexLabelToTitleDescription]?.conditions.pop();
      setTimeout(() => {
        setPromptIncorrect(false);
      }, 1000);
    }
  };




  const handleChange = (e, readyValue) => {

    let value;
    readyValue
      ? (value = e.slice(0, MAX_LENGTH))
      : (value = e.target.value.slice(0, MAX_LENGTH));
    setText(value);
  };

  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  useEffect(() => {
    if (
      configuration?.showContentSelectInfoToProcess &&
      JSON.stringify(configuration?.showContentSelectInfoToProcess) !==
        JSON.stringify(showContent)
    ) {
      setShowContent(configuration?.showContentSelectInfoToProcess);
    } else if (
      configuration?.showContentSelectInfoToProcess === null ||
      configuration?.showContentSelectInfoToProcess === "" ||
      configuration?.showContentSelectInfoToProcess === undefined
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
  }, [configuration?.showContentSelectInfoToProcess]);

  useEffect(() => {
    if (automate.variables?.title) {
      const updatedLabels = labels?.map((filtro, i) => {
        const findVariable = filtro.conditions.find((variable) => {
          return variable.title === automate.variables.title;
        });
        if (!findVariable) {
          return {
            ...filtro,
            conditions: [...filtro.conditions, automate.variables],
          };
        }
        return filtro;
      });
      setLabels(updatedLabels);
    }
  }, [automate.variables]);

  const addFilter = (index, type) => {
    setLabels((prev) => {
      const newLabels = prev.map((label, idx) => {
        if (idx === index) {
          return {
            ...label,
            filters: [
              ...label.filters,
              {
                id: Date.now(),
                conditionCurrency: {
                  title: "",
                  description: "",
                },
                conditionOperator: "",
                conditionValue: "",
                type,
              },
            ],
          };
        }
        return label;
      });

      return newLabels;
    });
  };

  const createNewFilter = () => {
    const labels = Array.isArray(configuration.labels) ? configuration.labels : [];

    const updatedLabels = [
      ...labels,
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
    ];

    handleConfigurationChange("labels", updatedLabels);
  };


  const deleteLabel = (index) => {
    const updatedLabels = labels.filter((_, i) => i !== index);
    setLabels(updatedLabels);
    handleConfigurationChange("labels", updatedLabels);
    setEditIndex(null);
  };

  const editLabel = (index) => {
    setEditIndex(index);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleUploadFile = async (location) => {
    try {
      setIsLoading(true);

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".pdf,.jpg,.jpeg,.png";

      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        dispatch(
          setNotification({
            id: "is-loading",
            type: "folder",
            text: "notification #1",
          })
        );



        const response = await dispatch(
          filterImageGpt({
            file: file,
          })
        );

        dispatch(
          setNotification({
            id: "is-completed",
            type: "folder",
            text: "notification #1",
          })
        );
      };

      fileInput.click();
    } catch (error) {
      console.error("Error in handleUploadFile:", error);
    }
  };

  useEffect(() => {
    if (titleDescription.title) {
      const updatedLabels = JSON.parse(JSON.stringify(labels));


      updatedLabels[indexLabelToTitleDescription].conditions = [
        ...updatedLabels[indexLabelToTitleDescription].conditions,
        titleDescription,
      ];

      updatedLabels[indexLabelToTitleDescription].conditionCurrency =
        updatedLabels[indexLabelToTitleDescription].conditions[0];
      setLabels(updatedLabels);
      setTitleDescription({
        title: "",
        description: "",
        value: "",
      });
      setInputPrompt("");
      setEditConditionIndex(null);
    }
  }, [titleDescription]);

  useEffect(() => {
    if (automate.labelTitleDescription.title) {
      setTitleDescription(automate.labelTitleDescription);
      dispatch(setLabelTitleDescription());
    }
    if (automate.labelTitleDescription.length > 0) {

      const updatedLabels = JSON.parse(JSON.stringify(labels));


      if (updatedLabels[indexLabelToTitleDescription]) {
        updatedLabels[indexLabelToTitleDescription].conditions = [
          ...updatedLabels[indexLabelToTitleDescription].conditions,
          ...automate.labelTitleDescription,
        ];

        updatedLabels[indexLabelToTitleDescription].conditionCurrency =
          updatedLabels[indexLabelToTitleDescription].conditions[0];
        setLabels(updatedLabels);
        setTitleDescription({
          title: "",
          description: "",
          value: "",
        });
        setInputPrompt("");
        setEditConditionIndex(null);
      }
    }
  }, [automate.labelTitleDescription]);

  useEffect(() => {
    if (configuration?.selectedFileTypes?.length == 6) {
      handleConfigurationChange("allowAllFileTypes", true);
    } else {
      handleConfigurationChange("allowAllFileTypes", false);
    }
  }, [configuration?.selectedFileTypes]);

  useEffect(() => {
    if (configuration?.totalAmount?.currency !== selectedCurrency) {
      setSelectedCurrency(configuration?.totalAmount?.currency);
    } else {
      setSelectedCurrency("USD");
    }
  }, [configuration?.totalAmount?.currency]);

  useEffect(() => {
    if (
      configuration?.labels &&
      JSON.stringify(configuration?.labels) !== JSON.stringify(labels)
    ) {
      setLabels(configuration?.labels);
    }
  }, [configuration?.labels]);

  useEffect(() => {
    if (
      configuration?.filesArrayKeyWords &&
      JSON.stringify(configuration?.filesArrayKeyWords) !==
        JSON.stringify(fileKeywords)
    ) {
      setFileKeywords(configuration?.filesArrayKeyWords);
    } else if (
      configuration?.filesArrayKeyWords?.length === 0 ||
      !configuration?.filesArrayKeyWords
    ) {
      setFileKeywords([]);
    }
  }, [configuration?.filesArrayKeyWords]);

  useEffect(() => {
    if (
      configuration?.filesArrayEmails &&
      JSON.stringify(configuration?.filesArrayEmails) !==
        JSON.stringify(inputFileEmails)
    ) {
      setFileArrayEmails(configuration?.filesArrayEmails);
    } else {
      setFileArrayEmails([]);
    }
  }, [configuration?.filesArrayEmails]);

  useEffect(() => {
    if (
      configuration?.bodyArrayKeyWords &&
      JSON.stringify(configuration?.bodyArrayKeyWords) !==
        JSON.stringify(bodyArrayKeywords)
    ) {
      setBodyArrayKeywords(configuration?.bodyArrayKeyWords);
    } else if (
      configuration?.bodyArrayKeyWords?.length === 0 ||
      !configuration?.bodyArrayKeyWords
    ) {
      setBodyArrayKeywords([]);
    }
  }, [configuration?.bodyArrayKeyWords]);


  const handleTotalAmountFilter = (e, minMax) => {
    const minMaxAmount = {
      ...configuration.totalAmount,
      [minMax]: e.target.value,
    };
    handleConfigurationChange("totalAmount", minMaxAmount);
  };

  const handleSetShowContent = (infoNumber) => {
    setShowContent({ ...showContent, [infoNumber]: !showContent[infoNumber] });
    handleConfigurationChange("showContentSelectInfoToProcess", {
      ...showContent,
      [infoNumber]: !showContent[infoNumber],
    });
  };

  const updateFilterProperty = (
    labelIndex,
    filterIndex,
    propertyName,
    value
  ) => {
    if (propertyName === "conditionCurrency") {
      const updatedLabels = [...labels];
      const updatedFilters = [...updatedLabels[labelIndex].filters];
      updatedFilters[filterIndex] = {
        ...updatedFilters[filterIndex],
        [propertyName]: {
          ...updatedFilters[filterIndex][propertyName],
          title: value,
        },
      };
      updatedLabels[labelIndex] = {
        ...updatedLabels[labelIndex],
        filters: updatedFilters,
      };
      setLabels(updatedLabels);
    } else {
      const updatedLabels = [...labels];
      const updatedFilters = [...updatedLabels[labelIndex].filters];
      updatedFilters[filterIndex] = {
        ...updatedFilters[filterIndex],
        [propertyName]: value,
      };
      updatedLabels[labelIndex] = {
        ...updatedLabels[labelIndex],
        filters: updatedFilters,
      };
      setLabels(updatedLabels);
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

  const handleDragEnd = (e) => {
    e.target.classList.remove(styles.dragging);
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetIndex) return;

    const updatedLabels = [...labels];
    const [reorderedItem] = updatedLabels.splice(draggedItem, 1);
    updatedLabels.splice(targetIndex, 0, reorderedItem);

    setLabels(updatedLabels);
    setDraggedItem(null);
  };

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

  const handleDateChange = (dateString = 1746125310828) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInSeconds = Math.floor((now - date) / 1000);

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    const diffInHours = Math.floor(diffInMinutes / 60);

    const diffInDays = Math.floor(diffInHours / 24);

    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInSeconds < 60) {
      return "Hace un momento";
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? "s" : ""}`;
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours !== 1 ? "s" : ""}`;
    } else if (diffInDays < 30) {
      return `Hace ${diffInDays} día${diffInDays !== 1 ? "s" : ""}`;
    } else if (diffInMonths < 12) {
      return `Hace ${diffInMonths} mes${diffInMonths !== 1 ? "es" : ""}`;
    } else {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  };
  return (
    <>
      <div className={styles.contentInput}>
        {labels?.map((label, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`${draggedItem === index ? styles.beingDragged : ""}`}
          >
            <div
              className={
                editIndex === null || editIndex !== index
                  ? styles.titleContentInput
                  : styles.titleContentInputFromRulesFilter
              }
            >
              <div
                className={`${
                  editIndex === null || editIndex !== index
                    ? styles.labelName
                    : styles.labelNameFromRulesFilter
                } ${(() => {
                  const conditions = labels[index].conditions || [];
                  const validConditions = conditions.filter(
                    (c) => c.title && c.title.trim() !== ""
                  );
                  return validConditions.length > 0 ? styles.hasTooltip : "";
                })()}`}
                {...(() => {
                  const conditions = labels[index].conditions || [];

                  const validConditions = conditions.filter(
                    (c) => c.title && c.title.trim() !== ""
                  );
                  if (validConditions.length === 0) return {}; 

                  const titles = validConditions
                    .slice(0, 4)
                    .map((c) =>
                      c.title.length > 10
                        ? c.title.slice(0, 10) + "..."
                        : c.title
                    );
                  const extraCount = validConditions.length - 4;
                  return {
                    "data-tooltip":
                      extraCount > 0
                        ? `${titles.join("\n")}\n+${extraCount} ${t(
                            "moreVariables",
                            {
                              count: extraCount,
                            }
                          )}`
                        : titles.join("\n"),
                  };
                })()}
                style={{ display: "flex", alignItems: "center" }}
              >
                {editIndex === null || editIndex !== index ? (
                  <DragDrop />
                ) : null}
                <input
                  type="text"
                  placeholder={t("filterName")}
                  value={label.name}
                  onChange={(e) => {
                    const updatedLabels = [...labels];
                    updatedLabels[index] = {
                      ...updatedLabels[index],
                      name: e.target.value,
                    };
                    setLabels(updatedLabels);
                  }}
                  disabled={editIndex !== index}
                />
              </div>
              {label.updateDate && editIndex === null && (
                <div>
                  {formatAgoDate({dateString: label.updateDate,t})}
                </div>
              )}
              {(editIndex === null || editIndex !== index) && (
                <div className={styles.optionsContentInput}>
                  <Button
                    type="button"
                    action={() => {
                      editLabel(index);
                    }}
                  >
                    {editIndex === index ? t("save") : <Editor />}
                  </Button>
                  <DeleteButton action={() => deleteLabel(index)} />
                </div>
              )}
            </div>
            {editIndex === index && (
              <div className={styles.labelOptions}>
                <div className={styles.wrapper}>
                  <textarea
                    ref={textareaRef}
                    type="text"
                    value={text}
                    onChange={handleChange}
                    maxLength={MAX_LENGTH}
                    className={`${styles.descriptionInput} ${styles.textarea}`}
                    style={{
                      display: showDescription ? "block" : "none",
                    }}
                    placeholder={t("addDescription")}
                    onBlur={() => setShowDescription(false)}
                    
                  />
                  <div
                    className={styles.counter}
                    style={{
                      display: showDescription ? "block" : "none",
                    }}
                  >
                    {text && text.length}/{MAX_LENGTH}
                  </div>
                </div>
                {user?.tokenGPT ? (
<>

<div className={styles.conditionsContainer}>
                  <div className={styles.conditions}>
                    {label.conditions.map((condition, i) => {
                      if (
                        condition.title === "" &&
                        editConditionIndex === null
                      ) {
                        const updatedLabels = [...labels];
                        updatedLabels[index].conditions.splice(i, 1);
                        setLabels(updatedLabels);
                        return null;
                      }
                      if (
                        condition.description === "Prompt enviado incorrecto"
                      ) {
                        setPromptIncorrectFunction();
                        return null;
                      }
                      return (
                        <div key={i} className={styles.condition}>
                          {editIndex === index && editConditionIndex === i ? (
                            <textarea
                              key={i}
                              className={styles.conditionInput}
                              type="text"
                              value={condition.title}
                              onChange={(e) => {
                                setLabels((prevLabels) => {
                                  const updatedLabels = prevLabels.map(
                                    (label, idx) => {
                                      if (idx === index) {
                                        return {
                                          ...label,
                                          conditions: label.conditions.map(
                                            (condition, conditionIndex) => {
                                              if (conditionIndex === i) {
                                                return {
                                                  ...condition,
                                                  title: e.target.value,
                                                }; 
                                              }
                                              return condition;
                                            }
                                          ),
                                        };
                                      }
                                      return label;
                                    }
                                  );

                                  return updatedLabels;
                                });
                              }}
                              onBlur={() => setEditConditionIndex(null)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === "Escape") {
                                  setEditConditionIndex(null);
                                }
                              }}
                            />
                          ) : (
                            <>
                              <span
                                onClick={() => {
                                  setEditConditionIndex(i);
                                  setShowDescription(true);
                                  handleChange(
                                    labels[index].conditions[i].description,
                                    true
                                  );
                                }}
                              >
                                {condition.title}
                              </span>
                              <DeleteButton
                                action={() => {
                                  const updatedLabels = [...labels];
                                  const newConditions = [
                                    ...updatedLabels[index].conditions,
                                  ];
                                  newConditions.splice(i, 1);
                                  updatedLabels[index] = {
                                    ...updatedLabels[index],
                                    conditions: newConditions,
                                  };
                                  setLabels(updatedLabels);
                                }}
                              />
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    placeholder={t("typePromptIdentifyVariables")}
                    onChange={(e) => {
                      setInputPrompt(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (buttonValue === "Detectar variables") {
                          const updatedLabels = labels?.map((label, i) => {
                            if (i === index) {
                              return {
                                ...label,
                                conditions: [
                                  ...label.conditions,
                                  {
                                    description: "",
                                    title: inputPrompt,
                                  },
                                ],
                              };
                            }
                            return label;
                          });
                          setLabels(updatedLabels);
                          setEditConditionIndex(null);
                          setInputPrompt("");
                        } else {
                          setIndexLabelToTitleDescription(index);
                          dispatch(
                            createLabelTitleDescription({
                              prompt: inputPrompt,
                              token: tokenGPT,
                            })
                          );
                        }
                      }
                    }}
                    value={inputPrompt}
                  />

                  {inputPrompt.split(" ").length >= 3 &&
                  inputPrompt.split(" ")[2] !== "" ? (
                    <div className={styles.buttonsAddFilter}>
                      <Button
                        action={async () => {
                          if (buttonValue === "Detectar variables") {
                            const updatedLabels = labels?.map((label, i) => {
                              if (i === index) {
                                return {
                                  ...label,
                                  conditions: [
                                    ...label.conditions,
                                    {
                                      description: "",
                                      title: inputPrompt,
                                    },
                                  ],
                                };
                              }
                              return label;
                            });
                            setLabels(updatedLabels);
                            setEditConditionIndex(null);
                            setInputPrompt("");
                          } else {
                            setIndexLabelToTitleDescription(index);
                            dispatch(
                              createLabelTitleDescription({
                                prompt: inputPrompt,
                                token: tokenGPT,
                              })
                            );
                          }
                        }}
                        headerStyle={{
                          height: "40px",
                          padding: "13px 11px",
                          width: "110px",
                        }}
                      >
                        {editConditionIndex == null ? (
                          <>
                            {automate.loading ? (
                              <>
                                <span className={styles.loaderGenerar}></span>
                              </>
                            ) : (
                              <>
                                {buttonValue} <WindMagic />
                              </>
                            )}
                          </>
                        ) : (
                          t("save")
                        )}
                      </Button>
                      <button
                        className={styles.buttonRetry}
                        onClick={() => {
                          const updatedLabels = [...labels];
                          updatedLabels[index].newCondition = {
                            title: "",
                            description: "",
                          };
                          setLabels(updatedLabels);
                        }}
                      >
                        <Retry /> {t("retry")}
                      </button>
                    </div>
                  ) : (
                    <div className={styles.buttonsCameraContainer}>
                      <div
                        onClick={(e) => {
                          handleUploadFile(e);
                          setIndexLabelToTitleDescription(index);
                        }}
                      >
                        <IconCamera />
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.filtersLabelOptions}>
                  {promptIncorrect && (
                    <div
                      style={{ margin: "-5% 0% 0% 40%", position: "absolute" }}
                    >
                      <span>{t("IncorrectPromptSent")}</span>
                    </div>
                  )}
                  {label.filters.map((filter, filterIndex) => (
                    <React.Fragment key={`${filter.id}-${filterIndex}`}>
                      {filter.type !== "Condition" ? (
                        <div className={styles.changeTypeContainerButton}>
                          <button
                            className={`${styles.buttonAddFilter} ${filter.type == "AND" && styles.typeFilterBtn}`}
                            onClick={() => {
                              const updatedLabels = [...labels];
                              const updatedFilters = [
                                ...updatedLabels[index].filters,
                              ];
                              updatedFilters[filterIndex] = {
                                ...updatedFilters[filterIndex],
                                type: "AND",
                              };
                              updatedLabels[index] = {
                                ...updatedLabels[index],
                                filters: updatedFilters,
                              };
                              setLabels(updatedLabels);
                            }}
                          >
                            AND
                          </button>
                          <button
                            className={`${styles.buttonAddFilter} ${filter.type == "OR" && styles.typeFilterBtn}`}
                            onClick={() => {
                              const updatedLabels = [...labels];
                              const updatedFilters = [
                                ...updatedLabels[index].filters,
                              ];
                              updatedFilters[filterIndex] = {
                                ...updatedFilters[filterIndex],
                                type: "OR",
                              };
                              updatedLabels[index] = {
                                ...updatedLabels[index],
                                filters: updatedFilters,
                              };
                              setLabels(updatedLabels);
                            }}
                          >
                            OR
                          </button>
                        </div>
                      ) : (
                        <p></p>
                      )}
                      <FiltersLabelOptionsTemplate
                        key={filter.id}
                        configuration={configuration}
                        filterIndex={filterIndex}
                        index={index}
                        labels={labels}
                        handleConfigurationChange={handleConfigurationChange}
                        conditionCurrency={filter.conditionCurrency.title || ""}
                        setShowVariableModal={setShowVariableModal}
                        setTypeVariableModal={setTypeVariableModal}
                        setSelectedAutomates={setSelectedAutomates}
                        selectedAutomates={selectedAutomates}
                        setConditionCurrency={(value) =>
                          updateFilterProperty(
                            index,
                            filterIndex,
                            "conditionCurrency",
                            value
                          )
                        }
                        conditionOperator={filter.conditionOperator || ""}
                        setConditionOperator={(value) =>
                          updateFilterProperty(
                            index,
                            filterIndex,
                            "conditionOperator",
                            value
                          )
                        }
                        conditionValue={filter.conditionValue || ""}
                        setConditionValue={(value) =>
                          updateFilterProperty(
                            index,
                            filterIndex,
                            "conditionValue",
                            value
                          )
                        }
                        text={filter.type}
                        optionsFirst={getFilterOptions(label)}
                        optionsSecond={"carrusel"}
                        formAutomateContainerRef={formAutomateContainerRef}
                        placeholder1={
                          getFilterOptions(label)[0] !==
                          "No hay opciones disponibles"
                            ? t("selectAnOption")
                            : t("filtersNeededBeAdded")
                        }
                      />
                    </React.Fragment>
                  ))}
                  <div className={styles.buttonsAddFilter}>
                    <button
                      onClick={() => addFilter(editIndex, "AND")}
                      className={styles.buttonAddFilter}
                    >
                      {t("addCondition")}
                    </button>
                    <button
                      onClick={() => {
                        const updateLabels = [...labels];
                        updateLabels[editIndex].updateDate = new Date();
                        handleConfigurationChange("labels", updateLabels);
                        editLabel(null);
                      }}
                      className={styles.buttonAplyFilter}
                    >
                      {t("applyFilter")}
                    </button>
                  </div>
                </div>
                </>
                ) : (
                  <Button type="white">{t('addAValidToken')}</Button>
                )}

              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          createNewFilter();
        }}
        className={styles.buttonsTypeConditionAbsolute}
      >
        {t("add")}
      </button>
    </>
  );
};

export default FiltersAndVariablesOut2;
