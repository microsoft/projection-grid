import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import driver from 'driver';
import peopleData from 'data/people.json';
import jsDataSource from 'data/js-data-source';
import jsDataExpected from 'data/js-data-expected.json';
import Promise from 'bluebird';

/* eslint-disable no-unused-expressions */

const expect = chai.expect;

let gridConfig = {
  el: '#container',
};

let memoryDataSource = _.map(peopleData.value, row => {
  return _.pick(row, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
});
let memoryHeader = _.keys(_.first(memoryDataSource));
let memoryData = util.getExpectedGridData(memoryDataSource);

let odataAndJsdataHeader = _.keys(_.first(jsDataExpected.value));
// only pick data for line 0, 9, 19
let odataAdnJsdataData = util.getExpectedGridData(jsDataExpected.value);

let pgridFactory = null;
let gridView = null;

class CustomDataSource extends pGrid.dataSource.JSData {
  constructor(resource, options) {
    super(resource, options);
    this._jsdataDS = new pGrid.dataSource.JSData(resource);
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

describe('data source config', function () {
  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid.factory({ vnext: true });
  });

  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  describe('memory data source', function () {
    it('should render as expected', function () {
      let memoryConfig = {
        dataSource: {
          type: 'memory',
          data: memoryData,
          primaryKey: 'UserName',
        },
      };
      gridView = pgridFactory.create(_.extend(memoryConfig, gridConfig)).gridView;

      return new Promise(resolve => gridView.render(resolve))
        .then(() => driver.once(gridView, 'didUpdate'))
        .then(() => driver.element('#container > .table-container .header th'))
        .then(result => {
          let header = _.map(result, item => {
            return item.textContent;
          });
          expect(header).to.eql(memoryHeader);
        })
        .then(() => {
          return driver.element('#container > .table-container tbody tr[data-key]');
        })
        .then(result => {
          let assertion = util.validateElementMatrix(result, memoryData);
          expect(assertion).to.be.true;
        })
        .tapCatch(console.log);
    });

    it('should cache the sorting and filtering result', function () {
      let memoryConfig = {
        dataSource: {
          type: 'memory',
          data: memoryData,
          primaryKey: 'UserName',
        },
      };

      gridView = pgridFactory
        .create(_.extend(memoryConfig, gridConfig))
        .gridView;

      let cachedItems = null;
      return new Promise(resolve => gridView.render(resolve))
        .then(() => driver.once(gridView, 'didUpdate'))
        .then(() => {
          cachedItems = gridView.dataSource.cachedItems;
        })
        .then(() => driver.click('#container > .table-container .header th[data-name="FirstName"]'))
        .then(() => driver.once(gridView, 'didUpdate'))
        .then(() => {
          expect(gridView.dataSource.cachedItems).to.not.equal(cachedItems);

          cachedItems = gridView.dataSource.cachedItems;
          return new Promise(resolve => gridView.patch({
            query: { skip: 1 },
          }, resolve));
        })
        .then(() => {
          expect(cachedItems).to.equal(gridView.dataSource.cachedItems);
        })
        .tapCatch(console.log);
    });

    it('should bust the cache on data set change', function () {
      let memoryConfig = {
        dataSource: {
          type: 'memory',
          data: [],
          primaryKey: 'UserName',
        },
      };

      gridView = pgridFactory
        .create(_.extend(memoryConfig, gridConfig))
        .gridView.render();

      let cachedItems = null;

      return new Promise(resolve => gridView.render(resolve))
        .then(() => driver.once(gridView, 'didUpdate'))
        .then(() => {
          cachedItems = gridView.dataSource.cachedItems;
          return new Promise(resolve => gridView.patch({
            dataSource: {
              data: memoryData,
            },
          }, resolve));
        })
        .then(() => {
          expect(gridView.dataSource.cachedItems).to.not.equal(cachedItems);
        })
        .tapCatch(console.log);
    });
  });

  it('js-data should works as expected', function () {
    let jsDataConfig = {
      dataSource: {
        type: 'js-data',
        entity: jsDataSource,
      },
    };
    gridView = pgridFactory
      .create(_.extend(jsDataConfig, gridConfig))
      .gridView;

    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'))
      .then(() => {
        return driver.element('#container > .table-container .header th');
      })
      .then(result => {
        let header = _.map(result, item => {
          return item.textContent;
        });
        expect(header).to.eql(odataAndJsdataHeader);
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then(result => {
        let actualData = [result[0], result[9], result[19]];
        let assertion = util.validateElementMatrix(actualData, odataAdnJsdataData);
        expect(assertion).to.be.true;
      })
      .tapCatch(console.log);
  });

  it('odata should works as expected', function () {
    let odataConfig = {
      dataSource: {
        type: 'odata',
        url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Customers',
        primaryKey: 'CustomerID',
      },
    };
    gridView = pgridFactory
      .create(_.extend(odataConfig, gridConfig))
      .gridView;

    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'))
      .then(() => driver.element('#container > .table-container .header th'))
      .then(result => {
        let header = _.map(result, item => item.textContent);
        expect(header).to.eql(odataAndJsdataHeader);
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then(result => {
        let actualData = [result[0], result[9], result[19]];
        let assertion = util.validateElementMatrix(actualData, odataAdnJsdataData);
        expect(assertion).to.be.true;
      })
      .tapCatch(console.log);
  });

  it('customed data source should works as expected', function () {
    let jsDataConfig = {
      dataSource: new CustomDataSource(jsDataSource),
    };
    gridView = pgridFactory
      .create(_.extend(jsDataConfig, gridConfig))
      .gridView;
    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'))
      .then(() => driver.element('#container > .table-container .header th'))
      .then(result => {
        let header = _.map(result, item => item.textContent);
        expect(header).to.eql(odataAndJsdataHeader);
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then(result => {
        // customed data has a filter which customerId not start with "A"
        expect(result.eq(0).find('td').eq(0).find('span').text()).to.be.equal('BERGS');
      })
      .tapCatch(console.log);
  });

  it('orderby should works as expected', function () {
    let jsDataConfig = {
      dataSource: {
        type: 'js-data',
        entity: jsDataSource,
        orderby: {
          key: 'CustomerID',
          direction: -1,
        },
      },
    };

    gridView = pgridFactory
      .create(_.extend(jsDataConfig, gridConfig))
      .gridView;
    return new Promise(resolve => gridView.render(resolve))
      .then(() => driver.once(gridView, 'didUpdate'))
      .then(() => driver.element('#container > .table-container tbody tr[data-key]'))
      .then(result => {
        let targetCustomerID = $(result).eq(0).find('td').eq(0).text();
        expect(targetCustomerID).to.be.equal('WOLZA');
      })
      .tapCatch(console.log);
  });

  // it('backward compatibility for memory data source should works as expected', function (done) {
  //   let memoryConfig = {
  //     dataSource: new pGrid.dataSource.Memory(memoryData, 'UserName'),
  //   };

  //   gridView = pgridFactory
  //     .create(_.extend(memoryConfig, gridConfig))
  //     .gridView
  //     .render();
  //   driver.once(gridView, 'didUpdate')
  //     .then(() => {
  //       return driver.element('#container > .table-container .header th');
  //     })
  //     .then((result) => {
  //       let header = _.map(result, (item) => {
  //         return item.textContent;
  //       });
  //       expect(header).to.eql(memoryHeader);
  //     })
  //     .then(() => {
  //       return driver.element('#container > .table-container tbody tr[data-key]');
  //     })
  //     .then((result) => {
  //       let assertion = util.validateElementMatrix(result, memoryData);
  //       expect(assertion).to.be.true;
  //     })
  //     .then(done)
  //     .catch(console.log);
  // });
});
