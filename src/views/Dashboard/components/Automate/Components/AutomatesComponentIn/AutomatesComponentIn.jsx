import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAutomation,
  getWhatssapQr,
  updateAutomation,
} from "../../../../../../actions/automate";
import AutomateCreateIn from "../AutomateCreateIn/AutomateCreateIn";
import { ReactComponent as GmailIcon } from "../../../../assets/gmailwithoutbg.svg";
import { ReactComponent as OutlookIcon } from "../../../../assets/outlook.svg";
import { ReactComponent as EmailIcon } from "../../../../assets/email.svg";
import { ReactComponent as DriveIcon } from "../../../../assets/driveCircle.svg";
import { ReactComponent as DropboxIcon } from "../../../../assets/dropbox-icon.svg";
import { ReactComponent as WhatsAppIcon } from "../../../../assets/whatsappIcon.svg";
import { ReactComponent as SharepointIcon } from "../../../../assets/sharePointCircle.svg";
import { ReactComponent as OneDriveIcon } from "../../../../assets/oneDriveCircle.svg";
import AddConnectionModal from "../AddConenctionModal/AddConnectionModal";
import styles from "./AutomatesComponentIn.module.css";
import { useTranslation } from "react-i18next";
import VariableModal from "../../../VariableModal/VariableModal";

const AutomatesComponentIn = ({
  type,
  automationData,
  formAutomateContainerRef,
  saveConfiguration,
  typeVariableModal,
  setTypeVariableModal,
  showVariableListModal,
  setShowVariableListModal,
  showVariableModalIn,
  setShowVariableModalIn, cardSelected,
  selectedAgent,
  configuration,
  setConfiguration,
  toggleChatSettings,
  setToggleChatSettings
}) => {
  const [t] = useTranslation("AutomatesComponent");

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const whatsappQr = useSelector((state) => state.automate.whatsappQr);



  const [showCategory, setShowCategory] = useState(false);
  const [showFormtoGetQr, setShowFormtoGetQr] = useState(true);
  const [deviceName, setDeviceName] = useState("");

  const [showQrWhatsApp, setShowQrWhatsApp] = useState(false);
  const [qr, setQr] = useState("");
  const [showVariableModal, setShowVariableModal] = useState(false);

  const formRef = useRef(null);

  const handlePopUps = (fromWhat) => {

    if (fromWhat === "qr") {
      setShowQrWhatsApp((prev) => {
        if (!showFormtoGetQr) {
          setShowFormtoGetQr(true);
        }
        return !prev;
      });
    } else {
      setShowCategory((prev) => !prev);
    }
  };

  const generateQR = async (e) => {
    e.preventDefault();
    dispatch(getWhatssapQr({ userId: user.id, deviceName }));
    setDeviceName("");
    setShowFormtoGetQr(false);
  };



  useEffect(() => {
    setQr(whatsappQr);
    return () => {
      setQr("");
    };
  }, [whatsappQr]);

  useEffect(() => {
    function clearObject(obj) {
      if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, clearObject(value)])
        );
      }
      return "";
    }

    setConfiguration((prev) => {
      const newConfigurationData = clearObject(prev);
      return newConfigurationData;
    });


  }, [type]);

  useEffect(() => {
    if (automationData) {
      setConfiguration(automationData)

    }
  }, [automationData]);

  useEffect(() => {
    if (saveConfiguration) {
      const handleAddAutomation = async () => {

        let selectedAutomationData;
        selectedAutomationData = {
          ...configuration,
          type: type,
        }

        if (
          type === "Gmail" ||
          type === "Outlook" ||
          type === "WhatsApp" ||
          type === "Google Drive" ||
          type === "Dropbox" ||
          type === "One Drive" ||
          type === "Sharepoint" ||
          type === "facturagpt" 

        ) {
          if (user && selectedAutomationData?.id) {
            dispatch(
              updateAutomation({
                automationId: selectedAutomationData?._id,
                toUpdate: { ...cardSelected, ...selectedAutomationData },
                userId: user?.id,
              })
            );
          } else if (user) {
            dispatch(
              createAutomation({
                userId: user?.id,
                email: user?.email,
                automationData: { ...cardSelected, ...selectedAutomationData },
              })
            );
          }
        }
      };
      handleAddAutomation();
    }
  }, [saveConfiguration]);


  useEffect(() => {
    if (formRef.current && showFormtoGetQr) {
      formRef.current.focus();
    }
  }, [showFormtoGetQr, showQrWhatsApp]);

  return (
    <>
      <AutomateCreateIn
        type={type}
        configuration={configuration}
        setConfiguration={setConfiguration}
        setShowCategory={handlePopUps}
        formAutomateContainerRef={formAutomateContainerRef}
        iconType={<GmailIcon height={"25px"} width={"25px"} />}
        IconHeaderModAddConnection={GmailIcon}
        typeVariableModal={typeVariableModal}
        setTypeVariableModal={setTypeVariableModal}
        showVariableListModal={showVariableListModal}
        setShowVariableListModal={setShowVariableListModal}
        showVariableModal={showVariableModalIn}
        setShowVariableModal={setShowVariableModalIn}
        selectedAgent={selectedAgent}
        toggleChatSettings={toggleChatSettings}
        setToggleChatSettings={setToggleChatSettings}
      />

      <VariableModal
        setShowVariableModal={setShowCategory}
        VariableModal={showCategory}
        type={"category"}
        configuration={configuration}
        setConfiguration={setConfiguration}
      />


      {showQrWhatsApp && (
        <AddConnectionModal
          close={() => handlePopUps("qr")}
          type="WhatsApp"
          icon={<WhatsAppIcon />}
          IconHeader={<WhatsAppIcon height={"30px"} width={"30px"} />}
          custonHeight="auto"
          customCss={"customCss"}
          selectedAgent={selectedAgent}
        >
          {qr ? (
            <div className={styles.qrContainer}>
              <img src={qr} alt="whatsapp" />
            </div>
          ) : showFormtoGetQr ? (
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                generateQR(e);
              }}
              className={styles.formContent}
              ref={formRef}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Escape") {
                  setShowFormtoGetQr(false);
                  setShowQrWhatsApp(false);
                }
              }}
              tabIndex="0"
            >
              <div className={styles.contentInput}>
                <label htmlFor="deviceName">{t("deviceName")}</label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    id="deviceName"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder={t("MyPhoneWorkPhone")}
                    required
                    className={styles.inputNameDevice}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={deviceName.length < 3}
                className={styles.buttonNameDevice}
              >
                {t("generateQrCode")}
              </button>
            </form>
          ) : (
            <div className={styles.qrContainer}>
              <span className={styles.loader}></span>
            </div>
          )}
        </AddConnectionModal>
      )}
    </>
  );
};

export default AutomatesComponentIn;
