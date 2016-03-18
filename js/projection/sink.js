define([
  'component/grid/projection/base',
  'component/grid/schema/properties'
], function(BaseProjection, schema_properties) {

  var Model = BaseProjection.extend({

    defaults: {
      'seed': null,
    },

    name: 'sink',

    update: function(options) {
      var value;

      value = this.get('seed');

      if (value) {
        var select = schema_properties.from(value);
        this.patch({
          value   : value,
          select  : select,
        });
      }
    },

  });

  return Model;
});
