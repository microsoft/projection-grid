import _ from 'underscore';
import { DataSource } from './base.js';

const truthy = _.constant(true);

/**
 * Data source from an in-memory array.
 * @class MemoryDataSource
 * @param {Object[]} data
 *    The in-memory array for the data set.
 * @param {string} primaryKey
 *    The primary key of the data set.
 */
export class MemoryDataSource extends DataSource {
  constructor(data, primaryKey) {
    super(primaryKey);
    this.data = data;

    // This caches the query result without skip and take
    this._cache = {
      seed: this.data,
      query: null,
      data: this.data,
    };
  }

  /**
   * The cached items respecting the sorting and filtering,
   * ignoring the skip and take.
   * @type {Object[]}
   */
  get cachedItems() {
    return this._cache.data;
  }

  query(params) {
    const {
      skip = 0,
      take = this.data.length - skip,
      filter = truthy,
      orderby = [],
    } = params || {};

    if (this._cache.seed !== this.data || !_.isEqual(this._cache.query, { filter, orderby })) {
      const { key, direction } = _.first(orderby) || {};
      let sortIteratee = null;

      if (_.isFunction(key)) {
        sortIteratee = key;
      } else if (_.isString(key)) {
        const segs = key.split(/[\.\/]/);
        sortIteratee = item => _.reduce(segs, (memo, seg) => _.result(memo, seg), item);
      }

      let data = _.filter(this.data, filter);

      if (sortIteratee) {
        data = _.sortBy(data, sortIteratee);

        if (direction < 0) {
          data.reverse();
        }
      }

      this._cache = {
        seed: this.data,
        query: { filter, orderby },
        data,
      };
    }

    return {
      totalCount: this._cache.data.length,
      items: this._cache.data.slice(skip, skip + take),
    };
  }
}

