import _ from 'underscore';
import selectionHeadTemplate from './selection-head.jade';
import selectionBodyTemplate from './selection-body.jade';

function normalize(selection, items, primaryKey) {
  const config = _.defaults({}, _.isObject(selection) ? selection : {}, {
    single: false,
    selected: [],
    selectable: (item) => _.has(item, primaryKey),
    colClasses: [],
    headClasses: [],
    bodyClasses: [],
    footClasses: [],
  });

  if (_.isFunction(config.selectable)) {
    config.selectable = _.chain(items.slice())
      .filter(config.selectable)
      .pluck(primaryKey)
      .map(String)
      .value();
  }

  return config;
}

export function setSelectAll(gridView, checked) {
  const items = _.result(gridView._chainData.state, 'items', []);
  let selection = normalize(gridView.get('selection'), items, gridView.primaryKey);

  if (checked) {
    selection = _.defaults({
      selected: selection.selectable,
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
  let selection = normalize(gridView.get('selection'), items, gridView.primaryKey);

  if (!_.contains(selection.selectable, key)) {
    return;
  }

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
    } = normalize(selection, state.items, state.primaryKey);

    const [selectedIndex, selectableIndex] = _.map([
      selected,
      selectable,
    ], keys => _.reduce(keys, (memo, key) => {
      memo[key] = true;
      return memo;
    }, {}));
    const primaryKey = state.primaryKey;

    const columns = [{
      name: 'selection',
      html: selectionHeadTemplate({
        single,
        checked: selectable.length > 0 && selected.length == selectable.length,
      }),
      template: selectionBodyTemplate,
      property: item => ({ 
        single,
        selectable: selectableIndex[item[primaryKey]],
        checked: selectedIndex[item[primaryKey]],
      }),
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

