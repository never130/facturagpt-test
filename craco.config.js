const path = require('path');

const PORT = process.env.PORT || 3005; 

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.resolve.alias['@src'] = path.resolve(__dirname, `src`);
      webpackConfig.resolve.alias['@public'] = path.resolve(__dirname, `public`);

      webpackConfig.entry = {
        main: path.resolve(__dirname, 'src/index.jsx'),
      };

      webpackConfig.output.publicPath = '/';

      webpackConfig.module.rules = webpackConfig.module.rules.filter(
        rule => !rule.use || !rule.use.some(
          use => use.loader && use.loader.includes('source-map-loader')
        )
      );

      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /source-map-loader/,
        /ENOENT: no such file or directory/,
      ];

      return webpackConfig;
    },
  },
  devServer: {
    port: PORT,
    hot: true,
    proxy: {
      '/couchdb': {
        target: 'http://127.0.0.1:5984',
        pathRewrite: { '^/couchdb': '' },
        changeOrigin: true,
        secure: false
      }
    }
  },
  cache: {
    type: 'filesystem',
  },
  style: {
    modules: {
      localIdentName: '[local]_[hash:base64:5]',
    },
  },
};


