import React, { useMemo, useState, useEffect, useRef } from 'react';
// import { Sidebar } from '../../../ScrapView/Sidebar';
// import { ScrapingWorkspace } from '../../../ScrapView/ScrapingWorkspace';
// import { ResultsTable } from '../../../ScrapView/ResultsTable';
import styles from './ScrapingRightPanel.module.css';

import ViewerContainer from './views';

// import {
//   CheckList,
//   Data,
//   DoClick,
//   Drag,
//   FillText,
//   Html,
//   Image,
//   Link,
//   Menu,
//   OnMouse,
//   Radio,
//   Reload,
//   Return,
//   Screen,
//   Script,
//   Scroll,
//   Source,
//   Table,
//   Text,
//   UploadFile,
//   ValidateElement,
//   ValidateText,
//   WaitElement,
//   WaitLoad,
//   WaitTime,
//   Zoom,
// } from './actions';



import { ReactComponent as IconAction } from './assets/icon-action.svg';
import { ReactComponent as IconArrowDown } from './assets/icon-arrow-down.svg';
import { ReactComponent as IconChecklist } from './assets/icon-checklist.svg';
import { ReactComponent as IconChernDown } from './assets/icon-chern-down.svg';
import { ReactComponent as IconSearch } from './assets/icon-search.svg';
import { ReactComponent as IconClose } from './assets/icon-close.svg';
import { ReactComponent as IconDelete } from './assets/icon-delete.svg';
import { ReactComponent as IconDoScroll } from './assets/icon-do-scroll.svg';
import { ReactComponent as IconDrag } from './assets/icon-drag.svg';
import { ReactComponent as IconEdit } from './assets/icon-edit.svg';
import { ReactComponent as IconExpand } from './assets/icon-expand.svg';
import { ReactComponent as IconInfo } from './assets/icon-info.svg';
import { ReactComponent as IconChernUp } from './assets/icon-chern-up.svg';
import { ReactComponent as IconExtractText } from './assets/icon-extract-text.svg';
import { ReactComponent as IconOnMouse } from './assets/icon-onmouse.svg';
import { ReactComponent as IconPlay } from './assets/icon-play.svg';
import { ReactComponent as IconNumber } from './assets/icon-number.svg';
import { ReactComponent as IconDate } from './assets/icon-date.svg';
import { ReactComponent as IconBoolean } from './assets/icon-boolean.svg';
import { ReactComponent as IconClick } from './assets/icon-click.svg';
import { ReactComponent as IconCaptureScreen } from './assets/icon-capture-screen.svg';
import { ReactComponent as IconTable } from './assets/icon-table.svg';
import { ReactComponent as IconRule } from './assets/icon-rule.svg';
import { ReactComponent as IconExtractImage } from './assets/icon-extract-image.svg';
import { ReactComponent as IconExtractLink } from './assets/icon-extract-link.svg';
import { ReactComponent as IconExtractTable } from './assets/icon-extract-table.svg';
import { ReactComponent as IconFillText } from './assets/icon-fill-text.svg';
import { ReactComponent as IconHtml } from './assets/icon-html.svg';
import { ReactComponent as IconKey } from './assets/icon-key.svg';
import { ReactComponent as IconMenu } from './assets/icon-menu.svg';
import { ReactComponent as IconView } from './assets/icon-view.svg';
import { ReactComponent as IconProgress } from './assets/icon-progress.svg';
import { ReactComponent as IconSource } from './assets/icon-source.svg';
import { ReactComponent as IconRadio } from './assets/icon-radio.svg';
import { ReactComponent as IconWaitTime } from './assets/icon-wait-time.svg';
import { ReactComponent as IconWorld } from './assets/icon-world.svg';
import { ReactComponent as IconReload } from './assets/icon-reload.svg';
import { ReactComponent as IconReturn } from './assets/icon-return.svg';
import { ReactComponent as IconSaveData } from './assets/icon-save-data.svg';
import { ReactComponent as IconSave } from './assets/icon-save.svg';
import { ReactComponent as IconSendWebhook } from './assets/icon-send-webhook.svg';
import { ReactComponent as IconSucess } from './assets/icon-sucess.svg';
import { ReactComponent as IconText } from './assets/icon-text.svg';
import { ReactComponent as IconUploadDocument } from './assets/icon-upload-document.svg';
import { ReactComponent as IconValidateText } from './assets/icon-validate-text.svg';
import { ReactComponent as IconUploadFile } from './assets/icon-upload-file.svg';
import { ReactComponent as IconValidateElement } from './assets/icon-validate-element.svg';
import { ReactComponent as IconWaitElement } from './assets/icon-wait-element.svg';
import { ReactComponent as IconWaitLoad } from './assets/icon-wait-load.svg';
import { ReactComponent as IconZoom } from './assets/icon-zoom.svg';
import { ReactComponent as IconLink } from './assets/icon-extract-link.svg';

