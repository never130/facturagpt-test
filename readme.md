# 🚀 FacturaGPT - Guía de Bienvenida para Nuevos Desarrolladores

Esta guía te ayudará a configurar tu entorno de desarrollo y entender los flujos de trabajo del proyecto.

## 📋 Tabla de Contenidos
- [Configuración Inicial](#configuración-inicial)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Comunicación del Equipo](#comunicación-del-equipo)
- [Información Técnica](#información-técnica)

---

## ⚙️ Configuración Inicial

### 1. Instalación de Dependencias
Una vez clonado el repositorio, instala las dependencias:

```bash
npm install --legacy-peer-deps
```

### 2. Configuración de Rutas API
En el archivo `src/apiBackend.js` encontrarás 3 rutas de producción y 3 rutas de localhost:

```javascript
// Para desarrollo local, activa estas líneas:
baseURL: "http://localhost:3006/api",
baseURL: "http://localhost:3006/monitor",
apiUrl: "http://localhost:3006";

// Y comenta estas líneas de producción:
// baseURL: "https://facturagpt.com/api",
// baseURL: "https://facturagpt.com/monitor",
// apiUrl: "https://facturagpt.com";
```

### 3. Configuración de Acceso
Añade tu correo electrónico en `app/config/valid_emails.txt` para obtener permisos de login, ya que la aplicación está en modo beta con acceso limitado.

⚠️ Si al registrar una cuenta recibes el error:
"Email no autorizado. Por favor, contacte al administrador para obtener acceso."
Es porque tu correo no está en valid_emails.txt. Agrega tu email, uno por línea, y guarda el archivo. 

---

## 🚀 Ejecución del Proyecto

### Frontend (Desarrollo)
```bash
npm run start
```
🔁 Si tienes problemas con sourcemaps o memoria, usa este comando alternativo: 
"cross-env GENERATE_SOURCEMAP=false craco start --max-old-space-size=8192"

### Backend (Desarrollo)
```bash
# Ubicate en la carpeta
cd app
# Ejecuta node
nodemon service
```
Asegúrate de tener nodemon instalado globalmente (npm install -g nodemon) o usa npx nodemon service. 


### Solución de Problemas de Puertos
Si necesitas forzar el cierre de un puerto:
```bash
kill -9 $(lsof -t -i:3006)
```

---

## 🔄 Flujo de Trabajo

### 1. Comunicación de Jornada
**IMPORTANTE**: Debes comunicar por WhatsApp:
- **Inicio de jornada**: Cuando comiences a trabajar
- **Final de jornada**: Cuando termines de trabajar

### 2. Desarrollo de Features
1. Crea una nueva rama para tu feature
2. Desarrolla y prueba localmente
3. **Envía un Pull Request** con tus cambios
4. Espera la revisión del equipo

### 3. Comunicación de Dudas
**Regla importante**: Si tienes dudas sobre un ticket o no entiendes algo:
- **Pregunta ANTES** de empezar a trabajar
- Es mejor hacer 1 pregunta clara que 100 preguntas después
- Comunícate con el equipo por WhatsApp o el canal correspondiente

---

## 📱 Comunicación del Equipo

### Canales de Comunicación
- **WhatsApp**: Para comunicación diaria y reportes de jornada
- **GitHub**: Para Pull Requests y revisión de código
- **Canal del proyecto**: Para dudas técnicas y coordinación

### Buenas Prácticas
- Sé proactivo en la comunicación
- Reporta bloqueos o problemas inmediatamente
- Mantén al equipo informado de tu progreso
- Pregunta antes de asumir

---

## 🛠️ Información Técnica

### Estructura de Base de Datos

#### Roles de Usuario
- **`db_accounts`**: Usuarios con acceso a la plataforma (tienen PIN)
- **`db_otp`**: Códigos de verificación generados

Base de Datos: CouchDB
La aplicación utiliza CouchDB como base de datos principal. Todo el sistema está diseñado en torno a workspaces multi-inquilino, donde cada usuario tiene un workspace por defecto y toda su información se organiza según este contexto.

#### Bases de Datos por Workspace
El identificador (`id`) corresponde al workspace.

Cada workspace tiene sus propias bases de datos: `db_[id]_[name]`

- **`[name]auth`**: Tokens de conexiones API
- **`[name]chat`**: Conversaciones con FacturaGPT
- **`[name]clients`**: Clientes obtenidos del OCR
- **`[name]products`**: Productos/activos del OCR
- **`[name]docs`**: Transacciones del OCR
- **`[name]notifications`**: Notificaciones del sistema
- **`[name]automations`**: Automatizaciones configuradas

### Gestión del Workspace

# En el Backend

Al crear una cuenta, se asigna un campo selectedWorkspace (string) al usuario.
Este campo se usa para determinar qué base de datos utilizar.
El middleware authenticateToken inyecta el objeto user en req.user, incluyendo selectedWorkspace.

# En el Frontend
El workspace seleccionado se gestiona mediante Redux Toolkit:
const { workspaceSelected } = useSelector((state) => state.workspace);

Este valor se actualiza cuando el usuario cambia de workspace y se usa en useEffects para refrescar datos:



### Automatizaciones
Ubicación: `@/services/automate/index.js`

**Tipos de Automatización:**
- **Entrada**: Captura archivos (Gmail, Outlook, Drive, Dropbox, WhatsApp)
- **Salida**: Procesa y envía datos (Telematel, Sheets, FTP, XML, Agencia)

**Flujo:**
1. Documento se lee y procesa
2. Se crean registros automáticos (cliente, productos, documento)
3. Datos disponibles para conversación con ChatGPT
4. Se registra la automatización para futuras ejecuciones

### 📁 actions
La carpeta actions contiene funciones reutilizables que encapsulan operaciones asíncronas, principalmente llamados a la API del backend. Estas funciones, conocidas como thunks, se crean utilizando createAsyncThunk de Redux Toolkit.

# ¿Qué hacen?
Realizan peticiones HTTP (GET, POST, PUT, DELETE) hacia el backend.
Incluyen manejo de autenticación (por ejemplo, lectura del token desde localStorage).
Gestionan errores de red, tiempo de espera o respuestas inesperadas de forma estructurada.

# Ventajas principales:
Centralización: Toda la lógica de comunicación con la API está en un solo lugar, evitando duplicación.

# Integración con Redux: 
Los thunks disparan acciones automáticas (pending, fulfilled, rejected), lo que permite actualizar el estado global según el estado de la petición (cargando, éxito, error).

# Manejo de errores robusto: 
Los errores se capturan y pueden ser devueltos para ser tratados en el componente o en el reducer.

# Reutilizables y predecibles: 
Pueden ser llamados desde cualquier parte de la aplicación con distintos parámetros, manteniendo un flujo de datos consistente.

Este enfoque mejora la mantenibilidad, facilita las pruebas y asegura que el estado de la aplicación refleje fielmente la actividad asincrónica en curso.

### 📁 slices
Esta carpeta contiene los reducers y estados globales gestionados con Redux Toolkit. Cada archivo .js define un "slice" del estado global (por ejemplo, userSlice.js, chatSlice.js).

# Estructura típica de un slice:

Estado inicial
Reducers (funciones puras que modifican el estado)
Actions automáticas generadas por Redux Toolkit
Exportación del reducer para configurar el store


### Estructura de Carpetas (Escenciales)

facturagpt/
│   ├── src/
│   │   ├── apiBackend.js
│   │   ├── actions/
│   │   ├── slices/
│   │   ├── views/
│   │       ├── Dashboard/
│   │           ├──  assets/
│   │           ├──  components/
│   │           └──  screens/
│   │   
├── app/
│   ├── routers
│   ├── controllers
│   └── middleware/authenticateToken.js
│   
├── package.json
└── README.md


### Producción (Solo para deploy)
```bash
# Iniciar servicios con PM2
pm2 start npm --name "frontend" -- run start
pm2 start app/index.js --name "backend"
pm2 start app/monitor.js --name "monitor"

# Gestión de servicios del sistema
sudo systemctl enable facturagpt-backend
sudo systemctl restart facturagpt-backend
sudo systemctl status facturagpt-backend

# Ver logs
sudo journalctl -u facturagpt-backend -f
```

### Certificados SSL
```bash
sudo certbot certonly --standalone -d facturagpt.com -d www.facturagpt.com
```

*¿Necesitas ayuda? No dudes en preguntar al equipo por WhatsApp o en el canal correspondiente.*#   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 #   f a c t u r a g p t - t e s t  
 