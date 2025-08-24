# 🛒 E-commerce Store

Una tienda online completa y moderna con funcionalidades avanzadas de compra.

## 🚀 Características

- **Catálogo de Productos**: Grid responsive con filtros y búsqueda
- **Carrito de Compras**: Gestión completa con cantidades y totales
- **Proceso de Checkout**: Formulario de 3 pasos con validación
- **Filtros Avanzados**: Por categoría, precio y búsqueda
- **Diseño Responsive**: Adaptable a todos los dispositivos
- **Gestión de Stock**: Control de inventario en tiempo real
- **Múltiples Métodos de Pago**: Tarjeta y PayPal
- **Cálculo Automático**: Impuestos, envío y descuentos

## 🛠️ Tecnologías

- React 18
- CSS3 con Grid y Flexbox
- LocalStorage para persistencia
- Utilidades de formateo de moneda

## 📁 Estructura del Proyecto

```
src/
├── App.jsx                 # Componente principal
├── components/
│   ├── ProductGrid.jsx     # Grid de productos
│   ├── ProductCard.jsx     # Cards de productos individuales
│   ├── ShoppingCart.jsx    # Carrito de compras
│   └── Checkout.jsx        # Proceso de pago
├── styles/
│   └── Store.css           # Estilos principales
└── utils/
    ├── products.js         # Datos de productos
    └── cartUtils.js        # Utilidades del carrito
```

## 🎯 Componentes Principales

### ProductGrid
- Display de productos en grid responsive
- Filtros por categoría y búsqueda
- Paginación y controles de vista

### ProductCard
- Información detallada del producto
- Sistema de calificaciones
- Badges de descuento y stock
- Acciones de compra y wishlist

### ShoppingCart
- Gestión de cantidades
- Cálculo automático de totales
- Resumen del pedido
- Proceso de checkout

### Checkout
- Formulario de 3 pasos
- Validación de datos
- Múltiples métodos de pago
- Resumen final del pedido

## 🛍️ Funcionalidades del Carrito

- **Agregar/Remover productos**
- **Actualizar cantidades**
- **Cálculo automático de totales**
- **Envío gratis en pedidos > $50**
- **Cálculo de impuestos (8%)**
- **Persistencia en localStorage**

## 💳 Proceso de Checkout

### Paso 1: Información de Contacto
- Nombre y apellido
- Email y teléfono
- Validación de campos requeridos

### Paso 2: Dirección de Envío
- Dirección completa
- Ciudad, estado y código postal
- Validación de formato

### Paso 3: Información de Pago
- Tarjeta de crédito/débito
- PayPal como alternativa
- Validación de datos de pago

## 🎨 Diseño y UX

- **Diseño Moderno**: Cards con sombras y efectos hover
- **Colores Consistentes**: Paleta profesional
- **Iconografía**: Emojis para mejor UX
- **Animaciones**: Transiciones suaves
- **Responsive**: Mobile-first approach

## 📱 Responsive Design

- **Desktop**: Grid de 4 columnas
- **Tablet**: Grid de 2-3 columnas
- **Mobile**: Grid de 1 columna
- **Carrito**: Sidebar en desktop, modal en mobile

## 🔧 Personalización

### Agregar Nuevos Productos
```javascript
// En utils/products.js
{
  id: 9,
  name: "Nuevo Producto",
  description: "Descripción del producto",
  price: 99.99,
  category: "Nueva Categoría",
  // ... más propiedades
}
```

### Modificar Categorías
```javascript
// Las categorías se generan automáticamente
// desde los productos existentes
```

## 🚀 Uso

1. **Explorar productos** en el catálogo
2. **Filtrar por categoría** o buscar
3. **Agregar al carrito** productos deseados
4. **Revisar carrito** y ajustar cantidades
5. **Proceder al checkout** en 3 pasos
6. **Completar compra** con método de pago

## 📊 Funcionalidades Avanzadas

- **Sistema de Wishlist**: Guardar productos favoritos
- **Historial de Compras**: Seguimiento de pedidos
- **Notificaciones**: Alertas de stock y ofertas
- **Reviews**: Sistema de calificaciones
- **Recomendaciones**: Productos relacionados

## 🔒 Seguridad

- **Validación de Formularios**: Cliente y servidor
- **Encriptación SSL**: Para datos de pago
- **Sanitización**: De inputs de usuario
- **Protección CSRF**: Tokens de seguridad

## 📈 Próximas Mejoras

- [ ] Integración con APIs de pago reales
- [ ] Sistema de usuarios y autenticación
- [ ] Panel de administración
- [ ] Sistema de cupones y descuentos
- [ ] Integración con inventario real
- [ ] Notificaciones push
- [ ] PWA (Progressive Web App)

---

Desarrollado con ❤️ para el comercio electrónico moderno 