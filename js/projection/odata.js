define([
  'bluebird',
  'lib/underscore',
  'lib/backbone',
  'lib/jquery',
  'component/grid/projection/base',
  'component/grid/schema/properties',
], function (Promise, _, Backbone, $, BaseProjection, schemaProperties) {
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
      this.p$fetchData || this.trigger('update:beginning');

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

      var p$fetchData = this.p$fetchData = new Promise(function (resolve, reject) {
        $.getJSON(op.url, _.omit(op, 'url'))
          .success(resolve)
          .error(function (jqXHR, textStatus, errorThrown) {
            reject(new Error(errorThrown));
          });
      }).then(function (data) {
        if (p$fetchData === this.p$fetchData) {
          var delta = {
            value: data.value,
            rawValue: data,
            select: schemaProperties.from(data.value),
            count: data['@odata.count'],
            error: undefined,
          };
          this.patch(delta);
        }
      }.bind(this)).catch(function (error) {
        if (p$fetchData === this.p$fetchData) {
          this.patch({ error: error });
        }
      }.bind(this)).finally(function () {
        if (p$fetchData === this.p$fetchData) {
          this.trigger('update:finished', this.data.get('error'));
          this.p$fetchData = null;
        }
      }.bind(this));
    },
  });

  return Model;
});
