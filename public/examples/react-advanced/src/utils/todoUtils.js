export const saveTodosToStorage = (todos) => {
  try {
    localStorage.setItem('todos', JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

export const loadTodosFromStorage = () => {
  try {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
    return [];
  }
};

export const filterTodos = (todos, filter) => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const getTodoStats = (todos) => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = total - completed;
  
  return { total, completed, active };
}; 