#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');


const projectName = process.argv[2] || 'react-project';
const outputDir = path.join(process.cwd(), projectName);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const packageJson = {
  name: projectName,
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
fs.mkdirSync(srcDir, { recursive: true });

const indexHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./main.jsx"></script>
</body>
</html>`;

fs.writeFileSync(path.join(srcDir, 'index.html'), indexHtml);

const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`;

fs.writeFileSync(path.join(srcDir, 'main.jsx'), mainJsx);

const appJsx = `import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>¡Hola React!</h1>
        <p>Contador: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Incrementar
        </button>
        <button onClick={() => setCount(count - 1)}>
          Decrementar
        </button>
      </header>
    </div>
  );
}

export default App;`;

fs.writeFileSync(path.join(srcDir, 'App.jsx'), appJsx);

const appCss = `.App {
  text-align: center;
  padding: 20px;
}

.App-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  border-radius: 16px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.App-header h1 {
  margin: 0 0 20px 0;
  font-size: 2.5em;
  font-weight: 700;
}

button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}`;

fs.writeFileSync(path.join(srcDir, 'App.css'), appCss);

const readme = `# ${projectName}

Este es un proyecto React creado con Parcel.

## Comandos disponibles

\`\`\`bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build

# Previsualizar build
npm run preview
\`\`\`

## Características

- ✅ React 18
- ✅ Parcel (zero config)
- ✅ Hot reload
- ✅ CSS automático
- ✅ JSX automático

¡Disfruta desarrollando! 🚀`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readme);

console.log('✅ Proyecto creado en:', outputDir);
console.log('');
console.log('📦 Para instalar dependencias:');
console.log(`   cd ${projectName}`);
console.log('   npm install');
console.log('');
console.log('🚀 Para iniciar el servidor:');
console.log('   npm start');
console.log('');
console.log('🔨 Para compilar:');
console.log('   npm run build'); 