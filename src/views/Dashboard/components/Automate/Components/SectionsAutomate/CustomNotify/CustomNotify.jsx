import React, { useEffect, useRef, useState } from "react";
import styles from "./CustomNotify.module.css";
import CustomAutomationsWrapper from "../../../../CustomAutomationsWrapper/CustomAutomationsWrapper";
import { ReactComponent as CheckVector } from "../../../../../assets/CheckVector.svg";
import { ReactComponent as GreenCheck } from "../../../../../assets/GreenCheck.svg";
import { ReactComponent as FileSelect } from "../../../../../assets/fileSelect.svg";
import { ReactComponent as FilePdf } from "../../../../../assets/filePdf.svg";
import { ReactComponent as FileDir } from "../../../../../assets/fileDir.svg";
import { ReactComponent as CodeSimbol } from "../../../../../assets/CodeSimbol.svg";
import { ReactComponent as ImageIcon } from "../../../../../assets/imageIcon.svg";
import SelectCurrencyPopup from "../../../../SelectCurrencyPopup/SelectCurrencyPopup";
import { ReactComponent as GreenBell } from "../../../../../assets/GreenBell.svg";
import { ReactComponent as CampanaBordes } from "../../../../../assets/CampanaBordes.svg";
import OptionsSwitchComponent from "../../../../OptionsSwichComponent/OptionsSwitchComponent";
import { AutomateDataComponent } from "../../../utils/automatesJson";
import EmailConfiguration from "../EmailConfiguration/EmailConfiguration";
import DeleteButton from "../../../../DeleteButton/DeleteButton";
import { useTranslation } from "react-i18next";

const fileIcons = [
  {
    name: "pdf",
    icon: <FilePdf height={20} width={20} />,
  },
  {
    name: "dir",
    icon: <FileDir height={20} width={20} />,
  },
  {
    name: "code",
    icon: <CodeSimbol height={20} width={20} />,
  },
  {
    name: "image",
    icon: <ImageIcon height={20} width={20} />,
  },
  {
    name: "svg",
    icon: <ImageIcon height={20} width={20} />,
  },
];

