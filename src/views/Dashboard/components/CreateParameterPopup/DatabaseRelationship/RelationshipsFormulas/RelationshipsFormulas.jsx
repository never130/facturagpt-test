import React, { useState, useCallback, useEffect, useRef, createContext, useContext } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./RelationshipsFormulas.module.css";
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";
import { ReactComponent as IconClock } from "../../../../assets/ClockTimerIcon.svg";
import { ReactComponent as IconPlus } from "../../../../assets/addPlus.svg";
import { ReactComponent as WhiteXCloseIcon } from "../../../../assets/WhiteXCloseIcon.svg";
import { ReactComponent as IconGrab } from "../../../../assets/grabIcon.svg";
import { ReactComponent as KIcon } from "../../../../assets/KIcon.svg";
import { useTranslation } from "react-i18next";
import DeleteButton from "../../../DeleteButton/DeleteButton";
import Button from "../../../Button/Button";
import SearchIconWithIcon from "../../../SearchIconWithIcon/SearchIconWithIcon";
import OptionContent from "./OptionContent";

// Contexto para manejar el estado global de las opciones
const OptionsContext = createContext();

// Hook personalizado para usar el contexto de opciones
const useOptionsContext = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error('useOptionsContext debe usarse dentro de OptionsProvider');
  }
  return context;
};

/**
 * Hook personalizado para manejar las opciones de botones
 */
const useButtonOptions = (relationshipId) => {
  const { t } = useTranslation();
  const {
    openButtonOptionsId,
    openOptionContentId,
    openButtonOptions,
    closeButtonOptions,
    openOptionContent,
    closeOptionContent
  } = useOptionsContext();

  // Estado local para guardar la opción seleccionada
  const [selectedOptionType, setSelectedOptionType] = useState(null);

  const buttonOptions = [
    { key: 'variable', label: t('variable'), icon: '📊', description: t('Add a variable to the formula') },
    { key: 'operator', label: t('operator'), icon: '🔧', description: t('Add an operator to the formula') },
    { key: 'value', label: t('value'), icon: '💎', description: t('Add a specific value') },
    // { key: 'parenthesis', label: t('parenthesis'), icon: '📝', description: t('Add parentheses for grouping') },
    { key: 'action', label: t('action'), icon: '⚡', description: t('Add an action or function') },
    { key: 'automate', label: t('automate'), icon: '🤖', description: t('Add automation logic') }
  ];

  const handleButtonOptionClick = useCallback((optionKey) => {
    // Guardar la opción seleccionada en el estado local
    setSelectedOptionType(optionKey);
    
    // Cerrar los botones de opciones
    closeButtonOptions();
    
    // Abrir el contenido de la opción
    openOptionContent(relationshipId);
    
    // Aquí puedes agregar la lógica específica para cada opción
    console.log(`Opción seleccionada: ${optionKey}`);
    setSelectedOptionType(optionKey);
    return optionKey;
  }, [closeButtonOptions, openOptionContent, relationshipId]);

  // Función para limpiar la opción seleccionada
  const clearSelectedOptionType = useCallback(() => {
    setSelectedOptionType(null);
  }, []);

  const isButtonOptionsOpen = openButtonOptionsId === relationshipId;
  const isOptionContentOpen = openOptionContentId === relationshipId;

  return {
    showButtonsOptions: isButtonOptionsOpen,
    selectedOption: selectedOptionType, // Ahora retorna la opción real seleccionada
    buttonOptions,
    handleButtonOptionClick,
    closeButtonsOptions: closeButtonOptions,
    openButtonsOptions: () => openButtonOptions(relationshipId),
    closeOptionContent: () => {
      closeOptionContent();
      clearSelectedOptionType(); // Limpiar la opción seleccionada al cerrar
    },
    isOptionContentOpen,
    clearSelectedOptionType
  };
};

// Provider del contexto de opciones
const OptionsProvider = ({ children }) => {
  const [openButtonOptionsId, setOpenButtonOptionsId] = useState(null);
  const [openOptionContentId, setOpenOptionContentId] = useState(null);

  const openButtonOptions = useCallback((id) => {
    // Cerrar cualquier opción de contenido abierta
    setOpenOptionContentId(null);
    // Abrir los botones de opciones para este ID
    setOpenButtonOptionsId(id);
  }, []);

  const closeButtonOptions = useCallback(() => {
    setOpenButtonOptionsId(null);
  }, []);

  const openOptionContent = useCallback((id) => {
    // Cerrar cualquier botón de opciones abierto
    setOpenButtonOptionsId(null);
    // Abrir el contenido de opción para este ID
    setOpenOptionContentId(id);
  }, []);

  const closeOptionContent = useCallback(() => {
    setOpenOptionContentId(null);
  }, []);

  const closeAllOptions = useCallback(() => {
    setOpenButtonOptionsId(null);
    setOpenOptionContentId(null);
  }, []);

  // Cerrar todas las opciones cuando se presiona Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && (openButtonOptionsId || openOptionContentId)) {
        closeAllOptions();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [openButtonOptionsId, openOptionContentId, closeAllOptions]);

  return (
    <OptionsContext.Provider value={{
      openButtonOptionsId,
      openOptionContentId,
      openButtonOptions,
      closeButtonOptions,
      openOptionContent,
      closeOptionContent,
      closeAllOptions
    }}>
      {children}
    </OptionsContext.Provider>
  );
};

