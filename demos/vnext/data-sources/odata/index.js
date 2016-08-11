import pgrid from '../../../../js';

import './index.less';
import 'bootstrap-webpack';

window.gridView = pgrid.factory({ vnext: true }).create({
  el: '.grid-container',
  scrolling: {
    virtualized: true,
  },
  dataSource: {
    type: 'odata',
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
    primaryKey: 'OrderID',
  },
}).gridView.render();
