import _ from 'underscore';

export function rows(state, {
  headRows = ['column-header-rows'],
  footRows = [],
} = {}) {
  const columns = state.columns;
  const bodyRows = {
    length: state.items.length,
    slice: (...args) => state.items.slice(...args).map(item => ({ item })),
  };
  return _.defaults({ headRows, bodyRows, footRows }, state);
}