/**
 * Componente ButtonOptions optimizado y reutilizable
 */
const ButtonOptions = React.memo(({ 
  showButtonsOptions, 
  buttonOptions, 
  onButtonClick, 
  onClose 
}) => {
  if (!showButtonsOptions) return null;

  return (
    <div 
      className={styles.buttonsOptions}
      role="dialog"
      aria-label="Opciones de fórmula"
      aria-modal="true"
    >
      {buttonOptions.map(({ key, label, icon, description }) => (
        <Button 
          key={key}
          action={() => onButtonClick(key)}
          headerStyle={{ 
            borderRadius: "999px",
            transition: "all 0.2s ease-in-out",
            minWidth: "120px",
            justifyContent: "center",
            gap: "8px"
          }}
          type="white"
          title={description || `${label} - ${key}`}
          aria-label={`Agregar ${label.toLowerCase()}`}
        >
          <span role="img" aria-label={key} style={{ fontSize: '16px' }}>
            {icon}
          </span>
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
});

ButtonOptions.displayName = 'ButtonOptions';

/**
 * Componente RelationshipsFormulas
 * 
 * Props:
 * - parameterData: Datos del parámetro
 * - handleChange: Función para manejar cambios
 * - maxLevels: Número máximo de niveles permitidos para las relaciones (por defecto: 2)
 *   - maxLevels = 1: Solo permite relaciones de nivel 1
 *   - maxLevels = 2: Permite relaciones de nivel 1 y 2
 *   - maxLevels > 2: Permite relaciones de nivel 1, 2, 3, etc.
 */

// Componente SortableRelationship que maneja el drag and drop
const SortableRelationship = React.memo(({ 
  id,
  level, 
  data, 
  onDataChange, 
  isFirstLevel = false,
  onMoveRelationship,
  maxLevels = 2,
  customContent // Prop para contenido personalizado
}) => {
  const [isOver, setIsOver] = useState(false);
  const { t } = useTranslation();
  
  // Usar el hook personalizado para las opciones de botones
  const {
    showButtonsOptions,
    selectedOption,
    buttonOptions,
    handleButtonOptionClick,
    closeButtonsOptions,
    openButtonsOptions,
    closeOptionContent,
    isOptionContentOpen,
    clearSelectedOptionType
  } = useButtonOptions(id);

  const [localData, setLocalData] = useState(data);
  
  // Ref para el relationshipHeader
  const headerRef = useRef(null);
  
  // Efecto para detectar clics fuera del header cuando showButtonsOptions está abierto
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showButtonsOptions && headerRef.current && !headerRef.current.contains(event.target)) {
        closeButtonsOptions();
      }
    };

    if (showButtonsOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showButtonsOptions, closeButtonsOptions]);
  
  // Función para manejar la confirmación de una opción
  const handleOptionConfirm = useCallback((optionType, selectedValue) => {
    console.log(`Opción confirmada: ${optionType} - ${selectedValue}`);
    
    // Si es un operador, crear un nuevo relationship hijo
    if ((optionType === 'operator' || optionType === 'action') && selectedValue) {
      const newChild = {
        id: `relationship-${Date.now()}-${Math.random()}`,
        level: level + 1,
        selectedOption: selectedValue.name,
        operatorData: selectedValue, // Guardar los datos del operador
        children: []
      };
      
      const updatedData = {
        ...localData,
        children: [...(localData.children || []), newChild]
      };
      
      console.log('Operador guardado:', selectedValue);
      console.log('Datos actualizados:', updatedData);
      
      setLocalData(updatedData);
      onDataChange(updatedData);
    }
    
    // Cerrar el contenido de la opción
    closeOptionContent();
    clearSelectedOptionType(); // Limpiar la opción seleccionada al confirmar
  }, [closeOptionContent, clearSelectedOptionType, level, localData, onDataChange]);

  // Función para cerrar el contenido de la opción
  const handleCloseOptionContent = useCallback(() => {
    closeOptionContent();
    clearSelectedOptionType(); // Limpiar la opción seleccionada al cerrar
  }, [closeOptionContent, clearSelectedOptionType]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Estado local para este nivel de relación
  
  // Sincronizar con los datos del padre cuando cambien
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleAddChild = useCallback(() => {
    // Verificar si se puede agregar un nivel adicional
    if (level >= maxLevels) {
      return; // No permitir agregar más niveles
    }
    
    const newChild = {
      id: `relationship-${Date.now()}-${Math.random()}`,
      level: level + 1,
      selectedOption: "",
      children: []
    };
    
    const updatedData = {
      ...localData,
      children: [...(localData.children || []), newChild]
    };
    
    setLocalData(updatedData);
    onDataChange(updatedData);
  }, [level, localData, onDataChange, maxLevels]);

  const handleRemove = useCallback(() => {
    if (!isFirstLevel) {
      // Notificar al padre que debe eliminar esta relación
      onDataChange(null); // null indica que debe ser eliminada
    }
  }, [isFirstLevel, onDataChange]);

  const handleOptionChange = useCallback((option) => {
    const updatedData = {
      ...localData,
      selectedOption: option
    };
    
    setLocalData(updatedData);
    onDataChange(updatedData);
  }, [localData, onDataChange]);

  const handleChildDataChange = useCallback((childData, childIndex) => {
    if (childData === null) {
      // Eliminar el hijo
      const newChildren = localData.children.filter((_, i) => i !== childIndex);
      const updatedData = {
        ...localData,
        children: newChildren
      };
      
      setLocalData(updatedData);
      onDataChange(updatedData);
    } else {
      // Actualizar el hijo
      const newChildren = [...localData.children];
      newChildren[childIndex] = childData;
      const updatedData = {
        ...localData,
        children: newChildren
      };
      
      setLocalData(updatedData);
      onDataChange(updatedData);
    }
  }, [localData, onDataChange]);

  const handleDrop = useCallback((droppedId) => {
    if (droppedId !== id && !isFirstLevel) {
      onMoveRelationship(droppedId, id);
    }
  }, [id, isFirstLevel, onMoveRelationship]);

  return (
    <div 
      ref={setNodeRef} 
      className={`${styles.relationship} ${styles[`relationshipLevel${level}`]}`}
      data-dragging={isDragging}
      data-over={isOver}
      onDragEnter={() => setIsOver(true)}
      onDragLeave={() => setIsOver(false)}
      style={{ marginLeft: `${(level - 1) * 30}px`, ...style }}
    >
      <div className={styles.relationshipHeader} ref={headerRef}>
        {/* Solo mostrar elementos cuando no estén abiertos los botones de opciones */}
        {!showButtonsOptions && (
          <>
            {!isFirstLevel && (
              <div 
                className={styles.grabHandle}
                {...attributes}
                {...listeners}
                style={{ cursor: 'grab' }}
              >
                <IconGrab />
              </div>
            )}
            {!isFirstLevel && level < maxLevels && (
              <>
                <div className={styles.openCloseOperation}>
                 (
                </div>
              </>
            )}
            {!isFirstLevel  && (
              <div className={styles.operationDropdownContainer}>
              {console.log('Renderizando OperationDropdownContainer con operador/acción:', localData?.operatorData)}
              <CustomDropdown
                   editable={true}
                   editing={true}
                   placeholder={localData?.operatorData ? (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       {localData.operatorData.icon}
                       {/* <span>{localData.operatorData.name}</span> */}
                     </div>
                   ) : '+'}
                   options={localData?.operatorData ? [
                     {
                       label: localData.operatorData.name,
                       icon: localData.operatorData.icon,
                       value: localData.operatorData
                     }
                   ] : [
                     "+",
                     '-',
                     '*',
                     '/',
                   ]}
                   selectedOption={localData?.operatorData ? {
                     label: localData.operatorData.name,
                     icon: localData.operatorData.icon,
                     value: localData.operatorData
                   } : null}
                   hasObject={true}
                   generalStyleFilterSort={{width: "fit-content",minWidth: "fit-content"}}
                 />
              </div>
            )}
            <div className={styles.relationshipDropdownContainer}>
                  <div className={styles.relationshipDropdownIcon}>
                    <IconClock />
                  </div>
                  <CustomDropdown
                    editable={true}
                    editing={true}
                    options={[
                      t("length"),
                      t("weight"),
                      t("volumen"),
                      t("time"),
                      t("speed"),
                    ]}
                    selectedOption={localData?.oneToOneSelectedOption}
                    setSelectedOption={handleOptionChange}
                    father={"automate"}
                    placeholder={t("table/Variable")}
                  />
                </div>

                {!isFirstLevel && level < maxLevels && (
            <div className={styles.openCloseOperation}>
             )
            </div>
          )}
          
          {/* Botón para eliminar (solo si no es el primer nivel) */}
          {!isFirstLevel && (
            <DeleteButton
            action={() => handleRemove()}
            type={"black"}
            CustonIcon={WhiteXCloseIcon}
            customIconStyles={{
              height: "20px",
              minWidth: "20px",
              maxWidth:"20px",
              background: "#6E6E80",
            }}
            />
          )}
        </>
      )}
      
      {/* Botón para agregar relación de siguiente nivel - siempre visible */}
      {level < maxLevels && (
      <div 
        className={`${styles.addRelationshipContainer} ${level >= maxLevels ? styles.disabled : ''}`}
        onClick={showButtonsOptions ? closeButtonsOptions : openButtonsOptions}
        title={level >= maxLevels ? `No se pueden agregar más niveles (máximo: ${maxLevels})` : showButtonsOptions ? 'Cerrar opciones' : `Agregar relación de nivel ${level + 1}`}
        style={{ 
          opacity: level >= maxLevels ? 0.5 : 1,
          cursor: level >= maxLevels ? 'not-allowed' : 'pointer'
        }}
      >
        <IconPlus />
      </div>
      )}
      
      {/* Opciones de botones optimizadas */}
      {showButtonsOptions && (
        <ButtonOptions
          showButtonsOptions={showButtonsOptions}
          buttonOptions={buttonOptions}
          onButtonClick={handleButtonOptionClick}
          onClose={closeButtonsOptions}
        />
      )}
      
      {/* Contenido de la opción seleccionada - se posiciona de forma absoluta */}
      {isOptionContentOpen && (
        <OptionContent
          selectedOption={selectedOption} // Pasar la opción seleccionada al OptionContent
          onClose={handleCloseOptionContent}
          onConfirm={handleOptionConfirm}
          customContent={customContent}
          onOperatorSelect={handleOptionConfirm} // Pasar la función para manejar operadores
          position={{
            top: '100%', // Posicionar debajo del header
            left: '0'
          }}
        />
      )}
    </div>
      
      {/* Contenedor para relaciones hijas */}
      {localData.children && localData.children.length > 0 && (
        <div className={styles.relationshipChildren}>
          {localData.children.map((child, index) => (
            <SortableRelationship
              key={child.id || `${level}-${index}-${child.selectedOption || 'empty'}`}
              id={child.id || `child-${level}-${index}`}
              level={level + 1}
              data={child}
              onDataChange={(change) => handleChildDataChange(change, index)}
              onMoveRelationship={onMoveRelationship}
              maxLevels={maxLevels}
              customContent={customContent}
            />
          ))}
        </div>
      )}
      
      {/* Indicador visual para mostrar que se puede soltar aquí */}
      {isOver && (
        <div className={styles.dropZone}>
          <span>📥 Soltar aquí</span>
        </div>
      )}
      
      {/* Paréntesis de cierre si tiene children */}
      {localData.children && localData.children.length > 0 && (
        <div className={`${styles.openCloseOperation} ${styles.openCloseOperationChildren}`}>
          )
        </div>
      )}
    </div>
  );
});

SortableRelationship.displayName = 'SortableRelationship';

// Componente Relationship reutilizable que maneja su propio estado
const Relationship = React.memo(({ 
  level, 
  data, 
  onDataChange, 
  isFirstLevel = false,
  onMoveRelationship,
  maxLevels = 2,
  customContent // Prop para contenido personalizado
}) => {
  const { t } = useTranslation();
    const {
    showButtonsOptions,
    buttonOptions,
    handleButtonOptionClick,
    closeButtonsOptions,
    openButtonsOptions,
    closeOptionContent,
    isOptionContentOpen,
    clearSelectedOptionType,
    selectedOption
  } = useButtonOptions(data.id);

  // Estado local para este nivel de relación
  const [localData, setLocalData] = useState(data);
  
  // Ref para el relationshipHeader
  const headerRef = useRef(null);
  
  // Efecto para detectar clics fuera del header cuando showButtonsOptions está abierto
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showButtonsOptions && headerRef.current && !headerRef.current.contains(event.target)) {
        closeButtonsOptions();
      }
    };

    if (showButtonsOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showButtonsOptions, closeButtonsOptions]);
  
  // Sincronizar con los datos del padre cuando cambien
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Usar el hook personalizado para las opciones de botones

  // Función para manejar la confirmación de una opción
  const handleOptionConfirm = useCallback((optionType, selectedValue) => {
    console.log(`Opción confirmada: ${optionType} - ${selectedValue}`);
    
    // Si es un operador, crear un nuevo relationship hijo
    if ((optionType === 'operator' || optionType === 'action') && selectedValue) {
      const newChild = {
        id: `relationship-${Date.now()}-${Math.random()}`,
        level: level + 1,
        selectedOption: selectedValue.name,
        operatorData: selectedValue, // Guardar los datos del operador
        children: []
      };
      
      const updatedData = {
        ...localData,
        children: [...(localData.children || []), newChild]
      };
      
      setLocalData(updatedData);
      onDataChange(updatedData);
    }
    
    // Cerrar el contenido de la opción
    closeOptionContent();
    clearSelectedOptionType(); // Limpiar la opción seleccionada al confirmar
  }, [closeOptionContent, clearSelectedOptionType, level, localData, onDataChange]);

  // Función para cerrar el contenido de la opción
  const handleCloseOptionContent = useCallback(() => {
    closeOptionContent();
    clearSelectedOptionType(); // Limpiar la opción seleccionada al cerrar
  }, [closeOptionContent, clearSelectedOptionType]);

  const handleAddChild = useCallback(() => {
    // Verificar si se puede agregar un nivel adicional
    if (level >= maxLevels) {
      return; // No permitir agregar más niveles
    }
    
    const newChild = {
      id: `relationship-${Date.now()}-${Math.random()}`,
      level: level + 1,
      selectedOption: "",
      children: []
    };
    
    const updatedData = {
      ...localData,
      children: [...(localData.children || []), newChild]
    };
    
    setLocalData(updatedData);
    onDataChange(updatedData);
  }, [level, localData, onDataChange, maxLevels]);

  const handleRemove = useCallback(() => {
    if (!isFirstLevel) {
      // Notificar al padre que debe eliminar esta relación
      onDataChange(null); // null indica que debe ser eliminada
    }
  }, [isFirstLevel, onDataChange]);

  const handleOptionChange = useCallback((option) => {
    const updatedData = {
      ...localData,
      selectedOption: option
    };
    
    setLocalData(updatedData);
    onDataChange(updatedData);
  }, [localData, onDataChange]);

  const handleChildDataChange = useCallback((childData, childIndex) => {
    if (childData === null) {
      // Eliminar el hijo
      const newChildren = localData.children.filter((_, i) => i !== childIndex);
      const updatedData = {
        ...localData,
        children: newChildren
      };
      
      setLocalData(updatedData);
      onDataChange(updatedData);
    } else {
      // Actualizar el hijo
      const newChildren = [...localData.children];
      newChildren[childIndex] = childData;
      const updatedData = {
        ...localData,
        children: newChildren
      };
      
      setLocalData(updatedData);
      onDataChange(updatedData);
    }
  }, [localData, onDataChange]);

  return (
    <div className={`${styles.relationship} ${styles[`relationshipLevel${level}`]} ${styles.relationshipMain}`}>

      <div className={styles.relationshipHeader} ref={headerRef}>
        {/* Solo mostrar elementos cuando no estén abiertos los botones de opciones */}
        {!showButtonsOptions && (
          <>
            {isFirstLevel && localData.children && localData.children.length > 0 && maxLevels !== 2 && (
              <div className={styles.openCloseOperation}>
               (
              </div>
            )}
            {!isFirstLevel && (
              <div className={styles.grabHandle}>
                <IconGrab />
              </div>
            )}
            {!isFirstLevel &&  (
              <div className={styles.openCloseOperation}>
               (
              </div>
            )}
            
            {/* Contenedor para mostrar operadores seleccionados */}
            {!isFirstLevel && (
              <div className={styles.operationDropdownContainer}>
              {console.log('Renderizando OperationDropdownContainer con operador/acción:', localData?.operatorData)}
              <CustomDropdown
                   editable={true}
                   editing={true}
                   placeholder={localData?.operatorData ? (
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       {localData.operatorData.icon}
                       {/* <span>{localData.operatorData.name}</span> */}
                     </div>
                   ) : '+'}
                   options={localData?.operatorData ? [
                     {
                       label: localData.operatorData.name,
                       icon: localData.operatorData.icon,
                       value: localData.operatorData
                     }
                   ] : [
                     "+",
                     '-',
                     '*',
                     '/',
                   ]}
                   selectedOption={localData?.operatorData ? {
                     label: localData.operatorData.name,
                     icon: localData.operatorData.icon,
                     value: localData.operatorData
                   } : null}
                   hasObject={true}
                   generalStyleFilterSort={{width: "fit-content",minWidth: "fit-content"}}
                 />
              </div>
            )}
            
            <div className={styles.relationshipDropdownContainer}>
              <div className={styles.relationshipDropdownIcon}>
                <IconClock />
              </div>
              <CustomDropdown
                editable={true}
                editing={true}
                options={[
                  t("length"),
                  t("weight"),
                  t("volumen"),
                  t("time"),
                  t("speed"),
                ]}
                selectedOption={localData?.selectedOption}
                setSelectedOption={handleOptionChange}
                father={"automate"}
                placeholder={t("table/Variable")}
              />
            </div>
          
            {/* Botón para eliminar (solo si no es el primer nivel) */}
            {!isFirstLevel && (
              <DeleteButton
              action={() => handleRemove()}
              type={"black"}
              CustonIcon={WhiteXCloseIcon}
              customIconStyles={{
                height: "20px",
                minWidth: "20px",
                maxWidth:"20px",
                background: "#6E6E80",
              }}
              />
            )}
          </>
        )}
        
        {/* Botón para agregar relación de siguiente nivel - siempre visible */}
        <div 
          className={`${styles.addRelationshipContainer} ${level >= maxLevels ? styles.disabled : ''}`}
          onClick={showButtonsOptions ? closeButtonsOptions : openButtonsOptions}
          title={level >= maxLevels ? `No se pueden agregar más niveles (máximo: ${maxLevels})` : showButtonsOptions ? 'Cerrar opciones' : `Agregar relación de nivel ${level + 1}`}
          style={{ 
            opacity: level >= maxLevels ? 0.5 : 1,
            cursor: level >= maxLevels ? 'not-allowed' : 'pointer'
          }}
        >
          <IconPlus />
        </div>
        
        {/* Opciones de botones optimizadas */}
        {showButtonsOptions && (
          <ButtonOptions
            showButtonsOptions={showButtonsOptions}
            buttonOptions={buttonOptions}
            onButtonClick={handleButtonOptionClick}
            onClose={closeButtonsOptions}
          />
        )}
        
        {/* Contenido de la opción seleccionada - se posiciona de forma absoluta */}
        {isOptionContentOpen && (
          <OptionContent
            selectedOption={selectedOption} // Pasar la opción seleccionada al OptionContent
            onClose={handleCloseOptionContent}
            onConfirm={handleOptionConfirm}
            customContent={customContent}
            onOperatorSelect={handleOptionConfirm} // Pasar la función para manejar operadores
            position={{
              top: '100%', // Posicionar debajo del header
              left: '0'
            }}
          />
        )}
      </div>
      
      {/* Contenedor para relaciones hijas */}
      {localData.children && localData.children.length > 0 && (
        <div className={styles.relationshipChildren}>
          {localData.children.map((child, index) => (
            <SortableRelationship
              key={child.id || `${level}-${index}-${child.selectedOption || 'empty'}`}
              id={child.id || `child-${index}-${child.selectedOption || 'empty'}`}
              level={level + 1}
              data={child}
              onDataChange={(change) => handleChildDataChange(change, index)}
              onMoveRelationship={onMoveRelationship}
              maxLevels={maxLevels}
              customContent={customContent}
            />
          ))}
        </div>
      )}
      
      {/* Paréntesis de cierre si tiene children */}
      {localData.children && localData.children.length > 0 && maxLevels !== 2 && (
        <div className={styles.openCloseOperation}>
          )
        </div>
      )}
    </div>
  );
});

