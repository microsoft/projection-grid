import Backbone from 'backbone';
import pgrid from '../../../js';
import pagerViewPlugin from './pager-view-plugin.js';

import './index.less';
import 'bootstrap-webpack';

class CustomView extends Backbone.View {
  events() {
    return {
      'click h2': () => console.log('click'),
    };
  }
  render() {
    this.$el.html('<h2>Custom View</h2>');
    return this;
  }
}

window.customView = new CustomView().render();

window.gridView = pgrid.factory({ vnext: true }).use(pagerViewPlugin).create({
  el: '.container-window-viewport',
  viewport: '.container-window-viewport',
  stickyHeader: true,
  virtualized: true,
  dataSource: {
    type: 'odata',
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
    primaryKey: 'OrderID',
  },
  selection: true,
  columns: [{
    name: 'Group 0',
    html: '<i>Group 0</i>',
    columns: [{
      name: 'CustomerID',
      sortable: true,
      editable: true,
    },{
      name: 'OrderID',
      sortable: -1,
    }, {
      name: 'ShipAddress',
      property: 'ShipAddress/length',
      title: 'Ship Address Length',
      width: 150, 
      sortable: 'length(ShipAddress)',
    }, {
      name: 'Destination',
      property: item => `${item.ShipCountry} / ${item.ShipCity}`,
    }],
  },{
    name: 'ShipCity',
    sortable: true,
  }],
  events: {
    'click th.column-header': (e) => console.log(e.target),
  }, 
  pagerView: {
    el: '.container-window-pagination', 
    availablePageSizes: [5,10,20],
    pageSize: 20,
  },
}).gridView.render();
