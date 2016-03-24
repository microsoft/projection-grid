define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
  var Model = BaseProjection.extend({
    defaults: {
      'property.template': {},
    },
    name: 'property-template',
    update: function (options) {
      // Model.__super__.update.call(this, options);

      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        var opt = this.get('property.template');
        var value = _.map(model.get('value'), function (item) {
          var ret = _.clone(item);

          _.each(opt, function (value, key) {
            if (_.has(ret, key)) {
              var res = value({
                model: item,
                property: key,
              });

              if (!_.isObject(ret[key])) {
                var obj = new Object(ret[key]); // eslint-disable-line

                if (_.isUndefined(ret[key])) {
                  obj.$undefined = true;
                }

                if (_.isNull(ret[key])) {
                  obj.$null = true;
                }

                ret[key] = obj;
              }

              ret[key].$html = res;
            }
          });

          return ret;
        });

        this.patch({ value: value });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
  });

  return Model;
});
