import React, { useState, useCallback, useMemo, useEffect } from "react";
import styles from "./NewTag.module.css";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import DeleteButton from "../DeleteButton/DeleteButton";
import ColorPicker from "../ColorPicker/ColorPicker";
import { useTranslation } from "react-i18next";

const colorOptions = [
  "#222222",
  "#7329a5",
  "#c075ee",
  "#0b06ff",
  "#7086fd",
  "#ff0000",
  "#ff8c00",
  "#12a27f",
  "#16c098",
  "#FFFF00",
  "conic-gradient(#ff9e3d 13%,#eeff00 34%,#7bff79 50%,#1400cc 68%,#b30095 85%,#990003 100%)",
];

const NewTag = ({
  setShowNewTagModal,
  setSelectedTags,
  selectedTags,
  setTags,
  tags,
  setShowAddTags,
  customStyleAssetLine,
  customoBg,
  setSaveTime
}) => {
  const { t } = useTranslation("navbarAdmin");
  const [selectedColor, setSelectedColor] = useState("");
  const [tagName, setTagName] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPk, setColor] = useState("");
  const [presetColors, setPresetColors] = useState([]);
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags)

  useEffect(() => {
    if (localSelectedTags?.length === 0) {
      setLocalSelectedTags(selectedTags);
    }
  }, [selectedTags]);
  

  const handleColorSelect = useCallback((color) => {
    setSelectedColor(color);
  }, []);

  const handleAddTag = useCallback(() => {
    if (!tagName.trim() || !selectedColor) {
      alert(t('selectColorAndEnterName'));
      return;
    }
    const newTag = { id: Date.now(), name: tagName, color: selectedColor };
  
    setTags((prevTags) => [...prevTags, newTag]);

    
    setTagName("");
    setSelectedColor("");
  }, [tagName, selectedColor, setTags]);

  const handleSelectTag = (tags) => {
    setSelectedTags(tags);
    setShowNewTagModal(false);
    setSaveTime && setSaveTime(true)
  };
  
  

    const handleLocalSelectTag = useCallback(
      (tagObj) => {
        setLocalSelectedTags((prev) => {
          const exists = prev.some((t) => t.id === tagObj.id);
          if (exists) {
            return prev.filter((t) => t.id !== tagObj.id);
          } else {
            return [...prev, tagObj];
          }
        });
      },
      [setLocalSelectedTags]
    );
    
    const handleDeleteTag = useCallback(
      (id) => {
        setTags((prevSelected) =>
          prevSelected.filter(tag => tag.id !== id)
        );
    
        setSelectedTags((prevSelected) =>
          prevSelected.filter(tag => tag.id !== id)
        );
        setLocalSelectedTags((prevSelected) =>
          prevSelected.filter(tag => tag.id !== id)
        );
      },
      [setTags, setSelectedTags]
    );
    
    
    
  useEffect(() => {
    handleColorSelect(colorPk);
  }, [colorPk]);

  return (
    <div className={styles.tagsContent}>
      <div
        className={styles.bg} style={customoBg}
        onClick={(e) => {
          e.stopPropagation()
          setShowNewTagModal(false)}}
      ></div>

      <div className={styles.newTagContainer}>
        <HeaderCard title={t('newLabel')} setState={setShowNewTagModal}>
          <Button  action={()=> setShowNewTagModal(false) } type="white">{t('cancel')}</Button>
          <Button action={()=> handleSelectTag(localSelectedTags)}>{t('save')}</Button>
        </HeaderCard>

        <div className={styles.newTagBody}>
          <span>{t('labelName')}</span>
          <input
            type="text"
            placeholder={t('labelPlaceholderInput')}
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
          />

          <div className={styles.circleContainer}>
            {colorOptions.map((color) => {
              const isGradient = color.includes("gradient");
              const isSelected =
                selectedColor === color ||
                (selectedColor === colorPk && isGradient);

              return (
                <div
                  key={color}
                  className={styles.circle}
                  style={{
                    background: isGradient ? colorPk || color : undefined,
                    backgroundColor: isGradient ? undefined : color,
                    border: isSelected
                      ? "4px solid #C3C3C3"
                      : "4px solid white",
                  }}
                  onClick={() => {
                    if (isGradient) {
                      setShowColorPicker(true);
                      handleColorSelect(colorPk);
                    } else {
                      handleColorSelect(color);
                    }
                  }}
                />
              );
            })}
          </div>

          <div className={styles.button} onClick={handleAddTag}>
            {t('newLabel')}
          </div>

          <div className={styles.tagsContainer}>
            {Array.isArray(tags) && tags?.map((tag) => (
              <div key={tag.id} className={styles.tagWrapper}>
                <input
                  type="checkbox"
                  checked={localSelectedTags.some(selected => selected.id === tag.id)}

                  onChange={() => handleLocalSelectTag(tag)}
                />
                <div
                  className={styles.tag}
                  style={{
                    color: tag.color.includes("FFFF00") ? "black" : "white",
                    background: tag.color.includes("gradient")
                      ? colorPk || tag.color
                      : undefined,
                    backgroundColor: tag.color.includes("gradient")
                      ? undefined
                      : tag.color,
                  }}
                >
                  {tag.name}
                </div>
                <DeleteButton customStyleAssetLine={customStyleAssetLine} action={() => handleDeleteTag(tag.id)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {showColorPicker && (
        <ColorPicker
          setShowColorPicker={setShowColorPicker}
          color={colorPk}
          setColor={setColor}
          presetColors={presetColors}
          setPresetColors={setPresetColors}
        />
      )}
    </div>
  );
};

export default NewTag;
