import React, { useEffect, useState } from "react";
import styles from "./CreateNotePopup.module.css";
import HeaderCard from "../HeaderCard/HeaderCard";
import Button from "../Button/Button";
import Toolbar from "../Toolbar/Toolbar";
import CircleTagsComponent from "../CircleTagsComponent/CircleTagsComponent";

import MiniWordDocs from "../Automate/Components/SectionsAutomate/MiniWordDocs/MiniWordDocs";

import { useTranslation } from "react-i18next";
const CreateNotePopup = ({
  hasNote,
  setHasNote,
  noteText,
  setNoteText,
  setNoteColor,
  noteColor,
  setCreatedNote,
  editorContentFinal,
  setEditorContentFinal,
  setEditingNote,
  isAnimating,
  setIsAnimating,
  editingNote,
}) => {
  const [t] = useTranslation("InvoiceForm");
  const [selectedTag, setSelectedTag] = useState(noteColor);

  const [editorContent, setEditorContent] = useState(
    editingNote
      ? editorContentFinal == "Nueva nota"
        ? ""
        : editorContentFinal
      : ""

  );

  const handleCloseNewClient = () => {
    setHasNote(false);
    setTimeout(() => {
    }, 300);
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

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasNote]);
  const [configuration, setConfiguration] = useState({
    selectedEmailConnection: "",
  });

  const handleConfigurationChange = (key, value) => {
    setEditorContent(value)
  };

  return (
    <div style={{ position: "absolute" }}>
      <div className={styles.bg} onClick={() => handleCloseNewClient()}></div>
      <div
        className={`${styles.CreateNotePopup}  ${isAnimating ? styles.scaleDown : styles.scaleUp}`}
      >
        <HeaderCard title={"Nueva Nota"}>
          <Button type="white" action={() => handleCloseNewClient()}>
            {t('cancel')}
          </Button>
          <Button
            action={() => {
              setNoteColor(selectedTag);
              setCreatedNote(true);
              handleCloseNewClient();
              setEditorContentFinal(
                editorContent == "" || editorContent == "<br>"
                  ? t('newNote')
                  : editorContent
              );
            }}
          >
            {t('save')}
          </Button>
        </HeaderCard>
        <div className={styles.containerCreateNotepopup}>
          <div className={styles.contentCreateNotePopup}>
           
          {/* <MiniWordDocs
              configuration={configuration}
              handleConfigurationChange={handleConfigurationChange}

            /> */}
            <CircleTagsComponent
              renderAllTags={true}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              noteColor={noteColor}
            />
          </div>
        </div>
        {editingNote && (
          <div
            className={styles.button}
            onClick={() => {
              setNoteColor(selectedTag);
              setCreatedNote(false);
              handleCloseNewClient();
              setEditorContentFinal("");
            }}
          >
            {t('deleteNote')}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNotePopup;
