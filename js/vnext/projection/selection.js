import _ from 'underscore';
import selectionHeadTemplate from './selection-head.jade';
import selectionBodyTemplate from './selection-body.jade';

function normalize(selection) {
  return _.defaults(_.isObject(selection) ? selection : {}, {
    single: false,
    selected: [],
  });
}

export function setSelectAll(gridView, checked) {
  let selection = normalize(gridView.get('selection'));

  if (checked) {
    selection = _.defaults({
      selected: _.keys(gridView._chainData.state.itemIndex),
    }, selection);
  } else {
    selection = _.defaults({
      selected: [],
    }, selection);
  }

  gridView.set({ selection });
}

function changeSelectAll(e) {
  setSelectAll(this, e.target.checked);
}

export function setSelectRow(gridView, key, checked) {
  let selection = normalize(gridView.get('selection'));

  if (selection.single) {
    selection = _.defaults({ selected: [key] }, selection);
  } else {
    let selected = null;

    if (checked) {
      selected = _.union(selection.selected, [key]);
    } else {
      selected = _.without(selection.selected, key);
    }
    selection = _.defaults({ selected }, selection);
  }

  gridView.set({ selection });
}

function changeSelectRow(e) {
  const index = this.indexOfElement(e.target);
  const key = _.result(this.itemAt(index), this.primaryKey);

  setSelectRow(this, key, e.target.checked);
}

export function selection (state, selection) {
  if (!selection) {
    return _.clone(state);
  }

  const model = normalize(selection);
  const selectedIndex = _.reduce(model.selected, (memo, key) => {
    memo[key] = true;
    return memo;
  }, {});
  const primaryKey = state.primaryKey;

  const columns = [{
    name: 'selection',
    width: '30px',
    html: selectionHeadTemplate({
      single: model.single,
      checked: this.countRows > 0 && model.selected.length === this.countRows,
    }),
    template: selectionBodyTemplate,
    property: ({ item }) => ({ 
      single: model.single,
      checked: selectedIndex[item[primaryKey]],
    }),
    sortable: false,
  }].concat(state.columns);

  const events = _.defaults({
    'change th input.select-all': changeSelectAll,
    'change td input.select-row': changeSelectRow,
  }, state.events);

  return _.defaults({ columns, events }, state);
}
