var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, './index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'projection-grid-example.js',
    devtoolModuleFilenameTemplate: function (info) {
      if (path.isAbsolute(info.absoluteResourcePath)) {
        return 'webpack-src:///projection-grid-example/' + path.relative('.', info.absoluteResourcePath);
      }
      return info.absoluteResourcePath;
    },
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: "source-map-loader" },
    ],
  },
  resolve: {
    alias: {
      'projection-grid': path.resolve(__dirname, '../..'),
    },
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
  devtool: 'source-map',
};
