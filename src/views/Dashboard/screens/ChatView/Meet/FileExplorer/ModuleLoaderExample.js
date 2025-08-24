
import SystemJSModuleLoader from './SystemJSModuleLoader';
import ViteModuleLoader from './ViteModuleLoader';
import ModuleFederationLoader from './ModuleFederationLoader';

export const useSystemJSLoader = (files) => {
  const loader = new SystemJSModuleLoader();
  
  return async () => {
    try {
      console.log('🚀 Using SystemJS Module Loader...');
      
      const mainModule = await loader.loadProject(files);
      
      console.log('✅ SystemJS project loaded successfully');
      return mainModule;
    } catch (error) {
      console.error('❌ SystemJS loader error:', error);
      throw error;
    }
  };
};

export const useViteLoader = (files) => {
  const loader = new ViteModuleLoader();
  
  return async () => {
    try {
      console.log('🚀 Using Vite-like Module Loader...');
      
      const mainModule = await loader.loadProject(files);
      
      console.log('✅ Vite project loaded successfully');
      return mainModule;
    } catch (error) {
      console.error('❌ Vite loader error:', error);
      throw error;
    }
  };
};

export const useModuleFederationLoader = (files, options = {}) => {
  const loader = new ModuleFederationLoader();
  
  return async () => {
    try {
      console.log('🚀 Using Module Federation Loader...');
      
      const defaultOptions = {
        shared: {
          react: window.React,
          'react-dom': window.ReactDOM
        },
        remotes: {},
        federated: false,
        exposes: []
      };
      
      const config = { ...defaultOptions, ...options };
      
      const mainModule = await loader.loadProject(files, config);
      
      console.log('✅ Module Federation project loaded successfully');
      return mainModule;
    } catch (error) {
      console.error('❌ Module Federation loader error:', error);
      throw error;
    }
  };
};

export const useAutoLoader = (files, options = {}) => {
  const systemJSLoader = new SystemJSModuleLoader();
  const viteLoader = new ViteModuleLoader();
  const federationLoader = new ModuleFederationLoader();
  
  return async () => {
    try {
      console.log('🚀 Using Auto Module Loader...');
      
      const projectType = detectProjectType(files);
      
      let mainModule;
      
      switch (projectType) {
        case 'vite':
          console.log('📦 Detected Vite project, using Vite loader...');
          mainModule = await viteLoader.loadProject(files);
          break;
          
        case 'federation':
          console.log('🌐 Detected Module Federation project, using Federation loader...');
          mainModule = await federationLoader.loadProject(files, options);
          break;
          
        default:
          console.log('📦 Using SystemJS loader as fallback...');
          mainModule = await systemJSLoader.loadProject(files);
          break;
      }
      
      console.log('✅ Auto loader completed successfully');
      return mainModule;
    } catch (error) {
      console.error('❌ Auto loader error:', error);
      throw error;
    }
  };
};

const detectProjectType = (files) => {
  const viteIndicators = [
    'vite.config.js',
    'vite.config.ts',
    'import.meta.env',
    'import.meta.hot'
  ];
  
  const federationIndicators = [
    'webpack.config.js',
    'ModuleFederationPlugin',
    '__webpack_require__',
    'federated'
  ];
  
  const fileContents = Object.values(files).join(' ');
  
  for (const indicator of viteIndicators) {
    if (fileContents.includes(indicator)) {
      return 'vite';
    }
  }
  
  for (const indicator of federationIndicators) {
    if (fileContents.includes(indicator)) {
      return 'federation';
    }
  }
  
  return 'systemjs';
};

export const createModuleLoaderForPreview = (type = 'auto') => {
  return (files, options = {}) => {
    switch (type) {
      case 'systemjs':
        return useSystemJSLoader(files);
      case 'vite':
        return useViteLoader(files);
      case 'federation':
        return useModuleFederationLoader(files, options);
      case 'auto':
      default:
        return useAutoLoader(files, options);
    }
  };
};
