define([
  'bluebird',
  'lib/underscore',
  'component/grid/projection/base',
  'component/grid/schema/properties.js',
], function (Promise, _, BaseProjection, schemaProperties) {
  var Model = BaseProjection.extend({
    defaults: {
      'jsdata.query': undefined,
      'jsdata.entity': undefined,
      'jsdata.options': undefined,
      'skip': undefined,
      'take': undefined,
      'filter': undefined,
      'orderby': [],
      'select': [],
    },
    name: 'jsdata',

    update: function () {
      var entity = this.get('jsdata.entity');
      var options = _.defaults(this.get('jsdata.options'), { all: true });
      var op = {};

      this.p$fetchData || this.trigger('update:beginning');

      var take = this.get('take');

      if (take) {
        op.limit = take;
      }

      var skip = this.get('skip');

      if (skip) {
        op.offset = skip;
      }

      var filter = this.get('filter');

      if (filter) {
        op.where = filter;
      }

      var query = this.get('jsdata.query');

      if (query) {
        op.query = query;
      }

      var orderby = this.get('orderby');

      if (orderby && orderby.length) {
        op.orderBy = _.reduce(orderby, function (arr, obj) {
          _.each(obj, function (value, key) {
            arr.push([key, value > 0 ? 'ASC' : 'DESC']);
          });
          return arr;
        }, []);
      }

      var p$fetchData = this.p$fetchData = entity.findAll(op, options)
        .then(function (data) {
          if (this.p$fetchData === p$fetchData) {
            var delta = {
              value: data,
              count: data.totalCount,
              select: schemaProperties.from(data),
              error: undefined,
            };
            if (_.has(data, 'raw')) {
              delta.rawValue = data.raw;
            }
            this.patch(delta);
          }
        }.bind(this))
        .catch(function (error) {
          if (this.p$fetchData === p$fetchData) {
            this.patch({ error });
          }
        }.bind(this))
        .finally(function () {
          if (this.p$fetchData === p$fetchData) {
            this.trigger('update:finished', this.data.get('error'));
            this.p$fetchData = null;
          }
        }.bind(this));
    },
  });

  return Model;
});
