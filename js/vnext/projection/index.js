import _ from 'underscore';
import Promise from 'bluebird';
export { odata } from './odata.js';

export class ProjectionChain extends Backbone.Model {
  initialize(options) {
    this.projections = [];
  }

  update() {
    return _.reduce(
      this.projections, 
      (p$state, proj) => p$state.then(state => proj(state, this.attributes)),
      Promise.resolve({})
    );
  }

  pipe(projection) {
    this.projections.push(projection);
    return this;
  }
};
