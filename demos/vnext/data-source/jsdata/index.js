import pgrid from '../../../../js';
import store from './js-data-resource.js';

import './index.less';
import 'bootstrap-webpack';

window.gridView = pgrid.factory({ vnext: true }).create({
  el: '.grid-container',
  tableClasses: ['table', 'table-bordered'],
  scrolling: {
    virtualized: true,
  },
  dataSource: {
    type: 'jsdata',
    entity: store,
  },
}).gridView.render();
