define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection, schemaProperties /* , Response */) {
  var Model = BaseProjection.extend({
    defaults: {
      skip: 0,
      take: Number.MAX_VALUE,
      filter: function () {
        return true;
      },
      orderby: [],
      select: [],
    },
    name: 'map-queryable',
    beforeSet: function (local) {
      if (_.has(local, 'filter')) {
        if (!_.isFunction(local.filter)) {
          local.filter = this.defaults.filter;
        }
      }
    },
    update: function (options) {
      // Model.__super__.update.call(this, options);

      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        var order = _.chain(this.get('orderby')).first().pairs().first().value();

        var orderKey = _.first(order);
        var orderDir = _.last(order);

        var value = _.chain(model.get('value')).filter(this.get('filter'));

        if (orderKey) {
          value = value.sortBy(orderKey);
          if (orderDir === -1) {
            value = value.reverse();
          }
        }

        value = value
          .rest(this.get('skip'))
          .first(this.get('take'))
          .value();

        var select = this.get('select');
        if (!_.size(select)) {
          select = schemaProperties.from(value);
        }

        this.patch({
          value: value,
          select: select,
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
  });

  return Model;
});
