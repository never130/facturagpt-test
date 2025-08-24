import React, { useState, useRef, useEffect } from 'react';
// import { Send, Upload } from 'lucide-react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
import styles from './ChatInterface.module.css';

import { ReactComponent as IconDownload } from './assets/icon-download.svg';
import { ReactComponent as IconChat } from './assets/icon-chat.svg';



export const ChatInterface = ({
  messages,
  onSendMessage,
  onAddLayer,
  layers,
  onUpdateLayer,
  isProcessing,
  onFileUpload,
  onSelectLayer
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isUrl = (text) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const isPdf = (text) => {
    return text.toLowerCase().includes('.pdf') || text.toLowerCase().includes('pdf');
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = inputValue.trim();
    onSendMessage({ type: 'user', content: userMessage });

    // Procesar el mensaje del usuario
    processUserMessage(userMessage);
    setInputValue('');
  };

  const processUserMessage = (message) => {
    // Simular procesamiento
    setTimeout(() => {
      if (isUrl(message)) {
        const layerType = isPdf(message) ? 'pdf' : 'web';
        const layerName = layerType === 'pdf' 
          ? `PDF: ${message.split('/').pop()?.replace('.pdf', '') || 'Documento'}`
          : `Web: ${new URL(message).hostname}`;

        const layerId = onAddLayer({
          name: layerName,
          url: message,
          type: layerType,
          selectors: [],
          variables: []
        });

        // Seleccionar la capa recien creada
        if (typeof onSelectLayer === 'function') {
          onSelectLayer(layerId);
        }

        // Respuesta del bot dependiendo del tipo
        if (layerType === 'pdf') {
          onSendMessage({
            type: 'bot',
            content: `¡Perfecto! He agregado tu documento PDF "${layerName}" a las capas de scraping. 

📄 **Vista previa disponible**: Puedes ver el documento en el panel derecho
📋 **Para documentos PDF**, puedo ayudarte a:
• Extraer texto de secciones específicas usando prompts de IA
• Identificar tablas, listas y elementos estructurados
• Crear variables dinámicas basadas en el contenido

¿Te gustaría que analice el documento y te sugiera algunas secciones para extraer? Solo selecciona la capa y podremos configurar los selectores.`
          });
        } else {
          onSendMessage({
            type: 'bot',
            content: `¡Excelente! He agregado "${layerName}" a tus capas de scraping. 

🌐 **Vista previa disponible**: La página se muestra en el panel derecho. Algunas webs pueden bloquear la incrustación en iframes; en ese caso, usa el botón para abrirla en una pestaña nueva.

Ahora vamos a configurarlo paso a paso:

🔍 **Paso 1**: Selecciona la capa en el sidebar para ver los selectores disponibles
⚙️ **Paso 2**: Elige los elementos que quieres extraer (texto, enlaces, imágenes, tablas)
🔧 **Paso 3**: Configura variables si necesitas datos dinámicos
▶️ **Paso 4**: Ejecuta el scraping para obtener los resultados

¿Quieres que te ayude a identificar selectores comunes para este tipo de sitio?`
          });
        }

        // Agregar selectores de ejemplo después de un momento
        setTimeout(() => {
          const exampleSelectors = layerType === 'pdf' 
            ? [
                { id: '1', name: 'titulo_documento', selector: 'prompt: Extrae el título principal del documento', type: 'text' },
                { id: '2', name: 'tabla_datos', selector: 'prompt: Encuentra y extrae todas las tablas con datos numéricos', type: 'table' }
              ]
            : [
                { id: '1', name: 'titulo', selector: 'h1, .title, .headline', type: 'text' },
                { id: '2', name: 'enlaces', selector: 'a[href]', type: 'link' },
                { id: '3', name: 'descripcion', selector: 'p, .description, .summary', type: 'text' }
              ];

          onUpdateLayer(layerId, { selectors: exampleSelectors });

          onSendMessage({
            type: 'bot',
            content: `He agregado algunos selectores de ejemplo para empezar. Puedes ver y modificar estos selectores seleccionando la capa "${layerName}" en el sidebar.

${layerType === 'pdf' 
  ? '💡 **Para PDFs**: Los selectores usan prompts de IA para identificar contenido específico.'
  : '💡 **Para páginas web**: Los selectores usan CSS para encontrar elementos específicos.'
}

¿Te gustaría que ejecute un scraping de prueba con estos selectores?`
          });
        }, 1500);
      } else if (message.toLowerCase().includes('ejecutar') || message.toLowerCase().includes('scraping')) {
        if (layers.length === 0) {
          onSendMessage({
            type: 'bot',
            content: 'Primero necesitas agregar una URL o documento PDF para poder ejecutar el scraping. ¿Podrías compartir la URL que quieres procesar?'
          });
        } else {
          onSendMessage({
            type: 'bot',
            content: `Puedo ejecutar el scraping para cualquiera de tus ${layers.length} capas. Selecciona una capa en el sidebar y presiona el botón "Ejecutar Scraping" para comenzar la extracción de datos.

¿Hay alguna capa específica que te gustaría procesar primero?`
          });
        }
      } else if (message.toLowerCase().includes('ayuda') || message.toLowerCase().includes('cómo')) {
        onSendMessage({
          type: 'bot',
          content: `¡Por supuesto! Te explico cómo usar el sistema:

🌐 **Para agregar contenido**: Simplemente pega una URL o ruta de PDF en el chat
📋 **Para configurar**: Selecciona una capa en el sidebar para ver sus selectores
🎯 **Para personalizar**: Modifica los selectores y variables según tus necesidades
⚡ **Para extraer**: Usa el botón "Ejecutar Scraping" en el workspace

**Tipos de selectores**:
• **Texto**: Para extraer contenido de texto
• **Enlaces**: Para capturar URLs
• **Imágenes**: Para obtener src de imágenes
• **Tablas**: Para extraer datos tabulares

¿Hay algo específico que te gustaría configurar?`
        });
      } else {
        onSendMessage({
          type: 'bot',
          content: `Entiendo que quieres trabajar con: "${message}"

Para ayudarte mejor, puedes:
• Compartir una URL para scraping web
• Subir un PDF para extracción de documentos
• Preguntarme sobre configuración de selectores
• Pedirme que ejecute el scraping de alguna capa existente

¿Cuál de estas opciones te interesa más?`
        });
      }
    }, 800);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const fakeUrl = `file://uploaded/${file.name}`;
      const userMessage = `He subido el archivo: ${file.name}`;
      
      // Crear URL de preview del archivo
      const filePreviewUrl = URL.createObjectURL(file);
      
      // Notificar al componente padre sobre el archivo subido
      onFileUpload({
        file,
        previewUrl: filePreviewUrl,
        fileName: file.name,
        fileSize: file.size
      });
      
      onSendMessage({ type: 'user', content: userMessage });
      processUserMessage(fakeUrl);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.chatInterface}>
      <div className={styles.chatHeader}>
        <h3>Asistente de Scraping</h3>
        <div className={styles.status}>
          {isProcessing ? 'Procesando...' : 'Listo'}
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${styles[message.type]}`}
          >
            <div className={styles.messageContent}>
              {message.content}
            </div>
            <div className={styles.messageTime}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className={`${styles.message} ${styles.bot}`}>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
        <button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className={styles.uploadButton}
        >
            {/* icon upload */}
            <IconDownload />
          {/* <Upload size={16} /> */}
        </button>

        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe una URL, pregunta o sube un PDF..."
          disabled={isProcessing}
          className={styles.messageInput}
        />

        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isProcessing}
          className={styles.sendButton}
        >
            <IconChat />
            {/* icon send */}
          {/* <Send size={16} /> */}
        </button>
      </div>
    </div>
  );
};