import React, { useState } from 'react';

function Counter({ initialValue = 0, title = "Contador" }) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return (
    <div className="counter-component">
      <h3>{title}</h3>
      <div className="counter-display">
        <span className="count-value">{count}</span>
      </div>
      <div className="counter-controls">
        <button onClick={decrement} className="counter-btn decrement">
          -
        </button>
        <button onClick={reset} className="counter-btn reset">
          Reset
        </button>
        <button onClick={increment} className="counter-btn increment">
          +
        </button>
      </div>
    </div>
  );
}

export default Counter; 