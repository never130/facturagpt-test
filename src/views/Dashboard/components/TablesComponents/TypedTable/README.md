# TableSkeleton Component

Un componente de skeleton de tabla avanzado que simula el proceso de combinar tablas con fórmulas, con efectos visuales de gradiente animado y configuración mediante JSON.

## 🚀 Características

- ✅ **Efectos de gradiente animado** en cada fila
- ✅ **Líneas de conexión animadas** entre celdas
- ✅ **Fórmulas configurables** mediante JSON
- ✅ **Interactividad** con clicks en celdas
- ✅ **Panel de fórmulas** expandible
- ✅ **Diseño responsive**
- ✅ **Efectos visuales** de selección
- ✅ **Múltiples tipos de fórmulas** soportadas

## 📦 Instalación

El componente ya está integrado en el proyecto. Para usarlo:

```jsx
import TableSkeleton from './TableSkeleton';
import { basicSkeletonConfig } from './skeletonConfigs';
```

## 🎯 Uso Básico

```jsx
import React from 'react';
import TableSkeleton from './TableSkeleton';
import { basicSkeletonConfig } from './skeletonConfigs';

function MyComponent() {
  const handleCellClick = (rowIndex, colIndex, cellKey) => {
    console.log(`Celda clickeada: ${cellKey}`);
  };

  const handleFormulaApply = (formula) => {
    console.log('Fórmula aplicada:', formula);
  };

  return (
    <TableSkeleton
      skeletonConfig={basicSkeletonConfig}
      onCellClick={handleCellClick}
      onFormulaApply={handleFormulaApply}
      isAnimating={true}
    />
  );
}
```

## 🔧 Integración con TypedTable

El componente está integrado en `TypedTable.jsx` y se activa automáticamente cuando el tipo de tabla es `'skeleton'`. Para usarlo:

### Opción 1: Crear una tabla con tipo 'skeleton'
```jsx
import { createSkeletonTable, basicSkeletonConfig } from './skeletonConfigs';

const skeletonTable = createSkeletonTable(basicSkeletonConfig);

// Luego usar TypedTable normalmente
<TypedTable
  table={skeletonTable}
  skeletonConfig={basicSkeletonConfig}
  onSkeletonCellClick={handleCellClick}
  onSkeletonFormulaApply={handleFormulaApply}
  // ... otras props
/>
```

### Opción 2: Usar directamente con tipo 'skeleton'
```jsx
const table = {
  _id: 'my-skeleton-table',
  type: 'skeleton',
  name: 'Mi Tabla de Combinaciones',
  headers: ['Columna 1', 'Columna 2', 'Total']
};

<TypedTable
  table={table}
  skeletonConfig={basicSkeletonConfig}
  onSkeletonCellClick={handleCellClick}
  onSkeletonFormulaApply={handleFormulaApply}
  // ... otras props
/>
```

## 📋 Estructura JSON

### Configuración Básica

```json
{
  "rows": 5,
  "columns": 4,
  "headers": ["Columna 1", "Columna 2", "Columna 3", "Total"],
  "formulas": {
    "2,3": {
      "type": "sum",
      "source": ["0,3", "1,3"],
      "color": "#ff6b6b",
      "description": "Suma de totales"
    }
  },
  "connections": [
    {
      "from": "0,3",
      "to": "2,3",
      "type": "sum"
    }
  ]
}
```

### Propiedades de Configuración

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `rows` | number | Número de filas en la tabla |
| `columns` | number | Número de columnas en la tabla |
| `headers` | string[] | Array de encabezados de columnas |
| `formulas` | object | Objeto con fórmulas por celda |
| `connections` | array | Array de conexiones entre celdas |

### Estructura de Fórmulas

```json
{
  "fila,columna": {
    "type": "sum|average|multiply|count|max|min",
    "source": ["0,1", "1,1", "2,1"],
    "color": "#ff6b6b",
    "description": "Descripción de la fórmula"
  }
}
```

### Estructura de Conexiones

```json
{
  "from": "0,1",
  "to": "2,1",
  "type": "sum"
}
```

## 🎨 Tipos de Fórmulas Soportadas

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `sum` | Suma de valores | `[1, 2, 3] → 6` |
| `average` | Promedio de valores | `[1, 2, 3] → 2` |
| `multiply` | Multiplicación de valores | `[2, 3] → 6` |
| `count` | Conteo de elementos | `[1, 2, 3] → 3` |
| `max` | Valor máximo | `[1, 5, 3] → 5` |
| `min` | Valor mínimo | `[1, 5, 3] → 1` |

