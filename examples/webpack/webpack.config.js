var url = require('url');
var path = require('path');

module.exports = {
  entry: path.join(__dirname, './index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'projection-grid-example.js',
    devtoolModuleFilenameTemplate: function (info) {
      var comps = url.parse(info.absoluteResourcePath);

      if (comps.protocol) {
        return info.absoluteResourcePath;
      }

      return 'webpack-src:///projection-grid-example/' + path.relative('.', info.absoluteResourcePath);
    },
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: "source-map-loader" },
    ],
  },
  devtool: 'source-map',
};
