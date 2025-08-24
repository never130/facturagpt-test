export const operatorsData = [
  // 🧮 Comparación Numérica y Lógica
  {
    title: "Igual a",
    description: "Valor igual",
    type: "comparison",
    category: "comparison",
    supportedTypes: ["text", "number", "date", "boolean"],
    symbol: "=="
  },
  {
    title: "Exactamente igual",
    description: "Igual valor y tipo",
    type: "comparison",
    category: "comparison",
    supportedTypes: ["text", "number", "boolean"],
    symbol: "==="
  },
  {
    title: "Distinto de",
    description: "Valor diferente",
    type: "comparison",
    category: "comparison",
    supportedTypes: ["text", "number", "date", "boolean"],
    symbol: "!="
  },
  {
    title: "Mayor que",
    description: "Valor mayor",
    type: "number",
    category: "number",
    supportedTypes: ["number", "date"],
    symbol: ">"
  },
  {
    title: "Menor que",
    description: "Valor menor",
    type: "number",
    category: "number",
    supportedTypes: ["number", "date"],
    symbol: "<"
  },
  {
    title: "≥ Mayor o igual",
    description: "Igual o mayor",
    type: "number",
    category: "number",
    supportedTypes: ["number", "date"],
    symbol: ">="
  },
  {
    title: "≤ Menor o igual",
    description: "Igual o menor",
    type: "number",
    category: "number",
    supportedTypes: ["number", "date"],
    symbol: "<="
  },
  {
    title: "Es verdadero",
    description: "Booleano true",
    type: "boolean",
    category: "boolean",
    supportedTypes: ["boolean"],
    symbol: "T"
  },
  {
    title: "Es falso",
    description: "Booleano false",
    type: "boolean",
    category: "boolean",
    supportedTypes: ["boolean"],
    symbol: "F"
  },

  // 🔢 Rango y Listas
  {
    title: "Entre",
    description: "Dentro de un rango (inclusive)",
    type: "range",
    category: "range",
    supportedTypes: ["number", "date"],
    symbol: "∈"
  },
  {
    title: "Fuera de rango",
    description: "No está dentro del rango",
    type: "range",
    category: "range",
    supportedTypes: ["number", "date"],
    symbol: "∉"
  },
  {
    title: "En lista",
    description: "Valor dentro de una lista",
    type: "list",
    category: "list",
    supportedTypes: ["text", "number"],
    symbol: "∈"
  },
  {
    title: "No en lista",
    description: "Valor no en la lista",
    type: "list",
    category: "list",
    supportedTypes: ["text", "number"],
    symbol: "∉"
  },
  {
    title: "Coincide con alguno",
    description: "Al menos uno coincide",
    type: "list",
    category: "list",
    supportedTypes: ["text", "number"],
    symbol: "∃"
  },
  {
    title: "Coincide con todos",
    description: "Todos deben coincidir",
    type: "list",
    category: "list",
    supportedTypes: ["text", "number"],
    symbol: "∀"
  },

  // ✍️ Texto
  {
    title: "Contiene",
    description: "Contiene el texto",
    type: "text",
    category: "text",
    supportedTypes: ["text"],
    symbol: "⊃"
  },
  {
    title: "No contiene",
    description: "No contiene texto",
    type: "text",
    category: "text",
    supportedTypes: ["text"],
    symbol: "⊅"
  },
  {
    title: "Empieza con",
    description: "Comienza con texto",
    type: "text",
    category: "text",
    supportedTypes: ["text"],
    symbol: "→"
  },
  {
    title: "Termina con",
    description: "Termina en texto",
    type: "text",
    category: "text",
    supportedTypes: ["text"],
    symbol: "←"
  },
  {
    title: "Expresión regular",
    description: "Coincide con regex",
    type: "text",
    category: "text",
    supportedTypes: ["text"],
    symbol: "~"
  },
  {
    title: "= n",
    description: "Longitud exacta",
    type: "text",
    category: "text",
    supportedTypes: ["text"],
    symbol: "|x|="
  },
  {
    title: "> n",
    description: "Longitud mayor que",
    type: "text",
    category: "text",
    supportedTypes: ["text"],
    symbol: "|x|>"
  },
  {
    title: "< n",
    description: "Longitud menor que",
    type: "text",
    category: "text",
    supportedTypes: ["text"],
    symbol: "|x|<"
  },
  {
    title: "[a…b]",
    description: "Longitud entre a y b",
    type: "text",
    category: "text",
    supportedTypes: ["text"],
    symbol: "|x|∈"
  },
  {
    title: "A→A",
    description: "Todo en mayúsculas",
    type: "text",
    category: "text",
    supportedTypes: ["text"],
    symbol: "UPPER"
  },
  {
    title: "a→a",
    description: "Todo en minúsculas",
    type: "text",
    category: "text",
    supportedTypes: ["text"],
    symbol: "LOWER"
  },

  // 📆 Fecha y Tiempo
  {
    title: "En fecha específica",
    description: "Igual a una fecha",
    type: "date",
    category: "date",
    supportedTypes: ["date"],
    symbol: "="
  },
  {
    title: "Antes de",
    description: "Fecha anterior",
    type: "date",
    category: "date",
    supportedTypes: ["date"],
    symbol: "<"
  },
  {
    title: "Después de",
    description: "Fecha posterior",
    type: "date",
    category: "date",
    supportedTypes: ["date"],
    symbol: ">"
  },
  {
    title: "Entre fechas",
    description: "En un intervalo",
    type: "date",
    category: "date",
    supportedTypes: ["date"],
    symbol: "∈"
  },
  {
    title: "Día de la semana",
    description: "Lunes, Martes, etc.",
    type: "date",
    category: "date",
    supportedTypes: ["date"],
    symbol: "DOW"
  },
  {
    title: "Es hoy",
    description: "Comparación relativa",
    type: "date",
    category: "date",
    supportedTypes: ["date"],
    symbol: "TODAY"
  },
  {
    title: "Es ayer",
    description: "Comparación relativa",
    type: "date",
    category: "date",
    supportedTypes: ["date"],
    symbol: "YESTERDAY"
  },
  {
    title: "Es mañana",
    description: "Comparación relativa",
    type: "date",
    category: "date",
    supportedTypes: ["date"],
    symbol: "TOMORROW"
  },
  {
    title: "Esta semana",
    description: "Rango relativo",
    type: "date",
    category: "date",
    supportedTypes: ["date"],
    symbol: "THIS_WEEK"
  },
  {
    title: "Este mes",
    description: "Rango relativo",
    type: "date",
    category: "date",
    supportedTypes: ["date"],
    symbol: "THIS_MONTH"
  },
  {
    title: "Este año",
    description: "Rango relativo",
    type: "date",
    category: "date",
    supportedTypes: ["date"],
    symbol: "THIS_YEAR"
  },

  // 🚫 Nulos y Existencia
  {
    title: "Es nulo",
    description: "No tiene valor",
    type: "null",
    category: "null",
    supportedTypes: ["text", "number", "date", "boolean"],
    symbol: "NULL"
  },
  {
    title: "No es nulo",
    description: "Tiene valor",
    type: "null",
    category: "null",
    supportedTypes: ["text", "number", "date", "boolean"],
    symbol: "!NULL"
  },
  {
    title: "Está vacío",
    description: "Longitud 0",
    type: "null",
    category: "null",
    supportedTypes: ["text"],
    symbol: "EMPTY"
  },
  {
    title: "No está vacío",
    description: "Tiene contenido",
    type: "null",
    category: "null",
    supportedTypes: ["text"],
    symbol: "!EMPTY"
  },

  // ⚙️ Avanzados / Técnicos
  {
    title: "Igual ignorando mayúsculas",
    description: "Case insensitive",
    type: "advanced",
    category: "advanced",
    supportedTypes: ["text"],
    symbol: "A=a"
  },
  {
    title: "Comparación numérica como texto",
    description: "Convierte texto a número",
    type: "advanced",
    category: "advanced",
    supportedTypes: ["text"],
    symbol: "T→N"
  },
  {
    title: "Parsear fecha de texto",
    description: "Convierte texto a fecha",
    type: "advanced",
    category: "advanced",
    supportedTypes: ["text"],
    symbol: "T→D"
  },
  {
    title: "Redondeo igual a",
    description: "Igual después de redondear",
    type: "advanced",
    category: "advanced",
    supportedTypes: ["number"],
    symbol: "≈"
  },
  {
    title: "Truncado igual a",
    description: "Igual sin decimales",
    type: "advanced",
    category: "advanced",
    supportedTypes: ["number"],
    symbol: "⌊x⌋"
  }
];

export const getOperatorsByCategory = () => {
  return operatorsData.reduce((acc, operator) => {
    if (!acc[operator.category]) {
      acc[operator.category] = [];
    }
    acc[operator.category].push(operator);
    return acc;
  }, {});
};

export const getOperatorsByType = () => {
  return operatorsData.reduce((acc, operator) => {
    if (!acc[operator.type]) {
      acc[operator.type] = [];
    }
    acc[operator.type].push(operator);
    return acc;
  }, {});
}; 