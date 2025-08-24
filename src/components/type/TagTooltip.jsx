import React from 'react';
import BaseTooltip from './BaseTooltip';
// import styles from './Tooltip.module.css';
import tagStyles from './TagTooltip.module.css';


const Tag = ({ text, variant }) => {
  return (
    <div className={`${tagStyles.tag} ${variant === 'green' ? tagStyles.tagGreen : ''}`}>
      <div className={`${tagStyles.tagText} ${variant === 'green' ? tagStyles.tagTextGreen : ''}`}>
        {text}
      </div>
      <div className={tagStyles.removeButton}>
        <div className={`${tagStyles.removeText} ${variant === 'blue' ? tagStyles.removeTextBlue : tagStyles.removeTextGreen}`}>
          ×
        </div>
      </div>
    </div>
  );
};

const TagTooltip = ({ className }) => {
  return (
    <BaseTooltip className={className}>
      <div className={tagStyles.tagContainer}>
        <Tag text="Etiqueta 1" variant="blue" />
        <Tag text="Etiqueta 1" variant="green" />
      </div>
    </BaseTooltip>
  );
};

export default TagTooltip;