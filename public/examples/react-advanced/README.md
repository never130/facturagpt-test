# 🎯 Todo App Avanzada

## Características

- **📝 Gestión de tareas**: Crear, completar y eliminar tareas
- **🎨 Temas**: Modo claro y oscuro
- **📊 Estadísticas**: Contador de tareas totales, pendientes y completadas
- **🔍 Filtros**: Ver todas, solo pendientes o solo completadas
- **💾 Persistencia**: Los datos se guardan en localStorage
- **📱 Responsive**: Diseño adaptativo para móviles
- **⚡ Animaciones**: Transiciones suaves y efectos visuales

## Estructura del proyecto

```
src/
├── App.jsx                 # Componente principal
├── App.css                 # Estilos principales
├── components/
│   └── TodoItem.jsx        # Componente para cada tarea
└── utils/
    └── todoUtils.js        # Funciones utilitarias
```

## Funcionalidades

### Gestión de Tareas
- ✅ Agregar nuevas tareas
- ✅ Marcar como completadas/pendientes
- ✅ Eliminar tareas individuales
- ✅ Limpiar todas las completadas
- ✅ Limpiar todas las tareas

### Filtros
- 📋 Ver todas las tareas
- ⏳ Ver solo pendientes
- ✅ Ver solo completadas

### Temas
- ☀️ Modo claro
- 🌙 Modo oscuro

### Estadísticas
- Total de tareas
- Tareas pendientes
- Tareas completadas

## Tecnologías

- React 18 con Hooks
- CSS Variables para temas
- localStorage para persistencia
- CSS Grid y Flexbox
- Animaciones CSS 