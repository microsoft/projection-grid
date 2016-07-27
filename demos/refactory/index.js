import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import 'bootstrap-webpack';
import TableView from '../../js/table-view.js'
import ProjectionChain from '../../js/projection-chain/pg-chain.js'
import odata from '../../js/projection-chain/odata.js'

function renderTable (state, {} = {}) {
	var promiseData = state.then(function (data) {
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
	return promiseData;
}

var pchain = new ProjectionChain();
pchain.pipe(odata).pipe(renderTable);
pchain.set({url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',});
