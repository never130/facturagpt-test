import React, { useState } from "react";
import BasicAdvancedSelector from "../components/BasicAdvancedSelector";
import { useTranslation } from "react-i18next";
import styles from "../CreateParameterPopup.module.css";
import Button from "../../Button/Button";
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
import SortableObjectArray from "./SortableObjectArray";
import OptionsSwitchComponent from "../../OptionsSwichComponent/OptionsSwitchComponent";

const Array = ({ parameterData, handleChange, editingInput, setEditingInput }) => {
  const { t } = useTranslation();
  const [expandedArrays, setExpandedArrays] = useState({});
  const [editingArrays, setEditingArrays] = useState({});

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Inicializar el array de arrays si no existe
  const arrays = parameterData.array || [];

  const handleNewValue = () => {
    const newArray = {
      id: Date.now(), // ID único
      title: "",
      array: [""],
    };

    const updatedArrays = [...arrays, newArray];
    handleChange({
      name: "array",
      newValue: updatedArrays,
    });
  };

  const handleToggleExpand = (arrayId) => {
    setExpandedArrays((prev) => ({
      ...prev,
      [arrayId]: !prev[arrayId],
    }));
  };

  const handleToggleEdit = (arrayId) => {
    setEditingArrays((prev) => ({
      ...prev,
      [arrayId]: !prev[arrayId],
    }));
  };

  const handleArrayTitleChange = (arrayId, newTitle) => {
    const updatedArrays = arrays.map((arr) =>
      arr.id === arrayId ? { ...arr, title: newTitle } : arr
    );
    handleChange({
      name: "array",
      newValue: updatedArrays,
    });
  };

  const handleAddArrayValue = (arrayId) => {
    const updatedArrays = arrays.map((arr) =>
      arr.id === arrayId ? { ...arr, array: [...arr.array, ""] } : arr
    );
    handleChange({
      name: "array",
      newValue: updatedArrays,
    });
  };

  const handleArrayValueChange = (arrayId, arrayIndex, newValue) => {
    const updatedArrays = arrays.map((arr) =>
      arr.id === arrayId
        ? {
            ...arr,
            array: arr.array.map((item, index) =>
              index === arrayIndex ? newValue : item
            ),
          }
        : arr
    );
    handleChange({
      name: "array",
      newValue: updatedArrays,
    });
  };

  const handleRemoveArray = (arrayId) => {
    const updatedArrays = arrays.filter((arr) => arr.id !== arrayId);
    handleChange({
      name: "array",
      newValue: updatedArrays,
    });
  };

  const handleRemoveArrayValue = (arrayId, arrayIndex) => {
    const updatedArrays = arrays.map((arr) =>
      arr.id === arrayId
        ? {
            ...arr,
            array: arr.array.filter((_, index) => index !== arrayIndex),
          }
        : arr
    );
    handleChange({
      name: "array",
      newValue: updatedArrays,
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = arrays.findIndex((arr) => arr.id === active.id);
      const newIndex = arrays.findIndex((arr) => arr.id === over.id);

      const reorderedArrays = arrayMove(arrays, oldIndex, newIndex);
      handleChange({
        name: "array",
        newValue: reorderedArrays,
      });
    }
  };

  return (
    <div>
       <BasicAdvancedSelector
        selectedMode={parameterData.mode || "basic"}
        onModeChange={(mode) =>
          handleChange({ target: { name: "mode", value: mode } })
        }
      />

        <>
          <div className={styles.headerWithButton}>
            <p className={styles.textContent}>{t("array") || "Array"}</p>
            <Button headerStyle={{ marginLeft: "auto", borderRadius:"999px"}} type="white" action={handleNewValue}>
              {t("newValue") || "Nuevo Valor"}
            </Button>
          </div>

          <div className={styles.objectsList}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={arrays.map((arr) => arr.id)}
                strategy={verticalListSortingStrategy}
              >
                {arrays.map((arr, index) => (
                  <SortableObjectArray
                    key={arr.id}
                    index={index}
                    obj={arr}
                    expandedObjects={expandedArrays}
                    editingObjects={editingArrays}
                    handleToggleExpand={handleToggleExpand}
                    handleToggleEdit={handleToggleEdit}
                    handleObjectTitleChange={handleArrayTitleChange}
                    handleRemoveObject={handleRemoveArray}
                    handleAddArrayValue={handleAddArrayValue}
                    handleArrayValueChange={handleArrayValueChange}
                    handleRemoveArrayValue={handleRemoveArrayValue}
                  />
                ))}
              </SortableContext>
            </DndContext>

          
          </div>
        </>
        {parameterData.mode !== "basic" && (
        <div>
          {/* Modo avanzado - aquí puedes agregar la funcionalidad avanzada */}
          <div className={styles.switchContainer}>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"0"}
              isChecked={parameterData?.addUnitOfMeasurement || false}
              setIsChecked={(value) => {
                console.log("value", value);
                handleChange({ name: "addUnitOfMeasurement", newValue: value });
              }}
            />
            <p>{t("addUnitOfMeasurement")}</p>
          </div>
          <div className={styles.switchContainer}>
            <OptionsSwitchComponent
              border={"none"}
              marginLeft={"0"}
              isChecked={parameterData?.convertValuesToAmount || false}
              setIsChecked={(value) => {
                console.log("value", value);
                handleChange({ name: "convertValuesToAmount", newValue: value });
              }}
            />
            <p>{t("convertValuesToAmount")}</p>
          </div>

         </div>
         )}
    </div>
  );
};

export default Array;