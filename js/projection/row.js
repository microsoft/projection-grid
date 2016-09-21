define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
], function (_, Backbone, BaseProjection) {
  var Model = BaseProjection.extend({
    defaults: {
      'row.classes': {},
      'row.role': {},
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

        _.each(rows, (row, index) => {
          var classArr = [];
          var classesRule = this.get('row.classes');

          var checkId = this.get('row.check.id');
          var checkboxAllow = this.get('row.check.allow');

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
          });
          
          //attr info from meta 
          var originId = _.chain(row)
            .result('$metadate')
            .result('attr')
            .result('id')
            .value();

          var originRole = _.chain(row)
            .result('$metadate')
            .result('attr')
            .result('role')
            .value();

          // if (_.isFunction(checkboxAllow) && checkboxAllow(row)) {
          //   console.log('=========');
          //   console.log(this.get('accessibility.row.check.idPrefix').concat(row[checkId]));
          // }
          var newId = row[checkId];
          var newRole = this.get('row.role');
          var id = newId || originId;
          var role = newRole || originRole;

          _.extend(row, {
            $metadata: {
              attr: {
                class: _.flatten(classArr).join(' '),
                id: id,
                role: role,
              },
            },
          });
        });

        this.patch({ value: rows });
      }
    },
  });

  return Model;
});
