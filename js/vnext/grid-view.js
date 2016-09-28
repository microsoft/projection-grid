import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import Promise from 'bluebird';
import {
  query,
  buffer,
  selection,
  setSelectAll,
  setSelectRow,
  columns,
  rows,
  columnGroup,
  cells,
  editable,
  sortableHeader,
  events,
} from './projection';

import { TableView } from './layout';

function defaultsDeep(dest, src) {
  if (_.isObject(dest) && !_.isArray(dest)) {
    _.defaults(dest, src);
    _.each(src, (value, key) => {
      if (dest[key] !== value) {
        defaultsDeep(dest[key], value);
      }
    });
  }
  return dest;
}

function nextTick() {
  return new Promise((resolve, reject) => window.setTimeout(resolve, 0));
}

class ProjectionChain {
  constructor(model) {
    this.model = model;
    this.projections = [];
    this.state = null;
    this.input = null;
  }

  /*
   * When updating, execute each function in projections successively
   */
  update(input, force = false) {
    const updated = force || input !== this.input;

    this.input = input;

    return _.reduce(this.projections, ({
      updated,
      p$state,
    }, proj) => {
      const { name, handler, p$output } = proj;
      const result = {};

      if (updated || !p$output || _.has(this.model.changed, name)) {
        result.updated = true;
        result.p$state = proj.p$output = p$state.then(
          state => handler(state, this.model.get(name))
        );
      } else {
        result.updated = false;
        result.p$state = p$output;
      }

      return result;
    }, {
      updated,
      p$state: Promise.resolve(input),
    }).p$state.tap(state => {
      this.state = state;
    });
  }

  /*
   * Add projection functions to model.projections
   */
  pipe(...projs) {
    _.chain(projs)
      .flatten()
      .each(proj => {
        const config = this.model.get(proj.name) || proj.defaults;

        this.projections.push(proj);
        this.model.set(proj.name, proj.normalize(config));
      })
      .value();
    return this;
  }
}

/**
 * Class of a projection grid view
 * @class GridView
 * @extends Backbone.View
 * @param {Object} options
 *    The constructor options.
 * @param {string[]} [options.tableClasses=[]]
 *    The classes for the TABLE elements (content table and sticky/fixed header)
 * @param {ScrollingConfig} [options.scrolling={virtualized: false, header: 'static'}]
 *    The scrolling related configurations
 */