// import { ReactComponent as IconEdit } from './assets/icon-capture.svg';


const ScrapingRightPanel = ({
  agentId,
  chatId,
  scrapId,
  apiUrl,
  onClose,
  setMessages, // Función para añadir mensajes al chat
  messageContainerRef,
  scrap,
  setScrap,
  insertMessage,
}) => {
  const [layers, setLayers] = useState([]);
  const [activeLayer, setActiveLayer] = useState(null);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showAddSource, setShowAddSource] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [previewType, setPreviewType] = useState(null); // 'pdf' | 'url' | null
  const [previewSrc, setPreviewSrc] = useState(null);
  const fileInputRef = useRef(null);

  // Añadir mensaje de ayuda cuando se abre el panel de scraping
  // React.useEffect(() => {
  //   if (setMessages) {
  //     const helpMessage = {
  //       type: 'bot',
  //       text: '🔧 **Panel de Scraping abierto**\n\n¿Necesitas ayuda? Puedo ayudarte con:\n• Configurar selectores de datos\n• Añadir variables personalizadas\n• Extraer información de PDFs y páginas web\n• Resolver problemas de scraping\n\n¡Pregúntame lo que necesites!',
  //       timestamp: Date.now(),
  //       isScrapingHelp: true,
  //       scrapId: scrapId || 'not found'
  //     };

  //     setTimeout(() => {
  //       setMessages(prev => [...prev, helpMessage]);
  //     }, 1000);

  //     messageContainerRef.current.scrollTo({
  //       top: messageContainerRef.current.scrollHeight,
  //       behavior: 'smooth'
  //     });
  //   }
  // }, [setMessages]);

  const activeLayerObj = useMemo(
    () => (activeLayer ? layers.find((l) => l.id === activeLayer) : null),
    [activeLayer, layers]
  );

  const addLayer = (layer) => {
    const newLayer = {
      ...layer,
      id: Date.now().toString(),
      selectors: layer?.selectors || [],
      variables: layer?.variables || [],
    };
    setLayers((prev) => [...prev, newLayer]);
    setActiveLayer(newLayer.id);
    setShowAddSource(false);
    return newLayer.id;
  };


  const handleFileUpload = (fileData) => {
    setUploadedFile(fileData);
  };




  const addDocumentLayer = async (file) => {
    if (!file) return;

    // Verificar que sea un PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Solo se pueden subir archivos PDF');
      return;
    }

    const fileData = {
      name: file.name,
      type: 'pdf',
      size: file.size,
      previewUrl: URL.createObjectURL(file) // Para mostrar preview del PDF
    };
    handleFileUpload(fileData);
    addLayer({ name: file.name, url: file.name, type: 'pdf', selectors: [], variables: [] });
    // Mostrar el preview del PDF y asegurar que solo haya una fuente activa
    setIsPreview(true);
    setIsEditingUrl(false);
    setNewUrl('');
    setPreviewType('pdf');
    setPreviewSrc(fileData.previewUrl);
    fnMessage(201)
  };

  // const executeScrapingForLayer = async (layerId) => {
  //   const layer = layers.find((l) => l.id === layerId);
  //   if (!layer) return;

  //   setIsProcessing(true);

  //   try {
  //     // Integración backend: ejecutar scraping de una capa en el scrapId actual
  //     const user = localStorage.getItem('user');
  //     const userJson = JSON.parse(user || '{}');
  //     const token = userJson?.accessToken;

  //     const response = await fetch(`${apiUrl}/api/chat/scraping`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //       },
  //       body: JSON.stringify({
  //         scrapId,
  //         action: 'executeLayer',
  //         layer,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP ${response.status}`);
  //     }

  //     // Esperar JSON con resultados de la capa (si el backend devuelve streaming, se puede adaptar)
  //     const data = await response.json();

  //     const resultPayload = data?.result || {};
  //     const result = {
  //       id: Date.now().toString(),
  //       layerName: layer.name,
  //       data: resultPayload,
  //       timestamp: new Date(),
  //     };

  //     setResults((prev) => [...prev, result]);
  //   } catch (error) {
  //     console.error('Error ejecutando scraping:', error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const handleUploadFile = () => {
    // Abrir selector de archivos PDF
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
      
    }
  }
  const handleUploadUrl = () => {
    // Activar input de URL y limpiar cualquier PDF previo del preview
    setIsEditingUrl(true)
    setUploadedFile(null)
    setPreviewType(null)
    setPreviewSrc(null)
    fnMessage(202)
  }


  // Funciones para drag and drop
  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, item) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverItem(item)
  }

  const handleDragLeave = (e) => {
    // Solo limpiar si realmente salimos del elemento
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverItem(null)
    }
  }

  const handleDrop = (e, targetItem) => {
    e.preventDefault()

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    // Check if we're dealing with variables or actions based on the draggedItem type
    const isVariable = scrapVariables.some(item => item.id === draggedItem.id)
    const isAction = scrapActions.some(item => item.id === draggedItem.id)

    if (isVariable) {
      const newVariables = [...scrapVariables]
      const draggedIndex = newVariables.findIndex(item => item.id === draggedItem.id)
      const targetIndex = newVariables.findIndex(item => item.id === targetItem.id)

      // Remover el elemento arrastrado
      const [draggedElement] = newVariables.splice(draggedIndex, 1)

      // Insertar en la nueva posición
      newVariables.splice(targetIndex, 0, draggedElement)

      setScrapVariables(newVariables)
      // Variables filtering will be handled by the useEffect
    } else if (isAction) {
      const newActions = [...scrapActions]
      const draggedIndex = newActions.findIndex(item => item.id === draggedItem.id)
      const targetIndex = newActions.findIndex(item => item.id === targetItem.id)

      // Remover el elemento arrastrado
      const [draggedElement] = newActions.splice(draggedIndex, 1)

      // Insertar en la nueva posición
      newActions.splice(targetIndex, 0, draggedElement)

      setScrapActions(newActions)
      setFilteredScrapActions(newActions.filter(item =>
        item.name.toLowerCase().includes(actionsSearchTerm.toLowerCase())
      ))
    }

    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const toggleVariableSelection = (itemId) => {
    setScrapVariables(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    )
  }



  const handleAddVariable = () => {

    const newVariable = {
      id: 1,
      icon: <IconFillText />,
      selected: true,
      name: 'Nombre de la variable',
      title: 'Texto',
      description: 'Campo de entrada de texto simple',
      type: 'text',
      value: 'Valor de la variable',
    }

    setScrapVariables([...scrapVariables, newVariable])
    fnMessage(204)
  }

  const handleDeleteVariable = (id) => {
    setScrapVariables(scrapVariables.filter(item => item.id !== id))
    fnMessage(205)
  }

  const handleDeleteAction = (id) => {
    const updatedActions = scrapActions.filter(item => item.id !== id)
    setScrapActions(updatedActions)
    setFilteredScrapActions(updatedActions.filter(item =>
      item.name.toLowerCase().includes(actionsSearchTerm.toLowerCase())
    ))
  }





  

  const [path, setPath] = useState(null)
  const [scrapName, setScrapName] = useState('Scraping')
  const [scrapDescription, setScrapDescription] = useState('Descripción')
  const [scrapNumberVariable, setScrapNumberVariable] = useState(0)
  const [scrapStatus, setScrapStatus] = useState(0)
  const [scrapTable, setScrapTable] = useState('null')
  const [scrapTableCategory, setScrapTableCategory] = useState('null')
  const [scrapTableSize, setScrapTableSize] = useState(0)


  // const [scrapVariables, setScrapVariables] = useState([
  //   {
  //     id: 2,
  //     icon: <IconExtractImage />,
  //     selected: false,
  //     name: 'Imagen principal',
  //     title: 'Imagen',
  //     description: 'Extrae imagen de la página',
  //     type: 'image',
  //     value: '',
  //   },
  //   {
  //     id: 3,
  //     icon: <IconExtractLink />,
  //     selected: true,
  //     name: 'Enlaces',
  //     title: 'Enlaces',
  //     description: 'Extrae todos los enlaces',
  //     type: 'link',
  //     value: '',
  //   },
  //   {
  //     id: 4,
  //     icon: <IconExtractTable />,
  //     selected: false,
  //     name: 'Tabla de datos',
  //     title: 'Tabla',
  //     description: 'Extrae datos de tabla',
  //     type: 'table',
  //     value: '',
  //   }
  // ])

  const setIcon = (type) => {
    switch (type) {
      case 'text':
        return <IconFillText />
      case 'number':
        return <IconNumber />
      case 'date':
        return <IconDate />
      case 'boolean':
        return <IconBoolean />
      default:
        return <IconFillText />
    }
  }

  const [scrapVariables, setScrapVariables] = useState(scrap.variables.map((item, index) => ({
    id: index + 1,
    icon: setIcon(item.type),
    selected: false,
    name: item.name,
    title: item.title,
    description: item.description,
    type: item.type,
    value: 0,
  })))

  

  const [filteredScrapVariables, setFilteredScrapVariables] = useState(scrapVariables)


  const [scrapActions, setScrapActions] = useState([
    // {
    //   id: 1,
    //   icon: <IconWorld />,
    //   name: 'Fuente',
    //   variable: 0,
    //   time: 'Hace 1 min',
    //   data: ['hello world']
    // }
  ])

  const [filteredScrapActions, setFilteredScrapActions] = useState(scrapActions)
  const [actionsSearchTerm, setActionsSearchTerm] = useState('')


  // Estados para drag and drop
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)


  const [isExpandAction, setIsExpandAction] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [isEditingUrl, setIsEditingUrl] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  const [isEdit, setIsEdit] = useState(null)



  useEffect(() => {
    // setIsEdit(true)
    setFilteredScrapVariables(scrapVariables)
  }, [scrapVariables])

  useEffect(() => {
    setFilteredScrapActions(scrapActions.filter(item =>
      item.name.toLowerCase().includes(actionsSearchTerm.toLowerCase())
    ))
  }, [scrapActions, actionsSearchTerm])

  // Detectar clic fuera del contenido del modal para cerrar con setPath(null)
  const modalContentRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (path && modalContentRef.current && !modalContentRef.current.contains(e.target)) {
        setPath(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [path])


  const fnMessage = async (value) => {
    try {

      const user = localStorage.getItem('user');
      const userJson = JSON.parse(user || '{}');
      const token = userJson?.accessToken;

      await fetch(`${apiUrl}/api/chat/scraping/${agentId}/${chatId}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/octet-stream",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scrapId: scrapId,
          value,
        }),
      }).then(response => {
        console.log('res', response)

        if (response.ok) {
          const reader = response.body.getReader(); 
  
          const decoder = new TextDecoder();
          let accumulatedChunks = "";
          const processStream = async () => {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
  
              const chunk = decoder.decode(value, { stream: true });
              accumulatedChunks += chunk;
  
              let lines = accumulatedChunks.split("\n");
              accumulatedChunks = lines.pop();
  
  
              for (const line of lines) {
                if (line.trim()) {
                  try {
                    const chunk = JSON.parse(line);
                    const { text, type, scrapId } = chunk.data;
  
                    console.log('chunk automate indexx', text, type, scrapId)
                    if (type === "script") {
                      console.log('1111111')
                      insertMessage({ text: text, isScript: true, scrapId, timestamp: Date.now() })
                      // if (text?.type === 'data-error') {
                      break
                      // }
                      
                    }
  
                  } catch (error) {
                    console.error("Failed to parse JSON:", error);
                  }
                }
              }
            }
          };
  
          processStream()
            .then(() => { })
            .catch(console.error);
        }
      })
    } catch (error) {
      console.error('Error ejecutando scraping:', error);
    }
  }


  return (
    <>
      {path && (
        <div
          className={styles.modal}
          onClick={(e) => {
            // Si se hace clic en el fondo del modal (no en el contenido), cerrar el modal
            if (e.target === e.currentTarget) {
              setPath(null);
            }
          }}
        >
          {true ? (
            <div ref={modalContentRef}>
              <ViewerContainer
                path={path}
                setPath={setPath}
                setFilteredScrapActions={setFilteredScrapActions}
              />
            </div>
          ) : false ? (
            <CheckList />
          ) : null}
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <span
              style={{ display: isEditingName ? 'none' : 'block' }}
            >
              {scrap.name}
            </span>
            <button onClick={() => setIsEditingName(!isEditingName)}>
              <IconEdit />
            </button>
            <input
              type="text"
              placeholder="Nombre del scraping"
              style={{ display: isEditingName ? 'block' : 'none' }}
              value={scrap.name}
              onChange={(e) => setScrap({ ...scrap, name: e.target.value })}
            />
          </div>
          <div className={styles.buttons}>
            <button>
              <IconExpand />
            </button>
            {/* <button className={styles.save}>
              <IconSave />
            </button> */}
            <button onClick={() => {
              setPath(null)
              fnMessage(206)
            }}>
              <IconClose />
            </button>
          </div>
        </div>


        <div className={styles.table}>
          <div className={styles.icon}>
            <IconTable />
          </div>
          <div className={styles.info}>
            <b>
              {scrap.db_name}
            </b>
            <span>
              {scrap.description1 || 'not found 404'}
            </span>
            <div>
              <p>
                {scrapTableSize} GB
              </p>
              <IconInfo />
            </div>
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.save}
              style={{ display: isEdit ? 'none' : 'flex' }}
              onClick={() => {
                setIsEdit(true)
                fnMessage(200)
              }}
            >
              <IconSave />
            </button>
            <div style={{ display: !isEdit ? 'none' : 'flex' }}>
              <div>
                Completado
                <IconSucess />
              </div>
              <button>
                <IconView />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.execute}>
          <button
            className={styles.play}
            onClick={() => alert(2)}
            style={{ display: !isPreview ? 'none' : 'flex' }}
          >
            <IconPlay />
            Ejecutar Scrap
          </button>
          <div
            className={styles.url}
            style={{ display: isEditingUrl ? 'flex' : 'none' }}
          >
            <input type="text" placeholder="Pega una URL (https://...)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
            <button onClick={() => {
              if (!newUrl) return;
              const hasProtocol = /^https?:\/\//i.test(newUrl);
              const finalUrl = hasProtocol ? newUrl : `https://${newUrl}`;
              setIsPreview(true);
              setUploadedFile(null);
              setPreviewType('url');
              setPreviewSrc(finalUrl);
            }}>
              Validar
            </button>
          </div>
          <div className={styles.buttons}>
            <button onClick={() => handleUploadFile()}>
              <IconLink />
              Subir documento
            </button>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => addDocumentLayer(e.target.files?.[0])}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <button onClick={() => handleUploadUrl()}>
              <IconLink />
              Subir link
            </button>
          </div>
        </div>

        <div
          className={styles.preview}
          style={{ display: isPreview ? 'block' : 'none' }}
        >
          <div className={styles.title}>
            <b>
              Preview
            </b>
            <div className={styles.buttons}>
              <button className={styles.play}>
                <IconPlay />
                Test
              </button>
              <button>
                <IconChecklist />
              </button>
              <button onClick={() => { setIsPreview(false); setPreviewType(null); setPreviewSrc(null); }}>
                <IconClose />
              </button>
            </div>
          </div>
          {previewType && previewSrc ? (
            <div style={{ width: '100%', height: '420px', marginTop: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              {previewType === 'pdf' ? (
                <iframe src={previewSrc} title="PDF preview" style={{ width: '100%', height: '100%', border: 'none' }} />
              ) : (
                <iframe src={previewSrc} title="URL preview" style={{ width: '100%', height: '100%', border: 'none' }} />
              )}
            </div>
          ) : null}
          <div className={styles.progress}>
            <div />
          </div>
          <div className={styles.result}>
            <span>
              Resultado
            </span>
            <span>
              59s de 1m 20s
            </span>
          </div>
          <ul className={styles.list}>
            {scrapStatus > 90 ? (
              <li>
                <div className={`${styles.dot} ${styles.completed}`} />
                <span>
                  90% completado
                </span>
              </li>
            ) : scrapStatus > 70 ? (
              <li>
                <div className={`${styles.dot} ${styles.pending}`} />
                <span>
                  70% Pendiente
                </span>
              </li>
            ) : scrapStatus > 50 ? (
              <li>
                <div className={`${styles.dot} ${styles.pending}`} />
                <span>
                  50% Pendiente
                </span>
              </li>
            ) : scrapStatus > 0 ? (
              <li>
                <div className={`${styles.dot} ${styles.error}`} />
                <span>
                  20% Error
                </span>
              </li>
            ) : null}
          </ul>

          <div className={styles.variablesText}>
            <span>
              {scrapNumberVariable} variables completadas
            </span>
          </div>
        </div>


        <div className={styles.description}>
          <div className={styles.title}>
            <span style={{ display: isEditingDescription ? 'none' : 'block' }}>
              {scrap.description}
            </span>
            <button onClick={() => setIsEditingDescription(!isEditingDescription)}>
              <IconEdit />
            </button>
          </div>
          <textarea
            placeholder="Descripción"
            style={{ display: isEditingDescription ? 'block' : 'none' }}
            value={scrap.description}
            onChange={(e) => setScrap({ ...scrap, description: e.target.value })}
          />
        </div>


        <div className={styles.actions}>
          <div className={styles.title}>
            <b>
              Acciones
            </b>
            <div>
              <button onClick={() => {
                setPath('action')
                setIsExpandAction(true)
                fnMessage(203)
              }}>
                <IconRule />
                Nueva Regla
              </button>
              <button
                onClick={() => setIsExpandAction(!isExpandAction)}
                style={{
                  transform: isExpandAction ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <IconChernDown />
              </button>
            </div>
          </div>
          <div
            className={styles.flexColumn}
            style={{ display: isExpandAction ? 'block' : 'none' }}>
            <div className={styles.search}>
              <div className={styles.input}>
                <IconSearch />
                <input
                  type="text"
                  placeholder="Buscar acción"
                  value={actionsSearchTerm}
                  onChange={(e) => setActionsSearchTerm(e.target.value)}
                />
              </div>
              <div>
                /
              </div>
            </div>
            {filteredScrapActions.length === 0 ? (
              <div className={styles.none}>
                <div className={styles.icon}>
                  <IconAction />
                </div>
                <b>
                  {actionsSearchTerm ? 'No se encontraron acciones' : 'No hay acciones configuradas'}
                </b>
                <p>
                  {actionsSearchTerm ? 'Intenta con otro término de búsqueda' : 'Añade acciones para que el agente interactue'}
                </p>
              </div>
            ) : (
              <div className={styles.source}>
                <ul>
                  {filteredScrapActions.map((item) => (
                    <li
                      key={item.id}
                      className={`${styles.item} ${draggedItem?.id === item.id ? styles.dragging : ''
                        } ${dragOverItem?.id === item.id ? styles.dragOver : ''
                        }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragOver={(e) => handleDragOver(e, item)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, item)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setPath('action')}
                    >
                      <div className={styles.dragHandle}>
                        <IconDrag />
                      </div>
                      <div className={styles.icon2}>
                        {item.icon}
                      </div>
                      <div className={styles.info}>
                        <b>
                          {item.name}
                        </b>
                        <p>
                          {item.data.length} variables completadas
                        </p>
                      </div>
                      <p className={styles.time}>
                        {item.time}
                      </p>

                      <button className={styles.play}>
                        <IconPlay />
                      </button>
                      <button
                        className={styles.delete}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteAction(item.id)
                        }}
                      >
                        <IconDelete />
                      </button>
                      <button>
                        <IconChernDown />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>


        <div className={styles.variables}>
          <div className={styles.title}>
            Variables
            <div>
              <button
                onClick={() => handleAddVariable()}
              >
                <IconTable />
                Nueva
              </button>
              <button>
                <IconReload />
                Actualizar
              </button>
            </div>
          </div>
          <div className={styles.search}>
            <IconSearch />
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setFilteredScrapVariables(scrapVariables.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase())))}
            />
            <div>
              /
            </div>
          </div>
          <ul className={styles.list}>
            {filteredScrapVariables.map((item) => (
              <li
                key={item.id}
                className={`${styles.item} ${draggedItem?.id === item.id ? styles.dragging : ''
                  } ${dragOverItem?.id === item.id ? styles.dragOver : ''
                  }`}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={(e) => handleDragOver(e, item)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item)}
                onDragEnd={handleDragEnd}
              >
                <div className={styles.dragHandle}>
                  <IconDrag />
                </div>
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleVariableSelection(item.id)}
                />
                <div className={styles.icon}>
                  {item.icon}
                </div>
                <div className={styles.info}>
                  <b>
                    {item.title}
                  </b>
                  <span>
                    {item.description}
                  </span>
                </div>
                <button
                  className={styles.delete}
                  onClick={() => handleDeleteVariable(item.id)}
                >
                  <IconDelete />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )


};

export default ScrapingRightPanel;

