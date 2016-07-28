import _ from 'underscore';
import Promise from 'bluebird';

export { odata } from './odata.js';
export { jsdata } from './jsdata.js';
export { selection } from './selection.js';
export { columns } from './columns.js';
export { rows } from './rows.js';
export { columnGroup } from './column-group.js';
export { cells } from './cells.js';

export class ProjectionChain extends Backbone.Model {
  initialize(options) {
    this.projections = [];
  }

  update() {
    return _.reduce(
      this.projections, 
      (p$state, proj) => p$state.then(state => {
        const newState = proj(state, this.attributes);
        return newState;}),
      Promise.resolve({})
    );
  }

  pipe(projection) {
    this.projections.push(projection);
    return this;
  }
};
