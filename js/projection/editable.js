define([
  'lib/underscore',
  'lib/jquery',
  'component/grid/projection/base',
  'component/grid/layout/template/editable.jade',
  'component/popup-editor/index',
  '../../less/editable.less',
], function (_, $, BaseProjection, editableTemplate, PopupEditor) {
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
    },
    name: 'column-editable',
    events: {
      'layout:click:cell': 'tdClick',
    },

    beforeSet: function (local) {
      var editable = function () {
        return true;
      };

      var config = {};
      if (_.has(local, 'column.editable')) {
        var conditions = _.reduce(local['column.editable'], function (conds, editableColumn) {
          if (_.isString(editableColumn)) {
            conds[editableColumn] = editable;
            config[editableColumn] = {};
          } else if (_.isObject(editableColumn) && _.isString(editableColumn.name)) {
            conds[editableColumn.name] = _.isFunction(editableColumn.condition) ? editableColumn.condition : editable;
            config[editableColumn.name] = editableColumn;
          }
          return conds;
        }, {});

        this.editableConfig = config;
        this.isEditable = function (key, item) {
          return _.isFunction(conditions[key]) && conditions[key](item);
        };
      }
    },

    update: function (options) {
      if (BaseProjection.prototype.update.call(this, options)) {
        var model = this.src.data;
        var columns = model.get('columns');
        var iconClasses = this.get('editable.icon.class') || ['glyphicon', 'glyphicon-pencil'];

        _.each(this.get('column.editable'), function (editableColumn) {
          var key = _.isString(editableColumn) ? editableColumn : editableColumn.name;
          if (key) {
            var column = columns[key] || { property: key };
            var $metadata = column.$metadata = column.$metadata || {};
            var attrBody = $metadata['attr.body'] = $metadata['attr.body'] || {};
            var className = attrBody.class || [];

            if (_.isString(className)) {
              className = className.split(/\s+/);
            }
            attrBody.class = _.union(className, ['grid-editable-cell']);

            columns[key] = column;
          }
        });

        var value = _.map(model.get('value'), function (item) {
          return isReadonlyRow(item) ? item : _.mapObject(item, function (value, key) {
            if (this.isEditable(key, item)) {
              if (!_.isObject(value)) {
                value = new Object(value); // eslint-disable-line
              }

              value.$html = editableTemplate({
                $html: value.$html || String(value),
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
        $(e.target).closest('.is-not-trigger').length === 0) {
        schema = arg.grid.options.get('schema');
        let options = this.editableConfig[property];
        let EditorClass = options.PopEditor || PopupEditor;
        options = _.omit(options, 'PopEditor');
        let editor = new EditorClass(_.extend({
          value: arg.model[property],
          position: $(e.target).closest('td').position(),
          property: property,
        }, options));

        let cancelEditor = function() {
          editor.trigger('cancel');
        };

        let removeEditor = function() {
          document.removeEventListener('click', cancelEditor);
          editor.remove();
        };

        editor.on('save', (newValue) => {
          arg.model[property] = newValue;
          removeEditor()
          this.trigger('edit', arg.model);
        });

        editor.on('cancel', removeEditor);

        document.body.appendChild(editor.render().el);
        
        window.setTimeout(() => {
          document.addEventListener('click', cancelEditor);
        });
      }
    },
  });
});
