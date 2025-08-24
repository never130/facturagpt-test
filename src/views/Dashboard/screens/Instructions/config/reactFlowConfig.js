// Configuración global para ReactFlow que previene errores de ResizeObserver

export const reactFlowConfig = {
  // Configuración de viewport
  defaultViewport: { x: 0, y: 0, zoom: 1 },
  minZoom: 0.1,
  maxZoom: 1.5,
  zoomOnScroll: true,
  zoomOnPinch: true,
  panOnScroll: false,
  panOnScrollMode: 'free',
  
  // Configuración de nodos
  nodeTypes: {},
  edgeTypes: {},
  
  // Configuración de conexiones
  connectionMode: 'loose',
  snapToGrid: false,
  snapGrid: [15, 15],
  
  // Configuración de selección
  selectNodesOnDrag: false,
  multiSelectionKeyCode: 'Shift',
  
  // Configuración de renderizado
  onlyRenderVisibleElements: true,
  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,
  
  // Configuración de performance
  fitView: true,
  fitViewOptions: {
    padding: 0.1,
    includeHiddenNodes: false,
    minZoom: 0.1,
    maxZoom: 1.5,
  },
  
  // Configuración de eventos
  onError: (error) => {
    // Suprimir errores específicos de ResizeObserver
    if (error.message && error.message.includes('ResizeObserver loop completed with undelivered notifications')) {
      return;
    }
    console.error('ReactFlow error:', error);
  },
};

// Configuración específica para el manejo de ResizeObserver
export const resizeObserverConfig = {
  // Configuración para prevenir loops infinitos
  debounceMs: 100,
  throttleMs: 16, // ~60fps
  
  // Configuración de error handling
  suppressErrors: true,
  
  // Configuración de performance
  useRequestAnimationFrame: true,
  useIntersectionObserver: true,
};

// Función para aplicar configuración global
export const applyReactFlowConfig = () => {
  // Configurar ResizeObserver global con manejo robusto
  if (typeof window !== 'undefined' && window.ResizeObserver) {
    const originalResizeObserver = window.ResizeObserver;
    
    window.ResizeObserver = class CustomResizeObserver extends originalResizeObserver {
      constructor(callback) {
        // Crear callbacks debounced y throttled
        let timeoutId = null;
        let lastCall = 0;
        const throttleDelay = 16; // ~60fps
        const debounceDelay = 100;

        const debouncedCallback = (entries, observer) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            try {
              callback(entries, observer);
            } catch (error) {
              // Silently handle ResizeObserver errors
              if (!error.message.includes('ResizeObserver')) {
                console.warn('ResizeObserver callback error:', error);
              }
            }
          }, debounceDelay);
        };

        const throttledCallback = (entries, observer) => {
          const now = Date.now();
          if (now - lastCall >= throttleDelay) {
            lastCall = now;
            try {
              callback(entries, observer);
            } catch (error) {
              // Silently handle ResizeObserver errors
              if (!error.message.includes('ResizeObserver')) {
                console.warn('ResizeObserver callback error:', error);
              }
            }
          }
        };

        super((entries, observer) => {
          // Usar requestAnimationFrame para prevenir loops
          if (resizeObserverConfig.useRequestAnimationFrame) {
            requestAnimationFrame(() => {
              debouncedCallback(entries, observer);
              throttledCallback(entries, observer);
            });
          } else {
            debouncedCallback(entries, observer);
            throttledCallback(entries, observer);
          }
        });
      }
    };
  }
  
  // Configurar error handling global mejorado
  if (resizeObserverConfig.suppressErrors) {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && 
          (message.includes('ResizeObserver loop completed with undelivered notifications') ||
           message.includes('ResizeObserver loop limit exceeded') ||
           message.includes('ResizeObserver'))) {
        return; // Suprimir errores de ResizeObserver
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && 
          message.includes('ResizeObserver')) {
        return; // Suprimir warnings de ResizeObserver
      }
      originalWarn.apply(console, args);
    };
  }
}; 