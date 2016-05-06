define([
  'lib/underscore',
  'lib/backbone',
], function (_, Backbone) {
  return Backbone.Model.extend({
    defaults: {
      value: [],
      select: null,
      count: 0,
      aggregate: [],
    },
  });
});
