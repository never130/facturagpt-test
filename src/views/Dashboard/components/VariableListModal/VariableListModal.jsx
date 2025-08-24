import React, { useEffect, useState } from "react";
import styles from "./VariableListModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getVariable } from "../../../../actions/user";
import { ReactComponent as PlusIconGray } from "../../assets/plusIconGray.svg";
import { useTranslation } from "react-i18next";
const VariableListModal = ({
  type,
  setShowVariableListModal,
  setShowVariableModal,
  fromAutomateOut,
  setSelectedVariable,
  customStyles
}) => {
  const dispatch = useDispatch();
  const [showVariables, setShowVariables] = useState([]);
  const variables = useSelector((state) => state.variables.variables);
  const [t] = useTranslation("InvoiceForm");

  useEffect(() => {
    dispatch(getVariable({ type: type }));
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(variables.data)) {
      const filteredVariables = variables.data.filter(
        (variable) => variable.selected
      );
      setShowVariables(filteredVariables);
    }
  }, [variables]);

  const handleSelectVariable = (variable) => {
    if (fromAutomateOut) {
      return { left: type == "category" ? "" : "", top: "100%", minWidth: "100px", width: "100%" };
    } else {
      return { left: type == "category" ? "245px" : "460px" };
    }
  };

  return (
    <>
      <div
        className={styles.overlay}
        onClick={() => setShowVariableListModal(false)}
      ></div>
      <div
        className={styles.variableListModal}
        style={{
          ...handleSelectVariable(),
          ...customStyles,
        }}
      >
        {showVariables.length > 0 ? (
          <div className={styles.variablesList}>
            {showVariables.map((variable) => (
              <p key={variable._id} className={styles.variableItem}onClick={() => {
                setSelectedVariable((prev) => ({
                  ...prev,
                  ...(type === 'category' ? { category: variable } : { concept: variable }),
                }));
                setShowVariableListModal(false)
              }}
              >
                {variable.title}
              </p>
            ))}
          </div>
        ) : (
          <p>{t("noVariablesSelected")}.</p>
        )}
        <div
          className={styles.newConcept}
          onClick={() => {
            setShowVariableListModal(false);
            setShowVariableModal(true);
          }}
        >
          <PlusIconGray />{" "}
          {type === "concept"
            ? t("newConcept")
            : type === "category"
              ? t("newCategory")
              : t("newVariable_generic", { type })}
        </div>
      </div>
    </>
  );
};

export default VariableListModal;
