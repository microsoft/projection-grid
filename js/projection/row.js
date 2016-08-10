define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
], function (_, Backbone, BaseProjection) {
  var Model = BaseProjection.extend({
    defaults: {
      'row.classes': {},
    },
    name: 'row',
    update: function (options) {
      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        var rows = model.get('value');

        _.each(rows, row => {
          var type = _.chain(row).result('$metadata').result('type').value();

          if (_.isUndefined(type)) {
            row.$metadata = _.extend({}, row.$metadata, {
              type: 'row',
            });
          }
        });

        _.each(rows, row => {
          var classArr = [];
          var classesRule = this.get('row.classes');
          _.each(classesRule, (func, key) => {
            var originClass = _.chain(row)
              .result('$metadate')
              .result('attr')
              .result('class')
              .value();

            if (originClass) {
              classArr.push(originClass);
            }

            var type = _.chain(row).result('$metadata').result('type').value();

            if (_.isFunction(func) && func(row, type)) {
              classArr.push(key);
            }
            _.extend(row, {
              $metadata: {
                attr: {
                  class: _.flatten(classArr).join(' '),
                },
              },
            });
          });
        });

        this.patch({ value: rows });
      }
    },
  });

  return Model;
});
