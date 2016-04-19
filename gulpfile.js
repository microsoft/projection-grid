var _ = require('lodash');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var file = require('gulp-file');
var webpack = require('webpack');
var esprima = require('esprima');
var escodegen = require('escodegen');
var del = require('del');
var http = require('http');
var fs = require('fs');
var os = require('os');

var pkg = require('./package');

var spawn = require('child_process').spawn;

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

function startExamplePageServer() {
  var nodeStatic = require('node-static');

  var fileServer = new nodeStatic.Server('./');

  return require('http').createServer(function (request, response) {
    request.addListener('end', function () {
      fileServer.serve(request, response);
    }).resume();
  }).listen(8080);
}

gulp.task('run-selenium', ['download-selenium'], function (cb) {
  var cp = startSeleniumServer();
  var exampleServer = startExamplePageServer();
  cp.on('error', cb);
  cp.on('exit', cb);
  var wdioCmd = path.resolve(__dirname, './node_modules/.bin/wdio');
  if (process.platform === 'win32') {
    wdioCmd += '.cmd';
  }
  var testProcess = spawn(wdioCmd, ['wdio.conf.js'], { stdio: 'inherit' });
  testProcess.on('exit', function () {
    exampleServer.close();
    cp.kill();
  });
  testProcess.on('error', function () {
    exampleServer.close();
    cp.kill();
  });
});

//
// Don't use Karma API for now
// For karma version 0.13.19 - 0.13.22, there's issue 1788
// -- Karma 0.13.19 taking long time to complete when run via gulp
// https://github.com/karma-runner/karma/issues/1788
// We should switch back to Karma API when the issue is fixed
//
// var Server = require('karma').Server;
//

gulp.task('test', function (cb) {
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

gulp.task('example:webpack', ['webpack'], webpackBuild('./examples/webpack/webpack.config'));

gulp.task('example:requirejs', function () {
  return file(
    'require.config.js',
    escodegen.generate(
      esprima.parse(
        'var require = ' + JSON.stringify({
          baseUrl: path.relative('examples/requirejs', '.'),
          paths: _.assignIn(_.mapValues(pkg.peerDependencies, function (value, key) {
            return path.relative('.', require.resolve(key)).replace(/\.js$/, '');
          }), {
            'projection-grid': 'dist/projection-grid',
            'bluebird': 'node_modules/bluebird/js/browser/bluebird.min',
          }),
        }) + ';'
      ),
      _.set({}, 'format.indent.style', '  ')
    )
  ).pipe(gulp.dest('./examples/requirejs/'));
});

gulp.task('examples', ['example:webpack', 'example:requirejs']);

gulp.task('prepublish', ['webpack']);

gulp.task('clean:examples', function () {
  return del([
    'examples/webpack/dist',
    'examples/requirejs/require.config.js',
  ]);
});

gulp.task('clean:test', function () {
  return del(['coverage']);
});

gulp.task('clean:build', function () {
  return del(['dist']);
});

gulp.task('clean', ['clean:build', 'clean:test', 'clean:examples']);

gulp.task('default', ['static', 'webpack', 'examples']);
