import React, { useContext, useEffect, useRef, useState } from "react";
import CustomAutomationsWrapper from "../../../CustomAutomationsWrapper/CustomAutomationsWrapper";
import { ReactComponent as SearchWhite } from "../../../../assets/searchWhite.svg";
import { ReactComponent as SearchGreen } from "../../../../assets/SearchIconGreen.svg";
import { ReactComponent as GrayChevron } from "../../../../assets/grayChevron.svg";
import styles from "./FilterInfoDateKey.module.css";
import { useTranslation } from "react-i18next";
import DeleteButton from "../../../DeleteButton/DeleteButton";
import InputComponent from "../../../InputComponent/InputComponent";
import WrongAlert from "../WrongAlert/WrongAlert";
import CheckboxWithText from "../../../CheckboxWithText/CheckboxWithText";
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";

import { ReactComponent as WhiteClock } from "../../../../assets/whiteClock.svg";
import { ReactComponent as GreenClock } from "../../../../assets/WachtGreen.svg";
import OptionsSwitchComponent from "../../../OptionsSwichComponent/OptionsSwitchComponent";
import { MiniCalendar } from "../../../../screens/CalendarView/Calendar/event";
import { CalendarContext, CalendarContextProvider } from "../../../../screens/CalendarView/CalendarContext";
import CalendarPopup from "../../../../screens/CalendarView/Calendar/components/CalendarPopup";
import { useDispatch } from "react-redux";
import { getTables } from "../../../../../../actions/user";

const FilterInfoDateKeyComponent = ({
  configuration,
  handleConfigurationChange,
  formAutomateContainerRef,
  type,
}) => {
  const [t] = useTranslation("AutomatesComponent");
  const [fileArrayEmails, setFileArrayEmails] = useState([]);
  const [inputFileEmails, setInputFileEmails] = useState("");
  const [errorInputFileEmails, setErrorInputFileEmails] = useState("");
  const [fileKeywords, setFileKeywords] = useState([]);
  const [bodyArrayKeywords, setBodyArrayKeywords] = useState([]);
  const [inputBodyKeywords, setInputBodyKeywords] = useState("");
  const [inputFileKeywords, setInputFileKeywords] = useState("");
  const [automateTitle,setAutomateTile] = useState('')
  const [showContent, setShowContent] = useState({
    info9: false,
  });

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // Cerrar calendarios cuando se haga clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startDateRef.current && !startDateRef.current.contains(event.target)) {
        setShowStartDate(false);
      }
      if (endDateRef.current && !endDateRef.current.contains(event.target)) {
        setShowEndDate(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const {
		selectedDate,
		setTodayAsSelectedDate,
		calendar,
		setCalendar,
		handleCalendar,
		handleCellClick,
		goToActualWeek,
		currentTimelineDate,
		goToActualMonth,
		actualWeek,
		formattedMonth,
		handlePreviousMonth,
		handleNextMonth,
		currentYear,
		currentMonth,
	} = useContext(CalendarContext)

  const handleSetShowContent = (infoNumber) => {
    setShowContent({ ...showContent, [infoNumber]: !showContent[infoNumber] });
    handleConfigurationChange("showContentFilterInfoDateKey", {
      ...showContent,
      [infoNumber]: !showContent[infoNumber],
    });
  };

  useEffect(() => {
    if (
      configuration.showContentFilterInfoDateKey &&
      JSON.stringify(configuration.showContentFilterInfoDateKey) !==
        JSON.stringify(showContent)
    ) {
      setShowContent(configuration.showContentFilterInfoDateKey);
    }
  }, [configuration.showContentFilterInfoDateKey]);

  useEffect(() => {
    if (
      configuration.filesArrayEmails &&
      JSON.stringify(configuration.filesArrayEmails) !==
        JSON.stringify(fileArrayEmails)
    ) {
      setFileArrayEmails(configuration.filesArrayEmails);
    }
  }, [configuration.filesArrayEmails]);

  useEffect(() => {
    if (
      configuration.filesArrayKeyWords &&
      JSON.stringify(configuration.filesArrayKeyWords) !==
        JSON.stringify(fileKeywords)
    ) {
      setFileKeywords(configuration.filesArrayKeyWords);
    }
  }, [configuration.filesArrayKeyWords]);

  const [startDate, setStartDate] = useState("");
  const startDateInputRef = useRef(null);
  const [showStartDate, setShowStartDate] = useState(false);
  const [selectedStartDay, setSelectedStartDay] = useState(null);
  
  const handleLabelClickStartDate = () => {
    if (startDateInputRef.current) {
      startDateInputRef.current.showPicker(); 
    }
  };

  const [endDate, setEndDate] = useState("");
  const endDateInputRef = useRef(null);
  const [showEndDate, setShowEndDate] = useState(false);
  const [selectedEndDay, setSelectedEndDay] = useState(null);
  const [tables, setTables] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
   const getTablesFn = async () => {
    const res = await dispatch(getTables());
    if(res.payload.tables){
      setTables(res.payload.tables)
    }
   }
   getTablesFn()
  }, []);
  
  // Estados para navegación del calendario
  const [calendarYear, setCalendarYear] = useState(currentYear);
  const [calendarMonth, setCalendarMonth] = useState(currentMonth);
  
  const handleLabelClickEndDate = () => {
    if (endDateInputRef.current) {
      endDateInputRef.current.showPicker();
    }
  };

  const handleCalendarPreviousMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleCalendarNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // Resetear calendario cuando se abre
  const handleOpenStartCalendar = () => {
    setCalendarYear(currentYear);
    setCalendarMonth(currentMonth);
    setShowStartDate(!showStartDate);
  };

  const handleOpenEndCalendar = () => {
    setCalendarYear(currentYear);
    setCalendarMonth(currentMonth);
    setShowEndDate(!showEndDate);
  };

  const handleStartDateSelect = (date) => {
    console.log('date controller',date)
    const formattedDate = `${date.day}/${date.month}/${date.year}`
    // formattedDate
    setStartDate(formattedDate);
    handleConfigurationChange("startDate", formattedDate);
    setShowStartDate(false);
  };

  const handleEndDateSelect = (date) => {
    const formattedDate = `${date.day}/${date.month}/${date.year}`
    setEndDate(formattedDate);
    console.log('formattedDate',formattedDate)
    handleConfigurationChange("endDate", formattedDate);
    setShowEndDate(false);
  };
