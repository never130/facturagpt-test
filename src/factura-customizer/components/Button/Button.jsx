import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false }) => {
  
  const buttonClass = styles[variant] || styles.primary;

  return (
    <button
      type={type}
      className={`${styles.button} ${buttonClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
