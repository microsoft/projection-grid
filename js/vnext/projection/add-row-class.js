import _ from 'underscore';

const editStateClasses = {
  'CREATED': ['row-buffer-created'],
  'UPDATED': ['row-buffer-updated'],
  'REMOVED': ['row-buffer-removed'],
  'COMMITTED': ['row-buffer-committed'],
};

function addRowClassHandler(state) {
  const primaryKey = state.primaryKey;
  _.each(state.bodyRows, row => {
    const key = row.item[primaryKey];
    if (key) {
      const editState = editor.getItemEditState(key);
      row.classes = _.union(row.classes, _.result(editStateClasses, editState, []));
    }
  });

  return _.defaults({}, state);
}

export const addRowClass = {
  name: 'addRowClass',
  handler: addRowClassHandler,
  defaults: {},
};