console.log('configuration',configuration)
  // Efecto para manejar la selección de fecha inicial
  useEffect(() => {
    if (selectedStartDay && selectedStartDay.month === 'current') {
      handleStartDateSelect(selectedStartDay);
      setSelectedStartDay(null);
    }
  }, [selectedStartDay]);
  console.log('selectedEndDay',selectedEndDay)

  // Efecto para manejar la selección de fecha final
  useEffect(() => {
    if (selectedEndDay && selectedEndDay.month === 'current') {
      handleEndDateSelect(selectedEndDay);
      setSelectedEndDay(null);
    }
  }, [selectedEndDay]);

  useEffect(() => {
    if (
      configuration.startDate &&
      configuration.endDate &&
      JSON.stringify(configuration.startDate) !== startDate &&
      JSON.stringify(configuration.endDate) !== endDate
    ) {
      setStartDate(configuration.startDate);
      setEndDate(configuration.endDate);
    }
  }, [configuration.startDate, configuration.endDate]);

  useEffect(() => {
    if (
      configuration.bodyArrayKeyWords &&
      JSON.stringify(configuration.bodyArrayKeyWords) !==
        JSON.stringify(bodyArrayKeywords)
    ) {
      setBodyArrayKeywords(configuration.bodyArrayKeyWords);
    }
  }, [configuration.bodyArrayKeyWords]);

  return (
    <CustomAutomationsWrapper
      Icon={<SearchWhite />}
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
            width: "100%",
          }}
        >
          {showContent.info9 && (
            <SearchGreen stroke="var(--_10a37f-background)" style={{ color: "var(--_10a37f-background)" }} />
          )}
          <div className={styles.infoContainer}>
            <div>{t("configureKeyDataIdentification")}</div>
            <span>{t("configureFiltersToExtractKey")}</span>
          </div>
        </div>
        <GrayChevron
          style={{
            transform: showContent.info9 ? "rotate(180deg)" : "",
            transition: "transform 0.3s ease-in-out",
            fill:'#71717A'
          }}
        />
      </div>
      <div
        className={`${styles.contentContainer} ${showContent.info9 ? styles.active : styles.disabled}`}
      >
        {/* {type} */}
            <div className={styles.contentInput}>
              <p
                className={styles.titleContentInput}
                style={{ marginBottom: "0px" }}
              >
                {t("title")}
              </p>
           
              {!configuration?.allRemitentes && (
                <InputComponent
                  value={configuration?.inputValue}
                  setValue={(value) => {
                    handleConfigurationChange('inputValue',value)
                  }}
                  placeholder={t('titleAutomate')}
                  typeInput="text"
                 
                />
              )}
           
            </div>

