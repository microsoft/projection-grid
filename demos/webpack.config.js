var webpack = require('webpack');

var webpackConfig = require('../webpack.config');

webpackConfig.plugins = webpackConfig.plugins || [];
webpackConfig.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));

webpackConfig.module.loaders = webpackConfig.module.loaders.concat([
  { test: /bootstrap[\\\/]js[\\\/]/, loader: 'imports?jQuery=jquery' },
  { test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
  { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
  { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },
]);

module.exports = webpackConfig;
