define(['component/grid/projection/base'], function(BaseProjection) {
  var Model = BaseProjection.extend({
    defaults: {
      seed: []
    },
    update: function() {
      this.trigger('update:beginning');
      value = this.get('seed');
      this.data.set({
        value: value,
        count: value.length
      });
      this.trigger('update:finished');
    }
  });

  return Model;
});