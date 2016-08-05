import _ from 'underscore';

export function columns(state, columns) {
  return _.defaults({
    columns: columns || _.chain(state.items.slice(0, 1)).first().keys().map(name => ({
      name,
      sortable: true,
    })).value(),
  }, state);
}

