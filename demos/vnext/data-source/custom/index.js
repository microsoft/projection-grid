import _ from 'underscore';

import pgrid from '../../../../js';
import store from './js-data-resource.js';

import './index.less';
import 'bootstrap-webpack';

// This is a decorator of the OData data source
// It filter out the items with CustomerID starts with 'A'.
class CustomDataSource extends pgrid.dataSource.JSData {
  constructor(resource, options) {
    super(resource, options);
    this._jsdataDS = new pgrid.dataSource.JSData(resource);
  }

  query(options) {
    return this._jsdataDS.query(options).then(({
      totalCount,
      items,
    }) => {
      const filteredItems = _.filter(items, item => item.CustomerID[0] !== 'A');

      return {
        totalCount,
        items: filteredItems,
      };
    });
  }
}

window.gridView = pgrid.factory({ vnext: true }).create({
  el: '.grid-container',
  tableClasses: ['table', 'table-bordered'],
  scrolling: {
    virtualized: true,
  },
  dataSource: new CustomDataSource(store),
}).gridView.render();
