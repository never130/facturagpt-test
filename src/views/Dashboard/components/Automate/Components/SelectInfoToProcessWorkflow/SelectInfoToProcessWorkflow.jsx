import React, { useState } from 'react'
import CustomAutomationsWrapper from '../../../CustomAutomationsWrapper/CustomAutomationsWrapper'
import { ReactComponent as GrayChevron } from "../../../../assets/grayChevron.svg";
import { ReactComponent as SearchWhite } from "../../../../assets/searchWhite.svg";
import { ReactComponent as SearchGreen } from "../../../../assets/SearchIconGreen.svg";
import styles from './SelectInfoToProcessWorkflow.module.css';
import { useTranslation } from 'react-i18next';
import FilterInfoDateKey from '../FilterInfoDateKey/FilterInfoDateKey';

const SelectInfoToProcessWorkflow = ({
    configuration,
    handleConfigurationChange,
    formAutomateContainerRef,
    type,
}) => {
    const [showContent, setShowContent] = useState({
        info1: false,
      });
      const { t } = useTranslation();
  return (
    <CustomAutomationsWrapper
    Icon={<SearchWhite />}
    showContent={showContent.info1}
  >
    <div
      className={styles.infoContainerWrapper}
      onClick={() => setShowContent({...showContent, info1: !showContent.info1})}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {showContent.info1 && <SearchGreen />}
        <div className={styles.infoContainer}>
          <div>{t("selectInfoToProcess")}</div>
          <span>{t("selectInfoToProcessDescription")}</span>
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
      className={` ${styles.contentContainer} ${showContent.info1 ? styles.active : styles.disabled}`}
      style={{
        display: showContent.info1 ? "flex" : "none",
        flexDirection: "column",
      }}
      >
        

        <CustomAutomationsWrapper
      Icon={<SearchWhite />}
      showContent={showContent.info2}
    >
      <div
        className={styles.infoContainerWrapper}
        onClick={() => setShowContent({...showContent, info2: !showContent.info2})}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
          }}
        >
          {showContent.info2 && (
            <SearchGreen stroke="var(--_10a37f-background)" style={{ color: "var(--_10a37f-background)" }} />
          )}
          <div className={styles.infoContainer}>
            <div>{t("configureKeyDataIdentification")}</div>
            <span>{t("configureFiltersToExtractKey")}</span>
          </div>
        </div>
        <GrayChevron
          style={{
            transform: showContent.info2 ? "rotate(180deg)" : "",
            transition: "transform 0.3s ease-in-out",
            fill:'#71717A'
          }}
        />
      </div>
      <div
        className={`${styles.contentContainer} ${showContent.info2 ? styles.active : styles.disabled}`}
      >
        contenido de configura la identificacion de datos claves
        </div>
      </CustomAutomationsWrapper>






        <CustomAutomationsWrapper
      Icon={<SearchWhite />}
      showContent={showContent.info3}
    >
      <div
        className={styles.infoContainerWrapper}
        onClick={() => setShowContent({...showContent, info3: !showContent.info3})}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
          }}
        >
          {showContent.info3 && (
            <SearchGreen stroke="var(--_10a37f-background)" style={{ color: "var(--_10a37f-background)" }} />
          )}
          <div className={styles.infoContainer}>
            <div>{t("selectTimeOffset")}</div>
            <span>{t("selectTimeOffsetDescription")}</span>
          </div>
        </div>
        <GrayChevron
          style={{
            transform: showContent.info3 ? "rotate(180deg)" : "",
            transition: "transform 0.3s ease-in-out",
            fill:'#71717A'
          }}
        />
      </div>
      <div
        className={`${styles.contentContainer} ${showContent.info3 ? styles.active : styles.disabled}`}
      >
        contenido de configura la identificacion de datos claves
        </div>
      </CustomAutomationsWrapper>



    {/* <FilterInfoDateKey
      configuration={configuration}
      handleConfigurationChange={handleConfigurationChange}
      formAutomateContainerRef={formAutomateContainerRef}
      type={type}
    /> */}
      </div>
      </CustomAutomationsWrapper>
  )
}

export default SelectInfoToProcessWorkflow