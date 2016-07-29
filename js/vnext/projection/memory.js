import _ from 'underscore';

export function memory (p$state, {
  skip,
  take,
  filter,
  orderby = [],
  select = [],
} = {}) {

  return p$state.then(function(data) {
    return take ? data.slice(skip || 0, take) : data.slice(skip || 0);
  });
}