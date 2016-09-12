import _ from 'underscore';
import Promise from 'bluebird';
import { Storage } from './storage.js';

function defaultsDeep(dest, src) {
  if (_.isObject(dest) && !_.isArray(dest)) {
    _.defaults(dest, src);
    _.each(src, (value, key) => {
      if (dest[key] !== value) {
        defaultsDeep(dest[key], value);
      }
    });
  }
  return dest;
}

export class MemoryStorage extends Storage {
  constructor(options) {
    super(options);
    this.data = _.reduce(options.data, (memo, item) => {
      if (!_.has(item, this.primaryKey)) {
        item[this.primaryKey] = _.uniqueId('grid-item-');
      }

      return _.extend(memo, {
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

    const start = _.isUndefined(skip) ? 0 : skip;
    const stop = _.isUndefined(take) ? data.length : start + take;

    const itemCount = data.length || 0;
    const items = data.slice(start, stop);
    const itemIndex = {};

    _.each(items, item => {
      itemIndex[item[this.primaryKey]] = item;
    });

    return Promise.resolve({
        uniqueId: _.uniqueId('grid-data-'),
        items,
        itemIndex,
        primaryKey: this.primaryKey,
        update: _.noop,
        itemCount,
    }).bind(this);
  }

  create(attrs) {
    const serverKey = _.uniqueId('grid-item-');
    this.data[serverKey] = attrs;
    this.data[serverKey][this.primaryKey] = serverKey
    return Promise.resolve(this.data[serverKey]);
  }

  update(key, attrs) {
    if (!_.has(this.data, key)) {
      return Promise.reject("Data doesn't exist !");
    }
    this.data[key] = defaultsDeep(attrs, this.data[key]);
    return Promise.resolve('update successfully');
  }

  destroy(key) {
    delete this.data[key];
    return Promise.resolve('delete successfully');
  }

}

