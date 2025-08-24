import React, { useState, useEffect, useCallback } from 'react';
import styles from './FolderNavigator.module.css';

const FolderNavigator = ({
  fileMap,
  selectedPath,
  onFileSelect,
  onFileDelete,
  onFileCreate,
  onFileRename,
  onFolderSelect,
  isLoading = false,
  children,
  currentProject = 'react-basic',
  availableProjects = [],
  onProjectChange
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [editValue, setEditValue] = useState('');

  const buildFolderStructure = useCallback(() => {
    console.log('🔍 buildFolderStructure called');
    console.log('📁 fileMap size:', fileMap.size);
    console.log('📁 fileMap keys:', Array.from(fileMap.keys()));
    
    const structure = {};

    const foldersWithFiles = new Set();
    
    const emptyFolders = new Set();

    for (const path of fileMap.keys()) {
      if (path.startsWith('__EMPTY_FOLDER__')) {
        const folderPath = path.replace('__EMPTY_FOLDER__', '');
        emptyFolders.add(folderPath);
      }
    }

    for (const path of fileMap.keys()) {
      if (path.startsWith('__EMPTY_FOLDER__')) {
        continue;
      }
      
      console.log('📄 Processing path:', path);
      const parts = path.split('/');
      let current = structure;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = { type: 'file', path, content: fileMap.get(path) };
          console.log(`📄 Added file: ${part} at path: ${path}`);
          
          let parentPath = '';
          for (let j = 0; j < parts.length - 1; j++) {
            parentPath = parentPath ? `${parentPath}/${parts[j]}` : parts[j];
            foldersWithFiles.add(parentPath);
          }
        } else {
          if (!current[part]) {
            current[part] = { type: 'folder', children: {} };
          }
          current = current[part].children;
        }
      }
    }

    for (const emptyFolderPath of emptyFolders) {
      const parts = emptyFolderPath.split('/');
      let current = structure;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          if (!current[part]) {
            current[part] = { type: 'folder', children: {}, isEmpty: true };
          }
        } else {
          if (!current[part]) {
            current[part] = { type: 'folder', children: {} };
          }
          current = current[part].children;
        }
      }
    }

    console.log('🏗️ Final structure:', structure);
    console.log('📁 Expanded folders:', Array.from(expandedFolders));
    
    return structure;
  }, [fileMap, expandedFolders]);

  useEffect(() => {
    console.log('🔄 Auto-expand effect - fileMap size:', fileMap.size);
    
    if (fileMap.size === 0) {
      console.log('📁 No files in fileMap, skipping auto-expand');
      return;
    }
    
    const newExpanded = new Set();
    let hasChanges = false;

    for (const path of fileMap.keys()) {
      if (path.startsWith('__EMPTY_FOLDER__')) {
        continue;
      }
      
      const parts = path.split('/');
      let currentPath = '';

      for (let i = 0; i < parts.length - 1; i++) {
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
        newExpanded.add(currentPath);
        console.log('📁 Adding folder to expanded:', currentPath);
      }
    }

    if (newExpanded.size > 0) {
      console.log('✅ Setting expanded folders:', Array.from(newExpanded));
      setExpandedFolders(newExpanded);
    }
  }, [fileMap]);

  const isFolderEmpty = useCallback((folderPath) => {
    for (const path of fileMap.keys()) {
      if (path.startsWith('__EMPTY_FOLDER__')) {
        continue;
      }
      
      if (path.startsWith(folderPath + '/')) {
        return false; 
      }
    }
    return true; 
  }, [fileMap]);

  const handleFileDelete = useCallback((filePath) => {
    if (filePath.startsWith('__EMPTY_FOLDER__')) {
      console.log('⚠️ No se puede eliminar una entrada de carpeta vacía');
      return;
    }
    

    onFileDelete(filePath);

    const parentPath = filePath.substring(0, filePath.lastIndexOf('/'));
    if (parentPath && isFolderEmpty(parentPath)) {
      console.log(`Carpeta ${parentPath} quedó vacía pero se mantiene en el fileMap`);
      
      const emptyFolderKey = `__EMPTY_FOLDER__${parentPath}`;
      
      if (onFileCreate) {
        onFileCreate(emptyFolderKey, ''); 
      }

      setExpandedFolders(prev => {
        const newExpanded = new Set(prev);
        newExpanded.add(parentPath);
        return newExpanded;
      });
    }
  }, [onFileDelete, isFolderEmpty, onFileCreate]);

  const toggleFolder = (folderPath) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = useCallback((filePath) => {
    if (filePath.startsWith('__EMPTY_FOLDER__')) {
      console.log('⚠️ No se puede seleccionar una entrada de carpeta vacía');
      return;
    }
    
    if (onFileSelect) {
      onFileSelect(filePath);
    }
    
  }, [onFileSelect]);

  const getFileIcon = (path) => {
    if (path && path.startsWith('__EMPTY_FOLDER__')) {
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
        return '📁';
    }
  };

  const handleDragStart = (e, item) => {
    if (item.path && item.path.startsWith('__EMPTY_FOLDER__')) {
      e.preventDefault();
      return;
    }
    
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, item) => {
    if (item.path && item.path.startsWith('__EMPTY_FOLDER__')) {
      return;
    }
    
    e.preventDefault();
    setDragOverItem(item);
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    
    if (targetItem.path && targetItem.path.startsWith('__EMPTY_FOLDER__')) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }
    
    if (draggedItem && targetItem && draggedItem.path !== targetItem.path) {
      console.log(`Mover ${draggedItem.path} a ${targetItem.path}`);
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleFileRename = (filePath) => {
    if (filePath.startsWith('__EMPTY_FOLDER__')) {
      console.log('⚠️ No se puede renombrar una entrada de carpeta vacía');
      return;
    }
    
    setEditingFile(filePath);
    setEditValue(filePath.split('/').pop());
  };

  const saveRename = () => {
    if (editingFile && editValue) {
      if (editingFile.startsWith('__EMPTY_FOLDER__')) {
        setEditingFile(null);
        setEditValue('');
        return;
      }
      
      const newPath = editingFile.replace(/\/[^/]+$/, `/${editValue}`);
      onFileRename(editingFile, newPath);
    }
    setEditingFile(null);
    setEditValue('');
  };

  const cancelRename = () => {
    setEditingFile(null);
    setEditValue('');
  };

  const renderTreeItem = (name, item, currentPath = '') => {
    const fullPath = currentPath ? `${currentPath}/${name}` : name;
    const isSelected = selectedPath === fullPath;
    const isExpanded = expandedFolders.has(fullPath);
    const isDragging = draggedItem && draggedItem.path === fullPath;
    const isDragOver = dragOverItem && dragOverItem.path === fullPath;

    if (item.type === 'folder') {
      return (
        <div key={fullPath} className={styles.treeItem}>
          <div
            className={`${styles.folderItem} ${isDragOver ? styles.dragOver : ''}`}
            onDragOver={(e) => handleDragOver(e, { type: 'folder', path: fullPath })}
            onDrop={(e) => handleDrop(e, { type: 'folder', path: fullPath })}
          >
            <div className={styles.folderHeader}>
              <button
                className={styles.folderToggle}
                onClick={() => toggleFolder(fullPath)}
                disabled={isLoading}
              >
                {isExpanded ? '📂' : '📁'}
              </button>
              <span className={styles.itemName}>{name}</span>
              <div className={styles.itemActions}>
                <button
                  className={styles.actionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newFileName = prompt('Nombre del nuevo archivo:');
                    if (newFileName) {
                      const newFilePath = `${fullPath}/${newFileName}`;
                      onFileCreate(newFilePath, '');
                    }
                  }}
                  title="Crear archivo"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          {isExpanded && (
            <div className={styles.folderContent}>
              {Object.entries(item.children).map(([childName, childItem]) =>
                renderTreeItem(childName, childItem, fullPath)
              )}
              {/* Mostrar mensaje si la carpeta está vacía pero expandida */}
              {Object.keys(item.children).length === 0 && (
                <div className={styles.emptyFolder}>
                  <span className={styles.emptyFolderText}>📁 Carpeta vacía</span>
                  <button
                    className={styles.createFileButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newFileName = prompt('Nombre del nuevo archivo:');
                      if (newFileName) {
                        const newFilePath = `${fullPath}/${newFileName}`;
                        onFileCreate(newFilePath, '');
                      }
                    }}
                    title="Crear archivo en esta carpeta"
                  >
                    + Crear archivo
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      );
    } else {
      if (fullPath.startsWith('__EMPTY_FOLDER__')) {
        return null;
      }
      
      return (
        <div
          key={fullPath}
          className={`${styles.treeItem} ${isDragging ? styles.dragging : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, { type: 'file', path: fullPath })}
          onDragOver={(e) => handleDragOver(e, { type: 'file', path: fullPath })}
          onDrop={(e) => handleDrop(e, { type: 'file', path: fullPath })}
        >
          <div
            className={`${styles.fileItem} ${isSelected ? styles.selected : ''} ${isDragOver ? styles.dragOver : ''}`}
            onClick={() => handleFileClick(fullPath)}
            onDoubleClick={() => handleFileRename(fullPath)}
          >
            <span className={styles.fileIcon}>{getFileIcon(fullPath)}</span>
            {editingFile === fullPath ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveRename();
                  if (e.key === 'Escape') cancelRename();
                }}
                onBlur={saveRename}
                className={styles.renameInput}
                autoFocus
              />
            ) : (
              <span className={styles.itemName}>{name}</span>
            )}
            <div className={styles.itemActions}>
              <button
                className={styles.actionButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileRename(fullPath);
                }}
                title="Renombrar (doble clic)"
              >
                ✏️
              </button>
              {/* Botón de eliminar deshabilitado por seguridad */}
              <button
                className={styles.actionButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileDelete(fullPath);
                }}
                title="Eliminar"
                disabled={isLoading}
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const folderStructure = buildFolderStructure();
  
  console.log('🎯 Rendering FolderNavigator');
  console.log('📁 folderStructure:', folderStructure);
  console.log('📁 expandedFolders:', Array.from(expandedFolders));

  return (
    <div className={styles.navigator}>
      <div className={styles.header}>
        <div className={styles.projectSelector}>
          <div className={styles.projectSelectorContent}>


            <select
              value={currentProject}
              onChange={(e) => onProjectChange(e.target.value)}
              className={styles.projectSelect}
              disabled={isLoading}
            >
              {availableProjects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.icon} {project.name}
                </option>
              ))}
            </select>

            {/* <h3 className={styles.projectTitle}>📂 Proyectos</h3> */}
            {isLoading ? (
              <div className={styles.loading}>🔄 Sincronizando...</div>
            ) : (
              <>
                {children}
              </>
            )}
          </div>

        </div>

      </div>
      <div className={styles.tree}>
        {console.log('🌳 Rendering tree items:', Object.keys(folderStructure))}
        {Object.entries(folderStructure).map(([name, item]) => {
          console.log('🌳 Rendering item:', name, item.type);
          return renderTreeItem(name, item);
        })}
      </div>
      <p className={styles.projectDescription}>
        {availableProjects.find(p => p.id === currentProject)?.description || ''}
      </p>
    </div>
  );
};

export default FolderNavigator; 