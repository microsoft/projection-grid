import _ from 'underscore';

export function memory ({
  data,
  skip = 0,
  take = data.length - skip,
  filter = () => true,
  orderby = [],
  select = [],
} = {}) {
  return { items: _.chain(data).slice(skip, take + skip).filter(filter).value() };
}
