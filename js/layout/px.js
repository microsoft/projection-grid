// todo [akamel] move to /component
define([
      'lib/underscore'
  ],
function(_){
  function parse(a) {
    return abs(parseFloat(a))
  }

  function abs(a) {
    return _.isFinite(a)? a : 0; 
  }

  function pixelify(a) {
    return abs(a) + 'px';
  }

  return {
      parse       : parse
    , pixelify    : pixelify
  };
});
