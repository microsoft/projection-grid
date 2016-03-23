// require all `test/**/*.js` except for `test/**/$*.js`
var testsContext = require.context('.', true, /[^\$][^\/]*\.js$/);
testsContext.keys().forEach(testsContext);
