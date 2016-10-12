var _ = require('underscore');
var path = require('path');
var webpackConfig = require('./webpack.config');

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
    preprocessors: {
      '/js/**/*.js': ['coverage'],
    },
    reporters: ['mocha', 'coverage', 'junit'],
    webpack: webpackConfig,
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
      'PhantomJS',
    ],
  });
};
