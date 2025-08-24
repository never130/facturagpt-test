import React, { useRef, useEffect, useCallback } from 'react';
import { ReactFlow } from 'reactflow';

const StableReactFlow = ({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onConnect, 
  onPaneClick, 
  onDrop, 
  onDragOver, 
  onInit, 
  nodeTypes, 
  onNodeClick,
  ...otherProps 
}) => {
  const containerRef = useRef(null);
  const reactFlowRef = useRef(null);
  const isStable = useRef(false);

  // Stabilize the container
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      
      // Force stable dimensions
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.position = 'relative';
      container.style.overflow = 'hidden';
      
      // Prevent any layout shifts
      container.style.contain = 'layout style paint';
      
      isStable.current = true;
    }
  }, []);

  // Enhanced onInit with stability checks
  const handleInit = useCallback((instance) => {
    if (reactFlowRef.current) {
      reactFlowRef.current = instance;
    }
    
    // Call the original onInit if provided
    if (onInit) {
      onInit(instance);
    }
    
    // Apply additional stability measures
    if (instance && containerRef.current) {
      // Ensure the viewport is stable
      setTimeout(() => {
        try {
          instance.fitView({ 
            padding: 0.1,
            includeHiddenNodes: false,
            minZoom: 0.1,
            maxZoom: 1.5,
            duration: 0 // No animation to prevent loops
          });
        } catch (error) {
          // Ignore fitView errors
        }
      }, 100);
    }
  }, [onInit]);

  // Enhanced onDrop with stability
  const handleDrop = useCallback((event) => {
    if (!isStable.current) return;
    
    if (onDrop) {
      onDrop(event);
    }
  }, [onDrop]);

  // Enhanced onDragOver with stability
  const handleDragOver = useCallback((event) => {
    if (!isStable.current) return;
    
    if (onDragOver) {
      onDragOver(event);
    }
  }, [onDragOver]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        contain: 'layout style paint'
      }}
    >
      <ReactFlow
        ref={reactFlowRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onInit={handleInit}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        {...otherProps}
        // Additional stability props
        fitView={false}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        onError={(error) => {
          // Suppress ResizeObserver related errors
          if (error.message && error.message.includes('ResizeObserver')) {
            return;
          }
          console.error('ReactFlow error:', error);
        }}
      />
    </div>
  );
};

export default StableReactFlow; 