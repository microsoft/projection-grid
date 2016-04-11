define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
  var Model = BaseProjection.extend({
    defaults: {
      'column.skip': 0,
      'column.take': Number.MAX_VALUE,
      'column.lock': [],
      'column.filter': function () {
        return true;
      },
      'column.in': undefined,
    },
    name: 'column-queryable',
    update: function (options) {
      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        var take = this.get('column.take');
        var skip = this.get('column.skip');
        var lock = this.get('column.lock') || [];
        var filter = this.get('column.filter');
        // todo [akamel] consider renaming to column.select
        var $in = this.get('column.in');
        var select = _.size(model.get('columns')) ? _.map(model.get('columns'), function (i) {
          return i.property;
        }) : model.get('select');
        var unlocked = _.isFunction(filter) ? _.filter($in || select, filter) : ($in || select);
        var lookup = model.get('columns');
        var set = _.chain(unlocked).difference(lock).value();
        var col = set;

        if (!_.isNumber(take)) {
          take = Number.MAX_VALUE;
        }

        take = Math.max(take - _.size(lock), 0);
        if (_.size(set) < skip) {
          skip = 0;
          // this.set({ 'columns.skip' : 0 }, { silent : true });
        }

        // start query
        var skipped = _.first(set, skip);

        if (skip) {
          col = _.rest(set, skip);
        }

        var remaining = _.rest(col, take);

        col = _.union(lock, _.first(col, take));
        // end query

        _.each(col, function(element) {
          if (lookup[element] != null) {
            lookup[element]['$lock'] = _.contains(lock, element);
          }
        });

        this.patch({
          'select': col,
          // todo [akamel] rename to column.in???
          // , 'columns.select'  : set
          'columns.skipped': skipped,
          'columns.remaining': remaining,
          // , 'columns.count'   : _.size(res)
          // todo [akamel] do we still need to update skip?
          'column.skip': skip,
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
  });

  return Model;
});
