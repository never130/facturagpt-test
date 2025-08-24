# Sistema de Scraping Dinámico

## Descripción General

El sistema de scraping dinámico permite a los usuarios crear flujos de automatización para extraer datos de páginas web de manera visual e intuitiva. El sistema incluye cuatro estados principales:

1. **Loading**: Carga de páginas web con barra de progreso
2. **Selector**: Selección visual de elementos con indicadores
3. **Template**: Editor de flujos de scraping con pasos configurables
4. **Example**: Ejecución y visualización de resultados

## Características Principales

### 🎯 Selección Visual de Elementos
- Interfaz intuitiva para seleccionar elementos en la página
- Indicadores visuales con `:after` para elementos seleccionados
- Generación automática de selectores CSS
- Configuración de condiciones y prompts para cada selector

### 📋 Editor de Templates
- Creación de flujos de scraping paso a paso
- Diferentes tipos de pasos: acciones, condiciones, bucles, variables
- Reordenamiento de pasos mediante drag & drop
- Guardado y carga de templates en CouchDB

### 🔄 Ejecución Dinámica
- Ejecución en tiempo real de templates
- Soporte para múltiples páginas y navegación
- Condiciones personalizadas usando NLP
- Bucles y variables para automatización compleja

### 💾 Persistencia de Datos
- Almacenamiento en CouchDB por usuario
- Templates reutilizables y editables
- Historial de ejecuciones
- Resultados persistentes

## Estructura del Sistema

### Frontend (React)

#### Componente Principal: `ScrapingContainer`
```jsx
<ScrapingContainer
  status="loading|selector|template|example"
  onStatusChange={(newStatus) => {}}
  onTemplateSave={(template) => {}}
  onScrapingExecute={(template) => {}}
  initialUrl="https://ejemplo.com"
  initialScreenshot={base64Image}
/>
```

#### Estados del Componente

**1. Loading State**
- Input para URL de la página
- Barra de progreso animada
- Vista previa del screenshot
- Transición automática al selector

**2. Selector State**
- Imagen de la página con overlay interactivo
- Selección visual de elementos
- Configuración de selectores con prompts
- Lista de selectores configurados

**3. Template State**
- Editor de pasos del scraping
- Diferentes tipos de pasos configurables
- Reordenamiento de pasos
- Guardado de templates

**4. Example State**
- Ejecución del template
- Visualización de resultados en tabla
- Tiempo de ejecución
- Exportación de datos

### Backend (Node.js)

#### Servicios: `app/services/meet/scraping.js`

**Funciones de Templates:**
- `saveTemplate(userId, template)` - Guardar template en CouchDB
- `loadTemplates(userId)` - Cargar todos los templates del usuario
- `loadTemplate(userId, templateId)` - Cargar template específico
- `deleteTemplate(userId, templateId)` - Eliminar template
- `executeTemplate(config)` - Ejecutar template completo

**Funciones de Ejecución:**
- `executeStep(page, step, selectors)` - Ejecutar paso individual
- `executeAction(page, step, selectors)` - Ejecutar acciones (click, extract, etc.)
- `executeCondition(page, step, selectors)` - Evaluar condiciones
- `executeLoop(page, step, selectors)` - Ejecutar bucles
- `executeVariable(page, step, selectors)` - Manejar variables

#### Rutas: `app/routers/scraping.js`

**Endpoints de Templates:**
- `POST /api/scraping/templates` - Guardar template
- `GET /api/scraping/templates` - Listar templates
- `GET /api/scraping/templates/:id` - Obtener template
- `DELETE /api/scraping/templates/:id` - Eliminar template
- `POST /api/scraping/templates/:id/execute` - Ejecutar template

**Endpoints de Scraping:**
- `POST /api/scraping/load-page` - Cargar página web
- `POST /api/scraping/extract-elements` - Extraer elementos

## Tipos de Pasos en Templates

### 1. Acciones (Action)
```javascript
{
  type: 'action',
  name: 'Hacer clic en botón',
  action: 'click|extract|navigate|wait|type|waitForElement',
  parameters: {
    selectorId: 'selector-id',
    url: 'https://ejemplo.com',
    text: 'texto a escribir',
    duration: 1000
  }
}
```

### 2. Condiciones (Condition)
```javascript
{
  type: 'condition',
  name: 'Verificar elemento existe',
  condition: 'elementExists|textContains|custom',
  parameters: {
    selectorId: 'selector-id',
    text: 'texto a buscar',
    prompt: 'condición personalizada'
  }
}
```

### 3. Bucles (Loop)
```javascript
{
  type: 'loop',
  name: 'Procesar lista de elementos',
  loopType: 'forEach|while',
  parameters: {
    selectorId: 'selector-id',
    maxIterations: 100
  },
  steps: [/* pasos a ejecutar en el bucle */]
}
```

### 4. Variables (Variable)
```javascript
{
  type: 'variable',
  name: 'Extraer precio',
  variableType: 'extract|set',
  parameters: {
    selectorId: 'selector-id',
    variableName: 'precio',
    value: 'valor fijo'
  }
}
```

## Estructura de Datos

### Template
```javascript
{
  id: 'uuid',
  name: 'Nombre del Template',
  description: 'Descripción del template',
  type: 'scraping_template',
  userId: 'user-id',
  selectors: [
    {
      id: 'selector-id',
      name: 'Nombre del selector',
      selector: 'css-selector',
      prompt: 'condición o prompt',
      type: 'text|click|wait|condition',
      position: { x, y, width, height }
    }
  ],
  steps: [
    // Array de pasos configurados
  ],
  variables: {},
  conditions: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}
```

