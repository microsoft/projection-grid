import _ from 'underscore';
import Backbone from 'backbone';
import Promise from 'bluebird';
import {
  dataSource,
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
      .each(proj => this.projections.push(proj))
      .value();
    return this;
  }
}

/**
* The grid view class.
*
* In addition to ordinary Backbone View options, the constructor also takes
*
* __virtualized: whether or not the virtualization is enabled.
*
* __viewport__: the CSS selector to locate the scrollable viewport.
*
* * If it's omitted, the 'window' will be used as the viewport.
*
* __stickyHeader__: whether or not sticky header is enabled.
*
* @param {Object} options The constructor options.
* @param {boolean} [options.virtualized=false]
* @param {boolean | Object} [options.stickyHeader=false]
* @param {string} [options.viewport]
*
*/
export class GridView extends Backbone.View {
  initialize({
    viewport,
    virtualized = false,
    stickyHeader = false,
  }) {
    this._tableView = new TableView({
      el: this.$el,
      viewport,
      virtualized,
      stickyHeader,
    });
    this.model = new Backbone.Model;

    this._wrapProjection = proj => ({
      name: proj.name,
      handler: (_.isFunction(proj) ? proj : proj.handler).bind(this),
    });

    this._chainData = new ProjectionChain(this.model);
    this._chainStructure = new ProjectionChain(this.model);
    this._chainContent = new ProjectionChain(this.model);

    this.pipeDataProjections(dataSource);
    this.pipeStructureProjections(columns, rows, selection);
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

    this.model.on('change', () => {
      this.trigger('willUpdate', this.model.changedAttributes());
      _.reduce([
        this._chainData,
        this._chainStructure,
        this._chainContent,
      ], (memo, chain) => chain.update(memo), null)
        .then(patchEvents)
        .then(state => this._tableView.set(state))
        .finally(() => this.trigger('didUpdate'));
    });
  }

  pipeDataProjections(...projs) {
    this._chainData.pipe(_.map(_.flatten(projs), this._wrapProjection));
    return this;
  }

  pipeStructureProjections(...projs) {
    this._chainStructure.pipe(_.map(_.flatten(projs), this._wrapProjection));
    return this;
  }

  pipeContentProjections(...projs) {
    this._chainContent.pipe(_.map(_.flatten(projs), this._wrapProjection));
    return this;
  }

  set(state = {}) {
    this.model.set(state);
    return this;
  }

  get(attribute) {
    return this.model.get(attribute);
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
  get countRows() {
    return _.result(this._chainData.state, 'items', []).length;
  }

  itemAt(index) {
    return _.result(this._chainData.state, 'items', []).slice(index, index + 1)[0];
  }

  selectedIndexes () {
    return _.result(this.get('selection'), 'selected', []);
  }

  selectedItems() {
    return _.chain(this.get('selection'))
      .result('selected', [])
      .map(i => this.itemAt(i))
      .value();
  }

  selectRow(index) {
    setSelectRow(this, index, true);
  }

  deselectRow(index) {
    setSelectRow(this, index, false);
  }

  selectAll(index) {
    setSelectAll(this, true);
  }

  deselectAll(index) {
    setSelectAll(this, false);
  }

  indexOfElement(el) {
    return this._tableView.indexOfElement(el);
  }

  columnWithName(name) {
    const columnGroup = _.result(this._chainContent.state, 'columnGroup');
    return columnGroup ? columnGroup.columnWithName(name) : null;
  }
};

