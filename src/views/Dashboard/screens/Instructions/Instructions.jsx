// Import and execute ReactFlow-specific ResizeObserver fix immediately
import './utils/reactFlowResizeObserverFix';

import React, { useState, useCallback } from 'react';
import { addEdge, useNodesState, useEdgesState, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import './styles/reactFlowStabilizer.css';
import styles from './Instructions.module.css';
import MenuLeft from './components/MenuLeft/MenuLeft';
import Chat from './components/Chat/Chat';
import OperatorNode from './components/OperatorNode/OperatorNode';
import StableReactFlow from './components/StableReactFlow/StableReactFlow';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useReactFlowWithoutResizeObserver, getReactFlowConfigWithoutResizeObserver } from './hooks/useReactFlowWithoutResizeObserver';

const Instructions = () => {
  const [t] = useTranslation("ChatView");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showChat, setShowChat] = useState(true);
  
  const { reactFlowWrapper, onInit } = useReactFlowWithoutResizeObserver();
  const reactFlowConfig = getReactFlowConfigWithoutResizeObserver();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      console.log('Drop event triggered');

      try {
        const reactFlowElement = document.querySelector('.react-flow');
        if (!reactFlowElement) {
          console.error('ReactFlow element not found');
          return;
        }

        const reactFlowBounds = reactFlowElement.getBoundingClientRect();
        console.log('ReactFlow bounds:', reactFlowBounds);

        const type = event.dataTransfer.getData('application/reactflow');
        const operatorDataString = event.dataTransfer.getData('application/operator');
        
        console.log('Raw drop data:', { type, operatorDataString });

        if (typeof type === 'undefined' || !type) {
          console.log('Invalid type, returning');
          return;
        }

        if (!operatorDataString) {
          console.error('No operator data found');
          return;
        }

        const operatorData = JSON.parse(operatorDataString);
        console.log('Parsed operator data:', operatorData);

        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        console.log('Calculated position:', position);

        const nodeId = `${type}-${Date.now()}`;
        const newNode = {
          id: nodeId,
          type: 'operatorNode',
          position,
          data: {
            ...operatorData,
            label: operatorData.title,
          },
        };

        console.log('Created new node:', newNode);

        setNodes((nds) => {
          console.log('Current nodes before update:', nds);
          const newNodes = nds.concat(newNode);
          console.log('Updated nodes array:', newNodes);
          return newNodes;
        });

        console.log('setNodes called successfully');
      } catch (error) {
        console.error('Error in handleDrop:', error);
      }
    },
    [setNodes]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.instructionsContainer}>
        <div className={styles.instructionsHeader}>
          <h1>Flow Testing System</h1>
          <p>Create and test automation flows with interactive chat</p>
        </div>

        <div className={styles.mainContent}>
          <MenuLeft />
          
          <div className={styles.flowArea} ref={reactFlowWrapper}>
            <StableReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onPaneClick={onPaneClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onInit={onInit}
              nodeTypes={{ 
                operatorNode: OperatorNode
              }}
              {...reactFlowConfig}
              onNodeClick={onNodeClick}
            >
              <Controls />
              <Background />
            </StableReactFlow>
          </div>

          {showChat && (
            <Chat 
              selectedNode={selectedNode}
              updateNodeData={updateNodeData}
              deleteNode={deleteNode}
              nodes={nodes}
              edges={edges}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default Instructions;