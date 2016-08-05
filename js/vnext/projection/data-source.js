import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';

import { odata } from './odata.js';
import { memory } from './memory.js';
import { jsdata } from './jsdata.js';

const defaultPrimaryKey = '__primary_key__';

/**
* Data source projection. 
*
* @param {Object} options 
* @param {string | function} [options.type] Data source type.
* @param {string} [options.url] An option for odata.
* @param {string} [options.verb] An option for odata. Http request mode, such as 'get', 'post'.
* @param {Resource} [options.entity] An option of js-data.
* @param {Array} [options.data] An option of memory. Array of original data from memory.
* @param {number} [options.skip] Beginning index. If omitted, it takes '0'.
* @param {number} [options.take] Take this length of data. If omitted, it takes all data between 'skip' and  data.length.
* @param {Object} [options.orderby] 
* @param {string} [options.orderby.key] Column name.
* @param {number} [options.orderby.direction] direction > 0 : ascending, else descending.
* 
*/

export function dataSource(state, options) {
  const type = options.type;
  const { findAll, update } = _.isString(type) ? ({
    odata,
    memory,
    jsdata,
  })[type] : type;

  const primaryKey = _.result(options, 'primaryKey') ||
    _.result(options.schema, 'primaryKey') ||
    defaultPrimaryKey;

  return Promise.resolve(findAll(options)).then(({ items }) => {
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
    };
  });
}

