// require all `test/**/*.js` except for `test/**/$*.js`
var testsContext = require.context('.', false, /[^\$][^\/]*\.js$/);
testsContext.keys().forEach(testsContext);
