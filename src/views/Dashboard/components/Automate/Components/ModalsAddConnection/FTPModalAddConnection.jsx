import React, { useEffect, useRef, useState } from "react";
import LabelInputComponent from "../../../LabelInputComponent/LabelInputComponent";
import AddConnectionModal from "../AddConenctionModal/AddConnectionModal";
import { ReactComponent as FTPIcon } from "../../../../assets/ftpWhite.svg";
import styles from "./FTPModalAddConnection.module.css";
import { useTranslation } from "react-i18next";

const FTPModalAddConnection = ({
  close,
  addConnection,
  title,
  Icon,
  IconType,
  setQuestion,
  selectedAgent
}) => {
  const [t] = useTranslation("AutomatesComponent");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [clientId, setClientId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  return (
    <AddConnectionModal
      headerColor={["#208DE6", "#135a94"]}
      close={close}
      type={title ? title : "FTP"}
      icon={Icon ? Icon : <FTPIcon />}
      IconHeader={IconType ? IconType : <FTPIcon />}
      setQuestion={setQuestion}
      selectedAgent={selectedAgent}
    >
      <div
        className={styles.formContainer}
        ref={containerRef}
        tabIndex="0"
        onKeyDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (e.key === "Escape") {
            close();
          }
        }}
      >
        <LabelInputComponent
          label={t("port")}
          placeholder={t("port")}
          inputType="text"
          value={port}
          setValue={setPort}
        />

        <LabelInputComponent
          label={t("host")}
          placeholder={t("host")}
          inputType="text"
          value={host}
          setValue={setHost}
        />

        <LabelInputComponent
          label={t("clientId")}
          placeholder={t("clientId")}
          inputType="text"
          value={clientId}
          setValue={setClientId}
        />

        <LabelInputComponent
          label={t("secretKey")}
          placeholder={t("secretKey")}
          inputType="text"
          value={secretKey}
          setValue={setSecretKey}
        />

        <button
          onClick={() => {
            if (!host || !port || !clientId || !secretKey) {
              alert(t("pleaseCompleteFields"));
              return;
            }
            addConnection({ host, port, clientId, secretKey });
            setHost("");
            setPort("");
            setClientId("");
            setSecretKey("");
            close();
          }}
          className={styles.addButton}
        >
          {Icon ? (
            <Icon width={25} height={25} />
          ) : (
            <FTPIcon width={25} height={25} />
          )}
          <span className={styles.buttonText}>{t("addConnection")}</span>
        </button>
      </div>
    </AddConnectionModal>
  );
};

export default FTPModalAddConnection;
