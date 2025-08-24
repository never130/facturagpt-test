import React, { useEffect, useState } from "react";

import CustomAutomationsWrapper from "../../../CustomAutomationsWrapper/CustomAutomationsWrapper";

import styles from "./FileInput.module.css";
import OptionsSwitchComponent from "../../../OptionsSwichComponent/OptionsSwitchComponent";
import { AutomateDataComponent } from "../../utils/automatesJson";
import { ReactComponent as GreenBell } from "../../../../assets/GreenBell.svg";
import { ReactComponent as CampanaBordes } from "../../../../assets/CampanaBordes.svg";

import EmailConfiguration from "../SectionsAutomate/EmailConfiguration/EmailConfiguration";


import { useTranslation } from "react-i18next";

const FileInputNotification = ({
  handleConfigurationChange,
  configuration,
  emailConnections = [],
  selectedEmailConnection,
  setSelectedEmailConnection,
  placeholder,
  setShowCategory,
  setShowGmailModalAddConnection,
}) => {
  const [t] = useTranslation("AutomatesComponent");
  const data = AutomateDataComponent();
  const [inputFor, setInputFor] = useState("");
  const [inputForOutlook, setInputForOutlook] = useState("");
  const [subjectUpdated, setSubjectUpdated] = useState(true);
  const [subjectUpdatedOutlook, setSubjectUpdatedOutlook] = useState(true);
  const [forToMessage, setForToMessage] = useState({
    for: [],
    to: "",
    message: "",
  });
  const [forToMessageOutlook, setForToMessageOutlook] = useState({
    for: [],
    to: "",
    message: "",
  });
  const [mailBox, setMailBox] = useState({
    box1: false,
    box2: false,
  });
  const [mailBoxOutlook, setMailBoxOutlook] = useState({
    box1: false,
    box2: false,
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
  const [forToMessageWhatsapp, setForToMessageWhatsapp] = useState([]);
  const [inputForWhatsapp, setInputForWhatsapp] = useState("");
  const [subjectUpdatedWhatsapp, setSubjectUpdatedWhatsapp] = useState(true);
  const [mailBoxWhatsapp, setMailBoxWhatsapp] = useState({
    box1: false,
    box2: false,
  });

  const handleSetShowContent = (infoNumber) => {
    setShowContent((prev) => ({ ...prev, [infoNumber]: !prev[infoNumber] }));
    handleConfigurationChange("showContentCustomNotify", {
      ...showContent,
      [infoNumber]: !showContent[infoNumber],
    });
  };

  useEffect(() => {
    if (
      configuration?.showContentCustomNotify && JSON.stringify(configuration?.showContentCustomNotify) !== JSON.stringify(showContent)
    ) {
      setShowContent(configuration?.showContentCustomNotify);
    } else if (
      configuration?.showContentCustomNotify === null ||
      configuration?.showContentCustomNotify === "" ||
      configuration?.showContentCustomNotify === undefined
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
  }, [configuration?.showContentCustomNotify]);

  useEffect(() => {
    if (
      configuration?.mailBox && JSON.stringify(configuration?.mailBox) !== JSON.stringify(mailBox)
    ) {
      setMailBox(configuration?.mailBox);
    }
  }, [configuration?.mailBox]);

  useEffect(() => {
    if (
      configuration?.gmailTo &&
      JSON.stringify(configuration?.gmailTo) !== JSON.stringify(forToMessage.for)
    ) {
      setForToMessage((prev) => ({ ...prev, for: configuration?.gmailTo }));
    }
    if (
      configuration?.outlookTo &&
      JSON.stringify(configuration?.outlookTo) !== JSON.stringify(forToMessageOutlook.for)
    ) {
      setForToMessageOutlook((prev) => ({ ...prev, for: configuration?.outlookTo }));
    }

  }, [configuration?.gmailTo, configuration?.outlookTo]);

  useEffect(() => {
    if (
      configuration?.gmailSubject &&
      JSON.stringify(configuration?.gmailSubject) !== JSON.stringify(forToMessage.to) &&
      subjectUpdated
    ) {
      setForToMessage((prev) => ({ ...prev, to: configuration?.gmailSubject }));
    }
    if (
      configuration?.outlookSubject &&
      JSON.stringify(configuration?.outlookSubject) !== JSON.stringify(forToMessageOutlook.to) &&
      subjectUpdatedOutlook
    ) {
      setForToMessageOutlook((prev) => ({ ...prev, to: configuration?.outlookSubject }));
    }
  }, [configuration?.gmailSubject, configuration?.outlookSubject]);

  useEffect(() => {
    if (
      configuration?.phoneListNotificate &&
      JSON.stringify(configuration?.phoneListNotificate) !== JSON.stringify(forToMessageWhatsapp)
    ) {
      setForToMessageWhatsapp(configuration?.phoneListNotificate);
    }
  }, [configuration?.phoneListNotificate]);

  useEffect(() => {
    if (
      configuration?.mailBoxWhatsapp &&
      JSON.stringify(configuration?.mailBoxWhatsapp) !== JSON.stringify(mailBoxWhatsapp)
    ) {
      setMailBoxWhatsapp(configuration?.mailBoxWhatsapp);
    }
  }, [configuration?.mailBoxWhatsapp]);

  return (
    <CustomAutomationsWrapper
      Icon={<CampanaBordes />}
      showContent={showContent.info4}
      hiddenTest={true}
    >
      <div className={styles.infoContainerWrapper}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {showContent.info4 && <GreenBell />}
          <div className={styles.infoContainer}>
            <div>{t("setupCustomNotifications")}</div>
            <span>{t("receiveAlertsRealtime")}</span>
          </div>
        </div>
        <OptionsSwitchComponent
          border={"none"}
          marginLeft={"auto"}
          isChecked={showContent.info4}
          setIsChecked={(value) => {
            handleSetShowContent("info4");
          }}
        />
      </div>
      <div
        className={`${styles.contentContainer} ${showContent.info4 ? styles.active : styles.disabled}`}
      >
        <div className={styles.messageConfigurationContainer}>
          {/* <EmailConfiguration
            showContent={showContent.info4}
            mailBox={mailBoxOutlook}
            setMailBox={setMailBoxOutlook}
            data={data}
            emailConnections={emailConnections}
            placeholder={placeholder || t("addAnEmailAccount")}
            selectedEmailConnection={
              selectedEmailConnection || t("exampleMail")
            }
            setSelectedEmailConnection={setSelectedEmailConnection}
            forToMessage={forToMessageOutlook}
            setForToMessage={setForToMessageOutlook}
            inputFor={inputForOutlook}
            setInputFor={setInputForOutlook}
            setSubjectUpdated={setSubjectUpdatedOutlook}
            icon={"Outlook"}
            cssGmail={showContent.info4 ? styles.cssGmail : ""}
            handleConfigurationChange={handleConfigurationChange}
            configuration={configuration}
            setShowGmailModalAddConnection={setShowGmailModalAddConnection}
          />
          <EmailConfiguration
            showContent={showContent.info4}
            mailBox={mailBox}
            setMailBox={setMailBox}
            data={data}
            emailConnections={emailConnections}
            placeholder={placeholder || t("addAnEmailAccount")}
            selectedEmailConnection={
              selectedEmailConnection || t("exampleMail")
            }
            setSelectedEmailConnection={setSelectedEmailConnection}
            forToMessage={forToMessage}
            setForToMessage={setForToMessage}
            inputFor={inputFor}
            setInputFor={setInputFor}
            setSubjectUpdated={setSubjectUpdated}
            icon={"Gmail"}
            cssGmail={showContent.info1 ? styles.cssGmail : ""}
            handleConfigurationChange={handleConfigurationChange}
            configuration={configuration}
            setShowGmailModalAddConnection={setShowGmailModalAddConnection}
          />
          <EmailConfiguration
            showContent={showContent.info4}
            mailBox={mailBoxWhatsapp}
            setMailBox={setMailBoxWhatsapp}
            handleConfigurationChange={handleConfigurationChange}
            data={data}
            emailConnections={emailConnections}
            placeholder={placeholder || t("addAnEmailAccount")}
            selectedEmailConnection={selectedEmailConnection || "+987654321"}
            setSelectedEmailConnection={setSelectedEmailConnection}
            forToMessage={forToMessageWhatsapp}
            setForToMessage={setForToMessageWhatsapp}
            inputFor={inputForWhatsapp}
            setInputFor={setInputForWhatsapp}
            configuration={configuration}
            setSubjectUpdated={setSubjectUpdatedWhatsapp}
            whatsappConfiguration={"whatsapp"}
            icon={"WhatsApp"}
            fromWhatsApp={true}
            setShowCategory={setShowCategory}
            keyWordToSetShowCategory={"qr"}
          /> */}
        </div>
        {showContent.info4 && (
          <div style={{ marginTop: "20px" }}>
            <CustomAutomationsWrapper
              Icon={<CampanaBordes />}
              showContent={configuration.notificateErrors}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {configuration?.notificateErrors && <GreenBell />}
                <div className={styles.infoContainer}>
                  <div>{t("activeNotificationsAdvanced")}</div>
                  <span>{t("ensureTheAccuracy")}</span>
                </div>
                <OptionsSwitchComponent
                  border={"none"}
                  marginLeft={"auto"}
                  isChecked={configuration?.notificateErrors || false}
                  setIsChecked={(value) =>
                    handleConfigurationChange("notificateErrors", value)
                  }
                />
              </div>
            </CustomAutomationsWrapper>
          </div>
        )}
      </div>
    </CustomAutomationsWrapper>
  );
};

export default FileInputNotification;