{type === "facturagpt" && (
 <>
  <div className={styles.contentInput}>
    <p className={styles.titleContentInput}>{t("tables")}</p>
    <CustomDropdown
      options={tables.map((table) => table.name)}
      selectedOption={
        (configuration?.selectedTable || []).map((table) => table.name)
      }
      height="31px"
      textStyles={{
        fontWeight: 300,
        color: "#1E0045",
        fontSize: "13px",
        marginLeft: "6px",
        userSelect: "none",
      }}
      setSelectedOption={(selectedName) => {
        // Buscar la tabla completa por nombre
        const selectedTableObj = tables.find((table) => table.name === selectedName);
        // Si ya está seleccionada, la quitamos; si no, la agregamos
        let newSelectedTables = [];
        if (
          configuration?.selectedTable &&
          configuration.selectedTable.some((table) => table.name === selectedName)
        ) {
          newSelectedTables = configuration.selectedTable.filter(
            (table) => table.name !== selectedName
          );
        } else {
          newSelectedTables = [
            ...(configuration?.selectedTable || []),
            selectedTableObj,
          ];
        }
        handleConfigurationChange("selectedTable", newSelectedTables);
      }}
      // formAutomateContainerRef={formAutomateContainerRef}
    />
  </div>
  <div className={styles.contentInput}>
    <p className={styles.titleContentInput}>{t("variables")}</p>
    <CustomDropdown
      options={tables.map((table) => table.name)}
      selectedOption={
        (configuration?.selectedTable || []).map((table) => table.name)
      }
      height="31px"
      textStyles={{
        fontWeight: 300,
        color: "#1E0045",
        fontSize: "13px",
        marginLeft: "6px",
        userSelect: "none",
      }}
      setSelectedOption={(selectedName) => {
        // Buscar la tabla completa por nombre
        const selectedTableObj = tables.find((table) => table.name === selectedName);
        // Si ya está seleccionada, la quitamos; si no, la agregamos
        let newSelectedTables = [];
        if (
          configuration?.selectedTable &&
          configuration.selectedTable.some((table) => table.name === selectedName)
        ) {
          newSelectedTables = configuration.selectedTable.filter(
            (table) => table.name !== selectedName
          );
        } else {
          newSelectedTables = [
            ...(configuration?.selectedTable || []),
            selectedTableObj,
          ];
        }
        handleConfigurationChange("selectedTable", newSelectedTables);
      }}
      // formAutomateContainerRef={formAutomateContainerRef}
    />
  </div>
 </>
)}

        {type !== "Google Drive" &&
          type !== "One Drive" &&
          type !== "WhatsApp" &&
          type !== "facturagpt" && (
            <div className={styles.contentInput}>
              <p
                className={styles.titleContentInput}
                style={{ marginBottom: "0px" }}
              >
                {t("senders")}
              </p>
              <div className={styles.keywordContainer}>
                {fileArrayEmails.map((keyword, index) => (
                  <div className={styles.keyword} key={index}>
                    {keyword}
                    <DeleteButton
                      action={() => {
                        setFileArrayEmails((prevKeywords) => {
                          const updatePrev = prevKeywords.filter((_, i) => i !== index)
                          handleConfigurationChange(
                            "filesArrayEmails",
                            updatePrev
                          );
                          return updatePrev;
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
              {!configuration?.allRemitentes && (
                <InputComponent
                  value={inputFileEmails}
                  setValue={(value) => setInputFileEmails(value)}
                  placeholder={"example@email.com"}
                  typeInput="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      const keywords = e.target.value;
                      if (emailRegex.test(keywords)) {
                        setFileArrayEmails((prevKeywords) => {
                          const newKeywords = [...prevKeywords, keywords];
                          handleConfigurationChange(
                            "filesArrayEmails",
                            newKeywords
                          );
                          return newKeywords;
                        });
                        setInputFileEmails("");
                        setErrorInputFileEmails("");
                      } else if (keywords === "") {
                        setErrorInputFileEmails(t("pleaseEnterEmailAddress"));
                      } else {
                        setErrorInputFileEmails(t("enterValidEmailAddress"));
                      }
                    }
                  }}
                />
              )}
              {errorInputFileEmails && (
                <WrongAlert
                  message={errorInputFileEmails}
                  customCss={{ marginTop: "4px" }}
                />
              )}
              <CheckboxWithText
                marginTop="10px"
                color="var(--_10a37f-background)"
                state={configuration?.allRemitentes || false}
                setState={(value) => {
                  handleConfigurationChange("allRemitentes", value);
                }}
                text={t("includeAllSenders")}
              />
            </div>
          )}

        {type === "WhatsApp" && (
          <div className={styles.contentInput}>
            <p
              className={styles.titleContentInput}
              style={{ marginBottom: "0px" }}
            >
              {t("contact")}
            </p>
            <div className={styles.keywordContainer}>
              {fileArrayEmails.map((keyword, index) => (
                <div className={styles.keyword} key={index}>
                  {keyword}
                  <DeleteButton
                action={() => {
                  setFileArrayEmails((prevKeywords) => {
                    const updated = prevKeywords.filter((_, i) => i !== index);
                    handleConfigurationChange("filesArrayEmails", updated);
                    return updated;
                  });
                }}
              />

                </div>
              ))}
            </div>
            {!configuration?.allRemitentes && (
              <InputComponent
                value={inputFileEmails}
                setValue={(value) => setInputFileEmails(value)}
                placeholder={t("nameAndNumber")}
                typeInput="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const keywords = e.target.value;
                    if (keywords) {
                      setFileArrayEmails((prevKeywords) => {
                        const newKeywords = [...prevKeywords, keywords];
                        handleConfigurationChange(
                          "filesArrayEmails",
                          newKeywords
                        );
                        return newKeywords;
                      });
                      setInputFileEmails("");
                      setErrorInputFileEmails("");
                    } else if (keywords === "") {
                      setErrorInputFileEmails(t("pleaseEnterEmailAddress"));
                    } else {
                      setErrorInputFileEmails(t("enterValidEmailAddress"));
                    }
                  }
                }}
              />
            )}
            {errorInputFileEmails && (
              <WrongAlert
                message={errorInputFileEmails}
                customCss={{ marginTop: "4px" }}
              />
            )}
            <CheckboxWithText
              marginTop="10px"
              color="var(--_10a37f-background)"
              state={configuration?.allRemitentes || false}
              setState={(value) => {
                handleConfigurationChange("allRemitentes", value);
              }}
              text={t("includeAllSenders")}
            />
          </div>
        )}

        {(type === "Google Drive" || type === "One Drive" || type !== "facturagpt") && (
          <div className={styles.contentInput}>
            <p
              className={styles.titleContentInput}
              style={{ marginBottom: "0px" }}
            >
              {type === "Google Drive" || type === "One Drive"
                ? t("path")
                : t("senders")}
            </p>
            <div className={styles.keywordContainer}>
              {fileArrayEmails.map((keyword, index) => (
                <div className={styles.keyword} key={index}>
                  {keyword}
                  <DeleteButton
                    action={() => {
                      const updatePrev = fileArrayEmails.filter((_, i) => i !== index)
                      setFileArrayEmails(updatePrev);
                      handleConfigurationChange(
                        "filesArrayEmails",
                        updatePrev
                      );
                    }}
                  />
                </div>
              ))}
            </div>
            {!configuration?.allRemitentes && (
              <div className={styles.inputContainer}>
                <input
                  value={inputFileEmails}
                  onChange={(e) => setInputFileEmails(e.target.value)}
                  placeholder="example/path"
                  type="text"
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
                      const keywords = e.target.value;
                      if (keywords) {
                        setFileArrayEmails((prevKeywords) => {
                          const newKeywords = [...prevKeywords, keywords];
                          handleConfigurationChange(
                            "filesArrayEmails",
                            newKeywords
                          );
                          return newKeywords;
                        });
                        setInputFileEmails("");
                        setErrorInputFileEmails("");
                      } else if (keywords === "") {
                        setErrorInputFileEmails(t("pleaseEnterEmailAddress"));
                      } else {
                        setErrorInputFileEmails(t("enterValidEmailAddress"));
                      }
                    }
                  }}
                  className={styles.inputPath}
                />
              </div>
            )}
            {errorInputFileEmails && (
              <WrongAlert
                message={errorInputFileEmails}
                customCss={{ marginTop: "4px" }}
              />
            )}
            {type !== "Google Drive" && (
              <CheckboxWithText
              marginTop="10px"
              color="var(--_10a37f-background)"
              state={configuration?.allRemitentes || false}
              setState={(value) => {
                handleConfigurationChange("allRemitentes", value);
              }}
              text={t("includeAllSenders")}
              />
            )}
          </div>
        )}

        {type !== "WhatsApp" && type !== "facturagpt" && (
          <div className={styles.contentInput}>
            <p className={styles.titleContentInput}>
              {type === "Google Drive" || type === "One Drive"
                ? t("nameFiles")
                : t("subjectContains")}
            </p>
            <div className={styles.keywordContainer}>
              {fileKeywords.map((keyword, index) => (
                <div className={styles.keyword} key={index}>
                  {keyword}
                  <DeleteButton
                    action={() => {
                      setFileKeywords((prevKeywords) => {
                        const newKeywords = prevKeywords.filter(
                          (_, i) => i !== index
                        );
                        handleConfigurationChange(
                          "filesArrayKeyWords",
                          newKeywords
                        );
                        return newKeywords;
                      });
                    }}
                  />
                </div>
              ))}
            </div>
            <InputComponent
              value={inputFileKeywords}
              setValue={(value) => setInputFileKeywords(value)}
              placeholder={t("keywordsseparatedByCommas")}
              typeInput="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const keywords = e.target.value
                    .split(",")
                    .map((keyword) => keyword.trim())
                    .filter((keyword) => keyword !== "");
                  setFileKeywords((prevKeywords) => {
                    const newKeywords = [...prevKeywords, ...keywords];
                    handleConfigurationChange(
                      "filesArrayKeyWords",
                      newKeywords
                    );
                    return newKeywords;
                  });
                  setInputFileKeywords("");
                }
              }}
            />
            <CheckboxWithText
              marginTop="10px"
              color="var(--_10a37f-background)"
              state={configuration?.filesExactMatch || false}
              setState={(value) =>
                handleConfigurationChange("filesExactMatch", value)
              }
              text={t("exactMatch")}
            />
          </div>
        )}

        {type !== "Google Drive" && type !== "One Drive" && type !== "facturagpt" && (
          <div className={styles.contentInput}>
            <p className={styles.titleContentInput}>{t("bodyContains")}</p>
            <div className={styles.keywordContainer}>
              {bodyArrayKeywords.map((keyword, index) => (
                <div className={styles.keyword} key={index}>
                  {keyword}
                  <DeleteButton
                    action={() => {
                      setBodyArrayKeywords((prevKeywords) => {
                        const updatePrev = prevKeywords.filter(
                          (_, i) => i !== index
                        );
                        handleConfigurationChange(
                          "bodyArrayKeyWords",
                          updatePrev
                        );
                        return updatePrev;
                      });
                    }}
                  />
                </div>
              ))}
            </div>
            <InputComponent
              value={inputBodyKeywords}
              setValue={(value) => setInputBodyKeywords(value)}
              placeholder={t("keywordsseparatedByCommas")}
              typeInput="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const keywords = e.target.value
                    .split(",")
                    .map((keyword) => keyword.trim())
                    .filter((keyword) => keyword !== "");
                  setBodyArrayKeywords((prevKeywords) => {
                    const newKeywords = [...prevKeywords, ...keywords];
                    handleConfigurationChange("bodyArrayKeyWords", newKeywords);
                    return newKeywords;
                  });
                  setInputBodyKeywords("");
                }
              }}
            />
            <CheckboxWithText
              marginTop="10px"
              color="var(--_10a37f-background)"
              state={configuration?.bodyCoincidenceExact || false}
              setState={(value) =>
                handleConfigurationChange("bodyCoincidenceExact", value)
              }
              text={t("exactMatch")}
            />
          </div>
        )}

     {type !== "facturagpt" && (
        <div className={styles.contentInput}>
        <p
          className={styles.titleContentInput}
          style={{ marginBottom: "6px" }}
        >
          {t("attachmentType")}
        </p>

        {!configuration?.allowAllFileTypes && (
          <>
            <CustomDropdown
              options={["XML", "JSON", "PDF", "PNG", "JPG", "HTML"]}
              selectedOption={configuration?.selectedFileTypes || []}
              height="31px"
              textStyles={{
                fontWeight: 300,
                color: "#1E0045",
                fontSize: "13px",
                marginLeft: "6px",
                userSelect: "none",
              }}
              setSelectedOption={(selected) =>
                handleConfigurationChange(
                  "selectedFileTypes",
                  configuration?.selectedFileTypes?.includes(selected)
                    ? configuration?.selectedFileTypes?.filter(
                        (option) => option !== selected
                      )
                    : [...(configuration?.selectedFileTypes || []), selected]
                )
              }
              formAutomateContainerRef={formAutomateContainerRef}
            />
            {configuration?.selectedFileTypes &&
              configuration?.selectedFileTypes.length > 0 && (
                <div className={styles.cardTypesContainer}>
                  {(configuration?.selectedFileTypes || []).map((type) => (
                    <div className={styles.singleTypeCard} key={type}>
                      <span>{type}</span>
                      <DeleteButton
                        action={() =>
                          handleConfigurationChange(
                            "selectedFileTypes",
                            (configuration?.selectedFileTypes || []).filter(
                              (option) => option !== type
                            )
                          )
                        }
                      ></DeleteButton>
                    </div>
                  ))}
                </div>
              )}
          </>
        )}
        <CheckboxWithText
          marginTop="10px"
          color="var(--_10a37f-background)"
          state={configuration?.allowAllFileTypes || false}
          setState={(value) => {
            handleConfigurationChange("allowAllFileTypes", value);
            handleConfigurationChange(
              "selectedFileTypes",

              value ? ["XML", "JSON", "PDF", "PNG", "JPG", "HTML"] : []
            );
          }}
          text={t("allowAllAttachmentTypes")}
        />
      </div>
     )}

  {type !== "facturagpt" && (
         <>
         <p
           className={styles.titleContentInput}
           style={{ marginBottom: "6px" }}
         >
           {t("shippingDates")}
         </p>
         <CheckboxWithText
           marginTop="10px"
           color="var(--_10a37f-background)"
           state={configuration?.filterByPeriod || false}
           setState={(value) => {
             setShowStartDate(false);
             setShowEndDate(false);
             handleConfigurationChange("startDate", "");
             handleConfigurationChange("endDate", "");
             handleConfigurationChange("filterByPeriod", value)
           }}
           text={t("filterByPeriod")}
         />
         {configuration?.filterByPeriod ? (
           <span className={styles.quantityContainer}>
             <span />
             <div className={styles.quantityContent}>
               <div
                 className={styles.quantityContent}
                 style={{ position: "relative" }}
                 ref={startDateRef}
               >
                 <label
                   onClick={handleOpenStartCalendar}
                   style={{
                     cursor: "pointer",
                     width: "100%",
                     background: "#f4f4f4",
                     height: "35px",
                     borderRadius: "8px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     padding: "0 10px",
                     margin: 0,
                   }}
                 >
                   {startDate ? startDate : t("from")}
                 </label>
                 {showStartDate && (
                   <div className={styles.miniMap}>
                     <CalendarPopup
              selectedDay={selectedStartDay}
              setSelectedDay={setSelectedStartDay}
              onClose={() => setShowStartDate(false)}
              currentYear={calendarYear}
              setCurrentYear={setCalendarYear}
              currentMonth={calendarMonth}
              setCurrentMonth={setCalendarMonth}
            />
                   </div>
                 )}
               </div>
             </div>

             <div
               className={styles.quantityContent}
               style={{ position: "relative" }}
               ref={endDateRef}
             >
               <label
                 onClick={handleOpenEndCalendar}
                 style={{
                   cursor: "pointer",
                   width: "100%",
                   background: "#f4f4f4",
                   height: "35px",
                   borderRadius: "8px",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   padding: "0 10px",
                   margin: 0,
                 }}
               >
                 {endDate ? endDate : t("until")}
               </label>
               {showEndDate && (
                 <div className={styles.miniMap}>
                   <CalendarPopup
              selectedDay={selectedEndDay}
              setSelectedDay={(date) => {
               console.log('date',date)
               setSelectedEndDay(date)
             }} 
              onClose={() => setShowEndDate(false)}
              currentYear={calendarYear}
              setCurrentYear={setCalendarYear}
              currentMonth={calendarMonth}
              setCurrentMonth={setCalendarMonth}
            />
                 </div>
               )}
             </div>
           </span>
         ) : (
           <CustomDropdown
             options={[
               '1Day',
               '2Days',
               '3Days',
               '4Days',
               '5Days',
             ]}
             selectedOption={configuration?.date}
             height="31px"
             textStyles={{
               fontWeight: 300,
               color: "#1E0045",
               fontSize: "13px",
               marginLeft: "6px",
               userSelect: "none",
             }}
             setSelectedOption={(selected) =>
               handleConfigurationChange("date", selected)
             }
             translate={true}
             formAutomateContainerRef={formAutomateContainerRef}
           />
         )}
       </>

  )}


     {type !== "facturagpt" && (
       <CustomAutomationsWrapper
       Icon={<WhiteClock />}
       showContent={configuration?.actionFrequency}
     >
       <div className={styles.infoContainerWrapper}>
         <div
           style={{
             display: "flex",
             alignItems: "center",
             gap: "10px",
           }}
         >
           {configuration?.actionFrequency && (
             <GreenClock stroke="var(--_10a37f-background)" style={{ color: "var(--_10a37f-background)" }} />
           )}
           <div className={styles.infoContainer}>
             <div>{t("selectFrequencyActionExecuted")}</div>
             <span>{t("ifThisOptionNotChecked")}</span>
           </div>
         </div>

         <OptionsSwitchComponent
           border={"none"}
           marginLeft={"auto"}
           isChecked={configuration?.actionFrequency || false}
           setIsChecked={(value) =>
             handleConfigurationChange("actionFrequency", value)
           }
         />
       </div>
       <div
         className={`${styles.contentContainer} ${configuration?.actionFrequency ? styles.active : styles.disabled}`}
       >
         <CustomDropdown
           options={[
             t("default"),
             t("30Minutes"),
             t("1Hour"),
             t("6Hour"),
             t("12Hour"),
           ]}
           selectedOption={configuration?.selectedActionFrequency || []}
           height="31px"
           textStyles={{
             fontWeight: 300,
             color: "#1E0045",
             fontSize: "13px",
             marginLeft: "6px",
             userSelect: "none",
           }}
           setSelectedOption={(selected) =>
             handleConfigurationChange("selectedActionFrequency", selected)
           }
           formAutomateContainerRef={formAutomateContainerRef}
         />
       </div>
     </CustomAutomationsWrapper>

     )}

      </div>
    </CustomAutomationsWrapper>
  );
};

const FilterInfoDateKey = (props) => {
  return (
    <CalendarContextProvider>
      <FilterInfoDateKeyComponent {...props} />
    </CalendarContextProvider>
  );
};

export default FilterInfoDateKey;