export class GridView extends Backbone.View {
  initialize({ scrolling, tableClasses, dataSource }) {
    this._tableView = new TableView({
      el: this.$el,
      scrolling,
      classes: tableClasses,
    });
    this.model = new Backbone.Model();

    this._dataSource = dataSource;

    const projections = this._projections = {};

    this._registerProjection = proj => {
      const name = proj.name;

      if (_.has(projections, ['name'])) {
        throw new Error('Duplication projectons');
      }

      /**
       * @callback ProjectionHandler
       * @param {DataChainState|StructureChainState|ContentChainState} state
       *    The input state.
       * @param {Object} config
       *    The projection configuration object.
       * @return {DataChainState|StructureChainState|ContentChainState|Promise}
       *    The output state or the `Promise` of the output state.
       */

      /**
       * @typedef ProjectionDefinition
       * @type {Object}
       * @property {string} name - name of the projection
       * @property {ProjectionHandler} handler
       *    The callback to transform the state
       * @property {Object} defaults
       *    The default configuration of the projection
       * @property {function} normalize
       *    The callback to normalize the projection configurations.
       */
      projections[name] = {
        name,
        handler: (_.isFunction(proj) ? proj : proj.handler).bind(this),
        defaults: proj.defaults,
        normalize: (proj.normalize || _.identity).bind(this),
      };

      return projections[name];
    };

    /**
     * @typedef DataChainState
     * @type {Object}
     * @property {string} uniqueId
     *    The unique id for the set of data items. It changes each time new
     *    query is made to the server.
     * @property {string} primaryKey
     *    The primary key of the data items.
     * @property {(Object[]|FakeArray)} items
     *    An array or a fake array of data items.
     * @property {number} totalCount
     *    The total item count on the server.
     * @property {Object.<string, Object>} itemIndex
     *    The items indexed by primary key.
     * @property {external:BackboneViewEventHash} events
     *    The event has in form of `Backbone.View#events`. Any projection can
     *    response to the DOM events by adding its own event handlers.
     */
    this._chainData = new ProjectionChain(this.model);

    /**
     * It extends the {@link DataChainState} with extra properties.
     * @typedef StructureChainState
     * @type {DataChainState}
     * @property {ColumnConfig[]} columns
     *    The array of column configurations.
     * @property {RowConfig[]} headRows
     *    The row configurations for `THEAD`.
     * @property {RowConfig[]} bodyRows
     *    The row configurations for `TBODY`.
     * @property {RowConfig[]} footRows
     *    The row configurations for `TFOOT`.
     */
    this._chainStructure = new ProjectionChain(this.model);

    /**
     * It extends the {@link StructureChainState} with extra properties, and
     * overrides some of the properties.
     * @typedef ContentChainState
     * @type {StructureChainState}
     * @property {ColumnGroup} columnGroup
     *    The column group object, represents the compiled column hierarchy.
     * @property {ColContent[]} cols
     *    The content for `COL` elements in `COLGROUP`.
     * @property {RowContent} headRows
     *    The content for rows in `THEAD`.
     * @property {RowContent} bodyRows
     *    The content for rows in `TBODY`.
     * @property {RowContent} footRows
     *    The content for rows in `TFOOT`.
     */
    this._chainContent = new ProjectionChain(this.model);

    this.pipeDataProjections(query, buffer);
    this.pipeStructureProjections([
      columns,
      rows,
      selection,
    ]);
    this.pipeContentProjections([
      columnGroup,
      cells,
      editable,
      sortableHeader,
      events,
    ]);

    const patchEvents = state => _.extend(state, {
      events: _.mapObject(state.events, handler => handler.bind(this)),
    });
    const refreshState = {
      changes: null,
      promise: null,
    };

    this._isRendered = false;
    const refresh = this.refresh = force => {
      const changes = refreshState.changes;

      refreshState.changes = null;

      /**
       * The `GridView` will update its configuration and redraw.
       * @event GridView#willUpdate
       */
      this.trigger('willUpdate', changes);

      // Don't refresh before the view is rendered
      if (!this._isRendered) {
        this.trigger('didUpdate', changes);
        return;
      }

      _.reduce([
        this._chainData,
        this._chainStructure,
        this._chainContent,
      ], (memo, chain) => chain.update(memo, force), null)
        .then(patchEvents)
        .then(state => new Promise((resolve, reject) => {
          this._tableView.set(state, resolve);
        }))
        .then(nextTick)
        .finally(() => {
          /**
           * The `GridView` did update its configuration and redraw.
           * @event GridView#didUpdate
           */
          this.trigger('didUpdate', changes);
        });
    };

    const scheduleUpdate = () => {
      if (refreshState.changes) {
        _.extend(refreshState.changes, this.model.changedAttributes());
      } else {
        refreshState.changes = this.model.changedAttributes();

        if (refreshState.promise) {
          refreshState.promise = refreshState.promise.then(refresh);
        } else {
          refreshState.promise = refresh();
        }
      }
    };

    this.model.on('change', scheduleUpdate);

    _.each([
      /**
       * The `GridView` will redraw the DOM. This event may trigger frequently
       * when virtualization is enabled.
       * @event GridView#willRedraw
       */
      'willRedraw',

      /**
       * The `GridView` did redraw the DOM. This event may trigger frequently
       * when virtualization is enabled.
       * @event GridView#didRedraw
       */
      'didRedraw',
    ], event => {
      this._tableView.on(event, (...args) => {
        this.trigger(event, ...args);
      });
    });

    this.on('all', (event, ...args) => {
      const events = _.chain(this._chainContent)
        .result('state').result('events').value();
      const handler = events && events[event];

      if (_.isFunction(handler)) {
        handler(...args);
      }
    });
  }

  /**
   * Pipe a projection to procceed the grid data
   * @param {...ProjectionDefinition} projs - A list of projection definitions
   * @return {GridView} - This grid view
   */
  pipeDataProjections(...projs) {
    this._chainData.pipe(_.map(_.flatten(projs), this._registerProjection));
    return this;
  }

  /**
   * Pipe a projection to procceed the grid structure
   * @param {...ProjectionDefinition} projs - A list of projection definitions
   * @return {GridView} - This grid view
   */
  pipeStructureProjections(...projs) {
    this._chainStructure.pipe(_.map(_.flatten(projs), this._registerProjection));
    return this;
  }

  /**
   * Pipe a projection to procceed the grid visual content
   * @param {...ProjectionDefinition} projs - A list of projection definitions
   * @return {GridView} - This grid view
   */
  pipeContentProjections(...projs) {
    this._chainContent.pipe(_.map(_.flatten(projs), this._registerProjection));
    return this;
  }

