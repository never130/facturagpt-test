# 🚀 FileExplorer - Editor de Código React Avanzado con Actualización en Tiempo Real

## 📋 Descripción

FileExplorer es un editor de código React completamente funcional con navegación de carpetas tipo acordeón, drag & drop, y **preview en tiempo real con actualización automática**. Está diseñado para ser una herramienta de desarrollo interactiva y moderna.

## 🎯 Características Principales

### ⚡ **Actualización en Tiempo Real (NUEVO)**
- **Sincronización instantánea**: Los cambios en el editor se reflejan inmediatamente en Redux
- **Preview automático**: El preview de React se actualiza automáticamente al editar
- **Debounce inteligente**: Sincronización con el backend después de 1 segundo de inactividad
- **Hook personalizado**: `useRealTimeUpdate` para manejar actualizaciones eficientemente
- **Indicador visual**: Muestra el estado de sincronización en tiempo real

### 📁 **Navegación de Carpetas Avanzada**
- **Estructura jerárquica**: Navegación tipo árbol con carpetas expandibles
- **Drag & Drop**: Arrastra y suelta archivos entre carpetas
- **Acciones contextuales**: Botones de acción que aparecen al hacer hover
- **Renombrado inline**: Edita nombres de archivos directamente
- **Iconos dinámicos**: Diferentes iconos según el tipo de archivo

### ⚛️ **Preview de React en Tiempo Real**
- **Ejecución dinámica**: Compila y ejecuta código React al instante
- **Sandbox seguro**: Usa iframe para aislamiento
- **Manejo de errores**: Muestra errores de compilación de forma clara
- **Actualización automática**: El preview se actualiza automáticamente al editar el código
- **Auto-update**: Conectado con Redux para sincronización en tiempo real

### 🎨 **CSS Modules**
- **Estilos encapsulados**: Cada componente tiene sus propios estilos
- **Sin conflictos**: Los estilos están aislados por componente
- **Mantenible**: Fácil de mantener y modificar

### 📱 **Diseño Responsive**
- **Adaptativo**: Se adapta a diferentes tamaños de pantalla
- **Mobile-first**: Optimizado para dispositivos móviles
- **Grid layout**: Layout flexible con CSS Grid

## 🏗️ Estructura de Componentes

```
FileExplorer/
├── FileExplorer.jsx              # Componente principal
├── FileExplorer.module.css       # Estilos del componente principal
├── FolderNavigator.jsx           # Navegador de carpetas
├── FolderNavigator.module.css    # Estilos del navegador
├── ReactPreview.jsx              # Preview de React con auto-update
├── ReactPreview.module.css       # Estilos del preview
├── MonacoEditor.jsx              # Editor con actualización en tiempo real
├── MonacoEditor.module.css       # Estilos del editor
├── useRealTimeUpdate.js          # Hook personalizado para tiempo real
├── example/
│   ├── RealTimeExample.jsx       # Componente de demostración
│   ├── ExampleComponent.jsx      # Componente de ejemplo
│   └── ExampleComponent.css      # Estilos del ejemplo
└── README.md                     # Esta documentación
```

## 🔧 Componentes Detallados

### 1. **FileExplorer.jsx** (Componente Principal)
- **Estado global**: Maneja el estado de todos los archivos con Redux
- **Sincronización**: Conecta con el backend para persistencia
- **Layout**: Organiza los tres paneles principales
- **Funciones CRUD**: Crear, leer, actualizar y eliminar archivos
- **Tiempo real**: Integrado con Redux para actualizaciones instantáneas

### 2. **MonacoEditor.jsx** (Editor con Tiempo Real)
- **Editor avanzado**: Basado en Monaco Editor (VS Code)
- **Actualización instantánea**: Cambios se reflejan inmediatamente en Redux
- **Hook personalizado**: Usa `useRealTimeUpdate` para sincronización eficiente
- **Debounce inteligente**: Evita demasiadas llamadas al backend
- **Soporte multi-lenguaje**: JavaScript, TypeScript, JSX, TSX, CSS, etc.

### 3. **ReactPreview.jsx** (Preview con Auto-update)
- **Compilación dinámica**: Usa Babel para transpilar JSX
- **Sandbox seguro**: Iframe aislado para ejecución segura
- **Manejo de errores**: Captura y muestra errores de compilación
- **Auto-update**: Se conecta con Redux para actualizaciones automáticas
- **Indicadores visuales**: Muestra estado de carga, errores y auto-update

### 4. **useRealTimeUpdate.js** (Hook Personalizado)
- **Sincronización eficiente**: Maneja actualizaciones con debounce
- **Optimización**: Evita actualizaciones innecesarias
- **Redux integration**: Conecta directamente con el store de Redux
- **Backend sync**: Sincroniza con el backend después de pausas

