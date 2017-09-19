import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';

/**
 * The data source configurations.
 * @typedef QueryConfig
 * @type {Object}
 * @property {OrderByConfig} orderby
 *    The sorting parameter.
 * @property {Object} filter
 *    The filter object in MangoDB format.
 * @property {number} skip
 *    The number of item to skip from the query result.
 * @property {number} take
 *    The number of item to take from the query result.
 */

/**
 * Fetching data from the data source
 * @param {DataChainState} state
 * @param {QueryConfig} params
 *    The data source configurations.
 * @return {DataChainState}
 */
function queryProjectionHandler(state, params) {
  const primaryKey = this.primaryKey;

  /**
   * The `GridView` will reload data from the data source.
   * @event GridView#willReload
   */
  this.trigger('willReload');

  return Promise.resolve(this.query(params)).catch(error => {
    console.warn(error);
    this.trigger('didReload', false, error);
    return {
      totalCount: 0,
      items: [],
      error,
    };
  }).then(({ totalCount, items }) => {
    const itemIndex = {};

    _.each(items, item => {
      if (!_.has(item, primaryKey)) {
        item[primaryKey] = _.uniqueId('grid-item-');
      }
      itemIndex[item[primaryKey]] = item;
    });

    /**
     * The `GridView` did reload data from the data source.
     * This event take 2 parameters
     * 1. succeeded (Boolean), true if the data fetch succeeded
     * 2. data|rejection (Object)
     *    * If the data fetch succeeded, pass the fetched data in form of
     *      `{ totalCount, items }`. Where `totalCount` is the server side total
     *      item count, and the items is the array of data items with current
     *      query condition
     *    * If the data fetch failed, pass the rejection object, which is
     *      usually an `Error` object from the data source
     * @event GridView#didReload
     */
    this.trigger('didReload', true, { totalCount, items });

    return {
      uniqueId: _.uniqueId('grid-data-'),
      items,
      itemIndex,
      primaryKey,
      totalCount,
    };
  });
}

export const query = {
  name: 'query',
  handler: queryProjectionHandler,
  defaults: {},
};
