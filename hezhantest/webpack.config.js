var path = require('path');
module.exports = {
  entry: './entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      'lib/underscore': 'underscore',
      'lib/backbone': 'backbone',
      'lib/jquery': 'jquery',
      'component/grid': path.resolve('../js'),
      'component/popup-editor': path.resolve('../js/popup-editor'),
    },
  },
  module: {
    loaders: [
      { test: /\.jade$/, loader: 'jade-loader' },
      { test: /\.js$/, exclude: /\bnode_modules\b/, loader: 'babel-loader' },
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.json$/, loader: 'json' },
    ],
  },
  babel: { presets: ['es2015'] },
  devtool: 'inline-source-map',
};

