import React, { useState } from 'react';
import { ReactComponent as PencilIcon } from '../../../assets/pencilEdit.svg';
import styles from '../CreateParameterPopup.module.css';
import CustomDropdown from '../../../components/CustomDropdown/CustomDropdown';

const EditableField = ({
  title,
  type = 'text',
  name,
  value = '',
  onChange,
  placeholder = '',
  className = '',
  defaultValue = '',
  options = [],
  rightSection,
  description,
  toggleEdit = true
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    onChange(e);
  };

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          value={value || defaultValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={className}
        />
      );
    }
if(type === 'customDropdown'){
  return (
   <CustomDropdown
   options={options}
   setSelectedOption={(option) => handleChange({ target: { name: name, value: option } })}
   selectedOption={value}
   />
  )
}
    return (
      <input
        type={type}
        name={name}
        value={value || defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
      />
    );
  };

  return (
    <div style={{width: isEditing && "100%"}}>
      <div className={styles.titleContainer}>
      {title && <p>{title}</p>}
      {rightSection && rightSection}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isEditing || !toggleEdit? (
          renderInput()
        ) : (
          <span className={styles.regexText}>
            {value || defaultValue || placeholder}
          </span>
        )}
        {toggleEdit && <PencilIcon onClick={toggleEditing} />}
      </div>
      {description && <p className={styles.descriptionEditableField}>{description}</p>}
    </div>
  );
};

export default EditableField;
