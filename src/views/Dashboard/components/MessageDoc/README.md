# MessageDocs Component

Un componente React para preview de HTML con funcionalidad de conversión a PDF, drag & drop, resize y múltiples estados de visualización.

## Características

- ✅ **Preview de HTML en tiempo real**
- ✅ **Conversión a PDF** usando html2pdf.js
- ✅ **Drag and drop** por toda la pantalla
- ✅ **Resize horizontal y vertical**
- ✅ **Estados de visualización**: Minimizado, Expandido, Pantalla completa
- ✅ **Botones de control**: Refresh, Print, Cancel, Expandir/Minimizar
- ✅ **Diseño responsive** y moderno
- ✅ **Integración con Redux** para gestión de estado

## Instalación

El componente ya está integrado en el proyecto. Solo necesitas importarlo y usarlo.

## Uso Básico

### 1. Importar las acciones de Redux

```javascript
import { 
  setMessageDocsShow, 
  setMessageDocsData, 
  setMessageDocsStatus 
} from '../../slices/docsSlices';
```

### 2. Mostrar el componente con contenido HTML

```javascript
const handleShowMessageDocs = () => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>Mi Documento HTML</h1>
      <p>Este es el contenido que se mostrará en el preview.</p>
    </div>
  `;
  
  dispatch(setMessageDocsData(htmlContent));
  dispatch(setMessageDocsStatus('expanded'));
  dispatch(setMessageDocsShow(true));
};
```

### 3. El componente se renderiza automáticamente

El componente `MessageDoc` ya está integrado en `PanelTemplate` y se mostrará automáticamente cuando `show` sea `true`.

## Estados del Redux Store

El componente utiliza el slice `docs` con las siguientes propiedades dentro de `doc`:

```javascript
{
  doc: {
    show: false,           // Mostrar/ocultar el componente
    data: "",              // Contenido HTML
    status: "minimized",   // "minimized" | "expanded" | "fullscreen"
    createdAt: null,       // Timestamp cuando se crea contenido
    updatedAt: null,       // Timestamp cuando se actualiza contenido
    position: {            // Posición en pantalla
      x: 50,
      y: 50
    },
    size: {                // Tamaño del componente
      width: 600,
      height: 400
    }
  }
}
```

## Acciones Disponibles

### `setMessageDocsShow(boolean)`
Muestra u oculta el componente.

### `setMessageDocsData(string)`
Establece el contenido HTML. Automáticamente actualiza `updatedAt` y `createdAt`.

### `setMessageDocsStatus(string)`
Cambia el estado de visualización:
- `"minimized"`: Tamaño pequeño (600x400)
- `"expanded"`: Tamaño medio (800x600)
- `"fullscreen"`: Pantalla completa

### `setMessageDocsPosition({x, y})`
Establece la posición del componente en pantalla.

### `setMessageDocsSize({width, height})`
Establece el tamaño del componente.

### `resetMessageDocs()`
Limpia el contenido y resetea timestamps.

## Funcionalidades del Componente

### Botones de Control

- **🔄 Refresh**: Limpia el contenido HTML
- **⤢/⤓ Expandir/Minimizar**: Cambia entre estados de visualización
- **🖨️ Print**: Genera y descarga PDF del contenido HTML
- **✕ Cancel**: Oculta el componente

### Interacciones

- **Drag**: Arrastra el header para mover el componente
- **Resize**: Usa los handles en los bordes para redimensionar
- **Responsive**: Se adapta automáticamente en dispositivos móviles

### Conversión a PDF

El componente usa `html2pdf.js` con la siguiente configuración:

```javascript
const opt = {
  margin: 1,
  filename: 'document.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
};
```

## Ejemplo Completo

```javascript
import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  setMessageDocsShow, 
  setMessageDocsData, 
  setMessageDocsStatus 
} from '../../slices/docsSlices';

const MyComponent = () => {
  const dispatch = useDispatch();

  const showDocument = () => {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #667eea;">
          Documento de Ejemplo
        </h1>
        <p>Este es un documento HTML que puede ser convertido a PDF.</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Columna 1</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Columna 2</th>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Dato 1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Dato 2</td>
          </tr>
        </table>
      </div>
    `;
    
    dispatch(setMessageDocsData(htmlContent));
    dispatch(setMessageDocsStatus('expanded'));
    dispatch(setMessageDocsShow(true));
  };

  return (
    <button onClick={showDocument}>
      Mostrar Documento
    </button>
  );
};
```

## Estilos CSS

El componente incluye estilos modernos con:
- Gradientes y sombras
- Animaciones suaves
- Diseño responsive
- Scrollbars personalizados
- Estados hover y active

## Dependencias

- `html2pdf.js`: Para conversión a PDF
- `react-redux`: Para gestión de estado
- CSS Modules: Para estilos encapsulados

## Notas Técnicas

- El componente usa `position: fixed` para flotar sobre el contenido
- Los eventos de mouse se manejan globalmente para drag y resize
- El contenido HTML se renderiza con `dangerouslySetInnerHTML`
- Los timestamps se actualizan automáticamente al cambiar el contenido
- El componente se mantiene dentro de los límites del viewport 