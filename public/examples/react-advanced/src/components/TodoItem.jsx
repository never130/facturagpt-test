import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <button
        className="todo-toggle"
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed ? '✅' : '⭕'}
      </button>
      <span className="todo-text">{todo.text}</span>
      <button
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
      >
        🗑️
      </button>
    </div>
  );
};

export default TodoItem; 