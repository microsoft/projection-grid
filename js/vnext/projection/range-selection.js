import _ from 'underscore';

function changeSelectRow(e) {
  const key = this.keyOfElement(e.target);
  const rangeSelection = this.get('rangeSelection');

  if (!e.shiftKey) {
    rangeSelection.preSelect = key;
    return;
  }

  const selection = this.get('selection');
  const selected = selection.selected;
  const selectable = selection.selectable;
  const preSelect = rangeSelection.preSelect;
  const preShiftSelect = rangeSelection.preShiftSelect;
  const allKey = _.chain(this.items.slice())
    .filter(selectable)
    .map(_.property(this.primaryKey))
    .map(String)
    .value();
  const preIndex = allKey.indexOf(preSelect);
  const curIndex = allKey.indexOf(key);
  const selectObj = _.indexBy(selected);

  if (preShiftSelect) {
    const preShiftIndex = allKey.indexOf(preShiftSelect);

    _.each(allKey.slice(
      Math.min(preIndex, preShiftIndex),
      Math.max(preIndex, preShiftIndex) + 1
    ), key => {
      delete selectObj[key];
    });
  }

  _.each(allKey.slice(
    Math.min(preIndex, curIndex),
    Math.max(preIndex, curIndex) + 1
  ), key => {
    selectObj[key] = key;
  });

  rangeSelection.preShiftSelect = key;
  this.set({
    selection: _.defaults({ selected: _.keys(selectObj) }, selection),
  }, () => {
    console.log('range: single shift select');
  });
}

function changeSelectAll() {
  const rangeSelection = this.get('rangeSelection');

  rangeSelection.preSelect = null;
  rangeSelection.preShiftSelect = null;
}

function selectionProjectionHandler(state, config, model) {
  if (model.selection.single) {
    return state;
  }

  const events = _.defaults({
    'click th input.select-all': changeSelectAll,
    'click td input.select-row': changeSelectRow,
  }, state.events);

  return _.defaults({ events }, state);
}

export const rangeSelection = {
  name: 'rangeSelection',
  handler: selectionProjectionHandler,
  defaults: {
    preSelect: null,
    preShiftSelect: null,
  },
};
