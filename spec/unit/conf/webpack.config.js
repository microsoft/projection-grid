var path = require('path');
var _ = require('underscore');
var webpackAlias = require('../../../webpack.alias');
_.extend(webpackAlias, {'sinon': 'sinon/pkg/sinon.js'});

module.exports = {
  output: {
    path: path.resolve('./dist'),
    filename: 'unit-test.js',
    devtoolModuleFilenameTemplate: function (info) {
      if (path.isAbsolute(info.absoluteResourcePath)) {
        return 'webpack-src:///unit-test/' + path.relative('.', info.absoluteResourcePath).replace(/\\/g, '/');
      }
      return info.absoluteResourcePath;
    },
  },
  resolve: {
    alias: webpackAlias,
  },
  module: {
    loaders: [
      {
        test: /sinon\.js$/,
        loader: 'imports?define=>false,require=>false',
      },
      // jade
      { test: /\.jade$/, loader: 'jade-loader' },
      // jade-end
      // es2015
      { test: /\.js$/, exclude: /\bnode_modules\b/, loader: 'babel-loader' },
      // es2015-end
      { test: /\.less$/, loader: 'style!css!less' },
    ],

  },
  babel: { presets: ['es2015'] },
  devtool: 'inline-source-map',
};

