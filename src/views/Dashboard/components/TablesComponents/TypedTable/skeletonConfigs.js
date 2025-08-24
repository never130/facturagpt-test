
export const createSkeletonTable = (config = basicSkeletonConfig) => {
  return {
    _id: 'skeleton-table',
    type: 'skeleton',
    name: 'Tabla de Combinaciones',
    headers: config.headers,
    skeletonConfig: config
  };
};

export const basicSkeletonConfig = {
  rows: 8,
  columns: 6,
  headers: ['ID', 'Producto', 'Precio', 'Cantidad', 'Subtotal', 'Total'],
  formulas: {
    '0,4': { 
      type: 'multiply', 
      source: ['0,2', '0,3'], 
      color: '#ff6b6b',
      description: 'Precio × Cantidad'
    },
    '1,4': { 
      type: 'multiply', 
      source: ['1,2', '1,3'], 
      color: '#ff6b6b',
      description: 'Precio × Cantidad'
    },
    '2,4': { 
      type: 'multiply', 
      source: ['2,2', '2,3'], 
      color: '#ff6b6b',
      description: 'Precio × Cantidad'
    },
    '3,4': { 
      type: 'multiply', 
      source: ['3,2', '3,3'], 
      color: '#ff6b6b',
      description: 'Precio × Cantidad'
    },
    '4,4': { 
      type: 'multiply', 
      source: ['4,2', '4,3'], 
      color: '#ff6b6b',
      description: 'Precio × Cantidad'
    },
    '5,4': { 
      type: 'multiply', 
      source: ['5,2', '5,3'], 
      color: '#ff6b6b',
      description: 'Precio × Cantidad'
    },
    '6,4': { 
      type: 'multiply', 
      source: ['6,2', '6,3'], 
      color: '#ff6b6b',
      description: 'Precio × Cantidad'
    },
    '7,4': { 
      type: 'multiply', 
      source: ['7,2', '7,3'], 
      color: '#ff6b6b',
      description: 'Precio × Cantidad'
    },
    '7,5': { 
      type: 'sum', 
      source: ['0,4', '1,4', '2,4', '3,4', '4,4', '5,4', '6,4', '7,4'], 
      color: '#4ecdc4',
      description: 'Suma de subtotales'
    }
  },
  connections: [
    { from: '0,2', to: '0,4', type: 'multiply' },
    { from: '0,3', to: '0,4', type: 'multiply' },
    { from: '1,2', to: '1,4', type: 'multiply' },
    { from: '1,3', to: '1,4', type: 'multiply' },
    { from: '2,2', to: '2,4', type: 'multiply' },
    { from: '2,3', to: '2,4', type: 'multiply' },
    { from: '3,2', to: '3,4', type: 'multiply' },
    { from: '3,3', to: '3,4', type: 'multiply' },
    { from: '4,2', to: '4,4', type: 'multiply' },
    { from: '4,3', to: '4,4', type: 'multiply' },
    { from: '5,2', to: '5,4', type: 'multiply' },
    { from: '5,3', to: '5,4', type: 'multiply' },
    { from: '6,2', to: '6,4', type: 'multiply' },
    { from: '6,3', to: '6,4', type: 'multiply' },
    { from: '7,2', to: '7,4', type: 'multiply' },
    { from: '7,3', to: '7,4', type: 'multiply' },
    { from: '0,4', to: '7,5', type: 'sum' },
    { from: '1,4', to: '7,5', type: 'sum' },
    { from: '2,4', to: '7,5', type: 'sum' },
    { from: '3,4', to: '7,5', type: 'sum' },
    { from: '4,4', to: '7,5', type: 'sum' },
    { from: '5,4', to: '7,5', type: 'sum' },
    { from: '6,4', to: '7,5', type: 'sum' },
    { from: '7,4', to: '7,5', type: 'sum' }
  ]
};

