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
      selected: _.range(gridView.countRows),
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

export function setSelectRow(gridView, index, checked) {
  let selection = normalize(gridView.get('selection'));

  if (selection.single) {
    selection = _.defaults({ selected: [index] }, selection);
  } else {
    let selected = null;

    if (checked) {
      selected = _.union(selection.selected, [index]);
    } else {
      selected = _.without(selection.selected, index);
    }
    selection = _.defaults({ selected }, selection);
  }

  gridView.set({ selection });
}

function changeSelectRow(e) {
  setSelectRow(this, this.indexOfElement(e.target), e.target.checked);
}

/**
* Add selection box to rows.
*
* @param {Object} state
* @param {Array} [state.item] Data from data source.
* @param {Object} selection 
*/
export function selection (state, selection) {
  if (!selection) {
    return _.clone(state);
  }

  const model = normalize(selection);
  const selectedIndex = _.reduce(model.selected, (memo, index) => {
    memo[index] = true;
    return memo;
  }, {});

  const columns = [{
    name: 'selection',
    width: '30px',
    html: selectionHeadTemplate({
      single: model.single,
      checked: this.countRows > 0 && model.selected.length === this.countRows,
    }),
    template: selectionBodyTemplate,
    property: ({ index }) => ({ 
      single: model.single,
      checked: selectedIndex[index],
    }),
    sortable: false,
  }].concat(state.columns);

  const events = _.defaults({
    'change th input.select-all': changeSelectAll,
    'change td input.select-row': changeSelectRow,
  }, state.events);

  return _.defaults({ columns, events }, state);
}
