import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import TableView from '../../js/vnext//layout/table-view.js';
import { ProjectionChain, odata } from '../../js/vnext/projection';

import 'bootstrap-webpack';

const tableView = window.tableView = new TableView({
	virtualized: true,
}).set({
	headRows:['column-header-rows'],
}).render();


const pchain = new ProjectionChain();

pchain.on('change', () => {
	pchain.update().then(state => {
		const columns = _.chain(state).first().keys().map(name => ({ name })).value();
		const bodyRows = _.map(state, item => ({
			classes: ['body-row'],
			item: _.mapObject(item, value => ({ html: value })),
		}));
		tableView.set({ columns, bodyRows});
	});
});

pchain.pipe(odata);
pchain.set({
	url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
});

$(() => tableView.$el.appendTo('body'));
