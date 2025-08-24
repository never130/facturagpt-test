import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../Button/Button";
import SearchIconWithIcon from "../../../SearchIconWithIcon/SearchIconWithIcon";
import { ReactComponent as KIcon } from "../../../../assets/KIcon.svg";
import styles from "./RelationshipsFormulas.module.css";
import OperatorOption from "./OperatorOption";
import OperatorView from "../../../../screens/ChatView/Meet/MeetScraping/views/operator";
import ActionsView from "../../../../screens/ChatView/Meet/MeetScraping/views/actions";
import AutomateView from "../../../../screens/ChatView/Meet/MeetScraping/views/automate";
import Value1View from "../../../../screens/ChatView/Meet/MeetScraping/views/value";
import ValueView from "../../../../screens/ChatView/Meet/MeetScraping/views/variable";

/**
 * Componente para renderizar contenido personalizado según la opción seleccionada
 * Se posiciona de forma absoluta sobre el contenido principal
 */
const OptionContent = React.memo(({ 
  selectedOption, 
  onClose, 
  onConfirm,
  customContent,
  position = { top: 0, left: 0 }, // Posición para el posicionamiento absoluto
  onOperatorSelect // Nueva prop para manejar la selección de operadores
}) => {
  const { t } = useTranslation();
  const [searchOption, setSearchOption] = useState("");
  const searchInputOptionRef = useRef(null);
  const containerRef = useRef(null);

  if (!selectedOption) return null;

  // Función para manejar la selección de un operador
  const handleOperatorSelect = (optionType, operatorData) => {
    if (onOperatorSelect) {
      onOperatorSelect(optionType, operatorData);
    }
  };

  // Efecto para detectar clics fuera del contenedor
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Agregar event listener para clics en el documento
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup: remover event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Contenido personalizado por opción
  const renderCustomContent = () => {
    if (customContent && customContent[selectedOption]) {
      return customContent[selectedOption];
    }

    // Contenido por defecto según la opción
    switch (selectedOption) {
      case 'variable':
        return (
         <ValueView/>
        );
      
      case 'operator':
        return (
         <OperatorView 
           onOperatorSelect={handleOperatorSelect}
           onClose={onClose}
         />
        );
      
      case 'value':
        return (
          <Value1View/>
        );
      
      case 'parenthesis':
        return (
          <div className={styles.optionContent}>
            <h4>📝 {t('parenthesis')}</h4>
            <p>{t('Add parentheses for grouping operations')}</p>
            <div className={styles.parenthesisOptions}>
              <Button type="white" action={() => onConfirm('parenthesis', '(')}>(</Button>
              <Button type="white" action={() => onConfirm('parenthesis', ')')}>)</Button>
            </div>
          </div>
        );
      
      case 'action':
        return (
        <ActionsView 
           onActionSelect={handleOperatorSelect}
           onClose={onClose}
        />
        );
      
      case 'automate':
        return (
          <AutomateView/>
        );
      
      default:
        return (
          <div className={styles.optionContent}>
            <p>{t('Select an option to continue')}</p>
          </div>
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className={styles.selectedOptionContainer}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 1000,
        minWidth: '300px',
        maxWidth: '400px'
      }}
    >
      {/* <div className={styles.optionHeader}>
        <h3>{t(selectedOption)}</h3>
        <Button 
          action={onClose}
          type="white"
          headerStyle={{ 
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            padding: "0",
            minWidth: "auto"
          }}
        >
          ×
        </Button>
      </div> */}
      
      {renderCustomContent()}
      
      {/* Barra de búsqueda personalizada */}
      {/* <div className={styles.searchSection}>
        <SearchIconWithIcon
          searchTerm={searchOption}
          setSearchTerm={setSearchOption}
          ref={searchInputOptionRef}
        >
          <>
            <div
              style={{ marginLeft: "5px" }}
              className={styles.searchIconsWrappers}
            >
              <img src={KIcon} alt="kIcon" />
            </div>
          </>
        </SearchIconWithIcon>
      </div> */}
    </div>
  );
});

OptionContent.displayName = 'OptionContent';

export default OptionContent;
