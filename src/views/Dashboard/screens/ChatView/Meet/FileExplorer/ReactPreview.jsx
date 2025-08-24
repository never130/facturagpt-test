import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAppFiles } from '../../../../../../slices/docsSlices';
import styles from './ReactPreview.module.css';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../../../../apiBackend';

const ReactPreview = ({
  code, isVisible = false,
  onClose, onFullscreen,
  autoUpdate = true,
  currentProject = 'react-app',
  fileMap = null
}) => {

  const { chatId } = useParams();
  const appId = '1234';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0); 
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [debugInfo, setDebugInfo] = useState({}); 
  const [lastLoadedProject, setLastLoadedProject] = useState(null);
  const [useDirectRender, setUseDirectRender] = useState(true); 
  const [htmlContent, setHtmlContent] = useState(''); 
  const [iframeContentCreated, setIframeContentCreated] = useState(false); 

  const containerRef = useRef(null);
  const reactContainerRef = useRef(null); 
  const iframeRef = useRef(null); 

  const { appFiles, loading } = useSelector(state => state.docs.app);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();


  const fn = async () => {
    try {
      const iframe = iframeRef.current;
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

      if (!iframeDocument) {
        console.log('❌ Cannot access iframe document');
        return;
      }



      const userId = user.id.split('_').pop();
    

      console.log(`https://facturagpt.com/api/viewer/${userId}/${chatId}/${currentProject}`)
      iframe.src = `https://facturagpt.com/api/viewer/${userId}/${chatId}/${currentProject}`


      reloadIframeScripts()
      console.log('✅ Iframe content created and loaded successfully');
    } catch (error) {
      console.error('❌ Error creating iframe content:', error);
    }
  }

  useEffect(() => {
    console.log('🚀 createIframeContent called');

    if (!user) return;

    if (iframeContentCreated) {
      console.log('⚠️ Iframe content already created, skipping...');
      return;
    }

    if (!iframeRef.current) {
      console.log('❌ iframeRef not available');
      return;
    }

    fn()
  }, [user, chatId, appId, currentProject, loading]);

  const reloadIframeScripts = useCallback(() => {
    console.log('🚀 reloadIframeScripts called');

    if (!iframeRef.current) {
      console.log('❌ iframeRef not available');
      return;
    }

    try {
      const iframe = iframeRef.current;

      let iframeDocument = null;

      try {
        iframeDocument = iframe.contentDocument;
      } catch (e) {
        try {
          iframeDocument = iframe.contentWindow?.document;
        } catch (e2) {
          console.log('⚠️ contentWindow.document failed');
        }
      }

      if (!iframeDocument) {
        return;
      }

      const scripts = iframeDocument.querySelectorAll('script');

      if (scripts.length === 0) {
        console.log('⚠️ No scripts found in iframe');
        return;
      }

      scripts.forEach((script, index) => {
        try {
          if (script.src) {
            const originalSrc = script.src;
            script.src = '';
            setTimeout(() => {
              script.src = originalSrc;
            }, 50);
          } else if (script.textContent && script.textContent.trim()) {
            const newScript = iframeDocument.createElement('script');
            if (script.type) {
              newScript.type = script.type;
            }
            newScript.textContent = script.textContent;

            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }

            setTimeout(() => {
              iframeDocument.head.appendChild(newScript);

              try {
                const execScript = iframeDocument.createElement('script');
                if (script.type) {
                  execScript.type = script.type;
                }
                execScript.textContent = script.textContent;

                const iframeWindow = iframe.contentWindow;
                if (iframeWindow) {
                  iframeWindow.document.head.appendChild(execScript);
                  console.log(`✅ Inline script ${index + 1} executed via eval`);
                } else {
                  console.log(`⚠️ Cannot execute script ${index + 1} - eval not available`);
                }
              } catch (evalError) {
                console.error(`❌ Error executing script ${index + 1} via eval:`, evalError);
              }

              console.log(`✅ Inline script ${index + 1} reloaded`);
            }, 100);
          } else {
            console.log(`⚠️ Script ${index + 1} has no content to reload`);
          }
        } catch (scriptError) {
          console.error(`❌ Error reloading script ${index + 1}:`, scriptError);
        }
      });

      console.log('✅ Scripts reloaded successfully');
    } catch (error) {
      console.error('❌ Error reloading iframe scripts:', error);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      console.log('🎯 Component became visible, resetting iframe content flag...');
      setIframeContentCreated(false);
    }
  }, [isVisible]);
  

  const handleMouseDown = (e) => {
    if (isFullscreen) return;

    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isFullscreen) return;

    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = position.x;
      let newY = position.y;

      if (resizeDirection.includes('right')) {
        newWidth = Math.max(300, Math.min(800, resizeStart.width + deltaX));
      }
      if (resizeDirection.includes('left')) {
        const maxDelta = resizeStart.width - 300;
        const delta = Math.max(-maxDelta, Math.min(deltaX, 200));
        newWidth = resizeStart.width - delta;
        newX = position.x + delta;
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(400, Math.min(800, resizeStart.height + deltaY));
      }
      if (resizeDirection.includes('top')) {
        const maxDelta = resizeStart.height - 400;
        const delta = Math.max(-maxDelta, Math.min(deltaY, 200));
        newHeight = resizeStart.height - delta;
        newY = position.y + delta;
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  const handleResizeStart = (e, direction) => {
    if (isFullscreen) return;

    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, resizeDirection]);



  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (onFullscreen) {
      onFullscreen(!isFullscreen);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };



  if (!isVisible) {
    console.log('❌ ReactPreview not visible, returning null');
    return null;
  }

  return (
    <div
      className={`${styles.previewContainer} ${isFullscreen ? styles.fullscreen : ''}`}
      style={!isFullscreen ? {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height
      } : {}}
      ref={containerRef}
    >
      <div
        className={styles.previewHeader}
        onMouseDown={handleMouseDown}
        style={{ cursor: isFullscreen ? 'default' : 'move' }}
      >
        <div className={styles.previewTitle}>
          <span>⚛️ React Preview</span>
          {isLoading && <span className={styles.loadingStatus}>🔄 Cargando...</span>}
          {error && <span className={styles.errorStatus}>❌ Error</span>}
          {autoUpdate && <span className={styles.autoUpdateStatus}>🔄 Auto</span>}
          {!isLoading && !error && <span className={styles.successStatus}>✅ Listo</span>}
        </div>
        <div className={styles.previewActions}>
          <button
            onClick={() => {
              console.log('🔄 Manual refresh triggered');
              setUpdateCounter(prev => prev + 1);
            }}
            className={styles.actionButton}
            title="Actualizar preview"
          >
            🔄
          </button>
          <button
            onClick={() => {
              console.log('📜 Manual script reload triggered');
              reloadIframeScripts();
            }}
            className={styles.actionButton}
            title="Recargar scripts del iframe"
          >
            📜
          </button>
          <button
            onClick={() => {
              console.log('🔍 Debug iframe state');
              if (iframeRef.current) {
                const iframe = iframeRef.current;
                console.log('📋 Iframe element:', iframe);
                console.log('🔗 Iframe src:', iframe.src);
                console.log('📏 Iframe dimensions:', {
                  width: iframe.offsetWidth,
                  height: iframe.offsetHeight
                });

                try {
                  const doc = iframe.contentDocument || iframe.contentWindow?.document;
                  if (doc) {
                    console.log('✅ Can access iframe document');
                    console.log('📄 Document title:', doc.title);
                    console.log('📄 Document readyState:', doc.readyState);
                    console.log('📜 Scripts found:', doc.querySelectorAll('script').length);
                  } else {
                    console.log('❌ Cannot access iframe document');
                  }
                } catch (e) {
                  console.log('❌ Error accessing iframe document:', e);
                }
              } else {
                console.log('❌ iframeRef is null');
              }
            }}
            className={styles.actionButton}
            title="Debug iframe state"
          >
            🔍
          </button>
  
          <button
            onClick={handleFullscreen}
            className={styles.actionButton}
            title={isFullscreen ? "Salir pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? "📱" : "🖥️"}
          </button>
          <button
            onClick={handleClose}
            className={styles.actionButton}
            title="Cerrar preview"
          >
            ❌
          </button>
        </div>
      </div>
      <div className={styles.previewContent}>
      

        <iframe
          ref={iframeRef}
          title="React Preview"
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        
          sandbox="allow-scripts allow-same-origin"
          allow="script"
        />

        {error && (
          <div className={styles.errorDisplay}>
            <h4>⚠️ Error de compilación:</h4>
            <pre>{error}</pre>
            <div className={styles.errorHelp}>
              <p><strong>Sugerencias:</strong></p>
              <ul>
                <li>Verifica que el componente esté bien definido</li>
                <li>Asegúrate de que no haya errores de sintaxis</li>
                <li>Comprueba que el componente tenga un return válido</li>
                <li>Revisa que no falten imports necesarios</li>
              </ul>
            </div>
          </div>
        )}

        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
            <p>Cargando preview...</p>
            <small>Esto puede tomar unos segundos</small>
          </div>
        )}



        {/* <div
          ref={reactContainerRef}
          id="react-direct-container"
          className={styles.previewFrame}
          style={{
            display: (error || !appFiles || Object.keys(appFiles || {}).length === 0) ? 'none' : 'block',
            width: '100%',
            height: '100%',
            border: '1px solid #ddd',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            overflow: 'auto'
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        /> */}

        {/* {!isLoading && !error && Object.keys(appFiles).length > 0 && (
          <div className={styles.previewInfo}>
            <small>✅ Preview cargado correctamente</small>
          </div>
        )} */}
      </div>

      {/* Resizers */}
      {!isFullscreen && (
        <>
          {/* Resizer izquierdo */}
          <div
            className={`${styles.resizer} ${styles.resizerLeft}`}
            onMouseDown={(e) => handleResizeStart(e, 'left')}
          />

          {/* Resizer derecho */}
          <div
            className={`${styles.resizer} ${styles.resizerRight}`}
            onMouseDown={(e) => handleResizeStart(e, 'right')}
          />

          {/* Resizer superior */}
          <div
            className={`${styles.resizer} ${styles.resizerTop}`}
            onMouseDown={(e) => handleResizeStart(e, 'top')}
          />

          {/* Resizer inferior */}
          <div
            className={`${styles.resizer} ${styles.resizerBottom}`}
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
          />

          {/* Esquinas */}
          <div
            className={`${styles.resizer} ${styles.resizerTopLeft}`}
            onMouseDown={(e) => handleResizeStart(e, 'top-left')}
          />
          <div
            className={`${styles.resizer} ${styles.resizerTopRight}`}
            onMouseDown={(e) => handleResizeStart(e, 'top-right')}
          />
          <div
            className={`${styles.resizer} ${styles.resizerBottomLeft}`}
            onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}
          />
          <div
            className={`${styles.resizer} ${styles.resizerBottomRight}`}
            onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
          />
        </>
      )}
    </div>
  );
};

export default ReactPreview; 