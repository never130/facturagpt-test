import React from 'react';
import styles from './CreateParameterPopup.module.css';
import { useTranslation } from 'react-i18next';
import { ReactComponent as PencilEdit } from '../../assets/pencilEdit.svg';

const LabelParameters = ({
  value,
  text, 
  editingInput, 
  setEditingInput, 
  children,
  direction,  
  checkEditingValidation = true  
}) => {
  const [t] = useTranslation("Contacts");

  return (
    <div className={`${styles.numberComponent} ${direction && styles.numberComponentColumn}`} >
      <p className={styles.textContent}>{t(text)}</p>

      <div className={styles.rightSideType}>
      {checkEditingValidation && (  
        <PencilEdit onClick={() => setEditingInput(!editingInput)} />
      )} 

        {!checkEditingValidation ? (
          children
        ) :editingInput ? (
          children
        ) : (
          <span>{value ? value : t('unspecified')}</span>
        )}
      </div>
    </div>
  );
};

export default LabelParameters;
