import React, { useState, useEffect } from 'react'
import LabelParameters from '../LabelParameters'
import styles from '../CreateParameterPopup.module.css'
import { useTranslation } from 'react-i18next';
import CustomDropdown from '../../CustomDropdown/CustomDropdown';
import {ReactComponent as PencilEdit} from '../../../assets/pencilEdit.svg';
import Button from '../../Button/Button';
import BasicAdvancedSelector from '../components/BasicAdvancedSelector';
import DynamicTable from '../../DynamicTable/DynamicTable';

    const UnitOfMeasurement = ({parameterData, handleChange,editingInput,setEditingInput}) => {
  const [t] = useTranslation("Contacts");
  const [unitOfMeasurement, setUnitOfMeasurement] = useState([]);
  const [editingCells, setEditingCells] = useState({}); // Estado para controlar qué celdas están en edición (formato: "rowIndex-fieldName")

  // Inicializar el estado unitOfMeasurement con parameterData.unitOfMeasurement al cargar el componente
  useEffect(() => {
    if (parameterData.unitOfMeasurement) {
      setUnitOfMeasurement(parameterData.unitOfMeasurement);
    }
  }, [parameterData.unitOfMeasurement]);

  // Función para agregar un nuevo objeto a unitOfMeasurement
  const handleAddValue = () => {
    const newUnitObject = {
      name: '',
      length: '',
      height: '',
      width: '',
      unit: ''
    };
    setUnitOfMeasurement(prev => [...prev, newUnitObject]);
  };

  // Función para guardar el estado unitOfMeasurement en parameterData
  const handleSave = () => {
    handleChange({
      target: {
        name: 'unitOfMeasurement',
        value: unitOfMeasurement
      }
    });
  };

  // Función para activar modo edición de una celda específica
  const handleEditCell = (rowIndex, fieldName) => {
    const cellKey = `${rowIndex}-${fieldName}`;
    setEditingCells(prev => ({
      ...prev,
      [cellKey]: true
    }));
  };

  // Función para guardar cambios de una celda específica
  const handleSaveCell = (rowIndex, fieldName) => {
    const cellKey = `${rowIndex}-${fieldName}`;
    setEditingCells(prev => ({
      ...prev,
      [cellKey]: false
    }));
  };

  // Función para actualizar un campo específico de una fila
  const handleFieldChange = (index, field, value) => {
    setUnitOfMeasurement(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // Función para manejar blur en input (guardar automáticamente)
  const handleInputBlur = (rowIndex, fieldName) => {
    handleSaveCell(rowIndex, fieldName);
  };

  // Función para manejar Enter en input (guardar automáticamente)
  const handleInputKeyPress = (e, rowIndex, fieldName) => {
    if (e.key === 'Enter') {
      handleSaveCell(rowIndex, fieldName);
    }
  };

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
  const handleModeChange = (mode) => {
    handleChange({ target: { name: 'mode', value: mode } });
  };


  const tableHeaders = [
    { label: t(""), key: "" },
    { label: 'name', key: "name" },
    { label: 'length', key: "length" },
    { label: 'height', key: "height" },
    { label: 'width', key: "width" },
    { label: 'unit', key: "unit" },
  ];

  const renderRow = (item, index) => {
    // Función auxiliar para renderizar cada celda editable
    const renderEditableCell = (fieldName, value) => {
      const cellKey = `${index}-${fieldName}`;
      const isEditing = editingCells[cellKey];
      
      return (
        <td key={fieldName} style={{ position: 'relative' }}>
          {isEditing ? (
            <input 
              type="text" 
              value={value || ''} 
              onChange={(e) => handleFieldChange(index, fieldName, e.target.value)}
              onBlur={() => handleInputBlur(index, fieldName)}
              onKeyPress={(e) => handleInputKeyPress(e, index, fieldName)}
              autoFocus
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{value}</span>
              <PencilEdit 
                onClick={() => handleEditCell(index, fieldName)}

              />
              {/* <Button 
                type="white" 
                action={() => handleEditCell(index, fieldName)}
                headerStyle={{ padding: '2px 6px', fontSize: '12px' }}
              >
                ✏️
              </Button> */}
            </div>
          )}
        </td>
      );
    };
    
    return (
      <tr key={index}>
        <td><input type="checkbox" /></td>
        {renderEditableCell('name', item.name)}
        {renderEditableCell('length', item.length)}
        {renderEditableCell('height', item.height)}
        {renderEditableCell('width', item.width)}
        {renderEditableCell('unit', item.unit)}
      </tr>
    );
  };


  return (
    <div>
      <BasicAdvancedSelector
        selectedMode={parameterData.mode}
        onModeChange={handleModeChange}
      />
      {/* <LabelParameters value={parameterData.UnitOfMeasurement} text={'unitOfMeasurement'} editingInput={editingInput} setEditingInput={setEditingInput} > */}
      <p className={styles.textContent}>{t("unitOfMeasurement")}</p>
     
        <>
<div className={styles.unitOfMeasurementHeader}>
  <Button type="white" headerStyle={{borderRadius: "999px"}} action={handleAddValue}>{t('addValue')}</Button>
  <Button action={handleSave}>{t('save')}</Button>
</div>
            <DynamicTable
          columns={tableHeaders}
          data={unitOfMeasurement || []}
          renderRow={renderRow}
          hideCheckbox={true}
          father={"pricing"}
        />
        </>
     
        {parameterData.mode !== "basic" && ( 
        <div className={styles.advancedModeTextbox}>
        <div>
          <p>{t("minValue")}</p>
          <div>
                   <Button 
               type="white" 
               action={() => handleValueChange('minValueUnitMeasurement', 'decrement')}
             >
               -
             </Button>
             <input
               type="number"
               name="minValueUnitMeasurement"
               value={parameterData.minValueUnitMeasurement || 0}
               onChange={handleChange}
             />
             <Button 
               type="white" 
               action={() => handleValueChange('minValueUnitMeasurement', 'increment')}
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
               action={() => handleValueChange('maxValueUnitMeasurement', 'decrement')}
             >
               -
             </Button>
             <input
               type="number"
               name="maxValueUnitMeasurement"
               value={parameterData.maxValueUnitMeasurement || 0}
               onChange={handleChange}
             />
             <Button 
               type="white" 
               action={() => handleValueChange('maxValueUnitMeasurement', 'increment')}
             >
               +
             </Button>
          </div>
        </div>
        <div>
          <p>{t("decimals")}</p>
          <div>
                   <Button 
               type="white" 
               action={() => handleValueChange('decimalsUnitMeasurement', 'decrement')}
             >
               -
             </Button>
             <input
               type="number"
               name="decimalsUnitMeasurement"
               value={parameterData.decimalsUnitMeasurement || 0}
               onChange={handleChange}
             />
             <Button 
               type="white" 
               action={() => handleValueChange('decimalsUnitMeasurement', 'increment')}
             >
               +
             </Button>
          </div>
        </div>
      
      </div>
    )}
    </div>


)}

export default UnitOfMeasurement