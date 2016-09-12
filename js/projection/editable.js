define([
  'lib/underscore',
  'lib/jquery',
  'component/grid/projection/base',
  'component/grid/layout/template/editable.jade',
  'component/popup-editor/index',
  '../../less/editable.less',
], function (_, $, BaseProjection, defaultEditableTemplate, prompt) {
  'use strict';

  function isReadonlyRow(item) {
    return !item || (item.$metadata && _.contains([
      'aggregate',
      'segmentation',
    ], item.$metadata.type));
  }

  return BaseProjection.extend({
    defaults: {
      'column.editable': [],
      'editable.icon.class': ['glyphicon', 'glyphicon-pencil'],
      'editable.tooltip.text': 'Edit',
      'editable.template': defaultEditableTemplate,
    },
    name: 'column-editable',
    events: {
      'layout:click:cell': 'tdClick',
    },

    beforeSet: function (local) {
      var editable = function () {
        return true;
      };

      if (_.has(local, 'column.editable')) {
        let editableOptions = local['column.editable'];
        let viewConfig = {};
        let conditions = {};

        if (_.isArray(editableOptions)) {
          _.each(editableOptions, editableColumn => {
            if (_.isString(editableColumn)) {
              conditions[editableColumn] = editable;
            } else if (_.isObject(editableColumn) && _.isString(editableColumn.name)) {
              conditions[editableColumn.name] = _.isFunction(editableColumn.condition) ? editableColumn.condition : editable;
            }
            viewConfig[editableColumn] = null;
          });
        } else {
          _.each(editableOptions, (options, columnName) => {
            if (_.isFunction(options)) {
              conditions[columnName] = editable;
              viewConfig[columnName] = options;
            } else if (_.isObject(options)) {
              conditions[columnName] = options.condition;
              viewConfig[columnName] = options.editor;
            }
          });
        }

        this.viewConfig = viewConfig;
        this.isEditable = function (key, item) {
          return _.isFunction(conditions[key]) && conditions[key](item);
        };
      }
    },

    update: function (options) {
      if (BaseProjection.prototype.update.call(this, options)) {
        var model = this.src.data;
        var columns = model.get('columns');
        var iconClasses = this.get('editable.icon.class');
        var tooltipText = this.get('editable.tooltip.text');
        var editableTemplate = this.get('editable.template');

        _.each(this.viewConfig, function (view, key) {
          var column = columns[key] || { property: key };
          var $metadata = column.$metadata = column.$metadata || {};
          var attrBody = $metadata['attr.body'] = $metadata['attr.body'] || {};
          var className = attrBody.class || [];

          if (_.isString(className)) {
            className = className.split(/\s+/);
          }
          attrBody.class = _.union(className, ['grid-editable-cell']);

          columns[key] = column;
        });

        var value = _.map(model.get('value'), function (item) {
          return isReadonlyRow(item) ? item : _.mapObject(item, function (value, key) {
            if (this.isEditable(key, item)) {
              var $html = null;
              var text = null;

              if (_.isObject(value)) {
                $html = value.$html;
              } else {
                text = value;
                value = {};
              }

              value.$html = editableTemplate({
                $html: $html,
                text: text,
                tooltipText: tooltipText,
                classes: iconClasses,
              });
            }
            return value;
          }, this);
        }, this);

        this.patch({ value: value });
      }
    },

    tdClick: function (e, arg) {
      var schema = null;
      var metadata = arg.column.$metadata;
      // TODO: wewei
      // let's rethink this
      var property = (metadata && metadata.map) || arg.property;

      if (!isReadonlyRow(arg.model) &&
        this.isEditable(arg.property, arg.model) &&
        e.target.tagName !== 'A' &&
        $(e.target).closest('.is-not-trigger').length === 0) {
        schema = arg.grid.options.get('schema');
        let editor = this.viewConfig[arg.property] || prompt;
        editor({
          model: arg.model,
          schema: schema,
          position: arg.grid.layout.container.offset(e.currentTarget),
          property: property,
          onSubmit: model => {
            this.trigger('edit', model, property);
          },
        });
      }
    },

  });
});
