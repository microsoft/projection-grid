import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import driver from 'driver';
import peopleData from 'data/people.json';

let expect = chai.expect;
let memoryDataSource = _.map(peopleData.value, (row) => {
  return _.pick(row, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
});
let memoryHeader = _.keys(_.first(memoryDataSource));
let memoryData = util.getExpectedGridData(memoryDataSource);
let gridConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: memoryData,
  },
  columns: [
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
  ],
};

let pgrid;
let pgridFactory;
let gridView;

describe('pageable config for non-vnext', function () {
  let bodyRowSelector = '#container .grid tbody .table__row--body';

  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid 
      .factory();
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('pageable should works as expected for non-vnext', function (done) {
    let pageableConfig = {
      pageable: {
        pageSize: 5,
        pageSizes: [5, 10, 15, 20],
      },
    };

    gridView = pgridFactory
      .create(_.extend(pageableConfig, gridConfig))
      .gridView
      .render({fetch: true});
    driver.element(bodyRowSelector)
      .then((result) => {
        expect(result.length).to.equal(5);
      })
      .then(done)
      .catch(console.log);
  });
});
