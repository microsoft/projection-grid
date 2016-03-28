define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection, schemaProperties /* , Response */) {
  var Model = BaseProjection.extend({
    defaults: {
      filter: function () {
        return true;
      },
      select: [],
    },
    name: 'memory-filter',
    beforeSet: function (local) {
      if (_.has(local, 'filter')) {
        if (!_.isFunction(local.filter)) {
          local.filter = this.defaults.filter;
        }
      }
    },
    update: function (options) {
      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;

        var value = model.get('value');

        value = _.chain(value)
                  .filter(this.get('filter'))
                  .value();

        var select = this.get('select');
        if (!_.size(select)) {
          select = schemaProperties.from(value);
        }

        this.patch({
          value: value,
          select: select,
        });
      }
    },
  });

  return Model;
});
