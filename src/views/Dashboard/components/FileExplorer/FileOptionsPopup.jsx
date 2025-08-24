import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./FileExplorer.module.css";
import { useTranslation } from "react-i18next";

const PopupBase = ({ onClose, style, options, parentRef }) => {
  const popupRef = useRef(null);
  const [adjustedStyle, setAdjustedStyle] = React.useState(style);
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !parentRef?.contains(event.target) &&
        !popupRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, parentRef]);

  useEffect(() => {
    const popupEl = popupRef.current;
    if (popupEl) {
      const rect = popupEl.getBoundingClientRect();
      const overflowBottom = rect.bottom > window.innerHeight;
      const overflowTop = rect.top < 0;

      let newTop = style.top;

      if (overflowBottom) {
        const popupHeight = rect.height;
        newTop = style.top - popupHeight;
        if (newTop < 0) newTop = 0;
      }

      if (overflowTop) {
        newTop = 0;
      }

      setAdjustedStyle({
        ...style,
        top: newTop,
      });
      setVisible(true);
    }
  }, [style]);

  return ReactDOM.createPortal(
    <div ref={popupRef}   className={`${styles.optionsPopup} ${visible ? styles.visible : ""}`} style={adjustedStyle}>
      {options.map(({ label, onClick }) => (
        <button
          key={label}
          className={styles.optionItem}
          onClick={() => {
            onClick();
            onClose();
          }}
        >
          {label}
        </button>
      ))}
    </div>,
    document.body
  );
};

export const FileOptionsPopup = ({
  onClose,
  style,
  onDownload,
  onShare,
  onDelete,
  parentRef,
  onEdit,
  onChangeColor
}) => {
  const { t } = useTranslation("PanelTemplate");
  
  const fileOptions = [
    { label: t('edit'), onClick: onEdit },
    { label: t('download'), onClick: onDownload },
    { label: t('share'), onClick: onShare },
    { label: t('delete'), onClick: onDelete },
    { label: t('changelabel'), onClick: onChangeColor },
  ];

  return (
    <PopupBase
      onClose={onClose}
      style={style}
      options={fileOptions}
      parentRef={parentRef}
    />
  );
};

export const FolderOptionsPopup = ({
  onClose,
  style,
  onRename,
  onDelete,
  parentRef,
  onChangeColor,
  onDuplicate
}) => {
  const { t } = useTranslation("PanelTemplate");

  const folderOptions = [
    { label: t('rename'), onClick: onRename },
    { label: t('deleteFoldereeee'), onClick: onDelete },
    { label: t('duplicateFolder'), onClick: onDuplicate },
    { label: t('changelabel'), onClick: onChangeColor },

  ];

  return (
    <PopupBase
      onClose={onClose}
      style={style}
      options={folderOptions}
      parentRef={parentRef}
    />
  );
};
