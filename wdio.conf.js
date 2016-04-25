var path = require('path');
var democase = require('democase');

var demoSet = democase.loadSync(path.resolve(__dirname, 'demos'));
var config = demoSet.wdioConfig({
  capabilities: [{
    browserName: 'firefox',
  }],
  reporters: ['dot', 'junit'],
  reporterOptions: { outputDir: './test-results/' },
});

module.exports = { config: config };
