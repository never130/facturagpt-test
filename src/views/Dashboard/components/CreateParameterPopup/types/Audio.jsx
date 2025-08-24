import React, { useState, useRef } from "react";
import Button from "../../Button/Button";
import { ReactComponent as PencilEdit } from "../../../assets/pencilEdit.svg";
import { ReactComponent as WhiteXCloseIcon } from "../../../assets/WhiteXCloseIcon.svg";
import { useTranslation } from "react-i18next";
import {
  FaUpload,
  FaLink,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import styles from "../CreateParameterPopup.module.css";
import DeleteButton from "../../DeleteButton/DeleteButton";

const Audio = ({ parameterData, setParameterData }) => {
  const { t } = useTranslation();
  const [audios, setAudios] = useState([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const fileInputRef = useRef(null);

  // Función para manejar la subida de archivos de audio
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Verificar que sea un archivo de audio
      if (!file.type.startsWith("audio/")) {
        alert("Por favor selecciona un archivo de audio válido");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Audio = e.target.result;
        const audioInfo = {
          id: Date.now(),
          name: file.name,
          extension: file.name.split(".").pop(),
          size: file.size,
          type: file.type,
          base64: base64Audio,
          isFile: true,
        };

        const newAudios = [...audios, audioInfo];
        setAudios(newAudios);

        // Actualizar parameterData
        if (setParameterData) {
          setParameterData((prev) => ({
            ...prev,
            audios: newAudios,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para agregar URL de audio
  const handleAddUrl = () => {
    if (urlInput.trim()) {
      const audioInfo = {
        id: Date.now(),
        name: urlInput.trim(),
        extension: "url",
        size: 0,
        type: "audio/url",
        url: urlInput.trim(),
        isFile: false,
      };

      const newAudios = [...audios, audioInfo];
      setAudios(newAudios);

      // Actualizar parameterData
      if (setParameterData) {
        setParameterData((prev) => ({
          ...prev,
          audios: newAudios,
        }));
      }

      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  // Función para eliminar audio
  const handleDeleteAudio = (id) => {
    const newAudios = audios.filter((audio) => audio.id !== id);
    setAudios(newAudios);

    // Actualizar parameterData
    if (setParameterData) {
      setParameterData((prev) => ({
        ...prev,
        audios: newAudios,
      }));
    }
  };

  // Función para iniciar edición
  const handleStartEdit = (audio) => {
    console.log('editando esto:', audio.id)
    setEditingId(audio.id);
    setEditName(audio.name);
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  // Función para manejar el clic en el botón de edición
  const handleEditClick = (audio) => {
    if (editingId === audio.id) {
      // Si ya está editando, finalizar edición
      setEditingId(null);
      setEditName("");
    } else {
      // Si no está editando, iniciar edición
      console.log("iniciando");
      handleStartEdit(audio);
    }
  };

  // Función para manejar cambios en el input de edición
  const handleEditChange = (e, audioId) => {
    const newName = e.target.value;
    setEditName(newName);
    
    // Actualizar directamente en el array de audios
    const newAudios = audios.map((audio) =>
      audio.id === audioId ? { ...audio, name: newName } : audio
    );
    setAudios(newAudios);
    
    // Actualizar parameterData
    if (setParameterData) {
      setParameterData((prev) => ({
        ...prev,
        audios: newAudios,
      }));
    }
  };

  // Función para finalizar edición
  const handleFinishEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  // Función para manejar tecla Enter en input de URL
  const handleUrlKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddUrl();
    }
  };

  return (
    <div className={styles.audioComponent}>
      <div className={styles.audiosList}>
        {audios.map((audio) => (
          <div key={audio.id} className="audio-item">
            <div className={styles.audioInfo}>
              {editingId === audio.id ? (
                <div className={styles.editNameContainer}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => handleEditChange(e, audio.id)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleFinishEdit()
                    }
                    onBlur={handleFinishEdit}
                    className="edit-name-input"
                    autoFocus
                  />
                </div>
              ) : (
                <div className={styles.audioDetails}>
                  <span className={styles.audioName}>{audio.name}</span>
                  <span className={styles.audioExtension}>
                    .{audio.extension}
                  </span>
                  {audio.size > 0 && (
                    <span className={styles.audioSize}>
                      ({(audio.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  )}
                </div>
              )}
              <div className={styles.audioActions}>
                {editingId !== audio.id && (
                <div
                  onClick={() => handleEditClick(audio)}
                  className={styles.editBtn}
                  >
                    <PencilEdit />
                  </div>
                )}
                <DeleteButton
                  action={() => handleDeleteAudio(audio.id)}
                  type={"black"}
                  CustonIcon={WhiteXCloseIcon}
                  customIconStyles={{
                    height: "30px",
                    minWidth: "30px",
                    maxWidth: "30px",
                    background: "#6E6E80",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.audioControls}>
        <Button
          action={() => fileInputRef.current?.click()}
          type="white"
          headerStyle={{ borderRadius: "999px" }}
          className={styles.uploadBtn}
        >
          {t("uploadAudio")}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        <Button
          action={() => setShowUrlInput(!showUrlInput)}
          type="white"
          headerStyle={{ borderRadius: "999px" }}
          className={styles.urlBtn}
        >
          {t("addUrl")}
        </Button>
      </div>

      {showUrlInput && (
        <div className={styles.urlInputContainer}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={handleUrlKeyPress}
            onBlur={handleAddUrl}
            placeholder="Ingresa la URL del audio"
            className={styles.urlInput}
            autoFocus
          />
        </div>
      )}

      {audios.length === 0 && (
        <div className={styles.noAudios}>
          <p>No hay audios agregados</p>
        </div>
      )}
    </div>
  );
};

export default Audio;
