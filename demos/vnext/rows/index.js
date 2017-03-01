import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import pgrid from '../../../js';

import './index.less';
import 'bootstrap-webpack';

class TitleView extends Backbone.View {
  initialize({ title }) {
    this.title = title;
  }

  render() {
    this.$el.html(`<h2>${this.title}<h2>`);
    return this;
  }
}

const titleHeader = new TitleView({ title: 'Customized View in Header' }).render();
const titleFooter = new TitleView({ title: 'Customized View in Footer' }).render();

window.gridView = pgrid.factory({ vnext: true }).create({
  el: '.grid-container',
  tableClasses: ['table', 'table-bordered'],
  scrolling: {
    virtualized: true,
    header: {
      type: 'sticky',
      offset() {
        return $('.navbar-container').height();
      },
    },
  },
  dataSource: {
    type: 'odata',
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
    primaryKey: 'OrderID',
  },
  selection: {
    headClasses: 'grid-select-all',
    bodyClasses: 'grid-select-row',
    selectable: item => item.OrderID % 2,
  },
  rows: {
    headRows: [
      {
        view: titleHeader,
        classes: ['noborder'],
      },
      {
        html: '',
        classes: ['separator'],
      },
      'column-header-rows',
    ],
    bodyRows: [{
      type: 'data-rows',
      classes: {
        'red-color': true,
        'longer': row => (row.ShipAddress.length > 15),
      },
      attributes: {
        'data-order-id': _.property('OrderID')
      },
    }, {
      item: {
        CustomerID: 'foobar',
        OrderID: 'custom-row',
      },
    }],
    footRows: [{
      classes: ['noborder'],
      view: titleFooter,
    }],
  },
  columns: [{
    name: 'Group 0',
    html: '<i>Group 0</i>',
    headClasses: 'Iamgrouphead',
    headAttributes: {
      'aria-label': ({ title, name }) => title || name,
      'tabindex': 0,
    },
    columns: [{
      name: 'CustomerID',
      sortable: true,
      headClasses: 'Iamhead',
      bodyClasses: 'Iambody',
      footClasses: 'Iamfoot',
      colClasses: 'Iamcol',
      colAttributes: {
        'data-name': 'CustomerID',
      },
      headAttributes: {
        'aria-label': ({ title, name }) => title || name,
        'tabindex': 0,
      },
    }, {
      name: 'OrderID',
      sortable: -1,
      headAttributes: {
        'aria-label': ({ title, name }) => title || name,
        'tabindex': 0,
      },
      bodyAttributes: {
        'data-ship-via': ({ item }) => item.ShipVia,
      },
    }, {
      name: 'ShipAddress',
      property: 'ShipAddress/length',
      title: 'Ship Address Length',
      width: 150,
      sortable: 'length(ShipAddress)',
      headAttributes: {
        'aria-label': ({ title, name }) => title || name,
        'tabindex': 0,
      },
    }, {
      name: 'Destination',
      property: item => `${item.ShipCountry} / ${item.ShipCity}`,
      headAttributes: {
        'aria-label': ({ title, name }) => title || name,
        'tabindex': 0,
      },
    }],
  }, {
    name: 'ShipCity',
    sortable: true,
    headAttributes: {
      'aria-label': ({ title, name }) => title || name,
      'tabindex': 0,
    },
  }],
  events: {
    'click th.column-header': (e) => console.log(e.target),
  },
}).gridView.render();
