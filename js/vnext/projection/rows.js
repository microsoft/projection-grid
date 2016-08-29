import _ from 'underscore';
import { normalizeClasses } from './common.js';

const editStateClasses = {
  'CREATED': ['row-buffer-created'],
  'UPDATED': ['row-buffer-updated'],
  'REMOVED': ['row-buffer-removed'],
  'COMMITTED': ['row-buffer-committed'],
  /*
  'CHANGED': ['row-buffer-changed'],
  'COMMITTED': ['row-buffer-committed'],
  */
};

/**
* Handling bodyRows and adding headRows, bodyRows, footRows to state
* 
* @param {Object} state
* @param {Object} [state.items] Original data from data source
* @param {Object[]} headRows User defined configuration. 'headRows' takes a default string 'column-header-rows'
* @param {Object[]} footRows User defined configuration
*/

export const rows = {
  name: 'rows',
  handler(state, {
    headRows = ['column-header-rows'],
    footRows = [],
    bodyRows = [{ name: 'data-rows' }],
  } = {}) {
    const primaryKey = this.editor.primaryKey;
    const stateItems = state.items.slice(0, state.items.length);
    const body = _.reduce(bodyRows, (memo, row) => {
      if (row === 'data-rows' || row.name === 'data-rows'){
        _.each(stateItems, stateItem => memo.push(_.extend({}, row, stateItem)));
      } else {
        memo.push(row);
      }
      return memo;
    }, []);
    const bodyItems = {
      length: body.length, 
      slice: (...args) => body.slice(...args).map(item => {
        const key = item[primaryKey];
        const editState = this.editor.getItemEditState(key);
        const classes = _.union(normalize(item.classes, item), _.result(editStateClasses, editState, []));
        return item.html ? { classes, html: item.html } : { classes, item };
      }),
    };
    return _.defaults({ headRows, bodyRows: bodyItems, footRows }, state);
  },

  defaluts: {},
};