export const advancedSkeletonConfig = {
  rows: 8,
  columns: 7,
  headers: ['Departamento', 'Enero', 'Febrero', 'Marzo', 'Q1 Total', 'Promedio', 'Meta'],
  formulas: {
    '0,4': { 
      type: 'sum', 
      source: ['0,1', '0,2', '0,3'], 
      color: '#ff6b6b',
      description: 'Suma Q1'
    },
    '1,4': { 
      type: 'sum', 
      source: ['1,1', '1,2', '1,3'], 
      color: '#4ecdc4',
      description: 'Suma Q1'
    },
    '2,4': { 
      type: 'sum', 
      source: ['2,1', '2,2', '2,3'], 
      color: '#45b7d1',
      description: 'Suma Q1'
    },
    '3,4': { 
      type: 'sum', 
      source: ['3,1', '3,2', '3,3'], 
      color: '#f39c12',
      description: 'Suma Q1'
    },
    '4,4': { 
      type: 'sum', 
      source: ['4,1', '4,2', '4,3'], 
      color: '#9b59b6',
      description: 'Suma Q1'
    },
    '5,4': { 
      type: 'sum', 
      source: ['5,1', '5,2', '5,3'], 
      color: '#e74c3c',
      description: 'Suma Q1'
    },
    '6,4': { 
      type: 'sum', 
      source: ['6,1', '6,2', '6,3'], 
      color: '#27ae60',
      description: 'Suma Q1'
    },
    '7,4': { 
      type: 'sum', 
      source: ['7,1', '7,2', '7,3'], 
      color: '#3498db',
      description: 'Suma Q1'
    },
    '0,5': { 
      type: 'average', 
      source: ['0,1', '0,2', '0,3'], 
      color: '#f1c40f',
      description: 'Promedio mensual'
    },
    '1,5': { 
      type: 'average', 
      source: ['1,1', '1,2', '1,3'], 
      color: '#e67e22',
      description: 'Promedio mensual'
    },
    '2,5': { 
      type: 'average', 
      source: ['2,1', '2,2', '2,3'], 
      color: '#8e44ad',
      description: 'Promedio mensual'
    },
    '3,5': { 
      type: 'average', 
      source: ['3,1', '3,2', '3,3'], 
      color: '#16a085',
      description: 'Promedio mensual'
    },
    '4,5': { 
      type: 'average', 
      source: ['4,1', '4,2', '4,3'], 
      color: '#c0392b',
      description: 'Promedio mensual'
    },
    '5,5': { 
      type: 'average', 
      source: ['5,1', '5,2', '5,3'], 
      color: '#2980b9',
      description: 'Promedio mensual'
    },
    '6,5': { 
      type: 'average', 
      source: ['6,1', '6,2', '6,3'], 
      color: '#d35400',
      description: 'Promedio mensual'
    },
    '7,5': { 
      type: 'average', 
      source: ['7,1', '7,2', '7,3'], 
      color: '#7f8c8d',
      description: 'Promedio mensual'
    },
    '7,6': { 
      type: 'sum', 
      source: ['0,4', '1,4', '2,4', '3,4', '4,4', '5,4', '6,4', '7,4'], 
      color: '#2c3e50',
      description: 'Total general'
    }
  },
  connections: [
    { from: '0,1', to: '0,4', type: 'sum' },
    { from: '0,2', to: '0,4', type: 'sum' },
    { from: '0,3', to: '0,4', type: 'sum' },
    { from: '1,1', to: '1,4', type: 'sum' },
    { from: '1,2', to: '1,4', type: 'sum' },
    { from: '1,3', to: '1,4', type: 'sum' },
    { from: '2,1', to: '2,4', type: 'sum' },
    { from: '2,2', to: '2,4', type: 'sum' },
    { from: '2,3', to: '2,4', type: 'sum' },
    { from: '3,1', to: '3,4', type: 'sum' },
    { from: '3,2', to: '3,4', type: 'sum' },
    { from: '3,3', to: '3,4', type: 'sum' },
    { from: '4,1', to: '4,4', type: 'sum' },
    { from: '4,2', to: '4,4', type: 'sum' },
    { from: '4,3', to: '4,4', type: 'sum' },
    { from: '0,1', to: '5,1', type: 'average' },
    { from: '1,1', to: '5,1', type: 'average' },
    { from: '2,1', to: '5,1', type: 'average' },
    { from: '3,1', to: '5,1', type: 'average' },
    { from: '4,1', to: '5,1', type: 'average' },
    { from: '0,2', to: '5,2', type: 'average' },
    { from: '1,2', to: '5,2', type: 'average' },
    { from: '2,2', to: '5,2', type: 'average' },
    { from: '3,2', to: '5,2', type: 'average' },
    { from: '4,2', to: '5,2', type: 'average' },
    { from: '0,3', to: '5,3', type: 'average' },
    { from: '1,3', to: '5,3', type: 'average' },
    { from: '2,3', to: '5,3', type: 'average' },
    { from: '3,3', to: '5,3', type: 'average' },
    { from: '4,3', to: '5,3', type: 'average' },
    { from: '0,4', to: '5,4', type: 'sum' },
    { from: '1,4', to: '5,4', type: 'sum' },
    { from: '2,4', to: '5,4', type: 'sum' },
    { from: '3,4', to: '5,4', type: 'sum' },
    { from: '4,4', to: '5,4', type: 'sum' }
  ]
};

