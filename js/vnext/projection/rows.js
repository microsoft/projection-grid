import _ from 'underscore';

/*
export const rows = (state, {
  headRows = ['column-header-rows'],
  footRows = [],
} = {}) => {
  const bodyRows = _.map(state, item => ({
    classes: ['body-row'],
    item: _.mapObject(item, value => ({ html: value })),
  }));

  return { headRows, bodyRows, footRows, columns: state.columns };
};
*/
export function rows(state, {
  headRows = ['column-header-rows'],
  footRows = [],
} = {}) {
  const columns = state.columns;
  const bodyRows = _.map(_.omit(state, 'columns'), item => ({
    classes: ['body-row'],
    item:  _.mapObject(item, value => ({ html: value })),
  }));

  return _.defaults(state, { headRows, bodyRows, footRows });
};

