import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createAutomation,
  getWhatssapQr,
  updateAutomation,
} from "../../../../../../actions/automate";
import AutomateCreateOut from "../AutomateCreateOut/AutomateCreateOut";

import { updateChatsAgents } from "../../../../../../actions/agents";

import { ReactComponent as TelematelIcon } from "../../../../assets/telematel.svg";
import { ReactComponent as GoogleSheetsIcon } from "../../../../assets/excelCircle.svg";
import { ReactComponent as XMLIcon } from "../../../../assets/XMLBig.svg";
import { ReactComponent as OdooIcon } from "../../../../assets/OdooCircleNew.svg";
import { ReactComponent as WoltersIcon } from "../../../../assets/wolters-icon.svg";
import { ReactComponent as AgencyIcon } from "../../../../assets/agenciaTributariaCircle.svg";
import { ReactComponent as FTPIcon } from "../../../../assets/WhiteFTPCircle.svg";
import { ReactComponent as HoldedIcon } from "../../../../assets/WhiteHoldedCircle.svg";

import { ReactComponent as WhatsAppIcon } from "../../../../assets/whatsappIcon.svg";
import { ReactComponent as EsPublico } from "../../../../assets/gestionaEsPubliconNewLogoCircle.svg";
import AddConnectionModal from "../AddConenctionModal/AddConnectionModal";
import styles from "./AutomatesComponentOut.module.css";
import { useTranslation } from "react-i18next";
import VariableModal from "../../../VariableModal/VariableModal";

