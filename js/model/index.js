define([
      'lib/underscore'
    , 'lib/backbone'
  ],
function(_, Backbone){
  var Model = Backbone.Model.extend({
    defaults : {
        layout      : undefined
      , projection  : undefined
    }
  });

  return Model;
});