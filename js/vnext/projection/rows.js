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
    bodyRows = ['data-rows'],
  } = {}) {
    const patch = { headRows, footRows };

    const primaryKey = state.primaryKey;
    const items = state.items.slice(0, state.items.length);

    patch.bodyRows = _.reduce(bodyRows, (memo, row) => {
      if (row === 'data-rows' || row.name === 'data-rows'){
        _.each(items, item => {
          const key = item[primaryKey];
          const editState = '';//this.editor.getItemEditState(key);
          const classes = _.union(
            normalizeClasses(row.classes, item), 
            _.result(editStateClasses, editState, [])
          );

          memo.push({ item, classes, type: 'data' });
        });
      } else if (row.view) {
        throw new Error('Body row cannot have subviews');
      } else {
        memo.push(row);
      }

      return memo;
    }, []);

    return _.defaults(patch, state);
  },

  defaluts: {},
};

