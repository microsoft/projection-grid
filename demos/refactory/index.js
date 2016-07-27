import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import 'bootstrap-webpack';
import TableView from '../../js/vnext//layout/table-view.js'
import projection from '../../js/vnext/projection/index.js'

function renderTable (p$state, {} = {}) {
	return p$state.then(function (data) {
		var columns = [];
		for (var key in data[0]) {
			columns.push({name: key});
		}

		var bodyrows = [];
		for (var i = 0; i < data.length; i++) {
			var obj = {classes: ['body-row']};
			obj.item = {};
			for (var key in data[i]) {
				obj.item[key] = {html: data[i][key]};
			}
			bodyrows.push(obj);
		}

		const tableView = window.tableView = new TableView({
			virtualized: true,
		}).set({
			columns:columns, 
			headRows:['column-header-rows'], 
			bodyRows:bodyrows, 
		}).render();
		$(() => tableView.$el.appendTo('body'));
	});
}
/*
function mapProj (item) {
	var names = (item.name || item.ContactName || item.ShipName).split(' ');

  return _.extend({}, item, {
    first: names[0],
    last: names[1],
    email: names[0] + '.' + names[1] + '@outlook.com',
  });
}
*/
var pchain = new projection.ProjectionChain();
pchain.pipe(projection.odata).pipe(renderTable);
pchain.set({
	url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
	});

