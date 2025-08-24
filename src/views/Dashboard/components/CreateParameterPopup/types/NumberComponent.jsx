import React, { useState } from 'react';
import styles from '../CreateParameterPopup.module.css'
import { useTranslation } from 'react-i18next';
import {ReactComponent as PencilEdit} from '../../../assets/pencilEdit.svg'
import LabelParameters from '../LabelParameters';
import BasicAdvancedSelector from '../components/BasicAdvancedSelector';
import EditableField from '../components/EditableField';
import Button from '../../Button/Button';

const NumberComponent = ({parameterData, handleChange,editingInput,setEditingInput}) => {
  const [t] = useTranslation("Contacts");

  const handleModeChange = (mode) => {
    handleChange({ target: { name: 'mode', value: mode } });
  };

  // Función optimizada para manejar incremento y decremento
  const handleValueChange = (fieldName, operation) => {
    const currentValue = parameterData[fieldName] || 0;
    let newValue;
    
    if (operation === 'increment') {
      newValue = currentValue + 1;
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
      <BasicAdvancedSelector
        selectedMode={parameterData.mode}
        onModeChange={handleModeChange}
      />
{/* <LabelParameters value={parameterData.number} text={'number'} editingInput={editingInput} setEditingInput={setEditingInput}> */}
 
 <>
 <EditableField
  title={t("number")}
  type="number"
  name="number"
  value={parameterData?.number}
  onChange={handleChange}
  placeholder={t('number')}
 />
 </>
 {parameterData.mode !== "basic" && (
  <div className={styles.advancedModeTextbox}>
  <div>
    <p>{t("minValue")}</p>
    <div>
             <Button 
         type="white" 
         action={() => handleValueChange('minValue', 'decrement')}
       >
         -
       </Button>
       <input
         type="number"
         name="minValue"
         value={parameterData.minValue || 0}
         onChange={handleChange}
       />
       <Button 
         type="white" 
         action={() => handleValueChange('minValue', 'increment')}
       >
         +
       </Button>
    </div>
  </div>
  <div>
    <p>{t("maxValue")}</p>
    <div>
             <Button 
         type="white" 
         action={() => handleValueChange('maxValue', 'decrement')}
       >
         -
       </Button>
       <input
         type="number"
         name="maxValue"
         value={parameterData.maxValue || 0}
         onChange={handleChange}
       />
       <Button 
         type="white" 
         action={() => handleValueChange('maxValue', 'increment')}
       >
         +
       </Button>
    </div>
  </div>
  <div>
    <p>{t("increment")}</p>
    <div>
             <Button 
         type="white" 
         action={() => handleValueChange('increment', 'decrement')}
       >
         -
       </Button>
       <input
         type="number"
         name="increment"
         value={parameterData.increment || 0}
         onChange={handleChange}
       />
       <Button 
         type="white" 
         action={() => handleValueChange('increment', 'increment')}
       >
         +
       </Button>
    </div>
  </div>

</div>
) }
    </div>
// </LabelParameters>
  );
};

export default NumberComponent;
