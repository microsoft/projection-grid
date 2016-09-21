import _ from 'underscore';
import Backbone from 'backbone';
import projections from '../projection/index';
import { delegateEvents } from './utility';
import prompt from '../popup-editor/index';

const projectionConfigs = {
  AggregateRow(config) {
    const configAgg = {};

    if (_.has(config.aggregate, 'top')) {
      configAgg['aggregate.top'] = config.aggregate.top;
    }

    if (_.has(config.aggregate, 'bottom')) {
      configAgg['aggregate.bottom'] = config.aggregate.bottom;
    }

    return configAgg;
  },

  JSData(config) {
    return _.extend(_.pick(config.dataSource, [
      'skip',
      'take',
      'filter',
      'orderby',
      'select',
    ]), {
      'jsdata.entity': config.dataSource.resource,
      'jsdata.query': config.dataSource.query,
      'jsdata.options': config.dataSource.options,
    });
  },

  Map(config) {
    const properties = _.reduce(config.columns, (memo, { name, value, field }) => {
      memo[name] = value || (item => _.reduce(
        (field || name).split('/'),
        (memo, prop) => _.result(memo, prop),
        item
      ));
      return memo;
    }, {});

    return {
      map(item) {
        return _.reduce(config.columns, (memo, { name }) => {
          memo[name] = properties[name](item);
          return memo;
        }, {});
      },
    };
  },

  Columns(config) {
    const columns = _.reduce(config.columns, (columns, column) => {
      const $metadata = {};

      if (column.attributes) {
        $metadata['attr.body'] = column.attributes;
      }

      if (column.headerAttributes) {
        $metadata['attr.head'] = column.headerAttributes;
      }

      columns[column.name] = {
        sortable: column.sortable,
        $metadata,
        headerBuilder: column.headerBuilder,
        config: column,
      };

      return columns;
    }, {});

    if (config.selectable) {
      columns.checkbox = {
        config: { name: 'selection' },
      };
    }

    if (_.has(config.columnShifter, 'totalColumns')) {
      columns['column.skip.less'] = {
        config: { name: 'skip-less' },
      };
      columns['column.skip.more'] = {
        config: { name: 'skip-more' },
      };
    }

    return { columns };
  },

  ColumnI18n(config) {
    return _.reduce(config.columns, (columnI18n, column) => {
      columnI18n['column.i18n'][column.name] = column.title || column.name;
      columnI18n['subColumn.i18n'][column.name] = column.subColTitle;
      return columnI18n;
    }, { 'column.i18n': {}, 'subColumn.i18n': {} });
  },

  ColumnQueryable(config) {
    const columnIn = _.chain(config.columns)
      .reject(_.property('hidden'))
      .map(_.property('name'))
      .value();
    const columnLock = _.chain(config.columns)
      .filter(_.property('locked'))
      .map(_.property('name'))
      .value();
    const colqConfig = {
      'column.lock': columnLock,
      'column.in': columnIn,
    };

    if (config.selectable) {
      columnIn.unshift('checkbox');
      columnLock.unshift('checkbox');
    }

    if (_.has(config.columnShifter, 'totalColumns')) {
      colqConfig['column.take'] = config.columnShifter.totalColumns;
    }
    return colqConfig;
  },

  ColumnGroup(config) {
    return {
      'column.group': config.columnGroup,
    };
  },

  ColumnShifter() {},

  ColumnTemplate(config) {
    return {
      'column.template': _.reduce(config.columns, (columnTmpl, column) => {
        if (column.headerTemplate) {
          columnTmpl[column.name] = column.headerTemplate;
        }
        return columnTmpl;
      }, {}),
    };
  },

  Editable(config) {
    const editableOptions = {};

    _.each(config.columns, column => {
      if (column.editable) {
        const options = editableOptions[column.name] = {
          condition: () => true,
          editor: prompt,
        };

        if (_.isFunction(column.editable)) {
          options.condition = column.editable;
        } else if (_.isObject(column.editable)) {
          _.extend(options, column.editable);
        }
      }
    });

    const tooltipText = _.result(config.editable, 'tooltipText', 'Edit');
    const iconClasses = _.result(config.editable, 'iconClasses', ['glyphicon', 'glyphicon-pencil']);

    return {
      'column.editable': editableOptions,
      'editable.tooltip.text': tooltipText,
      'editable.icon.class': iconClasses,
    };
  },

  MemoryQueryable(config) {
    return {
      'column.sortable': _.reduce(config.columns, (columnSortable, column) => {
        if (column.sortable) {
          columnSortable[column.name] = column.sortable;
        }
        return columnSortable;
      }, {}),
    };
  },

  Odata(config) {
    return _.extend(_.pick(config.dataSource, [
      'url',
      'skip',
      'take',
      'filter',
      'orderby',
      'select',
    ]));
  },

  PropertyTemplate(config) {
    return {
      'property.template': _.reduce(config.columns, (propTmpl, column) => {
        if (column.template) {
          propTmpl[column.name] = column.template;
        }
        return propTmpl;
      }, {}),
    };
  },

  RowIndex() { },

  Row(config) {
    return {
      'row.classes': _.result(config.rows, 'classes'),
      'row.idPrefix': _.result(config.rows, 'idPrefix'),
      'row.role': _.result(config.rows, 'role'),
    };
  },

  RowCheckbox(config) {
    return {
      'row.check.id': _.chain(config)
        .result('dataSource')
        .result('schema')
        .result('key', 'rowIndex')
        .value(),
      'row.check.single': config.selectable === 'single',
      'column.checked': 'checkbox',
      'row.check.allow': function (model) {
        var type = _.chain(model).result('$metadata').result('type').value();

        return !_.contains([
          'segmentation',
          'aggregate',
        ], type);
      },
    };
  },

  Page(config) {
    return {
      'page.size': config.pageable.pageSize,
      'page.number': 0,
    };
  },

  Sink(config) {
    const data = _.result(config.dataSource, 'data', []);

    if (_.isArray(data)) {
      return { seed: data };
    } else if (data instanceof Backbone.Collection) {
      return { seed: data.toJSON() };
    }
  },
};

