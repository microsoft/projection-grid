import _ from 'underscore';
import $ from 'jquery';
import pgrid from '../../../../js';
import people from '../people.json';
import rows from '../rows';

import './index.less';
import 'bootstrap-webpack';

const gridConfigBase = {
  tableClasses: ['table', 'table-bordered'],
  layout: 'flex',
  selection: true,
  dataSource: {
    type: 'memory',
    data: people.value,
  },
  rows,
  columns: [{
    name: 'UserName',
    width: 120,
    sortable: true,
    sticky: true,
  }, {
    name: 'Name',
    property: item => `${item.FirstName}, ${item.LastName}`,
    width: 150,
    sortable: true,
    sticky: true,
  }, {
    name: 'Emails',
    width: 220,
    sortable: item => item.Emails.length,
  }, {
    name: 'AddressInfo',
    property: 'AddressInfo/0/Address',
    sortable: true,
  }, {
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
  }, {
    name: 'Gender',
    sortable: true,
  }, {
    name: 'Concurrency',
    width: 200,
    sortable: true,
  }],
};

const stickyGridConfig = _.defaults({
  el: '.grid-container',
  scrolling: {
    virtualized: true,
    viewport: $('.grid-viewport'),
    header: 'sticky',
  },
}, gridConfigBase);

window.gridView = pgrid.factory({ vnext: true }).create(stickyGridConfig).gridView.render();
