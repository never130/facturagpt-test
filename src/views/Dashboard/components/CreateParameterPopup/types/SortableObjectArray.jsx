import React, { useState } from "react";
import styles from "../CreateParameterPopup.module.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactComponent as PencilEditIcon } from "../../../assets/pencilEdit.svg";
import { ReactComponent as CloseXIcon } from "../../../assets/CloseXIcon.svg";
import { ReactComponent as GrabIcon } from "../../../assets/grabIcon.svg";
import { ChevronDown } from "lucide-react";
import DeleteButton from "../../DeleteButton/DeleteButton";
import Button from "../../Button/Button";
import { useTranslation } from "react-i18next";

const SortableObjectArray = ({
  obj,
  expandedObjects,
  editingObjects,
  handleToggleExpand,
  handleToggleEdit,
  handleObjectTitleChange,
  handleRemoveObject,
  handleAddArrayValue,
  handleArrayValueChange,
  handleRemoveArrayValue,
  index,
}) => {
  const { t } = useTranslation();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: obj.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.objectItem} ${expandedObjects[obj.id] && styles.expandedObject}`}
    >
      <div className={styles.objectTitleContainer}>
        <GrabIcon {...attributes} {...listeners} style={{ cursor: 'grab' }} />
        <div
          className={styles.expandButton}
          onClick={() => handleToggleExpand(obj.id)}
        >
          <ChevronDown
            style={{
              transform: expandedObjects[obj.id]
                ? "rotate(180deg)"
                : "rotate(0deg)",
              cursor: "pointer",
            }}
          />
        </div>
        {editingObjects[obj.id] ? (
          <input
            type="text"
            value={obj.title}
            onChange={(e) =>
              handleObjectTitleChange(obj.id, e.target.value)
            }
            onBlur={() => handleToggleEdit(obj.id)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleToggleEdit(obj.id);
              }
            }}
            className={styles.objectTitleInput}
            autoFocus
          />
        ) : (
          <span
            className={styles.objectTitle}
            onClick={() => handleToggleEdit(obj.id)}
          >
            {obj.title || `${t('array')} ${index + 1}`}
          </span>
        )}

        <PencilEditIcon
          className={styles.editIcon}
          onClick={() => handleToggleEdit(obj.id)}
        />
        <DeleteButton
          action={() => handleRemoveObject(obj.id)}
          className={styles.removeValueButton}
          type="grey"
          customIconStyles={{
            width: "20px",
            height: "20px",
            minWidth: "20px",
          }}
          colorIcon="#fff"
          CustonIcon={CloseXIcon}
        />
      </div>

      {expandedObjects[obj.id] && (
        <div className={styles.objectContent}>
          <div className={styles.arraySection}>
            <div className={styles.arrayValues}>
              {obj.array.map((value, index) => (
                <div key={index} className={styles.arrayValueItem}>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleArrayValueChange(
                        obj.id,
                        index,
                        e.target.value
                      )
                    }
                    placeholder={`${t("value") || "Valor"} ${index + 1}`}
                    className={styles.arrayValueInput}
                  />
                  <DeleteButton
                    action={() => handleRemoveArrayValue(obj.id, index)}
                    className={styles.removeValueButton}
                    type="grey"
                    customIconStyles={{ width: "20px", height: "20px" }}
                    colorIcon="#fff"
                    CustonIcon={CloseXIcon}
                  />
                </div>
              ))}

              {obj.array.length === 0 && (
                <p className={styles.emptyArrayMessage}>
                  {t("noValues") || "No hay valores en el array"}
                </p>
              )}
            </div>
          </div>
          <Button
            action={() => handleAddArrayValue(obj.id)}
            size="small"
            headerStyle={{
              zIndex: 10,
              borderRadius: "999px",
              padding: "0",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            +
          </Button>
        </div>
      )}
    </div>
  );
};

export default SortableObjectArray;