export const financialSkeletonConfig = {
  rows: 8,
  columns: 6,
  headers: ['Concepto', 'Enero', 'Febrero', 'Marzo', 'Q1 Total', 'Promedio'],
  formulas: {
    '0,4': { 
      type: 'sum', 
      source: ['0,1', '0,2', '0,3'], 
      color: '#ff6b6b',
      description: 'Total Q1'
    },
    '1,4': { 
      type: 'sum', 
      source: ['1,1', '1,2', '1,3'], 
      color: '#4ecdc4',
      description: 'Total Q1'
    },
    '2,4': { 
      type: 'sum', 
      source: ['2,1', '2,2', '2,3'], 
      color: '#45b7d1',
      description: 'Total Q1'
    },
    '3,4': { 
      type: 'sum', 
      source: ['3,1', '3,2', '3,3'], 
      color: '#f39c12',
      description: 'Total Q1'
    },
    '4,4': { 
      type: 'sum', 
      source: ['4,1', '4,2', '4,3'], 
      color: '#9b59b6',
      description: 'Total Q1'
    },
    '5,4': { 
      type: 'sum', 
      source: ['5,1', '5,2', '5,3'], 
      color: '#e74c3c',
      description: 'Total Q1'
    },
    '6,4': { 
      type: 'sum', 
      source: ['6,1', '6,2', '6,3'], 
      color: '#27ae60',
      description: 'Total Q1'
    },
    '7,4': { 
      type: 'sum', 
      source: ['0,4', '1,4', '2,4', '3,4', '4,4', '5,4', '6,4'], 
      color: '#f1c40f',
      description: 'Total General'
    },
    '0,5': { 
      type: 'average', 
      source: ['0,1', '0,2', '0,3'], 
      color: '#e67e22',
      description: 'Promedio mensual'
    },
    '1,5': { 
      type: 'average', 
      source: ['1,1', '1,2', '1,3'], 
      color: '#8e44ad',
      description: 'Promedio mensual'
    },
    '2,5': { 
      type: 'average', 
      source: ['2,1', '2,2', '2,3'], 
      color: '#16a085',
      description: 'Promedio mensual'
    },
    '3,5': { 
      type: 'average', 
      source: ['3,1', '3,2', '3,3'], 
      color: '#c0392b',
      description: 'Promedio mensual'
    },
    '4,5': { 
      type: 'average', 
      source: ['4,1', '4,2', '4,3'], 
      color: '#2980b9',
      description: 'Promedio mensual'
    },
    '5,5': { 
      type: 'average', 
      source: ['5,1', '5,2', '5,3'], 
      color: '#d35400',
      description: 'Promedio mensual'
    },
    '6,5': { 
      type: 'average', 
      source: ['6,1', '6,2', '6,3'], 
      color: '#7f8c8d',
      description: 'Promedio mensual'
    }
  },
  connections: [
    { from: '0,1', to: '0,4', type: 'sum' },
    { from: '0,2', to: '0,4', type: 'sum' },
    { from: '0,3', to: '0,4', type: 'sum' },
    { from: '1,1', to: '1,4', type: 'sum' },
    { from: '1,2', to: '1,4', type: 'sum' },
    { from: '1,3', to: '1,4', type: 'sum' },
    { from: '2,1', to: '2,4', type: 'sum' },
    { from: '2,2', to: '2,4', type: 'sum' },
    { from: '2,3', to: '2,4', type: 'sum' },
    { from: '3,1', to: '3,4', type: 'sum' },
    { from: '3,2', to: '3,4', type: 'sum' },
    { from: '3,3', to: '3,4', type: 'sum' },
    { from: '4,1', to: '4,4', type: 'sum' },
    { from: '4,2', to: '4,4', type: 'sum' },
    { from: '4,3', to: '4,4', type: 'sum' },
    { from: '5,1', to: '5,4', type: 'sum' },
    { from: '5,2', to: '5,4', type: 'sum' },
    { from: '5,3', to: '5,4', type: 'sum' },
    { from: '6,1', to: '6,4', type: 'sum' },
    { from: '6,2', to: '6,4', type: 'sum' },
    { from: '6,3', to: '6,4', type: 'sum' },
    { from: '0,1', to: '0,5', type: 'average' },
    { from: '0,2', to: '0,5', type: 'average' },
    { from: '0,3', to: '0,5', type: 'average' },
    { from: '1,1', to: '1,5', type: 'average' },
    { from: '1,2', to: '1,5', type: 'average' },
    { from: '1,3', to: '1,5', type: 'average' },
    { from: '2,1', to: '2,5', type: 'average' },
    { from: '2,2', to: '2,5', type: 'average' },
    { from: '2,3', to: '2,5', type: 'average' },
    { from: '3,1', to: '3,5', type: 'average' },
    { from: '3,2', to: '3,5', type: 'average' },
    { from: '3,3', to: '3,5', type: 'average' },
    { from: '4,1', to: '4,5', type: 'average' },
    { from: '4,2', to: '4,5', type: 'average' },
    { from: '4,3', to: '4,5', type: 'average' },
    { from: '5,1', to: '5,5', type: 'average' },
    { from: '5,2', to: '5,5', type: 'average' },
    { from: '5,3', to: '5,5', type: 'average' },
    { from: '6,1', to: '6,5', type: 'average' },
    { from: '6,2', to: '6,5', type: 'average' },
    { from: '6,3', to: '6,5', type: 'average' },
    { from: '0,4', to: '7,4', type: 'sum' },
    { from: '1,4', to: '7,4', type: 'sum' },
    { from: '2,4', to: '7,4', type: 'sum' },
    { from: '3,4', to: '7,4', type: 'sum' },
    { from: '4,4', to: '7,4', type: 'sum' },
    { from: '5,4', to: '7,4', type: 'sum' },
    { from: '6,4', to: '7,4', type: 'sum' }
  ]
}


