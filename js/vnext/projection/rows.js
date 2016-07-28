import _ from 'underscore';

export const rows = (state, {
  headRows = ['column-header-rows'],
  footRows = [],
} = {}) => {
  const bodyRows = _.map(state, item => ({
    classes: ['body-row'],
    item: _.mapObject(item, value => ({ html: value })),
  }));

  return _.extend(state, { headRows, bodyRows, footRows });
};


