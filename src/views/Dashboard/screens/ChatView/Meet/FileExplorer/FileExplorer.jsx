import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './FileExplorer.module.css';
import FolderNavigator from './FolderNavigator';
import ReactPreview from './ReactPreview';
import MonacoEditor from './MonacoEditor';
import JSZip from 'jszip';

import { 
  setAppFiles, 
  setAppFileContent, 
  setAppSelectedFile, 
  setAppSelectedLines,
  setAppStatus,
} from '../../../../../../slices/docsSlices';

import { saveAppFiles } from '../../../../../../actions/docs';

const createFileMap = async (projectId = 'react-basic') => {
  const map = new Map();

  try {
    const response = await fetch(`/examples/projects.json`);
    const projectsData = await response.json();
    const project = projectsData.projects.find(p => p.id === projectId);

    if (project) {

      for (const filePath of project.files) {
        try {
          const fileResponse = await fetch(`/examples/${projectId}/${filePath}`);
          if (fileResponse.ok) {
            const content = await fileResponse.text();
            map.set(filePath, content);
          } else {
            console.warn(`⚠️ File not found: ${filePath}`);
          }
        } catch (error) {
          console.error(`❌ Error loading file ${filePath}:`, error);
        }
      }

    } else {
      console.error(`❌ Project not found: ${projectId}`);
    }
  } catch (error) {
    console.error('❌ Error loading project:', error);
    map.set('src/App.jsx', `import React from 'react';

function App() {
  const [count, setCount] = React.useState(0);
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
      color: theme === 'light' ? '#333333' : '#ffffff',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <h1 style={{ color: '#667eea', textAlign: 'center' }}>🚀 Mi Aplicación React</h1>
      <p style={{ textAlign: 'center', fontSize: '18px' }}>¡Hola! Este es un componente de ejemplo.</p>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{ 
          background: theme === 'light' ? '#f8f9fa' : '#2d2d2d',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2>Contador: {count}</h2>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              style={{ 
                background: '#dc3545', 
                color: 'white', 
                border: 'none', 
                padding: '10px 15px', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setCount(count - 1)}
            >
              ➖ Decrementar
            </button>
            <button 
              style={{ 
                background: '#ffc107', 
                color: 'black', 
                border: 'none', 
                padding: '10px 15px', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setCount(0)}
            >
              🔄 Reset
            </button>
            <button 
              style={{ 
                background: '#28a745', 
                color: 'white', 
                border: 'none', 
                padding: '10px 15px', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setCount(count + 1)}
            >
              ➕ Incrementar
            </button>
          </div>
        </div>
        
        <button 
          style={{ 
            background: '#667eea', 
            color: 'white', 
            border: 'none', 
            padding: '15px 30px', 
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
          onClick={() => alert('¡Hola desde React!')}
        >
          👋 Hacer clic
        </button>
        
        <button 
          style={{ 
            background: theme === 'light' ? '#6c757d' : '#495057', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={toggleTheme}
        >
          {theme === 'light' ? '🌙' : '☀️'} Cambiar Tema
        </button>
      </div>
    </div>
  );
}

export default App;`);
  }

  return map;
};

function mapToObject(map) {
  const obj = {};
  for (const [key, value] of map.entries()) {
    obj[key] = value;
  }
  return obj;
}

function objectToMap(obj) {
  const map = new Map();
  for (const [key, value] of Object.entries(obj)) {
    map.set(key, value);
  }
  return map;
}

function encodeMapToBase64(map) {
  const obj = mapToObject(map);
  const json = JSON.stringify(obj, null, 2);
  return btoa(unescape(encodeURIComponent(json))); 
}

