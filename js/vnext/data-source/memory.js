import _ from 'underscore';
import { DataSource } from './base.js';

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
  }

  query(params) {
    const {
      skip = 0,
      take = this.data.length - skip,
      filter = () => true,
      orderby = [],
    } = params || {};

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

    return {
      totalCount: data.length,
      items: data.slice(skip, skip + take),
    };
  }
}

