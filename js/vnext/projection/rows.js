import _ from 'underscore';

export const rows = (state, {
  headRows = ['column-header-rows'],
  footRows = [],
} = {}) => {
  const bodyRows = _.map(state.items, item => ({
    classes: ['body-row'],
    item: _.mapObject(item, value => ({ html: value })),
  }));

  return { headRows, bodyRows, footRows, columns: state.columns };
};


