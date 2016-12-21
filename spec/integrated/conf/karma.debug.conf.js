var _ = require('underscore');
var path = require('path');
var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '../../../',
    frameworks: [
      'mocha',
    ],
    reporters: [
      'mocha',
    ],
    client: {
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
      },
    },
    webpack: webpackConfig,
    browsers: [
      'ChromeNoSandbox',
    ],
    customLaunchers: {
      ChromeNoSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
  });
};
