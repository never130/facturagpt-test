# RelationshipsFormulas - Drag and Drop

Este componente implementa un sistema de drag and drop usando dnd-kit para permitir reorganizar las relaciones de base de datos de manera intuitiva.

## Características

- **Drag and Drop Intuitivo**: Usa el icono de grab (IconGrab) para arrastrar relationships
- **Reorganización de Niveles**: Permite mover relationships entre diferentes niveles de anidación
- **Actualización Automática de Niveles**: Los niveles se actualizan automáticamente al mover relationships
- **Indicadores Visuales**: Muestra claramente dónde se puede soltar un relationship
- **Responsive**: Funciona en dispositivos móviles y de escritorio

## Cómo Usar

### 1. Arrastrar un Relationship
- Haz clic y mantén presionado el icono de grab (IconGrab) en cualquier relationship
- Arrastra el relationship a la ubicación deseada

### 2. Soltar en Otro Relationship
- Arrastra un relationship sobre otro
- Aparecerá un indicador visual verde que muestra "📥 Soltar aquí"
- Suelta para mover el relationship dentro del objetivo

### 3. Cambiar Niveles
- Un relationship de nivel 2 puede moverse dentro de un relationship de nivel 3
- Al hacerlo, el relationship movido se convierte en nivel 4
- Los niveles se actualizan automáticamente

## Estructura de Datos

Cada relationship tiene la siguiente estructura:

```javascript
{
  id: "unique-id",
  level: 1, // Nivel de anidación
  selectedOption: "length", // Opción seleccionada
  children: [] // Array de relationships hijos
}
```

## Funcionalidades

### moveRelationship(draggedId, targetId)
- Encuentra el relationship arrastrado por su ID
- Lo remueve de su ubicación actual
- Lo agrega como hijo del relationship objetivo
- Actualiza todos los niveles recursivamente

### Indicadores Visuales
- **Grab Handle**: Icono de grab que permite arrastrar
- **Drop Zone**: Zona verde punteada que indica dónde soltar
- **Level Colors**: Diferentes colores para cada nivel de anidación
- **Hover Effects**: Efectos visuales al pasar el mouse

## Estilos CSS

El componente usa CSS Modules con las siguientes clases principales:

- `.relationship`: Estilo base para cada relationship
- `.relationshipLevel1-5`: Estilos específicos para cada nivel
- `.grabHandle`: Estilo para el icono de grab
- `.dropIndicator`: Indicador visual para la zona de drop
- `.relationshipHeader`: Encabezado de cada relationship

## Dependencias

- `@dnd-kit/core`: Funcionalidad principal de drag and drop
- `@dnd-kit/sortable`: Ordenamiento de elementos
- `@dnd-kit/utilities`: Utilidades CSS para transformaciones

## Ejemplo de Uso

```jsx
<RelationshipsFormulas
  parameterData={parameterData}
  handleChange={handleChange}
/>
```

## Notas Importantes

- Solo las relationships de nivel 2 en adelante pueden ser arrastradas
- La relationship principal (nivel 1) no puede ser movida
- Los IDs se generan automáticamente si no existen
- Los cambios se sincronizan automáticamente con el estado padre
