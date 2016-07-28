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

export function selection (state, { selection } = {}) {
  if (!selection) {
    return state;
  }

  const model = normalize(selection);
  const selectedIndex = _.reduce(model.selected, (memo, index) => {
    memo[index] = true;
    return memo;
  }, {});

  state.columns.unshift({
    name: 'selection',
    width: '30px',
    html: selectionHeadTemplate({
      checked: model.selected.length === this.countRows,
    }),
  });

  state.bodyRows = state.bodyRows.map((row, index) => {
    row.item.selection = {
      html: selectionBodyTemplate({
        single: model.single,
        checked: selectedIndex[index],
      }),
    };
    return row;
  });

  state.events = _.extend({}, state.events, {
    'change th input.select-all': changeSelectAll,
    'change td input.select-row': changeSelectRow,
  });

  return state;
}