const CustomNotify = ({
  configuration,
  handleConfigurationChange,
  icon,
  action,
  emailConnections = [],
  selectedEmailConnection,
  setSelectedEmailConnection,
  placeholder,
  headerStyle = {},
  setShowCategory,
  setShowGmailModalAddConnection,
}) => {
  const [t] = useTranslation("AutomatesComponent");

  const data = AutomateDataComponent();
  const [selectFileFromGmail, setSelectFileFromGmail] = useState("");
  const [inputFor, setInputFor] = useState("");
  const [subjectUpdated, setSubjectUpdated] = useState(true);
  const [forToMessage, setForToMessage] = useState({
    for: [],
    to: "",
    message: "",
  });
  const [mailBox, setMailBox] = useState({
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

  const [mailBoxOutlook, setMailBoxOutlook] = useState({
    box1: false,
    box2: false,
  });
  const [forToMessageOutlook, setForToMessageOutlook] = useState({
    for: [],
    to: "",
    message: "",
  });
  const [inputForOutlook, setInputForOutlook] = useState("");
  const [subjectUpdatedOutlook, setSubjectUpdatedOutlook] = useState(true);

  const handleSetShowContent = (infoNumber) => {
    setShowContent((prev) => ({ ...prev, [infoNumber]: !prev[infoNumber] }));
    handleConfigurationChange("showContentCustomNotify", {
      ...showContent,
      [infoNumber]: !showContent[infoNumber],
    });
  };

  useEffect(() => {
    if (
      configuration?.showContentCustomNotify &&
      JSON.stringify(configuration?.showContentCustomNotify) !==
        JSON.stringify(showContent)
    ) {
      setShowContent(configuration?.showContentCustomNotify);
    }
  }, [configuration?.showContentCustomNotify]);

  useEffect(() => {
    if (
      configuration?.mailBox &&
      JSON.stringify(configuration?.mailBox) !== JSON.stringify(mailBox)
    ) {
      setMailBox(configuration?.mailBox);
    }
  }, [configuration?.mailBox]);

  useEffect(() => {
    if (
      configuration?.gmailTo &&
      JSON.stringify(configuration?.gmailTo) !==
        JSON.stringify(forToMessage.for)
    ) {
      setForToMessage((prev) => ({ ...prev, for: configuration?.gmailTo }));
    }
  }, [configuration?.gmailTo]);

  useEffect(() => {
    if (
      configuration?.gmailSubject &&
      JSON.stringify(configuration?.gmailSubject) !==
        JSON.stringify(forToMessage.to) &&
      subjectUpdated
    ) {
      setForToMessage((prev) => ({ ...prev, to: configuration?.gmailSubject }));
    }
  }, [configuration?.gmailSubject]);

  useEffect(() => {
    if (
      configuration?.phoneListNotificate &&
      JSON.stringify(configuration?.phoneListNotificate) !==
        JSON.stringify(forToMessageWhatsapp)
    ) {
      setForToMessageWhatsapp(configuration?.phoneListNotificate);
    }
  }, [configuration?.phoneListNotificate]);

  useEffect(() => {
    if (
      configuration?.mailBoxWhatsapp &&
      JSON.stringify(configuration?.mailBoxWhatsapp) !==
        JSON.stringify(mailBoxWhatsapp)
    ) {
      setMailBoxWhatsapp(configuration?.mailBoxWhatsapp);
    }
  }, [configuration?.mailBoxWhatsapp]);

  const handleSelectFileFromGmail = (e) => {
    setSelectFileFromGmail(e.target.files[0]);
  };

  return (
      <CustomAutomationsWrapper
        Icon={<CampanaBordes />}
        showContent={showContent.info1}
        customCss={{overflow: "hidden"}}
      >
        <div
          className={styles.infoContainerWrapper}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {showContent.info1 && <GreenCheck />}
            <div className={styles.infoContainer}>
              <div>{t("setupCustomNotifications")}</div>
              <span>{t("receiveAlertsRealtime")}</span>
            </div>
          </div>
          <OptionsSwitchComponent
            border={"none"}
            marginLeft={"auto"}
            isChecked={showContent.info1}
            setIsChecked={(value) => {
              handleSetShowContent("info1");
            }}
          />
        </div>

        {showContent.info1 && <EmailConfiguration
          showContent={showContent}
          mailBox={mailBoxOutlook}
          setMailBox={setMailBoxOutlook}
          data={data}
          emailConnections={emailConnections}
          placeholder={placeholder || t("addAnEmailAccount")}
          selectedEmailConnection={selectedEmailConnection || t("exampleMail")}
          setSelectedEmailConnection={setSelectedEmailConnection}
          forToMessage={forToMessageOutlook}
          setForToMessage={setForToMessageOutlook}
          inputFor={inputForOutlook}
          setInputFor={setInputForOutlook}
          setSubjectUpdated={setSubjectUpdatedOutlook}
          icon={"Outlook"}
          handleConfigurationChange={handleConfigurationChange}
          configuration={configuration}
          setShowGmailModalAddConnection={setShowGmailModalAddConnection}
        />}

        <div
          className={showContent.info1 ? styles.cssGmail : ""}
          style={{ display: showContent.info1 ? "block" : "none" }}
        >
          <EmailConfiguration
            showContent={showContent}
            mailBox={mailBox}
            setMailBox={setMailBox}
            handleConfigurationChange={handleConfigurationChange}
            data={data}
            emailConnections={emailConnections}
            placeholder={placeholder || t("addAnEmailAccount")}
            selectedEmailConnection={
              selectedEmailConnection || "ejemplo@email.com"
            }
            setSelectedEmailConnection={setSelectedEmailConnection}
            forToMessage={forToMessage}
            setForToMessage={setForToMessage}
            inputFor={inputFor}
            setInputFor={setInputFor}
            configuration={configuration}
            setSubjectUpdated={setSubjectUpdated}
            icon={"Gmail"}
            cssGmail={showContent.info1 ? styles.cssGmail : ""}
            setShowGmailModalAddConnection={setShowGmailModalAddConnection}
          />
          {showContent.info1 && configuration.mailBox && (
            <CustomAutomationsWrapper
              Icon={<FileSelect />}
              showContent={selectFileFromGmail?.name ? true : false}
            >
              <div className={styles.infoContainerWrapper}>
                <div className={styles.infoContainerFile}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      justifyContent: "start",
                      marginBottom: selectFileFromGmail ? "20px" : "0px",
                      width: "100%",
                    }}
                  >
                    {selectFileFromGmail?.name && (
                      <FileSelect
                        stroke="var(--_10a37f-background)"
                        style={{ color: "var(--_10a37f-background)", backgroundColor: "var(--_10a37f-background)" }}
                        fill="var(--_10a37f-background)"
                      />
                    )}
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                      }}
                    >
                      <label
                        htmlFor="fileCustomNotify"
                        className={styles.labelFile}
                      >
                        {t("addAttachment")}
                      </label>
                    </div>
                    <input
                      type="file"
                      name="file"
                      id="fileCustomNotify"
                      style={{ display: "none" }}
                      onChange={handleSelectFileFromGmail}
                    />
                  </div>
                  {selectFileFromGmail && (
                    <div className={styles.fileContainer}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {
                          fileIcons.find((icon) =>
                            selectFileFromGmail.name.includes(icon.name)
                          )?.icon
                        }
                        <span style={{ fontSize: "13px" }}>
                          {selectFileFromGmail.name}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <DeleteButton
                          action={() => setSelectFileFromGmail("")}
                        />
                        {(selectFileFromGmail.size / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CustomAutomationsWrapper>
          )}
        </div>

        {showContent.info1 && (
          <EmailConfiguration
            showContent={showContent}
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
            keyWordToSetShowCategory="qr"
          />
        )}
      {showContent.info1 && (
        <div >
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
      </CustomAutomationsWrapper>
  );
};

export default CustomNotify;
