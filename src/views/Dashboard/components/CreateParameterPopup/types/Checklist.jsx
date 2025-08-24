import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import LabelParameters from "../LabelParameters";
import Button from "../../Button/Button";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import styles from "../CreateParameterPopup.module.css"; 
import DeleteButton from "../../DeleteButton/DeleteButton";
import {ReactComponent as GrabIcon} from '../../../assets/grabIcon.svg'
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";


const Checklist = ({
  parameterData,
  setParameterData,
  editingInput,
  setEditingInput,
}) => {
  const [t] = useTranslation("Contacts");

  const checklist = parameterData.checklist || [];

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddChecklistItem = () => {
    const newItem = {
      id: uuidv4(),
      title: "",
      selected: false,
    };
    setParameterData((prev) => ({
      ...prev,
      checklist: [...checklist, newItem],
    }));
  };

  const handleDelete = (id) => {
    setParameterData((prev) => ({
      ...prev,
      checklist: checklist.filter((item) => item.id !== id),
    }));
  };

  const handleTitleChange = (id, value) => {
    setParameterData((prev) => ({
      ...prev,
      checklist: checklist.map((item) =>
        item.id === id ? { ...item, title: value } : item
      ),
    }));
  };

  const handleSelectedChange = (id, checked) => {
    setParameterData((prev) => ({
      ...prev,
      checklist: checklist.map((item) =>
        item.id === id ? { ...item, selected: checked } : item
      ),
    }));
  };

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = checklist.findIndex((item) => item.id === active.id);
      const newIndex = checklist.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(checklist, oldIndex, newIndex);

      setParameterData((prev) => ({
        ...prev,
        checklist: reordered,
      }));
    }
  };

  return (
    <div>
      <LabelParameters
        text="checklist"
        editingInput={editingInput}
        setEditingInput={setEditingInput}
        checkEditingValidation={false}
      >
        <Button
          action={handleAddChecklistItem}
          type="white"
          headerStyle={{ borderRadius: "999px" }}
        >
          {t("addStatus")}
        </Button>
      </LabelParameters>

    <div className={styles.checklistContainer}>
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={checklist.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {checklist.map((item,index) => (
            <SortableChecklistItem
              key={item.id}
              item={item}
              index={index}
              onDelete={() => handleDelete(item.id)}
              onTitleChange={(value) => handleTitleChange(item.id, value)}
              onSelectedChange={(checked) => handleSelectedChange(item.id, checked)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
    </div>
  );
};

const SortableChecklistItem = ({ item, onDelete, onTitleChange, onSelectedChange,index }) => {
  const [t] = useTranslation("Contacts");

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,

  };

  return (
    <div ref={setNodeRef} style={style} className={styles.checklistItem}>
   <div className={styles.checklistInfo}>
        <GrabIcon {...attributes} {...listeners}/>
   <input
        type="checkbox"
        checked={item.selected}
        onChange={(e) => onSelectedChange(e.target.checked)}
        style={{ cursor: "pointer" }}
      />
      <input
        type="text"
        value={item.title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder={`${t('value')} ${index}`}
        style={{ flexGrow: 1, padding: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
   </div>
      <DeleteButton
        action={onDelete}
        type="black"
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

export default Checklist;
