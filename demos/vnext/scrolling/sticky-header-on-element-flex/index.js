import _ from 'underscore';
import $ from 'jquery';
import pgrid from '../../../../js';
import people from '../people.json';
import rows from '../rows';

import './index.less';
import 'bootstrap-webpack';

const columns = [{
  name: 'UserName',
  width: 70,
  sortable: true,
  group: 'freezing',
}, {
  name: 'Name',
  property: item => `${item.FirstName}, ${item.LastName}`,
  width: 70,
  sortable: true,
  group: 'freezing',
}, {
  name: 'Emails',
  width: 200,
  sortable: item => item.Emails.length,
  group: 'freezing',
}, {
  name: 'AddressInfo',
  width: 100,
  columns: [{
    width: 100,
    name: 'Address',
    property: 'AddressInfo/0/Address',
    sortable: true,
  }, {
    name: 'City',
    columns: [{
      width: 200,
      name: 'CityName',
      property: 'AddressInfo/0/City/Name',
      sortable: true,
    }, {
      width: 250,
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

window.gridView = pgrid.factory({ vnext: true }).create(stickyGridConfig).gridView;

_.each([
  'willRedrawHeader',
  'didRedrawHeader',
  'willRedrawFooter',
  'didRedrawFooter',
  'willRedrawBody',
  'didRedrawBody',
], event => {
  window.gridView.on(event, () => {
    window.console.log(`trigger the event ${event}`);
  });
});

window.gridView.render();
