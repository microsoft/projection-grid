define([
  'lib/underscore',
  'component/grid/projection/base',
], function (_, BaseProjection) {
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
      if (!this.isUpdating) {
        this.isUpdating = true;
        this.on('update:finished', function () {
          this.isUpdating = false;
        });
        this.doUpdate();
      }
    },

    doUpdate: function () {
      var self = this;
      var entity = this.get('jsdata.entity');
      var options = _.defaults(this.get('jsdata.options'), { all: true });
      var op = {};

      this.trigger('update:beginning');

      var take = this.get('jsdata.take');

      if (take) {
        op.limit = take;
      }

      var skip = this.get('jsdata.skip');

      if (skip) {
        op.offset = skip;
      }

      var filter = this.get('jsdata.filter');

      if (filter) {
        op.where = filter;
      }

      var query = this.get('jsdata.query');

      if (query) {
        op.query = query;
      }

      var orderby = this.get('jsdata.orderby');

      if (orderby && orderby.length) {
        op.orderBy = _.chain(orderby)
          .map(_.pairs)
          .map(function (pair) {
            return [pair[0], pair[1] > 0 ? 'ASC' : 'DESC'];
          })
          .value();
      }

      entity.findAll(op, options)
        .then(function (data) {
          self.patch({
            value: data,
            count: data.totalCount,
          });
        })
        .catch(function (jqXHR, textStatus, errorThrown) {
          self.patch({
            error: errorThrown,
          });
        })
        .finally(function () {
          self.trigger('update:finished');
        });
    },
  });

  return Model;
});
