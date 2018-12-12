import _ from 'underscore';

function updateItemState(gridView, item, state) {
  const buffer = gridView.get('buffer');
  const changed = {};
  const key = _.result(item, gridView.primaryKey);

  changed[key] = {
    item,
    state,
  };
  _.defaults(changed, buffer.changed);

  gridView.set({
    buffer: _.defaults({ changed }, buffer),
  });
}

export const buffer = {
  name: 'buffer',
  handler(state, buffer) {
    const { primaryKey, uniqueId, update } = state;

    if (buffer.uniqueId !== uniqueId) {
      buffer.uniqueId = uniqueId;
      buffer.changed = {};
    }

    const items = {
      length: state.items.length,
      slice: (begin = 0, end = state.items.length) => {
        return state.items.slice(begin, end).map(item => {
          const key = item[primaryKey];

          if (_.has(buffer.changed, key)) {
            return buffer.changed[key].item;
          }
          return item;
        });
      },
    };

    const onCommit = item => {
      if (item) {
        updateItemState(this, item, 'committed');
      }
    };

    const onEdit = item => {
      if (item) {
        updateItemState(this, item, 'changed');
        if (_.isFunction(update)) {
          update(item).then(onCommit);
        }
      }
    };

    const events = _.defaults({ didEdit: onEdit }, state.events);

    return _.defaults({ items, events }, state);
  },
  defaults: {},
};

