import React, { useEffect, useRef, useState } from "react";
import styles from "./ConfigDataKey.module.css";
import InputComponent from "../../../../InputComponent/InputComponent";
import CustomDropdown from "../../../../CustomDropdown/CustomDropdown";
import CustomAutomationsWrapper from "../../../../CustomAutomationsWrapper/CustomAutomationsWrapper";
import { ReactComponent as GrayChevron } from "../../../../../assets/grayChevron.svg";
import { ReactComponent as ConectarTablas } from "../../../../../assets/ConectarTablas.svg";
import { ReactComponent as SearchWhite } from "../../../../../assets/searchWhite.svg";
import { ReactComponent as CircuitryIcon } from "../../../../../assets/CircuitryIcon.svg";
import { ReactComponent as SearchGreen } from "../../../../../assets/SearchIconGreen.svg";
import { ReactComponent as CircuitryGreen } from "../../../../../assets/CircuitryGreen.svg";
import lIcon from "../../../../../assets/lIcon.svg";
import { ReactComponent as WindMagic } from "../../../../../assets/StarMagic.svg";
import SearchSVG from "../../../svgs/SearchSVG";
import DeleteButton from "../../../../DeleteButton/DeleteButton";
import SelectCurrencyPopup from "../../../../SelectCurrencyPopup/SelectCurrencyPopup";
import { AutomateDataComponent } from "../../../utils/automatesJson";

import { ReactComponent as GreenClock } from "../../../../../assets/WachtGreen.svg";
import { ReactComponent as WhiteClock } from "../../../../../assets/whiteClock.svg";
import { ReactComponent as SearchGray } from "../../../../../assets/searchGray.svg";
import { ReactComponent as AdvertencyIcon } from "../../../../../assets/AdvertencyIcon.svg";

import CardAutomate from "../../CardAutomate/CardAutomate";
import RulesFilterAvanced from "./RulesFilterAvanced/RulesFilterAvanced";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilteredAutomateSelected,
  setVariables,
  setVariablesSelectedToRenameFiles,
} from "../../../../../../../slices/automateSlices";
import { deleteAutomation, getSelectedAutomationsAction } from "../../../../../../../actions/automate";
import ConfirmationPopup from "../../../../ConfirmationPopup/ConfirmationPopup";
import { useTranslation } from "react-i18next";
import WrongAlert from "../../WrongAlert/WrongAlert";
import SelectCategoryAndConcept from "../../SelectCategoryAndConcept/SelectCategoryAndConcept";
import { formatAgoDate } from "../../../../../../../utils/agoDateUtil";
import EditableInput from "../../FileInput/Input";
import SearchIconWithIcon from "../../../../SearchIconWithIcon/SearchIconWithIcon";
import useFocusShortcut from "../../../../../../../utils/useFocusShortcut";
import Advertency from "../../Advertency/Advertency";
import Button from "../../../../Button/Button";
import Alert from "../../Alert/Alert";

