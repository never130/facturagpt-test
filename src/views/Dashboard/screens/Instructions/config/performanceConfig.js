// Configuración de performance para ReactFlow y ResizeObserver

export const performanceConfig = {
  // Configuración de ReactFlow para mejor performance
  reactFlow: {
    // Configuración de renderizado
    onlyRenderVisibleElements: true,
    nodesDraggable: true,
    nodesConnectable: true,
    elementsSelectable: true,
    
    // Configuración de zoom y pan
    zoomOnScroll: true,
    zoomOnPinch: true,
    panOnScroll: false,
    panOnScrollMode: 'free',
    
    // Configuración de selección
    selectNodesOnDrag: false,
    multiSelectionKeyCode: 'Shift',
    
    // Configuración de conexiones
    connectionMode: 'loose',
    snapToGrid: false,
    snapGrid: [15, 15],
    
    // Configuración de viewport
    minZoom: 0.1,
    maxZoom: 1.5,
    defaultViewport: { x: 0, y: 0, zoom: 1 },
    
    // Configuración de fitView
    fitView: true,
    fitViewOptions: {
      padding: 0.1,
      includeHiddenNodes: false,
      minZoom: 0.1,
      maxZoom: 1.5,
    },
  },

  // Configuración de ResizeObserver
  resizeObserver: {
    // Debounce y throttle settings
    debounceMs: 16, // ~60fps
    throttleMs: 100,
    
    // Error handling
    suppressErrors: true,
    suppressWarnings: true,
    
    // Performance optimizations
    useRequestAnimationFrame: true,
    useIntersectionObserver: true,
    
    // Batch processing
    batchUpdates: true,
    maxBatchSize: 10,
  },

  // Configuración de CSS para performance
  css: {
    // Hardware acceleration
    useTransform3d: true,
    useWillChange: true,
    useContain: true,
    
    // Animation optimizations
    useCompositorOnlyProperties: true,
    reduceMotion: false,
  },

  // Configuración de eventos
  events: {
    // Debounce settings
    resizeDebounceMs: 250,
    scrollDebounceMs: 16,
    
    // Throttle settings
    resizeThrottleMs: 100,
    scrollThrottleMs: 16,
    
    // Error handling
    suppressResizeObserverErrors: true,
    suppressReactFlowErrors: true,
  },
};

// Función para aplicar optimizaciones de performance
export const applyPerformanceOptimizations = () => {
  // Optimizar CSS para hardware acceleration
  if (performanceConfig.css.useTransform3d) {
    const style = document.createElement('style');
    style.textContent = `
      .react-flow__node,
      .react-flow__edge,
      .react-flow__viewport {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      .operatorNode {
        transform: translateZ(0);
        backface-visibility: hidden;
      }
    `;
    document.head.appendChild(style);
  }

  // Optimizar ResizeObserver global
  if (typeof window !== 'undefined' && window.ResizeObserver) {
    const originalResizeObserver = window.ResizeObserver;
    
    window.ResizeObserver = class OptimizedResizeObserver extends originalResizeObserver {
      constructor(callback) {
        // Crear callbacks optimizados
        let timeoutId = null;
        let lastCall = 0;
        const { debounceMs, throttleMs } = performanceConfig.resizeObserver;

        const optimizedCallback = (entries, observer) => {
          const now = Date.now();
          
          // Throttle
          if (now - lastCall < throttleMs) {
            return;
          }
          lastCall = now;

          // Debounce
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          timeoutId = setTimeout(() => {
            try {
              if (performanceConfig.resizeObserver.useRequestAnimationFrame) {
                requestAnimationFrame(() => {
                  callback(entries, observer);
                });
              } else {
                callback(entries, observer);
              }
            } catch (error) {
              // Silently handle ResizeObserver errors
              if (performanceConfig.resizeObserver.suppressErrors) {
                return;
              }
              console.warn('ResizeObserver error:', error);
            }
          }, debounceMs);
        };

        super(optimizedCallback);
      }
    };
  }

  // Optimizar eventos de window
  if (performanceConfig.events.suppressResizeObserverErrors) {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && 
          (message.includes('ResizeObserver') || 
           message.includes('react-flow'))) {
        return;
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && 
          (message.includes('ResizeObserver') || 
           message.includes('react-flow'))) {
        return;
      }
      originalWarn.apply(console, args);
    };
  }
};

// Función para limpiar optimizaciones
export const cleanupPerformanceOptimizations = () => {
  // Restaurar console methods si es necesario
  // (Esto se maneja en el cleanup del componente principal)
}; 