Relationship.displayName = 'Relationship';

const RelationshipsFormulas = ({ 
  parameterData, 
  handleChange, 
  maxLevels = 2,
  customContent = {} // Prop para contenido personalizado por opción
}) => {
  const { t } = useTranslation();
  console.log('parameterData', parameterData);
  
  // Estado local para manejar las relaciones anidadas
  const [relationships, setRelationships] = useState(() => {
    // Si ya existe data, la usamos, sino creamos una estructura inicial
    if (parameterData?.relationships) {
      return parameterData.relationships;
    }
    
    return {
      id: 'main-relationship',
      level: 1,
      selectedOption: parameterData?.oneToOneSelectedOption || "",
      children: []
    };
  });

  // Estado para manejar la opción seleccionada a nivel principal
  const [mainSelectedOption, setMainSelectedOption] = useState(null);

  // Función para manejar la confirmación de una opción a nivel principal
  const handleMainOptionConfirm = useCallback((optionType, selectedValue) => {
    console.log(`Opción principal confirmada: ${optionType} - ${selectedValue}`);
    
    // Si es un operador, crear un nuevo relationship hijo
    if ((optionType === 'operator' || optionType === 'action') && selectedValue) {
      const newChild = {
        id: `relationship-${Date.now()}-${Math.random()}`,
        level: 2,
        selectedOption: selectedValue.name,
        operatorData: selectedValue, // Guardar los datos del operador
        children: []
      };
      
      setRelationships(prev => ({
        ...prev,
        children: [...(prev.children || []), newChild]
      }));
    }
    
    setMainSelectedOption(null);
  }, []);

  // Función para cerrar la opción principal
  const handleCloseMainOption = useCallback(() => {
    setMainSelectedOption(null);
  }, []);

  // Sensores para dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Función para mover relationships entre diferentes niveles
  const moveRelationship = useCallback((draggedId, targetId) => {
    // Evitar mover una relación sobre sí misma
    if (draggedId === targetId) return;
    
    const findRelationship = (data, id) => {
      if (data.id === id) return data;
      if (data.children) {
        for (let child of data.children) {
          const found = findRelationship(child, id);
          if (found) return found;
        }
      }
      return null;
    };

    const removeRelationship = (data, id) => {
      if (data.children) {
        const index = data.children.findIndex(child => child.id === id);
        if (index !== -1) {
          data.children.splice(index, 1);
          return true;
        }
        for (let child of data.children) {
          if (removeRelationship(child, id)) return true;
        }
      }
      return false;
    };

    const addRelationshipToTarget = (data, targetId, relationshipToAdd) => {
      if (data.id === targetId) {
        if (!data.children) data.children = [];
        const newRelationship = {
          ...relationshipToAdd,
          level: data.level + 1,
          children: relationshipToAdd.children || []
        };
        data.children.push(newRelationship);
        return true;
      }
      if (data.children) {
        for (let child of data.children) {
          if (addRelationshipToTarget(child, targetId, relationshipToAdd)) {
            return true;
          }
        }
      }
      return false;
    };

    const draggedRelationship = findRelationship(relationships, draggedId);
    if (!draggedRelationship) return;

    // Crear una copia profunda de las relaciones
    const newRelationships = JSON.parse(JSON.stringify(relationships));
    
    // Remover la relación arrastrada
    removeRelationship(newRelationships, draggedId);
    
    // Agregar la relación al objetivo
    addRelationshipToTarget(newRelationships, targetId, draggedRelationship);
    
    // Actualizar niveles recursivamente
    const updateLevels = (data, level) => {
      data.level = level;
      if (data.children) {
        data.children.forEach(child => updateLevels(child, level + 1));
      }
    };
    updateLevels(newRelationships, 1);
    
    setRelationships(newRelationships);
  }, [relationships]);

  // Función para agregar una nueva relación de primer nivel
  const addFirstLevelRelationship = useCallback(() => {
    // Verificar si se puede agregar una relación de primer nivel
    if (maxLevels < 1) {
      return; // No permitir agregar relaciones de primer nivel
    }
    
    const newRelationship = {
      id: `relationship-${Date.now()}-${Math.random()}`,
      level: 1,
      selectedOption: "",
      children: []
    };

    setRelationships(prev => ({
      ...prev,
      children: [...(prev.children || []), newRelationship]
    }));
  }, [maxLevels]);

  // Función para actualizar los datos de la relación principal
  const updateMainRelationship = useCallback((newData) => {
    if (newData === null) {
      // No permitir eliminar la relación principal
      return;
    }
    
    setRelationships(newData);
    
    // También actualizar el parameterData original para mantener compatibilidad
    if (newData.selectedOption !== relationships.selectedOption) {
      handleChange({
        name: "oneToOneSelectedOption",
        newValue: newData.selectedOption,
      });
    }
  }, [relationships.selectedOption, handleChange]);

  // Sincronizar el estado local con el parameterData
  useEffect(() => {
    if (parameterData?.relationships) {
      setRelationships(parameterData.relationships);
    } else if (parameterData?.oneToOneSelectedOption && !relationships.selectedOption) {
      // Si no hay relationships pero sí hay oneToOneSelectedOption, sincronizar
      setRelationships(prev => ({
        ...prev,
        selectedOption: parameterData.oneToOneSelectedOption
      }));
    }
  }, [parameterData?.relationships, parameterData?.oneToOneSelectedOption, relationships.selectedOption]);

  // Sincronizar cambios locales con el estado padre
  useEffect(() => {
    // Solo sincronizar si hay cambios reales y no es la primera vez
    const currentRelationships = parameterData?.relationships;
    if (currentRelationships && JSON.stringify(currentRelationships) !== JSON.stringify(relationships)) {
      handleChange({
        name: "relationships",
        newValue: relationships,
      });
    }
  }, [relationships, handleChange]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
          moveRelationship(active.id, over.id);
        }
      }}
    >
      <OptionsProvider>
        <div className={styles.relationshipsFormulasContainer}>
          
          {/* Relación principal (primer nivel) */}
          <Relationship
            level={1}
            data={relationships}
            onDataChange={updateMainRelationship}
            isFirstLevel={true}
            onMoveRelationship={moveRelationship}
            maxLevels={maxLevels}
            customContent={customContent}
          />
          
          {/* Contenido de opción seleccionada a nivel principal */}
          {mainSelectedOption && (
            <OptionContent
              selectedOption={mainSelectedOption}
              onClose={handleCloseMainOption}
              onConfirm={handleMainOptionConfirm}
              customContent={customContent}
              onOperatorSelect={handleMainOptionConfirm} // Pasar la función para manejar operadores
              position={{
                top: '50px', // Posicionar desde la parte superior del contenedor
                left: '20px'
              }}
            />
          )}
          
          {/* Botón para agregar más relaciones de primer nivel */}
          {/* <div 
            className={styles.addFirstLevelRelationship}
            onClick={addFirstLevelRelationship}
            style={{ marginTop: '10px', cursor: 'pointer' }}
          >
            <IconPlus /> {t("Agregar relación de primer nivel")}
          </div> */}
        </div>
      </OptionsProvider>
    </DndContext>
  );
};

