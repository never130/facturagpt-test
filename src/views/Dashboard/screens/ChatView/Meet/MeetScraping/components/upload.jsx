import React, { useState, useRef } from 'react';
import styles from './upload.module.css';

const Upload = ({
  // Props para configurar el comportamiento
  onFileSelect = () => {},
  onFileUpload = () => {},
  onFileRemove = () => {},
  
  // Props para personalizar la apariencia
  title = "Subir archivo",
  description = "Arrastra y suelta un archivo aquí o haz clic para seleccionar",
  buttonText = "Seleccionar archivo",
  
  // Props para validación
  acceptedTypes = "*",
  maxSize = 10 * 1024 * 1024, // 10MB por defecto
  maxFiles = 1,
  
  // Props para estado
  disabled = false,
  loading = false,
  
  // Props para personalización visual
  className = "",
  showPreview = true,
  showProgress = false,
  progress = 0,
  
  // Props para mensajes
  errorMessage = "",
  successMessage = "",
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(errorMessage);
  const fileInputRef = useRef(null);

  // Validar archivo
  const validateFile = (file) => {
    if (maxSize && file.size > maxSize) {
      return `El archivo es demasiado grande. Máximo ${formatFileSize(maxSize)}`;
    }
    
    if (acceptedTypes !== "*") {
      const acceptedTypesArray = acceptedTypes.split(',').map(type => type.trim());
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      const mimeType = file.type;
      
      const isValidType = acceptedTypesArray.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type;
        }
        return mimeType.includes(type.replace('*', ''));
      });
      
      if (!isValidType) {
        return `Tipo de archivo no válido. Tipos permitidos: ${acceptedTypes}`;
      }
    }
    
    return null;
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Manejar selección de archivos
  const handleFileSelect = (files) => {
    const fileList = Array.from(files);
    
    if (fileList.length > maxFiles) {
      setError(`Máximo ${maxFiles} archivo(s) permitido(s)`);
      return;
    }

    const validFiles = [];
    let hasError = false;

    fileList.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        hasError = true;
      } else {
        validFiles.push({
          file,
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        });
      }
    });

    if (!hasError) {
      setError("");
      setSelectedFiles(validFiles);
      onFileSelect(validFiles);
    }
  };

  // Manejar drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled || loading) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Manejar click en input
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  // Abrir selector de archivos
  const openFileSelector = () => {
    if (!disabled && !loading) {
      fileInputRef.current?.click();
    }
  };

  // Remover archivo
  const removeFile = (fileId) => {
    const updatedFiles = selectedFiles.filter(f => f.id !== fileId);
    setSelectedFiles(updatedFiles);
    onFileRemove(fileId);
  };

  // Subir archivos
  const uploadFiles = () => {
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
    }
  };

  return (
    <div className={`${styles.uploadContainer} ${className}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      
      {/* Zona de drop */}
      <div
        className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''} ${disabled ? styles.disabled : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileSelector}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedTypes}
          onChange={handleInputChange}
          className={styles.hiddenInput}
          disabled={disabled}
        />
        
        <div className={styles.dropContent}>
          <div className={styles.uploadIcon}>📁</div>
          <p className={styles.description}>{description}</p>
          <button 
            type="button"
            className={styles.selectButton}
            disabled={disabled || loading}
          >
            {loading ? "Cargando..." : buttonText}
          </button>
          
          {acceptedTypes !== "*" && (
            <p className={styles.acceptedTypes}>
              Tipos permitidos: {acceptedTypes}
            </p>
          )}
          
          {maxSize && (
            <p className={styles.maxSize}>
              Tamaño máximo: {formatFileSize(maxSize)}
            </p>
          )}
        </div>
      </div>

      {/* Mostrar progreso */}
      {showProgress && progress > 0 && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className={styles.progressText}>{progress}%</span>
        </div>
      )}

      {/* Mostrar archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className={styles.selectedFiles}>
          <h4 className={styles.filesTitle}>Archivos seleccionados:</h4>
          {selectedFiles.map((fileData) => (
            <div key={fileData.id} className={styles.fileItem}>
              {showPreview && fileData.preview && (
                <img 
                  src={fileData.preview} 
                  alt="Preview" 
                  className={styles.filePreview}
                />
              )}
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{fileData.name}</span>
                <span className={styles.fileSize}>{formatFileSize(fileData.size)}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(fileData.id)}
                className={styles.removeButton}
                disabled={disabled || loading}
              >
                ✕
              </button>
            </div>
          ))}
          
          {onFileUpload && (
            <button
              type="button"
              onClick={uploadFiles}
              className={styles.uploadButton}
              disabled={disabled || loading}
            >
              {loading ? "Subiendo..." : "Subir archivos"}
            </button>
          )}
        </div>
      )}

      {/* Mensajes de error y éxito */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
    </div>
  );
};

export default Upload;