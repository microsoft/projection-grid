import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';

import { odata } from './odata.js';
import { memory } from './memory.js';
import { jsdata } from './jsdata.js';

export function buffer(state, buffer = {}) {
  const { primaryKey, uniqueId } = state;

  if (buffer.uniqueId !== uniqueId) {
    buffer.uniqueId = uniqueId;
    buffer.changed = {};
  }

  const items = {
    length: state.items.length,
    slice: (begin = 0, end = state.items.length) => {
      return state.items.slice(begin, end).map(item => {
        const key = item[primaryKey];

        if (_.has(buffer.changed, key)) {
          return buffer.changed[key].item;
        }
        return item;
      });
    },
  }

  return _.defaults({ items }, state);
}


