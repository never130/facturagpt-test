import React, { useState, useRef, useEffect } from 'react';
import { Pencil, ChevronDown, Check, X } from 'lucide-react';
import styles from './EditableLabel.module.css';
import {useTranslation} from "react-i18next";

const EditableLabel = ({
                           value,
                           options = [],
                           onChange,
                           placeholder = "Seleccionar opción...",
                           className = "",
                           labelClassName = "",
                           comboboxClassName = ""
                       }) => {

    const [t] = useTranslation("Contacts");
    const [isEditing, setIsEditing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const [hovering, setHovering] = useState(false);
    const [buttonHover, setButtonHover] = useState(false);
    const [confirmHover, setConfirmHover] = useState(false);
    const [cancelHover, setCancelHover] = useState(false);
    const [optionHover, setOptionHover] = useState(null);
    const comboboxRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsEditing(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePencilClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        setIsOpen(true);
    };

    const handleOptionSelect = (option) => {
        setSelectedValue(option);
        setIsOpen(false);
        setIsEditing(false);
        if (onChange) onChange(option);
    };

    const handleCancel = () => {
        setSelectedValue(value);
        setIsOpen(false);
        setIsEditing(false);
    };

    const handleConfirm = () => {
        setIsOpen(false);
        setIsEditing(false);
        if (onChange && selectedValue !== value) onChange(selectedValue);
    };

    return (
        <div className={`${styles.editableLabel} ${className}`}>
            {!isEditing && (
                <div
                    className={`${styles.labelContainer} ${hovering ? styles.labelContainerHover : ''} ${labelClassName}`}
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                >
                    <span className={styles.labelText}>
                        {t(selectedValue) || placeholder}
                    </span>
                    <Pencil
                        size={16}
                        className={`${styles.pencilIcon} 
                        ${hovering ? styles.pencilIconVisible : styles.pencilIconHidden} 
                        ${buttonHover ? styles.pencilIconHover : ''}`}
                        onClick={handlePencilClick}
                        onMouseEnter={() => setButtonHover(true)}
                        onMouseLeave={() => setButtonHover(false)}
                    />
                </div>
            )}

            {isEditing && (
                <div ref={comboboxRef} className={`${styles.comboboxContainer} ${comboboxClassName}`}>
                    <button
                        type="button"
                        className={styles.comboboxButton}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className={selectedValue ? styles.buttonText : styles.buttonTextPlaceholder}>
                            {t(selectedValue) || placeholder}
                        </span>
                        <ChevronDown
                            size={16}
                            className={`${styles.chevronIcon} ${isOpen ? styles.chevronIconRotated : ''}`}
                        />
                    </button>
                    {isOpen && (
                        <div className={styles.optionsList}>
                            {options.length === 0 ? (
                                <div className={styles.emptyOption}>No hay opciones disponibles</div>
                            ) : (
                                options.map((option, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`${styles.optionButton} ${optionHover === index ? styles.optionButtonHover : ''}`}
                                        onClick={() => handleOptionSelect(option)}
                                        onMouseEnter={() => setOptionHover(index)}
                                        onMouseLeave={() => setOptionHover(null)}
                                    >
                                        <span className={`${styles.optionText} ${selectedValue === option ? styles.optionTextSelected : ''}`}>
                                            {t(option)}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    <div className={styles.actionButtons}>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className={`${styles.actionButton} ${styles.confirmButton} ${confirmHover ? styles.confirmButtonHover : ''}`}
                            onMouseEnter={() => setConfirmHover(true)}
                            onMouseLeave={() => setConfirmHover(false)}
                        >
                            <Check size={14} />
                            Confirmar
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`${styles.actionButton} ${styles.cancelButton} ${cancelHover ? styles.cancelButtonHover : ''}`}
                            onMouseEnter={() => setCancelHover(true)}
                            onMouseLeave={() => setCancelHover(false)}
                        >
                            <X size={14} />
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditableLabel;
