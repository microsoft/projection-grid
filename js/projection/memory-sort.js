define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection, schemaProperties /* , Response */) {
  var Model = BaseProjection.extend({
    defaults: {
      'orderby': [],
      'select': [],
      'column.sortable': {},
    },
    name: 'memory-sort',
    update: function (options) {
      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        var order = _.chain(this.get('orderby'))
                      .first()
                      .pairs()
                      .first()
                      .value();

        var orderKey = _.first(order);
        var orderDir = _.last(order);

        var value = model.get('value');

        var sortFunc = this.get('column.sortable')[orderKey];

        if (orderKey) {
          if (_.isFunction(sortFunc)) {
            value = sortFunc(value, orderDir);
          } else {
            value = _.sortBy(value, orderKey);
            if (orderDir === -1) {
              value = value.reverse();
            }
          }
        }

        var select = this.get('select');
        if (!_.size(select)) {
          select = schemaProperties.from(value);
        }

        this.patch({
          value: value,
          select: select,
        });
      } else {
        // TODO [akamel] unset our properties only
        // this.unset();
      }
    },
  });

  return Model;
});
