require.config({
  baseUrl                                : '../',
  'paths': {
    'lib/int/jade/jade-util'             : 'component/.test/int/jade-util',
    'lib/squire'                         : 'lib/squire/src/Squire',
    'lib/underscore'                     : 'lib/underscore/underscore',
    'lib/jquery'                         : 'lib/jquery/dist/jquery',
    'lib/backbone'                       : 'lib/backbone/backbone',
    'lib/bootstrap'                      : 'lib/bootstrap/dist/js/bootstrap',
    'component/grid'                     : 'js',
  },
  'shim': {
    'lib/underscore': {
      exports: '_'
    },
    'lib/jquery': {
      exports: '$'
    },
    'lib/bootstrap': {
      deps: ['lib/jquery']
    }
  },
  'map': {
    '*': {
      'jquery'                           : 'lib/jquery'
    }
  }
});
