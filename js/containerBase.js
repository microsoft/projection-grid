define([
  'lib/underscore',
  'lib/jquery',
  'lib/backbone',
], function (_, $, Backbone) {
  var ContainerBase = Backbone.View.extend({
    events: {
      scroll: 'onScroll',
      resize: 'onResize',
    },

    onScroll: function (e) {
      this.trigger('scroll:container', e);
    },

    onResize: function (e) {
      this.trigger('resize:container', e);
    },

    offset: function (/* element, scrollTop, scrollLeft */) {
      throw new Error("Offset function not implemented");
    },
  });

  return ContainerBase;
});
