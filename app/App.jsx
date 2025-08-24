import React from 'react';

const App = ({ name, files = {} }) => {
  const cssFiles = Object.entries(files)
    .filter(([fileName]) => fileName.endsWith('.css'))
    .map(([fileName, content]) => content)
    .join('\n');

  const mainFile = Object.entries(files).find(([fileName]) => 
    fileName.toLowerCase().includes('app') || 
    fileName.toLowerCase().includes('index')
  );

  React.useEffect(() => {
    if (cssFiles) {
      const styleElement = document.createElement('style');
      styleElement.textContent = cssFiles;
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [cssFiles]);

  if (mainFile) {
    try {
      const DynamicComponent = () => {
        return React.createElement('div', {
          className: 'dynamic-app',
          style: { padding: '20px' }
        }, [
          React.createElement('h1', { key: 'title' }, `App: ${mainFile[0]}`),
          React.createElement('p', { key: 'content' }, 'Component rendered dynamically')
        ]);
      };
      
      return React.createElement(DynamicComponent);
    } catch (error) {
      console.error('Error rendering dynamic component:', error);
    }
  }

  return React.createElement('div', {
    style: { padding: '20px', fontFamily: 'Arial, sans-serif' }
  }, [
    React.createElement('h1', { key: 'title' }, `Hello ${name}`),
    React.createElement('p', { key: 'message' }, 'Dynamic component ready')
  ]);
};

export default App;