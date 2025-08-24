import React from 'react';
import ExampleComponent from './components/ExampleComponent';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#667eea' }}>🚀 Mi Aplicación React</h1>
      <p>¡Hola! Este es un componente de ejemplo.</p>
      <button 
        style={{ 
          background: '#667eea', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => alert('¡Hola desde React!')}
      >
        👋 Hacer clic
      </button>
      
      <ExampleComponent />
    </div>
  );
}

export default App; 