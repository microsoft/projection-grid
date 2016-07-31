import _ from 'underscore';

export function memory ({
  data,
  skip = 0,
  take = 20,
  filter = () => true,
  orderby = [],
  select = [],
} = {}) {
  return _.chain(data).slice(skip, take).filter(filter).value();
}
