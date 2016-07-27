import _ from 'underscore';
import odata from './odata.js'

class ProjectionChain extends Backbone.Model {
			initialize(options) {
				this.projections = [];
				this.on('change', () => this.update());
			}

			update() {
				return _.reduce(this.projections, 
					(memo, proj)  => proj(memo, this.attributes),
					Promise.resolve({})
					);
			}

			pipe(projection) {
				this.projections.push(projection);
				return this;
			}

		};
module.exports = {
	ProjectionChain: ProjectionChain,
	odata: odata,
};