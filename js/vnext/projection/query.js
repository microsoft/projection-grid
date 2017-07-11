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
    this.trigger('didReload', false);
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
     * @event GridView#didReload
     * @type Boolean - true if reload succeed
     */
    this.trigger('didReload', true);

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

