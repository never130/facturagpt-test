import React, { useEffect, useState } from "react";
import styles from "./VariableModal.module.css";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as PlusIcon } from "../../assets/addBlack.svg";
import {
  createVariable,
  deleteVariable,
  getVariable,
  updateSelectedVariable,
} from "../../../../actions/user";
import DeleteButton from "../DeleteButton/DeleteButton";
import { useTranslation } from "react-i18next";
import CustomDropdown from "../CustomDropdown/CustomDropdown";

const VariableModal = ({ setShowVariableModal, type, VariableModal, configuration, setConfiguration, uniqueVariable, bgCustom = {} }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation("InvoiceForm");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [typeInput, setTypeInput] = useState('')
  const [required, setRequired] = useState(false)
  const variables = useSelector((state) => state.variables.variables);
  const [showVariables, setShowVariables] = useState([]);
  const [selectedVariables, setSelectedVariables] = useState([]);

  const [localVariables, setLocalVariables] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const allVariables = [...showVariables, ...localVariables];



  const handleAddTax = () => {
    if (title.trim() === "") return;

    const newLocal = {
      _id: `local-${Date.now()}`,
      title,
      description,
      category: type,
      selected: false,
      isLocal: true,
      type: typeInput,
      required
    };

    setLocalVariables((prev) => [...prev, newLocal]);
    setTitle("");
    setDescription("");
    setTypeInput('')
    setRequired(false)
  };

  const toggleSelected = (id, variable) => {
    if (uniqueVariable) {
      setSelectedIds(new Set([id]));
      setSelectedVariables([variable]);
    } else {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
          setSelectedVariables((prev) => prev.filter((v) => v._id !== id));
        } else {
          newSet.add(id);
          setSelectedVariables((prev) => [...prev, variable]);
        }
        return newSet;
      });
    }
  };


  const handleDeleteVariable = async (variable) => {
    if (variable.isLocal) {
      setLocalVariables((prev) => prev.filter((v) => v._id !== variable._id));
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(variable._id);
        return newSet;
      });
    } else {
      await dispatch(deleteVariable({ variableId: variable._id }));
      dispatch(getVariable({ type }));
    }
  };

  const handleSave = async () => {
    if (configuration) {
      setConfiguration((prev) => ({
        ...prev,
        selectedVariables: selectedVariables
      }));
      setShowVariableModal(false);
      return;
    }
    const createPromises = localVariables.map((v) =>
      dispatch(
        createVariable({
          variableData: {
            title: v.title,
            description: v.description,
            category: v.category,
            selected: selectedIds.has(v._id),
            type: v.type,
            required: v.required
          },
        })
      )
    );

    const updatePromises = showVariables.map((v) => {
      const isSelected = selectedIds.has(v._id);
      if (v.selected !== isSelected) {
        return dispatch(
          updateSelectedVariable({
            variableId: v._id,
            selected: isSelected,
          })
        );
      }
      return null;
    });

    await Promise.all([...createPromises, ...updatePromises.filter(Boolean)]);
    dispatch(getVariable({ type }));
    setShowVariableModal(false);
  };




  useEffect(() => {
    dispatch(getVariable({ type }));
  }, [dispatch, type]);

  useEffect(() => {
    const backendVars = Array.isArray(variables.data) ? variables.data : [];
    setShowVariables(backendVars);

    const preSelected = backendVars.filter((v) => v.selected).map((v) => v._id);
    setSelectedIds(new Set(preSelected));
  }, [variables]);


  if (!VariableModal) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div
        className={styles.bg}
        style={bgCustom}
        onClick={() => setShowVariableModal(false)}
      ></div>

      <div className={styles.variableModal}>
        <HeaderCard
          title={
            type === "concept"
              ? t("selectConcept")
              : type === "category"
                ? t("selectCategory")
                : t("selectVariable_generic", { type })
          }
          setState={setShowVariableModal}
        >
          <Button type="white" action={() => setShowVariableModal(false)}>
            {t('cancel')}
          </Button>
          <Button action={handleSave}>{t('save')}</Button>
        </HeaderCard>

        <div className={styles.contentVariableModal}>
          <div className={styles.content}>
            <p>
              {type === "concept"
                ? t("selectConcept")
                : type === "category"
                  ? t("selectCategory")
                  : t("selectVariable_generic", { type })}
            </p>
            <div className={styles.titleTypeContainer}>
              <input
                type="text"
                placeholder={t('title')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {type === 'global' && (
                <CustomDropdown
                  options={['uuid', 'string', 'inter']}
                  selectedOption={typeInput}
                  height="26px"
                  textStyles={{
                    display: "flex",
                    textWrap: "nowrap",
                    gap: "5px",
                    fontWeight: 500,
                    color: "#3d3c42",
                    colorHeader: "#3d3c42",
                    marginLeft: "6px",
                    userSelect: "none",
                    borderRadius: "8px"
                  }}
                  setSelectedOption={(selected) =>
                    setTypeInput(selected)
                  }
                />
              )}
            </div>
            {type === "concept" || type === 'global' && (
              <textarea
                type="text"
                placeholder={t("description")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            )}

            {type === 'global' && (
              <div className={styles.requiredContainer}>
                <input
                  type="checkbox"
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                />
                <span>{t('required')}</span>
              </div>
            )}


            <Button
              type="white"
              action={handleAddTax}
              headerStyle={{ width: "fit-content", borderRadius: "999px" }}
            >
              <PlusIcon />  {type === "concept"
                ? t("newConcept")
                : type === "category"
                  ? t("newCategory")
                  : t("newVariable_generic", { type })}
            </Button>

            {type === "concept" && (
              <p className={styles.multiConcept}>
                {t('attachMultipleDocument')}
              </p>
            )}

            {allVariables.length >= 1 && (
              <div className={styles.variablesList}>
                {allVariables.map((variable) => (
                  <label key={variable._id} className={styles.variableItem}>
                    <div className={styles.leftSideVariableItem}>
                      {type !== 'global' && (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(variable._id)}
                          onChange={() => toggleSelected(variable._id, variable)}
                        />
                      )}
                      <div className={styles.infoVariable}>
                        <p>{variable.title}</p>
                        <span>{variable?.description}</span>
                      </div>
                    </div>
                    <DeleteButton
                      action={() => handleDeleteVariable(variable)}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariableModal;
