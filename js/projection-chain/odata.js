import Promise from 'bluebird';
import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';

function odata (p$state, {
	verb = 'get',
	url,
	skip,
	take,
	filter,
	orderby = [],
	select = [],
} = {}) {

	var url = _.isFunction(url) ? url() : url;
	var op = {
		url: url,
		$format: 'json',
		$count: true,
	};

	if (take) {
		op.$top = take;
	}

	if (skip) {
		op.$skip = skip;
	}

	if (_.size(orderby)) {
		var col = _.first(orderby);
		var key = _.keys(col)[0];
		var dir = col[key];

		op.$orderby = key + ' ' + (dir > 0 ? 'asc' : 'desc');
	}

	
	return new Promise(function (resolve, reject) {
		$.getJSON(op.url, _.omit(op, 'url'))
		  .success(resolve)
		  .fail(function (jqXHR, textStatus, errorThrown) {
		    reject(new Error(errorThrown));
		  });
	}).then(function (data) {
		return data.value;
	});

}

export default odata;
