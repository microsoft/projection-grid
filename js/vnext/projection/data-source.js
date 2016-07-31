import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';

import { odata } from './odata.js';
import { memory } from './memory.js';
import { jsdata } from './jsdata.js';

export function dataSource(state, options) {
  const type = options.type;
  const callback = _.isFunction(type) ? type : ({
    odata,
    memory,
    jsdata
  })[type];

  return callback(options);
}

