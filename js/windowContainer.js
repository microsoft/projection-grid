define([
  'lib/underscore',
  'lib/jquery',
  'component/grid/containerBase',
], function (_, $, ContainerBase) {
  var WindowContainer = ContainerBase.extend({
    constructor: function (options) {
      options = _.extend({}, options, { el: window });
      ContainerBase.prototype.constructor.apply(this, [options].concat(_.rest(arguments)));
    },

    offset: function (element) {
      return $(element).offset();
    },
  });

  return WindowContainer;
});
