define([
  'lib/underscore',
  'lib/jquery',
  'component/grid/containerBase',
], function (_, $, ContainerBase) {
  var ElementContainer = ContainerBase.extend({
    offset: function (element) {
      var position = $(element).position();

      return {
        top: position.top + this.$el.scrollTop(),
        left: position.left + this.$el.scrollLeft(),
      };
    },
  });

  ElementContainer.isValidContainer = function (userContainer) {
    return ['absolute', 'relative', 'fixed'].indexOf($(userContainer).css('position')) >= 0;
  };

  return ElementContainer;
});
