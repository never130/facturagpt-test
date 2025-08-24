import React, { useEffect, useRef } from "react";
import styles from "./OptionsPopup.module.css";
import { ReactComponent as PencilEdit } from "../../assets/pencilEdit.svg";
import { ReactComponent as DraftIcon } from "../../assets/draffIcon.svg";
const OptionsPopup = ({ options, close, style, father }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      const overflowBottom = rect.bottom > window.innerHeight;

      if (overflowBottom) {
        popupRef.current.style.top = `${parseInt(style.top) - rect.height}px`;
      }
    }
  }, [style]);

  return (
    <>
      <div
        className={styles.bg}
        onClick={(e) => {
          e.stopPropagation();
          close(null);
        }}
      ></div>
      <div ref={popupRef} className={styles.OptionsPopupContainer} style={style}>
        {options.map((option, index) => (
          <div
            style={{color: father === "popup" && index === 0 ? "#71717A" : father === "popup" && index === 1 ? "#E7000B" : ""}}
            key={index}
            onClick={option.onClick}
            className={`${option.askAi && styles.askAi} ${option.key === "highlighted" && styles.highlighted} ${father === "popup" && styles.popupOptions}`}
          >
           {father === "popup" && index === 0 ? <PencilEdit width={14} height={14} /> : father === "popup" && index === 1 ? <DraftIcon width={14} height={14} />:""} {option.label}
          </div>
        ))}
      </div>
    </>
  );
};

export default OptionsPopup;
