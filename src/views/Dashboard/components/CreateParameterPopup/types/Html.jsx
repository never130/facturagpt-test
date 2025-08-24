import React, { useRef } from 'react'
import BasicAdvancedSelector from '../components/BasicAdvancedSelector'
import { useTranslation } from 'react-i18next'
import styles from '../CreateParameterPopup.module.css'
import Button from '../../Button/Button'
import CodeEditor from '../../CodeEditor/CodeEditor'

const Html = ({parameterData, handleChange, editingInput, setEditingInput}) => {
    const [t] = useTranslation("");
    const fileInputRef = useRef(null);

    const handleModeChange = (mode) => {
        handleChange({name: "mode", newValue: mode})
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleChange({name: "htmlfile", newValue: file});
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

  return (
    <div>
         <BasicAdvancedSelector
        selectedMode={parameterData.mode}
        onModeChange={handleModeChange}
      />
     
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".html,.htm"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <Button action={handleButtonClick}>
            {parameterData.htmlfile ? parameterData.htmlfile.name : t('uploadHTMLFile')}
          </Button>
        </div>
        {parameterData.mode !== "basic" && (
      <CodeEditor
      
      />
      )}
    </div>
  )
}

export default Html