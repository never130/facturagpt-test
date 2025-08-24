// Utilidades para el manejo de flujos de automatización

export const validateFlow = (nodes, edges) => {
  const errors = [];
  const warnings = [];

  // Verificar que hay al menos un nodo
  if (nodes.length === 0) {
    errors.push('El flujo debe contener al menos un operador');
  }

  // Verificar conexiones válidas
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) {
      errors.push('Conexión inválida: nodo no encontrado');
    }
  });

  // Verificar tipos compatibles
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (sourceNode && targetNode) {
      const sourceType = sourceNode.data.type;
      const targetSupportedTypes = targetNode.data.supportedTypes || [targetNode.data.type];
      
      if (!targetSupportedTypes.includes(sourceType)) {
        warnings.push(`Incompatibilidad de tipos: ${sourceType} → ${targetNode.data.title}`);
      }
    }
  });

  return { errors, warnings };
};

export const executeFlow = (nodes, edges, inputData) => {
  const results = [];
  const visited = new Set();

  // Encontrar nodos de entrada (sin conexiones entrantes)
  const entryNodes = nodes.filter(node => 
    !edges.some(edge => edge.target === node.id)
  );

  const traverseNode = (nodeId, inputValue) => {
    if (visited.has(nodeId)) {
      return null; // Evitar ciclos infinitos
    }
    visited.add(nodeId);

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;

    // Ejecutar el operador
    const result = executeOperator(node, inputValue);
    results.push({
      nodeId,
      operator: node.data.title,
      input: inputValue,
      output: result,
      timestamp: new Date()
    });

    // Encontrar nodos conectados
    const connectedEdges = edges.filter(edge => edge.source === nodeId);
    connectedEdges.forEach(edge => {
      traverseNode(edge.target, result);
    });

    return result;
  };

  // Ejecutar desde cada nodo de entrada
  entryNodes.forEach(node => {
    traverseNode(node.id, inputData);
  });

  return results;
};

export const executeOperator = (node, inputValue) => {
  const { title, type, configValue } = node.data;
  
  switch (title) {
    case 'Igual a':
      return inputValue == configValue;
    
    case 'Exactamente igual':
      return inputValue === configValue;
    
    case 'Distinto de':
      return inputValue != configValue;
    
    case 'Mayor que':
      return Number(inputValue) > Number(configValue);
    
    case 'Menor que':
      return Number(inputValue) < Number(configValue);
    
    case '≥ Mayor o igual':
      return Number(inputValue) >= Number(configValue);
    
    case '≤ Menor o igual':
      return Number(inputValue) <= Number(configValue);
    
    case 'Es verdadero':
      return inputValue === true;
    
    case 'Es falso':
      return inputValue === false;
    
    case 'Contiene':
      return String(inputValue).includes(configValue);
    
    case 'No contiene':
      return !String(inputValue).includes(configValue);
    
    case 'Empieza con':
      return String(inputValue).startsWith(configValue);
    
    case 'Termina con':
      return String(inputValue).endsWith(configValue);
    
    case 'Es nulo':
      return inputValue === null || inputValue === undefined;
    
    case 'No es nulo':
      return inputValue !== null && inputValue !== undefined;
    
    case 'Está vacío':
      return String(inputValue).length === 0;
    
    case 'No está vacío':
      return String(inputValue).length > 0;
    
    default:
      return inputValue; // Operador no reconocido, devolver valor original
  }
};

export const exportFlow = (nodes, edges) => {
  return {
    version: '1.0',
    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        title: node.data.title,
        description: node.data.description,
        type: node.data.type,
        category: node.data.category,
        supportedTypes: node.data.supportedTypes,
        symbol: node.data.symbol,
        configValue: node.data.configValue
      }
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type
    })),
    metadata: {
      createdAt: new Date().toISOString(),
      totalNodes: nodes.length,
      totalEdges: edges.length
    }
  };
};

export const importFlow = (flowData) => {
  try {
    const { nodes, edges } = flowData;
    
    // Validar estructura
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      throw new Error('Formato de flujo inválido');
    }

    // Restaurar nodos con configuración adicional
    const restoredNodes = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onConfigChange: (value) => {
          // Esta función se configurará cuando se use el nodo
          console.log('Config changed:', value);
        }
      }
    }));

    return {
      nodes: restoredNodes,
      edges: edges
    };
  } catch (error) {
    console.error('Error importing flow:', error);
    return { nodes: [], edges: [] };
  }
};

export const generateFlowCode = (nodes, edges) => {
  let code = '// Código generado automáticamente\n\n';
  code += 'function executeFlow(inputData) {\n';
  code += '  const results = {};\n\n';

  nodes.forEach(node => {
    code += `  // ${node.data.title}\n`;
    code += `  const ${node.id.replace(/[^a-zA-Z0-9]/g, '_')} = `;
    
    switch (node.data.title) {
      case 'Igual a':
        code += `inputData === ${JSON.stringify(node.data.configValue)};\n`;
        break;
      case 'Mayor que':
        code += `Number(inputData) > ${node.data.configValue};\n`;
        break;
      case 'Contiene':
        code += `String(inputData).includes(${JSON.stringify(node.data.configValue)});\n`;
        break;
      default:
        code += `// Operador: ${node.data.title}\n`;
        code += `  // Implementar lógica específica\n`;
    }
    code += '\n';
  });

  code += '  return results;\n';
  code += '}\n';

  return code;
}; 