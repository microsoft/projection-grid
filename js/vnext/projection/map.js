import Promise from 'bluebird';
import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';

export function map (p$state, { map = _.identity } = {}) {
	return p$state.then(state => {
		const stateMapped = _.chain(state).map(map).flatten().value();
		return stateMapped;
	});
}

