import _ from 'underscore';
import selectionHeadTemplate from './selection-head.jade';
import selectionBodyTemplate from './selection-body.jade';

function normalize(selection) {
  return _.defaults(_.isObject(selection) ? selection : {}, {
    single: false,
    selected: [],
    headClasses: [],
    bodyClasses: [],
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
  const keyStr = key.toString();
  let selection = normalize(gridView.get('selection'));

  if (selection.single) {
    selection = _.defaults({ selected: [keyStr] }, selection);
  } else {
    let selected = null;

    if (checked) {
      selected = _.union(selection.selected, [keyStr]);
    } else {
      selected = _.without(selection.selected, keyStr);
    }

    selection = _.defaults({ selected }, selection);
  }

  gridView.set({ selection });
}

function changeSelectRow(e) {
  const key = this.keyOfElement(e.target);

  setSelectRow(this, key, e.target.checked);
}

/**
 * Add selection box to rows
 *
 * @param {Object} state
 * @param {Object} [state.items] Original data from data source
 * @param {Boolean | Object} selection 'true': add a multiple selection column. Object with property 'single: true': add a radio selection column.
 *
 */
export const selection = {
  name: 'selection',
  handler(state, selection) {
    if (!selection) {
      return state;
    }

    const { selected, single, headClasses, bodyClasses } = normalize(selection);
    const selectedIndex = _.reduce(selected, (memo, key) => {
      memo[key] = true;
      return memo;
    }, {});
    const primaryKey = state.primaryKey;

    const columns = [{
      name: 'selection',
      html: selectionHeadTemplate({
        single,
        checked: this.countRows > 0 && selected.length === this.countRows,
      }),
      template: selectionBodyTemplate,
      property: item => ({ 
        single,
        checked: selectedIndex[item[primaryKey]],
      }),
      sortable: false,
      headClasses,
      bodyClasses,
    }].concat(state.columns);

    const events = _.defaults({
      'change th input.select-all': changeSelectAll,
      'change td input.select-row': changeSelectRow,
    }, state.events);

    return _.defaults({ columns, events }, state);
  },
  defaults: null,
};