  /**
   * Change the grid(projection) configuratons
   * @param {Object.<string, Object>} config
   *    A hash of configurations to change. The keys are projection names while
   *    the values are the projection configurations
   * @param {function} callback
   *    A callback to notify the update is completed
   * @return {GridView}
   *    This grid view.
   */
  set(config = {}, callback = _.noop) {
    this.model.set(_.mapObject(config, (value, key) => {
      const projection = this._projections[key];

      return projection ? projection.normalize(value) : value;
    }));
    this.once('didUpdate', callback);
    return this;
  }

  /**
   * Read the grid(projection)_configuration
   * @param {string} name - name of the projection
   * @return {object}
   */
  get(name) {
    return this.model.get(name);
  }

  /**
   * Patch the grid(projection) configurations.
   * It's similar to {@link GridView#set}, but instead of replacing the
   * projection configurations, `patch` do deep object merge.
   * @param {Object.<string, Object>} config
   *    A hash of configurations to change. The keys are projection names
   *    while the values are the projection configurations
   * @param {function} callback
   *    A callback to notify the update is completed
   * @return {GridView}
   *    This grid view.
   */
  patch(state = {}, callback = _.noop) {
    this.set(_.reduce(_.keys(state), (memo, key) => {
      const value = state[key];
      const valueCur = this.model.get(key);
      
      memo[key] = defaultsDeep(value, valueCur);
      return memo;
    }, {}), callback);
  }

  /**
   * Render the grid view.
   * @param {function} callback
   *    A callback to notify the render is completed.
   * @return {GridView}
   *    This grid view.
   */
  render(callback) {
    this._tableView.render(() => {
      this._isRendered = true;
      this.refresh(true);
      this.once('didRedraw', callback);
    });
    return this;
  }

  /**
   * Destroy and detach the view from DOM.
   */
  remove() {
    this._tableView.remove();
    super.remove();
  }

  /* Helper functions */

  /**
   * A object implements a minimal interface of array to lazy fetch items.
   * We use this structure a lot in projections, so that we don't need to
   * procceed all the rows when virtualization is on.
   * @typedef FakeArray
   * @type {Object}
   * @property {function} slice
   *    a callback to get a slice of the items. It has the same signature as
   *    `Array.slice()`.
   * @property {number} length
   *    length of the array
   */

  /**
   * The data items. It's a fake array of original model.
   * @type {(Object[]|FakeArray)}
   */
  get items() {
    return _.result(this._chainData.state, 'items', []);
  }

  /**
   * Make query to the data source
   * @param {object} params - The query parameters
   * @return {QueryResult}
   */
  query(params) {
    return this._dataSource.query(params);
  }

  /**
   * The array data items.
   * @type {Object[]}
   */
  get itemArray() {
    return this.items.slice();
  }

  /**
   * The count of data rows.
   * @type {number}
   */
  get countRows() {
    return this.items.length;
  }

  /**
   * The primary key of data items.
   * @type {string}
   */
  get primaryKey() {
    return this._dataSource.primaryKey;
  }

  /**
   * The total count of data items. This represents the server side state.
   * @type {number}
   */
  getItemCount() {
    return _.result(this._chainData.state, 'totalCount', 0);
  }

  /**
   * Query the data item with its primary key.
   * @param {string} key - the primary key.
   * @return {Object}
   */
  itemWithKey(key) {
    return _.chain(this._chainData.state)
      .result('itemIndex')
      .result(key, null)
      .value();
  }

  /**
   * Get the primary key from a DOM element in a certain row.
   * @param {HTMLElement|jQuery|string} el
   *    The DOM element. It can be an `HTMLElement`, a jQuery object or a
   *    jQuery selector.
   * @return {string} - The primary key for the row.
   */
  keyOfElement(el) {
    const $tr = $(el).closest('tr', this.$el);

    if ($tr.length > 0) {
      return $tr.attr('data-key') || null;
    }

    return null;
  }

  /**
   * Get the data item with its index in the items array.
   * @param {number} index - The index of the item.
   * @return {Object}
   */
  itemAt(index) {
    return _.result(this._chainData.state, 'items', []).slice(index, index + 1)[0];
  }

  /**
   * Given an element in the data rows, get the index of the corresponding
   * data item.
   *
   * __NOTE__: It's not recommended to use this API to find the data item for
   * a given element. It could be incorrect if there're custom projections
   * changes the TR sequence of TBODY. Insteadly, you should use
   * {@link GridView#keyOfElement}.
   *
   * @param {HTMLElement|jQuery|string} el
   *    The DOM element. It can be an `HTMLElement`, a jQuery object or a
   *    jQuery selector.
   * @return {number} - The index of the data row.
   */
  indexOfElement(el) {
    return this._tableView.indexOfElement(el);
  }

