import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import driver from 'driver';
import peopleData from 'data/people.json';
import jsDataSource from 'data/js-data-source';
import jsDataExpected from 'data/js-data-expected.json';

let expect = chai.expect;
let gridConfig = {
  el: '#container',
};
let columnsForMemory = [
  {
    name: 'UserName',
  },
  {
    name: 'FirstName',
  },
  {
    name: 'LastName',
  },
  {
    name: 'Gender',
  },
];
let columnsForOdataService = [
  {
    name: 'CustomerID',
  },
  {
    name: 'CompanyName',
  },
  {
    name: 'ContactName',
  },
  {
    name: 'ContactTitle',
  },
  {
    name: 'Address',
  },
  {
    name: 'City',
  },
  {
    name: 'Region',
  },
  {
    name: 'PostalCode',
  },
  {
    name: 'Country',
  },
  {
    name: 'Phone',
  },
  {
    name: 'Fax',
  },
];

let memoryDataSource = _.map(peopleData.value, (row) => {
  return _.pick(row, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
});
let memoryHeader = _.keys(_.first(memoryDataSource));
let memoryData = util.getExpectedGridData(memoryDataSource);

let odataAndJsdataHeader = _.keys(_.first(jsDataExpected.value));
// only pick data for line 0, 9, 19
let odataAdnJsdataData = util.getExpectedGridData(jsDataExpected.value);

let pgrid;
let pgridFactory;
let gridView;

describe('data source config for non-vnext', function () {
  this.timeout(100000);
  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid 
      .factory();
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('memory should works as expected for non-vnext', function (done) {
    let memoryConfig = {
      dataSource: {
        type: 'memory',
        data: memoryData,
      },
      columns: columnsForMemory,
    };

    gridView = pgridFactory
      .create(_.extend(memoryConfig, gridConfig))
      .gridView
      .render({fetch: true});
    driver.element('#container .grid thead .table__row--header th')
      .then((result) => {
        let header = _.map(result, (item) => {
          return item.textContent;
        })
        expect(header).to.eql(['UserName', 'FirstName', 'LastName', 'Gender']);
        return driver.element('#container .grid tbody .table__row--body');
      })
      .then((result) => {
        let expectData = _.map(memoryData, (item) => {
          return _.pick(item, 'UserName', 'FirstName', 'LastName', 'Gender');
        });
        let assertion = util.validateElementMatrix(result, expectData);
        expect(assertion).to.be.true;
      })
      .then(done)
      .catch(console.log);
  });

  it('js-data should works as expected for non-vnext', function (done) {
    let jsDataConfig = {
      dataSource: {
        type: 'js-data',
        resource: jsDataSource,
        schema: {key: 'CustomerID'},
      },
      columns: columnsForOdataService,
    };

    console.log(jsDataSource);

    gridView = pgridFactory
      .create(_.extend(jsDataConfig, gridConfig))
      .gridView
      .render({ fetch: true });
    driver.once(gridView, 'update:finished')
      .then(() => {
        return driver.element('#container .grid thead .table__row--header th');
      })
      .then((result) => {
        let header = _.map(result, (item) => {
          return item.textContent;
        });
        expect(header).to.eql(odataAndJsdataHeader);
      })
      .then(() => {
        return driver.element('#container .grid tbody .table__row--body');
      })
      .then((result) => {
        let actualData = [result[0], result[9], result[19]];
        let assertion = util.validateElementMatrix(actualData, odataAdnJsdataData);
        expect(assertion).to.be.true;
      })
      .then(() => {
        console.log('test');
      })
      .then(done)
      .catch(console.log);
  });

  it('odata should works as expected for non-vnext', function (done) {
    let odataConfig = {
      dataSource: {
        type: 'odata',
        url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Customers',
      },
      columns: columnsForOdataService,
    };

    gridView = pgridFactory
      .create(_.extend(odataConfig, gridConfig))
      .gridView
      .render({ fetch: true });
    driver.once(gridView, 'update:finished')
      .then(() => {
        return driver.element('#container .grid thead .table__row--header th');
      })
      .then((result) => {
        let header = _.map(result, (item) => {
          return item.textContent;
        });
        expect(header).to.eql(odataAndJsdataHeader);
      })
      .then(() => {
        return driver.element('#container .grid tbody .table__row--body');
      })
      .then((result) => {
        let actualData = [result[0], result[9], result[19]];
        let assertion = util.validateElementMatrix(actualData, odataAdnJsdataData);
        expect(assertion).to.be.true;
      })
      .then(done)
      .catch(console.log);
  });
});
