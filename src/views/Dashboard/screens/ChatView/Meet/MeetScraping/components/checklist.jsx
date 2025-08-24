import React, { useState } from 'react';
import styles from './checklist.module.css';

const Checklist = ({ 
  title = "Lista de verificación",
  items = [],
  allowMultiple = true,
  onChange = () => {}
}) => {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleItemChange = (itemId) => {
    let newSelected;
    
    if (allowMultiple) {
      // Modo checkbox - permite múltiples selecciones
      newSelected = new Set(selectedItems);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
    } else {
      // Modo radio - solo una selección
      newSelected = new Set();
      if (!selectedItems.has(itemId)) {
        newSelected.add(itemId);
      }
    }
    
    setSelectedItems(newSelected);
    onChange(Array.from(newSelected));
  };

  return (
    <div className={styles.checklist}>
      {/* Header con título */}
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
      </div>

      {/* Lista de items */}
      <div className={styles.items}>
        {items.map((item) => {
          const isSelected = selectedItems.has(item.id);

          return (
            <div 
              key={item.id} 
              className={`${styles.item} ${isSelected ? styles.completed : ''}`}
            >
              {/* Input (checkbox o radio) */}
              <div className={styles.checkbox}>
                <input
                  type={allowMultiple ? "checkbox" : "radio"}
                  id={`item-${item.id}`}
                  name={allowMultiple ? undefined : "checklist-group"}
                  className={styles.checkboxInput}
                  checked={isSelected}
                  onChange={() => handleItemChange(item.id)}
                />
                <div className={styles.checkmark}></div>
              </div>

              {/* Contenido del item */}
              <div className={styles.content}>
                <label 
                  htmlFor={`item-${item.id}`}
                  className={styles.text}
                >
                  {item.text}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Checklist;
