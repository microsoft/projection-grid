define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection, schemaProperties /* , Response */) {
  var Model = BaseProjection.extend({
    defaults: {
      'column.group': {},
      'column.groupExpansion': [],
      'column.select': null
    },
    name: 'column-group',

    events: {
      'layout:click:header': 'onClickHeader',
    },

    update: function (options) {
      // Model.__super__.update.call(this, options);

      if (Model.__super__.update.call(this, options)) {
        var model = this.src.data;
        var columnGroup = this.get('column.group') || {};
        var groupExpansion = this.get('column.groupExpansion') || [];
        var select = this.get('column.select') || model.get('select');
        var selectExpand = select.slice(0);
        var columns = model.get('columns');
        var subSelect = [], isApplyGroup = false;

        _.each(columnGroup, function(subColumns, name) {
          if (columns[name] == null) return;
          isApplyGroup = true;
          columns[name].group = subColumns;
          // remove the columns that appear in the select
          select = _.difference(select, subColumns);
          selectExpand = _.difference(selectExpand, subColumns);
          var isExpand = columns[name].groupExpansion = _.contains(groupExpansion, name);
          if (_.contains(select, name) && isExpand) {
            var nameIndex = selectExpand.indexOf(name);
            selectExpand.splice.apply(selectExpand, [nameIndex, 1].concat(subColumns));
            subSelect = subSelect.concat(subColumns);
          }
        }, this);

        this.patch({
          columns: columns,
          select: select,
          subSelect: subSelect,
          selectExpand: selectExpand,
          isApplyGroup: isApplyGroup
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },

    onClickHeader: function (e, arg) {
      var column = arg.column;
      if (column.group != null) {
        var groupExpansion = this.get('column.groupExpansion') || [];
        if (column.groupExpansion) {
          groupExpansion = _.without(groupExpansion, column.property);
        } else {
          groupExpansion = _.union(groupExpansion, [column.property]);
        }
        this.set({'column.groupExpansion': groupExpansion});
      }
    }
  });

  return Model;
});
