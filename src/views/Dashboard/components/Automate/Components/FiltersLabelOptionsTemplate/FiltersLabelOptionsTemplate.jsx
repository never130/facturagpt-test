import React, { useEffect, useRef, useState } from "react";
import styles from "./FiltersLabelOptionsTemplate.module.css";
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";
import CarouselSelector from "../FileInput/selectInfoToProcces/CarouselSelector";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { ReactComponent as SearchGray } from "../../../../assets/searchGray.svg";
import MentionInput from "../MentionInput/MentionInput";
import { getVariable } from "../../../../../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import { setShowModal } from "../../../../../../slices/userSlices";
import RelationshipsFormulas from "../../../CreateParameterPopup/DatabaseRelationship/RelationshipsFormulas/RelationshipsFormulas";

const FiltersLabelOptionsTemplate = ({
  conditionOperator,
  setConditionOperator,
  optionsFirst,
  optionsSecond,
  formAutomateContainerRef,
  configuration,
  index,
  filterIndex,
  handleConfigurationChange,
  setShowVariableModal,
  setTypeVariableModal,
  selectedAutomates,
  setSelectedAutomates
}) => {
  const dispatch = useDispatch();
  const [t] = useTranslation("AutomatesComponent");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVariables, setFilteredVariables] = useState([]);

  const inputRef = useRef(null);
  useEffect(() => {
    dispatch(getVariable({ type:'global',search:searchTerm}));
  }, [dispatch,searchTerm]);

  const variables = useSelector((state) => state.variables.variables);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowCarousel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const customDropdownStyles = {
    colorHeader: "#FFFFFF",
    borderRadius: "8px",
    background: "#4F5660",
    display: "flex",
    padding: "3px 8px",
    alignItems: "center",
    gap: "8px",
  };

  const [conditionCurrencyArray, setConditionCurrencyArray] = useState([]);
  const [showCarousel, setShowCarousel] = useState(false);
  const carouselRef = useRef(null);
  const [optionSelectedFromCarrusel, setOptionSelectedFromCarrusel] = useState(
    t("selectAnOperator")
  );

  useEffect(() => {
    if (optionsFirst[0].title) {
      const conditionCurrencyArray = optionsFirst.map((option) => option.title);
      setConditionCurrencyArray(conditionCurrencyArray);
    }
  }, [optionsFirst]);

  useEffect(() => {
    if (conditionOperator !== "CONTAINS") {
      setOptionSelectedFromCarrusel(conditionOperator);
    }
  }, [conditionOperator]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (carouselRef.current && !carouselRef.current.contains(event.target)) {
        setShowCarousel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectorRef = useRef(null);
  const popupRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState("bottom");

  const updatePopupPosition = () => {
    if (
      showCarousel &&
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

      if (spaceBelow >= popupRect.height) {
        setPopupPosition("bottom");
      } else if (spaceAbove >= popupRect.height) {
        setPopupPosition("top");
      } else {
        setPopupPosition("bottom");
      }
    }
  };
  useEffect(() => {
    if (showCarousel) {
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
  }, [showCarousel, formAutomateContainerRef]);

  const combinedMentionOptions = [
    ...(configuration?.labels?.[index]?.conditions || []),
  
    ...(selectedAutomates || []).flatMap(automate =>
      (automate.labels || []).flatMap(filter =>
        Array.isArray(filter.conditions) ? filter.conditions : []
      )
    )
  ];
  return (
    <div className={styles.FiltersLabelOptionsTemplate}>
      {optionsSecond === "carrusel" ? (
        <div className={styles.carouselContainer} ref={carouselRef}>
          <div className={styles.inputVariablesContainer}>
          <div className={styles.inputWrapper}>
            <SearchGray />
            <input
              ref={inputRef}
              className={styles.carouselInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowCarousel(true)}
              placeholder={t("searchVariable")}
            />
            <FaChevronDown
              className={styles.chevronIcon}
              style={{
                transform: showCarousel ? "rotate(180deg)" : "",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </div>

          {showCarousel && (
            <div className={styles.variablesContainer} ref={popupRef}>
              {variables.data.length > 0 ? (
                variables.data.map((variable) => (
                  <div
                    key={variable.id || variable.title}
                    className={styles.variablesContent}
                  >
                    <input
                      type="checkbox"
                      checked={
                        configuration?.labels?.[index]?.filters?.[
                          filterIndex
                        ]?.variables?.some((v) => v._id === variable._id) ||
                        false
                      }
                      onChange={() =>{
                        handleConfigurationChange(
                          "variables",
                          variable,
                          index,
                          filterIndex
                        )
                        setShowCarousel(false)
                      }}
                    />

                    <div>
                      <p>
                        {variable.title} <span>{variable.type || "name"}</span>
                      </p>
                      <span>{variable.description}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div>{t("noResultsInVariableAutomates")}</div>
              )}
            </div>
          )}
          </div>
          
          {(
            configuration.labels?.[index]?.filters?.[filterIndex]?.variables ||
            []
          ).map((variable) => (
            <div
            key={variable.id || variable.title}
            className={styles.variablesContent}
          >
            <input
              type="checkbox"
              checked={
                configuration?.labels?.[index]?.filters?.[
                  filterIndex
                ]?.variables?.some((v) => v._id === variable._id) ||
                false
              }
              onChange={() =>
                handleConfigurationChange(
                  "variables",
                  variable,
                  index,
                  filterIndex
                )
              }
            />

            <div>
              <p>
                {variable.title} <span>{variable.type || "name"}</span>
              </p>
              <span>{variable.description}</span>
            </div>
          </div>
          ))}

          <button
            className={styles.btnNewVariable}
            onClick={() => {
              setShowVariableModal(true);
              setTypeVariableModal("global");
            }}
          >
            {t("newVariable")}
          </button>
        </div>
      ) : (
        <></>
        // <CustomDropdown
        //   editable={true}
        //   editing={true}
        //   options={optionsSecond}
        //   selectedOption={conditionOperator}
        //   setSelectedOption={setConditionOperator}
        //   customStyles={styles.transparentBG}
        //   formAutomateContainerRef={formAutomateContainerRef}
        // />
      )}

<RelationshipsFormulas parameterData={configuration?.labels?.[index]?.filters?.[filterIndex]} handleChange={(name, text) =>
          handleConfigurationChange(name, text, index, filterIndex)} maxLevels={99} />

      {/* <MentionInput
        mentionOptions={combinedMentionOptions || []}
        textConfiguration={
          configuration?.labels?.[index]?.filters[filterIndex].labels || ""
        }
        
        textPlain={
          configuration?.labels?.[index]?.filters?.[filterIndex]
            .plainTextLabels || ""
        }
        onTextChange={(text) =>
          handleConfigurationChange("labels", text, index, filterIndex)
        }
        onPlainTextChange={(text) =>
          handleConfigurationChange("plainTextLabels", text, index, filterIndex)
        }
      /> */}
    </div>
  );
};

export default FiltersLabelOptionsTemplate;
