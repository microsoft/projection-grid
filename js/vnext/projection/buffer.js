import _ from 'underscore';
import $ from 'jquery';
import Promise from 'bluebird';

import { odata } from './odata.js';
import { memory } from './memory.js';
import { jsdata } from './jsdata.js';

export function buffer(state, buffer = {}) {
  const { primaryKey, uniqueId, update } = state;

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

  const updateItemState = (item, state) => {
    const changed = {};

    changed[item[primaryKey]] = {
      item,
      state,
    };
    _.defaults(changed, buffer.changed);

    this.set({
      buffer: { uniqueId, changed },
    });
  }

  const onCommit = item => {
    if (item) {
      updateItemState(item, 'committed');
    }
  }

  const onEdit = item => {
    if (item) {
      updateItemState(item, 'changed');
      if (_.isFunction(update)) {
        update(item).then(onCommit);
      }
    }
  }

  const events = _.defaults({ didEdit: onEdit }, state.events);

  return _.defaults({ items, events }, state);
}