export const modernSkeletonConfig = {
  rows: 10,
  columns: 8,
  headers: ['Proyecto', 'Presupuesto', 'Gastos Q1', 'Gastos Q2', 'Gastos Q3', 'Gastos Q4', 'Total Gastos', 'Balance'],
  formulas: {
    '0,6': { 
      type: 'sum', 
      source: ['0,2', '0,3', '0,4', '0,5'], 
      color: '#ff6b6b',
      description: 'Total Gastos Anuales'
    },
    '1,6': { 
      type: 'sum', 
      source: ['1,2', '1,3', '1,4', '1,5'], 
      color: '#4ecdc4',
      description: 'Total Gastos Anuales'
    },
    '2,6': { 
      type: 'sum', 
      source: ['2,2', '2,3', '2,4', '2,5'], 
      color: '#45b7d1',
      description: 'Total Gastos Anuales'
    },
    '3,6': { 
      type: 'sum', 
      source: ['3,2', '3,3', '3,4', '3,5'], 
      color: '#f39c12',
      description: 'Total Gastos Anuales'
    },
    '4,6': { 
      type: 'sum', 
      source: ['4,2', '4,3', '4,4', '4,5'], 
      color: '#9b59b6',
      description: 'Total Gastos Anuales'
    },
    '5,6': { 
      type: 'sum', 
      source: ['5,2', '5,3', '5,4', '5,5'], 
      color: '#e74c3c',
      description: 'Total Gastos Anuales'
    },
    '6,6': { 
      type: 'sum', 
      source: ['6,2', '6,3', '6,4', '6,5'], 
      color: '#27ae60',
      description: 'Total Gastos Anuales'
    },
    '7,6': { 
      type: 'sum', 
      source: ['7,2', '7,3', '7,4', '7,5'], 
      color: '#3498db',
      description: 'Total Gastos Anuales'
    },
    '8,6': { 
      type: 'sum', 
      source: ['8,2', '8,3', '8,4', '8,5'], 
      color: '#1abc9c',
      description: 'Total Gastos Anuales'
    },
    '9,6': { 
      type: 'sum', 
      source: ['9,2', '9,3', '9,4', '9,5'], 
      color: '#34495e',
      description: 'Total Gastos Anuales'
    },
    '0,7': { 
      type: 'subtract', 
      source: ['0,1', '0,6'], 
      color: '#e67e22',
      description: 'Presupuesto - Gastos'
    },
    '1,7': { 
      type: 'subtract', 
      source: ['1,1', '1,6'], 
      color: '#8e44ad',
      description: 'Presupuesto - Gastos'
    },
    '2,7': { 
      type: 'subtract', 
      source: ['2,1', '2,6'], 
      color: '#16a085',
      description: 'Presupuesto - Gastos'
    },
    '3,7': { 
      type: 'subtract', 
      source: ['3,1', '3,6'], 
      color: '#c0392b',
      description: 'Presupuesto - Gastos'
    },
    '4,7': { 
      type: 'subtract', 
      source: ['4,1', '4,6'], 
      color: '#2980b9',
      description: 'Presupuesto - Gastos'
    },
    '5,7': { 
      type: 'subtract', 
      source: ['5,1', '5,6'], 
      color: '#d35400',
      description: 'Presupuesto - Gastos'
    },
    '6,7': { 
      type: 'subtract', 
      source: ['6,1', '6,6'], 
      color: '#7f8c8d',
      description: 'Presupuesto - Gastos'
    },
    '7,7': { 
      type: 'subtract', 
      source: ['7,1', '7,6'], 
      color: '#f1c40f',
      description: 'Presupuesto - Gastos'
    },
    '8,7': { 
      type: 'subtract', 
      source: ['8,1', '8,6'], 
      color: '#e74c3c',
      description: 'Presupuesto - Gastos'
    },
    '9,7': { 
      type: 'subtract', 
      source: ['9,1', '9,6'], 
      color: '#2c3e50',
      description: 'Presupuesto - Gastos'
    },
    '9,1': { 
      type: 'sum', 
      source: ['0,1', '1,1', '2,1', '3,1', '4,1', '5,1', '6,1', '7,1', '8,1'], 
      color: '#95a5a6',
      description: 'Total Presupuesto'
    },
    '9,2': { 
      type: 'sum', 
      source: ['0,2', '1,2', '2,2', '3,2', '4,2', '5,2', '6,2', '7,2', '8,2'], 
      color: '#95a5a6',
      description: 'Total Q1'
    },
    '9,3': { 
      type: 'sum', 
      source: ['0,3', '1,3', '2,3', '3,3', '4,3', '5,3', '6,3', '7,3', '8,3'], 
      color: '#95a5a6',
      description: 'Total Q2'
    },
    '9,4': { 
      type: 'sum', 
      source: ['0,4', '1,4', '2,4', '3,4', '4,4', '5,4', '6,4', '7,4', '8,4'], 
      color: '#95a5a6',
      description: 'Total Q3'
    },
    '9,5': { 
      type: 'sum', 
      source: ['0,5', '1,5', '2,5', '3,5', '4,5', '5,5', '6,5', '7,5', '8,5'], 
      color: '#95a5a6',
      description: 'Total Q4'
    },
    '9,6': { 
      type: 'sum', 
      source: ['0,6', '1,6', '2,6', '3,6', '4,6', '5,6', '6,6', '7,6', '8,6'], 
      color: '#95a5a6',
      description: 'Total Gastos'
    },
    '9,7': { 
      type: 'sum', 
      source: ['0,7', '1,7', '2,7', '3,7', '4,7', '5,7', '6,7', '7,7', '8,7'], 
      color: '#95a5a6',
      description: 'Balance Total'
    }
  },
  connections: [
    { from: '0,2', to: '0,6', type: 'sum' },
    { from: '0,3', to: '0,6', type: 'sum' },
    { from: '0,4', to: '0,6', type: 'sum' },
    { from: '0,5', to: '0,6', type: 'sum' },
    { from: '1,2', to: '1,6', type: 'sum' },
    { from: '1,3', to: '1,6', type: 'sum' },
    { from: '1,4', to: '1,6', type: 'sum' },
    { from: '1,5', to: '1,6', type: 'sum' },
    { from: '2,2', to: '2,6', type: 'sum' },
    { from: '2,3', to: '2,6', type: 'sum' },
    { from: '2,4', to: '2,6', type: 'sum' },
    { from: '2,5', to: '2,6', type: 'sum' },
    { from: '3,2', to: '3,6', type: 'sum' },
    { from: '3,3', to: '3,6', type: 'sum' },
    { from: '3,4', to: '3,6', type: 'sum' },
    { from: '3,5', to: '3,6', type: 'sum' },
    { from: '4,2', to: '4,6', type: 'sum' },
    { from: '4,3', to: '4,6', type: 'sum' },
    { from: '4,4', to: '4,6', type: 'sum' },
    { from: '4,5', to: '4,6', type: 'sum' },
    { from: '5,2', to: '5,6', type: 'sum' },
    { from: '5,3', to: '5,6', type: 'sum' },
    { from: '5,4', to: '5,6', type: 'sum' },
    { from: '5,5', to: '5,6', type: 'sum' },
    { from: '6,2', to: '6,6', type: 'sum' },
    { from: '6,3', to: '6,6', type: 'sum' },
    { from: '6,4', to: '6,6', type: 'sum' },
    { from: '6,5', to: '6,6', type: 'sum' },
    { from: '7,2', to: '7,6', type: 'sum' },
    { from: '7,3', to: '7,6', type: 'sum' },
    { from: '7,4', to: '7,6', type: 'sum' },
    { from: '7,5', to: '7,6', type: 'sum' },
    { from: '8,2', to: '8,6', type: 'sum' },
    { from: '8,3', to: '8,6', type: 'sum' },
    { from: '8,4', to: '8,6', type: 'sum' },
    { from: '8,5', to: '8,6', type: 'sum' },
    { from: '9,2', to: '9,6', type: 'sum' },
    { from: '9,3', to: '9,6', type: 'sum' },
    { from: '9,4', to: '9,6', type: 'sum' },
    { from: '9,5', to: '9,6', type: 'sum' },
    { from: '0,1', to: '0,7', type: 'subtract' },
    { from: '0,6', to: '0,7', type: 'subtract' },
    { from: '1,1', to: '1,7', type: 'subtract' },
    { from: '1,6', to: '1,7', type: 'subtract' },
    { from: '2,1', to: '2,7', type: 'subtract' },
    { from: '2,6', to: '2,7', type: 'subtract' },
    { from: '3,1', to: '3,7', type: 'subtract' },
    { from: '3,6', to: '3,7', type: 'subtract' },
    { from: '4,1', to: '4,7', type: 'subtract' },
    { from: '4,6', to: '4,7', type: 'subtract' },
    { from: '5,1', to: '5,7', type: 'subtract' },
    { from: '5,6', to: '5,7', type: 'subtract' },
    { from: '6,1', to: '6,7', type: 'subtract' },
    { from: '6,6', to: '6,7', type: 'subtract' },
    { from: '7,1', to: '7,7', type: 'subtract' },
    { from: '7,6', to: '7,7', type: 'subtract' },
    { from: '8,1', to: '8,7', type: 'subtract' },
    { from: '8,6', to: '8,7', type: 'subtract' },
    { from: '9,1', to: '9,7', type: 'subtract' },
    { from: '9,6', to: '9,7', type: 'subtract' },
    { from: '0,1', to: '9,1', type: 'sum' },
    { from: '1,1', to: '9,1', type: 'sum' },
    { from: '2,1', to: '9,1', type: 'sum' },
    { from: '3,1', to: '9,1', type: 'sum' },
    { from: '4,1', to: '9,1', type: 'sum' },
    { from: '5,1', to: '9,1', type: 'sum' },
    { from: '6,1', to: '9,1', type: 'sum' },
    { from: '7,1', to: '9,1', type: 'sum' },
    { from: '8,1', to: '9,1', type: 'sum' },
    { from: '0,2', to: '9,2', type: 'sum' },
    { from: '1,2', to: '9,2', type: 'sum' },
    { from: '2,2', to: '9,2', type: 'sum' },
    { from: '3,2', to: '9,2', type: 'sum' },
    { from: '4,2', to: '9,2', type: 'sum' },
    { from: '5,2', to: '9,2', type: 'sum' },
    { from: '6,2', to: '9,2', type: 'sum' },
    { from: '7,2', to: '9,2', type: 'sum' },
    { from: '8,2', to: '9,2', type: 'sum' },
    { from: '0,3', to: '9,3', type: 'sum' },
    { from: '1,3', to: '9,3', type: 'sum' },
    { from: '2,3', to: '9,3', type: 'sum' },
    { from: '3,3', to: '9,3', type: 'sum' },
    { from: '4,3', to: '9,3', type: 'sum' },
    { from: '5,3', to: '9,3', type: 'sum' },
    { from: '6,3', to: '9,3', type: 'sum' },
    { from: '7,3', to: '9,3', type: 'sum' },
    { from: '8,3', to: '9,3', type: 'sum' },
    { from: '0,4', to: '9,4', type: 'sum' },
    { from: '1,4', to: '9,4', type: 'sum' },
    { from: '2,4', to: '9,4', type: 'sum' },
    { from: '3,4', to: '9,4', type: 'sum' },
    { from: '4,4', to: '9,4', type: 'sum' },
    { from: '5,4', to: '9,4', type: 'sum' },
    { from: '6,4', to: '9,4', type: 'sum' },
    { from: '7,4', to: '9,4', type: 'sum' },
    { from: '8,4', to: '9,4', type: 'sum' },
    { from: '0,5', to: '9,5', type: 'sum' },
    { from: '1,5', to: '9,5', type: 'sum' },
    { from: '2,5', to: '9,5', type: 'sum' },
    { from: '3,5', to: '9,5', type: 'sum' },
    { from: '4,5', to: '9,5', type: 'sum' },
    { from: '5,5', to: '9,5', type: 'sum' },
    { from: '6,5', to: '9,5', type: 'sum' },
    { from: '7,5', to: '9,5', type: 'sum' },
    { from: '8,5', to: '9,5', type: 'sum' },
    { from: '0,6', to: '9,6', type: 'sum' },
    { from: '1,6', to: '9,6', type: 'sum' },
    { from: '2,6', to: '9,6', type: 'sum' },
    { from: '3,6', to: '9,6', type: 'sum' },
    { from: '4,6', to: '9,6', type: 'sum' },
    { from: '5,6', to: '9,6', type: 'sum' },
    { from: '6,6', to: '9,6', type: 'sum' },
    { from: '7,6', to: '9,6', type: 'sum' },
    { from: '8,6', to: '9,6', type: 'sum' },
    { from: '0,7', to: '9,7', type: 'sum' },
    { from: '1,7', to: '9,7', type: 'sum' },
    { from: '2,7', to: '9,7', type: 'sum' },
    { from: '3,7', to: '9,7', type: 'sum' },
    { from: '4,7', to: '9,7', type: 'sum' },
    { from: '5,7', to: '9,7', type: 'sum' },
    { from: '6,7', to: '9,7', type: 'sum' },
    { from: '7,7', to: '9,7', type: 'sum' },
    { from: '8,7', to: '9,7', type: 'sum' }
  ]
};

