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
 * @param {StructureChainState} state
 *    The input state.
 * @param {boolean|SelectionConfig} selection
 *    The selection configuration. It can be
 *    * A boolean to indicate whether the grid has the selection column.
 *    * A detailed {@link SelectionConfig} object.
 */
function selectionProjectionHandler(state, { enabled, resolver }) {
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

  /**
   * Callback to decide whether a row is selectable.
   * @callback SelectableCallback
   * @param {Object} item
   *    The data item of the row.
   * @return {boolean}
   */
  if (!single) {
    const selectableCount = _.filter(state.items.slice(), selectable).length;
    const selectedCount = _.filter(selected, key => selectable(this.itemWithKey(key))).length;

    selectedAll = selectedCount === selectableCount;
  }

  const columns = [{
    name: 'selection',
    html: selectionHeadTemplate({
      single,
      checked: selectedAll,
      checkAllLabel: state.a11y.selectAllLabel
    }),
    template: selectionBodyTemplate,
    property: item => {
      return {
        single,
        selectable: selectable(item),
        checked: selectedIndex[item[primaryKey]],
        labelbyId: item[primaryKey],
      };
    },
    sortable: false,
    colClasses,
    headClasses,
    bodyClasses,
    footClasses,
  }].concat(state.columns);

  const bodyRows = _.map(state.bodyRows, row => {
    if (row && row.type === 'data' && row.item && selectable(row.item)) {
      let selectedClassArray = selectedIndex[row.item[primaryKey]] ? ['row-selected'] : [];

      return _.defaults({
        attributes: {
          id: row.item[primaryKey],
        },
        classes: _.union(selectedClassArray, row.classes),
      }, _.isObject(row) ? row : {});
    }
    return row;
  });

  const events = _.defaults({
    'change th input.select-all': changeSelectAll,
    'change td input.select-row': changeSelectRow,
  }, state.events);

  return _.defaults({ columns, events, bodyRows }, state);
}

/**
 * Normalize the selection config
 * @param {boolean|SelectionConfig} selection
 *    The selection configuration.
 */
function normalizeSelectionConfig(selection) {
  if (!selection) {
    return { enabled: false };
  }

  /**
   * @typedef SelectionConfig
   * @type {Object}
   * @property {boolean} enabled
   *    Whether the selection feature is enabled.
   * @property {boolean} single
   *    True if only 1 row can be selected at the same time.
   * @property {string[]} selected
   *    The primary key of rows being selected.
   * @property {SelectableCallback} selectable
   *    A callback to decide whether a row is selectable.
   * @property {ClassesConfig} colClasses
   *    The classes of the 'COL' element for the selection column.
   * @property {ClassesConfig} headClasses
   *    The classes of the 'TH' element in 'THEAD' of the selection column.
   * @property {ClassesConfig} bodyClasses
   *    The classes of the 'TD' elements in 'TBODY' of the selection column.
   * @property {ClassesConfig} footClasses
   *    The classes of the 'TD' elements in 'TFOOT' of the selection column.
   */
  const config = _.defaults({}, _.isObject(selection) ? selection : {}, {
    enabled: true,
    single: false,
    selected: [],
    selectable: item => _.has(item, this.primaryKey),
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
}


export const selection = {
  name: 'selection',
  handler: selectionProjectionHandler,
  normalize: normalizeSelectionConfig,
  defaults: false,
};

