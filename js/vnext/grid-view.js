import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import Promise from 'bluebird';
import {
  dataSource,
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

/**
 * The projection chain class.
 */

class ProjectionChain {
  constructor(model) {
    this.model = model;
    this.projections = [];
    this.state = null;
    this.input = null;
  }

  /**
  * When updating, execute each function in projections successively
  */
  update(input) {
    const updated = input !== this.input;

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

  /**
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
 *  the constructor options.
 * @param {string[]} [options.tableClasses=[]]
 *  the classes for the TABLE elements (content table and sticky/fixed header)
 * @param {ScrollingConfig} [options.scrolling={virtualized: false, header: 'static'}]
 *  the scrolling related configurations
 */
export class GridView extends Backbone.View {
  initialize({ scrolling, tableClasses }) {
    this._tableView = new TableView({
      el: this.$el,
      scrolling,
      classes: tableClasses,
    });
    this.model = new Backbone.Model();

    const projections = this._projections = {};

    this._registerProjection = proj => {
      const name = proj.name;

      if (_.has(projections, ['name'])) {
        throw new Error('Duplication projectons');
      }

      projections[name] = {
        name,
        handler: (_.isFunction(proj) ? proj : proj.handler).bind(this),
        defaults: proj.defaults,
        normalize: (proj.normalize || _.identity).bind(this),
      };

      return projections[name];
    };

    this._chainData = new ProjectionChain(this.model);
    this._chainStructure = new ProjectionChain(this.model);
    this._chainContent = new ProjectionChain(this.model);

    this.pipeDataProjections(dataSource, buffer);
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
    const updateState = {
      changes: null,
      promise: null,
    };

    const update = () => {
      const changes = updateState.changes;

      updateState.changes = null;

      this.trigger('willUpdate', changes);

      _.reduce([
        this._chainData,
        this._chainStructure,
        this._chainContent,
      ], (memo, chain) => chain.update(memo), null)
        .then(patchEvents)
        .then(state => new Promise((resolve, reject) => {
          this._tableView.set(state, resolve);
        }))
        .then(nextTick)
        .finally(() => this.trigger('didUpdate', changes));
    };

    const scheduleUpdate = () => {
      if (updateState.changes) {
        _.extend(updateState.changes, this.model.changedAttributes());
      } else {
        updateState.changes = this.model.changedAttributes();

        if (updateState.promise) {
          updateState.promise = updateState.promise.then(update);
        } else {
          updateState.promise = update();
        }
      }
    };

    this.model.on('change', scheduleUpdate);

    _.each(['willRedraw', 'didRedraw'], event => {
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

  pipeDataProjections(...projs) {
    this._chainData.pipe(_.map(_.flatten(projs), this._registerProjection));
    return this;
  }

  pipeStructureProjections(...projs) {
    this._chainStructure.pipe(_.map(_.flatten(projs), this._registerProjection));
    return this;
  }

  pipeContentProjections(...projs) {
    this._chainContent.pipe(_.map(_.flatten(projs), this._registerProjection));
    return this;
  }

  set(state = {}, callback = _.noop) {
    this.model.set(_.mapObject(state, (value, key) => {
      const projection = this._projections[key];

      return projection ? projection.normalize(value) : value;
    }));
    this.once('didUpdate', callback);
    return this;
  }

  get(attribute) {
    return this.model.get(attribute);
  }

  patch(state = {}, callback = _.noop) {
    this.set(_.reduce(_.keys(state), (memo, key) => {
      const value = state[key];
      const valueCur = this.model.get(key);
      
      memo[key] = defaultsDeep(value, valueCur);
      return memo;
    }, {}), callback);
  }

  render(callback) {
    this._tableView.render(callback);
    return this;
  }

  remove() {
    this._tableView.remove();
    super.remove();
  }

  /* Helper functions */

  get items() {
    return _.result(this._chainData.state, 'items', []);
  }

  get itemArray() {
    return this.items.slice();
  }

  get countRows() {
    return this.items.length;
  }

  get primaryKey() {
    return _.result(this._chainData.state, 'primaryKey');
  }

  getItemCount() {
    return _.result(this._chainData.state, 'itemCount', 0);
  }

  itemWithKey(key) {
    return _.chain(this._chainData.state)
      .result('itemIndex')
      .result(key, null)
      .value();
  }

  keyOfElement(el) {
    const $tr = $(el).closest('tr', this.$el);

    if ($tr.length > 0) {
      return $tr.attr('data-key') || null;
    }

    return null;
  }

  itemAt(index) {
    return _.result(this._chainData.state, 'items', []).slice(index, index + 1)[0];
  }

  indexOfElement(el) {
    return this._tableView.indexOfElement(el);
  }

  selectedKeys() {
    return _.result(this.get('selection'), 'selected', []);
  }

  selectedItems() {
    const itemIndex = _.result(this._chainData.state, 'itemIndex', {});

    return _.chain(this.selectedKeys())
      .map(key => _.result(itemIndex, key))
      .compact()
      .value();
  }

  selectRow(key) {
    setSelectRow(this, key, true);
  }

  deselectRow(key) {
    setSelectRow(this, key, false);
  }

  selectAll() {
    setSelectAll(this, true);
  }

  deselectAll() {
    setSelectAll(this, false);
  }

  columnWithName(name) {
    const columnGroup = _.result(this._chainContent.state, 'columnGroup');
    return columnGroup ? columnGroup.columnWithName(name) : null;
  }

  getHeadRows() {
    return _.result(this.get('rows'), 'headRows', ['column-header-rows']);
  }

  setHeadRows(value) {
    const headRows = _.isFunction(value) ? value(this.getHeadRows()) : value;
    this.patch({ rows: { headRows } });
  }

  prependHeadRows(rows) {
    this.setHeadRows(headRows => rows.concat(headRows));
  }

  appendHeadRows(rows) {
    this.setHeadRows(headRows => headRows.concat(rows));
  }

  getBodyRows() {
    return _.result(this.get('rows'), 'bodyRows', ['data-rows']);
  }

  setBodyRows(value) {
    const bodyRows = _.isFunction(value) ? value(this.getBodyRows()) : value;
    this.patch({ rows: { bodyRows } });
  }

  prependBodyRows(rows) {
    this.setBodyRows(bodyRows => rows.concat(bodyRows));
  }

  appendBodyRows(rows) {
    this.setBodyRows(bodyRows => bodyRows.concat(rows));
  }

  getFootRows() {
    return _.result(this.get('rows'), 'footRows', []);
  }

  setFootRows(value) {
    const footRows = _.isFunction(value) ? value(this.getFootRows()) : value;
    this.patch({ rows: { footRows } });
  }

  prependFootRows(rows) {
    this.setFootRows(footRows => rows.concat(footRows));
  }

  appendFootRows(rows) {
    this.setFootRows(footRows => footRows.concat(rows));
  }

}