const AutomatesComponentOut = ({
  type,
  typeContent,
  automationData,
  formAutomateContainerRef,
  saveConfiguration,
  close,
  setIsModalAutomate,
  typeVariableModal, setTypeVariableModal,
  showVariableListModal, setShowVariableListModal,
  showVariableModal, setShowVariableModal, setHideAutomate, cardSelected,
  setQuestion,
  selectedAgent,
  configuration,
  setConfiguration,
  toggleChatSettings,
  setToggleChatSettings,
  setRoleAutomate
}) => {
  const dispatch = useDispatch();

  const [t] = useTranslation("AutomatesComponent");

  const { user } = useSelector((state) => state.user);
  const gloabalstate = useSelector((state) => state.automate);
  const [showCategory, setShowCategory] = useState(false);

  const [showFormtoGetQr, setShowFormtoGetQr] = useState(true);
  const [deviceName, setDeviceName] = useState("");
  const [showQrWhatsApp, setShowQrWhatsApp] = useState(false);
  const [qr, setQr] = useState("");
  const whatsappQr = useSelector((state) => state.automate.whatsappQr);



  const [esPublicoGestionaConfiguration, setEsPublicoGestionaConfiguration] =
    useState({
      type: "esPúblico Gestiona",
      folderLocation: "/Inicio/",
      selectedPublicoGestionaConnection: "",
      publicoGestionaConnectionData: [],
      notificateAfterExport: false,
      notificateGmail: false,
      notificateWhatsApp: false,
      gmailTo: "",
      gmailSubject: "",
      gmailBody: "",
      whatsAppToNotificate: "",
      whatsAppMessage: "",
      notificateAfterError: false,
      notificateErrorGmail: false,
      notificateErrorWhatsApp: false,
      errorGmailTo: "",
      errorGmailSubject: "",
      errorGmailBody: "",
      errorWhatsAppToNotificate: "",
      errorWhatsAppMessage: "",
      inputType: true,
    });

  const [googleSheetsConfiguration, setGoogleSheetsConfiguration] = useState({
    type: "Google Sheets",
    selectedGoogleSheetsConnection: "",
    googleSheetsConnectionData: [],
    sheetId: "",
    sheetTitle: "",
    generalConfiguration: {},
    notificateAfterCreatingRow: true,
    notificateGmail: false,
    notificateWhatsApp: false,
    gmailTo: "",
    gmailSubject: "",
    gmailBody: "",
    whatsAppToNotificate: "",
    whatsAppMessage: "",
    inputType: false,
  });

  const [XMLConfiguration, setXMLConfiguration] = useState({
    type: "XML",
    fileName: "",
    filesSource: "/Inicio/",
    folderLocation: "/Inicio/",
    formatType: "",
    notificateAfterExport: true,
    notificateGmail: false,
    notificateWhatsApp: false,
    gmailTo: "",
    gmailSubject: "",
    gmailBody: "",
    whatsAppToNotificate: "",
    whatsAppMessage: "",
    notificateAfterError: false,
    notificateErrorGmail: false,
    notificateErrorWhatsApp: false,
    errorGmailTo: "",
    errorGmailSubject: "",
    errorGmailBody: "",
    errorWhatsAppToNotificate: "",
    errorWhatsAppMessage: "",
    inputType: false,
  });

  const [odooConfiguration, setOdooConfiguration] = useState({
    type: "Odoo",
    selectedOdooConnection: "",
    odooConnectionData: [],
    filesSource: "/Inicio/",
    folderLocation: "/Inicio/",
    formatType: "",
    changeFileName: false,
    fileName: "",
    addTag: false,
    tags: [],
    notificateAfterExport: true,
    notificateGmail: false,
    notificateWhatsApp: false,
    gmailTo: "",
    gmailSubject: "",
    gmailBody: "",
    whatsAppToNotificate: "",
    whatsAppMessage: "",
    notificateAfterError: false,
    notificateErrorGmail: false,
    notificateErrorWhatsApp: false,
    errorGmailTo: "",
    errorGmailSubject: "",
    errorGmailBody: "",
    errorWhatsAppToNotificate: "",
    errorWhatsAppMessage: "",
    inputType: false,
  });

  const [woltersConfiguration, setWoltersConfiguration] = useState({
    type: "Wolters",
    selectedWoltersConnection: "",
    woltersConnectionData: [],
    filesSource: "",
    folderLocation: "/Inicio/",
    formatType: "",
    changeFileName: false,
    fileName: "",
    notificateAfterExport: true,
    notificateGmail: false,
    notificateWhatsApp: false,
    gmailTo: "",
    gmailSubject: "",
    gmailBody: "",
    whatsAppToNotificate: "",
    whatsAppMessage: "",
    notificateAfterError: false,
    notificateErrorGmail: false,
    notificateErrorWhatsApp: false,
    errorGmailTo: "",
    errorGmailSubject: "",
    errorGmailBody: "",
    errorWhatsAppToNotificate: "",
    errorWhatsAppMessage: "",
    inputType: false,
  });

  const [agenciaConfiguration, setAgenciaConfiguration] = useState({
    type: "Agencia",
    selectedAgenciaConnection: "",
    agenciaConnectionData: [],
    notificateAfterExport: true,
    notificateGmail: false,
    notificateWhatsApp: false,
    gmailTo: "",
    gmailSubject: "",
    gmailBody: "",
    whatsAppToNotificate: "",
    whatsAppMessage: "",
    notificateAfterError: false,
    notificateErrorGmail: false,
    notificateErrorWhatsApp: false,
    errorGmailTo: "",
    errorGmailSubject: "",
    errorGmailBody: "",
    errorWhatsAppToNotificate: "",
    errorWhatsAppMessage: "",
    inputType: false,
  });

  const [
    whatsAppNotificationsConfiguration,
    setWhatsAppNotificationsConfiguration,
  ] = useState({
    type: "whatsApp notifications",
    selectedWhatsAppConnection: "",
    whatsAppConnectionData: [],
    phoneNumbers: [],
    notificationsFromFolder: "/Inicio/",
    newFileNotification: true,
    tagUpdateNotification: true,
    notificateDaysBeforeDueDate: true,
    inputType: false,
  });

  const [holdedConfiguration, setHoldedConfiguration] = useState({
    type: "Holded",
    selectedHoldedConnection: "",
    holdedConnectionData: [],
    filesSource: "",
    folderLocation: "/Inicio/",
    formatType: "",
    changeFileName: false,
    fileName: "",
    notificateAfterExport: true,
    notificateGmail: false,
    notificateWhatsApp: false,
    gmailTo: "",
    gmailSubject: "",
    gmailBody: "",
    whatsAppToNotificate: "",
    whatsAppMessage: "",
    notificateAfterError: false,
    notificateErrorGmail: false,
    notificateErrorWhatsApp: false,
    errorGmailTo: "",
    errorGmailSubject: "",
    errorGmailBody: "",
    errorWhatsAppToNotificate: "",
    errorWhatsAppMessage: "",
    inputType: false,
  });

  const [ftpConfiguration, setFtpConfiguration] = useState({
    type: "FTP",
    filesSource: "/FTP",
    selectedFTPConnection: "",
    ftpConnectionData: [],
    filesKeyWords: [],
    filesKeyWordsExactMatch: true,
    selectedFileTypes: [],
    allowAllFileTypes: true,
    changeFileName: false,
    fileName: "",
    inputType: false,
  });

  const [telematelConfiguration, setTelematelConfiguration] = useState({
    type: "Telematel",
    filesSource: "/Telematel",
    selectedTelematelConnection: "",
    telematelConnectionData: [],
    filesKeyWords: [],
    filesKeyWordsExactMatch: true,
    selectedFileTypes: [],
    allowAllFileTypes: true,
    changeFileName: false,
    fileName: "",
    inputType: false,
  });

  const generateQR = async (e) => {
    e.preventDefault();
    dispatch(getWhatssapQr({ userId: user.id, deviceName }));
    setDeviceName("");
    setShowFormtoGetQr(false);
  };

  const handlePopUps = (fromWhat) => {

    if (fromWhat === "qr") {
      setShowQrWhatsApp((prev) => !prev);
    } else {
      setShowCategory((prev) => !prev);
    }
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
      setConfiguration(automationData);

    }
  }, [automationData]);

  useEffect(() => {
    if (saveConfiguration) {
      const handleAddAutomation = async () => {

        let selectedAutomationData;

        selectedAutomationData = {
          ...configuration,
          type: type,
        };

        if (
          type === "Telematel" ||
          type === "esPúblico Gestiona" ||
          type === "Google Sheets" ||
          type === "XML" ||
          type === "Odoo" ||
          type === "Wolters" ||
          type === "Agencia Tributaria" ||
          type === "whatsApp notifications" ||
          type === "Holded" ||
          type === "FTP" ||
          type === "Acrobat"
        ) {
          if (user && selectedAutomationData?.id) {
            dispatch(
              updateAutomation({
                automationId: selectedAutomationData?.id,
                toUpdate: { ...cardSelected, ...selectedAutomationData },
                userId: user?.id,
              })
            );

            dispatch(updateChatsAgents({
              automationId: selectedAutomationData?.id,
              userId: user?.id,
              agents: selectedAutomationData?.agents,
            }))
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




  return (
    <>
      <AutomateCreateOut
        type={type}
        configuration={configuration}
        setConfiguration={setConfiguration}
        typeContent={typeContent}
        setShowCategory={handlePopUps}
        formAutomateContainerRef={formAutomateContainerRef}
        iconType={<EsPublico height={25} width={25} />}
        IconHeaderModAddConnection={EsPublico}
        close={close}
        setIsModalAutomate={setIsModalAutomate}
        setHideAutomate={setHideAutomate}
        typeVariableModal={typeVariableModal}
        setTypeVariableModal={setTypeVariableModal}
        showVariableListModal={showVariableListModal}
        setShowVariableListModal={setShowVariableListModal}
        showVariableModal={showVariableModal}
        setShowVariableModal={setShowVariableModal}
        setQuestion={setQuestion}
        selectedAgent={selectedAgent}
        toggleChatSettings={toggleChatSettings}
        setToggleChatSettings={setToggleChatSettings}
        setRoleAutomate={setRoleAutomate}
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
        >
          {qr ? (
            <div className={styles.qrContainer}>
              <img src={qr} alt="whatsapp" />
            </div>
          ) : showFormtoGetQr ? (
            <form onSubmit={generateQR} className={styles.formContent}>
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

export default AutomatesComponentOut;
