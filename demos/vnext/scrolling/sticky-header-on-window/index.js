import $ from 'jquery';
import pgrid from '../../../../js';
import people from '../people.json';
import columns from '../columns.js';
import rows from '../rows';

import './index.less';
import 'bootstrap-webpack';

window.gridView = pgrid.factory({ vnext: true }).create({
  el: '.grid-container',
  tableClasses: ['table', 'table-bordered'],
  scrolling: {
    virtualized: true,
    viewport: window,
    header: {
      type: 'sticky',
      offset() {
        return $('.navbar-container').height();
      },
    },
  },
  dataSource: {
    type: 'memory',
    data: people.value,
  },
  rows,
  columns,
}).gridView.render();
