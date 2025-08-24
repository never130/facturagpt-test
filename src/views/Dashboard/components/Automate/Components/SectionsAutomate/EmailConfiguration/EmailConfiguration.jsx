
import React, { useEffect, useState } from "react";
import styles from "./EmailConfiguration.module.css"; 
import CheckboxWithText from "../../../../CheckboxWithText/CheckboxWithText";
import { ReactComponent as Search } from "../../../../../assets/searchGray.svg";
import { ReactComponent as Whatsaap } from "../../../../../assets/whatsapp-icon-green.svg";
import { ReactComponent as GmailIcon } from "../../../../../assets/gmailwithoutbg.svg";
import { ReactComponent as OutlookIcon } from "../../../../../assets/outlookCircle.svg";
import CustomDropdown from "../../../../CustomDropdown/CustomDropdown";
import MiniWordDocs from "../MiniWordDocs/MiniWordDocs";
import InputComponent from "../../../../InputComponent/InputComponent";
import DeleteButton from "../../../../DeleteButton/DeleteButton";
import { useDispatch, useSelector } from "react-redux";
import { getWhatssapQr } from "../../../../../../../actions/automate";
import { useTranslation } from "react-i18next";

const EmailConfiguration = ({
  showContent,
  handleConfigurationChange,
  data,
  placeholder,
  forToMessage,
  setForToMessage,
  inputFor,
  setInputFor,
  configuration,
  setSubjectUpdated,
  whatsappConfiguration,
  icon,
  cssGmail,
  fromWhatsApp,
  setShowCategory,
  keyWordToSetShowCategory,
  setShowGmailModalAddConnection,
}) => {
  const [t] = useTranslation("AutomatesComponent");

  const [showMailBox, setShowMailBox] = useState(false);
  const [userDevices, setUserDevices] = useState([]);
  const [authData, setAuthData] = useState([]);
  const [authOutlook, setAuthOutlook] = useState([]);
  const [selectedEmailConnection, setSelectedEmailConnection] = useState("");
  const [selectedOutlookConnection, setSelectedOutlookConnection] =
    useState("");
  const [selectedNumberConnection, setSelectedNumberConnection] = useState("");

  const dispatch = useDispatch();

  const automates = useSelector((state) => state.automate);

  const handleDeletePhoneNumber = (index) => {
    setForToMessage((prev) => {
      const pre = prev.filter((_, i) => i !== index);
      handleConfigurationChange("phoneListNotificate", pre);
      return pre;
    });
  };

  useEffect(() => {
    if (automates.userDevices) {
      const devices = automates.userDevices?.devices?.map((ele) => {
        return {
          email: ele.deviceId,
          userId: ele.userId,
          type: ele.type,
          id: ele.id,
        };
      });
      setUserDevices(devices);
    }
    if (automates.authData) {
      setAuthData(automates.authData);
    }
    if (automates.authOutlook?.success) {
      const constructorEqualAuthData = automates.authOutlook?.data?.map(
        (ele) => {
          return {
            email: ele.account?.mail,
            userId: ele.userId,
            type: "Outlook",
            id: ele._id,
          };
        }
      );
      setAuthOutlook(constructorEqualAuthData);
    }
  }, [automates.userDevices, automates.authData, automates.authOutlook]);

  useEffect(() => {
    if (
      configuration?.selectedEmailCustomNotify &&
      JSON.stringify(configuration?.selectedEmailCustomNotify) !==
        JSON.stringify(selectedEmailConnection)
    ) {
      setSelectedEmailConnection(configuration?.selectedEmailCustomNotify);
    }
    if (
      configuration?.selectedNumberCustomNotify &&
      JSON.stringify(configuration?.selectedNumberCustomNotify) !==
        JSON.stringify(selectedNumberConnection)
    ) {
      setSelectedNumberConnection(configuration?.selectedNumberCustomNotify);
    }
    if (
      configuration?.selectedOutlookCustomNotify &&
      JSON.stringify(configuration?.selectedOutlookCustomNotify) !==
        JSON.stringify(selectedOutlookConnection)
    ) {
      setSelectedOutlookConnection(configuration?.selectedOutlookCustomNotify);
    }
  }, [
    configuration?.selectedEmailCustomNotify,
    configuration?.selectedNumberCustomNotify,
    configuration?.selectedOutlookCustomNotify,
  ]);

  useEffect(() => {
    if (whatsappConfiguration) {
      if (
        configuration?.mailBoxWhatsapp &&
        JSON.stringify(configuration?.mailBoxWhatsapp) !==
          JSON.stringify(showMailBox)
      ) {
        setShowMailBox(configuration?.mailBoxWhatsapp);
      }
    } else if (icon === "Outlook") {
      if (
        configuration?.mailBoxOutlook &&
        JSON.stringify(configuration?.mailBoxOutlook) !==
          JSON.stringify(showMailBox)
      ) {
        setShowMailBox(configuration?.mailBoxOutlook);
      }
    } else {
      if (
        configuration?.mailBox &&
        JSON.stringify(configuration?.mailBox) !== JSON.stringify(showMailBox)
      ) {
        setShowMailBox(configuration?.mailBox);
      }
    }
  }, [
    configuration?.mailBox,
    configuration?.mailBoxWhatsapp,
    configuration?.mailBoxOutlook,
  ]);


  return (
    <div
      className={`${cssGmail ? styles.cssGmail : styles.contentContainer} ${showContent ? styles.active : styles.disabled}`}
    >
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <CheckboxWithText
          state={showMailBox}
          setState={(newState) => {
            setShowMailBox((prev) => {
              handleConfigurationChange(
                whatsappConfiguration
                  ? "mailBoxWhatsapp"
                  : icon === "Outlook"
                    ? "mailBoxOutlook"
                    : "mailBox",
                !prev
              );
              return !prev;
            });
          }}
        />

        <div className={styles.iconContainer2}>
          {whatsappConfiguration ? (
            <Whatsaap />
          ) : icon === "Outlook" ? (
            <OutlookIcon style={{ width: "34px", height: "34px" }} />
          ) : (
            <GmailIcon />
          )}
        </div>

        <span
          style={{ color: "#222222", fontSize: "14px", marginLeft: "10px" }}
        >
          {whatsappConfiguration
            ? "Whatsapp"
            : icon === "Outlook"
              ? "Outlook"
              : "Gmail"}
        </span>

        {showMailBox && (
          <div
            style={{ display: "flex", width: "100%", justifyContent: "end" }}
          >
            <button
              className={styles.newConnectionButton}
              onClick={() => {
                fromWhatsApp
                  ? setShowCategory(keyWordToSetShowCategory)
                  : icon === "Outlook"
                    ? setShowGmailModalAddConnection("Outlook")
                    : setShowGmailModalAddConnection("Gmail");
              }}
            >
              {t("newConnection")}
            </button>
          </div>
        )}
      </div>

      {showMailBox && (
        <>
          <div className={styles.headerMail}>
            <div className={styles.iconContainer}>
              <img
                src={data.filter((item) => item.type === icon)[0]?.image}
                alt="gmail"
                style={{ width: "26px" }}
              />
            </div>
            <CustomDropdown
              options={
                fromWhatsApp
                  ? userDevices
                  : icon === "Outlook"
                    ? authOutlook
                    : authData
              }
              isEmail={true}
              height="27px"
              borderRadius="0px 8px 8px 0px"
              placeholder={
                fromWhatsApp ? "Selecciona un movil" : "Selecciona un correo"
              }
              selectedOption={
                fromWhatsApp
                  ? selectedNumberConnection?.email
                  : icon === "Outlook"
                    ? selectedOutlookConnection?.email
                    : selectedEmailConnection?.email
              }
              setSelectedOption={(value) => {
                fromWhatsApp
                  ? handleConfigurationChange(
                      "selectedNumberCustomNotify",
                      value
                    )
                  : handleConfigurationChange(
                      icon === "Outlook"
                        ? "selectedOutlookCustomNotify"
                        : "selectedEmailCustomNotify",
                      value
                    );
                fromWhatsApp
                  ? setSelectedNumberConnection(value)
                  : icon === "Outlook"
                    ? setSelectedOutlookConnection(value)
                    : setSelectedEmailConnection(value);
              }}
              emailsDropdown={true}
              fromHeader={true}
              customStylesOptions={{ minWidth: "165px" }}
              handleConfigurationChange={handleConfigurationChange}
              deleteSelectedEmail={
                whatsappConfiguration
                  ? "selectedNumberCustomNotify"
                  : icon === "Outlook"
                    ? "selectedOutlookCustomNotify"
                    : "selectedEmailCustomNotify"
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "10px 0px",
              gap: "10px",
            }}
          >
            {whatsappConfiguration ? (
              <div>
                <InputComponent
                  icon={<Search />}
                  placeholder={t("phoneNumberOrContactName")}
                  textButton={t("add")}
                  typeInput="text"
                  value={inputFor}
                  setValue={setInputFor}
                  readOnly={false}
                  action={() => {
                    setForToMessage((prev) => {
                      const pre = [...prev];
                      pre.push(inputFor);
                      setInputFor("");
                      handleConfigurationChange("phoneListNotificate", pre);
                      return pre;
                    });
                  }}
                  options={forToMessage?.for}
                  onKeyDown={() => {}}
                  fromImport={false}
                  color="#71717A"
                />
                <div className={styles.phoneNumbersList}>
                  {configuration?.phoneListNotificate &&
                    configuration?.phoneListNotificate?.map((number, index) => (
                      <div key={index} className={styles.phoneNumberItem}>
                        <span>{number}</span>
                        <DeleteButton
                          action={() => handleDeletePhoneNumber(index)}
                        >
                          {t("delete")}
                        </DeleteButton>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#F4F4F4",
                  display: "flex",
                  alignItems: "center",
                  padding: "0px 16px",
                  flexWrap: "wrap",
                  maxHeight: "90px",
                  borderRadius: "4px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    widt: "auto",
                    alignItems: "center",
                    margin: "0px",
                  }}
                >
                  {t("for")}:{" "}
                  {forToMessage.for.length
                    ? forToMessage.for.join(", ")
                    : "[email]"}
                  ,
                </label>
                <input
                  type="text"
                  placeholder="..."
                  style={{
                    background: "transparent",
                    border: "0px",
                    padding: "0px 8px",
                    outline: "0px",
                    width: "auto",
                    height: "31px",
                  }}
                  onChange={(e) => setInputFor(e.target.value)}
                  value={inputFor}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (emailRegex.test(inputFor)) {
                        setForToMessage((prev) => {
                          const pre = [...prev.for];
                          pre.push(inputFor);
                          handleConfigurationChange(
                            icon === "Outlook" ? "outlookTo" : "gmailTo",
                            pre
                          );
                          return {
                            ...prev,
                            for: pre,
                          };
                        });
                        setInputFor("");
                      }
                    }
                  }}
                />
              </div>
            )}
            {!whatsappConfiguration && (
              <div
                style={{
                  backgroundColor: "#F4F4F4",
                  display: "flex",
                  height: "31px",
                  alignItems: "center",
                  padding: "0px 16px",
                  borderRadius: "4px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    widt: "auto",
                    alignItems: "center",
                    margin: "0px",
                  }}
                >
                  {t("subject")}:
                </label>
                <input
                  type="text"
                  placeholder="[document_title]"
                  style={{
                    background: "transparent",
                    border: "0px",
                    padding: "0px 8px",
                    outline: "0px",
                    width: "100%",
                    height: "31px",
                  }}
                  onChange={(e) => {
                    setForToMessage((prev) => ({
                      ...prev,
                      to: e.target.value,
                    }));
                    handleConfigurationChange(
                      icon === "Outlook" ? "outlookSubject" : "gmailSubject",
                      e.target.value
                    );
                  }}
                  value={forToMessage.to}
                  onClick={() => setSubjectUpdated(false)}
                />
              </div>
            )}
          </div>
          <MiniWordDocs
            configuration={configuration}
            handleConfigurationChange={handleConfigurationChange}
            message={forToMessage.message}
            setMessage={setForToMessage}
            whatsappConfiguration={whatsappConfiguration}
            icon={icon}
            autoResize={true}
          />
        </>
      )}
    </div>
  );
};

export default EmailConfiguration;
