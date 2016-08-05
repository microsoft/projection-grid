import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';

import { odata } from './odata.js';
import { memory } from './memory.js';
import { jsdata } from './jsdata.js';

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
  const callback = _.isFunction(type) ? type : ({
    odata,
    memory,
    jsdata
  })[type];

  return callback(options);
}

