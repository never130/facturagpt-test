const VERSION = 1;
const http = require("http");
const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const api = require(`./routers/index`);
const { validAutomate } = require("./services/automate/core");
const { connectDB } = require("./services/automate/utils");
const vm = require('vm');

const babel = require('@babel/core');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const app = express();
const server = http.createServer(app);

const fs = require("fs");

require("dotenv").config();


app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "500mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);

app.use((req, res, next) => {
  next();
});

const pdfsPath = path.join(__dirname, "public", "pdfs");

app.use("/pdfs", express.static(pdfsPath));

app.get("/api/worker.js", (req, res) => {
  const workerPath = path.join(__dirname, "../public/worker.js");

  if (!fs.existsSync(workerPath)) {
    console.error("El archivo worker.js no existe en:", workerPath);
    return res.status(404).send("Worker not found");
  }

  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Service-Worker-Allowed", "/");
  res.sendFile(workerPath);
});




app.get('/api/viewer/:userId/:chatId/:appId?', async (req, res) => {
  try {

    const { userId, chatId, appId } = req.params;


    if (userId == 'undefined' || chatId == 'undefined' || appId == 'undefined') {
      return res.status(404).send('Chat not found');
    }

    const dbChat = await connectDB(`db_${userId}_app`)

    const chat = await dbChat.find({
      selector: {
        appId: appId,
      }
    })



    let files = {}



    if (chat.docs.length > 1) {
      const docsToDelete = chat.docs.slice(1);
      
      for (const doc of docsToDelete) {
        try {
          await dbChat.destroy(doc._id, doc._rev);
        } catch (err) {
          console.error('Error deleting doc:', err);
        }
      }

      files = chat.docs[0].files;
    }

    if (chat.docs.length === 0) {

      const projectsPath = path.join(__dirname, '../public/examples/projects.json');
      const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
      
      const reactAppTemplate = projectsData.projects.find(p => p.id === appId);

    
      
      if (!reactAppTemplate) {
        return res.status(500).send('Template not found');
      }

      const newApp = {
        _id: appId,
        appId: appId,
        files: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      for (const filePath of reactAppTemplate.files) {
        const templateFilePath = path.join(__dirname, `../public/examples/${appId}`, filePath);
        if (fs.existsSync(templateFilePath)) {
          const content = fs.readFileSync(templateFilePath, 'utf8');
          files[filePath] = content;
        }
      }

      
      newApp.files = files;

      await dbChat.insert(newApp);
    } else { 
      files = chat.docs[0].files;
    }


    const jsxFiles = {};
    const jsFiles = {};
    const cssFiles = {};

    let jsxMain;

    const cleanCode = (content) => {
      let convertedCode = content;
      convertedCode = convertedCode
        .replace(/export\s+default\s+([^;]+);?\s*/g, 'module.exports.default = $1;')
        .replace(/export\s+function\s+(\w+)/g, (match, funcName) => {
          return match.replace(/export\s+/, '');
        })
        .replace(/export\s+(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\([^)]*\)\s*=>)/g, (match, varName) => {
          return match;
        })
        .replace(/export\s+(?:const|let|var|class)\s+(\w+)(?!\s*=\s*(?:function|\([^)]*\)\s*=>))/g, 'module.exports.$1 = $1;')
        .replace(/export\s*\{([^}]+)\};?\s*/g, (match, exports) => {
          const exportNames = exports.split(',').map(exp => exp.trim());
          return exportNames.map(name => `module.exports.${name} = ${name};`).join('\n');
        })
        .trim();

      return convertedCode;
    };


    const babel = require('@babel/core');


    Object.entries(files).forEach(([name, content]) => {

      if (name.endsWith('.jsx')) {
        if (name.endsWith('App.jsx')) {
          jsxMain = content;
        } else {
          jsxFiles[name] = content;
        }
      } else if (name.endsWith('.js')) {
        jsFiles[name] = cleanCode(content);
      } else if (name.endsWith('.css')) {
        cssFiles[name] = content;
      }
    });

    const combineCode = () => {
      const allImports = new Set();

      const extractImports = (codeString) => {
        const imports = [];
        const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s*,?\s*)*\s*from\s+['"]([^'"]+)['"];?/g;
        let match;
        while ((match = importRegex.exec(codeString)) !== null) {
          const fullImport = match[0];
          const path = match[1];
          if (!path.startsWith('./') && !path.startsWith('../')) {
            imports.push(fullImport);
          }
        }
        return imports;
      };

      const cleanCodeFromString = (codeString) => {
        return codeString
          .replace(/import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s*,?\s*)*\s*from\s+['"][^'"]+['"];?\s*/g, '')
          .replace(/import\s+['"][^'"]+['"];?\s*/g, '') 
          .replace(/export\s+(?:default\s+)?(?:class|const|let|var|interface|type)\s+[^{]+(?!\s*=\s*(?:function|\([^)]*\)\s*=>))/g, '')
          .replace(/export\s+function\s+(\w+)/g, (match, funcName) => {
            return match.replace(/export\s+/, '');
          })
          .replace(/export\s*\{[^}]+\};?\s*/g, '')
          .replace(/export\s+default\s+[^;]+;?\s*/g, '')
          .trim();
      };

      if (jsxMain) {
        const mainImports = extractImports(jsxMain);
        mainImports.forEach(imp => allImports.add(imp));
      }

      Object.values(jsxFiles).forEach(fileString => {
        const fileImports = extractImports(fileString);
        fileImports.forEach(imp => allImports.add(imp));
      });

      let combinedContent = '';

      if (allImports.size > 0) {
        const importsByLibrary = new Map();

        Array.from(allImports).forEach(imp => {
          const libraryMatch = imp.match(/from\s+['"]([^'"]+)['"]/);
          if (libraryMatch) {
            const library = libraryMatch[1];
            if (!importsByLibrary.has(library)) {
              importsByLibrary.set(library, new Set());
            }
            importsByLibrary.get(library).add(imp);
          }
        });

        const finalImports = [];

        importsByLibrary.forEach((imports, library) => {
          const allItems = new Set();
          let hasDefaultImport = false;
          let defaultImportName = '';

          Array.from(imports).forEach(imp => {
            let namedMatch = imp.match(/import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"]/);
            if (namedMatch) {
              const items = namedMatch[1].split(',').map(item => item.trim());
              items.forEach(item => allItems.add(item));
            }

            namedMatch = imp.match(/import\s+\w+,\s*\{([^}]+)\}\s+from\s+['"][^'"]+['"]/);
            if (namedMatch) {
              const items = namedMatch[1].split(',').map(item => item.trim());
              items.forEach(item => allItems.add(item));
            }

            const defaultMatch = imp.match(/import\s+(\w+)\s+from\s+['"][^'"]+['"]/);
            if (defaultMatch && !imp.includes('{') && !imp.includes('*')) {
              hasDefaultImport = true;
              defaultImportName = defaultMatch[1];
            }

            const mixedDefaultMatch = imp.match(/import\s+(\w+),\s*\{[^}]+\}\s+from\s+['"][^'"]+['"]/);
            if (mixedDefaultMatch) {
              hasDefaultImport = true;
              defaultImportName = mixedDefaultMatch[1];
            }
          });


          let combinedImport = '';
          if (hasDefaultImport && allItems.size > 0) {
            combinedImport = `import ${defaultImportName}, { ${Array.from(allItems).join(', ')} } from '${library}';`;
          } else if (hasDefaultImport) {
            combinedImport = `import ${defaultImportName} from '${library}';`;
          } else if (allItems.size > 0) {
            combinedImport = `import { ${Array.from(allItems).join(', ')} } from '${library}';`;
          }

          if (combinedImport) {
            finalImports.push(combinedImport);
          }
        });

        combinedContent = finalImports.join('\n') + '\n\n';
      }

      if (jsxMain) {
        combinedContent += cleanCodeFromString(jsxMain) + '\n\n';
      }

      Object.values(jsxFiles).forEach(fileString => {
        combinedContent += cleanCodeFromString(fileString) + '\n\n';
      });

      return combinedContent.trim();
    };

    let fullCode = cleanCode(combineCode());

    const serverTransformed = babel.transformSync(fullCode, {
      presets: [
        ['@babel/preset-env', {
          targets: { node: 'current' },
          modules: 'commonjs'
        }],
        '@babel/preset-react'
      ],
      filename: 'App.js'
    });

    const clientTransformed = babel.transformSync(fullCode, {
      presets: [
        ['@babel/preset-env', {
          targets: 'defaults',
          modules: false
        }],
        '@babel/preset-react'
      ],
      filename: 'App.mjs',
      sourceType: 'module'
    });

    const sandbox = {
      module: { exports: {} },
      exports: {},
      require,
      React,
    };

    const codeWithExport = serverTransformed.code + '\nmodule.exports.default = App;';
    vm.runInNewContext(codeWithExport, sandbox);

    const clientCode = clientTransformed.code + '\nwindow.App = App;';
    const combinedCSS = Object.values(cssFiles).join('\n\n');
    const combinedJS = Object.values(jsFiles).join('\n\n');

    const App = sandbox.module.exports.default;
    const html = ReactDOMServer.renderToString(React.createElement(App));


    res.send(`
        <!DOCTYPE html>
        <!-- React y ReactDOM para client-side rendering -->
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Dynamic App</title>
          <style>
            html { margin: 0; padding: 0; }
            ${combinedCSS}
          </style>
          <script type="importmap">
          {
            "imports": {
              "react": "https://esm.sh/react@18",
              "react-dom": "https://esm.sh/react-dom@18",
              "react-dom/client": "https://esm.sh/react-dom@18/client"
            }
          }
          </script>
        </head>
        <body>
          <div id="root">${html}</div>
          <script>
            ${combinedJS}
          </script>
          <script type="module">
            import ReactDOM from "react-dom/client";
            ${clientCode}
            document.addEventListener('DOMContentLoaded', () => {
              setTimeout(() => {
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(React.createElement(App));
              }, 100);
            });
          </script>
        </body>
        </html>
      `);

  } catch (error) {
    console.error('error', error);
  }
});





const PORT = 3006;
server.listen(PORT, () => {

  const isProduction = process.argv.includes('-pro');



  if (true) {
    
  }
});











