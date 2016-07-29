import _ from 'underscore';

export function rows(state, {
  headRows = ['column-header-rows'],
  footRows = [],
} = {}) {
  const columns = state.columns;
  const bodyRows = _.map(state.items, item => ({
    classes: ['body-row'],
    item:  item, //_.mapObject(item, value => ({ html: value })),
  })); 
  return _.defaults({ headRows, bodyRows, footRows }, state);
}

