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
var jsdoc = require('gulp-jsdoc3');
var Server = require('karma').Server;

var childProcess = require('child_process');
var spawn = childProcess.spawn;

var specUnit = './spec/unit/$speclist.js';
var unitFilePath = [specUnit];
var unitPreprocessor = {};
unitPreprocessor[specUnit] = ['webpack', 'sourcemap'];

var specIntegrated = './spec/integrated/$speclist.js';
var integratedFilePath = ['./node_modules/babel-polyfill/dist/polyfill.js', specIntegrated];
var integratedPreprocessor = {};
integratedPreprocessor[specIntegrated] = ['webpack', 'sourcemap'];

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
  return childProcess.spawn('java', ['-jar', filePath], { stdio: 'inherit' });
}

gulp.task('test:unit', function(done) {
  new Server({
    configFile: path.join(__dirname, './spec/unit/conf/karma.conf.js'),
    files: unitFilePath,
    preprocessors: unitPreprocessor,
    singleRun: true,
  }, done).start();
})

// debug in chrome by default
// Todo: envole yargs to config in cmd
gulp.task('test-debug:unit', function(done) {
  new Server({
    configFile: path.join(__dirname, './spec/unit/conf/karma.debug.conf.js'),
    files: unitFilePath,
    preprocessors: unitPreprocessor,
    singleRun: false,
  }, done).start();
})

gulp.task('test:integrated', function(done) {
  new Server({
    configFile: path.join(__dirname, './spec/integrated/conf/karma.conf.js'),
    files: integratedFilePath,
    preprocessors: integratedPreprocessor,
    singleRun: true,
  }, done).start();
})

// debug in chrome by default
// Todo: envole yargs to config in cmd
gulp.task('test-debug:integrated', function(done) {
  new Server({
    configFile: path.join(__dirname, './spec/integrated/conf/karma.debug.conf.js'),
    files: integratedFilePath,
    preprocessors: integratedPreprocessor,
    singleRun: false,
  }, done).start();
})

gulp.task('static', function () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('jsdoc', function (cb) {
  gulp.src(['README.md', './js/vnext/**/*.js'], { read: false })
    .pipe(jsdoc(require('./jsdoc.json'), cb));
});

gulp.task('webpack', webpackBuild('./webpack.config'));

gulp.task('demos', function () {
  return gulp.src('./demos').pipe(democase());
});

gulp.task('test:demos', ['download-selenium'], function (done) {
  var pathCli = path.resolve(path.dirname(resolve.sync('webdriverio', {
    basedir: '.',
  })), 'lib/cli');
  var cpSelenium = null;
  var cpWdio = null;

  cpSelenium = startSeleniumServer().on('error', function () {
    if (cpWdio) {
      cpWdio.kill();
    }
    done(new Error('Failed to launch the selenium standalone server. Make sure you have JRE available'));
  });

  cpWdio = childProcess.fork(pathCli, [path.join(__dirname, 'wdio.conf.js')], {
    env: { DEMOCASE_HTTP_PORT: 8081 },
  }).on('close', function (code) {
    cpSelenium.kill();
    if (code) {
      done(new Error('selenium test failue'));
    }
    done();
  });
});

gulp.task('test', ['test:unit', 'test:integrated']);

gulp.task('prepublish', ['webpack']);

gulp.task('clean:test', function () {
  return del([
    './spec/*/test-results',
    './spec/*/coverage',
    'errorShots',
  ]);
});

gulp.task('clean:build', function () {
  return del(['dist']);
});

gulp.task('clean', ['clean:build', 'clean:test']);
gulp.task('default', ['webpack']);
