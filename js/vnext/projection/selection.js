import _ from 'underscore';
import selectionHeadTemplate from './selection-head.jade';
import selectionBodyTemplate from './selection-body.jade';

function normalize(selection, items, gridView) {
  const config = _.defaults({}, _.isObject(selection) ? selection : {}, {
    single: false,
    selected: [],
    selectable: (item) => _.has(item, gridView.primaryKey),
    colClasses: [],
    headClasses: [],
    bodyClasses: [],
    footClasses: [],
  });

  return config;
}

export function setSelectAll(gridView, checked) {
  const items = _.result(gridView._chainData.state, 'items', []);
  let selection = normalize(gridView.get('selection'), items, gridView);


  if (checked) {
    selection = _.defaults({
      selected: _.filter(selection.selected, (key) => {
        return selection.selectable(gridView.itemWithKey(key));
      }),
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
  const items = _.result(gridView._chainData.state, 'items', []);
  let selection = normalize(gridView.get('selection'), items, gridView);

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

    const {
      selected,
      single,
      colClasses,
      headClasses,
      bodyClasses,
      footClasses,
      selectable,
    } = normalize(selection, state.items, this);

    const selectedIndex = _.reduce(selected, (memo, key) => {
      memo[key] = true;
      return memo;
    }, {});
    const primaryKey = state.primaryKey;
    let selectedAll = false;

    if (!single) {
      const selectableCount = _.filter(state.items.slice(), selectable).length;
      const selectedCount = _.filter(selected, key => selectable(this.itemWithKey(key))).length;

      selectedAll = selectedCount === selectableCount;
    }

    const columns = [{
      name: 'selection',
      html: selectionHeadTemplate({
        single,
        checked: selectedAll
      }),
      template: selectionBodyTemplate,
      property: item => {
        return { 
          single,
          selectable: selectable(item),
          checked: selectedIndex[item[primaryKey]],
        };
      },
      sortable: false,
      colClasses,
      headClasses,
      bodyClasses,
      footClasses,
    }].concat(state.columns);

    const events = _.defaults({
      'change th input.select-all': changeSelectAll,
      'change td input.select-row': changeSelectRow,
    }, state.events);

    return _.defaults({ columns, events }, state);
  },
  defaults: null,
};

