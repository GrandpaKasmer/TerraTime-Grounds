const webpack = require('@nativescript/webpack');

module.exports = (env) => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  // Suppress warnings for optional WebSocket dependencies
  webpack.chainWebpack((config) => {
    config.resolve.set('fallback', {
      'bufferutil': false,
      'utf-8-validate': false,
      'fs': false,
      'path': false,
      'net': false,
      'tls': false
    });
  });

  return webpack.resolveConfig();
};