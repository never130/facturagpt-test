import React, { useEffect, useState } from "react";
import styles from "./AttachmentNotification.module.css";
import { ReactComponent as PdfIcon2 } from "../../../../assets/pdfIcon2.svg";
import { ReactComponent as ImageIcon2 } from "../../../../assets/imageIcon2.svg";
import { ReactComponent as CodeIcon } from "../../../../assets/S3/codeIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import { importConnectionAttachment } from "../../../../../../actions/automate";
import { setTryConnectionAutomate } from "../../../../../../slices/automateSlices";
import { useTranslation } from "react-i18next";
import DeleteButton from "../../../DeleteButton/DeleteButton";
import { getUserFiles } from "../../../../../../actions/scaleway";

const getIcon = (value) => {

  if (value === "application/pdf") {
    return <PdfIcon2 />;
  } else if (value === "text/xml") {
    return <CodeIcon />;
  } else if (value === "image/png") {
    return <ImageIcon2 />;
  } else if (value === "image/jpeg") {
    return <ImageIcon2 />;
  } else if (value === "text/html") {
    return <CodeIcon />;
  } else if (value === "application/json") {
    return <CodeIcon />;
  } else {
    return <CodeIcon />;
  }
};

const AttachmentNotification = ({ attachments, type, automationId }) => {
  const [t] = useTranslation("AutomatesComponent");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [localAttachments, setLocalAttachments] = useState([]);
  const { loadingImportConnectionAttachment } = useSelector(
    (state) => state.automate
  );
  const dispatch = useDispatch();


  const { user } = useSelector((state) => state.user);
  const userLocalStorage = localStorage.getItem("user");
  const parsedUser = userLocalStorage ? JSON.parse(userLocalStorage) : null;

  const filterContentType = (contentType) => {
    if (contentType && contentType.includes("/pdf")) return true;
    if (contentType && contentType.includes("/xml")) return true;
    if (contentType && contentType.includes("/json")) return true;
    if (contentType && contentType.includes("/html")) return true;
    if (contentType && contentType.includes("/png")) return true;
    if (contentType && contentType.includes("/jpeg")) return true;
    return false;
  };

  const filterMimeTypeOneDrive = (mimeType) => {
    if (mimeType && mimeType.includes("/pdf")) return true;
    if (mimeType && mimeType.includes("/xml")) return true;
    if (mimeType && mimeType.includes("/json")) return true;
    if (mimeType && mimeType.includes("/html")) return true;
    if (mimeType && mimeType.includes("/png")) return true;
    if (mimeType && mimeType.includes("/jpeg")) return true;
    return false;
  };

  useEffect(() => {
    const dataFromAttachment = [...attachments];
    if (type === "One Drive") {
      const filterDataFromAttachment = dataFromAttachment.filter((attachment) =>
        filterMimeTypeOneDrive(attachment.attachments[0].mimeType)
      );
      filterDataFromAttachment.sort((a, b) => {
        const dateA = new Date(a.attrs.date);
        const dateB = new Date(b.attrs.date);
        return dateB - dateA;
      });
      setLocalAttachments(filterDataFromAttachment);
      return;
    } else {
      dataFromAttachment.sort((a, b) => {
        if (a.attrs) {
          const dateA = new Date(a.attrs.date);
          const dateB = new Date(b.attrs.date);
          return dateB - dateA;
        }
        const dateA = new Date(a.createdDateTime);
        const dateB = new Date(b.createdDateTime);
        return dateB - dateA;
      });
      setLocalAttachments(dataFromAttachment);
    }
  }, [attachments]);

  const handleImportAttachments = async (attachmentId, name, emailId) => {
    setLoading(true);
    dispatch(setTryConnectionAutomate(attachmentId));
    await dispatch(
      importConnectionAttachment({ attachmentId, automationId, emailId, name })
    ).unwrap();
    dispatch(getUserFiles({ userId: user.id, token: parsedUser.accessToken }));
  };

  useEffect(() => {
    if (!loadingImportConnectionAttachment) {
      setLoading(false);
    }
  }, [loadingImportConnectionAttachment]);

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

  const handleDeleteAttachment = (index) => {
    const updatedAttachments = [...localAttachments];
    updatedAttachments.splice(index, 1);
    setLocalAttachments(updatedAttachments);
  };

  const displayAttachments = showAll
    ? localAttachments
    : localAttachments.slice(0, 2);


  return (
    <div className={styles.attachments}>
      {displayAttachments.map((attachment, index) => {
        if (type === "Outlook") {
          if (!filterContentType(attachment.contentType)) return null;
          return (
            <div 
            className={`${styles.attachment} ${attachment.wasImported ? styles.wasImported : ""}`} 
            key={attachment.id}
            >
              <div className={styles.icon}>
                {getIcon(attachment.contentType || "application/pdf")}
              </div>
              <div className={styles.content}>
                <div>
                  <b> {attachment.name}</b>
                  {!attachment.wasImported ? (
                    <button
                      onClick={() =>
                        handleImportAttachments(
                          attachment.id,
                          attachment.name,
                          attachment.emailId
                        )
                      }
                    >
                      {t("import")}
                    </button>
                  ) : (
                    <span className={styles.wasImported}>
                      {t("alreadyImported")}
                    </span>
                  )}
                  {loading && (
                    <span
                      className={styles.loaderImportConnectionAttachment}
                    ></span>
                  )}
                </div>
                <span>{parseDateToMonth(attachment.createdDateTime)}</span>
              </div>
              <DeleteButton
                className={styles.delete}
                action={() => handleDeleteAttachment(showAll ? index : index)}
              >
                -
              </DeleteButton>
            </div>
          );
        }
        if (
          !filterMimeTypeOneDrive(
            attachment.attachments && attachment.attachments[0].mimeType
          )
        )
          return null;
        return (
          <div className={styles.attachment} key={index}>
            <div className={styles.icon}>
              {getIcon(attachment.attachments[0].mimeType)}
            </div>
            <div className={styles.content}>
              <div>
                <b> {attachment.attachments[0].filename}</b>
                {!attachment.wasImported ? (
                  <button
                    onClick={() =>
                      handleImportAttachments(
                        attachment.emailId,
                        attachment.attachments[0].filename
                      )
                    }
                  >
                    {t("import")}
                  </button>
                ) : (
                  <span className={styles.wasImported}>
                    {t("alreadyImported")}
                  </span>
                )}
                {loading && (
                  <span
                    className={styles.loaderImportConnectionAttachment}
                  ></span>
                )}
              </div>
              <span>{parseDateToMonth(attachment?.attrs?.date || attachment.date)}</span>
            </div>
            <DeleteButton
              className={styles.delete}
              action={() => handleDeleteAttachment(showAll ? index : index)}
            >
              -
            </DeleteButton>
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

export default AttachmentNotification;