export default definePlugin => definePlugin('projection', [
  'config',
], function (config) {
  let projection = null;

  function pipeProjection(name) {
    const Projection = projections[name];
    const configProj = projectionConfigs[name](config);
    const projectionDest = new Projection(configProj);

    if (projection) {
      projection = projection.pipe(projectionDest);
    } else {
      projection = projectionDest;
    }
  }

  const dataSourceType = config.dataSource.type || 'memory';
  if (dataSourceType === 'js-data') {
    pipeProjection('JSData');
  } else if (dataSourceType === 'memory') {
    pipeProjection('Sink');
    pipeProjection('MemoryQueryable');
    if (config.dataSource.data instanceof Backbone.Collection) {
      let updating = false;
      const scheduleUpdate = () => {
        if (!updating) {
          updating = true;
          window.setTimeout(() => {
            projection.set('seed', config.dataSource.data.toJSON());
            updating = false;
          }, 0);
        }
      };
      config.dataSource.data.on('all', scheduleUpdate);
    }
  } else if (dataSourceType === 'odata') {
    pipeProjection('Odata');
  } else {
    throw new Error(`dataSource.type "${config.dataSource.type}" is not supported`);
  }

  const dataSourceProjection = projection;

  pipeProjection('Columns');
  pipeProjection('Map');
  if (config.aggregate) {
    pipeProjection('AggregateRow');
  }
  pipeProjection('ColumnQueryable');
  pipeProjection('ColumnI18n');
  if (config.enablePoP) {
    pipeProjection('ColumnGroup');
  }

  if (_.has(config.columnShifter, 'totalColumns')) {
    pipeProjection('ColumnShifter');
  }

  pipeProjection('ColumnTemplate');
  pipeProjection('PropertyTemplate');
  if (config.selectable) {
    pipeProjection('RowIndex');
    pipeProjection('RowCheckbox');
  }

  if (config.rows) {
    pipeProjection('Row');
  }

  if (_.has(config.pageable, 'pageSize')) {
    pipeProjection('Page');
  }
  if (_.find(config.columns, _.property('editable'))) {
    pipeProjection('Editable');
  }

  delegateEvents({
    from: dataSourceProjection,
    to: projection,
    events: [
      'update:beginning',
      'update:finished',
    ],
  });

  return projection;
});
