# Sistema de Selección Visual Interactiva para Scraping

## Descripción General

El sistema de selección visual interactiva permite a los usuarios seleccionar elementos directamente en la página web de forma manual y precisa, evitando problemas con popups y elementos dinámicos que pueden romper el scraping automático.

## Características Principales

### 🎯 Selección Manual Preciso
- **Overlay interactivo**: Se crea una capa transparente sobre la página web
- **Resaltado visual**: Los elementos se resaltan al pasar el mouse
- **Selección con clic**: Un clic selecciona el elemento deseado
- **Indicadores visuales**: Cada elemento seleccionado se marca con un número

### 🔄 Configuraciones Reutilizables
- **Templates guardados**: Las selecciones se guardan como plantillas
- **Reutilización**: Se pueden aplicar las mismas selecciones a otras páginas
- **Edición**: Modificar elementos seleccionados después de guardar

### 🎨 Extracción de Favicon
- **Detección automática**: Busca favicons en ubicaciones comunes
- **Fallback inteligente**: Extrae del HTML si no se encuentra en ubicaciones estándar
- **Múltiples formatos**: Soporta .ico, .png, apple-touch-icon

### 📊 Información Completa de Elementos
- **Selectores únicos**: Genera selectores CSS precisos
- **Atributos importantes**: Captura title, alt, data-*, aria-*
- **Estilos computados**: Color, fuente, posición, etc.
- **Coordenadas**: Posición exacta en la página

## Flujo de Trabajo

### 1. Configuración Inicial
```
Usuario → Introduce URL → Sistema carga página → Crea overlay
```

### 2. Selección de Elementos
```
Usuario → Activa selección → Pasa mouse → Ve resaltado → Hace clic → Elemento seleccionado
```

### 3. Guardado y Reutilización
```
Usuario → Revisa selecciones → Guarda template → Puede reutilizar en otras páginas
```

## Estructura Técnica

### Backend (Node.js + Playwright)

#### `performVisualScraping()`
- Abre navegador en modo visible (`headless: false`)
- Navega a la URL especificada
- Crea overlay de selección con JavaScript inyectado
- Maneja la comunicación entre frontend y backend

#### `createSelectionOverlay()`
- Inyecta JavaScript en la página
- Crea overlay transparente
- Implementa event listeners para mouse
- Genera selectores únicos para cada elemento

#### `getFavicon()`
- Busca favicon en ubicaciones estándar
- Extrae del HTML como fallback
- Maneja URLs relativas y absolutas

### Frontend (React)

#### `VisualSelectionState`
- Interfaz para configurar URL
- Controles para activar/desactivar selección
- Lista de elementos seleccionados
- Funciones para guardar y editar

#### Estados Principales
```javascript
const [visualSelectionMode, setVisualSelectionMode] = useState(false);
const [selectedElements, setSelectedElements] = useState([]);
const [pageInfo, setPageInfo] = useState(null);
const [favicon, setFavicon] = useState(null);
```

## API Endpoints

### POST `/api/scraping/visual`
Inicia el proceso de selección visual

**Request:**
```json
{
  "websiteUrl": "https://ejemplo.com",
  "userId": "user123",
  "agentId": "agent456",
  "chatId": "chat789"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://ejemplo.com",
    "favicon": "https://ejemplo.com/favicon.ico",
    "pageInfo": {
      "title": "Título de la página",
      "description": "Descripción...",
      "keywords": "palabras, clave"
    },
    "selectedElements": [],
    "screenshot": "base64...",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST `/api/scraping/template/save`
Guarda una selección visual como template

**Request:**
```json
{
  "template": {
    "name": "Selección Visual - Ejemplo",
    "description": "Descripción del template",
    "url": "https://ejemplo.com",
    "favicon": "https://ejemplo.com/favicon.ico",
    "pageInfo": {...},
    "selectedElements": [...],
    "type": "visual_selection"
  }
}
```

## Estructura de Datos

### Elemento Seleccionado
```javascript
{
  id: "unique_id",
  tagName: "div",
  selector: "body > div.container > div.content",
  text: "Texto del elemento",
  href: "https://...", // Para enlaces
  src: "https://...", // Para imágenes
  className: "class1 class2",
  id: "element_id",
  rect: {
    x: 100,
    y: 200,
    width: 300,
    height: 50
  },
  attributes: {
    "title": "Título",
    "alt": "Texto alternativo",
    "data-custom": "valor"
  },
  computedStyles: {
    color: "rgb(0, 0, 0)",
    backgroundColor: "rgb(255, 255, 255)",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif"
  }
}
```

## Ventajas del Sistema

### ✅ Precisión
- Selección manual elimina errores automáticos
- No se ve afectado por popups o elementos dinámicos
- Control total sobre qué elementos extraer

### ✅ Flexibilidad
- Cualquier elemento puede ser seleccionado
- Configuraciones reutilizables
- Fácil edición y modificación

### ✅ Experiencia de Usuario
- Interfaz intuitiva y visual
- Feedback inmediato
- Proceso paso a paso claro

### ✅ Robustez
- Manejo de errores robusto
- Fallbacks para favicons
- Compatibilidad con diferentes tipos de sitios

## Casos de Uso

### E-commerce
- Seleccionar precios, títulos, imágenes de productos
- Extraer información de reviews
- Capturar datos de disponibilidad

### Blogs/Noticias
- Extraer títulos de artículos
- Capturar fechas de publicación
- Seleccionar contenido principal

### Dashboards
- Extraer métricas específicas
- Capturar gráficos y tablas
- Seleccionar datos de KPIs

## Limitaciones y Consideraciones

### Limitaciones
- Requiere interacción manual del usuario
- No es completamente automático
- Depende de la estructura visual de la página

### Consideraciones
- Elementos dinámicos pueden cambiar posiciones
- Sitios con mucho JavaScript pueden requerir esperas
- Elementos ocultos o fuera de vista no son accesibles

## Futuras Mejoras

### Automatización Inteligente
- Detección automática de elementos importantes
- Sugerencias basadas en patrones comunes
- Aprendizaje de selecciones previas

### Integración Avanzada
- Sincronización con otros sistemas de scraping
- Exportación a diferentes formatos
- Integración con herramientas de análisis

### Experiencia de Usuario
- Tutorial interactivo
- Modo de práctica
- Sugerencias contextuales