const FileEditorApp = ({ 
  appData = null, 
  onFileUpdate = null, 
  appId = null, 
  onFolderSelect = null, 
  onAppSelect = null, 
  messageTimestamp = null 
}) => {
  const dispatch = useDispatch();
  const appFiles = useSelector(state => state.docs.app.files);
  const selectedFile = useSelector(state => state.docs.app.selectedFile);

  const [fileMap, setFileMap] = useState(new Map());
  const [selectedPath, setSelectedPath] = useState('src/App.jsx');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewCode, setPreviewCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [currentProject, setCurrentProject] = useState('react-basic');
  const [availableProjects, setAvailableProjects] = useState([]);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [wasExpandedByEdit, setWasExpandedByEdit] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [showFullCode, setShowFullCode] = useState(false);
  const [editorHeight, setEditorHeight] = useState('400px');
  const textareaRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/examples/projects.json');
        const projectsData = await response.json();
        setAvailableProjects(projectsData.projects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {


    if (!appData && (!appFiles || Object.keys(appFiles).length === 0)) {

      const loadInitialData = async () => {
        try {
          const newFileMap = await createFileMap(currentProject);
          const filesObject = mapToObject(newFileMap);

          setFileMap(newFileMap);

          dispatch(setAppFiles(filesObject));

          const firstFile = Array.from(newFileMap.keys())[0];
          if (firstFile) {
            setSelectedPath(firstFile);
            dispatch(setAppSelectedFile(firstFile));
            dispatch(setAppSelectedLines(null));
          }

        } catch (error) {
          console.error('❌ Error loading initial data:', error);
        }
      };

      loadInitialData();
    } else {
      console.log('📁 Skipping initial load - files already exist or appData provided');
    }
  }, [appData, appFiles, currentProject, dispatch]);

  useEffect(() => {
    const handleProjectChange = async () => {
      try {
        if (currentProject === 'react-advanced' && appData && appData.files) {
          const newFileMap = objectToMap(appData.files);
          setFileMap(newFileMap);

          console.log('appData.files', appData.files);
          dispatch(setAppFiles(appData.files));

          const firstFile = Object.keys(appData.files)[0];
          if (firstFile) {
            setSelectedPath(firstFile);
            dispatch(setAppSelectedFile(firstFile));
          }
        } else {
          const newFileMap = await createFileMap(currentProject);
          const filesObject = mapToObject(newFileMap);

          setFileMap(newFileMap);
          dispatch(setAppFiles(filesObject));
          dispatch(saveAppFiles(filesObject))

          const firstFile = Array.from(newFileMap.keys())[0];
          if (firstFile) {
            setSelectedPath(firstFile);
            dispatch(setAppSelectedFile(firstFile));
            dispatch(setAppSelectedLines(null));
          }
        }
      } catch (error) {
        console.error('Error loading project:', error);
      }
    };

    handleProjectChange();
  }, [currentProject, appData, dispatch]);

  useEffect(() => {
    if (Object.keys(appFiles).length > 0 && fileMap.size === 0) {
      const newFileMap = new Map();
      Object.entries(appFiles).forEach(([path, content]) => {
        newFileMap.set(path, content);
      });

      setFileMap(newFileMap);

      if (!selectedPath && newFileMap.size > 0) {
        const firstFile = Array.from(newFileMap.keys())[0];
        setSelectedPath(firstFile);
        dispatch(setAppSelectedFile(firstFile));
        dispatch(setAppSelectedLines(null));
      }
    }
  }, [appFiles, selectedPath, dispatch, fileMap]);

  useEffect(() => {
    if (selectedFile && selectedFile !== selectedPath) {
      setSelectedPath(selectedFile);

      if (isEditing) {
        setIsEditing(false);
        setEditContent('');
        dispatch(setAppStatus('minimized'));
      }
    }
  }, [appFiles, fileMap.size, selectedPath, dispatch]);

 
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          cancelEdit();
        } else if (isEditorExpanded) {
          setIsEditorExpanded(false);
          setWasExpandedByEdit(false);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isEditing, isEditorExpanded]);

  const rawSelectedContent = fileMap.get(selectedPath);
  const selectedContent = typeof rawSelectedContent === 'string' ? rawSelectedContent : String(rawSelectedContent || '');


  const getDisplayContent = () => {

    const ensureString = (content) => {
      if (typeof content === 'string') {
        return content;
      }
      if (content === null || content === undefined) {
        return '';
      }
      if (typeof content === 'object') {
        console.warn('⚠️ Content is an object, converting to string:', content);
        return JSON.stringify(content);
      }
      return String(content);
    };

    if (selectedPath && selectedPath.startsWith('__EMPTY_FOLDER__')) {
      return '📁 Esta es una carpeta vacía. Puedes crear archivos aquí.';
    }

    if (isEditing) {
      const content = editContent !== undefined ? editContent : selectedContent;
      const safeContent = ensureString(content);
      return safeContent;
    }
    if (showFullCode) {
      return ensureString(selectedContent);
    }
    const content = ensureString(selectedContent);
    const lines = content.split('\n');
    if (lines.length > 500) {
      return lines.slice(0, 500).join('\n');
    }
    if (content.length > 5000) {
      return content.slice(0, 5000);
    }
    return content;
  };

  const syncWithBackend = useCallback(async (operation, path, content = null) => {
    if (!onFileUpdate) return;

    try {
      setIsLoading(true);
      const timestamp = messageTimestamp || Date.now();
      await onFileUpdate(operation, path, content, appId, timestamp);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [onFileUpdate, appId, messageTimestamp]);

  const updateFile = useCallback((newContent) => {
    if (selectedPath && selectedPath.startsWith('__EMPTY_FOLDER__')) {
      console.log('⚠️ No se puede actualizar una entrada de carpeta vacía');
      return;
    }

    const safeContent = typeof newContent === 'string' ? newContent : String(newContent || '');

    const newMap = new Map(fileMap);
    newMap.set(selectedPath, safeContent);

    setFileMap(newMap);

    const currentAppFiles = { ...appFiles };
    currentAppFiles[selectedPath] = safeContent;
    dispatch(setAppFiles(currentAppFiles));

    try {
      syncWithBackend('editFile', selectedPath, safeContent);
    } catch (error) {
      console.error('❌ Backend sync failed, but file was updated locally:', error);
    }
  }, [fileMap, selectedPath, appFiles, syncWithBackend, dispatch]);

  const createFile = useCallback((path, content = '') => {
    const safeContent = typeof content === 'string' ? content : String(content || '');

    const newMap = new Map(fileMap);
    newMap.set(path, safeContent);

    if (!path.startsWith('__EMPTY_FOLDER__')) {
      const parentPath = path.substring(0, path.lastIndexOf('/'));
      if (parentPath) {
        const emptyFolderKey = `__EMPTY_FOLDER__${parentPath}`;
        if (newMap.has(emptyFolderKey)) {
          newMap.delete(emptyFolderKey);
          console.log(`📁 Eliminando entrada de carpeta vacía para ${parentPath}`);
        }
      }
    }

    setFileMap(newMap);
    setSelectedPath(path);

    const currentAppFiles = { ...appFiles };
    currentAppFiles[path] = safeContent;
    dispatch(setAppFiles(currentAppFiles));
    dispatch(setAppSelectedFile(path));
    dispatch(setAppSelectedLines(null));

    try {
      syncWithBackend('createFile', path, safeContent);
    } catch (error) {
      console.error('❌ Backend sync failed, but file was created locally:', error);
    }
  }, [fileMap, appFiles, syncWithBackend, dispatch]);

  const deleteFile = useCallback((path) => {
    const newMap = new Map(fileMap);
    newMap.delete(path);
    
    const parentPath = path.substring(0, path.lastIndexOf('/'));
    if (parentPath) {
      let isParentEmpty = true;
      for (const filePath of newMap.keys()) {
        if (filePath.startsWith('__EMPTY_FOLDER__')) {
          continue;
        }
        
        if (filePath.startsWith(parentPath + '/')) {
          isParentEmpty = false;
          break;
        }
      }
      
      if (isParentEmpty) {
        const emptyFolderKey = `__EMPTY_FOLDER__${parentPath}`;
        newMap.set(emptyFolderKey, ''); 
      }
    }
    
    setFileMap(newMap);

    if (selectedPath === path) {
      const remainingFiles = Array.from(newMap.keys()).filter(filePath => 
        !filePath.startsWith('__EMPTY_FOLDER__')
      );
      if (remainingFiles.length > 0) {
        setSelectedPath(remainingFiles[0]);
        dispatch(setAppSelectedFile(remainingFiles[0]));
        dispatch(setAppSelectedLines(null));
      }
    }

    syncWithBackend('deleteFile', path);
  }, [fileMap, selectedPath, syncWithBackend, dispatch]);

  const renameFile = useCallback((oldPath, newPath) => {
    const content = fileMap.get(oldPath);
    if (content !== undefined) {
      const newMap = new Map(fileMap);
      newMap.delete(oldPath);
      newMap.set(newPath, content);
      setFileMap(newMap);

      if (selectedPath === oldPath) {
        setSelectedPath(newPath);
        dispatch(setAppSelectedFile(newPath));
        dispatch(setAppSelectedLines(null));
      }

      syncWithBackend('renameFile', oldPath, { newPath, content });
    }
  }, [fileMap, selectedPath, syncWithBackend, dispatch]);

  const startEditing = () => {
    if (isEditing) {
      console.log('⚠️ Already in edit mode');
      return;
    }

    if (selectedPath && selectedPath.startsWith('__EMPTY_FOLDER__')) {
      console.log('⚠️ No se puede editar una entrada de carpeta vacía');
      return;
    }

    const contentToEdit = selectedContent || '';
    setEditContent(contentToEdit);
    setIsEditing(true);
    setShowFullCode(false);
    dispatch(setAppStatus('expanded'));


    if (!isEditorExpanded) {
      setIsEditorExpanded(true);
      setWasExpandedByEdit(true); 
    } else {
      setWasExpandedByEdit(false);
    }
  };

  const saveEdit = () => {

    if (editContent !== undefined) {
      updateFile(editContent);
    }
    setIsEditing(false);
    setShowFullCode(false);

    dispatch(setAppStatus('minimized'));

  };

  const cancelEdit = () => {
    setIsEditing(false);
    dispatch(setAppStatus('minimized'));

    setEditContent('');
    setShowFullCode(false);

    if (isEditorExpanded && wasExpandedByEdit) {
      setIsEditorExpanded(false);
    }
    setWasExpandedByEdit(false); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (isEditing) {
        cancelEdit();
      } else if (isEditorExpanded) {
        setIsEditorExpanded(false);
        setWasExpandedByEdit(false);
      }
    }
  };

  const toggleEditorExpansion = () => {
    setIsEditorExpanded(!isEditorExpanded);
    setWasExpandedByEdit(false); 
  };

  const handleTextareaChange = (e) => {
    setEditContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const startEditingTitle = () => {
    setIsEditingTitle(true);
    setEditTitle(getFileName(selectedPath));
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
      }
    }, 100);
  };

  const saveTitleEdit = () => {
    if (editTitle.trim() && editTitle !== getFileName(selectedPath)) {
      const newPath = selectedPath.replace(getFileName(selectedPath), editTitle.trim());
      renameFile(selectedPath, newPath);
    }
    setIsEditingTitle(false);
  };

  const cancelTitleEdit = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveTitleEdit();
    } else if (e.key === 'Escape') {
      cancelTitleEdit();
    }
  };

  const generatePreview = () => {

    for (const [path, content] of fileMap.entries()) {
      console.log(`  - ${path}: ${content?.length || 0} chars`);
    }

    for (const [path, content] of Object.entries(appFiles)) {
      console.log(`  - ${path}: ${content?.length || 0} chars`);
    }

    let previewContent = '';

    const appJsxContent = fileMap.get('src/App.jsx') || appFiles['src/App.jsx'];
    if (appJsxContent) {
      previewContent = appJsxContent;
    } else {
      const appTsxContent = fileMap.get('src/App.tsx') || appFiles['src/App.tsx'];
      if (appTsxContent) {
        previewContent = appTsxContent;
      } else {
        const appFilesList = ['src/App.jsx', 'src/App.tsx', 'src/components/ExampleComponent.jsx'];

        for (const file of appFilesList) {
          const content = fileMap.get(file) || appFiles[file];
          if (content) {
            previewContent = content;
            break;
          }
        }

        if (!previewContent) {
          const allFiles = new Map([...fileMap.entries(), ...Object.entries(appFiles)]);
          for (const [path, content] of allFiles.entries()) {
            const ext = path.split('.').pop().toLowerCase();
            if (['jsx', 'tsx'].includes(ext) && (content.includes('React') || content.includes('function'))) {
              previewContent = content;
              break;
            }
          }
        }

        if (!previewContent && selectedPath) {
          const ext = selectedPath.split('.').pop().toLowerCase();
          if (['jsx', 'tsx'].includes(ext)) {
            previewContent = selectedContent;
          }
        }
      }
    }

    if (previewContent) {
      setPreviewCode(previewContent);
      setShowPreview(true);
      setIsPreviewFullscreen(false);

      setTimeout(() => {
        setShowPreview(false);
        setTimeout(() => {
          setShowPreview(true);
        }, 100);
      }, 100);
    } else {
      console.warn('❌ No React code found for preview, creating default App.jsx');

      const defaultAppJsx = `import React from 'react';

function App() {
  const [count, setCount] = React.useState(0);
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
      color: theme === 'light' ? '#333333' : '#ffffff',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <h1 style={{ color: '#667eea', textAlign: 'center' }}>🚀 Mi Aplicación React</h1>
      <p style={{ textAlign: 'center', fontSize: '18px' }}>¡Hola! Este es un componente de ejemplo.</p>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{ 
          background: theme === 'light' ? '#f8f9fa' : '#2d2d2d',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2>Contador: {count}</h2>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              style={{ 
                background: '#dc3545', 
                color: 'white', 
                border: 'none', 
                padding: '10px 15px', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setCount(count - 1)}
            >
              ➖ Decrementar
            </button>
            <button 
              style={{ 
                background: '#ffc107', 
                color: 'black', 
                border: 'none', 
                padding: '10px 15px', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setCount(0)}
            >
              🔄 Reset
            </button>
            <button 
              style={{ 
                background: '#28a745', 
                color: 'white', 
                border: 'none', 
                padding: '10px 15px', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setCount(count + 1)}
            >
              ➕ Incrementar
            </button>
          </div>
        </div>
        
        <button 
          style={{ 
            background: '#667eea', 
            color: 'white', 
            border: 'none', 
            padding: '15px 30px', 
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
          onClick={() => alert('¡Hola desde React!')}
        >
          👋 Hacer clic
        </button>
        
        <button 
          style={{ 
            background: theme === 'light' ? '#6c757d' : '#495057', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={toggleTheme}
        >
          {theme === 'light' ? '🌙' : '☀️'} Cambiar Tema
        </button>
      </div>
    </div>
  );
}

export default App;`;

      previewContent = defaultAppJsx;

      setFileMap(prev => {
        const newMap = new Map(prev);
        newMap.set('src/App.jsx', defaultAppJsx);
        return newMap;
      });

      dispatch(setAppFileContent({ path: 'src/App.jsx', content: defaultAppJsx }));
    }
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
    setIsPreviewFullscreen(false);
  };

  const handlePreviewFullscreen = (fullscreen) => {
    setIsPreviewFullscreen(fullscreen);
  };

  const handleShowMore = () => {
    setShowFullCode(true);
  };

  const handleShowLess = () => {
    setShowFullCode(false);
  };

  const shouldShowMoreButton = () => {
    if (isEditing) return false;
    const lines = selectedContent.split('\n');
    return lines.length > 500 || selectedContent.length > 5000;
  };



  const copyToClipboard = async () => {
    try {
      const contentToCopy = getDisplayContent();
      await navigator.clipboard.writeText(contentToCopy);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const downloadProject = async () => {
    try {
      setIsLoading(true);
      const zip = new JSZip();

      for (const [filePath, content] of fileMap.entries()) {
        zip.file(filePath, content);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject}-project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading project:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getFileLanguage = (path) => {
    if (path && path.startsWith('__EMPTY_FOLDER__')) {
      return 'plaintext';
    }
    
    const ext = path.split('.').pop().toLowerCase();
    switch (ext) {
      case 'jsx':
        return 'jsx'; 
      case 'tsx':
        return 'tsx'; 
      case 'js':
        return 'js';
      case 'ts':
        return 'ts';
      case 'css':
        return 'css';
      case 'scss':
        return 'scss';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      case 'md':
        return 'md';
      case 'py':
        return 'py';
      case 'php':
        return 'php';
      case 'java':
        return 'java';
      case 'c':
        return 'c';
      case 'cpp':
        return 'cpp';
      case 'cs':
        return 'cs';
      case 'rb':
        return 'rb';
      case 'go':
        return 'go';
      case 'rs':
        return 'rs';
      case 'swift':
        return 'swift';
      case 'kt':
        return 'kt';
      case 'sh':
        return 'sh';
      case 'bash':
        return 'bash';
      case 'zsh':
        return 'zsh';
      case 'fish':
        return 'fish';
      case 'ps1':
        return 'ps1';
      case 'bat':
        return 'bat';
      case 'cmd':
        return 'cmd';
      case 'ini':
        return 'ini';
      case 'toml':
        return 'toml';
      case 'lock':
        return 'lock';
      case 'log':
        return 'log';
      case 'txt':
        return 'txt';
      default:
        return 'js';
    }
  };

  const getFileName = (path) => {
    if (!path) return '';
    
    if (path.startsWith('__EMPTY_FOLDER__')) {
      const folderPath = path.replace('__EMPTY_FOLDER__', '');
      return folderPath.split('/').pop() || '';
    }
    
    return path.split('/').pop();
  };

  const isFilePath = (path) => {
    if (!path) return false;
    
    if (path.startsWith('__EMPTY_FOLDER__')) {
      return false;
    }
    
    const fileName = path.split('/').pop();
    return fileName.includes('.');
  };

  const isFolderPath = (path) => {
    if (!path) return false;
    
    if (path.startsWith('__EMPTY_FOLDER__')) {
      return true;
    }
    
    const fileName = path.split('/').pop();
    return !fileName.includes('.');
  };

  const createCssFile = () => {
    const cssContent = `/* Estilos CSS */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.button:hover {
  background: #5a67d8;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 10px 0;
}

.text-center {
  text-align: center;
}

.mt-20 {
  margin-top: 20px;
}`;
    createFile('src/styles/styles.css', cssContent);
  };

  const createJsFile = () => {
    const jsContent = `// Utilidades JavaScript
export function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function validateEmail(email) {
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return re.test(email);
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}`;
    createFile('src/utils/helpers.js', jsContent);
  };

  const handleFileSelect = (path) => {
    if (path.startsWith('__EMPTY_FOLDER__')) {
      console.log('⚠️ No se puede seleccionar una entrada de carpeta vacía');
      return;
    }

    if (isEditing) {
      console.log('⚠️ Canceling edit before file change');
      setIsEditing(false);
      setEditContent('');
    }

    setSelectedPath(path);
    
    dispatch(setAppSelectedFile(path));
    
    dispatch(setAppSelectedLines(null));
    
    console.log('📁 FileExplorer: File selected:', path);
  };

  const handleFolderSelect = (folderPath) => {
    dispatch(setAppSelectedFile(folderPath));
    
    console.log('📁 FileExplorer: Folder selected:', folderPath);
    if (onFolderSelect) {
      onFolderSelect(folderPath);
    }
  };



  return (
    <div className={`${styles.container} ${isEditorExpanded ? styles.expanded : ''}`}>
      {/* 📁 Directorio */}
      <div
        className={styles.sidebar}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
        }}
      >
        <FolderNavigator
          fileMap={fileMap}
          selectedPath={selectedPath}
          onFileSelect={handleFileSelect}
          onFolderSelect={handleFolderSelect}
          onFileDelete={deleteFile}
          onFileCreate={createFile}
          onFileRename={renameFile}
          isLoading={isLoading}
          currentProject={currentProject}
          availableProjects={availableProjects}
          onProjectChange={setCurrentProject}
        >
          <div className={styles.sidebarActions}>
            {!showPreview ? (
              <>
                <button
                  onClick={generatePreview}
                  className={`${styles.btn} ${styles.btnSuccess} ${showPreview ? styles.hidden : ''}`}
                  disabled={isLoading}
                  title="Generar preview"
                  style={{
                    opacity: showPreview ? 0 : 1,
                    visibility: showPreview ? 'hidden' : 'visible',
                    transition: 'opacity 0.2s ease, visibility 0.2s ease',
                    transform: showPreview ? 'scale(0.8)' : 'scale(1)',
                    transformOrigin: 'center'
                  }}
                >
                  👁️
                </button>
                <button
                  onClick={() => {
                    for (const [path, content] of fileMap.entries()) {
                      console.log(`  - ${path}: ${content?.length || 0} chars`);
                    }
                    
                    console.log('📄 appFiles contents:');
                    for (const [path, content] of Object.entries(appFiles)) {
                      console.log(`  - ${path}: ${content?.length || 0} chars`);
                    }
                  }}
                  className={`${styles.btn} ${styles.btnGray}`}
                  disabled={isLoading}
                  title="Debug info"
                  style={{
                    fontSize: '12px',
                    padding: '4px 8px'
                  }}
                >
                  🐛
                </button>
                <button
                  onClick={async () => {
                    console.log('📁 Manually loading files from server...');
                    try {
                      const newFileMap = await createFileMap(currentProject);
                      const filesObject = mapToObject(newFileMap);
                      
                      console.log('✅ Files loaded manually:', Object.keys(filesObject));
                      
                      setFileMap(newFileMap);
                      dispatch(setAppFiles(filesObject));
                      
                      const firstFile = Array.from(newFileMap.keys())[0];
                      if (firstFile) {
                        setSelectedPath(firstFile);
                        dispatch(setAppSelectedFile(firstFile));
                      }
                    } catch (error) {
                      console.error('❌ Error loading files manually:', error);
                    }
                  }}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={isLoading}
                  title="Cargar archivos manualmente"
                  style={{
                    fontSize: '12px',
                    padding: '4px 8px'
                  }}
                >
                  📁
                </button>
              </>
            ) : (
              <button
                onClick={downloadProject}
                className={`${styles.btn} ${styles.btnPurple}`}
                disabled={isLoading}
                title="Descargar proyecto"
              >
                💾
              </button>
            )}


          </div>
        </FolderNavigator>
      </div>

      {/* 🔐 Preview */}
      {showPreview && (
        <div style={{ position: 'relative', zIndex: 1000 }}>
          <ReactPreview
            fileMap={fileMap}
            code={previewCode}
            isVisible={showPreview}
            onClose={handlePreviewClose}
            onFullscreen={handlePreviewFullscreen}
            autoUpdate={true}
            currentProject={currentProject}
          />
        </div>
      )}

      {/* 📝 Editor */}
      {isFilePath(selectedPath) && (
        <div className={`${styles.editor} ${isEditorExpanded ? styles.editorExpanded : ''}`}>
          <div className={styles.editorHeader}>
            <div className={styles.editorTitle}>
              <span className={styles.fileIcon}>{getFileIcon(selectedPath)}</span>
              {isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={saveTitleEdit}
                  className={styles.titleInput}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    outline: 'none',
                    borderBottom: '2px solid #3b82f6'
                  }}
                />
              ) : (
                <span
                  className={styles.editorPath}
                  onDoubleClick={startEditingTitle}
                  style={{ cursor: 'pointer' }}
                  title="Doble clic para editar nombre"
                >
                  {getFileName(selectedPath)}
                </span>
              )}
            </div>
            <div className={styles.editorActions}>
              {!isEditing ? (
                <>
                  <button
                    onClick={() => onAppSelect && onAppSelect(appData)}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    disabled={isLoading}
                    title="Mostrar información de la aplicación"
                  >
                    ℹ️
                  </button>
                  <button
                    onClick={startEditing}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    disabled={isLoading}
                    title="Editar archivo"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className={`${styles.btn} ${styles.btnCopy}`}
                    title="Copiar al portapapeles"
                    disabled={isLoading}
                  >
                    📋
                  </button>
                  <button
                    onClick={toggleEditorExpansion}
                    className={`${styles.btn} ${isEditorExpanded ? styles.btnGray : styles.btnPrimary}`}
                    disabled={isLoading}
                    title={isEditorExpanded ? "Contraer editor" : "Expandir editor"}
                  >
                    {isEditorExpanded ? '📱' : '🖥️'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={saveEdit}
                    className={`${styles.btn} ${styles.btnSuccess}`}
                    disabled={isLoading}
                    title="Guardar cambios"
                  >
                    💾
                  </button>
                  <button
                    onClick={cancelEdit}
                    className={`${styles.btn} ${styles.btnGray}`}
                    disabled={isLoading}
                    title="Cancelar edición"
                  >
                    ❌
                  </button>
                  <button
                    onClick={toggleEditorExpansion}
                    className={`${styles.btn} ${isEditorExpanded ? styles.btnGray : styles.btnPrimary}`}
                    disabled={isLoading}
                    title={isEditorExpanded ? "Contraer editor" : "Expandir editor"}
                  >
                    {isEditorExpanded ? '📱' : '🖥️'}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className={styles.editorContainer}>
            <MonacoEditor
              currentProject={currentProject}
              key={`${selectedPath}-${isEditing ? 'edit' : 'view'}`}
              value={getDisplayContent()}
              onChange={(newContent) => {
                const safeContent = typeof newContent === 'string' ? newContent : String(newContent || '');

                if (isEditing) {
                  setEditContent(safeContent);
                } else {
                  updateFile(safeContent);
                }
              }}
              language={getFileLanguage(selectedPath)}
              placeholder="Escribe tu código aquí..."
              disabled={isLoading}
              onKeyDown={handleKeyDown}
              autoFocus={isEditing}
              height={isEditorExpanded ? 'calc(100vh - 120px)' : editorHeight}
              onDoubleClick={startEditing}
              autoHeight={!isEditing && !isEditorExpanded}
              filePath={selectedPath} 
              onFileUpdate={(newContent) => {
                if (onFileUpdate) {
                  const safeContent = typeof newContent === 'string' ? newContent : String(newContent || '');
                  onFileUpdate('editFile', selectedPath, safeContent, appId);
                }
              }}
            />
            {shouldShowMoreButton() && !showFullCode && (
              <button
                onClick={handleShowMore}
                className={`${styles.btn} ${styles.btnShowMore}`}
              >
                Ver más ({selectedContent.length} caracteres)
              </button>
            )}
            {showFullCode && (
              <button
                onClick={handleShowLess}
                className={`${styles.btn} ${styles.btnShowLess}`}
              >
                Ver menos
              </button>
            )}
          </div>
          {!isEditing && (
            <div className={styles.editorHint}>
              💡 Doble clic para editar • ESC para contraer • 🖥️ para expandir
            </div>
          )}
          <div>
             hello worldddd aqui van cositas buenas
          </div>
        </div>
      )}



    </div>
  );
}

export default FileEditorApp;