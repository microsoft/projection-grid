import _ from 'underscore';

export function patchChange (state,  options) {
  const changedData = this.editor._changedData;
  const primaryKey = this.editor.primaryKey;
  const data = _.reduce(state.items, (memo, item) => {
    const key = item[primaryKey];
    if(key in changedData) {
      //just for demo
      memo.push(changedData[key].item);
      return memo;
      /*
      if(changedData[key].editState == 'REMOVED') {
        return memo;
      } else {
        memo.push(changedData[key].item);
        return memo;
      }
      */
    } else {
      memo.push(item);
      return memo;
    }
  }, []);
  _.each(changedData, change => {
    if(change.editState == 'CREATED') {
      data.push(change.item);
    }
  });
  return _.defaults({ items: data }, state);
}