const ConfigDataKey = ({
  configuration,
  handleConfigurationChange,
  setShowSelectOutputLocation,
  typeContent,
  type,
  formAutomateContainerRef,
  close,
  setIsModalAutomate,
  typeVariableModal,
  setTypeVariableModal,
  showVariableListModal,
  setShowVariableListModal,
  showVariableModal,
  setShowVariableModal,
  setHideAutomate,
  setRoleAutomate,
  selectedAutomates,
  setSelectedAutomates,
  onlyShowConfigDataKey = false,
}) => {
  const [t] = useTranslation("AutomatesComponent");
  const data = AutomateDataComponent();
  const dispatch = useDispatch();


  const [labels, setLabels] = useState([]);
  const [teamCheckboxes, setTeamCheckboxes] = useState({
    team1: false,
    team2: false,
  });
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [symbolSelected, setSymbolSelected] = useState("$");
  const [showSelectCurrencyPopup, setShowSelectCurrencyPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showSelectInputOutput, setShowSelectInputOutput] = useState(false);
  const [dataCategoryConcept, setDataCategoryConcept] = useState({
    firstSelected: "",
    secondSelected: "",
    thirdSelected: "",
    fourthSelected: "",
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


  const [selectedImages, setSelectedImages] = useState([]);
  const [automateSelected, setAutomateSelected] = useState([]);
  const [checkBoxFromOutput, setCheckBoxFromOutput] = useState({
    image: {
      checkBox1: false,
      checkBox2: false,
    },
    text: {
      checkBox1: false,
      checkBox2: false,
    },
    date: {
      checkBox1: false,
      checkBox2: false,
    },
    file: {
      checkBox1: false,
      checkBox2: false,
    },
    code: {
      checkBox1: false,
      checkBox2: false,
    },
  });

  const isScrollingRef = useRef(false);
  const { userAutomations } = useSelector((state) => state.automate);


  const [aplicationOffsetTime, setAplicationOffsetTime] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const wrapperRef = useRef();
  const searchInputRef = useRef(null);
  const inputRef = useRef(null);


  useFocusShortcut(searchInputRef, "/");



  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };


  const getSelectedAutomation = async () => {
    const res = await dispatch(getSelectedAutomationsAction({ ids: configuration?.automateSelected }))
    setSelectedAutomates(res.payload.data)
  }

  const handleSetShowContent = (infoNumber) => {
    setShowContent({ ...showContent, [infoNumber]: !showContent[infoNumber] });
    handleConfigurationChange("showContentSelectInfoToProcess", {
      ...showContent,
      [infoNumber]: !showContent[infoNumber],
    });
  };
 


  useEffect(() => {
    const disableScroll = (event) => {
      if (isScrollingRef.current) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", disableScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", disableScroll);
    };
  }, []);

  useEffect(() => {
    if (userAutomations.length > 0) {
      const automateSelected = userAutomations?.filter((automate) => {
        const foundAutomate = data?.find((ele) => {
          return ele.type === automate.type && ele.role === "input";
        });

        if (foundAutomate) {
          return foundAutomate;
        }

        return null;
      });
      setAutomateSelected(automateSelected);
    }
  }, [userAutomations]);



  useEffect(() => {
    if (
      configuration?.selectedImages?.length > 0 &&
      JSON.stringify(configuration.selectedImages) !==
      JSON.stringify(selectedImages)
    ) {
      setSelectedImages(configuration.selectedImages);
    }
  }, [configuration?.selectedImages]);

  useEffect(() => {
    if (
      configuration?.teamCheckboxes &&
      JSON.stringify(configuration?.teamCheckboxes) !==
      JSON.stringify(teamCheckboxes)
    ) {
      setTeamCheckboxes(configuration?.teamCheckboxes);
    }
  }, [configuration?.teamCheckboxes]);

  useEffect(() => {
    if (
      configuration?.checkBoxFromOutput &&
      JSON.stringify(configuration?.checkBoxFromOutput) !==
      JSON.stringify(checkBoxFromOutput)
    ) {
      setCheckBoxFromOutput(configuration?.checkBoxFromOutput);
    }
  }, [configuration?.checkBoxFromOutput]);

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
      configuration.dataFacturaConcepto &&
      JSON.stringify(configuration.dataFacturaConcepto) !==
      JSON.stringify(dataCategoryConcept)
    ) {
      setDataCategoryConcept({
        ...dataCategoryConcept,
        firstSelected: configuration.dataFacturaConcepto.firstSelected,
        secondSelected: configuration.dataFacturaConcepto.secondSelected,
        thirdSelected: configuration.dataFacturaConcepto.thirdSelected,
      });
    }
  }, [configuration.dataFacturaConcepto]);

  useEffect(() => {
    dispatch(setFilteredAutomateSelected(configuration?.automateSelected));
  }, [configuration.automateSelected]);

  useEffect(() => {
    if (
      configuration?.aplicationOffsetTime &&
      JSON.stringify(configuration?.aplicationOffsetTime) !==
      JSON.stringify(aplicationOffsetTime)
    ) {
      setAplicationOffsetTime(configuration?.aplicationOffsetTime);
    }
  }, [configuration?.aplicationOffsetTime]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);




  useEffect(() => {

    getSelectedAutomation()
    if(configuration?.automateSelected?.length > 0){
      setShowSelectInputOutput(true)
    }else{
      setShowSelectInputOutput(false)
    }

  }, [configuration?.automateSelected])



  return (
    <div>
      {/* Primer CustomAutomationsWrapper - Configuración de datos clave */}
      <CustomAutomationsWrapper
        Icon={<SearchWhite />}
        showContent={showContent.info1}
      >
        <div
          className={styles.infoContainerWrapper}
          onClick={() => handleSetShowContent("info1")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {showContent.info1 && <SearchGreen />}
            <div className={styles.infoContainer}>
              <div>{t("configureKeyData")}</div>
              <span>{t("configureFiltersToExtractKey")}</span>
            </div>
          </div>
          <GrayChevron
            style={{
              transform: showContent.info1 ? "rotate(180deg)" : "",
              transition: "transform 0.3s ease-in-out",
              fill: '#71717A'
            }}
          />
        </div>
        <div
          className={` ${styles.contentContainer} ${showContent.info1 ? styles.active : styles.disabled}`}
          style={{
            display: showContent.info1 ? "flex" : "none",
            flexDirection: "column",
          }}
          >
              <label className={styles.formLabel}>{t("title")}</label>
          <EditableInput
            label={t("automationName")}
            name="automatization"
            placeholder={`${t("titleAutomate")}`}
            options={true}
            readOnly={false}
            configuration={configuration}
            handleConfigurationChange={handleConfigurationChange}
          />
            {
              !showSelectInputOutput && (
                <Alert text="lorem ipsum">
                  <Button type="white" rounded={true} action={() => setShowSelectInputOutput(true)}>Empezar ahora</Button>
                </Alert>
              )
            }

        
        {showSelectInputOutput && (
            <div>
            <label className={styles.formLabel}>{t("selectAutomation")}</label>
            {automateSelected?.length > 0 ? (
              <div ref={wrapperRef} className={styles.wrapperSearchAutomate}>
                <div className={styles.searchContainer} onClick={handleDivClick}>
                  <SearchIconWithIcon
                    ref={searchInputRef}
                    searchTerm={searchInputValue}
                    setSearchTerm={setSearchInputValue}
                    classNameIconRight={styles.searchContainerL}
                    onFocusP={() => setIsInputFocused(true)}
                  >
                    <img
                      src={lIcon}
                      alt="filterIcon"
                      className={styles.searchContainerIcon}
                    />
                  </SearchIconWithIcon>
                </div>

                <div className={styles.automates}>
                  {isInputFocused &&
                    automateSelected
                      .filter((automate) =>
                        (automate.inputValue || "")
                          .toLowerCase()
                          .includes(searchInputValue.toLowerCase())
                      )
                      .flatMap((automate) =>
                        data
                          .filter((ele) => ele.type === automate.type)
                          .map((ele, index, arr) => (
                            <CardAutomate
                              fullContent={true}
                              type={type}
                              typeContent={typeContent}
                              key={`${automate.id}-${ele.id}`}
                              name={ele?.automateName}
                              nameTitle={
                                automate.inputValue || t("automationName")
                              }
                              image={ele.image}
                              automationData={automate}
                              isBorders={true}
                              last={ele.id === arr[arr.length - 1]?.id}
                              contentTelematel={"contentTelematel"}
                              id={ele.id}
                              role={ele.role}
                              fromPanel={true}
                              available={true}
                              rol={ele.role}
                              setRoleAutomate={setRoleAutomate}
                              prueba="elementoPrueba"
                              pencilUniqueClickeable={true}
                              selectAutomate={(automate) => {
                                const automateId = automate._id;

                                const current = Array.isArray(configuration.automateSelected)
                                  ? configuration.automateSelected
                                  : [];

                                const alreadyExists = current.includes(automateId);

                                const updatedArray = alreadyExists
                                  ? current
                                  : [...current, automateId];


                                handleConfigurationChange("automateSelected", updatedArray);
                                setIsInputFocused(false);
                              }}
                              showDeleteButton={false}
                            />
                          ))
                      )}
                </div>
              </div>
            ) : (
              <WrongAlert
                message="No hay entradas, crea uno"
                close={close}
                setIsModalAutomate={setIsModalAutomate}
                setHideAutomate={setHideAutomate}
              />
            )}
          </div>
        )}

          {selectedAutomates?.length > 0 && (
            <div className={styles.outputContainer}>
              <label className={styles.formLabel}>{t("output")}</label>
              <div className={styles.outputContent}>
                {selectedAutomates?.map((automate, index) => {


                  const filteredAutomates = data.filter(
                    (ele) => automate.type === ele.type
                  );

                  return filteredAutomates.map((ele, indexData) => (
                    <div
                      key={ele.id}
                      style={{
                        display: "flex",
                        position: "relative",
                        flexDirection: "column"
                      }}
                    >
                      <div className={styles.headerSelectedAutomate}>
                        <div>
                          <input
                            type="checkbox"
                            checked={true}
                            onChange={() => {
                              const idToRemove = automate._id;

                              if (!idToRemove) return;

                              const automateFilter = configuration?.automateSelected?.filter(
                                (id) => id !== idToRemove
                              );

                              handleConfigurationChange("automateSelected", automateFilter);
                            }}


                          />
                          <img
                            className={styles.image}
                            src={ele.image}
                            alt="logo"
                            style={true && { width: "34px", height: "34px" }}
                          />
                          <div
                            style={{
                              margin: "0px",
                            }}
                          >
                            {automate.inputValue || t("automationName")}
                            <span className={styles.dateAutomate}>
                              {" "}
                              {(automate?.updatedAt || automate?.createdAt) &&
                                formatAgoDate({
                                  dateString:
                                    automate?.updatedAt || automate?.createdAt,
                                  t,
                                })}
                            </span>
                          </div>
                        </div>
                        <div className={styles.deleteButtonContainer}>
                          <ConectarTablas
                            style={{ width: "18px", height: "18px" }}
                          />
                          <DeleteButton
                            action={() => {
                              const automateFilter =
                                configuration?.automateSelected?.filter(
                                  (automateSelected, indexAutomate) =>
                                    indexAutomate !== index
                                );
                              handleConfigurationChange(
                                "automateSelected",
                                automateFilter
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        {Array.isArray(automate?.labels) && automate.labels.length > 0 ? (
                          automate.labels.map((label, labelIndex) => (
                            <div key={labelIndex}>
                              <strong>{label.title}</strong>
                              <div className={styles.labelsContainer}>
                                {Array.isArray(label.conditions) && label.conditions.length > 0
                                  ? label.conditions.map((condition, conditionIndex) => (
                                      <button className={styles.buttonLabel} key={conditionIndex}>
                                        {condition.title}
                                      </button>
                                    ))
                                  : "No hay condiciones"}
                              </div>
                            </div>
                          ))
                        ) : (
                          null
                        )}
                      </div>


                      {showDeletePopup && (
                        <ConfirmationPopup
                          onClose={() => {
                            const automateFilter =
                              configuration?.automateSelected?.filter(
                                (automateSelected, indexAutomate) =>
                                  indexAutomate !== index
                              );
                            handleConfigurationChange(
                              "automateSelected",
                              automateFilter
                            );
                            setShowDeletePopup(false);
                          }}
                          message={t("areYouSureWantDeleteAutomation")}
                          titleMessage={t("deletAutomation")}
                          handleAccept={() =>
                            dispatch(
                              deleteAutomation({
                                automationId: automate.id,
                                userId: automate.userId,
                              })
                            )
                          }
                          customStylesMessage={{
                            textAlign: "center",
                          }}
                        />
                      )}
                    </div>
                  ));
                })}
              </div>
            </div>
          )}

          <CustomAutomationsWrapper
            Icon={<WhiteClock />}
            showContent={showContent.info8}
          >
            <div
              className={styles.infoContainerWrapper}
              onClick={() => handleSetShowContent("info8")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {showContent.info8 && <GreenClock />}
                <div className={styles.infoContainer}>
                  <div>{t("selectOffset")}</div>
                  <span>{t("ifOptionNotChecked")}</span>
                </div>
              </div>
            </div>
            <div
              className={`${styles.contentContainer} ${showContent.info8 ? styles.active : styles.disabled}`}
            >
              <CustomDropdown
                options={[
                  t("default"),
                  t("30Minutes"),
                  t("1Hour"),
                  t("6Hour"),
                  t("12Hour"),
                ]}
                selectedOption={aplicationOffsetTime}
                height="31px"
                textStyles={{
                  fontWeight: 300,
                  color: "#1E0045",
                  fontSize: "13px",
                  marginLeft: "6px",
                  userSelect: "none",
                }}
                setSelectedOption={(selected) => {
                  setAplicationOffsetTime(selected);
                  handleConfigurationChange("aplicationOffsetTime", selected);
                }}
                formAutomateContainerRef={formAutomateContainerRef}
              />
            </div>
          </CustomAutomationsWrapper>
        </div>
      </CustomAutomationsWrapper>
      {/* Segundo CustomAutomationsWrapper - Reglas avanzadas de filtros (solo se muestra si onlyShowConfigDataKey es false) */}
      {!onlyShowConfigDataKey && (
        <CustomAutomationsWrapper
          Icon={<CircuitryIcon />}
          showContent={showContent.info9}
        >
          <div
            className={styles.infoContainerWrapper}
            onClick={() => handleSetShowContent("info9")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {showContent.info9 && <CircuitryGreen />}
              <div className={styles.infoContainer}>
                <div>{t("advancedRulesFilters")}</div>
                <span>{t("configureCriteria")}</span>
              </div>
            </div>
            <GrayChevron
              style={{
                transform: showContent.info9 ? "rotate(180deg)" : "",
                transition: "transform 0.3s ease-in-out",
                fill: '#71717A'
              }}
            />
          </div>
          <div
            className={`${styles.contentContainer} ${showContent.info9 ? styles.active : styles.disabled
              }`}
          >
            <RulesFilterAvanced
              handleConfigurationChange={handleConfigurationChange}
              configuration={configuration}
              formAutomateContainerRef={formAutomateContainerRef}
              type={type}
              setShowVariableModal={setShowVariableModal}
              setTypeVariableModal={setTypeVariableModal}
              setSelectedAutomates={setSelectedAutomates}
              selectedAutomates={selectedAutomates}
            />
          </div>
        </CustomAutomationsWrapper>
      )}
      {showSelectCurrencyPopup && (
        <SelectCurrencyPopup
          setShowSelectCurrencyPopup={setShowSelectCurrencyPopup}
          setSelectedCurrency={setSelectedCurrency}
          selectedCurrency={selectedCurrency}
          symbolSelected={symbolSelected}
          setSymbolSelected={setSymbolSelected}
          configuration={configuration}
          handleConfigurationChange={handleConfigurationChange}
        />
      )}
    </div>
  );
};

export default ConfigDataKey;
