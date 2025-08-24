class SystemJSModuleLoader {
  constructor() {
    this.modules = new Map();
    this.moduleCache = new Map();
    this.importMap = new Map();
  }

  register(path, code) {
    this.modules.set(path, code);
    console.log(`📦 Module registered: ${path}`);
  }

  async resolve(modulePath, parentPath = '') {
    const cacheKey = `${parentPath}:${modulePath}`;
    
    if (this.moduleCache.has(cacheKey)) {
      return this.moduleCache.get(cacheKey);
    }

    const normalizedPath = this.normalizePath(modulePath, parentPath);
    
    const module = this.modules.get(normalizedPath);
    if (module) {
      const result = await this.executeModule(module, normalizedPath);
      this.moduleCache.set(cacheKey, result);
      return result;
    }

    if (modulePath === 'react') {
      return window.React;
    }
    if (modulePath === 'react-dom') {
      return window.ReactDOM;
    }

    console.warn(`Module not found: ${modulePath}`);
    return {};
  }

  normalizePath(modulePath, parentPath) {
    if (modulePath.startsWith('./') || modulePath.startsWith('../')) {
      const parentDir = parentPath.substring(0, parentPath.lastIndexOf('/') + 1);
      return parentDir + modulePath.substring(2);
    }
    
    const possiblePaths = [
      modulePath,
      `src/${modulePath}`,
      `src/${modulePath.replace('.jsx', '.js')}`,
      `src/${modulePath.replace('.js', '.jsx')}`,
      modulePath.replace('.jsx', ''),
      modulePath.replace('.js', '')
    ];

    for (const path of possiblePaths) {
      if (this.modules.has(path)) {
        return path;
      }
    }

    return modulePath;
  }

  async executeModule(code, path) {
    try {
      const moduleContext = {
        exports: {},
        require: (dep) => this.resolve(dep, path),
        module: { exports: {} }
      };

      const importModule = async (dep) => await this.resolve(dep, path);
      const exportDefault = (value) => {
        moduleContext.exports.default = value;
        moduleContext.module.exports.default = value;
      };
      const exportNamed = (name, value) => {
        moduleContext.exports[name] = value;
        moduleContext.module.exports[name] = value;
      };

      const moduleFunction = new Function(
        'require', 'exports', 'module', 'import', 'export', 'exportDefault', 'exportNamed',
        code
      );

      await moduleFunction(
        moduleContext.require,
        moduleContext.exports,
        moduleContext.module,
        importModule,
        exportNamed,
        exportDefault,
        exportNamed
      );

      return moduleContext.exports;
    } catch (error) {
      console.error(`Error executing module ${path}:`, error);
      throw error;
    }
  }

  async loadProject(files) {
    
    for (const [path, content] of Object.entries(files)) {
      if (path.endsWith('.js') || path.endsWith('.jsx')) {
        this.register(path, content);
      }
    }

    const mainModule = this.findMainModule();
    if (!mainModule) {
      throw new Error('No se encontró un módulo principal');
    }

    return await this.resolve(mainModule);
  }

  findMainModule() {
    const priorities = [
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
      if (this.modules.has(priority)) {
        return priority;
      }
    }

    for (const [path, content] of this.modules.entries()) {
      if (content.includes('function') || content.includes('const') || content.includes('class')) {
        if (content.includes('return') || content.includes('React.createElement')) {
          return path;
        }
      }
    }

    return null;
  }

  clearCache() {
    this.moduleCache.clear();
    console.log('🧹 Module cache cleared');
  }
}

export default SystemJSModuleLoader; 