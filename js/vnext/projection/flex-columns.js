import _ from 'underscore';
import { getDefaultColumns, extendColumns, extendWidthAttr, extendDataColumnAttr } from './common.js';

function columnsProjectionHandler(state, columns) {
  const defaultColumns = getDefaultColumns(state, columns);
  const extendedColumnsWithDataColumn = extendColumns(defaultColumns, extendDataColumnAttr);
  const extendedColumnsWithDataColumnWithWidth = extendColumns(extendedColumnsWithDataColumn, extendWidthAttr);

  return _.defaults({
    columns: extendedColumnsWithDataColumnWithWidth,
  }, state);
}

// only pipe this projection when the layout is 'flex'
export const flexColumns = {
  name: 'columns',
  handler: columnsProjectionHandler,
  defaults: null,
};
