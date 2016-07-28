import _ from 'underscore';
import Backbone from 'backbone';
import { TableView } from './layout';
import { ProjectionChain } from './projection';

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
    this._projectionChain = new ProjectionChain();

    const patchEvents = state => _.extend(state, {
      events: _.mapObject(state.events, handler => handler.bind(this)),
    });

    this._projectionChain.on('change', () => {
      this.trigger('willUpdate', this._projectionChain.changedAttributes());
      this._projectionChain.update()
        .then(patchEvents)
        .then(state => this._tableView.set(state))
        .finally(() => this.trigger('didUpdate'));
    });
  }

  pipeProjections(...projections) {
    _.each(_.flatten(projections), proj => this._projectionChain.pipe(proj));
    return this;
  }

  set(state = {}) {
    this._projectionChain.set(state);
    return this;
  }

  get(attribute) {
    return this._projectionChain.get(attribute);
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

