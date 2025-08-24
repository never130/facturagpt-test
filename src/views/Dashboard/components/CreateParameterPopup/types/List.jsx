import React from "react";
import styles from "../CreateParameterPopup.module.css";
import LabelParameters from "../LabelParameters";
import Button from "../../Button/Button";

import { ReactComponent as AddBlack } from "../../../assets/addBlack.svg";
import { useTranslation } from "react-i18next";
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import DeleteButton from "../../DeleteButton/DeleteButton";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItemList from "./SortableItemList";

const List = ({
  parameterData,
  setParameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const [t] = useTranslation("Contacts");

  const handleAddItem = () => {
    const newItem = {
      id: `${Date.now()}-${Math.random()}`,
      title: ``,
    };

    setParameterData((prev) => ({
      ...prev,
      list: [...(prev.list || []), newItem],
    }));
  };

  const handleDeleteItem = (idToDelete) => {
    setParameterData((prev) => ({
      ...prev,
      list: (prev.list || []).filter((item) => item.id !== idToDelete),
    }));
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = parameterData.list.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = parameterData.list.findIndex(
        (item) => item.id === over?.id
      );

      const newList = arrayMove(parameterData.list, oldIndex, newIndex);

      setParameterData((prev) => ({
        ...prev,
        list: newList,
      }));
    }
  };
  return (
    <>
      <LabelParameters
        text={"list"}
        editingInput={editingInput}
        setEditingInput={setEditingInput}
        checkEditingValidation={false}
      >
        <Button
          type="white"
          headerStyle={{ borderRadius: "999px" }}
          action={handleAddItem}
        >
          <AddBlack /> {t("addList")}
        </Button>
      </LabelParameters>

     <div className={styles.listItemContainer}>
     <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(parameterData.list || []).map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {(parameterData.list || []).map((item,index) => (
              <SortableItemList
                key={item.id}
                item={item}
                index={index}
                handleDeleteItem={handleDeleteItem}
                setParameterData={setParameterData}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
     </div>
    </>
  );
};

export default List;
