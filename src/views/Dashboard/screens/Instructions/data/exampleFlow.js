// Ejemplo de flujo de testing para validación de email
export const exampleEmailValidationFlow = {
  nodes: [
    {
      id: '1',
      type: 'operatorNode',
      position: { x: 100, y: 100 },
      data: {
        title: 'Validar Email',
        type: 'text',
        category: 'text',
        symbol: '⊃',
        description: 'Verificar si contiene @',
        supportedTypes: ['text'],
        compareValue: '@'
      }
    },
    {
      id: '2',
      type: 'operatorNode',
      position: { x: 400, y: 50 },
      data: {
        title: 'Verificar Dominio',
        type: 'text',
        category: 'text',
        symbol: '←',
        description: 'Verificar si termina con dominio válido',
        supportedTypes: ['text'],
        compareValue: '.com'
      }
    },
    {
      id: '3',
      type: 'operatorNode',
      position: { x: 400, y: 150 },
      data: {
        title: 'Email Inválido',
        type: 'text',
        category: 'text',
        symbol: '⊅',
        description: 'No contiene @',
        supportedTypes: ['text'],
        compareValue: '@'
      }
    },
    {
      id: '4',
      type: 'responseNode',
      position: { x: 700, y: 50 },
      data: {
        title: 'Email Válido',
        type: 'response',
        category: 'text_response',
        description: 'Respuesta para email válido',
        config: {
          text: '✅ Email válido. El formato es correcto.',
          isEditable: true
        }
      }
    },
    {
      id: '5',
      type: 'responseNode',
      position: { x: 700, y: 150 },
      data: {
        title: 'Email Inválido',
        type: 'response',
        category: 'text_response',
        description: 'Respuesta para email inválido',
        config: {
          text: '❌ Email inválido. Por favor, verifica el formato.',
          isEditable: true
        }
      }
    }
  ],
  edges: [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 }
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#ef4444', strokeWidth: 2 }
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 }
    },
    {
      id: 'e3-5',
      source: '3',
      target: '5',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#ef4444', strokeWidth: 2 }
    }
  ]
};

// Ejemplo de flujo con operaciones matemáticas
export const exampleMathFlow = {
  nodes: [
    {
      id: '1',
      type: 'operationNode',
      position: { x: 100, y: 100 },
      data: {
        title: 'Sumar Valores',
        type: 'operation',
        category: 'math',
        symbol: '+',
        description: 'Sumar dos números',
        config: {
          operands: ['$valor1', '$valor2'],
          resultVariable: 'suma'
        }
      }
    },
    {
      id: '2',
      type: 'operatorNode',
      position: { x: 400, y: 100 },
      data: {
        title: 'Verificar Suma',
        type: 'number',
        category: 'number',
        symbol: '>',
        description: 'Verificar si la suma es mayor que 10',
        supportedTypes: ['number'],
        compareValue: 10
      }
    },
    {
      id: '3',
      type: 'responseNode',
      position: { x: 700, y: 50 },
      data: {
        title: 'Suma Alta',
        type: 'response',
        category: 'text_response',
        description: 'Respuesta para suma alta',
        config: {
          text: '🎉 La suma es mayor que 10: $suma',
          isEditable: true
        }
      }
    },
    {
      id: '4',
      type: 'responseNode',
      position: { x: 700, y: 150 },
      data: {
        title: 'Suma Baja',
        type: 'response',
        category: 'text_response',
        description: 'Respuesta para suma baja',
        config: {
          text: '📊 La suma es menor o igual a 10: $suma',
          isEditable: true
        }
      }
    }
  ],
  edges: [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      animated: true
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2 }
    },
    {
      id: 'e2-4',
      source: '2',
      target: '4',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#ef4444', strokeWidth: 2 }
    }
  ]
};

// Ejemplo de flujo con control de tiempo
export const exampleTimeFlow = {
  nodes: [
    {
      id: '1',
      type: 'controlNode',
      position: { x: 100, y: 100 },
      data: {
        title: 'Esperar 2 Segundos',
        type: 'control',
        category: 'time',
        symbol: '⏰',
        description: 'Pausar la ejecución',
        config: {
          duration: 2000,
          unit: 'ms'
        }
      }
    },
    {
      id: '2',
      type: 'responseNode',
      position: { x: 400, y: 100 },
      data: {
        title: 'Tiempo Transcurrido',
        type: 'response',
        category: 'text_response',
        description: 'Confirmar tiempo transcurrido',
        config: {
          text: '⏱️ Han transcurrido 2 segundos desde el inicio.',
          isEditable: true
        }
      }
    }
  ],
  edges: [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'smoothstep',
      animated: true
    }
  ]
};

// Función para cargar un flujo de ejemplo
export const loadExampleFlow = (flowType) => {
  switch (flowType) {
    case 'email':
      return exampleEmailValidationFlow;
    case 'math':
      return exampleMathFlow;
    case 'time':
      return exampleTimeFlow;
    default:
      return exampleEmailValidationFlow;
  }
}; 