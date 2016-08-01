import _ from 'underscore';

export function memory ({
  data,
  skip = 0,
  take,
  filter = () => true,
  orderby = [],
  select = [],
} = {}) {
  return { items: _.chain(data).slice(skip, (take === undefined) ? data.length : take + skip).filter(filter).value() };
}
