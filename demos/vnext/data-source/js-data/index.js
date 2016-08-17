import pgrid from '../../../../js';
import store from './js-data-resource.js';

import './index.less';
import 'bootstrap-webpack';

window.gridView = pgrid.factory({ vnext: true }).create({
  el: '.grid-container',
  scrolling: {
    virtualized: true,
  },
  dataSource: {
    type: 'js-data',
    entity: store,
  },
}).gridView.render();
