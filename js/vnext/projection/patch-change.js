import _ from 'underscore';
import $ from 'jquery';

export function patchChange (state,  options) {
  const changedData = editor._changedData;
  const primaryKey = state.primaryKey;
  const itemIndex = $.extend(true, {}, state.itemIndex);
  let itemCount = state.itemCount; 
  const items = _.reduce(state.items, (memo, item) => {
    const key = item[primaryKey];
    if(key in changedData) {
      //just for demo
      //memo.push(changedData[key].item);
      //return memo;

      if(changedData[key].editState == 'REMOVED') {
        delete itemIndex[key];
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
