import React from "react";
import LabelParameters from "../LabelParameters";
import { useTranslation } from "react-i18next";
import styles from '../CreateParameterPopup.module.css'
import DatabaseRelationship from "../DatabaseRelationship/DatabaseRelationship";

const Formula = ({
    parameterData,
    setParameterData,
    handleChange,
    editingInput,
    setEditingInput,
    setShowAddTags,
  }) => {
  const [t] = useTranslation("Contacts");

  const handleKeyDown = (e) => {
    if (e.altKey || e.ctrlKey) {
      e.stopPropagation();
    }
  };

  return (
    <DatabaseRelationship parameterData={parameterData} handleChange={handleChange}/>

  )
}

export default Formula