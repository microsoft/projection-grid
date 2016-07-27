import Promise from 'bluebird';
import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';

function map (state, {map,} = {}) {
	var promiseData = state.then(function (data) {
		var mapData = _.isFunction(map) ? _.map(data, map) : data;
		mapData = _.flatten(mapData);
		return mapData;
	});
}

export default map;
