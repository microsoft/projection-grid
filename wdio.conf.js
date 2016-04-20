var path = require('path');
var democase = require('democase');

var demoSet = democase.loadSync(path.resolve(__dirname, 'demos'));

module.exports = {
  config: demoSet.wdioConfig(),
};
