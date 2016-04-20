var webpack = require('webpack');

var webpackConfig = require('../webpack.config');

webpackConfig.plugins = webpackConfig.plugins || [];
webpackConfig.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));

module.exports = webpackConfig;
