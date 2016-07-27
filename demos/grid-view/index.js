import _ from 'underscore';
import $ from 'jquery';
import { GridView } from '../../js/vnext/grid-view.js';
import { odata } from '../../js/vnext/projection';
import './index.less';
import 'bootstrap-webpack';

const columns = state => {
  const headRows = ['column-header-rows'];
  const columns = _.chain(state).first().keys().map(name => ({ name, width: 120 })).value();
  const bodyRows = _.map(state, item => ({
    classes: ['body-row'],
    item: _.mapObject(item, value => ({ html: value })),
  }));

  return { columns, headRows, bodyRows };
};

window.gridViewEl = new GridView({
  el: '.container-element-viewport',
  viewport: '.container-element-viewport',
  stickyHeader: true,
  virtualized: true,
}).pipeProjections(odata, columns).set({
	url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
}).render();

gridViewEl.pipeProjections([
  odata,
  columns,
]);

window.gridViewWin = new GridView({
  el: '.container-window-viewport',
  stickyHeader: {
    offset() {
      return $('.navbar-container').height();
    },
  },
  virtualized: true,
}).pipeProjections(odata, columns).set({
	url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
}).render();
