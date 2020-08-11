/* eslint-disable no-unused-expressions */
import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import pGrid from 'component/grid';
import people from 'data/people.json';
import util from 'util';
import { expect } from 'chai';
import driver from 'driver';

class CustomView extends Backbone.View {
  events() {
    return {
      'click button': () => {
        console.log('click');
        this.$el.find('.text').val('test view');
      },
    };
  }
  render() {
    this.$el.html(`<h2>This is a Backbone View Row.</h2><button>Click</button><input class="text" />`);
    return this;
  }
}

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

const gridConfig = {
  el: '#container',
  tableClasses: ['table'],
  layout: 'flex',
  selection: true,
  dataSource: {
    type: 'memory',
    data: people.value,
  },
  rows: {
    headRows: [
      { view: null },
      { html: '<h3>This is a html row</h3>' },
      'column-header-rows',
    ],
  },
  columns,
  scrolling: {
    virtualized: true,
    header: 'sticky',
  },
};

let pgrid, gridView, customView;

describe('Flex layout', () => {
  beforeEach(() => {
    customView = new CustomView().render();
    gridConfig.rows.headRows[0].view = customView;

    util.renderTestContainer();
    pgrid = pGrid
      .factory({ vnext: true })
      .create(gridConfig);
    gridView = pgrid.gridView;
    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'));
  });

  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('should grid body should have data-column attribute', function () {
    return driver
      .element('#container > .table-container .tbody .flex-row:eq(1) .flex-cell')
      .then(result => {
        expect(result.eq(0).attr('data-column')).to.be.equal('selection');
        expect(result.eq(1).attr('data-column')).to.be.equal('UserName');
        expect(result.eq(2).attr('data-column')).to.be.equal('Name');
        expect(result.eq(3).attr('data-column')).to.be.equal('Address');
        expect(result.eq(4).attr('data-column')).to.be.equal('CityName');
        expect(result.eq(5).attr('data-column')).to.be.equal('CityCountry');
      })
      .tapCatch(console.log);
  });

  it('should grid header have correct flex layout', function () {
    return driver
      .element('#container > .table-container .header .tr:eq(2) .th')
      .then(result => {
        // validate each column
        let header = _.map(result, item => {
          return $(item).text();
        });
        expect(header).to.eql([
          '',
          'UserName',
          'Name',
          'AddressInfo',
          'Address',
          'City',
          'CityName',
          'CityCountry',
        ]);

        /*
        validate nested row, the structure is:
          AddressInfo
            - Address
            - City
              - CityName
              - CityCountry
        */
        const $addressInfo = result.eq(3);
        const $address = $addressInfo.parent().find('[data-column="Address"]');
        const $city = $addressInfo.parent().find('[data-column="City"]');
        const $cityName = $city.parent().find('[data-column="CityName"]');
        const $cityCountry = $city.parent().find('[data-name="CityCountry"]');

        expect($addressInfo.text()).to.equal('AddressInfo');
        expect($address.text()).to.equal('Address');
        expect($city.text()).to.equal('City');
        expect($cityName.text()).to.equal('CityName');
        expect($cityCountry.text()).to.equal('CityCountry');
      })
      .tapCatch(console.log);
  });

  it('should devide columns into sticky group and non-sticky group', function () {
    return driver
      .element('#container > .table-container .header .tr:eq(2)')
      .then(result => {
        const $stickyGroup = result.find('.freezing-group-container .freezing-group');
        const $nonStickyGroup = result.find('.other-group-container .other-group');

        // Check sticky group. The checkbox column should be in sticky group
        expect($stickyGroup.find('[data-name="selection"]').size()).to.be.equal(1);
        expect($stickyGroup.find('[data-name="UserName"]').size()).to.be.equal(1);
        expect($stickyGroup.find('[data-name="Name"]').size()).to.be.equal(1);

        // Check non-sticky group
        expect($nonStickyGroup.find('[data-name="AddressInfo"]').size()).to.be.equal(1);
      })
      .tapCatch(console.log);
  });

  it('Should append backbone view into the header. The view should work', function () {
    return driver
      .click('#container > .table-container .header button')
      .then(() => driver.element('#container > .table-container .header .tr:eq(0)'))
      .then(result => {
        const $input = result.find('input');
        expect($input.val()).to.be.equal('test view');
      })
      .tapCatch(console.log);
  });

  it('Should append HTML string into the header', function () {
    return driver
      .element('#container > .table-container .header .tr:eq(1)')
      .then(result => {
        expect(result.text()).to.be.equal('This is a html row');
      })
      .tapCatch(console.log);
  });
});
