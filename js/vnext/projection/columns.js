import _ from 'underscore';
/**
* Columns projection handling columns configuration
*
* @param {Object} state
* @param {Object} [state.items] Original data from data source
* @param {Number} [state.items.length] state.items' length
* @param {Function} [state.items.slice] Get items element
* @param {Object} columns Columns configuration defined by user. If omitted, all columns in original data will be shown.
*
*/
export function columns(state, columns) {
  return _.defaults({
    columns: columns || _.chain(state.items.slice(0, 1)).first().keys().map(name => ({
      name,
      sortable: true,
    })).value(),
  }, state);
}

