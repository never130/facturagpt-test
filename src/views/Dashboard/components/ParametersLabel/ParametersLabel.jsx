import { useRef, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import KIcon from "../../assets/KIcon.svg";

import { ReactComponent as GrabIcon } from "../../assets/grabIcon.svg";
import { ReactComponent as ArrowDown } from "../../assets/arrowDownGray.svg";
import { ReactComponent as Minus } from "../../assets/minus.svg";
import styles from "./ParametersLabel.module.css";
import { ReactComponent as Pencil } from "../../assets/pencilEdit.svg";
import { ReactComponent as AddBlack } from "../../assets/addBlack.svg";
import { useTranslation } from "react-i18next";
import SearchIconWithIcon from "../SearchIconWithIcon/SearchIconWithIcon";
import useFocusShortcut from "../../../../utils/useFocusShortcut";
import Button, { ButtonDiferentContentScreen } from "../Button/Button";

export const ParametersLabel = ({
  parameters,
  setContactDataInputs,
  editingIndices,
  setEditingIndices,
  addUnit,
  isCategory = false,
  showCreateParameter,
  setShowCreateParameter,
  customStyleColumnDirection
}) => {
  const [t] = useTranslation("Contacts");
  const [isParametersVisible, setIsParametersVisible] = useState(true);

  const addParameter = () => {
    if (typeof showCreateParameter !== "undefined") {
      setShowCreateParameter(true);
    } else {
      setContactDataInputs((prev) => ({
        ...prev,
        parameters: [
          ...prev.parameters,
          { name: "", value: "", title: "", id: Date.now() },
        ],
      }));
    }
  };

  const deleteParameter = (index) => {
    setContactDataInputs((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index),
    }));
  };

  const toggleParametersVisibility = () => {
    setIsParametersVisible((prev) => !prev);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setContactDataInputs((prev) => {
        const oldIndex = prev.parameters.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = prev.parameters.findIndex(
          (item) => item.id === over.id
        );

        const updatedParameters = arrayMove(
          prev.parameters,
          oldIndex,
          newIndex
        );

        return {
          ...prev,
          parameters: updatedParameters, 
        };
      });

    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const searchInputRef = useRef(null);
  useFocusShortcut(searchInputRef, "k");

  return (
    <div className={styles.parametersLabel}>
      <div className={styles.parametersHeaderLabel} style={customStyleColumnDirection}>
        <h3
          id="parameters"
          className={styles.parametersCounter}
        >
          {t("parameters")} (
          {
            parameters?.filter((item) =>
              (item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.delete == false)
            ).length
          }
          )
        </h3>
        <ButtonDiferentContentScreen 
            threshold={768}
            smallContent={<AddBlack/>}
            largeContent={   <><AddBlack/>{t("addParameter")}</>}
            buttonProps={{ type: "white", action: (e) => addParameter(e) ,   headerStyle: {borderRadius: "999px"}}}
            />
      </div>
      <div
        className={styles.parametersContainer}
        style={{
          height: isParametersVisible ? "auto" : "0px",
          overflow: "hidden",
        }}
      >
        <SearchIconWithIcon
          ref={searchInputRef}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          classNameIconRight={styles.searchContainerL}
          onClickIconRight={() => setIsFilterOpen(true)}
          placeholder={t("searchAutomations")}
          stylesComponent={{ padding: "0" }}
        >
          <>
            <div
              style={{ marginLeft: "5px" }}
              className={styles.searchIconsWrappers}
            >
              <img src={KIcon} alt="kIcon" />
            </div>
          </>
        </SearchIconWithIcon>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {Array.isArray(parameters) && (
            <SortableContext items={parameters?.map((item) => item.id)}>
              <div className={styles.parametersContainer}>
                {parameters
                  ?.filter((item) =>
                    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) && (item.delete == false))
                  )
                  .map((item, index) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      editingIndices={editingIndices}
                      index={index}
                      addUnit={addUnit}
                      isCategory={isCategory}
                      deleteParameter={deleteParameter}
                      setContactDataInputs={setContactDataInputs}
                      setEditingIndices={setEditingIndices}
                      parameters={parameters}
                    />
                  ))}
              </div>
            </SortableContext>
          )}
        </DndContext>
      </div>
    </div>
  );
};
function SortableItem({
  item,
  editingIndices,
  index,
  setContactDataInputs,
  parameters,
  deleteParameter,
  isCategory,
  addUnit,
  setEditingIndices,
}) {
  const [t] = useTranslation("Contacts");
  const isEditing = editingIndices.includes(index);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [addUnitMeasurement, setAddUnitMeasurement] = useState(false);

  return (
    <div ref={setNodeRef} style={style} className={styles.parameterContent}>
      <div className={styles.parameter}>
        <div className={styles.grabInfoparameter}>
          <GrabIcon
            className={styles.grabIcon}
            {...listeners}
            {...attributes}
          />
          {isCategory && (
            <div>
              <span>{t("category")}</span>
              <select
                value={item.category || ""}
                onChange={(e) => {
                  const newParameters = [...parameters];
                  newParameters[index].category = e.target.value;
                  setContactDataInputs((prev) => ({
                    ...prev,
                    parameters: newParameters,
                  }));
                }}
                disabled={!isEditing}
              >
                <option value="">{t("selectACategory")}</option>
                <option value={t("assetIdentification")}>
                  {t("assetIdentification")}
                </option>
                <option value={t("assetClassification")}>
                  {t("assetClassification")}
                </option>
                <option value={t("financialInformation")}>
                  {t("financialInformation")}
                </option>
                <option value={t("maintenance")}>{t("maintenance")}</option>
                <option value={t("operations")}>{t("operations")}</option>
                <option value={t("inventoryManagement")}>
                  {t("inventoryManagement")}
                </option>
                <option value={t("risksAndCompliance")}>
                  {t("risksAndCompliance")}
                </option>
                <option value={t("iotDataAndMonitoring")}>
                  {t("iotDataAndMonitoring")}
                </option>
                <option value={t("removalOrReplacement")}>
                  {t("removalOrReplacement")}
                </option>
                <option value={t("keyIndicators")}>{t("keyIndicators")}</option>
              </select>
            </div>
          )}
          <div className={styles.parameterNameValue}>
            <div>
              <input
                type="text"
                placeholder={`${t("parameterTitle")} `}
                value={item.name}
                onChange={(e) => {
                  const newParameters = [...parameters];
                  newParameters[index].name = e.target.value;
                  setContactDataInputs((prev) => ({
                    ...prev,
                    parameters: newParameters,
                  }));
                }}
                disabled={!isEditing}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder={t("parameterValue")}
                value={item.value}
                onChange={(e) => {
                  const newParameters = [...parameters];
                  newParameters[index].value = e.target.value;
                  setContactDataInputs((prev) => ({
                    ...prev,
                    parameters: newParameters,
                  }));
                }}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            className={styles.editPencilContainer}
            onClick={() => {
              if (isEditing) {
                setEditingIndices((prev) => prev.filter((i) => i !== index));
                setContactDataInputs((prev) => ({
                  ...prev,
                  parameters: prev.parameters.map((p, i) =>
                    i === index ? { ...p, title: item.name } : p
                  ),
                }));
              } else {
                setEditingIndices((prev) => [...prev, index]);
              }
            }}
          >
            <Pencil />
          </div>

          <div className={styles.delete} onClick={() => deleteParameter(index)}>
            <Minus className={styles.icon} />
          </div>
        </div>
      </div>
      {addUnit && (
        <div className={styles.AddUnit}>
          <div>
            <input
              type="checkbox"
              checked={addUnitMeasurement}
              disabled={!isEditing}
              onChange={(e) => {
                setAddUnitMeasurement(e.target.checked);
              }}
            />
            <p>{t("addUnitMeasurement")}</p>
          </div>
          {addUnitMeasurement && (
            <input
              type="text"
              placeholder={t("unitMeasurement")}
              value={item.UnitMeasurement}
              onChange={(e) => {
                const newParameters = [...parameters];
                newParameters[index].UnitMeasurement = e.target.value;
                setContactDataInputs((prev) => ({
                  ...prev,
                  parameters: newParameters,
                }));
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
