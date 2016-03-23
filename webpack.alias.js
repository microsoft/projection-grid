var path = require('path');
// Config your webpack resolve.alias in this file
module.exports = {
  'lib/underscore': 'underscore',
  'lib/backbone': 'backbone',
  'lib/jquery': 'jquery',
  'component/grid': path.resolve('./js'),
};
