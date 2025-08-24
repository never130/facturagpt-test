import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as AddBlack } from "../../../assets/addBlack.svg";
import { ReactComponent as AdobeAcrobatIcon } from "../../../assets/AdobeAcrobatIcon.svg";
import { ReactComponent as CodeIconGreen } from "../../../assets/CodeIconGreen2.svg";
import { ReactComponent as ExcelIconGreen } from "../../../assets/ExcelIconGreen.svg";
import { ReactComponent as ImageIconOrange } from "../../../assets/ImageIconOrange.svg";
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import { ReactComponent as WordIconBlue } from "../../../assets/WordIconBlue.svg";
import Button from "../../Button/Button";
import DeleteButton from "../../DeleteButton/DeleteButton";
import styles from "../CreateParameterPopup.module.css";
import LabelParameters from "../LabelParameters";
import BasicAdvancedSelector from "../components/BasicAdvancedSelector";
const FilesMedia = ({
  parameterData,
  setParameterData,
  handleChange,
  editingInput,
  setEditingInput,
  setTypeLocation,
  setLocationState,
}) => {
  const [t] = useTranslation("Contacts");

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);

    const readFiles = await Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              id: `${Date.now()}-${Math.random()}`,
              name: file.name,
              size: file.size,
              base64: reader.result,
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setParameterData((prev) => ({
      ...prev,
      files: [...(prev.files || []), ...readFiles],
    }));

    event.target.value = "";
  };

  const formatFileSize = (bytes) => {
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
  };

  const handleRemoveFile = (idToRemove) => {
    setParameterData((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.id !== idToRemove),
    }));
  };

  const fileIcons = {
    image: ["jpg", "jpeg", "png", "gif", "webp"],
    pdf: ["pdf"],
    word: ["doc", "docx"],
    excel: ["xls", "xlsx", "csv"],
    text: ["txt", "js", "json", "html", "css", "ts"], 
  };
  
  const iconMap = {
    image: <ImageIconOrange />,
    pdf: <AdobeAcrobatIcon />,
    word: <WordIconBlue />,
    excel: <ExcelIconGreen />,
    text: <CodeIconGreen />,
  };
  

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const fileType = Object.keys(fileIcons).find((type) =>
      fileIcons[type].includes(extension)
    );
    return iconMap[fileType] || iconMap.default;
  };

  const handleValueChange = (fieldName, operation) => {
    const currentValue = parameterData[fieldName] || 0;
    let newValue;
    
    if (operation === 'increment') {
      newValue = Number(currentValue) + 1000;
    } else if (operation === 'decrement') {
      newValue = Math.max(0, currentValue - 1); // Evita valores negativos
    }
    
    handleChange({ 
      target: { 
        name: fieldName, 
        value: newValue 
      } 
    });
  };
  return (
    <div>
      {/* <LabelParameters
        value={parameterData.number}
        text={"filesMedia"}
        editingInput={editingInput}
        setEditingInput={setEditingInput}
        checkEditingValidation={false}
      > */}
       <BasicAdvancedSelector
        selectedMode={parameterData.mode || "basic"}
        onModeChange={(mode) =>
          handleChange({ target: { name: "mode", value: mode } })
        }
      />


      <>
          <p className={styles.textContent}>{t("filesMedia")}</p>

        <Button
          action={handleButtonClick}
        >
          {t("addFile")}
        </Button>
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: "none" }}
      multiple
    />
    {/* </LabelParameters> */}
    <div style={{ marginTop: "10px" }}>
      {(parameterData.files || []).map((file, idx) => (
        <div key={idx} className={styles.filesContainer}>
          <div>
            {getFileIcon(file.name)} {file.name}
          </div>
          <div >
            {formatFileSize(file.size)}
            <DeleteButton
              action={() => handleRemoveFile(file.id)}
              type={"black"}
              CustonIcon={WhiteXCloseIcon}
              customIconStyles={{
                height: "20px",
                minWidth: "20px",
                maxWidth:"20px",
                background: "#6E6E80",
              }}
            />
 
          </div>
        </div>
      ))}
      </div>
    </>
    {parameterData.mode !== "basic" && (
  <div className={`${styles.advancedModeTextbox} ${styles.maxMBFilesContainer}`}>
     <div>
          <p>{t("maximumCapacity")}</p>
          <div>
                   <Button 
               type="white" 
               action={() => handleValueChange('maxMBFiles', 'decrement')}
             >
               -
             </Button>
             <input
               type="number"
               name="maxMBFiles"
               value={parameterData.maxMBFiles || 100000}
               onChange={handleChange}
             />MB
             <Button 
               type="white" 
               action={() => handleValueChange('maxMBFiles', 'increment')}
             >
               +
             </Button>
          </div>
        </div>
  </div>
)}


    </div>
  );
};

export default FilesMedia;
