import React, { useState } from 'react';
import Counter from './components/Counter';
import './App.css';

function App() {
  const [name, setName] = useState('Usuario');

  return (
    <div className="App">
      <header className="App-header">
        <h1>¡Hola, {name}!</h1>
        <p>Esta es una aplicación React de ejemplo con múltiples componentes</p>
        
        <div className="counters-section">
          <Counter title="Contador Principal" initialValue={0} />
          <Counter title="Contador Secundario" initialValue={10} />
        </div>
        
        <div className="input-section">
          <label>
            Tu nombre:
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre"
            />
          </label>
        </div>
        
        <div className="info-section">
          <h3>Características de esta app:</h3>
          <ul>
            <li>✅ Hooks de React (useState)</li>
            <li>✅ Eventos y manejo de estado</li>
            <li>✅ Componentes funcionales</li>
            <li>✅ Múltiples archivos JSX</li>
            <li>✅ JSX y estilos CSS</li>
            <li>✅ Interactividad completa</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App; 