var _ = require('underscore');
var path = require('path');

function getWebpackConfig() {
  var webpackConfig = require('./webpack.config');

  webpackConfig.module.preLoaders = [
    {
      test: /\.js$/,
      include: path.resolve('./js/'),
      loader: 'isparta',
    },
  ].concat(webpackConfig.module.preLoaders || []);
  return webpackConfig;
}

module.exports = function (config) {
  //files fild set in gulpfile.js in the root folder.
  config.set({
    basePath: '../../../',
    frameworks: [
      'mocha',
    ],
    client: {
      mocha: {
        reporter: 'html', // change Karma's debug.html to the mocha web reporter
      },
    },
    reporters: ['mocha', 'coverage', 'junit'],
    webpack: getWebpackConfig(),
    coverageReporter: {
      dir: './spec/integrated/coverage',
      reporters: [
        { type: 'html', subdir: 'report-html' },
        { type: 'lcov', subdir: 'report-lcov' },
      ],
    },
    junitReporter: {
      outputDir: './spec/integrated/test-results/',
    },
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
