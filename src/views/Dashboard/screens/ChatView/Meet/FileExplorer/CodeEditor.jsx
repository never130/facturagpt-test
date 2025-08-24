import React, { useState, useEffect, useRef } from 'react';
import styles from './CodeEditor.module.css';

const CodeEditor = ({ 
  value, 
  onChange, 
  language = 'javascript', 
  placeholder = 'Escribe tu código aquí...',
  disabled = false,
  onKeyDown,
  autoFocus = false
}) => {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const getLanguageClass = () => {
    switch (language) {
      case 'jsx':
      case 'tsx':
        return styles.jsx;
      case 'css':
      case 'scss':
        return styles.css;
      case 'html':
        return styles.html;
      case 'json':
        return styles.json;
      case 'md':
        return styles.markdown;
      default:
        return styles.javascript;
    }
  };

  return (
    <div className={`${styles.editorContainer} ${isFocused ? styles.focused : ''}`}>
    
      <div className={styles.editorContent}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          className={`${styles.codeTextarea} ${getLanguageClass()}`}
          placeholder={placeholder}
          disabled={disabled}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <div className={styles.lineNumbers}>
          {value.split('\n').map((_, index) => (
            <div key={index} className={styles.lineNumber}>
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor; 