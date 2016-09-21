import _ from 'underscore';

export function patchError (state, options) {
  if (!options || !options.errorMsg) {
    return state;
  }
  const errorMsg = options.errorMsg;
  const primaryKey = state.primaryKey;
  let itemCount = state.itemCount;
  const items = _.reduce(state.items, (memo, item) => {
    const key = item[primaryKey];
    memo.push(item);
    if (key in errorMsg) {
      memo.push({ html: errorMsg[key], classes: 'error-message' });
      itemCount++;
    }
    return memo;
  }, []);

  return _.defaults({ items, itemCount }, state);
}