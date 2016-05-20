import _ from 'underscore';
import projections from '../projection/index';

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
    return {
      'jsdata.entity': config.dataSource.resource,
      'jsdata.query': config.dataSource.query,
      'jsdata.options': config.dataSource.options,
    };
  },

  Map(config) {
    const properties = _.reduce(config.columns, (memo, { name, value, field }) => {
      memo[name] = value || (item => _.reduce((field || name).split('/'), (memo, prop) => memo[prop], item));
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
    return {
      columns: _.reduce(config.columns, (columns, column) => {
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
          config: column,
        };

        return columns;
      }, {}),
    };
  },

  ColumnI18n(config) {
    return {
      'column.i18n': _.reduce(config.columns, (columnI18n, column) => {
        columnI18n[column.name] = column.title || column.name;
        return columnI18n;
      }, {}),
    };
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
    return {
      'column.editable': _.chain(config.columns)
        .filter(_.property('editable'))
        .map(_.property('name'))
        .value(),
    };
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

  if (config.dataSource.type === 'js-data') {
    pipeProjection('JSData');
  } else {
    throw new Error(`dataSource.type "${config.dataSource.type}" is not supported`);
  }

  pipeProjection('Columns');
  pipeProjection('Map');
  if (config.aggregate) {
    pipeProjection('AggregateRow');
  }
  pipeProjection('ColumnI18n');
  pipeProjection('ColumnQueryable');

  if (_.has(config.columnShifter, 'totalColumns')) {
    pipeProjection('ColumnShifter');
  }

  pipeProjection('ColumnTemplate');
  pipeProjection('PropertyTemplate');
  if (config.selectable) {
    pipeProjection('RowIndex');
    pipeProjection('RowCheckbox');
  }

  if (_.has(config.pageable, 'pageSize')) {
    pipeProjection('Page');
  }
  if (_.find(config.columns, _.property('editable'))) {
    pipeProjection('Editable');
  }

  return projection;
});
