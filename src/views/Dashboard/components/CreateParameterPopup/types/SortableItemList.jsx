import React, { useState } from "react";
import styles from "../CreateParameterPopup.module.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import { ReactComponent as GrabIcon } from "../../../assets/grabIcon.svg";
import { ReactComponent as PencilEdit } from "../../../assets/pencilEdit.svg";
import DeleteButton from "../../DeleteButton/DeleteButton";
import { useTranslation } from "react-i18next";

const SortableItemList = ({ item, handleDeleteItem, index,setParameterData }) => {
  const [editing, setEditing] = useState(false);
  const [t] = useTranslation("Contacts");

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

    const style = {
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      };
      
  return (
    <div ref={setNodeRef} style={style} className={styles.SortableItemList}>
      <div className={styles.GrabIconContainer}>
        <GrabIcon {...attributes} {...listeners} />
        {!editing ? (
          <span>{item.title || `${t("value")} ${index + 1}`}</span>
        ) : (
          <input
            type="text"
            value={item.title}
            placeholder={`${t("value")} ${index + 1}`}
            onChange={(e) => {
                const newTitle = e.target.value;
                setParameterData((prev) => ({
                  ...prev,
                  list: prev.list.map((el) =>
                    el.id === item.id ? { ...el, title: newTitle } : el
                  ),
                }));
              }}
              
          />
        )}
        <PencilEdit onClick={() => setEditing((prev) => !prev)} />
      </div>
      <DeleteButton
        action={() => handleDeleteItem(item.id)}
        type={"black"}
        CustonIcon={WhiteXCloseIcon}
        customIconStyles={{
          height: "20px",
          minWidth: "20px",
          maxWidth: "20px",
          background: "#6E6E80",
        }}
      />
    </div>
  );
};

export default SortableItemList;