  /**
   * Get the primary keys of the selected items.
   * @return {string[]} - An array of the selected keys.
   */
  selectedKeys() {
    return _.result(this.get('selection'), 'selected', []);
  }

  /**
   * Get the selected items.
   * @return {Object[]} - An array of the selected data items.
   */
  selectedItems() {
    const itemIndex = _.result(this._chainData.state, 'itemIndex', {});

    return _.chain(this.selectedKeys())
      .map(key => _.result(itemIndex, key))
      .compact()
      .value();
  }

  /**
   * Select a row with the given primary key.
   * @param {string} key - The primary key for the row.
   */
  selectRow(key) {
    setSelectRow(this, key, true);
  }

  /**
   * Deselect a row with the given primary key.
   * @param {string} key - The primary key for the row.
   */
  deselectRow(key) {
    setSelectRow(this, key, false);
  }

  /**
   * Select all the selectable items.
   */
  selectAll() {
    setSelectAll(this, true);
  }

  /**
   * Deselect all the selectable items.
   */
  deselectAll() {
    setSelectAll(this, false);
  }

  /**
   * Get the finalized column configuration with a given column name.
   * @param {string} name - The name of the column.
   * @return {ExtendedColumnConfig}
   */
  columnWithName(name) {
    const columnGroup = _.result(this._chainContent.state, 'columnGroup');
    return columnGroup ? columnGroup.columnWithName(name) : null;
  }

  /**
   * Get the row configurations for `THEAD`
   * @return {RowConfig[]}
   */
  getHeadRows() {
    return _.result(this.get('rows'), 'headRows', ['column-header-rows']);
  }

  /**
   * @callback SetRowsCallback
   * @param {RowConfig[]} rows - The current row configurations.
   * @return {RowConfig[]} - The new row configurations.
   */

  /**
   * Set the row configurations for `THEAD`
   * @param {RowConfig[]|SetRowsCallback} value
   *    The new header rows or a function to transform the header rows.
   */
  setHeadRows(value) {
    const headRows = _.isFunction(value) ? value(this.getHeadRows()) : value;
    this.patch({ rows: { headRows } });
  }

  /**
   * Prepend a set header rows
   * @param {RowConfig[]} rows - The rows to prepend
   */
  prependHeadRows(rows) {
    this.setHeadRows(headRows => rows.concat(headRows));
  }

  /**
   * Append a set header rows
   * @param {RowConfig[]} rows - The rows to append
   */
  appendHeadRows(rows) {
    this.setHeadRows(headRows => headRows.concat(rows));
  }

  /**
   * Get the row configurations for `TBODY`
   * @return {RowConfig[]}
   */
  getBodyRows() {
    return _.result(this.get('rows'), 'bodyRows', ['data-rows']);
  }

  /**
   * Set the row configurations for `TBODY`
   * @param {RowConfig[]|SetRowsCallback} value
   *    The new body rows or a function to transform the body rows.
   */
  setBodyRows(value) {
    const bodyRows = _.isFunction(value) ? value(this.getBodyRows()) : value;
    this.patch({ rows: { bodyRows } });
  }

  /**
   * Prepend a set body rows
   * @param {RowConfig[]} rows - The rows to prepend
   */
  prependBodyRows(rows) {
    this.setBodyRows(bodyRows => rows.concat(bodyRows));
  }

  /**
   * Append a set body rows
   * @param {RowConfig[]} rows - The rows to append
   */
  appendBodyRows(rows) {
    this.setBodyRows(bodyRows => bodyRows.concat(rows));
  }

  /**
   * Get the row configurations for `TFOOT`
   * @return {RowConfig[]}
   */
  getFootRows() {
    return _.result(this.get('rows'), 'footRows', []);
  }

  /**
   * Set the row configurations for `TFOOT`
   * @param {RowConfig[]|SetRowsCallback} value
   *    The new footer rows or a function to transform the footer rows.
   */
  setFootRows(value) {
    const footRows = _.isFunction(value) ? value(this.getFootRows()) : value;
    this.patch({ rows: { footRows } });
  }

  /**
   * Prepend a set footer rows
   * @param {RowConfig[]} rows - The rows to prepend
   */
  prependFootRows(rows) {
    this.setFootRows(footRows => rows.concat(footRows));
  }

  /**
   * Append a set footer rows
   * @param {RowConfig[]} rows - The rows to append
   */
  appendFootRows(rows) {
    this.setFootRows(footRows => footRows.concat(rows));
  }

}
