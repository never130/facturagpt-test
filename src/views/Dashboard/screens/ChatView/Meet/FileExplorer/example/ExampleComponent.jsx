import React, { useState, useEffect } from 'react';

function ExampleComponent() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState('light');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    document.title = `Contador: ${count}`;
  }, [count]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`¡Hola ${inputValue}!`);
    setInputValue('');
  };

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <h1>🚀 Componente de Ejemplo</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'} Cambiar Tema
        </button>
      </header>

      <main className="main">
        <section className="counter-section">
          <h2>Contador Interactivo</h2>
          <div className="counter">
            <span className="count">{count}</span>
            <div className="counter-buttons">
              <button onClick={() => setCount(count - 1)} className="btn btn-danger">
                ➖ Decrementar
              </button>
              <button onClick={() => setCount(0)} className="btn btn-warning">
                🔄 Reset
              </button>
              <button onClick={() => setCount(count + 1)} className="btn btn-success">
                ➕ Incrementar
              </button>
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Formulario de Ejemplo</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu nombre..."
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              👋 Saludar
            </button>
          </form>
        </section>

        <section className="info-section">
          <h2>Información del Componente</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>🎯 Estado</h3>
              <p>Este componente usa useState para manejar el estado local</p>
            </div>
            <div className="info-card">
              <h3>⏰ Efectos</h3>
              <p>useEffect actualiza el título de la página automáticamente</p>
            </div>
            <div className="info-card">
              <h3>🎨 Temas</h3>
              <p>Cambia entre tema claro y oscuro con un solo clic</p>
            </div>
            <div className="info-card">
              <h3>📝 Formularios</h3>
              <p>Manejo de formularios con estado controlado</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>✨ Creado con React y CSS Modules</p>
      </footer>
    </div>
  );
}

export default ExampleComponent; 