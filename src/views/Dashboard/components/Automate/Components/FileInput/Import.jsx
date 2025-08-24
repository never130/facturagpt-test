import React, { useEffect, useState } from "react";

import CustomAutomationsWrapper from "../../../CustomAutomationsWrapper/CustomAutomationsWrapper";

import { ReactComponent as WhiteFolder } from "../../../../assets/whiteFolder.svg";
import { ReactComponent as GrayChevron } from "../../../../assets/grayChevron.svg";
import { ReactComponent as ArrowSquare } from "../../../../assets/whiteArrowSquareIn.svg";
import { ReactComponent as ArrowSquareInGreen } from "../../../../assets/ArrowSquareInGreen.svg";
import { ReactComponent as GreenFileDesk } from "../../../../assets/GreenFileDesk.svg";
import { ReactComponent as TorkWhiteIcon } from "../../../../assets/TorkWhiteIcon.svg";
import { ReactComponent as TorkGreenIcon } from "../../../../assets/TorkGreenIcon.svg";

import styles from "./FileInput.module.css";

import InputComponent from "../../../InputComponent/InputComponent";
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";

import OptionsSwitchComponent from "../../../OptionsSwichComponent/OptionsSwitchComponent";

import SearchSVG from "../../svgs/SearchSVG";
import DeleteButton from "../../../DeleteButton/DeleteButton";
import Advertency from "../Advertency/Advertency";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SelectCategoryAndConcept from "../SelectCategoryAndConcept/SelectCategoryAndConcept";
import CreateNote from "../CreateNote/CreateNote";
import ColorPicker from "../../../ColorPicker/ColorPicker";

