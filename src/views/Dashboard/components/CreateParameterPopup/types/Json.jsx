import React from 'react'
import BasicAdvancedSelector from '../components/BasicAdvancedSelector'
import CodeEditor from '../../CodeEditor/CodeEditor'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../Button/Button'

const Json = ({parameterData, handleChange}) => {
    const [t] = useTranslation("");
    const fileInputRef = useRef(null);

    const handleModeChange = (mode) => {
        handleChange({name: "mode", newValue: mode})
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleChange({name: "jsonFile", newValue: file});
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
       accept=".json"
       onChange={handleFileSelect}
       style={{ display: 'none' }}
     />
     <Button action={handleButtonClick}>
       {parameterData.jsonFile ? parameterData.jsonFile.name : t('uploadJSONFile')}
     </Button>
   </div>
   {parameterData.mode !== "basic" && (
 <CodeEditor
 
 />
 )}
</div>
  )
}

export default Json