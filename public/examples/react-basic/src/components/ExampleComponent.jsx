import React, { useState } from 'react';
import '../styles/ExampleComponent.css';

function ExampleComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="example-component">
      <h2>Componente de Ejemplo</h2>
      <p>Contador: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="increment-btn"
      >
        ➕ Incrementar
      </button>
      <button 
        onClick={() => setCount(count - 1)}
        className="decrement-btn"
      >
        ➖ Decrementar
      </button>
    </div>
  );
}

export default ExampleComponent; 