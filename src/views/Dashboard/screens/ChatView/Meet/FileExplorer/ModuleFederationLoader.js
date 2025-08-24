
class ModuleFederationLoader {
  constructor() {
    this.modules = new Map();
    this.remoteModules = new Map();
    this.sharedModules = new Map();
    this.loadingPromises = new Map();
  }

  setSharedModules(modules) {
    for (const [name, module] of Object.entries(modules)) {
      this.sharedModules.set(name, module);
    }
    console.log('📦 Shared modules configured:', Object.keys(modules));
  }

  registerRemote(name, url, scope = 'default') {
    this.remoteModules.set(name, { url, scope });
    console.log(`🌐 Remote module registered: ${name} -> ${url}`);
  }

  async loadModule(modulePath) {
    if (this.loadingPromises.has(modulePath)) {
      return await this.loadingPromises.get(modulePath);
    }

    const loadingPromise = this._loadModuleInternal(modulePath);
    this.loadingPromises.set(modulePath, loadingPromise);

    try {
      const result = await loadingPromise;
      this.loadingPromises.delete(modulePath);
      return result;
    } catch (error) {
      this.loadingPromises.delete(modulePath);
      throw error;
    }
  }

  async _loadModuleInternal(modulePath) {
    if (this.sharedModules.has(modulePath)) {
      return this.sharedModules.get(modulePath);
    }

    if (this.modules.has(modulePath)) {
      return this.modules.get(modulePath);
    }

    const remoteModule = await this._loadRemoteModule(modulePath);
    if (remoteModule) {
      return remoteModule;
    }

    if (modulePath === 'react') {
      return { default: window.React, ...window.React };
    }
    if (modulePath === 'react-dom') {
      return { default: window.ReactDOM, ...window.ReactDOM };
    }

    console.warn(`Module not found: ${modulePath}`);
    return {};
  }

  async _loadRemoteModule(modulePath) {
    for (const [name, remote] of this.remoteModules.entries()) {
      if (modulePath.startsWith(name + '/')) {
        try {
          const remoteModule = await this._fetchRemoteModule(remote.url, modulePath);
          return remoteModule;
        } catch (error) {
          console.error(`Failed to load remote module ${modulePath}:`, error);
        }
      }
    }
    return null;
  }

  async _fetchRemoteModule(url, modulePath) {
    try {
      const response = await fetch(`${url}/modules/${modulePath}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const moduleData = await response.json();
      return moduleData.exports;
    } catch (error) {
      console.error(`Error fetching remote module ${modulePath}:`, error);
      throw error;
    }
  }

  register(path, code, options = {}) {
    const moduleId = this.normalizeId(path);
    
    this.modules.set(moduleId, {
      code,
      path,
      exports: {},
      dependencies: new Set(),
      isFederated: options.federated || false,
      exposes: options.exposes || []
    });

    console.log(`📦 Local module registered: ${moduleId}`);
  }

  normalizeId(id) {
    return id
      .replace(/\.(jsx?|tsx?)$/, '')
      .replace(/^\.\//, '')
      .replace(/^src\//, '');
  }

  async resolve(modulePath, parentPath = '') {
    if (modulePath.startsWith('./') || modulePath.startsWith('../')) {
      modulePath = this.resolveRelativePath(modulePath, parentPath);
    }

    return await this.loadModule(modulePath);
  }

  resolveRelativePath(modulePath, parentPath) {
    if (!parentPath) return modulePath;

    const parentDir = parentPath.substring(0, parentPath.lastIndexOf('/') + 1);
    return parentDir + modulePath.substring(2);
  }

  async executeModule(code, path, module) {
    try {
      const moduleContext = {
        exports: {},
        require: async (dep) => await this.resolve(dep, path),
        module: { exports: {} },
        __webpack_require__: async (dep) => await this.resolve(dep, path)
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
        'require', 'exports', 'module', 'import', 'export', 'exportDefault', 'exportNamed', '__webpack_require__',
        code
      );

      await moduleFunction(
        moduleContext.require,
        moduleContext.exports,
        moduleContext.module,
        importModule,
        exportNamed,
        exportDefault,
        exportNamed,
        moduleContext.__webpack_require__
      );

      return moduleContext.exports;
    } catch (error) {
      console.error(`Error executing module ${path}:`, error);
      throw error;
    }
  }

  async loadProject(files, options = {}) {
    console.log('🚀 Loading project with Module Federation...');

    if (options.shared) {
      this.setSharedModules(options.shared);
    }

    if (options.remotes) {
      for (const [name, remote] of Object.entries(options.remotes)) {
        this.registerRemote(name, remote.url, remote.scope);
      }
    }

    for (const [path, content] of Object.entries(files)) {
      if (path.endsWith('.js') || path.endsWith('.jsx') || path.endsWith('.ts') || path.endsWith('.tsx')) {
        this.register(path, content, {
          federated: options.federated || false,
          exposes: options.exposes || []
        });
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

  exposeModule(name, modulePath) {
    const module = this.modules.get(this.normalizeId(modulePath));
    if (module) {
      module.exposes.push(name);
      console.log(`📤 Module exposed: ${name} -> ${modulePath}`);
    }
  }

  getExposedModules() {
    const exposed = {};
    for (const [path, module] of this.modules.entries()) {
      for (const expose of module.exposes) {
        exposed[expose] = module.exports;
      }
    }
    return exposed;
  }

  clearCache() {
    this.loadingPromises.clear();
    for (const module of this.modules.values()) {
      module.exports = {};
    }
  }

  getStats() {
    return {
      localModules: this.modules.size,
      remoteModules: this.remoteModules.size,
      sharedModules: this.sharedModules.size,
      loadingPromises: this.loadingPromises.size
    };
  }
}

export default ModuleFederationLoader; 