export default RelationshipsFormulas;

/*
 * SISTEMA DE CONTENIDO PERSONALIZADO PARA BUTTONSOPTIONS:
 * 
 * El componente ahora soporta contenido personalizado para cada opción seleccionada.
 * 
 * SISTEMA DE CONTEXTO GLOBAL:
 * - Solo se puede abrir UN ButtonOptions a la vez
 * - Solo se puede abrir UN OptionContent a la vez
 * - Al abrir una opción, se cierra automáticamente la otra
 * - Control centralizado del estado de todas las opciones
 * 
 * ESTRUCTURA SEPARADA:
 * - ButtonOptions: Se muestra cuando se hace clic en el botón +
 * - OptionContent: Se muestra por separado cuando se selecciona una opción
 * - Ambos componentes se renderizan independientemente
 * 
 * POSICIONAMIENTO:
 * - ButtonOptions: Se posiciona inline con el header
 * - OptionContent: Se posiciona de forma absoluta (position: absolute)
 * - Se puede personalizar la posición con la prop 'position'
 * 
 * CONTROL DE ESTADO:
 * - OptionsContext: Maneja el estado global de todas las opciones
 * - useButtonOptions: Hook personalizado que usa el contexto
 * - Cada relación tiene un ID único para identificar qué opción está abierta
 * - Cierre automático con tecla Escape
 * 
 * USO:
 * 
 * 1. Pasar contenido personalizado como prop:
 *    <RelationshipsFormulas
 *      parameterData={data}
 *      handleChange={handleChange}
 *      maxLevels={3}
 *      customContent={{
 *        variable: (
 *          <div>
 *            <h4>Variables Personalizadas</h4>
 *            <p>Contenido completamente personalizado para variables</p>
 *            <Button>Variable A</Button>
 *            <Button>Variable B</Button>
 *          </div>
 *        ),
 *        operator: (
 *          <div>
 *            <h4>Operadores Especiales</h4>
 *            <p>Operadores matemáticos avanzados</p>
 *            <Button>√</Button>
 *            <Button>^</Button>
 *          </div>
 *        )
 *      }}
 *    />
 * 
 * 2. Si no se proporciona customContent, se usa el contenido por defecto
 * 
 * 3. Los botones y el contenedor se muestran por separado:
 *    - Primero aparecen los botones de opciones
 *    - Al seleccionar una opción, aparece el contenedor de contenido
 * 
 * 4. Cada opción puede tener su propio contenido y lógica
 * 
 * 5. El componente OptionContent está en un archivo separado para mejor mantenimiento
 * 
 * FUNCIONALIDADES:
 * - Contenido personalizable por opción
 * - Estado de opción seleccionada
 * - Cierre automático con Escape
 * - Barra de búsqueda integrada
 * - Botón de cierre para cada opción
 * - Callbacks para confirmación y cierre
 * - Soporte para internacionalización
 * - Componentes memoizados para mejor rendimiento
 * - Posicionamiento absoluto configurable
 * - Separación de responsabilidades en archivos diferentes
 * - Control global de estado para evitar múltiples opciones abiertas
 * - Cierre automático de opciones al abrir nuevas
 */
