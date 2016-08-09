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

        var values = model.get('value');
        var classRules = this.get('row.classes');
        var classArr = null;
        var originClass = null;

        _.chain(values).filter(value => {
          return _.chain(value)
            .result('$metadata')
            .result('type')
            .value() !== 'aggregate';
        }).each(item => {
          classArr = [];
          _.each(classRules, (func, key) => {
            originClass = _.chain(item)
              .result('$metadate')
              .result('attr')
              .result('class')
              .value();

            if (originClass) {
              classArr.push(originClass);
            }

            if (_.isFunction(func) && func(item)) {
              classArr.push(key);
            }
            _.extend(item, {
              $metadata: {
                attr: {
                  class: classArr.join(' '),
                },
              },
            });
          });
        });

        this.patch({ value: values });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
  });

  return Model;
});
