var _ = require('underscore');
var path = require('path');

function getWebpackConfig() {
  var webpackConfig = _.omit(require('./webpack.config'), 'entry', 'externals');
  _.defaults(webpackConfig, { module: {} });

  webpackConfig.module.preLoaders = [
    {
      test: /\.js$/,
      include: path.resolve('./js/'),
      loader: 'istanbul-instrumenter',
    },
  ].concat(webpackConfig.module.preLoaders || []);

  return webpackConfig;
}

module.exports = function (config) {
  config.set({
    files: [
      'spec/$speclist.js',
    ],

    frameworks: [
      'mocha',
    ],

    client: {
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
      },
    },

    reporters: ['mocha', 'coverage'],

    preprocessors: {
      'spec/$speclist.js': ['webpack'],
    },

    webpack: getWebpackConfig(),

    coverageReporter: {
      type: 'html',
      dir: 'coverage',
    },

    browsers: [
      'PhantomJS',
      // 'Chrome',
    ],
  });
};
