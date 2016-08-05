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

const showTemplate = _.template('<i style="color: red;"><%= value %></i>')
window.customView = new CustomView().render();


window.gridViewEl = pgrid.factory({ vnext: true }).create({
  el: '.container-jsdata',
  viewport: '.container-jsdata',
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
      editable: true,
    },{
      name: 'OrderID',
      sortable: -1,
      editable: true,
      //template: showTemplate,
    }, {
      name: 'ShipAddress',
      //property: 'ShipAddress/length',
      //title: 'Ship Address Length',
      width: 150,
      sortable: true,
      //sortable: 'length(ShipAddress)',
    }, {
      name: 'Destination',
      property: ({ item }) => `${item.ShipCountry} / ${item.ShipCity}`,
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
    type: 'memory',
    data: people.value,
    //filter: ,
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
    sortable: true,
  }, {
    name: 'Name',
    property: ({ item }) => `${item.FirstName}, ${item.LastName}`,
    width: 150,
    sortable: true,
  }, {
    name: 'Emails',
    template: emailsTemplate,
    width: 220,
    sortable: ({ item }) => item.Emails.length,
  }, {
    name: 'AddressInfo',
    columns: [{
      name: 'Address',
      property: 'AddressInfo/0/Address',
      sortable: true,
    }, {
      name: 'City',
      columns: [{
        name: 'CityName',
        property: 'AddressInfo/0/City/Name',
        sortable: true,
      }, {
        name: 'CityCountry',
        property: 'AddressInfo/0/City/CountryRegion',
        sortable: true,
      }, {
        name: 'CityRegion',
        property: 'AddressInfo/0/City/Region',
        sortable: true,
      }],
    }],
  }, {
    name: 'Gender',
    sortable: true,
  }, {
    name: 'Concurrency',
    width: 200,
    sortable: true,
  }]
}).gridView.render();

window.gridViewEl_1 = pgrid.factory({ vnext: true }).create({
  el: '.container-element-viewport',
  viewport: '.container-element-viewport',
  stickyHeader: true,
  virtualized: true,
  dataSource: {
    type: 'jsdata',
    entity: store,
  }
}).gridView.render();

