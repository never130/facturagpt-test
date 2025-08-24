import apiBackend from "@src/apiBackend.js";
import React, { useEffect, useRef, useState } from "react";
import styles from "./SendEmailModal.module.css";
import adjuntar from "../../assets/share.svg";
import { ReactComponent as OutlookIcon } from "../../assets/outlook.svg";
import FolderIcon from "../../assets/folderIcon.svg";
import FileIcon from "../../assets/fileIcon.svg";
import CodeIcon from "../../assets/codeIcon.svg";
import ImageIcon from "../../assets/imageIcon.svg";
import Button from "../Button/Button";
import HeaderFormsComponent from "../HeadersFormsComponent/HeaderFormsComponent";
import HeaderCard from "../HeaderCard/HeaderCard";
import MiniWordDocs from "../Automate/Components/SectionsAutomate/MiniWordDocs/MiniWordDocs";

import ModalAddConnectionGmail from "../Automate/Components/GmailFormCreateAutomate/ModalAddConnectionGmail";
import { getAuth } from "../../../../actions/automate";
import { useDispatch } from "react-redux";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";

const SendEmailModal = ({
  mailModal,
  setMailModal,
  isAnimating,
  setIsAnimating,
  currentId,
  pdfUrl,
  setSeeBill,
  file,
  setFile,
  pdfName,
}) => {
  const [t] = useTranslation("Preview");
  const [documentoPDF, setDocumentoPDF] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      const pdfFile = require("../../assets/pdfs/document.pdf");
      setDocumentoPDF(pdfFile);
    } catch (error) {
      console.warn("El archivo document.pdf no existe:", error.message);
      setDocumentoPDF(null);
    }
  }, []);

  const handleCloseNewClient = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setMailModal(false);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && mailModal) {
        handleCloseNewClient();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mailModal]);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null); 

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile));
      setFileName(selectedFile.name); 
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click(); 
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split(".").pop().toLowerCase();

    switch (extension) {
      case "pdf":
        return FileIcon;
      case "jpg":
      case "jpeg":
      case "png":
        return ImageIcon;
      case "txt":
        return FolderIcon;
      case "csv":
        return FolderIcon;
      case "xml":
        return FolderIcon;
      case "html":
      case "css":
      case "js":
      case "jsx":
      case "json":
        return CodeIcon;
      default:
        return null; 
    }
  };
  const [configuration, setConfiguration] = useState({
    selectedEmailConnection: "",
  });

  const handleConfigurationChange = (key, value) => {
    setConfiguration((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [showAddConnection, setShowAddConnection] = useState(false);

  const [authData, setAuthData] = useState([]);

  useEffect(() => {
    const getAuthData = async () => {
      const resp = await dispatch(getAuth("gmail"));

      if (resp.payload?.length > 0) {
        setAuthData(resp.payload);
      }
    };

    getAuthData();
  }, []);

  const [selectedAuthData, setSelectedAuthData] = useState(null);

  useEffect(() => {
    if (configuration.selectedEmailConnection && Array.isArray(authData)) {
      const foundAuth = authData.find(
        (auth) => auth.email === configuration.selectedEmailConnection
      );
      setSelectedAuthData(foundAuth || null);
      handleConfigurationChange("authData", foundAuth || null);
    }
  }, [configuration.selectedEmailConnection, authData]);


  const sendEmail = createAsyncThunk(
    "user/send-emailUser",
    async (formData, { rejectWithValue }) => {

      try {
        const res = await apiBackend.post("/user/send-emailUser", formData, {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        });

        return res.data;
      } catch (error) {
        console.error(
          "Error enviando correo:",
          error.response?.data || error.message
        );
        return rejectWithValue(
          error.response?.data || "Error al enviar el correo"
        );
      }
    }
  );

  const handleSendEmail = async () => {
    if (
      !configuration.selectedEmailConnection ||
      !configuration.authData.email
    ) {
      console.error("Faltan datos para enviar el correo");
      return;
    }

    const formData = new FormData();
    formData.append("senderEmail", configuration.authData.email);
    formData.append("appPassword", configuration.authData.appPassword);
    formData.append("recipientEmail", configuration.recipient);
    formData.append("subject", configuration.subject);
    formData.append("htmlContent", configuration.gmailBody);

    if (file) {
      let fileData = file;
      const response = await fetch(file);

      const blob = await response.blob();

      const mimeType = blob.type || "application/octet-stream"; 

      fileData = new File([blob], "archivo", { type: mimeType });

      formData.append("file", fileData);
    } else if (pdfUrl) {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const fileData = new File([blob], "documento.pdf", {
        type: "application/pdf",
      });
      formData.append("file", fileData);
    }

    try {
      const res = await dispatch(sendEmail(formData)).unwrap();
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  };

  return (
    <>
      <div className={styles.bg} onClick={handleCloseNewClient}></div>

      <div
        className={`${styles.sendEmailModal} ${isAnimating ? styles.scaleDown : styles.scaleUp}`}
      >
        <HeaderCard
          title={t('sendEmail')}
          setState={handleCloseNewClient}
          headerStyle={{
            position: "sticky",
            top: "0",
            zIndex: "999",
          }}
        >
          <Button action={handleCloseNewClient} type="white">
            {t('cancel')}
          </Button>
          <Button action={handleSendEmail}>{t('send')}</Button>
        </HeaderCard>

        <div className={styles.sendEmailContent}>
          <HeaderFormsComponent
            selectedEmailConnection={configuration?.selectedEmailConnection}
            setSelectedEmailConnection={(value) =>
              handleConfigurationChange("selectedEmailConnection", value)
            }
            emailConnections={(authData || []).map(
              (connection) => connection.email
            )}
            action={() => setShowAddConnection(true)}
            icon={<OutlookIcon /> }
          />
          {showAddConnection && (
            <ModalAddConnectionGmail
              close={() => setShowAddConnection(false)}
            />
          )}
          <div className={styles.infOptions}>
            <input
              type="text"
              placeholder={t('toEmail')}
              value={configuration.recipient}
              onChange={(e) =>
                handleConfigurationChange("recipient", e.target.value)
              }
            />
            <input
              type="text"
              placeholder={t('subjectDocumentTitle')}
              value={configuration.subject}
              onChange={(e) =>
                handleConfigurationChange("subject", e.target.value)
              }
            />

            {/* <MiniWordDocs
              configuration={configuration}
              handleConfigurationChange={handleConfigurationChange}
              autoResize={true}
            /> */}
          </div>
        </div>
        <div className={styles.addFileEmail}>
          <div className={styles.attach}>
            <img src={adjuntar} />
          </div>
          <div className={styles.file}>
            <div className={styles.addFileRow}>
              <div style={{ color: "#1F184B" }}>{t('addAttachment')}</div>
              <Button type="white" action={handleButtonClick}>
                {t('selectDocument')}
              </Button>
            </div>
            <div>
              <div className={styles.fileIcon}>
                <img
                  src={getFileIcon(fileName || pdfName)}
                  alt="Icon"
                  className={styles.icon}
                />
                <p className={styles.titleFile}>{fileName || pdfName}</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }} 
                onChange={handleFileChange}
              />
              {currentId && (
                <div className={styles.seeBillContainer}>
                  <embed
                    src={`${file || pdfUrl}#toolbar=0`}
                    type="application/pdf"
                    height="300px"
                    width={"100%"}
                  />
                  <div
                    className={styles.seeBillContent}
                    onClick={() => {
                      setMailModal(false);
                      setSeeBill(true);
                    }}
                  >
                    {t('viewPreview')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendEmailModal;
