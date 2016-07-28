import _ from 'underscore';

export function columns(state, {
  columns = _.chain(state).first().keys().map(name => ({
    name,
    width: 120,
  })).value(),
} = {}) {
  return _.defaults(state, { columns });
}

