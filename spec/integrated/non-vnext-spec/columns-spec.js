import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import driver from 'driver';
import peopleData from 'data/people.json';
import colHeaderTemplate from 'template/column-header.jade';

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
      sortable: true,
    },
    {
      name: 'FirstName',
      attributes: {
        class: 'first-name-body',
      },
      headerAttributes: {
        class: 'first-name-head'
      },
    },
    {
      name: 'LastName',
      headerTemplate: colHeaderTemplate,
    },
    {
      name: 'Gender',
    },
  ],
};

let pgrid;
let pgridFactory;
let gridView;

describe('columns config for non-vnext', function () {
  let headRowSelector = '#container .grid thead .table__row--header';
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

  it('shifter should works as expected for non-vnext', function (done) {
    let shifterConfig = {
      columnShifter: {
        totalColumns: 4,
      },
    };

    gridView = pgridFactory
      .create(_.extend(shifterConfig, gridConfig))
      .gridView
      .render({fetch: true});
    driver.element(headRowSelector)
      .then((result) => {
        let firstHeadCell = result.first().find('th').first();
        expect(firstHeadCell.hasClass('col-skip-less')).to.be.true;
        let lastHeadCell = result.first().find('th').last();
        expect(lastHeadCell.hasClass('col-skip-more')).to.be.true;
        return driver.element(bodyRowSelector);
      })
      .then((result) => {
        _.each(result, (rowItem) => {
          let firstTdCell = $(rowItem).find('td').first();
          expect(firstTdCell.hasClass('col-skip-less')).to.be.true;
          let lastTdCell = $(rowItem).find('td').last();
          expect(lastTdCell.hasClass('col-skip-more')).to.be.true;
        })
      })
      .then(done)
      .catch(console.log);
  });

  it('sortable should works as expected for non-vnext', function (done) {
    let expectData = _.map(memoryData, (item) => {
      return _.pick(item, 'UserName', 'FirstName', 'LastName', 'Gender');
    });

    gridView = pgridFactory
      .create(_.extend(gridConfig))
      .gridView
      .render({fetch: true});
    driver.element(bodyRowSelector)
      .then((result) => {
        let assertion = util.validateElementMatrix(result, expectData);
        expect(assertion).to.be.true;
        return driver.element(headRowSelector);
      })
      .then((result) => {
        return driver.click(result.first().find('th').first());
      })
      .then(() => {
        return driver.pause(10);
      })
      .then(() => {
        return driver.element(bodyRowSelector);
      })
      .then((result) => {
        let sortedData = _.sortBy(expectData, 'UserName');
        let assertion = util.validateElementMatrix(result, sortedData);
        expect(assertion).to.be.true;
      })
      .then(done)
      .catch(console.log);
  });

  it('attributes for columns should works as expected for non-vnext', function (done) {
    let expectData = _.map(memoryData, (item) => {
      return _.pick(item, 'UserName', 'FirstName', 'LastName', 'Gender');
    });

    gridView = pgridFactory
      .create(_.extend(gridConfig))
      .gridView
      .render({fetch: true});
    driver.element(headRowSelector)
      .then((result) => {
        let assertion = result.eq(0).find('th').eq(1).hasClass('first-name-head');
        expect(assertion).to.be.true;
        return driver.element(bodyRowSelector);
      })
      .then((result) => {
        let assertion = result.eq(0).find('td').eq(1).hasClass('first-name-body');
        expect(assertion).to.be.true;
      })
      .then(done)
      .catch(console.log);
  });

  it('template for columns should works as expected for non-vnext', function (done) {
    let expectData = _.map(memoryData, (item) => {
      return _.pick(item, 'UserName', 'FirstName', 'LastName', 'Gender');
    });

    gridView = pgridFactory
      .create(_.extend(gridConfig))
      .gridView
      .render({fetch: true});
    driver.element(headRowSelector)
      .then((result) => {
        let templatedHeader = result.eq(0).find('th').eq(2).find('div');
        let classAssertion = templatedHeader.hasClass('column-header');

        expect(templatedHeader.length).to.equal(1);
        expect(classAssertion).to.be.true;
        expect(templatedHeader.text()).to.equal('LastName');
      })
      .then(done)
      .catch(console.log);
  });
});
