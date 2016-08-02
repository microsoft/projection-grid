import _ from 'underscore';
import selectionHeadTemplate from './selection-head.jade';
import selectionBodyTemplate from './selection-body.jade';

function normalize(selection) {
  return _.defaults(_.isObject(selection) ? selection : {}, {
    single: false,
    selected: [],
  });
}

function changeSelectAll(e) {
  let selection = normalize(this.get('selection'));
  let checked = e.target.checked;

  if (checked) {
    selection = _.defaults({
      selected: _.range(this.countRows),
    }, selection);
  } else {
    selection = _.defaults({
      selected: [],
    }, selection);
  }

  this.set({ selection });
}

function changeSelectRow(e) {
  let selection = normalize(this.get('selection'));
  let index = this.indexOfElement(e.target);
  let checked = e.target.checked;

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

  this.set({ selection });
}

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
    template: (index) => selectionBodyTemplate({
          single: model.single,
          checked: selectedIndex[index],
        }),
    sortable: false,
  }].concat(state.columns);

  const bodyRows = state.bodyRows.map((row, index) => _.defaults({
    item: _.defaults({
      selection: {
        index,
      },
    }, row.item),
  }, row));

  const events = _.defaults({
    'change th input.select-all': changeSelectAll,
    'change td input.select-row': changeSelectRow,
  }, state.events);

  return _.defaults({ columns, bodyRows, events }, state);
}