## 🎯 Configuraciones Predefinidas

### 1. Configuración Básica
```jsx
import { basicSkeletonConfig } from './skeletonConfigs';
```
- 5 filas × 4 columnas
- Fórmulas de multiplicación y suma
- Ideal para tablas de productos/precios

### 2. Configuración Avanzada
```jsx
import { advancedSkeletonConfig } from './skeletonConfigs';
```
- 6 filas × 5 columnas
- Múltiples tipos de fórmulas
- Ideal para reportes trimestrales

### 3. Configuración Financiera
```jsx
import { financialSkeletonConfig } from './skeletonConfigs';
```
- 8 filas × 6 columnas
- Fórmulas complejas de totales y promedios
- Ideal para reportes financieros

## 🔧 Generación Automática

Para crear configuraciones automáticamente:

```jsx
import { generateAutoSkeletonConfig } from './skeletonConfigs';

const autoConfig = generateAutoSkeletonConfig(
  5, // filas
  4, // columnas
  ['Producto', 'Precio', 'Cantidad', 'Total'] // headers
);
```

## 🎨 Personalización de Estilos

### Colores de Fórmulas

Cada fórmula puede tener su propio color:

```json
{
  "formulas": {
    "2,3": {
      "type": "sum",
      "source": ["0,3", "1,3"],
      "color": "#ff6b6b", // Color personalizado
      "description": "Suma de totales"
    }
  }
}
```

### Paleta de Colores Sugerida

- 🔴 Rojo: `#ff6b6b` - Para sumas
- 🔵 Azul: `#4ecdc4` - Para promedios
- 🟡 Amarillo: `#f39c12` - Para multiplicaciones
- 🟣 Púrpura: `#9b59b6` - Para conteos
- 🟢 Verde: `#27ae60` - Para máximos
- 🟠 Naranja: `#e67e22` - Para mínimos

## 🎭 Efectos Visuales

### Animaciones Incluidas

1. **Gradiente Animado**: Cada fila tiene un efecto de gradiente que se mueve
2. **Líneas de Conexión**: Líneas punteadas animadas entre celdas relacionadas
3. **Efecto Shimmer**: Efecto de brillo en celdas vacías
4. **Hover Effects**: Efectos al pasar el mouse sobre las celdas
5. **Selección**: Efectos visuales al seleccionar celdas

### Personalización de Animaciones

```css
/* En TableSkeleton.module.css */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}
```

## 📱 Responsive Design

El componente es completamente responsive y se adapta a diferentes tamaños de pantalla:

- **Desktop**: Diseño completo con todas las características
- **Tablet**: Ajustes de tamaño y espaciado
- **Mobile**: Diseño optimizado para pantallas pequeñas

## 🔄 Eventos y Callbacks

### onCellClick
```jsx
const handleCellClick = (rowIndex, colIndex, cellKey) => {
  console.log(`Celda: ${cellKey} (${rowIndex}, ${colIndex})`);
};
```

### onFormulaApply
```jsx
const handleFormulaApply = (formula) => {
  console.log('Fórmula:', formula.type);
  console.log('Fuentes:', formula.source);
  console.log('Descripción:', formula.description);
};
```

## 🧪 Demostración

Para ver una demostración completa del componente:

```jsx
import SkeletonDemo from './SkeletonDemo';

function App() {
  return <SkeletonDemo />;
}
```

## 🐛 Solución de Problemas

### Problema: Las animaciones no funcionan
**Solución**: Verifica que `isAnimating={true}` esté configurado.

### Problema: Las líneas de conexión no aparecen
**Solución**: Asegúrate de que el array `connections` esté correctamente definido.

### Problema: Los colores no se aplican
**Solución**: Verifica que los colores estén en formato hexadecimal válido.

## 📈 Próximas Mejoras

- [ ] Soporte para fórmulas más complejas
- [ ] Exportación de configuraciones
- [ ] Integración con bases de datos
- [ ] Más tipos de animaciones
- [ ] Soporte para temas personalizados

## 🤝 Contribución

Para contribuir al componente:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa los cambios
4. Añade tests si es necesario
5. Envía un pull request

## 📄 Licencia

Este componente es parte del proyecto FacturaGPT y está bajo la misma licencia. 