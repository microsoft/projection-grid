define([
  'lib/underscore',
  'lib/backbone',
  'lib/jquery',
  'component/grid/projection/base',
  'component/grid/projection/mock',
  'component/grid/schema/properties',
], function (_, Backbone, $, BaseProjection, MemoryMock, schemaProperties) {
  var Model = BaseProjection.extend({
    defaults: {
      verb: 'get',
      url: undefined,
      skip: undefined,
      take: undefined,
      filter: undefined,
      orderby: [],
      select: [],
    },
    name: 'odata',
    update: function () {
      this.trigger('update:beginning');
      var url = this.get('url');

      url = _.isFunction(url) ? url() : url;
      var op = {
        url: url,
        $format: 'json',
      // todo [akamel] this is odata v3 specific
        $count: true,
      };

      var take = this.get('take');
      if (take) {
        op.$top = take;
      }

      var skip = this.get('skip');
      if (skip) {
        op.$skip = skip;
      }

      // todo [akamel] only supports one order column
      var orderby = this.get('orderby');
      if (_.size(orderby)) {
        var col = _.first(orderby);
        var key = _.keys(col)[0];
        var dir = col[key];

        op.$orderby = key + ' ' + (dir > 0 ? 'asc' : 'desc');
      }

      $.getJSON(op.url, _.omit(op, 'url'))
        .success(function (data) {
          var delta = {
            value: data.value,
            select: schemaProperties.from(data.value),
            count: data['@odata.count'],
            error: undefined,
          };

          this.patch(delta);
        }.bind(this))
        .error(function (jqXHR, textStatus, errorThrown) {
          var delta = { error: errorThrown };

          this.patch(delta);
        }.bind(this))
        .complete(function () {
          this.trigger('update:finished');
        }.bind(this));
    },
  });

  return Model;
});
