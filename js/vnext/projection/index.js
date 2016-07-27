import _ from 'underscore';
export { odata } from './odata.js';

export class ProjectionChain extends Backbone.Model {
	initialize(options) {
		this.projections = [];
	}

	update() {
    return _.reduce(
      this.projections, 
			(memo, proj)  => proj(memo, this.attributes),
			Promise.resolve({})
    );
	}

	pipe(projection) {
		this.projections.push(projection);
		return this;
	}
};
