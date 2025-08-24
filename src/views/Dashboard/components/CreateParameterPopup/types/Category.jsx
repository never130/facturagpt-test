import React, { useState } from "react";
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
import { useTranslation } from "react-i18next";
import LabelParameters from "../LabelParameters";
import Button from "../../Button/Button";
import { ReactComponent as AddBlack } from "../../../assets/addBlack.svg";
import CategorySortableItem from "./CategorySortableItem";
import styles from '../CreateParameterPopup.module.css'
import { v4 as uuidv4 } from "uuid";
const Category = ({
  parameterData,
  setParameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const [t] = useTranslation("Contacts");
const [editinCategory,setEditingCategory] = useState(null)
const handleAddItem = () => {
    const newItem = {
      id: uuidv4(),
      item: '',
      values: [
        {
          id: uuidv4(),
          name: '',
        },
      ],
    };
  
    setParameterData((prev) => ({
      ...prev,
      category: [...(prev.category || []), newItem], 
    }));
  };
  
  const handleAddValue = () => {
    if (!editinCategory) return;
    
    setParameterData((prev) => {
      const updated = prev.category.map((cat) => {
        if (cat.id === editinCategory) {
          return {
            ...cat,
            values: [
              ...cat.values,
              {
                id: `${Date.now()}-${Math.random()}`,
                name: '',
              },
            ],
          };
        }
        return cat;
      });
  
      return {
        ...prev,
        category: updated,
      };
    });
  };
  
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = parameterData.category.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = parameterData.category.findIndex(
        (item) => item.id === over?.id
      );

      const newList = arrayMove(parameterData.category, oldIndex, newIndex);

      setParameterData((prev) => ({
        ...prev,
        category: newList,
      }));
    }
  };

  return (
    <div>
      <LabelParameters
        text={"category"}
        editingInput={editingInput}
        setEditingInput={setEditingInput}
        checkEditingValidation={false}
      >
 <Button
  type="white"
  headerStyle={{ borderRadius: "999px", opacity: !editinCategory && '0.65',cursor: !editinCategory && 'not-allowed' }}
  action={handleAddValue}
>
  <AddBlack /> {t("addValue")}
</Button>

        <Button
          type="white"
          headerStyle={{ borderRadius: "999px" }}
          action={handleAddItem}
        >
          <AddBlack /> {t("newList")}
        </Button>
      </LabelParameters>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(parameterData.category || []).map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.categoriesContainer}>
            {(parameterData.category || []).map((item,index) => (
              <CategorySortableItem
                key={item.id}
                item={item}
                index={index}
                setParameterData={setParameterData}
                setEditingCategory={setEditingCategory}
                editinCategory={editinCategory}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Category;