const FileInputImport = ({
  configuration,
  handleConfigurationChange,
  setShowSelectOutputLocation,
  formAutomateContainerRef,
  renderedInBillComponent,
  typeVariableModal,
  setTypeVariableModal,
  showVariableListModal,
  setShowVariableListModal,
  showVariableModal,
  setShowVariableModal,
}) => {
  const [t] = useTranslation("AutomatesComponent");

  const [dataCategoryConcept, setDataCategoryConcept] = useState([]);
  const [showColorPicker,setShowColorPicker] = useState(false)
  const [presetColors, setPresetColors] = useState([]);

  const [showContent, setShowContent] = useState({
    info1: false,
    info2: false,
    info3: false,
  });

  const automate = useSelector((state) => state.automate);

  useEffect(() => {
    const compareValues =
      JSON.stringify(configuration.showContentImport) !==
      JSON.stringify(showContent);
    if (configuration.showContentImport && compareValues) {
      setShowContent(configuration.showContentImport);
    } else if (
      configuration?.showContentImport === null ||
      configuration?.showContentImport === "" ||
      configuration?.showContentImport === undefined
    ) {
      setShowContent({
        info1: false,
        info2: false,
        info3: false,
      });
    }
  }, [configuration.showContentImport]);

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
      Icon={<WhiteFolder />}
      showContent={showContent.info1}
    >
      <div
        className={`${styles.infoContainerWrapper}`}
        onClick={() => {
          setShowContent({ ...showContent, info1: !showContent.info1 });
          handleConfigurationChange("showContentImport", {
            ...showContent,
            info1: !showContent.info1,
          });
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {showContent.info1 && <GreenFileDesk />}
          <div className={styles.infoContainer}>
            <div>{t("decideWhereSaveProcessedDocuments")}</div>
            <span>{t("chooseLocationFacturaGptOrganizeFiles")}</span>
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
        <div className={styles.contentInput}>
          <p className={styles.titleContentInput}>{t("location")}</p>

          <InputComponent
            readOnly={true}
            value={configuration?.folderLocation || ''}
            setValue={(value) =>
              handleConfigurationChange("folderLocation", value)
            }
            textButton={t("selectLocation")}
            placeholder="/Inicio"
            icon={<SearchSVG />}
            action={() => setShowSelectOutputLocation(true)}
            fromImport={"fromImport"}
            />
            {renderedInBillComponent && (
              <Advertency
            text={t('firtsDayMonth')}
            />
            )}
        </div>
        {!renderedInBillComponent && (
          <>
        {/* <div className={styles.contentInput}>
          <p
            className={styles.titleContentInput}
            style={{ marginBottom: "6px" }}
          >
            {t("fileFormat")}
          </p>

          <CustomDropdown
            options={["XML", "JSON", "PDF", "PNG", "JPG", "HTML"]}
            selectedOption={configuration?.fileFormat || []}
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
                "fileFormat",
                configuration?.fileFormat?.includes(selected)
                  ? configuration?.fileFormat?.filter(
                    (option) => option !== selected
                  )
                  : [...(configuration?.fileFormat || []), selected]
              )
            }
            formAutomateContainerRef={formAutomateContainerRef}
          />
          <div className={styles.cardTypesContainer}>
            {(configuration?.fileFormat || []).map((type) => (
              <div className={styles.singleTypeCard} key={type}>
                <span>{type}</span>
                <DeleteButton
                  action={() =>
                    handleConfigurationChange(
                      "fileFormat",
                      (configuration?.fileFormat || []).filter(
                        (option) => option !== type
                      )
                    )
                  }
                ></DeleteButton>
              </div>
            ))}
          </div>
        </div> */}


<CustomAutomationsWrapper
          Icon={<ArrowSquare />}
          showContent={configuration?.selectStandardExport}
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
              {configuration?.selectStandardExport && (
                <ArrowSquareInGreen height="65px" width="65px" />
              )}
              <div className={styles.infoContainer}>
                <div>{t("automaticallyRenameFiles")}</div>
                <span>{t("setClearCustomNames")}</span>
              </div>
            </div>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"auto"}
              isChecked={configuration?.selectStandardExport || false}
              setIsChecked={(value) =>
                handleConfigurationChange("selectStandardExport", value)
              }
            />
          </div>
          <div
            className={`${styles.contentContainer} ${configuration?.selectStandardExport ? styles.active : styles.disabled}`}
          >
            <InputComponent
              value={configuration?.renameFile}
              setValue={(value) =>
                handleConfigurationChange("renameFile", value)
              }
              placeholder={t("fileName[]")}
            />
            <Advertency
              text={`Escribe ${automate.allVariablesFromEnPointUse.length > 3
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
        </CustomAutomationsWrapper>
        <CustomAutomationsWrapper
          Icon={<TorkWhiteIcon />}
          showContent={configuration?.actionExtractionFrequency}
        >
          <div className={styles.infoContainerWrapper} style={{ gap: "10px" }}>
            <div
              className={styles.infoContainer}
              onClick={() =>
                setShowContent({ ...showContent, info3: !showContent.info3 })
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {configuration?.actionExtractionFrequency && (
                  <TorkGreenIcon height="45px" width="45px" />
                )}
                <div className={styles.infoContainer}>
                  <div>{t("configureCategoryStatusProcessed")}</div>
                  <span>{t("ifThisOptionNotSelected")}</span>
                </div>
              </div>
            </div>

            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"auto"}
              isChecked={configuration?.actionExtractionFrequency || false}
              setIsChecked={(value) =>
                handleConfigurationChange("actionExtractionFrequency", value)
              }
            />
          </div>
          <div
            className={`${styles.contentContainer} ${configuration?.actionExtractionFrequency ? styles.active : styles.disabled}`}
          >

            <div className={styles.selectedVariablesContainer}>
              {configuration?.selectedVariables?.map((variable, index) => (
                <div key={index} className={styles.selectedVariables}>
                  {variable.title} <DeleteButton action={() => console.log(`eliminando ${variable.title}`)} />
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
        </>

)}

      </div>
    </CustomAutomationsWrapper>
  );
};

export default FileInputImport;