### Resultado de Ejecución
```javascript
{
  id: 'uuid',
  templateId: 'template-id',
  templateName: 'Nombre del Template',
  results: [
    {
      stepId: 'step-id',
      stepName: 'Nombre del paso',
      success: true,
      result: { message: 'Resultado del paso' },
      timestamp: '2024-01-01T00:00:00Z'
    }
  ],
  executionTime: 2.5,
  timestamp: '2024-01-01T00:00:00Z'
}
```

## Uso del Sistema

### 1. Iniciar Scraping
```javascript
// En el ChatView
const handleStartScraping = () => {
  setScrapingStatus('loading');
};
```

### 2. Guardar Template
```javascript
const handleTemplateSave = async (template) => {
  const response = await fetch('/api/scraping/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ template })
  });
  const result = await response.json();
};
```

### 3. Ejecutar Template
```javascript
const handleScrapingExecute = async (template) => {
  const response = await fetch(`/api/scraping/templates/${template.id}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId, chatId })
  });
};
```

## Condiciones Personalizadas (NLP)

El sistema soporta condiciones personalizadas usando procesamiento de lenguaje natural:

```javascript
// Ejemplo de condición personalizada
{
  type: 'condition',
  name: 'Verificar si hay productos en stock',
  condition: 'custom',
  parameters: {
    prompt: 'verificar si la página contiene productos disponibles y el precio es menor a 100€'
  }
}
```

### Evaluación de Condiciones
- Análisis del contenido de la página
- Extracción de información relevante
- Evaluación semántica del prompt
- Retorno de resultado booleano

## Características Avanzadas

### 1. Bucles Dinámicos
- `forEach`: Iterar sobre elementos seleccionados
- `while`: Ejecutar hasta que se cumpla una condición
- Pasos anidados dentro de bucles

### 2. Variables y Estado
- Extracción de valores de elementos
- Almacenamiento de variables temporales
- Reutilización en pasos posteriores

### 3. Navegación Multi-página
- Navegación entre diferentes URLs
- Mantenimiento de estado entre páginas
- Extracción de datos de múltiples fuentes

### 4. Condiciones Inteligentes
- Evaluación de contenido usando NLP
- Verificación de existencia de elementos
- Validación de texto y valores

## Estilos CSS

El sistema incluye estilos modernos y responsivos:

```css
/* Contenedor principal */
.scrapingContainer {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Indicador de estado */
.statusSteps {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Estados activos */
.statusStep.active {
  border-color: #007bff;
  color: #007bff;
  background: #e3f2fd;
}
```

## Integración con ChatView

El sistema se integra perfectamente con el ChatView existente:

```jsx
// En ChatView.jsx
const [scrapingStatus, setScrapingStatus] = useState('loading');

// Renderizado condicional
{scrapingStatus && (
  <div className={styles.scrapingMessage}>
    <ScrapingContainer
      status={scrapingStatus}
      onStatusChange={setScrapingStatus}
      onTemplateSave={handleTemplateSave}
      onScrapingExecute={handleScrapingExecute}
    />
  </div>
)}
```

## Base de Datos (CouchDB)

### Estructura de Bases de Datos
- `db_{userId}_templates` - Templates del usuario
- `db_{userId}_chat` - Estado de scraping en chats

### Documentos de Template
```javascript
{
  _id: 'template-id',
  _rev: 'revision',
  type: 'scraping_template',
  userId: 'user-id',
  name: 'Template Name',
  // ... resto de propiedades
}
```

## Consideraciones de Rendimiento

1. **Lazy Loading**: Los templates se cargan bajo demanda
2. **Streaming**: Los resultados se envían en tiempo real
3. **Caché**: Screenshots y datos se almacenan temporalmente
4. **Optimización**: Ejecución paralela de pasos independientes

## Seguridad

1. **Autenticación**: Todos los endpoints requieren token válido
2. **Autorización**: Los usuarios solo acceden a sus propios templates
3. **Validación**: Validación de entrada en todos los endpoints
4. **Sanitización**: Los selectores se sanitizan antes de ejecutar

## Extensibilidad

El sistema está diseñado para ser fácilmente extensible:

1. **Nuevos tipos de pasos**: Añadir nuevos tipos de acciones
2. **Condiciones personalizadas**: Integrar nuevos motores NLP
3. **Proveedores de datos**: Conectar con diferentes fuentes
4. **Exportación**: Añadir formatos de exportación adicionales

## Troubleshooting

### Problemas Comunes

1. **Selector no encontrado**: Verificar que el selector CSS sea válido
2. **Timeout en carga**: Aumentar tiempo de espera para páginas lentas
3. **Error de autenticación**: Verificar token de acceso
4. **Template no guardado**: Verificar permisos de escritura en CouchDB

### Logs y Debugging

```javascript
// Habilitar logs detallados
console.log('Scraping execution:', {
  templateId: template.id,
  stepCount: template.steps.length,
  startTime: new Date()
});
```

## Roadmap

### Próximas Características
1. **Scheduler**: Programación automática de scraping
2. **Notificaciones**: Alertas por email/SMS
3. **API Integration**: Conectar con APIs externas
4. **Machine Learning**: Mejora automática de selectores
5. **Collaboration**: Compartir templates entre usuarios

### Mejoras Técnicas
1. **WebSocket**: Comunicación en tiempo real
2. **Queue System**: Cola de trabajos para scraping masivo
3. **Caching**: Sistema de caché inteligente
4. **Monitoring**: Dashboard de métricas y rendimiento 