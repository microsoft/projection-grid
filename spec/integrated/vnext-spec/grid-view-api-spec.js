import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import rawData from 'data/people.json';
import oldData from 'data/scrolling.json';
import driver from 'driver';
import Promise from 'bluebird';

let expect = chai.expect;
let memoryData = _.map(rawData.value, (row) => {
  return _.pick(row, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
});
let oldMemoryData = _.map(oldData.value, (row) => {
  return _.pick(row, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
});

let oldGridConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: oldMemoryData,
    primaryKey: 'UserName',
  },
};

let expectedHeader = _.keys(_.first(memoryData));
let expectedData = util.getExpectedGridData(memoryData);
let pgridFactory;
let gridView;

describe('grid view API verification', function () {
  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid 
      .factory({ vnext: true });
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('data should be updated after set a new configuration to grid', function (done) {
    let pgridInstance = pgridFactory
      .create(oldGridConfig);
    let newGridConfig = {
      el: '#container',
      dataSource: {
        type: 'memory',
        data: memoryData,
        primaryKey: 'UserName',
      },
    };
    pgridInstance.gridView.set(newGridConfig);
    gridView = pgridInstance.gridView.render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        util.validateElementMatrix(result, memoryData);
        return null;
      })
      .then(done)
      .catch(console.log);
  });

  it('verify status function for gridView', function (done) {
    let gridConfig = {
      el: '#container',
      dataSource: {
        type: 'memory',
        data: memoryData,
        primaryKey: 'UserName',
      },
    };
    gridView = pgridFactory
      .create(gridConfig)
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        expect(gridView.itemArray.length).to.be.equal(16);
        expect(gridView.countRows).to.be.equal(16);
        expect(gridView.totalCountRows).to.be.equal(16);
        expect(gridView.getItemCount()).to.be.equal(16);
        expect(gridView.itemAt(1).UserName).to.be.equal('scottketchum');
        expect(gridView.indexOfElement('tr[data-key="javieralfred"]')).to.be.equal(3);
        return null;
      })
      .then(done)
      .catch(console.log);
  });

  it('verify selection function for gridView', function (done) {
    let gridConfig = {
      el: '#container',
      dataSource: {
        type: 'memory',
        data: memoryData,
        primaryKey: 'UserName',
      },
      selection: {
        enabled: true,
      }
    };
    gridView = pgridFactory
      .create(gridConfig)
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        gridView.selectRow('scottketchum');
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let checkboxEl = util.getCheckboxElFromTbody(result, 1, 0);
        let assertion = checkboxEl.is(':checked');
        expect(assertion).to.be.true;
        return null;
      })
      .then(() => {
        let expectedSelectedKey = 'scottketchum';
        expect(gridView.selectedKeys()[0]).to.be.equal(expectedSelectedKey);
        let selectedItems = gridView.selectedItems();
        expect(selectedItems.length).to.be.equal(1);
        expect(selectedItems[0].UserName).to.be.equal(expectedSelectedKey);
        return null;
      })
      .then(() => {
        gridView.deselectRow('scottketchum');
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let checkboxEl = util.getCheckboxElFromTbody(result, 1, 0);
        let assertion = checkboxEl.is(':checked');
        expect(assertion).to.be.false;
        return null;
      })
      .then(() => {
        gridView.selectAll();
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return Promise.all([
          driver.element('#container > .table-container .header tr'),
          driver.element('#container > .table-container tbody tr[data-key]'),
        ]);
      })
      .then((result) => {
        let checkboxHeaderEl = util.getCheckboxElFromThead(result[0], 0, 0);
        let checkboxbodyEl = util.getCheckboxElFromTbody(result[1], 0, 0);
        let assertion = checkboxHeaderEl.is(':checked') && checkboxbodyEl.is(':checked');
        expect(assertion).to.be.true;
        return null;
      })
      .then(() => {
        gridView.deselectAll();
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return Promise.all([
          driver.element('#container > .table-container .header tr'),
          driver.element('#container > .table-container tbody tr[data-key]'),
        ]);
      })
      .then((result) => {
        let checkboxHeaderEl = util.getCheckboxElFromThead(result[0], 0, 0);
        let checkboxbodyEl = util.getCheckboxElFromTbody(result[1], 0, 0);
        let assertion = checkboxHeaderEl.is(':checked') || checkboxbodyEl.is(':checked');
        expect(assertion).to.be.false;
        return null;
      })
      .then(done)
      .catch(console.log);
  });

  it('verify head rows function for gridView', function (done) {
    let gridConfig = {
      el: '#container',
      dataSource: {
        type: 'memory',
        data: memoryData,
        primaryKey: 'UserName',
      },
    };
    gridView = pgridFactory
      .create(gridConfig)
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        expect(gridView.getHeadRows()[0]).to.be.equal('column-header-rows');
        return null;
      })
      .then(() => {
        gridView.setHeadRows([
          {
            html: '<div class="head-rows-html">head rows html</div>'
          },
        ]);
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return driver.element('.table-container .header > tr > th > .head-rows-html');
      })
      .then((result) => {
        expect(result.text()).to.be.equal('head rows html');
        return null;
      })
      .then(() => {
        gridView.setHeadRows([
          'column-header-rows',
        ]);
        gridView.prependHeadRows([
          {
            html: '<div class="prepend-head-rows-1">prepend head rows 1</div>'
          },
          {
            html: '<div class="prepend-head-rows-2">prepend head rows 2</div>'
          },
        ]);
        gridView.appendHeadRows([
          {
            html: '<div class="append-head-rows-1">append head rows 1</div>'
          },
          {
            html: '<div class="append-head-rows-2">append head rows 2</div>'
          },
        ]);
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return Promise.all([
          driver.element('.header tr:nth-child(1) .prepend-head-rows-1'),
          driver.element('.header tr:nth-child(2) .prepend-head-rows-2'),
          driver.element('.header tr:nth-child(3) th'),
          driver.element('.header tr:nth-child(4) .append-head-rows-1'),
          driver.element('.header tr:nth-child(5) .append-head-rows-2'),
        ]);
      })
      .then((result) => {
        expect(result[0].text()).to.be.equal('prepend head rows 1');
        expect(result[1].text()).to.be.equal('prepend head rows 2');
        let assertion = util.validateElementMatrix(result[2], expectedHeader);
        expect(assertion).to.be.true;
        expect(result[3].text()).to.be.equal('append head rows 1');
        expect(result[4].text()).to.be.equal('append head rows 2');
        return null;
      })
      .then(done)
      .catch(console.log);
  });

  it('verify body rows function for gridView', function (done) {
    let gridConfig = {
      el: '#container',
      dataSource: {
        type: 'memory',
        data: memoryData,
        primaryKey: 'UserName',
      },
    };
    gridView = pgridFactory
      .create(gridConfig)
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        expect(gridView.getBodyRows()[0]).to.be.equal('data-rows');
        return null;
      })
      .then(() => {
        gridView.setBodyRows([
          {
            type: 'data-rows',
            classes: {
              male: (row) => {
                return row.Gender === 'Male';
              },
              female: (row) => {
                return row.Gender === 'Female';
              },
            },
          },
        ]);
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return driver.element('.table-container table tbody tr[data-key]');
      })
      .then((result) => {
        util.validateClassesForElementArray([result.eq(0), result.eq(4), result.eq(9)], ['male']);
        util.validateClassesForElementArray([result.eq(10), result.eq(13), result.eq(15)], ['female']);
        return null;
      })
      .then(() => {
        gridView.prependBodyRows([
          {
            item: {
              UserName: 'prepend item'
            },
            classes: ['prepend-body-row'],
          },
        ]);
        gridView.appendBodyRows([
          {
            item: {
              UserName: 'append item'
            },
            classes: ['append-body-row'],
          },
        ]);
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return Promise.all([
          driver.element('.prepend-body-row td:nth-child(1) span'),
          driver.element('.append-body-row td:nth-child(1) span'),
        ]);
      })
      .then((result) => {
        expect(result[0].text()).to.be.equal('prepend item');
        expect(result[1].text()).to.be.equal('append item');
        return null;
      })
      .then(() => {
        gridView.setFootRows([
          {
            html: '<div>foot row html</div>',
            classes: ['foot-row'],
          },
        ]);
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return driver.element('.footer > .foot-row > td > div');
      })
      .then((result) => {
        expect(result.length).to.be.equal(1);
        expect(result.text()).to.be.equal('foot row html');
        expect(gridView.getFootRows()[0].html).to.be.equal('<div>foot row html</div>')
        return null;
      })
      .then(() => {
        gridView.prependFootRows([
          {
            item: {
              UserName: 'prepend foot'
            },
            classes: ['prepend-foot-row'],
          },
        ]);
        gridView.appendFootRows([
          {
            item: {
              UserName: 'append foot'
            },
            classes: ['append-foot-row'],
          },
        ]);
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return Promise.all([
          driver.element('.footer > .prepend-foot-row > td > span'),
          driver.element('.footer > .append-foot-row > td > span'),
        ]);
      })
      .then((result) => {
        expect(result[0].text()).to.be.equal('prepend foot');
        expect(result[1].text()).to.be.equal('append foot');
        return null;
      })
      .then(done)
      .catch(console.log);
  });

  describe('Access the data item', function () {
    beforeEach(function (done) {
      let gridConfig = {
        el: '#container',
        dataSource: {
          type: 'memory',
          data: memoryData,
          primaryKey: 'UserName',
        },
      };
      gridView = pgridFactory
        .create(gridConfig)
        .gridView
        .render(done);
    });

    describe('keyOfElement()', function () {
      it('should get the key of the row', function (done) {
        Promise.all([
          driver.element('#container > .table-container tbody > tr[data-key]:first'),
          driver.element('#container > .table-container tbody > tr[data-key]:first td:first'),
        ]).spread(($tr, $td) => {
          const key = $tr.attr('data-key');

          expect(gridView.keyOfElement($tr)).to.equal(key);
          expect(gridView.keyOfElement($td)).to.equal(key);

          return null;
        }).asCallback(done);
      });
    });

    describe('itemWithKey()', function () {
      it('should get the item with the give key', function (done) {
        driver
          .element('#container > .table-container tbody > tr[data-key]:first')
          .then($tr => {
            const key = $tr.attr('data-key');

            expect(gridView.itemWithKey(key)).to.equal(memoryData[0]);
            return null;
          })
          .asCallback(done);
      });
    });

    describe('itemOfElement()', function () {
      it('should get the item from the DOM element', function (done) {
        driver
          .element('#container > .table-container tbody > tr[data-key]:first td:first')
          .then($td => {
            expect(gridView.itemOfElement($td)).to.equal(memoryData[0]);
            return null;
          })
          .asCallback(done);
      });
    });
  });
});
