
class ViteModuleLoader {
  constructor() {
    this.modules = new Map();
    this.hotModules = new Map();
    this.dependencies = new Map();
    this.transformCache = new Map();
  }

  register(path, code, options = {}) {
    const moduleId = this.normalizeId(path);
    
    this.modules.set(moduleId, {
      code,
      path,
      dependencies: new Set(),
      exports: {},
      isHot: options.hot || false,
      timestamp: Date.now()
    });

    console.log(`📦 Vite module registered: ${moduleId}`);
  }

  normalizeId(id) {
    return id
      .replace(/\.(jsx?|tsx?)$/, '')
      .replace(/^\.\//, '')
      .replace(/^src\//, '');
  }

  async resolve(id, importer = '') {
    const resolvedId = await this.resolveId(id, importer);
    
    if (!resolvedId) {
      if (id === 'react') return { default: window.React, ...window.React };
      if (id === 'react-dom') return { default: window.ReactDOM, ...window.ReactDOM };
      
      console.warn(`Module not found: ${id}`);
      return {};
    }

    return await this.loadModule(resolvedId);
  }

  async resolveId(id, importer) {
    const aliases = {
      '@': 'src',
      '~': 'src'
    };

    let resolvedId = id;

    for (const [alias, replacement] of Object.entries(aliases)) {
      if (id.startsWith(alias)) {
        resolvedId = id.replace(alias, replacement);
        break;
      }
    }

    if (resolvedId.startsWith('./') || resolvedId.startsWith('../')) {
      resolvedId = this.resolveRelativePath(resolvedId, importer);
    }

    const extensions = ['.jsx', '.js', '.tsx', '.ts'];
    for (const ext of extensions) {
      const fullId = resolvedId + ext;
      if (this.modules.has(this.normalizeId(fullId))) {
        return fullId;
      }
    }

    const normalizedId = this.normalizeId(resolvedId);
    if (this.modules.has(normalizedId)) {
      return resolvedId;
    }

    return null;
  }

  resolveRelativePath(id, importer) {
    if (!importer) return id;

    const importerDir = importer.substring(0, importer.lastIndexOf('/') + 1);
    return importerDir + id.substring(2);
  }

  async loadModule(id) {
    const moduleId = this.normalizeId(id);
    const module = this.modules.get(moduleId);

    if (!module) {
      throw new Error(`Module not found: ${id}`);
    }

    if (module.exports && Object.keys(module.exports).length > 0) {
      return module.exports;
    }

    const transformedCode = await this.transform(module.code, id);

    const exports = await this.executeModule(transformedCode, id, module);
    module.exports = exports;

    return exports;
  }

  async transform(code, id) {
    const cacheKey = `${id}:${code.length}`;
    
    if (this.transformCache.has(cacheKey)) {
      return this.transformCache.get(cacheKey);
    }

    let transformedCode = code;

    if (id.endsWith('.jsx') || id.endsWith('.tsx')) {
      transformedCode = this.transformJSX(code);
    }

    transformedCode = this.transformImports(transformedCode, id);

    this.transformCache.set(cacheKey, transformedCode);
    return transformedCode;
  }

  transformJSX(code) {
    if (window.Babel) {
      try {
        return window.Babel.transform(code, {
          presets: ['react'],
          filename: 'module.jsx'
        }).code;
      } catch (error) {
        console.warn('JSX transformation failed:', error);
        return code;
      }
    }
    return code;
  }

  transformImports(code, id) {
    code = code.replace(
      /import\s+(\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/g,
      (match, imports, modulePath) => {
        const importNames = imports.match(/\w+/g);
        return `const ${imports} = await require('${modulePath}');`;
      }
    );

    code = code.replace(
      /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g,
      (match, importName, modulePath) => {
        return `const ${importName} = (await require('${modulePath}')).default;`;
      }
    );

    code = code.replace(
      /export\s+default\s+([^;]+)/g,
      'module.exports.default = $1;'
    );

    code = code.replace(
      /export\s+(?:const|let|var|function|class)\s+(\w+)/g,
      'module.exports.$1 = $1;'
    );

    return code;
  }

  async executeModule(code, id, module) {
    try {
      const moduleContext = {
        exports: {},
        require: async (dep) => await this.resolve(dep, id),
        module: { exports: {} }
      };

      const moduleFunction = new Function(
        'require', 'exports', 'module',
        code
      );

      await moduleFunction(
        moduleContext.require,
        moduleContext.exports,
        moduleContext.module
      );

      return moduleContext.exports;
    } catch (error) {
      console.error(`Error executing module ${id}:`, error);
      throw error;
    }
  }

  async loadProject(files) {
    console.log('🚀 Loading project with Vite-like loader...');

    for (const [path, content] of Object.entries(files)) {
      if (path.endsWith('.js') || path.endsWith('.jsx') || path.endsWith('.ts') || path.endsWith('.tsx')) {
        this.register(path, content, { hot: true });
      }
    }

    const entryPoint = this.findEntryPoint();
    if (!entryPoint) {
      throw new Error('No se encontró un entry point válido');
    }


    return await this.loadModule(entryPoint);
  }

  findEntryPoint() {
    const priorities = [
      'src/main.jsx',
      'src/main.js',
      'src/main.tsx',
      'src/main.ts',
      'src/App.jsx',
      'App.jsx',
      'src/App.js',
      'App.js',
      'src/index.jsx',
      'index.jsx',
      'src/index.js',
      'index.js'
    ];

    for (const priority of priorities) {
      if (this.modules.has(this.normalizeId(priority))) {
        return priority;
      }
    }

    for (const [path, content] of this.modules.entries()) {
      if (content.code.includes('ReactDOM.createRoot') || 
          content.code.includes('ReactDOM.render') ||
          content.code.includes('createRoot')) {
        return path;
      }
    }

    return null;
  }

  async hmrUpdate(path, newCode) {
    const moduleId = this.normalizeId(path);
    const module = this.modules.get(moduleId);

    if (!module) {
      console.warn(`HMR: Module not found: ${path}`);
      return;
    }

    console.log(`🔥 HMR update: ${path}`);

    module.code = newCode;
    module.timestamp = Date.now();

    module.exports = {};
    this.transformCache.clear();

    for (const dep of module.dependencies) {
      const depModule = this.modules.get(dep);
      if (depModule) {
        depModule.exports = {};
      }
    }

    this.dispatchHMRUpdate(path);
  }

  dispatchHMRUpdate(path) {
    const event = new CustomEvent('vite:hmr', {
      detail: { path, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }

  clearCache() {
    this.transformCache.clear();
    for (const module of this.modules.values()) {
      module.exports = {};
    }
  }
}

export default ViteModuleLoader; 