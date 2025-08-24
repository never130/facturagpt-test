import React, { useState } from "react";
import Button from "../../Button/Button";
import { useTranslation } from "react-i18next";
import styles from "../CreateParameterPopup.module.css";
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
import SortableObjectItem from "./SortableObjectItem";
const Object = ({
  parameterData,
  handleChange,
  editingInput,
  setEditingInput,
}) => {
  const { t } = useTranslation();
  const [expandedObjects, setExpandedObjects] = useState({});
  const [editingObjects, setEditingObjects] = useState({});

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Inicializar el array de objetos si no existe
  const objects = parameterData.objects || [];

  const handleNewValue = () => {
    const newObject = {
      id: Date.now(), // ID único
      title: "",
      array: [""],
    };

    const updatedObjects = [...objects, newObject];
    handleChange({
      name: "objects",
      newValue: updatedObjects,
    });
  };

  const handleToggleExpand = (objectId) => {
    setExpandedObjects((prev) => ({
      ...prev,
      [objectId]: !prev[objectId],
    }));
  };

  const handleToggleEdit = (objectId) => {
    setEditingObjects((prev) => ({
      ...prev,
      [objectId]: !prev[objectId],
    }));
  };

  const handleObjectTitleChange = (objectId, newTitle) => {
    const updatedObjects = objects.map((obj) =>
      obj.id === objectId ? { ...obj, title: newTitle } : obj
    );
    handleChange({
      name: "objects",
      newValue: updatedObjects,
    });
  };

  const handleAddArrayValue = (objectId) => {
    const updatedObjects = objects.map((obj) =>
      obj.id === objectId ? { ...obj, array: [...obj.array, ""] } : obj
    );
    handleChange({
      name: "objects",
      newValue: updatedObjects,
    });
  };

  const handleArrayValueChange = (objectId, arrayIndex, newValue) => {
    const updatedObjects = objects.map((obj) =>
      obj.id === objectId
        ? {
            ...obj,
            array: obj.array.map((item, index) =>
              index === arrayIndex ? newValue : item
            ),
          }
        : obj
    );
    handleChange({
      name: "objects",
      newValue: updatedObjects,
    });
  };

  const handleRemoveObject = (objectId) => {
    const updatedObjects = objects.filter((obj) => obj.id !== objectId);
    handleChange({
      name: "objects",
      newValue: updatedObjects,
    });
  };

     const handleRemoveArrayValue = (objectId, arrayIndex) => {
     const updatedObjects = objects.map((obj) =>
       obj.id === objectId
         ? {
             ...obj,
             array: obj.array.filter((_, index) => index !== arrayIndex),
           }
         : obj
     );
     handleChange({
       name: "objects",
       newValue: updatedObjects,
     });
   };

   const handleDragEnd = (event) => {
     const { active, over } = event;

     if (active.id !== over?.id) {
       const oldIndex = objects.findIndex((obj) => obj.id === active.id);
       const newIndex = objects.findIndex((obj) => obj.id === over.id);

       const reorderedObjects = arrayMove(objects, oldIndex, newIndex);
       handleChange({
         name: "objects",
         newValue: reorderedObjects,
       });
     }
   };

  return (
    <div>
      <div className={styles.headerWithButton}>
        <p className={styles.textContent}>{t("object") || "Objeto"}</p>
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
             items={objects.map(obj => obj.id)}
             strategy={verticalListSortingStrategy}
           >
             {objects.map((obj, index) => (
               <SortableObjectItem
                 key={obj.id}
                 index={index}
                 obj={obj}
                 expandedObjects={expandedObjects}
                 editingObjects={editingObjects}
                 handleToggleExpand={handleToggleExpand}
                 handleToggleEdit={handleToggleEdit}
                 handleObjectTitleChange={handleObjectTitleChange}
                 handleRemoveObject={handleRemoveObject}
                 handleAddArrayValue={handleAddArrayValue}
                 handleArrayValueChange={handleArrayValueChange}
                 handleRemoveArrayValue={handleRemoveArrayValue}
               />
             ))}
           </SortableContext>
         </DndContext>

       
       </div>
    </div>
  );
};

export default Object;
