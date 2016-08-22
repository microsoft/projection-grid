import _ from 'underscore';

export function patchChange (state, clientStateID) {
  const changedData = this.editor._changedData;
  const primaryKey = this.editor.primaryKey;
  const data = _.map(state.items, item => {
    const key = item[primaryKey];
    if(key in changedData) {
      if(changedData[key].editState == 'UPDATED') {
        return changedData[key].item;
      } else if(changedData[key].editState == 'REMOVED') {
        return;
      }
    } else {
      return item;
    }
  });
  _.each(changedData, item => {
    if(item.editState == 'CREATED') {
      data.push(item);
    }
  });
  return _.defaults({ items: data }, state);
}
