import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';

import { odata } from './odata.js';
import { memory } from './memory.js';
import { jsdata } from './jsdata.js';

const defaultPrimaryKey = '__primary_key__';

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

