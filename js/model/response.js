define([
      'lib/underscore'
    , 'lib/backbone'
  ],
function(_, Backbone){
  var Model = Backbone.Model.extend({
    defaults : {
        value       : []
      , select      : []
      , count       : 0
      , aggregate   : []
    }
  });

  return Model;
});