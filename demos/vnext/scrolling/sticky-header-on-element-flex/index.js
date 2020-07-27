import _ from 'underscore';
import $ from 'jquery';
import pgrid from '../../../../js';
import people from '../people.json';
import rows from '../rows';

import './index.less';
import 'bootstrap-webpack';

const columns = [{
  name: 'UserName',
  width: 120,
  sortable: true,
  group: 'freezing',
}, {
  name: 'Name',
  property: item => `${item.FirstName}, ${item.LastName}`,
  width: 150,
  sortable: true,
  group: 'freezing',
}, {
  name: 'Emails',
  width: 220,
  sortable: item => item.Emails.length,
  group: 'freezing',
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
    }],
  }],
}];

const gridConfigBase = {
  tableClasses: ['table'],
  layout: 'flex',
  selection: true,
  dataSource: {
    type: 'memory',
    data: people.value,
  },
  rows,
  columns,
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