export const mixedTablesSkeletonConfig = {
  rows: 8,
  columns: 6,
  headers: ['Tabla 1', 'Tabla 2', 'Resultado', 'Skeleton 1', 'Skeleton 2', 'Skeleton 3'],
  formulas: {
    '0,2': { 
      type: 'sum', 
      source: ['0,0', '0,1'], 
      color: '#ff6b6b',
      description: 'Suma Tabla 1 + Tabla 2'
    },
    '1,2': { 
      type: 'sum', 
      source: ['1,0', '1,1'], 
      color: '#ff6b6b',
      description: 'Suma Tabla 1 + Tabla 2'
    },
    '2,2': { 
      type: 'sum', 
      source: ['2,0', '2,1'], 
      color: '#ff6b6b',
      description: 'Suma Tabla 1 + Tabla 2'
    },
    '3,2': { 
      type: 'sum', 
      source: ['3,0', '3,1'], 
      color: '#ff6b6b',
      description: 'Suma Tabla 1 + Tabla 2'
    },
    '4,2': { 
      type: 'sum', 
      source: ['4,0', '4,1'], 
      color: '#ff6b6b',
      description: 'Suma Tabla 1 + Tabla 2'
    },
    '5,2': { 
      type: 'sum', 
      source: ['5,0', '5,1'], 
      color: '#ff6b6b',
      description: 'Suma Tabla 1 + Tabla 2'
    },
    '6,2': { 
      type: 'sum', 
      source: ['6,0', '6,1'], 
      color: '#ff6b6b',
      description: 'Suma Tabla 1 + Tabla 2'
    },
    '7,2': { 
      type: 'sum', 
      source: ['7,0', '7,1'], 
      color: '#ff6b6b',
      description: 'Suma Tabla 1 + Tabla 2'
    },
    '7,3': { 
      type: 'average', 
      source: ['0,2', '1,2', '2,2', '3,2', '4,2', '5,2', '6,2', '7,2'], 
      color: '#4ecdc4',
      description: 'Promedio de Datos Nuevos'
    }
  },
  connections: [
    { from: '0,0', to: '0,2', type: 'sum' },
    { from: '1,0', to: '1,2', type: 'sum' },
    { from: '2,0', to: '2,2', type: 'sum' },
    { from: '3,0', to: '3,2', type: 'sum' },
    { from: '4,0', to: '4,2', type: 'sum' },
    { from: '5,0', to: '5,2', type: 'sum' },
    { from: '6,0', to: '6,2', type: 'sum' },
    { from: '7,0', to: '7,2', type: 'sum' },
    { from: '0,1', to: '0,2', type: 'sum' },
    { from: '1,1', to: '1,2', type: 'sum' },
    { from: '2,1', to: '2,2', type: 'sum' },
    { from: '3,1', to: '3,2', type: 'sum' },
    { from: '4,1', to: '4,2', type: 'sum' },
    { from: '5,1', to: '5,2', type: 'sum' },
    { from: '6,1', to: '6,2', type: 'sum' },
    { from: '7,1', to: '7,2', type: 'sum' },
    { from: '0,2', to: '7,3', type: 'average' },
    { from: '1,2', to: '7,3', type: 'average' },
    { from: '2,2', to: '7,3', type: 'average' },
    { from: '3,2', to: '7,3', type: 'average' },
    { from: '4,2', to: '7,3', type: 'average' },
    { from: '5,2', to: '7,3', type: 'average' },
    { from: '6,2', to: '7,3', type: 'average' },
    { from: '7,2', to: '7,3', type: 'average' }
  ]
};

export const createSkeletonConfig = (rows, columns, headers, formulas, connections) => {
  return {
    rows,
    columns,
    headers,
    formulas,
    connections
  };
};

export const generateAutoSkeletonConfig = (rows, columns, headers) => {
  const formulas = {};
  const connections = [];
  
  for (let row = 0; row < rows - 1; row++) {
    const formulaKey = `${row},${columns - 1}`;
    const sources = [];
    
    for (let col = 1; col < columns - 1; col++) {
      sources.push(`${row},${col}`);
      connections.push({
        from: `${row},${col}`,
        to: formulaKey,
        type: 'sum'
      });
    }
    
    formulas[formulaKey] = {
      type: 'sum',
      source: sources,
      color: `hsl(${(row * 60) % 360}, 70%, 60%)`,
      description: `Total fila ${row + 1}`
    };
  }
  
  return {
    rows,
    columns,
    headers,
    formulas,
    connections
  };
}; 