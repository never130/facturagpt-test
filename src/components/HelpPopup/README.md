# HelpPopup Component

Un componente React que proporciona indicadores de ayuda interactivos con animaciones super chulas.

## Características

- 🎯 **Indicador visual**: Punto rojo parpadeante que indica que hay ayuda disponible
- ✨ **Animación de vuelo**: El indicador "vuela" cuando se hace hover
- 📱 **Popup informativo**: Modal con título y descripción
- 🎨 **Animaciones suaves**: Transiciones fluidas y efectos visuales atractivos
- 📱 **Responsive**: Se adapta a diferentes tamaños de pantalla
- 🌓 **Tema adaptable**: Soporte para tema claro y oscuro
- 🎯 **Posicionamiento inteligente**: Se ajusta automáticamente para no salirse de la pantalla

## Uso

```jsx
import HelpPopup from './components/HelpPopup/HelpPopup';

// Uso básico
<HelpPopup helpId="1-1">
  <button>Mi botón</button>
</HelpPopup>

// Con título y descripción personalizados
<HelpPopup 
  helpId="1-1" 
  title="Título personalizado" 
  description="Descripción personalizada"
>
  <button>Mi botón</button>
</HelpPopup>
```

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `helpId` | string | ✅ | ID único para identificar el elemento de ayuda |
| `title` | string | ❌ | Título personalizado del popup |
| `description` | string | ❌ | Descripción personalizada del popup |
| `children` | ReactNode | ✅ | Elemento que tendrá el indicador de ayuda |

## Comportamiento

1. **Estado inicial**: El indicador rojo aparece parpadeando
2. **Hover**: El indicador "vuela" y desaparece, aparece el popup
3. **Click**: El indicador desaparece permanentemente
4. **Mouse leave**: El popup desaparece y el indicador vuelve a aparecer

## Datos de ayuda predefinidos

El componente incluye datos de ayuda predefinidos para IDs comunes:

- `1-1`: Chat con IA
- `1-2`: Notificaciones  
- `1-3`: Configuración
- `1-4`: Búsqueda Global
- `1-5`: Crear Nuevo
- `1-6`: Modo Avión
- `1-7`: Chat de Voz
- `1-8`: Perfil de Usuario

## Personalización

Puedes personalizar los datos de ayuda editando el archivo `src/hooks/useHelpData.js`:

```javascript
const helpData = {
  "mi-id": {
    title: "Mi título",
    description: "Mi descripción"
  }
};
```

## Estilos

Los estilos están en `HelpPopup.css` y incluyen:

- Animaciones CSS personalizadas
- Efectos de hover
- Soporte para temas claro/oscuro
- Diseño responsive
- Efectos de sombra y blur 