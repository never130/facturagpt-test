import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "../CreateParameterPopup.module.css";
import { ReactComponent as GrabIcon } from "../../../assets/grabIcon.svg";
import { ReactComponent as PencilEdit } from "../../../assets/pencilEdit.svg";
import { useTranslation } from "react-i18next";
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import DeleteButton from "../../DeleteButton/DeleteButton";

const CategorySortableItem = ({
  item,
  index,
  setParameterData,
  setEditingCategory,
  editinCategory,
}) => {
  const [t] = useTranslation("Contacts");

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  const handleItemChange = (e) => {
    const newValue = e.target.value;
    setParameterData((prev) => {
      const updated = prev.category.map((cat) =>
        cat.id === item.id ? { ...cat, item: newValue } : cat
      );
      return { ...prev, category: updated };
    });
  };

  const handleValueChange = (valueId, e) => {
    const newValue = e.target.value;
    setParameterData((prev) => {
      const updated = prev.category.map((cat) => {
        if (cat.id === item.id) {
          const updatedValues = cat.values.map((v) =>
            v.id === valueId ? { ...v, name: newValue } : v
          );
          return { ...cat, values: updatedValues };
        }
        return cat;
      });
      return { ...prev, category: updated };
    });
  };

  const handleDeleteItem = (itemId) => {
    setParameterData((prev) => ({
      ...prev,
      category: prev.category.filter((cat) => cat.id !== itemId),
    }));
  };

  const handleDeleteValue = (valueId) => {
    setParameterData((prev) => {
      const updated = prev.category.map((cat) => {
        if (cat.id === item.id) {
          return {
            ...cat,
            values: cat.values.filter((v) => v.id !== valueId),
          };
        }
        return cat;
      });
      return { ...prev, category: updated };
    });
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span {...listeners} style={{ cursor: "grab" }}>
          <GrabIcon />
        </span>
        {editinCategory != item.id ? (
          <span style={{width: "100%"}}>
            {item.item || `${t("category")} ${index}`}
            </span>
        ) : (
          <input
            type="text"
            value={item.item}
            onChange={handleItemChange}
            placeholder={`${t("categoryName")} ${index + 1}`}
            style={{ flex: 1 }}
          />
        )}

        <PencilEdit
          onClick={() => {
            setEditingCategory(editinCategory == item.id ? null : item.id);
          }}
        />

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

      <div
        style={{
          height: editinCategory != item.id ? "0px" : "auto",
          overflow: "hidden",
        }}
      >
        {item.values.map((value) => (
          <div className={styles.valuesContent}>
            <input
              key={value.id}
              type="text"
              value={value.name}
              onChange={(e) => handleValueChange(value.id, e)}
              placeholder="Valor"
              style={{
                display: "block",
                width: "100%",
                marginTop: "5px",
              }}
            />
            <DeleteButton
              action={() => handleDeleteValue(value.id)}
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
        ))}
      </div>
    </div>
  );
};

export default CategorySortableItem;
