import React, { useState } from "react";
import styles from "./BtnOPtionsMessage.module.css";
import { ReactComponent as Pinned } from "../../../assets/PinnedIcon.svg";
import { ReactComponent as NotPinned } from "../../../assets/NotPinned.svg";
import { ReactComponent as ShareDiagonalIcon } from "../../../assets/shareDiagonalIcon.svg";
import { ReactComponent as TrashGrayIcon } from "../../../assets/trashGrayIcon.svg";
import { ReactComponent as LikeOutlinesIcon} from "../../../assets/LikeOutlinesIcon.svg";
import { ReactComponent as LikeFilledIcon} from "../../../assets/LikeFilledIcon.svg";
import { useTranslation } from "react-i18next";
import {
  deleteMessage,
  fetchByChat,
  updateLikePinMessage,
} from "../../../../../actions/chat";
import { useDispatch } from "react-redux";

const BtnOPtionsMessage = ({ 
  isBotMessage, 
  message, 
  chatId,
  setShowReply = () => {}
}) => {
  const [t] = useTranslation("ChatView");
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(message?.liked || false);
  const [isPinned, setIsPinned] = useState(message?.pinned || false);

  const handleShare = () => {
    let fileUrl = window.location.href;
    if (fileUrl.includes("localhost")) {
      fileUrl = fileUrl.replace(/localhost:\d+/, "facturagpt.com");
    }
    if (navigator.share) {
      navigator
        .share({
          title: t("facturaGptChat"),
          url: fileUrl,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      navigator.clipboard.writeText(fileUrl).then(
        () => {
          alert("Link copied to clipboard!");
        },
        (err) => {
          console.error("Failed to copy link:", err);
        }
      );
    }
  };

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      await dispatch(
        updateLikePinMessage({
          chatId: chatId,
          timestamp: message?.timestamp,
          field: "liked",
        })
      );
    } catch (error) {
      setIsLiked(message?.liked);
      console.error("Error al actualizar like:", error);
    }
  };
  const handlePinned = async () => {
    try {
      setIsPinned(!isPinned);
      await dispatch(
        updateLikePinMessage({
          chatId: chatId,
          timestamp: message?.timestamp,
          field: "pinned",
        })
      );
    } catch (error) {
      setIsPinned(message?.pinned);
      console.error("Error al actualizar like:", error);
    }
  };

  const handleDelete = async () => {
    await dispatch(
      deleteMessage({
        chatId: chatId,
        timestamp: message?.timestamp,
      })
    );

    dispatch(fetchByChat({ chatId: chatId }));
  };

  const handleReply = async (text) => {
    setShowReply(text)

  }

  return (
    <div className={styles.BtnOPtionsMessage}>
      <button onClick={handleLike}>{isLiked ? <LikeFilledIcon className={styles.pinnedIconSvg}/> : <LikeOutlinesIcon/>}</button>
      {!isBotMessage && (
        <>
        <button onClick={handlePinned}>
          {isPinned ? <Pinned className={styles.pinnedIconSvg}/> : <NotPinned />}
        </button>
         <button onClick={handleDelete}>
         <TrashGrayIcon />
       </button>
       </>
      )}
      {isBotMessage && (
        <>
          <button onClick={handleDelete}>
            <TrashGrayIcon />
          </button>
        </>
      )}
      {isBotMessage && (
        <button onClick={() => handleReply(message)}>
          <ShareDiagonalIcon />
        </button>
      )}
    </div>
  );
};

export default BtnOPtionsMessage;
