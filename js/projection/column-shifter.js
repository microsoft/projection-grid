define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
  var Model = BaseProjection.extend({
    defaults: {
    },
    name: 'column-shifter',
    events: {
      'layout:click:header': 'thClick',
    },
    update: function (options) {
      // todo [akamel] when calling a deep update; suppress onchange event based updates
      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        // todo [akamel] have 'columns' crated at the source so we don't have to put this all over the place
        var columns = model.get('columns');
        var select = model.get('select');
        var colSkipped = model.get('columns.skipped');
        var colRemaining = model.get('columns.remaining');

        var unlockedAt = Math.max(_.findIndex(select, function (col) {
          return columns[col] && !columns[col].$lock;
        }), 0);

        var hasLess = _.size(colSkipped);
        var hasMore = _.size(colRemaining);

        var colLess = {
          property: 'column.skip.less',
          $metadata: {
            'attr.head': { class: ['skip-less'] },
            'enabled': hasLess,
          },
          $html: '<span class="glyphicon glyphicon-triangle-left" />',
        };
        var colMore = {
          property: 'column.skip.more',
          $metadata: {
            'attr.head': { class: ['skip-more'] },
            'enabled': hasMore,
          },
          $html: '<span class="glyphicon glyphicon-triangle-right" />',
        };

        if (!hasLess) {
          colLess.$metadata['attr.head'].class.push('disabled');
        }

        if (!hasMore) {
          colMore.$metadata['attr.head'].class.push('disabled');
        }

        select.splice(unlockedAt, 0, colLess.property);
        columns[colLess.property] = colLess;
        select.push(colMore.property);
        columns[colMore.property] = colMore;

        this.patch({
          columns: columns,
          select: select,
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
    thClick: function (e, arg) {
      if (_.has(arg.column, '$metadata') && arg.column.$metadata.enabled) {
        var ret = 0;
        var skip = this.get('column.skip');

        // todo [akamel] is this logic solid?
        switch (arg.property) {
          case 'column.skip.less': {
            ret = _.isNumber(skip) ? Math.max(skip - 1, 0) : 0;
            break;
          }
          case 'column.skip.more': {
            ret = _.isNumber(skip) ? skip + 1 : 0;
            break;
          }
          default:
        }

        this.set({ 'column.skip': ret });
      }
    },
  });

  return Model;
});
