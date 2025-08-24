import CustomAutomationsWrapper from "../CustomAutomationsWrapper/CustomAutomationsWrapper";
import { ReactComponent as FileDir } from "../../assets/FileCarpet.svg";
import { ReactComponent as GrayChevron } from "../../assets/grayChevron.svg";
import { ReactComponent as SearchSVG } from "../../assets/searchGray.svg";
import { ReactComponent as TtGreen } from "../../assets/TtGreen.svg";
import { ReactComponent as TtWhite } from "../../assets/TtWhite.svg";
import { ReactComponent as SettingsGreen } from "../../assets/SettingsGreen.svg";
import { ReactComponent as SettingsWhite } from "../../assets/SettingsWhite.svg";
import { ReactComponent as GreenFileDir } from "../../assets/GreenFileDesk.svg";
import styles from "./SaveProcessDocument.module.css";
import React, { useEffect, useState } from "react";
import InputComponent from "../InputComponent/InputComponent";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import OptionsSwitchComponent from "../OptionsSwichComponent/OptionsSwitchComponent";
import Advertency from "../Automate/Components/Advertency/Advertency";
import Button from "../Button/Button";
import SelectLocation from "../SelectLocation/SelectLocation";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DeleteButton from "../DeleteButton/DeleteButton";
import SelectCategoryAndConcept from "../Automate/Components/SelectCategoryAndConcept/SelectCategoryAndConcept";
import CreateNote from "../Automate/Components/CreateNote/CreateNote";
import ColorPicker from "../ColorPicker/ColorPicker";

