import _ from 'underscore';

export default definePlugin => definePlugin('columns', [
  'config',
], function (config) {
  return _.reduce(config.columns, (columns, column) => {
    columns[column.name] = {
      sortable: column.sortable,
    };
    return columns;
  }, {});
});
