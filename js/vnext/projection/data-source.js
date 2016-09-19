import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';

import { odata } from './odata.js';
import { memory } from './memory.js';
import { jsdata } from './jsdata.js';

const defaultPrimaryKey = '__primary_key__';

/**
 * The data source configurations.
 * @typedef DataSourceConfig
 * @type {Object}
 * @property {string|CustomDataSource} type
 *    The data source type. It could be 'odata', 'memory', 'jsdata' or a
 *    customized data source object.
 * @property {OrderByConfig} orderby
 *    The sorting parameter.
 * @property {Object} filter
 *    The filter object in MangoDB format.
 * @property {Object} options
 *    The additional options to the data source.
 * @property {number} skip
 *    The number of item to skip from the query result.
 * @property {number} take
 *    The number of item to take from the query result.
 *
 * @property {?string} url
 *    An option for odata data source, the root URL of the entity set.
 * @property {?Resource} entity
 *    An option of jsdata data source, the JSData Resource for the entity set.
 * @property {Object[]} data
 *    An option of memory data source, an array of the original data items.
 */

/**
 * Fetching data from different data source
 * @param {DataChainState} state
 * @param {DataSourceConfig} options 
 *    The data source configurations.
 */
function dataSourceProjectionHandler(state, options) {
  const type = options.type;
  /**
   * @typedef CustomDataSource
   * @type {Object}
   * @property {FindAllCallback} findAll
   *    Make query with the query parameters.
   */
  const { findAll, update } = _.isString(type) ? ({
    odata,
    memory,
    jsdata,
  })[type] : type;

  const primaryKey = _.result(options, 'primaryKey') ||
    _.result(options.schema, 'primaryKey') ||
    defaultPrimaryKey;

  /**
   * The `GridView` will reload data from the data source.
   * @event GridView#willReload
   */
  this.trigger('willReload');

  /**
   * @callback FindAllCallback
   * @param {DataSourceConfig} options
   *    The data source configuration including the query parameters.
   * @return {Object[]|Promise}
   *    An array or a `Promise` of array of data items.
   */
  return Promise.resolve(findAll(options)).catch(error => {
    return {
      itemCount: 0,
      items: [],
      error,
    };
  }).then(({ itemCount, items }) => {
    const itemIndex = {};

    _.each(items, item => {
      if (!_.has(item, primaryKey)) {
        item[primaryKey] = _.uniqueId('grid-item-');
      }
      itemIndex[item[primaryKey]] = item;
    });

    return {
      uniqueId: _.uniqueId('grid-data-'),
      items,
      itemIndex,
      primaryKey,
      update: item => update(item, options),
      itemCount: itemCount,
    };
  }).finally(() => {

    /**
     * The `GridView` did reload data from the data source.
     * @event GridView#didReload
     */
    this.trigger('didReload')
  });
}


export const dataSource = {
  name: 'dataSource',
  handler: dataSourceProjectionHandler,
  defaults: {},
};

