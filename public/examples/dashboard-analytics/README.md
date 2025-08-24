# 📊 Dashboard Analytics

Un dashboard moderno y completo para visualización de datos y métricas empresariales.

## 🚀 Características

- **Múltiples Vistas**: Vista general, ventas, usuarios y analytics
- **Métricas en Tiempo Real**: Cards con métricas importantes y tendencias
- **Gráficos Interactivos**: Líneas, barras, circulares, áreas y heatmaps
- **Tema Oscuro/Claro**: Cambio dinámico de tema
- **Sidebar Colapsible**: Navegación optimizada
- **Diseño Responsive**: Adaptable a diferentes dispositivos
- **Animaciones Suaves**: Transiciones y efectos visuales

## 🛠️ Tecnologías

- React 18
- CSS3 con Grid y Flexbox
- SVG para gráficos personalizados
- Utilidades de formateo de datos

## 📁 Estructura del Proyecto

```
src/
├── App.jsx                 # Componente principal
├── components/
│   ├── Dashboard.jsx       # Dashboard principal
│   ├── MetricCard.jsx      # Cards de métricas
│   ├── ChartCard.jsx       # Cards de gráficos
│   └── Sidebar.jsx         # Navegación lateral
├── styles/
│   └── Dashboard.css       # Estilos principales
└── utils/
    ├── metrics.js          # Utilidades de métricas
    └── chartData.js        # Generación de datos de gráficos
```

## 🎯 Componentes Principales

### Dashboard
- Gestión de vistas (overview, sales, users)
- Carga dinámica de datos
- Renderizado condicional de contenido

### MetricCard
- Display de métricas individuales
- Indicadores de cambio (positivo/negativo)
- Iconos y tendencias visuales

### ChartCard
- Múltiples tipos de gráficos
- Gráficos SVG personalizados
- Leyendas y acciones

### Sidebar
- Navegación entre vistas
- Toggle de tema
- Información de usuario

## 📊 Tipos de Gráficos

1. **Línea**: Para tendencias temporales
2. **Barras**: Para comparaciones
3. **Circular**: Para distribuciones
4. **Área**: Para volúmenes acumulados
5. **Doughnut**: Para proporciones
6. **Heatmap**: Para actividad por hora

## 🎨 Temas

- **Claro**: Fondo claro con colores suaves
- **Oscuro**: Fondo oscuro con acentos brillantes
- Transiciones suaves entre temas

## 📱 Responsive Design

- Sidebar colapsible en móviles
- Grid adaptativo para métricas
- Gráficos escalables
- Navegación optimizada para touch

## 🔧 Personalización

### Agregar Nuevas Métricas
```javascript
// En utils/metrics.js
export const getMetrics = async (view) => {
  const metrics = {
    newView: {
      customMetric: 'valor',
      // ... más métricas
    }
  };
  return metrics[view];
};
```

### Agregar Nuevos Gráficos
```javascript
// En ChartCard.jsx
case 'newChart':
  return <div className="new-chart">...</div>;
```

## 🚀 Uso

1. Selecciona una vista desde el sidebar
2. Observa las métricas en tiempo real
3. Interactúa con los gráficos
4. Cambia entre temas claro/oscuro
5. Exporta datos cuando sea necesario

## 📈 Próximas Mejoras

- [ ] Gráficos con librerías externas (Chart.js, D3.js)
- [ ] Filtros de fecha y rango
- [ ] Exportación a PDF/Excel
- [ ] Notificaciones en tiempo real
- [ ] Más tipos de gráficos
- [ ] Integración con APIs reales

---

Desarrollado con ❤️ para visualización de datos empresariales 