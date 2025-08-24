import React, { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';
import { FaChevronDown } from 'react-icons/fa';

const Dropdown = ({ options, selectedOption, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentSelection = selectedOption || options[0];

  const handleSelect = (option) => {
    onSelect && onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        className={styles.dropdownButton}
        onClick={() => setIsOpen((open) => !open)}
        type='button'
      >
        <span>{currentSelection}</span>
        <FaChevronDown 
          className={styles.arrow}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        />
      </button>
      {isOpen && (
        <ul className={styles.dropdownList}>
          {options.map((option) => (
            <li
              key={option}
              className={styles.dropdownItem}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
