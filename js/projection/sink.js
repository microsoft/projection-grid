define([
  'lib/underscore',
  'component/grid/projection/base',
  'component/grid/schema/properties',
], function (_, BaseProjection, schemaProperties) {
  var Model = BaseProjection.extend({

    defaults: {
      seed: null,
    },

    name: 'sink',

    update: function () {
      var value;

      value = this.get('seed');

      if (value) {
        var select = schemaProperties.from(value);
        this.patch({
          value: value,
          select: select,
          count: _.size(value),
        });
      }
    },

  });

  return Model;
});
