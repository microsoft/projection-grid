import _ from 'underscore';
import projections from '../projection/index';

const projectionConfigs = {
  JSData(config) {
    return {
      'jsdata.entity': config.dataSource.resource,
      'jsdata.query': config.dataSource.query,
      'jsdata.options': config.dataSource.options,
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

  RowCheckbox() {
    return {
      'row.check.id': 'rowIndex',
      'column.checked': 'checkbox',
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

  if (_.find(config.columns, _.property('originalField'))) {
    pipeProjection('Map');
  }

  pipeProjection('ColumnI18n');
  pipeProjection('ColumnQueryable');

  _.has(config.columnShifter, 'totalColumns') && pipeProjection('ColumnShifter');

  pipeProjection('ColumnTemplate');
  pipeProjection('PropertyTemplate');
  if (config.selectable) {
    pipeProjection('RowIndex');
    pipeProjection('RowCheckbox');
  }

  return projection;
});