const SaveProcessDocument = ({
  configuration,
  handleConfigurationChange,
  formAutomateContainerRef,
  typeVariableModal,
  setTypeVariableModal,
  showVariableListModal,
  setShowVariableListModal,
  showVariableModal,
  setShowVariableModal,
}) => {
  const [t] = useTranslation("AutomatesComponent");
  const [showSelectOutputLocation, setShowSelectOutputLocation] =
    useState(false);
    const [showColorPicker,setShowColorPicker] = useState(false)
    const [presetColors, setPresetColors] = useState([]);
  
  const [dataCategoryConcept, setDataCategoryConcept] = useState([]);
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

  const automate = useSelector((state) => state.automate);

  const handleSetShowContent = (infoNumber) => {
    
    setShowContent((prev) => {
      const newShowContent = { ...prev, [infoNumber]: !prev[infoNumber] };
      handleConfigurationChange("docsProcessedShowContent", newShowContent);
      return newShowContent;
    });
  };

  useEffect(() => {
    if (
      configuration?.docsProcessedShowContent &&
      JSON.stringify(configuration?.docsProcessedShowContent) !==
        JSON.stringify(showContent)
    ) {
      setShowContent(configuration?.docsProcessedShowContent);
    } else if (
      configuration?.docsProcessedShowContent === null ||
      configuration?.docsProcessedShowContent === "" ||
      configuration?.docsProcessedShowContent === undefined
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
  }, [configuration?.docsProcessedShowContent]);

  useEffect(() => {
    if (
      configuration?.categoryConcept &&
      JSON.stringify(configuration?.categoryConcept) !==
        JSON.stringify(dataCategoryConcept)
    ) {
      setDataCategoryConcept(configuration?.categoryConcept);
    }
  }, [configuration?.categoryConcept]);

  return (
    <CustomAutomationsWrapper
      Icon={<FileDir />}
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
            gap: "10px",
          }}
        >
          {showContent.info1 && <GreenFileDir />}
          <div className={styles.infoContainer}>
            <div>{t("decideWhereSave")}</div>
            <span>{t("chooseLocation")}</span>
          </div>
        </div>
        <GrayChevron
          style={{
            transform: showContent.info1 ? "rotate(180deg)" : "",
            transition: "transform 0.3s ease-in-out",
            fill:'#71717A'
          }}
        />
      </div>
      <div
        className={`${styles.contentContainer} ${showContent.info1 ? styles.active : styles.disabled}`}
      >
        <div>
          <label className={styles.formLabel}>{t("selectLocation")}</label>
          <InputComponent
            readOnly={true}
            value={configuration?.docsProcessedFolderLocation || ""}
            setValue={(value) => {
              handleConfigurationChange("docsProcessedFolderLocation", value);
            }}
            textButton={t("selectLocation")}
            placeholder={t("home")}
            icon={<SearchSVG />}
            action={() => setShowSelectOutputLocation(true)}
            fromImport={"fromImport"}
          />
        </div>
        {/* <div
          className={`${styles.contentContainer} ${showContent.info1 ? styles.active : styles.disabled}`}
        >
          <p style={{ marginBottom: "10px" }} className={styles.formLabel}>
            {t("fileFormat")}
          </p>
          <CustomDropdown
            options={["XML", "JSON", "PDF", "PNG", "JPG", "HTML"]}
            selectedOption={
              configuration?.docsProcessedSelectedStandardExport || []
            }
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
                "docsProcessedSelectedStandardExport",
                selected
              )
            }
            formAutomateContainerRef={formAutomateContainerRef}
          />
        </div> */}
        <CustomAutomationsWrapper
          Icon={<TtWhite />}
          showContent={showContent.info2}
        >
          <div
            className={styles.infoContainerWrapper}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {showContent.info2 && <TtGreen />}
              <div className={styles.infoContainer}>
                <div>{t("automaticallyRenameFiles")}</div>
                <span>{t("setClearCustomNames")}</span>
              </div>
            </div>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"auto"}
              isChecked={showContent.info2}
              setIsChecked={(value) => {
                handleSetShowContent("info2");
              }}
            />
          </div>
          <div
            className={`${styles.contentContainer} ${showContent.info2 ? styles.active : styles.disabled}`}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <InputComponent
                value={configuration?.docsProcessedFilesKeyWords}
                setValue={(value) =>
                  handleConfigurationChange("docsProcessedFilesKeyWords", value)
                }
                placeholder={t("fileName[]")}
                typeInput="text"
              />
              <Advertency
                text={`${t("write")} ${
                  automate.allVariablesFromEnPointUse.length > 3
                    ? automate.allVariablesFromEnPointUse.map(
                        (variable, index) => {
                          if (index >= 6) {
                            return "";
                          }
                          return ` [${variable.title}]`;
                        }
                      )
                    : automate.allVariablesFromEnPointUse.length > 0
                      ? `${automate.allVariablesFromEnPointUse.map(
                          (variable) => ` [${variable.title}]`
                        )} [id], [title], [date], [totalamount]`
                      : "[id], [title], [date], [totalamount], [contactid], [category]"
                } ${t("toCustomizeUploadedDocuments")}`}
              />
            </div>
          </div>
        </CustomAutomationsWrapper>
        <CustomAutomationsWrapper
          Icon={<SettingsWhite />}
          showContent={showContent.info3}
        >
          <div
            className={styles.infoContainerWrapper}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {showContent.info3 && <SettingsGreen />}
              <div className={styles.infoContainer}>
                <div>{t("configureCategoryStatusProcessed")}</div>
                <span>{t("ifThisOptionNotSelected")}</span>
              </div>
            </div>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"auto"}
              isChecked={showContent.info3}
              setIsChecked={(value) => {
                handleSetShowContent("info3");
              }}
            />
          </div>
          <div
            className={`${styles.contentContainer} ${showContent.info3 ? styles.active : styles.disabled}`}
          >
            <div className={styles.selectedVariablesContainer}>
              {configuration?.selectedVariables?.map((variable, index) => (
                <div key={index} className={styles.selectedVariables}>
                  {variable.title}{" "}
                  <DeleteButton
                    action={() => console.log(`eliminando ${variable.title}`)}
                  />
                </div>
              ))}
            </div>
            <div>
              <SelectCategoryAndConcept
                typeVariableModal={typeVariableModal}
                setTypeVariableModal={setTypeVariableModal}
                showVariableListModal={showVariableListModal}
                setShowVariableListModal={setShowVariableListModal}
                showVariableModal={showVariableModal}
                setShowVariableModal={setShowVariableModal}
              />
            </div>
            <CreateNote configuration={configuration} handleConfigurationChange={handleConfigurationChange} showCirclesColor={false} setShowColorPicker={setShowColorPicker} colorNote={configuration.colorNote}/>
          
            {showColorPicker && (
        <ColorPicker
          setShowColorPicker={() => setShowColorPicker(null)}
          color={configuration.colorNote}
          setColor={(newColor) => handleConfigurationChange('colorNote', newColor)}
          presetColors={presetColors}
          setPresetColors={setPresetColors}
        />
      )}
           
          </div>
        </CustomAutomationsWrapper>
      </div>
      {showSelectOutputLocation && (
        <SelectLocation
          onClose={() => setShowSelectOutputLocation(false)}
          pickLocation={(location) => {
            handleConfigurationChange("docsProcessedFolderLocation", location);
          }}
        />
      )}
    </CustomAutomationsWrapper>
  );
};

export default SaveProcessDocument;
