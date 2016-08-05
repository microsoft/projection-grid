import _ from 'underscore';

export const memory = {
  findAll({
    data,
    skip = 0,
    take = data.length - skip,
    filter = () => true,
    orderby = [],
    select = [],
  } = {}) {
    const { key, direction } = _.first(orderby) || {};
    let sortIteratee = null;

    if (_.isFunction(key)) {
      sortIteratee = key;
    } else if (_.isString(key)) {
      const segs = key.split(/[\.\/]/);
      sortIteratee = item => _.reduce(segs, (memo, seg) => _.result(memo, seg), item);
    }

    if (sortIteratee) {
      data = _.sortBy(data, sortIteratee);

      if (direction < 0) {
        data.reverse();
      }
    }

    return {
      items: _.chain(data).slice(skip, take + skip).filter(filter).value()
    };
  },
};

