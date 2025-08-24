import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatInterface } from './ChatInterface';
import { ScrapingWorkspace } from './ScrapingWorkspace';
import { ResultsTable } from './ResultsTable';
import styles from './ScrapView.module.css';



export default function App() {
  const [layers, setLayers] = useState([]);
  const [activeLayer, setActiveLayer] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      type: 'bot',
      content: '¡Hola! Soy tu asistente de scraping. Comparte conmigo una URL o documento PDF para comenzar a configurar tu sistema de extracción de datos.',
      timestamp: new Date()
    }
  ]);
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const addChatMessage = (message) => {
    const newMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const addLayer = (layer) => {
    const newLayer = {
      ...layer,
      id: Date.now().toString()
    };
    setLayers(prev => [...prev, newLayer]);
    return newLayer.id;
  };

  const updateLayer = (layerId, updates) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, ...updates } : layer
    ));
  };

  const deleteLayer = (layerId) => {
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    if (activeLayer === layerId) {
      setActiveLayer(null);
    }
  };

  const handleFileUpload = (fileData) => {
    setUploadedFile(fileData);
  };

  const handleClosePreview = () => {
    setUploadedFile(null);
  };

  const executeScrapingForLayer = async (layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    setIsProcessing(true);
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generar datos de ejemplo basados en los selectores
    const mockData = {};
    layer.selectors.forEach(selector => {
      switch (selector.type) {
        case 'text':
          mockData[selector.name] = `Texto extraído de ${selector.selector}`;
          break;
        case 'link':
          mockData[selector.name] = `https://ejemplo.com/enlace-${Math.random()}`;
          break;
        case 'image':
          mockData[selector.name] = `https://picsum.photos/200/200?random=${Math.random()}`;
          break;
        case 'table':
          mockData[selector.name] = [
            { col1: 'Dato 1', col2: 'Dato 2' },
            { col1: 'Dato 3', col2: 'Dato 4' }
          ];
          break;
      }
    });

    const result = {
      id: Date.now().toString(),
      layerName: layer.name,
      data: mockData,
      timestamp: new Date()
    };

    setResults(prev => [...prev, result]);
    setIsProcessing(false);

    // Mensaje del bot confirmando la extracción
    addChatMessage({
      type: 'bot',
      content: `¡Perfecto! He completado la extracción de datos para "${layer.name}". Se han extraído ${Object.keys(mockData).length} campos. Puedes ver los resultados en la tabla de abajo.`
    });
  };

  return (
    <div className={styles.app}>
      <Sidebar 
        layers={layers}
        activeLayer={activeLayer}
        onLayerSelect={setActiveLayer}
        onLayerDelete={deleteLayer}
        onLayersReorder={setLayers}
      />
      
      <div className={styles.mainContent}>
        <div className={styles.topSection}>
          <ChatInterface 
            messages={chatMessages}
            onSendMessage={addChatMessage}
            onAddLayer={addLayer}
            layers={layers}
            onUpdateLayer={updateLayer}
            isProcessing={isProcessing}
            onFileUpload={handleFileUpload}
            onSelectLayer={setActiveLayer}
          />
          
          <ScrapingWorkspace 
            activeLayer={activeLayer ? layers.find(l => l.id === activeLayer) : null}
            onUpdateLayer={updateLayer}
            onExecuteScraping={executeScrapingForLayer}
            isProcessing={isProcessing}
            uploadedFile={uploadedFile}
            onClosePreview={handleClosePreview}
          />
        </div>
        
        <ResultsTable results={results} />
      </div>
    </div>
  );
}