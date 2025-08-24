import React, { useEffect, useRef, useState } from "react";
import styles from "./FiltersAndVariablesOut.module.css";

import { ReactComponent as WindMagic } from "../../../../assets/WindMagic.svg";
import { ReactComponent as Editor } from "../../../../assets/editor.svg";
import { ReactComponent as Retry } from "../../../../assets/Retryvetor.svg";
import { ReactComponent as DragDrop } from "../../../../assets/DragAndDrop3.svg";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../Button/Button";
import DeleteButton from "../../../DeleteButton/DeleteButton";
import FiltersLabelOptionsTemplate from "../FiltersLabelOptionsTemplate/FiltersLabelOptionsTemplate";
import { createLabelTitleDescription } from "../../../../../../actions/automate";
import { setAllVariablesFromEnPointUse } from "../../../../../../slices/automateSlices";
import { useTranslation } from "react-i18next";

const FiltersAndVariablesOut = ({
  configuration,
  handleConfigurationChange,
  formAutomateContainerRef,
  type,
  setShowVariableModal,
  setTypeVariableModal
}) => {
  const [t] = useTranslation("AutomatesComponent");

  const [fileKeywords, setFileKeywords] = useState([]);
  const [labels, setLabels] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editConditionIndex, setEditConditionIndex] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [inputFileEmails, setInputFileEmails] = useState("");
  const [bodyArrayKeywords, setBodyArrayKeywords] = useState([]);
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
  const automate = useSelector((state) => state.automate);

  useEffect(() => {
    if (configuration?.labels?.length === 0) {
      setLabels([]);
    }
  }, [type]);

  useEffect(() => {
    if (
      configuration?.showContentSelectInfoToProcess &&
      JSON.stringify(configuration?.showContentSelectInfoToProcess) !==
        JSON.stringify(showContent)
    ) {
      setShowContent(configuration?.showContentSelectInfoToProcess);
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
    setLabels(updatedLabels);
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

  useEffect(() => {
    if (titleDescription.title) {
      const updatedLabels = [...labels];

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
    }
  }, [configuration?.filesArrayKeyWords]);

  useEffect(() => {
    if (
      configuration?.filesArrayEmails &&
      JSON.stringify(configuration?.filesArrayEmails) !==
        JSON.stringify(inputFileEmails)
    ) {
      setFileArrayEmails(configuration?.filesArrayEmails);
    }
  }, [configuration?.filesArrayEmails]);

  useEffect(() => {
    if (
      configuration?.bodyArrayKeyWords &&
      JSON.stringify(configuration?.bodyArrayKeyWords) !==
        JSON.stringify(bodyArrayKeywords)
    ) {
      setBodyArrayKeywords(configuration?.bodyArrayKeyWords);
    }
  }, [configuration?.bodyArrayKeyWords]);


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
                className={
                  editIndex === null || editIndex !== index
                    ? styles.labelName
                    : styles.labelNameFromRulesFilter
                }
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
                <div>{handleDateChange(label.updateDate)}</div>
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
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.descriptionInput}
                  style={{
                    display: showDescription ? "block" : "none",
                  }}
                  placeholder={t("addDescription")}
                  onBlur={() => setShowDescription(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const updatedLabels = labels.map((label, idx) => {
                        if (idx === index) {
                          return {
                            ...label,
                            conditions: label.conditions.map(
                              (condition, conditionIdx) => {
                                if (conditionIdx === editConditionIndex) {
                                  return {
                                    ...condition,
                                    description: description,
                                  };
                                }
                                return condition;
                              }
                            ),
                          };
                        }
                        return label;
                      });
                      setLabels(updatedLabels);
                      setShowDescription(false);
                      setDescription("");
                    }
                  }}
                />
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
                                  setDescription(
                                    labels[index].conditions[i].description
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
                    placeholder={t("typePromptToIdentify")}
                    onChange={(e) => {
                      setInputPrompt(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
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
                      }
                    }}
                    value={inputPrompt}
                  />
                  {inputPrompt.split(" ").length >= 3 &&
                  inputPrompt.split(" ")[2] !== "" ? (
                    <div className={styles.buttonsAddFilter}>
                      <Button
                        action={async () => {
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
                                {t("detectVariables")} <WindMagic />
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
                    <p></p>
                  )}
                </div>

                <div className={styles.filtersLabelOptions}>
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
                            {t("and")}
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
                            {t("or")}
                          </button>
                        </div>
                      ) : (
                        <p></p>
                      )}
                      <FiltersLabelOptionsTemplate
                        configuration={configuration}
                        filterIndex={filterIndex}
                            index={index}
                        labels={labels}
                        handleConfigurationChange={handleConfigurationChange}
                        key={filter.id}
                        conditionCurrency={filter.conditionCurrency.title || ""}
                        setShowVariableModal={setShowVariableModal}
                        setTypeVariableModal={setTypeVariableModal}
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
                        const updatedLabels = [...labels];
                        updatedLabels[editIndex].updateDate = Date.now();
                        handleConfigurationChange("labels", updatedLabels);
                        const variablesFromLabels = [];
                        updatedLabels.forEach((label) => {
                          label.conditions.forEach((condition) => {
                            variablesFromLabels.push(condition);
                          });
                        });
                        dispatch(
                          setAllVariablesFromEnPointUse(variablesFromLabels)
                        );
                        editLabel(null);
                      }}
                      className={styles.buttonAplyFilter}
                    >
                      {t("applyFilter")}
                    </button>
                  </div>
                </div>
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
export default FiltersAndVariablesOut;
