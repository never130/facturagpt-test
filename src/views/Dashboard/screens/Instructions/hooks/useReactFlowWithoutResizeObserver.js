import { useEffect, useRef, useCallback } from 'react';
import { getOptimizedReactFlowConfig } from '../utils/reactFlowConfig';

export const useReactFlowWithoutResizeObserver = () => {
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // The ResizeObserver fix is now handled by the imported utility
    // We just need to ensure ReactFlow is properly initialized
    
    return () => {
      // Cleanup if needed
      if (reactFlowInstance.current) {
        try {
          reactFlowInstance.current.destroy();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const onInit = useCallback((instance) => {
    reactFlowInstance.current = instance;
    isInitialized.current = true;
    
    // Apply fitView with better timing and error handling
    const applyFitView = () => {
      try {
        if (instance && reactFlowWrapper.current && isInitialized.current) {
          // Wait for the DOM to be fully ready
          requestAnimationFrame(() => {
            try {
              instance.fitView({ 
                padding: 0.1,
                includeHiddenNodes: false,
                minZoom: 0.1,
                maxZoom: 1.5,
                duration: 0 // No animation to prevent loops
              });
            } catch (error) {
              console.warn('ReactFlow fitView error:', error);
            }
          });
        }
      } catch (error) {
        console.warn('ReactFlow initialization error:', error);
      }
    };

    // Apply fitView with multiple attempts to ensure it works
    applyFitView();
    
    // Also try after a short delay to handle any async rendering
    setTimeout(applyFitView, 100);
    setTimeout(applyFitView, 500);
  }, []);

  const getReactFlowInstance = useCallback(() => {
    return reactFlowInstance.current;
  }, []);

  return {
    reactFlowWrapper,
    onInit,
    getReactFlowInstance,
    isInitialized: isInitialized.current
  };
};

export const getReactFlowConfigWithoutResizeObserver = () => {
  return getOptimizedReactFlowConfig();
}; 