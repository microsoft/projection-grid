import pgrid from '../../../../js';
import people from './people.json';

import './index.less';
import 'bootstrap-webpack';

window.gridView = pgrid.factory({ vnext: true }).create({
  el: '.grid-container',
  tableClasses: ['table', 'table-bordered'],
  scrolling: {
    virtualized: true,
  },
  dataSource: {
    type: 'memory',
    data: people.value,
    //primaryKey: 'UserName',
  },
}).gridView.render();
