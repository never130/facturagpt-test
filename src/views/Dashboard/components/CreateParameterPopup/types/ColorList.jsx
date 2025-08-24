import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { ReactComponent as GrabIcon } from "../../../assets/grabIcon.svg";
import { ReactComponent as PencilEdit } from "../../../assets/pencilEdit.svg";
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import Button from "../../Button/Button";
import DeleteButton from "../../DeleteButton/DeleteButton";
import styles from "../CreateParameterPopup.module.css";
import LabelParameters from "../LabelParameters";

const ColorList = ({
  parameterData,
  setParameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const [t] = useTranslation("Contacts");
  const [editingColorId, setEditingColorId] = useState(null);

  const [editing, setEditing] = useState(null);
  const colors = parameterData.colors || [];
  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddColor = () => {
    const newColor = {
      id: uuidv4(),
      name: "",
      color: "#000000",
    };

    setParameterData((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), newColor],
    }));
  };

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = colors.findIndex((c) => c.id === active.id);
      const newIndex = colors.findIndex((c) => c.id === over.id);

      const reordered = arrayMove(colors, oldIndex, newIndex);

      setParameterData((prev) => ({
        ...prev,
        colors: reordered,
      }));
    }
  };

  const handleDelete = (id) => {
    setParameterData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.id !== id),
    }));
  };

  const handleColorChange = (id, newColor) => {
    setParameterData((prev) => ({
      ...prev,
      colors: prev.colors.map((c) =>
        c.id === id ? { ...c, color: newColor } : c
      ),
    }));
  };

  const handleNameChange = (id, newName) => {
    setParameterData((prev) => ({
      ...prev,
      colors: prev.colors.map((c) =>
        c.id === id ? { ...c, name: newName } : c
      ),
    }));
  };

  return (
    <div>
      <LabelParameters
        text="colors"
        editingInput={editingInput}
        setEditingInput={setEditingInput}
        checkEditingValidation={false}
      >
        <Button action={handleAddColor} type="white" headerStyle={{borderRadius:"999px"}}>{t("addColor")}</Button>
      </LabelParameters>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={colors.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {colors.map((color, index) => (
            <SortableColorItem
              key={color.id}
              color={color}
              onDelete={() => handleDelete(color.id)}
              onNameChange={(name) => handleNameChange(color.id, name)}
              onColorChange={(colorValue) =>
                handleColorChange(color.id, colorValue)
              }
              isEditing={editingColorId === color.id}
              onEditColor={() => setEditingColorId(color.id)}
              onCloseEdit={() => setEditingColorId(null)}
              setEditing={setEditing}
              editing={editing}
              index={index}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

const SortableColorItem = ({
  color,
  onDelete,
  onNameChange,
  onColorChange,
  isEditing,
  onEditColor,
  onCloseEdit,
  setEditing,
  editing,
  index,
}) => {
  const [t] = useTranslation("Contacts");

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: color.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,

    position: "relative",
  };

  const colorInputRef = useRef(null);
  const [tempColor, setTempColor] = useState(color.color);

  useEffect(() => {
    if (isEditing && colorInputRef.current) {
      setTempColor(color.color); 

      setTimeout(() => {
        colorInputRef.current.focus(); 
        colorInputRef.current.click(); 
      }, 0);
    }
  }, [isEditing, color.color]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={styles.ColorListItem}
    >
      <GrabIcon {...listeners} style={{ cursor: "grab" }} />
      {editing == color.id ? (
        <>
          <div
            onClick={onEditColor}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: tempColor,
              cursor: "pointer",
              border: "1px solid #aaa",
            }}
          />

          {isEditing && (
            <>
              <input
                ref={colorInputRef}
                type="color"
                value={tempColor}
                onChange={(e) => setTempColor(e.target.value)}
                onBlur={() => {
                  onColorChange(tempColor);
                  onCloseEdit();
                }}
                style={{ position: "absolute", left: "0px", opacity: "0" }}
              />
            </>
          )}
          <input
            type="text"
            value={tempColor}
            onChange={(e) => setTempColor(e.target.value)}
            onBlur={() => {
              if (/^#[0-9A-Fa-f]{6}$/.test(tempColor)) {
                onColorChange(tempColor);
              }
            }}
            placeholder="#000000"
            style={{
              width: "130px",
            }}
          />

          <input
            type="text"
            value={color.name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Nombre del color"
            style={{ flex: 1 }}
          />
        </>
      ) : (
        <div>
          <div
            onClick={onEditColor}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: color.color,
            }}
          />
          <p style={{width: "100%"}}>{color.name || `${t("color")} ${index}`}</p>
        </div>
      )}
      <PencilEdit
        onClick={() => {
          setEditing(editing === color.id ? null : color.id);
        }}
      />

      <DeleteButton
        action={() => onDelete()}
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

export default ColorList;
