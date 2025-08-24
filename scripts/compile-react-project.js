#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function createCompilableProject(projectFiles, cssFiles, outputDir = './temp-react-project') {
  console.log('🚀 Creando proyecto React compilable...');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const packageJson = {
    name: "react-preview-project",
    version: "1.0.0",
    scripts: {
      start: "parcel src/index.html",
      build: "parcel build src/index.html",
      preview: "parcel preview"
    },
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0"
    },
    devDependencies: {
      "parcel": "^2.9.0"
    }
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );
  
  const srcDir = path.join(outputDir, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  
  const indexHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React App Preview</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./main.jsx"></script>
</body>
</html>`;
  
  fs.writeFileSync(path.join(srcDir, 'index.html'), indexHtml);
  
  const mainJsx = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`;
  
  fs.writeFileSync(path.join(srcDir, 'main.jsx'), mainJsx);
  
  Object.entries(projectFiles).forEach(([filePath, content]) => {
    const fullPath = path.join(srcDir, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content);
  });
  
  Object.entries(cssFiles).forEach(([filePath, content]) => {
    const fullPath = path.join(srcDir, filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content);
  });
  
  return outputDir;
}

function compileWithParcel(projectDir) {
  try {
    execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
    
    execSync('npm run build', { cwd: projectDir, stdio: 'inherit' });
    
    
    return path.join(projectDir, 'dist');
  } catch (error) {
    console.error('❌ Error durante la compilación:', error.message);
    return null;
  }
}

function startDevServer(projectDir) {
  
  try {
    if (!fs.existsSync(path.join(projectDir, 'node_modules'))) {
      execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
    }
    
    execSync('npm start', { cwd: projectDir, stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error.message);
  }
}

if (require.main === module) {
  const projectFiles = {
    'App.jsx': `
import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="App">
      <h1>React App Compilada</h1>
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  );
}

export default App;`
  };
  
  const cssFiles = {
    'App.css': `
.App {
  text-align: center;
  padding: 20px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
`
  };
  
  const projectDir = createCompilableProject(projectFiles, cssFiles);
  
  const distDir = compileWithParcel(projectDir);
  
  if (distDir) {
    console.log('🎉 ¡Proyecto compilado exitosamente!');
    console.log('📁 Archivos en:', distDir);
  }
}

module.exports = {
  createCompilableProject,
  compileWithParcel,
  startDevServer
}; 