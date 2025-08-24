import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <h1>🎯 Todo App Avanzada</h1>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
        </button>
      </header>

      <main className="main">
        <div className="todo-container">
          <form onSubmit={addTodo} className="todo-form">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="¿Qué necesitas hacer?"
              className="todo-input"
            />
            <button type="submit" className="btn btn-primary">
              ➕ Agregar
            </button>
          </form>

          <div className="todo-stats">
            <div className="stat">
              <span className="stat-number">{todos.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-number">{activeCount}</span>
              <span className="stat-label">Pendientes</span>
            </div>
            <div className="stat">
              <span className="stat-number">{completedCount}</span>
              <span className="stat-label">Completadas</span>
            </div>
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              📋 Todas
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              ⏳ Pendientes
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              ✅ Completadas
            </button>
          </div>

          <div className="todo-list">
            {filteredTodos.length === 0 ? (
              <div className="empty-state">
                <p>📝 No hay tareas {filter !== 'all' ? `en ${filter === 'active' ? 'pendientes' : 'completadas'}` : ''}</p>
              </div>
            ) : (
              filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className={`todo-item ${todo.completed ? 'completed' : ''}`}
                >
                  <button
                    className="todo-toggle"
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.completed ? '✅' : '⭕'}
                  </button>
                  <span className="todo-text">{todo.text}</span>
                  <button
                    className="todo-delete"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>

          {todos.length > 0 && (
            <div className="todo-actions">
              <button
                className="btn btn-warning"
                onClick={() => setTodos(todos.filter(todo => !todo.completed))}
              >
                🧹 Limpiar Completadas
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setTodos([])}
              >
                🗑️ Limpiar Todo
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App; 