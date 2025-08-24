import React from 'react'
import BasicAdvancedSelector from '../components/BasicAdvancedSelector'
import Button from '../../Button/Button'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import CodeEditor from '../../CodeEditor/CodeEditor'

const Xml = ({parameterData, handleChange}) => {
    const [t] = useTranslation("");
    const fileInputRef = useRef(null);

    const handleModeChange = (mode) => {
        handleChange({name: "mode", newValue: mode})
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleChange({name: "xmlFile", newValue: file});
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
       accept=".xml"
       onChange={handleFileSelect}
       style={{ display: 'none' }}
     />
     <Button action={handleButtonClick}>
       {parameterData.xmlFile ? parameterData.xmlFile.name : t('uploadXMLFile')}
     </Button>
   </div>
   {parameterData.mode !== "basic" && (
 <CodeEditor/>
 )}
</div>
  )
}

export default Xml