define([
      'lib/underscore'
  ],
function(_){

  function from(arr) {
    var obj = _.first(arr);

    return _.keys(obj || {});
  }

  return {
      from : from
  };
});