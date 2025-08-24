import React, { useEffect, useState } from "react";
import styles from "./MoveToFolder.module.css";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import InputComponent from "../InputComponent/InputComponent";
import SearchSVG from "../Automate/svgs/SearchSVG";
import SelectLocation from "../SelectLocation/SelectLocation";
import { useTranslation } from "react-i18next";
const MoveToFolder = ({
  showMovetoFolder,
  setShowMovetoFolder,
  configuration,
  setConfiguration,
  isAnimating,
  setIsAnimating,
  changeFileLocation,
}) => {
  const [t] = useTranslation("Preview");
  const [showSelectInputLocation, setShowSelectInputLocation] = useState(false);
  const handleConfigurationChange = (key, value) => {
    setConfiguration((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCloseNewClient = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowMovetoFolder(false);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showMovetoFolder) {
        setIsAnimating(true);
        setTimeout(() => {
          setShowMovetoFolder(false);
          setIsAnimating(false);
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMovetoFolder]);

  return (
    <div className={styles.overlay}>
      <div className={styles.bg} onClick={() => handleCloseNewClient()}></div>
      <div
        className={`${styles.moveToFolder}  ${isAnimating ? styles.scaleDown : styles.scaleUp}`}
      >
        <div className={`${styles.statusMessage} ${styles.success}`}>
          <HeaderCard title={t("moveToFolder")} setState={handleCloseNewClient}>
            <Button type="white" action={handleCloseNewClient}>
              {t("cancel")}
            </Button>
            <Button
              action={() => {
                changeFileLocation();
                handleCloseNewClient();
              }}
            >
              {t("acept")}
            </Button>
          </HeaderCard>
          <div className={styles.contentInput}>
            <div>
              <p className={styles.titleContentInput}>{t("location")}</p>

              <InputComponent
                readOnly={true}
                value={
                  configuration?.filesSource?.split("/")?.slice(1).join("/") ||
                  "/Inicio/"
                }
                setValue={(value) =>
                  handleConfigurationChange("filesSource", value)
                }
                textButton={t("selectLocation")}
                placeholder={
                  configuration?.filesSource?.split("/")?.slice(1).join("/") ||
                  "/Inicio/"
                }
                icon={<SearchSVG />}
                action={() => setShowSelectInputLocation(true)}
              />
            </div>
          </div>
        </div>
        {showSelectInputLocation && (
          <SelectLocation
            onClose={() => setShowSelectInputLocation(false)}
            pickLocation={(location) => {
              ("location", location);
              handleConfigurationChange("filesSource", location);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MoveToFolder;
