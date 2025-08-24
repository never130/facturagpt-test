import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import styles from './FolderIndicator.module.css';

const FolderIndicator = ({ selectedPath, isVisible, onClose, onAddDocument, onOpenChat }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { agentId, chatId } = useParams();

  const selectedLines = useSelector(state => state.docs.app.selectedLines);
  const selectedAgent = useSelector(state => state.chat.selectedAgent);

  if (!isVisible || !selectedPath) {
    return null;
  }

  const getFolderName = (path) => {
    const parts = path.split('/');
    if (parts.length <= 1) return path;
    if (isFolderPath(path)) {
      return path;
    }
    return parts.slice(0, -1).join('/');
  };

  const getFileName = (path) => {
    const parts = path.split('/');
    return parts[parts.length - 1];
  };

  const isFolderPath = (path) => {
    if (!path) return false;
    return path.endsWith('/') || !path.includes('.') || path.split('/').pop().indexOf('.') === -1;
  };

  const getFileIcon = (path) => {
    if (isFolderPath(path)) {
      return '📁';
    }
    
    const ext = path.split('.').pop().toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return '⚛️';
      case 'ts':
      case 'js':
        return '📄';
      case 'css':
      case 'scss':
        return '🎨';
      case 'json':
        return '⚙️';
      case 'md':
        return '📝';
      case 'html':
        return '🌐';
      default:
        return '📄';
    }
  };

  const getFileType = (path) => {
    if (isFolderPath(path)) {
      return 'Carpeta';
    }
    
    const ext = path.split('.').pop().toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return 'React Component';
      case 'ts':
        return 'TypeScript';
      case 'js':
        return 'JavaScript';
      case 'css':
      case 'scss':
        return 'Stylesheet';
      case 'json':
        return 'JSON';
      case 'md':
        return 'Markdown';
      case 'html':
        return 'HTML';
      default:
        return 'Archivo';
    }
  };

  const getSelectedLinesText = () => {
    if (!selectedLines) return null;

    const { startLine, endLine } = selectedLines;

    if (startLine === endLine) {
      return `(${startLine})`;
    } else {
      return `(${startLine}-${endLine})`;
    }
  };

  const handleAddDocument = async () => {

    if (!onAddDocument) {
      console.error('❌ FolderIndicator: onAddDocument function is not provided');
      return;
    }

    setIsCreating(true);

    try {
      const fileName = getFileName(selectedPath);
      const fileExtension = fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.')) : '';
      const baseName = fileName.replace(/\.[^/.]+$/, '');
      const timestamp = Date.now();
      const newFileName = `${baseName}_new_${timestamp}${fileExtension}`;

      const directory = selectedPath.substring(0, selectedPath.lastIndexOf('/'));
      const newFilePath = `${directory}/${newFileName}`;

      console.log('📁 Creating new file at:', newFilePath);

      await onAddDocument(selectedPath, newFilePath);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose(); 
      }, 2000);

    } catch (error) {
      console.error('❌ Error creating document:', error);
      alert('Error al crear el archivo. Por favor, intenta de nuevo.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChat = () => {
    if (!selectedAgent?._id) {
      console.error('❌ No hay agente seleccionado');
      alert('Por favor, selecciona un agente primero');
      return;
    }

    const newChatId = chatId || uuidv4();
    
    let initialMessage = `Necesito ayuda con el archivo: ${selectedPath}`;
    
    if (selectedLines) {
      const { startLine, endLine } = selectedLines;
      if (startLine === endLine) {
        initialMessage += `\n\nEspecíficamente con la línea ${startLine}`;
      } else {
        initialMessage += `\n\nEspecíficamente con las líneas ${startLine} a ${endLine}`;
      }
    }
    
    const fileType = getFileType(selectedPath);
    initialMessage += `\n\nEs un archivo de tipo: ${fileType}`;
    
    navigate(`/admin/chat/${selectedAgent._id}/${newChatId}`, {
      state: {
        initialMessage,
        selectedFile: selectedPath,
        selectedLines: selectedLines
      }
    });

    onClose();
  };


  const [items, setItems] = useState([
    { icon: '✏️', name: 'Comentar líneas seleccionadas', category: 'basic-edit', fn: 'comment-selected-lines' },
    { icon: '🗑️', name: 'Borrar líneas seleccionadas', category: 'basic-edit', fn: 'delete-selected-lines' },
    { icon: '📋', name: 'Duplicar líneas seleccionadas', category: 'basic-edit', fn: 'duplicate-selected-lines' },
    { icon: '↕️', name: 'Mover líneas hacia arriba', category: 'basic-edit', fn: 'move-lines-up' },
    { icon: '↕️', name: 'Mover líneas hacia abajo', category: 'basic-edit', fn: 'move-lines-down' },
    { icon: '🔍', name: 'Buscar y reemplazar texto', category: 'basic-edit', fn: 'search-and-replace' },
    { icon: '📝', name: 'Formatear código automáticamente', category: 'basic-edit', fn: 'format-code' },
    { icon: '🎯', name: 'Seleccionar palabra actual', category: 'basic-edit', fn: 'select-current-word' },
    { icon: '📏', name: 'Indentar código', category: 'basic-edit', fn: 'indent-code' },
    { icon: '🔧', name: 'Desindentar código', category: 'basic-edit', fn: 'unindent-code' },



    { icon: '🏠', name: 'Ir al inicio del archivo', category: 'navigation', fn: 'go-to-start-of-file' },
    { icon: '🏁', name: 'Ir al final del archivo', category: 'navigation', fn: 'go-to-end-of-file' },
    { icon: '📍', name: 'Ir a línea específica', category: 'navigation', fn: 'go-to-line' },
    { icon: '🔙', name: 'Volver a posición anterior', category: 'navigation', fn: 'go-back' },
    { icon: '🔜', name: 'Ir a posición siguiente', category: 'navigation', fn: 'go-forward' },
    { icon: '📚', name: 'Navegar entre archivos abiertos', category: 'navigation', fn: 'navigate-between-open-files' },
    { icon: '🎯', name: 'Buscar definición de función', category: 'navigation', fn: 'go-to-function-definition' },
    { icon: '🔗', name: 'Ir a implementación', category: 'navigation', fn: 'go-to-implementation' },
    { icon: '📖', name: 'Ver referencias', category: 'navigation', fn: 'view-references' },
    { icon: '🔍', name: 'Buscar en todos los archivos', category: 'navigation', fn: 'search-in-all-files' },

    { icon: '🔄', name: 'Renombrar variable', category: 'refactor', fn: 'rename-variable' },
    { icon: '🔄', name: 'Renombrar función', category: 'refactor', fn: 'rename-function' },
    { icon: '🔄', name: 'Renombrar clase', category: 'refactor', fn: 'rename-class' },
    { icon: '📦', name: 'Extraer método', category: 'refactor', fn: 'extract-method' },
    { icon: '📦', name: 'Extraer variable', category: 'refactor', fn: 'extract-variable' },
    { icon: '📦', name: 'Extraer constante', category: 'refactor', fn: 'extract-constant' },
    { icon: '🔧', name: 'Invertir condición', category: 'refactor', fn: 'invert-condition' },
    { icon: '🔄', name: 'Cambiar orden de parámetros', category: 'refactor', fn: 'change-parameter-order' },
    { icon: '📋', name: 'Duplicar función', category: 'refactor', fn: 'duplicate-function' },
    { icon: '✂️', name: 'Eliminar código muerto', category: 'refactor', fn: 'remove-dead-code' },
    { icon: '🔄', name: 'Reorganizar imports', category: 'refactor', fn: 'reorganize-imports' },
    { icon: '🔧', name: 'Simplificar expresión', category: 'refactor', fn: 'simplify-expression' },
    { icon: '📦', name: 'Crear interfaz', category: 'refactor', fn: 'create-interface' },
    { icon: '📦', name: 'Crear tipo personalizado', category: 'refactor', fn: 'create-custom-type' },

    { icon: '🐛', name: 'Añadir breakpoint', category: 'debug', fn: 'add-breakpoint' },
    { icon: '🐛', name: 'Añadir log de depuración', category: 'debug', fn: 'add-debug-log' },
    { icon: '🔍', name: 'Inspeccionar variable', category: 'debug', fn: 'inspect-variable' },
    { icon: '📊', name: 'Ver stack trace', category: 'debug', fn: 'view-stack-trace' },
    { icon: '🔧', name: 'Evaluar expresión', category: 'debug', fn: 'evaluate-expression' },
    { icon: '🔄', name: 'Continuar ejecución', category: 'debug', fn: 'continue-execution' },
    { icon: '⏭️', name: 'Paso a paso', category: 'debug', fn: 'step-through' },
    { icon: '⏭️', name: 'Paso a paso por función', category: 'debug', fn: 'step-through-function' },
    { icon: '🔙', name: 'Retroceder', category: 'debug', fn: 'go-back' },
    { icon: '🎯', name: 'Ir a breakpoint', category: 'debug', fn: 'go-to-breakpoint' },
    { icon: '📋', name: 'Ver variables locales', category: 'debug', fn: 'view-local-variables' },
    { icon: '📋', name: 'Ver variables globales', category: 'debug', fn: 'view-global-variables' },

    { icon: '📁', name: 'Crear nuevo archivo', category: 'file-management', fn: 'create-new-file' },
    { icon: '📁', name: 'Crear nueva carpeta', category: 'file-management', fn: 'create-new-folder' },
    { icon: '📁', name: 'Renombrar archivo', category: 'file-management', fn: 'rename-file' },
    { icon: '📁', name: 'Mover archivo', category: 'file-management', fn: 'move-file' },
    { icon: '📁', name: 'Copiar archivo', category: 'file-management', fn: 'copy-file' },
    { icon: '🗑️', name: 'Eliminar archivo', category: 'file-management', fn: 'delete-file' },
    { icon: '📁', name: 'Buscar archivos', category: 'file-management', fn: 'search-files' },
    { icon: '📁', name: 'Comparar archivos', category: 'file-management', fn: 'compare-files' },
    { icon: '📁', name: 'Ver historial de cambios', category: 'file-management', fn: 'view-change-history' },
    { icon: '📁', name: 'Revertir cambios', category: 'file-management', fn: 'revert-changes' },
    { icon: '📁', name: 'Crear backup', category: 'file-management', fn: 'create-backup' },
    { icon: '📁', name: 'Restaurar backup', category: 'file-management', fn: 'restore-backup' },

    { icon: '📚', name: 'Generar documentación de API', category: 'documentation', fn: 'generate-api-documentation' },
    { icon: '📚', name: 'Crear README', category: 'documentation', fn: 'create-readme' },
    { icon: '📚', name: 'Documentar funciones', category: 'documentation', fn: 'document-functions' },
    { icon: '📚', name: 'Crear diagramas de arquitectura', category: 'documentation', fn: 'create-architecture-diagrams' },
    { icon: '📚', name: 'Documentar flujo de datos', category: 'documentation', fn: 'document-data-flow' },
    { icon: '📚', name: 'Crear guías de usuario', category: 'documentation', fn: 'create-user-guides' },
    { icon: '📚', name: 'Documentar decisiones técnicas', category: 'documentation', fn: 'document-technical-decisions' },
    { icon: '📚', name: 'Crear changelog', category: 'documentation', fn: 'create-changelog' },
    { icon: '📚', name: 'Documentar configuración', category: 'documentation', fn: 'document-configuration' },
    { icon: '📚', name: 'Crear diagramas de secuencia', category: 'documentation', fn: 'create-sequence-diagrams' },
    { icon: '📚', name: 'Documentar endpoints', category: 'documentation', fn: 'document-endpoints' },
    { icon: '📚', name: 'Crear diagramas de base de datos', category: 'documentation', fn: 'create-database-diagrams' },
    { icon: '📚', name: 'Documentar errores comunes', category: 'documentation', fn: 'document-common-errors' },

  ])

  return (
    <div className={styles.folderIndicator} onClick={(e) => e.stopPropagation()}>
      <div className={styles.indicatorContent}>
        <div className={styles.folderInfo}>
          <span className={styles.folderIcon}>📁</span>
          {isFolderPath(selectedPath) ? (
            <>
              <span className={styles.folderPath}>{selectedPath}</span>
              <span className={styles.fileType}>(Carpeta)</span>
            </>
          ) : (
            <>
              <span className={styles.folderPath}>{getFolderName(selectedPath)}</span>
              <span className={styles.separator}>/</span>
              <span className={styles.fileIcon}>{getFileIcon(selectedPath)}</span>
              <span className={styles.fileName}>{getFileName(selectedPath)}</span>
              <span className={styles.fileType}>({getFileType(selectedPath)})</span>
              {selectedLines && (
                <span className={styles.selectedLines}>{getSelectedLinesText()}</span>
              )}
            </>
          )}
        </div>

        <div className={styles.actions}>
          {showSuccess ? (
            <div className={styles.successMessage}>
              ✅ ¡Archivo creado!
            </div>
          ) : (
            <>
              {selectedAgent?._id ? (
                <button
                  className={styles.chatButton}
                  onClick={handleOpenChat}
                  disabled={isCreating}
                  title="Abrir ChatView con este archivo"
                >
                  💬 Chat
                </button>
              ) : (
                <div className={styles.noAgentMessage} title="Selecciona un agente para usar el chat">
                  ⚠️ Sin agente
                </div>
              )}
              <button
                className={styles.addDocumentButton}
                onClick={handleAddDocument}
                disabled={isCreating}
                title="Crear nuevo archivo en esta carpeta"
              >
                {isCreating ? '🔄 Creando...' : '📄 Crear Archivo'}
              </button>
              {onOpenChat && (
                <button
                  className={styles.openChatButton}
                  onClick={() => onOpenChat(selectedPath, selectedLines)}
                  disabled={isCreating}
                  title="Abrir ChatView con este elemento"
                >
                  🚀 Abrir Chat
                </button>
              )}
            </>
          )}

          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            disabled={isCreating}
            title="Cerrar indicador"
          >
            ✕
          </button>
        </div>
      </div>
        <ul className={styles.actionsList}>
          {items.map((item, index) => (
            <li key={index} className={styles.actionItem}>
              <div className={styles.actionIcon}>
                {item.icon}
              </div>
              <p className={styles.actionName}>
                {item.name} 
              </p>
              <span className={styles.actionCategory}>
                {item.fn}
              </span>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default FolderIndicator; 