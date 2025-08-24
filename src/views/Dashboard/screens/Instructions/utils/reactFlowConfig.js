// ReactFlow configuration optimized to prevent ResizeObserver loops

export const getOptimizedReactFlowConfig = () => ({
  // Basic settings
  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,
  
  // Zoom and pan settings
  zoomOnScroll: true,
  panOnScroll: false,
  minZoom: 0.1,
  maxZoom: 1.5,
  fitView: false, // Handle manually to prevent loops
  
  // Connection settings
  connectionMode: "loose",
  snapToGrid: false,
  selectNodesOnDrag: false,
  
  // Performance settings
  onlyRenderVisibleElements: false,
  preventScrolling: false,
  zoomOnDoubleClick: false,
  panOnDrag: true,
  
  // Pro options
  proOptions: { hideAttribution: true },
  
  // Stability settings
  defaultViewport: { x: 0, y: 0, zoom: 1 },
  
  // Error handling
  onError: (error) => {
    if (error.message && error.message.includes('ResizeObserver')) {
      return; // Suppress ResizeObserver errors
    }
    console.error('ReactFlow error:', error);
  },
  
  // Additional stability measures
  nodeOrigin: [0.5, 0.5],
  connectionRadius: 20,
  deleteKeyCode: 'Delete',
  multiSelectionKeyCode: 'Shift',
  selectionKeyCode: 'Shift',
  panActivationKeyCode: 'Space',
  zoomActivationKeyCode: 'Meta',
  
  // Disable features that might cause ResizeObserver loops
  autoConnect: false,
  autoConnectRadius: 10,
  autoConnectOnConnect: false,
  autoConnectOnConnectStart: false,
  autoConnectOnConnectEnd: false,
  
  // Viewport settings
  defaultEdgeOptions: {
    type: 'default',
    animated: false,
    style: { stroke: '#b1b1b7' }
  }
}); 