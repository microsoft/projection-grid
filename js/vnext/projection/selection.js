import _ from 'underscore';
import { SingleSelectionResolver } from './single-selection-resolver.js';
import { MultipleSelectionResolver } from './multiple-selection-resolver.js';
import selectionHeadTemplate from './selection-head.jade';
import selectionBodyTemplate from './selection-body.jade';

function updateSelection(gridView, selection) {
  gridView.trigger('willSelect', selection.selected);
  gridView.set({ selection }, () => {
    gridView.trigger('didSelect', selection.selected);
  });
}

export function setSelectAll(gridView, checked) {
  const { resolver } = gridView.get('selection');
  const selection = checked ? resolver.selectAll() : resolver.deselectAll();

  updateSelection(gridView, selection);
}

function changeSelectAll(e) {
  setSelectAll(this, e.target.checked);
  e.preventDefault();
}

export function setSelectRow(gridView, key, checked) {
  const { resolver } = gridView.get('selection');
  const selection = checked ? resolver.selectRow(key) : resolver.deselectRow(key);

  updateSelection(gridView, selection);
}

function changeSelectRow(e) {
  const key = this.keyOfElement(e.target);

  setSelectRow(this, key, e.target.checked);
  e.preventDefault();
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
  handler(state, { enabled, resolver }) {
    if (!enabled) {
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
    } = resolver.updateItems(state.items);

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

  normalize(selection) {
    if (!selection) {
      return { enabled: false };
    }

    const config = _.defaults({}, _.isObject(selection) ? selection : {}, {
      enabled: true,
      single: false,
      selected: [],
      selectable: (item) => _.has(item, this.primaryKey),
      colClasses: [],
      headClasses: [],
      bodyClasses: [],
      footClasses: [],
    });

    if (!_.isFunction(config.Resolver)) {
      config.Resolver = config.single ? SingleSelectionResolver : MultipleSelectionResolver;
    }

    if (!(config.resolver instanceof config.Resolver)) {
      config.resolver = new config.Resolver(this);
    }

    return config;
  },

  defaults: {},
};

