import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as GrayIconLock } from "../../../../assets/GrayIconLock.svg";
import { ReactComponent as EyePassword } from "../../../../assets/eyePassword.svg";
import { ReactComponent as EyePasswordSlash } from "../../../../assets/eyePasswordSlash.svg";
import { ReactComponent as MoreInfoIcon } from "../../../../assets/moreInfoIcon.svg";
import Button from "../../../Button/Button";
import styles from "./ModalAddConnection.module.css";

import { addAuth } from "@src/actions/automate";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getTelematelToken } from "../../../../../../actions/automate";
import { setAddConnectionAutomationsByGmail } from "../../../../../../slices/automateSlices";
import { setShowModal } from "../../../../../../slices/userSlices";
import HeaderCard from "../../../HeaderCard/HeaderCard";
import WrongAlert from "../WrongAlert/WrongAlert";
import SMTPModalAddConnection from "./SMTPModalAddConnection";

import { setQuestion } from "../../../../../../slices/userSlices";
import { apiUrl } from "../../../../../../apiBackend";


const ModalAddConnection = ({
  close,
  IconHeader,
  type,
  IconLogin,
  textLogin,
  IconLogin2,
  TextLogin2,
  customCss,
  addType,
  selectedAgent
}) => {
  const dispatch = useDispatch();
  const [t] = useTranslation("AutomatesComponent");
  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [loaderTelematel, setLoaderTelematel] = useState(false);
  const [checkTelematel, setCheckTelematel] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorPopup, setErrorPopup] = useState("");
  const globalState = useSelector((state) => state.automate);
  const [connectionSuccefull, setConnectionSuccefull] = useState(false);
  const [showOutlookModal, setShowOutlookModal] = useState(false);
  const userId = useSelector((state) => state.user.user.id);
  const navigate = useNavigate()
  const { authOutlook, authDrive } = globalState;

  useEffect(() => {
    if (globalState.loading) {
      setConnectionSuccefull(true);
    } else if (!globalState.loading && connectionSuccefull) {
      setTimeout(() => {
        if (globalState.addConnectionAutomationsByGmail.email) {
          close();
        }
      }, 1000);
    }

    return () => {
      setErrorPopup("");
    };
  }, [globalState.loading]);

  const handleAddConnection = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const testEmail = (email) => emailRegex.test(email);
    const isEmailValid = testEmail(email);
    const isAppPasswordProvided = appPassword.trim() !== "";
    if (type === "Gmail" || type === "Outlook") {
      if (!isEmailValid) {
        dispatch(setAddConnectionAutomationsByGmail());
        return;
      }

      if (!isAppPasswordProvided) {
        dispatch(setAddConnectionAutomationsByGmail());
        return;
      }

      const connection = {
        type: type,
        email,
        appPassword,
      };

      dispatch(setAddConnectionAutomationsByGmail(connection));
      const resp = await dispatch(addAuth(connection));
    } else if (type === "Telematel") {
      if (!isAppPasswordProvided) {
        setErrorPopup(t("appPasswordRequired"));
        return;
      }

      const connection = {
        type: type,
        j_username: email,
        j_password: appPassword,
        host,
        port,
      };

      setLoaderTelematel(true);
      dispatch(setAddConnectionAutomationsByGmail(connection));
      const resp = await dispatch(getTelematelToken(connection)).unwrap();

      if (resp && resp.success) {
        setLoaderTelematel(false);
        setCheckTelematel(true);
        setTimeout(() => {
          setCheckTelematel(false);
          close();
        }, 1000);
      } else {
        setErrorPopup(resp.message);
        setLoaderTelematel(false);
        setCheckTelematel(false);
      }
    } else {
    }
  };

  const handleAuth = async () => {
    const currentHost = window.location.origin;
    if (type === "Outlook") {
      window.location.href = `${apiUrl}/api/automate/outlookAuth?id=${userId}&from=${currentHost === "http://localhost:3005" ? "dev" : "prod"}`;
    } else if (type === "Google Drive") {
      window.location.href = `${apiUrl}/api/automate/driveAuth?id=${userId}`;
    } else if (type === "One Drive") {
      window.location.href = `${apiUrl}/api/automate/oneDriveAuth?id=${userId}&from=${currentHost === "http://localhost:3005" ? "dev" : "prod"}`;
    }else if(type == 'Gmail') {
      window.location.href = `${apiUrl}/api/gmail/gmailLogin?id=${userId}`;
    }
  };

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);


  return (
    <div
      ref={containerRef}
      className={styles.container}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape") {
          close(false);
          setErrorPopup("");
        }
      }}
      tabIndex="0"
      onClick={() => {
        setErrorPopup("");
        close(false);
      }}
    >
      {!showOutlookModal && (
        <div className={styles.subContainer}>
          <div onClick={(e) => e.stopPropagation()} className={styles.content}>
            <HeaderCard
              title={
                <>
                  <IconHeader height="34px" width="34px" /> {type}
                </>
              }
              setState={(value) => {
                setErrorPopup("");
                close(value);
              }}
              headerStyle={{ padding: "8px 0px" }}
              buttonHeaderStyle={{ padding: "6px 8px", marginRight: "10px" }}
              childrenLeft={
                <Button headerStyle={{ all: "unset" }}
                  action={() => {
                    dispatch(setQuestion({
                      type: 'automationQuestion',
                      typeAutomate: type,
                    }))


                    dispatch(setShowModal('selectAgent'))
           
                  }}>

                  <MoreInfoIcon className={styles.moreInfoContainer} />

                </Button>}
            >
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setErrorPopup("");
                  close(false);
                }}
              >
                {t("cancel")}
              </button>
            </HeaderCard>
            <div className={styles.children_content}>
              <div className={styles.gridContainer}>
                {type !== "Outlook" && type !== "One Drive" && type !== "SMTP" && (
                  <div>
                    <label htmlFor="email" className={styles.labelInput}>
                      {t("user")}
                    </label>
                    <div className={styles.inputContainer}>
                      <input
                        type={"email"}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        placeholder={t("yourEmailAddress")}
                        className={styles.input}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddConnection();
                          }
                        }}
                        id="email"
                      />
                    </div>
                  </div>
                )}
                {type !== "Outlook" && type !== "SMTP" && type !== "One Drive" && (
                  <div
                    style={{ position: "relative" }}
                    onClick={() => setErrorPopup("")}
                  >
                    <div>
                      <label
                        htmlFor="appPassword"
                        className={styles.labelInput}
                      >
                        {t("password")}
                      </label>
                      <div className={styles.inputContainer}>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={appPassword}
                          onChange={(e) => setAppPassword(e.target.value)}
                          placeholder={t("yourAccountPassword")}
                          className={styles.input}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddConnection();
                            }
                          }}
                          id="appPassword"
                        />
                        {showPassword ? (
                          <EyePassword
                            className={styles.eye}
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        ) : (
                          <EyePasswordSlash
                            className={styles.eye}
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {type === "Telematel" && (
                  <div className={styles.telematelHostPortContainer}>
                    <div>
                      <label htmlFor="host" className={styles.labelInput}>
                        {t("Host")}
                      </label>
                      <div className={styles.inputContainer}>
                        <input
                          type={"text"}
                          value={host}
                          onChange={(e) => {
                            setHost(e.target.value);
                          }}
                          placeholder={t("host")}
                          className={styles.input}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddConnection();
                            }
                          }}
                          id="host"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="port" className={styles.labelInput}>
                        {t("Port")}
                      </label>
                      <div className={styles.inputContainer}>
                        <input
                          type={"number"}
                          value={port}
                          onChange={(e) => {
                            setPort(e.target.value);
                          }}
                          placeholder={t("port")}
                          className={styles.input}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddConnection();
                            }
                          }}
                          id="port"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {IconLogin && (
                  <button
                    className={styles.signInOption}
                    onClick={() => handleAuth()}
                  >
                    <IconLogin width={22} height={22} />
                    <label className={styles.label}>{textLogin}</label>
                  </button>
                )}

                {errorPopup && (
                  <WrongAlert
                    message={errorPopup}
                    addConnection="https://myaccount.google.com/apppasswords"
                  />
                )}
                {globalState.addConnectionAutomationsByGmail ===
                  "Error on addAuthController" ? (
                  <WrongAlert
                    message={t("incorrectDataCheckPassword")}
                    addConnection="https://myaccount.google.com/apppasswords"
                  />
                ) : globalState.addConnectionAutomationsByGmail ===
                  "Auth with this email already exists" ? (
                  <WrongAlert
                    message={t("alreadyConnectionThisEmail")}
                  />
                ) : (
                  ""
                )}


                {type === "SMTP" && (
                  <SMTPModalAddConnection
                  />
                )}


                {(type !== "Telematel" && type !== "SMTP" && type !== "Outlook") && (
                  <Button
                    action={handleAddConnection}
                  >
                    {!globalState.loading &&
                      !globalState.addConnectionAutomationsByGmail?.email ? (
                      <div>{t("connect")}</div>
                    ) : globalState.addConnectionAutomationsByGmail?.email ? (
                      <span className={styles.checkOk}>✓</span>
                    ) : (
                      <span className={styles.loader}></span>
                    )}
                  </Button>
                )}
                {(type === "Telematel") && (
                  <Button
                    action={handleAddConnection}
                    disabledOption={loaderTelematel || checkTelematel}
                  >
                    {!loaderTelematel && !checkTelematel ? (
                      <div>{t("connect")}</div>
                    ) : checkTelematel ? (
                      <span className={styles.checkOk}>✓</span>
                    ) : (
                      <span className={styles.loader}></span>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.footer}>
              <GrayIconLock />
              <span>{t("facturaGptConnectsSecurely")}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ModalAddConnection;
