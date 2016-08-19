import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';

import { odata } from './odata.js';
import { memory } from './memory.js';
import { jsdata } from './jsdata.js';

const defaultPrimaryKey = '__primary_key__';

/**
* Fetching data from different data source
*
* @param {Object} state
* @param {Object} options 
* @param {String | Function} [options.type] Data source type
* @param {String} [options.url] An option for odata
* @param {String} [options.verb] An option for odata. Http request mode, such as 'get', 'post'
* @param {Resource} [options.entity] An option of js-data
* @param {Object[]} [options.data] An option of memory. Array of original data from memory
* @param {Number} [options.skip] Beginning index. If omitted, it takes '0'
* @param {Number} [options.take] Take this length of data. If omitted, it takes all data between 'skip' and  data.length
* @param {Object[]} [options.orderby] Each array item is an object 
* @param {String} [options.orderby.key] Column name identifying which column to apply the order
* @param {Number} [options.orderby.direction] direction > 0 : ascending, else descending
* @param {Function} [options.filter] Filter applyed to original data from data source
* @param {Array} [options.select]
* 
*/

export const dataSource = {
  name: 'dataSource',
  handler(state, options) {
    const type = options.type;
    const { findAll, update } = _.isString(type) ? ({
      odata,
      memory,
      jsdata,
    })[type] : type;

    const primaryKey = _.result(options, 'primaryKey') ||
      _.result(options.schema, 'primaryKey') ||
      defaultPrimaryKey;

    return Promise.resolve(findAll(options)).then(({ itemCount, items }) => {
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
    });
  },
  defaults: {},
};

