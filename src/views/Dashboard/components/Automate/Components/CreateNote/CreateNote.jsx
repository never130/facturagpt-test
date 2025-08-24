import React, { useEffect, useState } from 'react';
import styles from './CreateNote.module.css';
import { useTranslation } from 'react-i18next';

import MiniWordDocs from '../SectionsAutomate/MiniWordDocs/MiniWordDocs';


import CircleTagsComponent from '../../../CircleTagsComponent/CircleTagsComponent';

const CreateNote = ({ configuration, handleConfigurationChange,showCirclesColor=true,setShowColorPicker,colorNote }) => {
  const [t] = useTranslation("AutomatesComponent");

  const isChecked = configuration?.noteEnabled || false;
  const noteColor = configuration?.noteColor || "tagGreen";
  const editorContent = configuration?.noteText || "";
  const [hasNote, setHasNote] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckboxChange = (e) => {
    handleConfigurationChange('noteEnabled', e.target.checked);
  };

  const handleConfigurationChangeNote = (key, value) => {
    handleConfigurationChange(key, value);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && hasNote) {
        setIsAnimating(true);
        setTimeout(() => {
          setHasNote(false);
          setIsAnimating(false);
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasNote]);

  return (
    <div className={`${styles.containerCreateNote} ${isChecked ? styles.expanded : ''}`}>
      <div className={styles.headerCreateNote}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <div className={`${styles.tag} ${styles[noteColor]}`} onClick={() => setShowColorPicker(true)} style={{
          background:colorNote
        }}></div>
        <div >
          {t('addNote')}
        </div>
      </div>

      {isChecked  && (
        <div className={styles.noteInfo}>
          <div className={styles.containerCreateNotepopup}>
            <div className={styles.contentCreateNotePopup}>
              {/* <MiniWordDocs
                configuration={configuration}
                handleConfigurationChange={(key, value) =>
                  handleConfigurationChangeNote('noteText', value)
                }
                initialContent={editorContent} 
                autoResize={true}
              /> */}
              {showCirclesColor && (
                
                <CircleTagsComponent
                renderAllTags={true}
                selectedTag={noteColor}
                setSelectedTag={(tag) =>
                  handleConfigurationChangeNote('noteColor', tag)
                }
                noteColor={noteColor}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNote;
