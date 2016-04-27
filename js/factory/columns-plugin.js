import _ from 'underscore';

export default definePlugin => definePlugin('columns', [
  'config',
], function (config) {
  return _.reduce(config.columns, (columns, column) => {
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
    };

    return columns;
  }, {});
});
