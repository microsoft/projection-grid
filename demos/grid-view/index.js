import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';

import pgrid from '../../js';
import bodyTemplate from './body-template.jade';
import store from './js-data-resource.js';
import emailsTemplate from './emails.jade';
import people from 'json!./people.json';

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

window.gridViewEl = pgrid.factory({ vnext: true }).create({
  el: '.container-element-viewport',
  viewport: '.container-element-viewport',
  stickyHeader: true,
  virtualized: true,
  dataSource: {
    type: 'odata',
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
  },
  selection: true,
  columns: [{
    name: 'Group 0',
    html: '<i>Group 0</i>',
    columns: [{
      name: 'CustomerID',
      template: bodyTemplate,
      sortable: true,
    },{
      name: 'OrderID',
      sortable: true,
    }, {
      name: 'ShipAddressLength',
      field: 'ShipAddress/length',
      title: 'Ship Address Length',
      width: 150,
      sortable: true,
    }, {
      name: 'Destination',
      value: item => `${item.ShipCountry} / ${item.ShipCity}`,
      sortable: true,
    }],
  },{
    name: 'ShipCity',
    sortable: true,
  }],
  events: {
    'click th.column-header': (e) => console.log(e.target),
  },
}).gridView.render();

window.gridViewWin = pgrid.factory({ vnext: true }).create({
  el: '.container-window-viewport',
  stickyHeader: {
    offset() {
      return $('.navbar-container').height();
    },
  },
  virtualized: true,
  dataSource: {
    //type: 'jsdata',
    //entity: store,
    type: 'memory',
    data: people.value,
  },
  selection: { single: true },
  rows: {
    headRows: [{
      view: window.customView,
    },
    'column-header-rows',
    ],
  },
  columns: [{
    name: 'UserName',
    width: 120,
  }, {
    name: 'Name',
    value: item => `${item.FirstName}, ${item.LastName}`,
    width: 150,
  }, {
    name: 'Emails',
    template: emailsTemplate,
    width: 220,
  }, {
    name: 'AddressInfo',
    columns: [{
      name: 'Address',
      field: 'AddressInfo/0/Address',
    }, {
      name: 'City',
      columns: [{
        name: 'CityName',
        field: 'AddressInfo/0/City/Name',
      }, {
        name: 'CityCountry',
        field: 'AddressInfo/0/City/CountryRegion',
      }, {
        name: 'CityRegion',
        field: 'AddressInfo/0/City/Region',
      }],
    }],
  }, {
    name: 'Gender',
  }, {
    name: 'Concurrency',
    width: 200,
  }]
}).gridView.render();

