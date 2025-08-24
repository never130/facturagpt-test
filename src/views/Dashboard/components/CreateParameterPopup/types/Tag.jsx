import React, { useState } from "react";
import styles from "../CreateParameterPopup.module.css";
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import { ReactComponent as PencilEdit } from "../../../assets/pencilEdit.svg";
import LabelParameters from "../LabelParameters";
import Button from "../../Button/Button";
import { useTranslation } from "react-i18next";
import DeleteButton from "../../DeleteButton/DeleteButton";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";

const Tag = ({
  parameterData,
  setParameterData,
  handleChange,
  editingInput,
  setEditingInput,
  setShowAddTags,
}) => {
  const [t] = useTranslation("Contacts");
  const [tempSelectedTag, setTempSelectedTag] = useState(null);
  
  function lightenHexColor(hex, percent) {
    hex = hex.replace(/^#/, "");
  
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
  
    const num = parseInt(hex, 16);
  
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;
  
    const lighten = (c) =>
      Math.min(255, Math.floor(c + (255 - c) * (percent / 100)));
  
    r = lighten(r);
    g = lighten(g);
    b = lighten(b);
  
    return `rgb(${r}, ${g}, ${b})`;
  }

  const handleAddTag = () => {
    if (tempSelectedTag) {
      // Buscar el tag completo en parameterData.tags
      const selectedTagData = parameterData.tags.find(tag => tag.name === tempSelectedTag);
      
      if (selectedTagData) {
        // Verificar si el tag ya existe en selectedtags
        const tagExists = parameterData.selectedtags?.some(tag => tag.id === selectedTagData.id);
        
        if (!tagExists) {
          // Agregar el tag a selectedtags
          const updatedSelectedTags = [...(parameterData.selectedtags || []), selectedTagData];
          handleChange({ name: "selectedtags", newValue: updatedSelectedTags });
        }
      }
      
      // Limpiar el estado temporal
      setTempSelectedTag(null);
    }
  };

  const handleRemoveTag = (tagId) => {
    const updatedSelectedTags = parameterData.selectedtags?.filter((tag) => tag.id !== tagId) || [];
    handleChange({ name: "selectedtags", newValue: updatedSelectedTags });
  };

  return (
    <div>
      <div className={styles.tagsContainerHeader}>
        <div>
          <CustomDropdown
            editable={true}
            editing={true}
            options={
              parameterData?.tags?.map(tag => tag.name) || []
            }              
            selectedOption={tempSelectedTag}
            setSelectedOption={(option) => setTempSelectedTag(option)}
            placeholder={t('selectATag')}
          />
        </div>
        <Button 
          action={handleAddTag}
          disabled={!tempSelectedTag}
          type="gray"
          headerStyle={{borderRadius: "999px"}}
        >
          {t('add')}
        </Button>
        <Button
          action={() => {
            setShowAddTags(true);
          }}
          type="white"
          headerStyle={{ borderRadius: "999px" }}
        >
          {t("addTag")}
        </Button>
      </div>
      <div className={styles.dropdownContainer}>
      </div>
      <div className={styles.tagsContainer}>
        {parameterData?.selectedtags?.map((tag) => (
          <div key={tag.id} className={styles.tag}>
            <div className={styles.taContent}>
              <span style={{ backgroundColor: lightenHexColor(tag.color, 80),color: tag.color }}>
                {/* <div style={{
                  background: tag.color,
                }} className={styles.circle}></div> */}
                {tag.name}
              </span>
            </div>
            <div className={styles.actionsTag}>
              <Button type="border"><PencilEdit/></Button>
              <DeleteButton
                action={() => handleRemoveTag(tag.id)}
                type={"black"}
                CustonIcon={WhiteXCloseIcon}
                customIconStyles={{
                  height: "30px",
                  minWidth: "30px",
                  background: "#6E6E80",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tag;
