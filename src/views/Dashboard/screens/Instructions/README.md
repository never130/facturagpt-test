# Sistema de Testing de Flujos de Automatización

Este sistema permite crear y probar flujos de automatización complejos usando un chat interactivo que sigue el flujo de nodos paso a paso.

## 🚀 Características Principales

### Chat de Testing Interactivo
- **Seguimiento de Flujo**: El chat sigue automáticamente el flujo de nodos según las condiciones
- **Respuestas Contextuales**: Cada nodo genera respuestas específicas basadas en su tipo y resultado
- **Log de Ejecución**: Registro detallado de cada paso del flujo
- **Controles de Testing**: Botones para iniciar, detener y reiniciar el test

### Nuevas Categorías de Respuestas

#### 📝 Respuestas de Texto
- **Texto Fijo**: Respuestas predefinidas
- **Texto de IA**: Respuestas generadas por IA
- **Contexto**: Usar información del contexto actual
- **Recoger Nuevos Datos**: Solicitar información adicional

#### 🧮 Operaciones Matemáticas
- **Suma, Resta, Multiplicación, División**
- **Módulo, Potencia, Raíz Cuadrada**
- **Redondeo** con decimales específicos

#### ⏰ Control de Tiempo
- **Esperar**: Pausar por tiempo específico
- **Esperar N Días**: Pausar por días específicos
- **Esperar Hasta**: Pausar hasta fecha específica
- **Retraso Exponencial**: Pausar con retraso exponencial

#### 🔄 Bucles
- **Bucle For**: Repetir número específico de veces
- **Bucle While**: Repetir mientras se cumpla condición
- **Bucle For Each**: Iterar sobre lista
- **Bucle Do While**: Ejecutar al menos una vez

#### 🔍 Comparaciones Avanzadas
- **Comparar Texto**: Con opciones de case-sensitive y partial match
- **Comparar Fechas**: Con diferentes precisiones
- **Comparar Arrays**: Con opciones de orden y duplicados
- **Comparar Objetos**: Comparación profunda de JSON

#### 🎯 Lógica Condicional
- **IF**: Condición simple
- **IF-ELSE**: Condición con rama alternativa
- **SWITCH**: Múltiples condiciones
- **TRY-CATCH**: Manejo de errores

## 🛠️ Cómo Usar el Sistema

### 1. Crear un Flujo
1. Arrastra operadores y respuestas desde el menú izquierdo
2. Conecta los nodos para crear el flujo lógico
3. Configura cada nodo según tus necesidades

### 2. Probar el Flujo
1. Haz clic en el botón **Play** (▶️) para iniciar el test
2. El chat te pedirá los datos de entrada
3. Proporciona los datos y observa cómo el flujo se ejecuta paso a paso
4. Cada respuesta del bot muestra:
   - El nodo actual
   - El resultado de la operación
   - El siguiente paso en el flujo
   - Log de ejecución detallado

### 3. Controles de Testing
- **▶️ Iniciar**: Comienza el test del flujo
- **⏹️ Detener**: Interrumpe el test actual
- **🔄 Reiniciar**: Limpia el estado y permite un nuevo test

## 📊 Motor de Ejecución

El sistema incluye un motor de ejecución robusto que:

### Ejecuta Diferentes Tipos de Nodos
- **Operadores**: Comparaciones, validaciones
- **Respuestas**: Generación de texto, IA, contexto
- **Operaciones**: Cálculos matemáticos
- **Controles**: Tiempo, bucles, condiciones
- **Comparaciones**: Validaciones avanzadas

### Maneja el Contexto
- Mantiene variables durante la ejecución
- Permite referencias entre nodos usando `$variable`
- Persiste datos entre pasos del flujo

### Genera Logs Detallados
- Timestamp de cada operación
- Tipo de nodo ejecutado
- Datos de entrada y salida
- Resultado (SUCCESS/FAILED/ERROR)

## 🎨 Interfaz de Usuario

### Menú Izquierdo con Pestañas
- **🔧 Operadores**: Comparaciones y validaciones
- **💬 Respuestas**: Generación de contenido y operaciones

### Chat Mejorado
- **Controles de Testing**: Botones para controlar la ejecución
- **Mensajes Contextuales**: Información específica de cada nodo
- **Log de Ejecución**: Detalles técnicos de cada paso
- **Estados Visuales**: Colores diferentes para éxito, error, etc.

### Tarjetas de Operaciones
- **Símbolos Visuales**: Cada operación tiene su símbolo
- **Colores por Categoría**: Diferenciación visual por tipo
- **Información Detallada**: Descripción y tipos soportados

## 🔧 Configuración de Nodos

### Operadores
```javascript
{
  title: "Validar Email",
  type: "text",
  category: "text",
  symbol: "⊃",
  compareValue: "@"
}
```

### Respuestas
```javascript
{
  title: "Email Válido",
  type: "response",
  category: "text_response",
  config: {
    text: "✅ Email válido",
    isEditable: true
  }
}
```

### Operaciones
```javascript
{
  title: "Sumar Valores",
  type: "operation",
  category: "math",
  symbol: "+",
  config: {
    operands: ["$valor1", "$valor2"],
    resultVariable: "suma"
  }
}
```

## 📝 Ejemplos de Uso

### Validación de Email
1. Nodo "Contiene @" → Verifica si el email tiene @
2. Si es verdadero → Nodo "Termina con .com"
3. Si es verdadero → Respuesta "Email válido"
4. Si es falso → Respuesta "Email inválido"

### Cálculo Matemático
1. Nodo "Sumar" → Suma dos valores
2. Nodo "Mayor que 10" → Verifica el resultado
3. Si es verdadero → Respuesta "Suma alta"
4. Si es falso → Respuesta "Suma baja"

### Control de Tiempo
1. Nodo "Esperar 2s" → Pausa la ejecución
2. Respuesta "Tiempo transcurrido" → Confirma la pausa

## 🚀 Próximas Mejoras

- [ ] Integración con servicios de IA reales
- [ ] Exportación de logs en diferentes formatos
- [ ] Métricas de rendimiento del flujo
- [ ] Debugging visual paso a paso
- [ ] Plantillas de flujos predefinidos
- [ ] Colaboración en tiempo real
- [ ] Versionado de flujos
- [ ] API para integración externa

## 🐛 Solución de Problemas

### El flujo no inicia
- Verifica que haya un nodo sin conexiones entrantes
- Asegúrate de que los nodos estén correctamente conectados

### Error en la ejecución
- Revisa el log de ejecución en el chat
- Verifica la configuración de cada nodo
- Asegúrate de que los tipos de datos sean compatibles

### El chat no responde
- Verifica que el flujo esté en estado "running"
- Intenta reiniciar el test
- Revisa la consola del navegador para errores

## 📚 Recursos Adicionales

- [Documentación de React Flow](https://reactflow.dev/)
- [Guía de Operadores](operatorsData.js)
- [Guía de Respuestas](responsesData.js)
- [Ejemplos de Flujos](exampleFlow.js) 