import React, { useState } from "react";
import ModalBlackBgTemplate from "../ModalBlackBgTemplate/ModalBlackBgTemplate";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import styles from "./ColorPicker.module.css";
import { SketchPicker } from "react-color";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const ColorPicker = ({
  color,
  setColor,
  presetColors,
  setPresetColors,
  setShowColorPicker,
  selectedFileKey
}) => {
  const { t } = useTranslation("navbarAdmin");
  const dispatch = useDispatch()
  const [tempColor, setTempColor] = useState(color);

  const handleColorChange = (newColor) => {
    const { r, g, b, a } = newColor.rgb; 
    setTempColor(`rgba(${r}, ${g}, ${b}, ${a})`); 
  };

  const confirmColorSelection = () => {
    if (!presetColors.includes(tempColor)) {
      setPresetColors([...presetColors, tempColor]); 
    }
    
  };

  return (
    <ModalBlackBgTemplate
      customStyle={{ width: "fit-content",minHeight:"40vh" }}
      close={() => setShowColorPicker(false)}
    >
      <div className={styles.NewCategoryContainer}>
        <HeaderCard
          title={t('selectColor')}
          setState={() => {
            setShowColorPicker(false);
          }}
        >
          <Button action={() => setShowColorPicker(false)} type="white">
            {t('cancel')}
          </Button>
          <Button
            action={() => {
              setShowColorPicker(false);
              setColor(tempColor);
            }}
          >
            {t('select')}
          </Button>
          <Button action={confirmColorSelection}>{t('acept')}</Button>
        </HeaderCard>

        <div
          className={styles.colorBox}
          style={{ backgroundColor: tempColor }}
        />
        {selectedFileKey}

        <div className={styles.colorPickerContainer}>
          <SketchPicker
            color={tempColor} 
            onChange={handleColorChange} 
            presetColors={presetColors} 
            styles={{
              default: {
                picker: {
                  width: "40%", 
                  maxHeight: "500px", 
                  overflowY: "auto", 
                  borderRadius: "8px", 
                  border:"none",
                  boxShadow: "none",
                },
                saturation: {
                  border:"none",
                  borderRadius: "8px", 
                },
               
              },
            }}
          />
        </div>
      </div>
    </ModalBlackBgTemplate>
  );
};

export default ColorPicker;