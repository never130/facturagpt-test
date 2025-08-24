# Funcionalidad de Selección de Secciones en MessageDoc

## Descripción

Esta funcionalidad permite seleccionar secciones individuales dentro del editor de documentos con efectos visuales y actualización del estado en Redux.

## Características Principales

### 1. Selección Visual de Secciones
- **Barra verde**: Cada sección seleccionada muestra una barra verde a la izquierda
- **Efecto de resplandor**: Animación suave que indica la sección activa
- **Scroll automático**: La sección seleccionada se centra automáticamente en la vista

### 2. Estado en Redux
- **selectedSectionId**: Almacena el ID de la sección actualmente seleccionada
- **Sincronización**: El estado se actualiza automáticamente al hacer clic en una sección
- **Persistencia**: El estado se mantiene hasta que se selecciona otra sección o se limpia

### 3. Identificadores Únicos con UUIDv4
- **Generación segura**: Todos los elementos HTML usan UUIDv4 en lugar de timestamps
- **Colisiones evitadas**: Garantiza identificadores únicos en todo el documento
- **Consistencia**: Mismo sistema de IDs en creación y edición de documentos

## Implementación Técnica

### Slice de Redux (`docsSlices.js`)

```javascript
// Nuevo estado agregado
doc: {
  // ... otros estados
  selectedSectionId: null, // ID de la sección seleccionada
}

// Nueva acción
setMessageDocsSelectedSection: (state, action) => {
  state.doc.selectedSectionId = action.payload;
}
```

### Componente MessageDoc

#### Manejo de Clics en Secciones
```javascript
const handleSectionClick = (e) => {
  const section = e.target.closest('section');
  if (section && section.id) {
    dispatch(setMessageDocsSelectedSection(section.id));
    
    // Scroll suave a la sección
    section.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }
};
```

#### Aplicación Dinámica de Estilos
```javascript
useEffect(() => {
  if (editorRef.current) {
    // Remover clase selected de todas las secciones
    const allSections = editorRef.current.querySelectorAll('section');
    allSections.forEach(section => {
      section.classList.remove('selected');
    });

    // Aplicar clase selected a la sección seleccionada
    if (selectedSectionId) {
      const selectedSection = editorRef.current.querySelector(`#${selectedSectionId}`);
      if (selectedSection) {
        selectedSection.classList.add('selected');
      }
    }
  }
}, [selectedSectionId]);
```

### Estilos CSS

#### Estilos Base para Secciones
```css
.editor section {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  padding-left: 8px;
  margin: 4px 0;
}
```

#### Efectos de Hover
```css
.editor section:hover {
  background-color: rgba(22, 192, 152, 0.05);
  border-left-color: rgba(22, 192, 152, 0.3);
  transform: translateX(2px);
}
```

#### Estilos para Sección Seleccionada
```css
.editor section.selected {
  background-color: rgba(22, 192, 152, 0.1);
  border-left-color: #16c098;
  box-shadow: 0 2px 8px rgba(22, 192, 152, 0.2);
  transform: translateX(4px);
}
```

#### Animación de Resplandor
```css
.editor section.selected::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #16c098 0%, var(--_10a37f-background) 100%);
  border-radius: 2px;
  animation: sectionGlow 2s ease-in-out infinite alternate;
}

@keyframes sectionGlow {
  0% { box-shadow: 0 0 5px rgba(22, 192, 152, 0.5); }
  100% { box-shadow: 0 0 15px rgba(22, 192, 152, 0.8); }
}
```

## Generación de IDs con UUIDv4

### Antes (Date.now())
```javascript
title1: (text, id = null) => `<section id="${id || 'title1-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)}"><h1>${text}</h1></section>`
```

### Después (UUIDv4)
```javascript
title1: (text, id = null) => `<section id="${id || 'title1-' + uuidv4()}"><h1>${text}</h1></section>`
```

### Ventajas de UUIDv4
- **Unicidad garantizada**: Probabilidad de colisión prácticamente nula
- **Seguridad**: No se puede predecir o adivinar
- **Consistencia**: Mismo formato en todos los entornos
- **Rendimiento**: Generación más rápida que timestamp + random

## Uso de la Funcionalidad

### 1. Seleccionar una Sección
- Haz clic en cualquier sección del documento
- La sección se resaltará con la barra verde
- El ID de la sección se mostrará en el indicador visual
- El estado se actualizará en Redux

### 2. Navegación
- La sección seleccionada se centrará automáticamente
- Scroll suave para mejor experiencia de usuario
- Indicador visual muestra la sección actual

### 3. Estado Persistente
- La selección se mantiene hasta cambiar de sección
- Se limpia al cerrar el MessageDoc
- Se resetea al hacer refresh

## Casos de Uso

### 1. Edición Selectiva
```javascript
// Obtener la sección seleccionada
const selectedSection = useSelector(state => state.docs.doc.selectedSectionId);

// Aplicar cambios solo a esa sección
if (selectedSection) {
  // Lógica de edición específica
}
```

### 2. Navegación Programática
```javascript
// Seleccionar una sección específica
dispatch(setMessageDocsSelectedSection('section-id-123'));

// Limpiar selección
dispatch(setMessageDocsSelectedSection(null));
```

### 3. Integración con Chat
```javascript
// Sincronizar selección con el chat
const handleSectionSelect = (sectionId) => {
  dispatch(setMessageDocsSelectedSection(sectionId));
  // Enviar información al chat sobre la sección seleccionada
};
```

## Consideraciones de Rendimiento

### Optimizaciones Implementadas
- **Debounce en eventos**: Evita actualizaciones excesivas del estado
- **QuerySelector eficiente**: Usa selectores específicos para mejor rendimiento
- **Transiciones CSS**: Animaciones suaves sin impacto en JavaScript
- **Cleanup automático**: Limpieza de event listeners y estados

### Mejores Prácticas
- Usar `useCallback` para funciones de manejo de eventos
- Implementar `useEffect` con dependencias específicas
- Limpiar estados al desmontar componentes
- Usar `transform` en lugar de `left/top` para animaciones

## Compatibilidad

### Navegadores Soportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Características CSS Utilizadas
- CSS Grid y Flexbox
- CSS Custom Properties
- CSS Animations y Transitions
- Media Queries para responsive design

## Próximas Mejoras

### Funcionalidades Planificadas
1. **Selección múltiple**: Permitir seleccionar varias secciones
2. **Atajos de teclado**: Navegación con flechas y Enter
3. **Búsqueda de secciones**: Buscar por contenido o ID
4. **Historial de selecciones**: Navegar entre secciones recientes
5. **Exportación de selección**: Exportar solo la sección seleccionada

### Optimizaciones Futuras
1. **Virtualización**: Para documentos muy grandes
2. **Lazy loading**: Cargar secciones bajo demanda
3. **Caché de estados**: Persistir selecciones entre sesiones
4. **Sincronización en tiempo real**: Para colaboración múltiple 