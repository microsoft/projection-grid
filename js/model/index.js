define([
  'lib/underscore',
  'lib/backbone',
], function (_, Backbone) {
  return Backbone.Model.extend({
    defaults: {
      layout: undefined,
      projection: undefined,
    },
  });
});
