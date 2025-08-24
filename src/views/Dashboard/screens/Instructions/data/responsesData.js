export const responsesData = [
  // 📝 Respuestas de Texto
  {
    title: "Texto Fijo",
    description: "Respuesta con texto predefinido",
    type: "response",
    category: "text_response",
    supportedTypes: ["text"],
    symbol: "📝",
    config: {
      text: "",
      isEditable: true
    }
  },
  {
    title: "Texto de IA",
    description: "Respuesta generada por IA",
    type: "response",
    category: "ai_response",
    supportedTypes: ["text"],
    symbol: "🤖",
    config: {
      prompt: "",
      context: "",
      isEditable: true
    }
  },
  {
    title: "Contexto",
    description: "Usar información del contexto actual",
    type: "response",
    category: "context_response",
    supportedTypes: ["text", "number", "date", "boolean"],
    symbol: "📋",
    config: {
      contextKey: "",
      format: "text"
    }
  },
  {
    title: "Recoger Nuevos Datos",
    description: "Solicitar información adicional al usuario",
    type: "response",
    category: "data_collection",
    supportedTypes: ["text", "number", "date", "boolean"],
    symbol: "📊",
    config: {
      question: "",
      dataType: "text",
      validation: null
    }
  },

  // 🧮 Operaciones Matemáticas
  {
    title: "Suma",
    description: "Sumar dos o más valores",
    type: "operation",
    category: "math",
    supportedTypes: ["number"],
    symbol: "+",
    config: {
      operands: [],
      resultVariable: ""
    }
  },
  {
    title: "Resta",
    description: "Restar valores",
    type: "operation",
    category: "math",
    supportedTypes: ["number"],
    symbol: "-",
    config: {
      operands: [],
      resultVariable: ""
    }
  },
  {
    title: "Multiplicación",
    description: "Multiplicar valores",
    type: "operation",
    category: "math",
    supportedTypes: ["number"],
    symbol: "×",
    config: {
      operands: [],
      resultVariable: ""
    }
  },
  {
    title: "División",
    description: "Dividir valores",
    type: "operation",
    category: "math",
    supportedTypes: ["number"],
    symbol: "÷",
    config: {
      operands: [],
      resultVariable: ""
    }
  },
  {
    title: "Módulo",
    description: "Obtener el resto de la división",
    type: "operation",
    category: "math",
    supportedTypes: ["number"],
    symbol: "%",
    config: {
      operands: [],
      resultVariable: ""
    }
  },
  {
    title: "Potencia",
    description: "Elevar a una potencia",
    type: "operation",
    category: "math",
    supportedTypes: ["number"],
    symbol: "^",
    config: {
      base: "",
      exponent: "",
      resultVariable: ""
    }
  },
  {
    title: "Raíz Cuadrada",
    description: "Calcular raíz cuadrada",
    type: "operation",
    category: "math",
    supportedTypes: ["number"],
    symbol: "√",
    config: {
      operand: "",
      resultVariable: ""
    }
  },
  {
    title: "Redondear",
    description: "Redondear a decimales específicos",
    type: "operation",
    category: "math",
    supportedTypes: ["number"],
    symbol: "≈",
    config: {
      operand: "",
      decimals: 2,
      resultVariable: ""
    }
  },

  // ⏰ Control de Tiempo
  {
    title: "Esperar",
    description: "Pausar la ejecución por un tiempo",
    type: "control",
    category: "time",
    supportedTypes: ["number"],
    symbol: "⏰",
    config: {
      duration: 1000, // milisegundos
      unit: "ms" // ms, s, m, h
    }
  },
  {
    title: "Esperar N Días",
    description: "Esperar un número específico de días",
    type: "control",
    category: "time",
    supportedTypes: ["number"],
    symbol: "📅",
    config: {
      days: 1,
      businessDays: false
    }
  },
  {
    title: "Esperar Hasta",
    description: "Esperar hasta una fecha específica",
    type: "control",
    category: "time",
    supportedTypes: ["date"],
    symbol: "🎯",
    config: {
      targetDate: "",
      includeTime: false
    }
  },
  {
    title: "Retraso Exponencial",
    description: "Esperar con retraso exponencial",
    type: "control",
    category: "time",
    supportedTypes: ["number"],
    symbol: "📈",
    config: {
      baseDelay: 1000,
      maxDelay: 60000,
      factor: 2
    }
  },

  // 🔄 Bucles y Repetición
  {
    title: "Bucle For",
    description: "Repetir un número específico de veces",
    type: "control",
    category: "loop",
    supportedTypes: ["number"],
    symbol: "🔄",
    config: {
      iterations: 1,
      maxIterations: 100,
      breakCondition: null
    }
  },
  {
    title: "Bucle While",
    description: "Repetir mientras se cumpla una condición",
    type: "control",
    category: "loop",
    supportedTypes: ["boolean"],
    symbol: "⏳",
    config: {
      condition: "",
      maxIterations: 1000,
      timeout: 30000
    }
  },
  {
    title: "Bucle For Each",
    description: "Iterar sobre una lista",
    type: "control",
    category: "loop",
    supportedTypes: ["list"],
    symbol: "📋",
    config: {
      listVariable: "",
      itemVariable: "",
      indexVariable: ""
    }
  },
  {
    title: "Bucle Do While",
    description: "Ejecutar al menos una vez",
    type: "control",
    category: "loop",
    supportedTypes: ["boolean"],
    symbol: "🔄",
    config: {
      condition: "",
      maxIterations: 1000
    }
  },

  // 🔍 Comparaciones Avanzadas
  {
    title: "Comparar Texto",
    description: "Comparar cadenas de texto",
    type: "comparison",
    category: "advanced_comparison",
    supportedTypes: ["text"],
    symbol: "🔍",
    config: {
      caseSensitive: false,
      ignoreAccents: false,
      partialMatch: false
    }
  },
  {
    title: "Comparar Fechas",
    description: "Comparar fechas con precisión",
    type: "comparison",
    category: "advanced_comparison",
    supportedTypes: ["date"],
    symbol: "📅",
    config: {
      precision: "day", // second, minute, hour, day, month, year
      timezone: "local"
    }
  },
  {
    title: "Comparar Arrays",
    description: "Comparar arrays y listas",
    type: "comparison",
    category: "advanced_comparison",
    supportedTypes: ["list"],
    symbol: "📊",
    config: {
      orderMatters: false,
      allowDuplicates: true
    }
  },
  {
    title: "Comparar Objetos",
    description: "Comparar objetos JSON",
    type: "comparison",
    category: "advanced_comparison",
    supportedTypes: ["object"],
    symbol: "📦",
    config: {
      deepCompare: true,
      ignoreKeys: []
    }
  },

  // 🎯 Lógica Condicional
  {
    title: "IF",
    description: "Condición simple",
    type: "control",
    category: "conditional",
    supportedTypes: ["boolean"],
    symbol: "🎯",
    config: {
      condition: "",
      trueBranch: null,
      falseBranch: null
    }
  },
  {
    title: "IF-ELSE",
    description: "Condición con rama alternativa",
    type: "control",
    category: "conditional",
    supportedTypes: ["boolean"],
    symbol: "🔄",
    config: {
      condition: "",
      trueBranch: null,
      falseBranch: null
    }
  },
  {
    title: "SWITCH",
    description: "Múltiples condiciones",
    type: "control",
    category: "conditional",
    supportedTypes: ["text", "number"],
    symbol: "🎚️",
    config: {
      variable: "",
      cases: [],
      defaultCase: null
    }
  },
  {
    title: "TRY-CATCH",
    description: "Manejo de errores",
    type: "control",
    category: "conditional",
    supportedTypes: ["any"],
    symbol: "🛡️",
    config: {
      tryBlock: null,
      catchBlock: null,
      errorVariable: ""
    }
  }
];

export const getResponsesByCategory = () => {
  const categories = {};
  responsesData.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item);
  });
  return categories;
};

export const getResponsesByType = () => {
  const types = {};
  responsesData.forEach(item => {
    if (!types[item.type]) {
      types[item.type] = [];
    }
    types[item.type].push(item);
  });
  return types;
};

export const getResponseCategories = () => {
  return [
    { key: "text_response", label: "📝 Respuestas de Texto", color: "#3B82F6" },
    { key: "ai_response", label: "🤖 Respuestas de IA", color: "#10B981" },
    { key: "context_response", label: "📋 Contexto", color: "#F59E0B" },
    { key: "data_collection", label: "📊 Recoger Datos", color: "#8B5CF6" },
    { key: "math", label: "🧮 Operaciones Matemáticas", color: "#EF4444" },
    { key: "time", label: "⏰ Control de Tiempo", color: "#06B6D4" },
    { key: "loop", label: "🔄 Bucles", color: "#84CC16" },
    { key: "advanced_comparison", label: "🔍 Comparaciones Avanzadas", color: "#F97316" },
    { key: "conditional", label: "🎯 Lógica Condicional", color: "#EC4899" }
  ];
}; 