import React, { useState, useRef, useEffect } from 'react';
import styles from './select.module.css';

const Select = ({
  options = [],
  value = null,
  onChange = () => {},
  placeholder = "Seleccionar opción",
  disabled = false,
  required = false,
  error = false,
  errorMessage = "",
  label = "",
  className = "",
  modalTitle = "Seleccionar opción",
  searchable = false,
  multiple = false,
  maxHeight = "300px",
  customOptionRenderer = null,
  onModalOpen = () => {},
  onModalClose = () => {},
  closeOnSelect = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const selectRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Handle opening modal
  const openModal = () => {
    if (disabled) return;
    setIsModalOpen(true);
    setIsAnimating(false);
    onModalOpen();
  };

  // Handle closing modal
  const closeModal = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSearchTerm('');
      onModalClose();
    }, 200);
  };

  // Handle option selection
  const handleOptionSelect = (selectedOption) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.some(v => v.value === selectedOption.value);
      
      let newValue;
      if (isSelected) {
        newValue = currentValues.filter(v => v.value !== selectedOption.value);
      } else {
        newValue = [...currentValues, selectedOption];
      }
      onChange(newValue);
    } else {
      onChange(selectedOption);
      if (closeOnSelect) {
        closeModal();
      }
    }
  };

  // Get display value
  const getDisplayValue = () => {
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) return value[0].label;
      return `${value.length} opciones seleccionadas`;
    }
    return value ? value.label : placeholder;
  };

  // Check if option is selected (for multiple select)
  const isOptionSelected = (option) => {
    if (multiple && Array.isArray(value)) {
      return value.some(v => v.value === option.value);
    }
    return value && value.value === option.value;
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        if (e.key === 'Escape') {
          closeModal();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <div className={`${styles.selectContainer} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div
        ref={selectRef}
        className={`${styles.selectInput} ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
        onClick={openModal}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
          }
        }}
      >
        <span className={`${styles.selectValue} ${!value || (Array.isArray(value) && value.length === 0) ? styles.placeholder : ''}`}>
          {getDisplayValue()}
        </span>
        <span className={`${styles.selectArrow} ${isModalOpen ? styles.open : ''}`}>
          ▼
        </span>
      </div>

      {error && errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}

      {isModalOpen && (
  
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{modalTitle}</h3>
              <button 
                className={styles.closeButton}
                onClick={closeModal}
                type="button"
              >
                ✕
              </button>
            </div>

            {searchable && (
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                  autoFocus
                />
              </div>
            )}

            <div className={styles.optionsContainer} style={{ maxHeight }}>
              {filteredOptions.length === 0 ? (
                <div className={styles.noOptions}>
                  {searchTerm ? 'No se encontraron opciones' : 'No hay opciones disponibles'}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value || index}
                    className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ''} ${option.disabled ? styles.optionDisabled : ''}`}
                    onClick={() => !option.disabled && handleOptionSelect(option)}
                  >
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={isOptionSelected(option)}
                        onChange={() => {}}
                        className={styles.checkbox}
                      />
                    )}
                    
                    {customOptionRenderer ? (
                      customOptionRenderer(option, isOptionSelected(option))
                    ) : (
                      <div className={styles.optionContent}>
                        <span className={styles.optionLabel}>{option.label}</span>
                        {option.description && (
                          <span className={styles.optionDescription}>{option.description}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {multiple && (
              <div className={styles.modalFooter}>
                <button
                  className={styles.confirmButton}
                  onClick={closeModal}
                  type="button"
                >
                  Confirmar ({Array.isArray(value) ? value.length : 0})
                </button>
              </div>
            )}
          </div>
      )}
    </div>
  );
};

export default Select;