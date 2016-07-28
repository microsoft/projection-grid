import _ from 'underscore';
import Backbone from 'backbone';
import Promise from 'bluebird';

import { TableView } from './layout';

class ProjectionChain {
  constructor(model) {
    this.model = model;
    this.projections = [];
    this.state = null;
  }

  update(input) {
    return _.reduce(this.projections, (p$state, proj) => {
      return p$state.then(state => proj(state, this.model.attributes));
    }, Promise.resolve(input)).tap(state => {
      this.state = state;
    });
  }

  pipe(...projs) {
    _.chain(projs)
      .flatten()
      .each(proj => this.projections.push(proj))
      .value();
    return this;
  }
}

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

    this._chainData = new ProjectionChain(this.model);
    this._chainStructure = new ProjectionChain(this.model);
    this._chainContent = new ProjectionChain(this.model);

    const patchEvents = state => _.extend(state, {
      events: _.mapObject(state.events, handler => handler.bind(this)),
    });

    this.model.on('change', () => {
      this.trigger('willUpdate', this.model.changedAttributes());
      _.reduce([
        this._chainData,
        this._chainStructure,
        this._chainContent,
      ], (memo, chain) => chain.update(memo), {})
        .then(patchEvents)
        .then(state => this._tableView.set(state))
        .finally(() => this.trigger('didUpdate'));
    });
  }

  pipeDataProjections(...projs) {
    this._chainData.pipe(
      _.map(_.flatten(projs), proj => proj.bind(this))
    );
    return this;
  }

  pipeStructureProjections(...projs) {
    this._chainStructure.pipe(
      _.map(_.flatten(projs), proj => proj.bind(this))
    );
    return this;
  }

  pipeContentProjections(...projs) {
    this._chainContent.pipe(
      _.map(_.flatten(projs), proj => proj.bind(this))
    );
    return this;
  }

  get countRows() {
    return _.result(this._chainData.state, 'length', 0);
  }

  set(state = {}) {
    this.model.set(state);
    return this;
  }

  get(attribute) {
    return this.model.get(attribute);
  }

  indexOfElement(el) {
    return this._tableView.indexOfElement(el);
  }

  render(callback) {
    this._tableView.render(callback);
    return this;
  }

  remove() {
    this._tableView.remove();
    super.remove();
  }
};

