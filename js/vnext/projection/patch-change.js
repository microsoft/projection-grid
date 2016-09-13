import _ from 'underscore';

export function patchChange (state,  options) {
  const changedData = editor._changedData;
  const primaryKey = state.primaryKey;
  const itemIndex = state.itemIndex;
  const itemCount = state.itemCount; 
  const items = _.reduce(state.items, (memo, item, itemCount) => {
    const key = item[primaryKey];
    if(key in changedData) {
      //just for demo
      //memo.push(changedData[key].item);
      //return memo;
      
      
      if(changedData[key].editState == 'REMOVED') {
        itemCount--;
        return memo;
      } else {
        memo.push(changedData[key].item);
        return memo;
      }
      
    } else {
      memo.push(item);
      return memo;
    }
  }, []);
  _.each(changedData, (change, key, itemCount) => {
    if(change.editState == 'CREATED') {
      items.unshift(change.item);
      itemIndex[key] = change.item;
      itemCount++;
    }
  });
  return _.defaults({ items, itemIndex, itemCount }, state);
}
