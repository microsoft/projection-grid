import _ from 'underscore';

export const itemIndex = {
  name: 'itemIndex',
  handler(state) {
    const { items, primaryKey } = state;
    const itemIndex = {};

    _.each(items.slice(), item => {
      if (!_.has(item, primaryKey)) {
        item[primaryKey] = _.uniqueId('grid-item-');
      }
      itemIndex[item[primaryKey]] = item;
    });

    return _.defaults({ itemIndex }, state);
  },
  defaults: {},
};

