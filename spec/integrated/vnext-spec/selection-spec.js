import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import rawData from 'data/people.json';
import driver from 'driver';

let expect = chai.expect;
let selectedKeys = ['UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency'];
let memoryData = _.map(rawData.value, (row) => {
  return _.pick(row, selectedKeys);
});

let gridConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: memoryData,
    primaryKey: 'UserName',
  },
  query: () => {},
};

let pgrid;
let pgridFactory;
let gridView;


describe('selection config', function () {
  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid
      .factory({ vnext: true });
  });

  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('selection should works as expected', function (done) {
    let baseSelectionConfig = {
      selection: {
        enabled: true,
      },
    };
    gridView = pgridFactory
      .create(_.extend(baseSelectionConfig, gridConfig))
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        return driver.click(util.getCheckboxElFromTbody(result, 0, 0));
      })
      .then(() => {
        let expectedSelectedKey = 'russellwhyte';
        expect(gridView.selectedKeys()[0]).to.be.equal(expectedSelectedKey);
        let selectedItems = gridView.selectedItems();
        expect(selectedItems.length).to.be.equal(1);
        expect(selectedItems[0].UserName).to.be.equal(expectedSelectedKey);
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let checkboxEl = util.getCheckboxElFromTbody(result, 0, 0);
        let assertion = checkboxEl.is(':checked');
        expect(assertion).to.be.true;
        return null;
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        return driver.click(util.getCheckboxElFromTbody(result, 0, 0));
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let checkboxEl = util.getCheckboxElFromTbody(result, 0, 0);
        let assertion = checkboxEl.is(':checked');
        expect(assertion).to.be.false;
        return null;
      })
      .then(done)
      .catch(console.log);
  });

  it('select all should works as expected', function (done) {
    let baseSelectionConfig = {
      selection: {
        enabled: true,
      },
    };
    gridView = pgridFactory
      .create(_.extend(baseSelectionConfig, gridConfig))
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('#container > .table-container .header tr');
      })
      .then((result) => {
        driver.click(util.getCheckboxElFromThead(result, 0, 0));
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
        let headerAssertion = checkboxHeaderEl.is(':checked');

        expect(headerAssertion).to.be.true;
        _.each(result[1], (el, index) => {
          let checkboxBodyEl = util.getCheckboxElFromTbody($(el), 0, 0);
          let bodyAssertion = checkboxBodyEl.is(':checked');

          expect(bodyAssertion).to.be.true;
        })
      })
      .then(() => {
        return driver.element('#container > .table-container .header tr');
      })
      .then((result) => {
        driver.click(util.getCheckboxElFromThead(result, 0, 0));
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
        let checkboxBodyEl = util.getCheckboxElFromTbody(result[1], 0, 0);
        let assertion = checkboxHeaderEl.is(':checked') || checkboxBodyEl.is(':checked');
        expect(assertion).to.be.false;
        return null;
      })
      .then(done)
      .catch(console.log);
  });

  it('single selection should works as expected', function (done) {
    let baseSelectionConfig = {
      selection: {
        enabled: true,
        single: true,
      },
    };
    gridView = pgridFactory
      .create(_.extend(baseSelectionConfig, gridConfig))
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        return driver.click(util.getCheckboxElFromTbody(result, 0, 0));
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let checkboxEl = util.getCheckboxElFromTbody(result, 0, 0);
        let assertion = checkboxEl.is(':checked');
        expect(assertion).to.be.true;
        return null;
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        return driver.click(util.getCheckboxElFromTbody(result, 1, 0));
      })
      .then(() => {
        return driver.once(gridView, 'didUpdate');
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        let checkboxEl = util.getCheckboxElFromTbody(result, 0, 0);
        let assertion = checkboxEl.is(':checked');
        expect(assertion).to.be.false;
        return null;
      })
      .then(done)
      .catch(console.log);
  });

  it('a11y for selection should works as expected', function (done) {
    let baseSelectionConfig = {
      a11y: {
        selectAllLabel: 'select all label',
      },
      selection: {
        enabled: true,
      },
    };
    gridView = pgridFactory
      .create(_.extend(baseSelectionConfig, gridConfig))
      .gridView
      .render();
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('#container > .table-container thead .select-all');
      })
      .then((result) => {
        const ariaLabel = result.attr('aria-label');
        expect(ariaLabel).to.be.equal('select all label');
      })
      .then(() => {
        return driver.element('#container > .table-container tbody tr[data-key]');
      })
      .then((result) => {
        _.each(result, (el, index) => {
          let ariaLableById = $(el).attr('id');

          let checkboxBodyEl = util.getCheckboxElFromTbody($(el), 0, 0);
          const ariaLabelBy = checkboxBodyEl.attr('aria-labelledby');

          expect(ariaLabelBy).to.be.equal(ariaLableById);
        })
      })
      .then(done)
      .catch(console.log);
  });
});
