var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var democase = require('gulp-democase');
var webpack = require('webpack');
var del = require('del');
var http = require('http');
var fs = require('fs');
var os = require('os');
var resolve = require('resolve');

var childProcess = require('child_process');
var spawn = childProcess.spawn;

function webpackBuild(configFilePath) {
  return function (cb) {
    webpack(require(configFilePath), function (err, stats) {
      gutil.log(stats.toString({ colors: true }));
      cb(err || stats.hasErrors() && new Error('webpack compile error'));
    });
  };
}

function getSeleniumFilePath() {
  var SELENIUM_NAME = 'selenium-server-standalone-2.53.0.jar';
  return path.resolve(os.tmpdir(), SELENIUM_NAME);
}

gulp.task('download-selenium', function (cb) {
  var filePath = getSeleniumFilePath();
  fs.stat(filePath, function (err) {
    if (!err) {
      return cb(null);
    }
    var file = fs.createWriteStream(filePath);
    var URL = "http://selenium-release.storage.googleapis.com/2.53/selenium-server-standalone-2.53.0.jar";
    http.get(URL, function (response) {
      response.pipe(file);
    });
    file.on('error', function (err) {
      fs.unlinkSync(filePath);
      cb(err);
    });
    file.on('finish', cb);
  });
});

function startSeleniumServer() {
  var filePath = getSeleniumFilePath();
  console.log(filePath);
  return require('child_process').spawn('java', ['-jar', filePath], { stdio: 'inherit' });
}

//
// Don't use Karma API for now
// For karma version 0.13.19 - 0.13.22, there's issue 1788
// -- Karma 0.13.19 taking long time to complete when run via gulp
// https://github.com/karma-runner/karma/issues/1788
// We should switch back to Karma API when the issue is fixed
//
// var Server = require('karma').Server;
//

gulp.task('test:unit', function (cb) {
  var handler = function (code) {
    if (code) {
      cb(new Error('test failure'));
    } else {
      cb();
    }
  };

  //
  // Don't use Karma API for now
  //
  // new Server({
  //   configFile: path.join(__dirname, 'karma.conf.js'),
  //   singleRun: true,
  // }, handler).start();
  //

  var karmaCmd = path.resolve('./node_modules/.bin/karma');

  if (process.platform === 'win32') {
    karmaCmd += '.cmd';
  }

  spawn(karmaCmd, [
    'start',
    '--single-run',
  ], { stdio: 'inherit' }).on('close', handler);
});

gulp.task('static', function () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('webpack', webpackBuild('./webpack.config'));

gulp.task('demos', function () {
  return gulp.src('./demos').pipe(democase());
});

gulp.task('test:demos', ['download-selenium'], function (done) {
  var pathCli = path.resolve(path.dirname(resolve.sync('webdriverio', {
    basedir: '.',
  })), 'lib/cli');
  var cp = startSeleniumServer();

  childProcess.fork(pathCli, [path.join(__dirname, 'wdio.conf.js')], {
    env: { DEMOCASE_HTTP_PORT: 8081 },
  }).on('close', function (code) {
    cp.kill();
    if (code) {
      done(new Error('selenium test failue'));
    }
  });
});

gulp.task('test', ['test:unit', 'test:demos']);

gulp.task('prepublish', ['webpack']);

gulp.task('clean:test', function () {
  return del([
    'test-results',
    'coverage',
  ]);
});

gulp.task('clean:build', function () {
  return del(['dist']);
});

gulp.task('clean', ['clean:build', 'clean:test']);

gulp.task('default', ['static', 'webpack']);
