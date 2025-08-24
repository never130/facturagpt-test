import React, { useEffect, useState } from "react";
import styles from "./AttachmentNotificationOut.module.css";
import fileIcon from "../../../../assets/fileIcon.svg";
import pdfIcon from "../../../../assets/PdfCircle.svg";
import xmlIcon from "../../../../assets/XmlsCircle.svg";
import Image from "../../../../assets/image-icon.svg";
import PngIcon from "../../../../assets/pngIcon.png";
import jsonIcon from "../../../../assets/jsonIcon.svg";
import html from "../../../../assets/htmlIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { importConnectionAttachment } from "../../../../../../actions/automate";
import { setTryConnectionAutomate } from "../../../../../../slices/automateSlices";
import { useTranslation } from "react-i18next";
import { getUserFiles } from "../../../../../../actions/scaleway";

const getIcon = (value) => {
  if (value === "pdf") {
    return <img src={pdfIcon} alt="pdfIcon" className={styles.iconImages} />;
  } else if (value === "xml") {
    return <img src={xmlIcon} alt="xmlIcon" className={styles.iconImages} />;
  } else if (value === "png") {
    return <img src={PngIcon} alt="pngIcon" className={styles.iconImages} />;
  } else if (value === "jpeg") {
    return <img src={Image} alt="jpegIcon" className={styles.iconImages} />;
  } else if (value === "html") {
    return <img src={html} alt="jpegIcon" className={styles.iconImages} />;
  } else if (value === "json") {
    return <img src={jsonIcon} alt="jsonIcon" className={styles.iconImages} />;
  } else {
    return <img src={fileIcon} alt="fileIcon" className={styles.iconImages} />;
  }
};

const AttachmentNotificationOut = ({ attachments, type, automationId }) => {
  const [t] = useTranslation("AutomatesComponent");

  const dispatch = useDispatch();

  
  const { user } = useSelector((state) => state.user);
  
  const { loadingImportConnectionAttachment } = useSelector(
    (state) => state.automate
  );


  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [localAttachments, setLocalAttachments] = useState([]);
  const [showChilds, setShowChilds] = useState(false);


  const displayAttachments = showAll
    ? localAttachments
    : localAttachments.slice(0, 2);

  const userLocalStorage = localStorage.getItem("user");
  const parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;


  const parseDateToMonth = (date) => {
    const now = new Date();
    const pastDate = new Date(date);
    const diffMs = now - pastDate;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${t("ago")} ${seconds} ${t("seconds")}`;
    if (minutes < 60) return `${t("ago")} ${minutes} ${t("minutes")}`;
    if (hours < 24) return `${t("ago")} ${hours} ${t("hours")}`;
    if (days < 30) return `${t("ago")} ${days} ${t("days")}`;
    if (months < 12) return `${t("ago")} ${months} ${t("months")}`;
    return `${t("ago")} ${years} ${t("years")}`;
  };

  useEffect(() => {
    const dataFromAttachment = [...attachments];

    setLocalAttachments(dataFromAttachment);
  }, [attachments]);


  useEffect(() => {
    if (!loadingImportConnectionAttachment) {
      setLoading(false);
    }
  }, [loadingImportConnectionAttachment]);


  return (
    <div className={styles.AttachmentNotification}>
      {displayAttachments.map((attachment, index) => {
        return (
          <div className={styles.attachment} key={index}>
            <div onClick={() => setShowChilds((prev) => !prev)}>
              {attachment.type}
            </div>
            {showChilds && (
              <div className={styles.childs}>
                {attachment.data.map((child, index) => {
                  return (
                    <div className={styles.attachmentChilds} key={index}>
                      <div className={styles.icon}>{getIcon((child.nameFile).split(".")[1])}</div>
                      <div>{child.renameFile || child.nameFile}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {localAttachments.length > 2 && (
        <div className={styles.viewMoreContainer}>
          <button
            className={styles.viewMoreButton}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll
              ? t("showLess") || "Ver menos"
              : t("viewMore") || "Ver más"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AttachmentNotificationOut;
