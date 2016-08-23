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

    return Promise.resolve({
      itemCount: data.length || 0,
      items: data.slice(start, stop),
    });
  }

  create(attrs) {
    const serverKey = _.uniqueId('grid-item-');
    this.data[serverKey] = attrs;
    return serverKey;
  }

  update(key, attrs) {
    if (!_.has(this.data, key)) {
      return new Error("Data doesn't exist !");
    }
    this.data[key] = defaultsDeep(attrs, this.data[key]);
  }

  destroy(key) {
    return delete this.data[key];
  }


}