## ⚡ Funcionalidad de Tiempo Real

### **Flujo de Actualización**
```javascript
// 1. Usuario edita en MonacoEditor
const handleEditorChange = (value) => {
  // 2. Actualización inmediata en Redux
  dispatch(setAppFileContent({ path: filePath, content: value }));
  
  // 3. Preview se actualiza automáticamente
  // 4. Backend se sincroniza después de 1 segundo
};
```

### **Hook Personalizado**
```javascript
const updateFileInRealTime = useRealTimeUpdate(
  filePath,    // Ruta del archivo
  content,     // Contenido actual
  onUpdate     // Callback para backend
);
```

### **Configuración del Preview**
```javascript
<ReactPreview
  autoUpdate={true}  // Habilitar auto-update
  code={previewCode}
  isVisible={showPreview}
  onClose={handlePreviewClose}
/>
```

## 🎨 Estilos y Animaciones

### **Animaciones CSS**
- **slideDown**: Para expandir carpetas
- **fadeIn**: Para mostrar secciones
- **pulse**: Para indicadores de carga
- **hover effects**: Transiciones suaves en interacciones

### **Temas y Colores**
- **Gradientes**: Fondos con gradientes modernos
- **Variables CSS**: Sistema de colores consistente
- **Modo oscuro**: Soporte para temas oscuros
- **Responsive**: Breakpoints para diferentes dispositivos

### **Indicadores de Estado**
- **🔄 Auto**: Auto-update habilitado
- **✅ Conectado**: Sincronización activa
- **❌ Error**: Error de compilación
- **🔄 Cargando**: Preview cargando

## 🚀 Funcionalidades Avanzadas

### **Drag & Drop**
```javascript
// Ejemplo de implementación
const handleDrop = (e, targetItem) => {
  e.preventDefault();
  if (draggedItem && targetItem) {
    // Lógica para mover archivos
    console.log(`Mover ${draggedItem.path} a ${targetItem.path}`);
  }
};
```

### **Preview Dinámico**
```javascript
// Generación de HTML con React
const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${componentCode}
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>
`;
```

### **Redux Integration**
```javascript
// Slice para manejar archivos
const docsSlice = createSlice({
  name: 'docs',
  initialState: {
    app: {
      files: {},
      selectedFile: null,
      status: 'minimized'
    }
  },
  reducers: {
    setAppFileContent: (state, action) => {
      const { path, content } = action.payload;
      state.app.files[path] = content;
    }
  }
});
```

## 🔧 Configuración

### **Instalación de Dependencias**
```bash
npm install @monaco-editor/react react-redux @reduxjs/toolkit
```

### **Configuración de Redux**
```javascript
import { configureStore } from '@reduxjs/toolkit';
import docsReducer from './slices/docsSlices';

export const store = configureStore({
  reducer: {
    docs: docsReducer
  }
});
```

### **Uso del Componente**
```javascript
import FileExplorer from './FileExplorer';

function App() {
  return (
    <FileExplorer
      appData={appData}
      onFileUpdate={handleFileUpdate}
      appId="my-app"
    />
  );
}
```

## 🎯 Casos de Uso

### **Desarrollo de Componentes React**
- Edita componentes JSX/TSX en tiempo real
- Ve los cambios inmediatamente en el preview
- Sincroniza automáticamente con el backend

### **Prototipado Rápido**
- Crea prototipos interactivos
- Prueba diferentes estilos y funcionalidades
- Comparte el código generado

### **Aprendizaje de React**
- Experimenta con código React
- Ve errores en tiempo real
- Aprende de forma interactiva

## 🚀 Próximas Mejoras

- [ ] **Colaboración en tiempo real**: Múltiples usuarios editando simultáneamente
- [ ] **Historial de cambios**: Versiones y rollback de archivos
- [ ] **Temas personalizables**: Más opciones de temas para el editor
- [ ] **Extensiones**: Sistema de plugins para funcionalidades adicionales
- [ ] **Optimización de rendimiento**: Lazy loading y virtualización para proyectos grandes

## 📝 Notas de Desarrollo

### **Optimizaciones Implementadas**
- **Debounce**: Evita demasiadas llamadas al backend
- **Memoización**: Componentes optimizados con React.memo
- **Lazy loading**: Carga diferida de componentes pesados
- **Error boundaries**: Manejo robusto de errores

### **Consideraciones de Rendimiento**
- **Redux selectors**: Selectores optimizados para evitar re-renders
- **useCallback/useMemo**: Hooks optimizados para funciones costosas
- **Virtualización**: Para listas grandes de archivos
- **Code splitting**: División de código para mejor carga

---

**¡Disfruta editando código React en tiempo real! 🚀** 