import _ from 'underscore';
import Promise from 'bluebird';
import { Storage } from './storage.js';

export class MemoryStorage extends Storage {
  constructor(options) {
    super(options);
    this.data = _.reduce(options.data, (memo, item) => {
      if (!_.has(item, this.primaryKey)) {
        item[this.primaryKey] = _.uniqueId('grid-item-');
      }

      return _.extends(memo, {
        [item[this.primaryKey]]: item,
      });
    }, {});
  }

  read({
    filter,
    orderBy,
    skip,
    take,
  }) {
    const { key, direction } = _.first(orderBy) || {};
    let sortIteratee = null;
    let data = _.chain(this.data).values().filter(filter).value();

    if (_.isFunction(key)) {
      sortIteratee = key;
    } else if (_.isString(key)) {
      const segs = key.split('/');
      sortIteratee = item => _.reduce(segs, (memo, seg) => _.result(memo, seg), item);
    }

    if (sortIteratee) {
      data = _.sortBy(data, sortIteratee);

      if (direction < 0) {
        data.reverse();
      }
    }

    return Promise.resolve({
      itemCount: data.length || 0,
      items: data.slice(skip, skip + take),
    });
  }
}

