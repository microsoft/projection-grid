// require all `test/**/*.js` except for `test/**/$*.js`
// var testsContext = require.context('.', false, /[^\$][^\/]*\.js$/);
var testsContext = require.context('.', true, /[^\$][^\/]*\-spec.js$/);
testsContext.keys().forEach(testsContext);
