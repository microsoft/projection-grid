import _ from 'underscore';
import projections from '../projection/index';

export default definePlugin => definePlugin('projection', [
  'config',
], function (config) {
  let projection = null;

  if (config.dataSource.type === 'js-data') {
    projection = new projections.JSData({
      'jsdata.entity': config.dataSource.resource,
      'jsdata.query': config.dataSource.query,
      'jsdata.options': config.dataSource.options,
    });
  } else {
    throw new Error(`dataSource.type "${config.dataSource.type}" is not supported`);
  }

  projection = projection.pipe(new projections.ColumnI18n({
    'column.i18n': _.reduce(config.columns, (columnI18n, column) => {
      columnI18n[column.field] = column.title || column.field;
      return columnI18n;
    }, {}),
  }));
  projection = projection.pipe(new projections.ColumnQueryable());

  return projection;
});
