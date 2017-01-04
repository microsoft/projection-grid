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

class TitleView extends Backbone.View {
  initialize({ title }) {
    this.title = title;
  }
  render() {
    this.$el.html(`<h2>${this.title}</h2>`);
    return this;
  }
}

let bodyClassObject = {
  nameBodyClass3: true,
  nameBodyClass4: true,
};

let gridConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: memoryData,
    primaryKey: 'UserName',
  },
  rows: {
    headRows: [
      {
        html: '<div class="head-rows-html">head rows html</div>',
      },
      'column-header-rows',
    ],
    bodyRows: [
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
    ],
    footRows: [
      {
        view: new TitleView({title: 'view in footer'}).render(),
      },
    ]
  },
};

let pgrid;
let gridView;

describe('rows config', function () {
  beforeEach(function () {
    util.renderTestContainer();
    pgrid = pGrid 
      .factory({ vnext: true })
      .create(gridConfig)
    gridView = pgrid.gridView.render();
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('rows should works as expected in header & footer', function (done) {
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return Promise.all([
          driver.element('#container > .table-container .header tr'),
          driver.element('#container > .table-container .header tr:nth-child(1) .head-rows-html'),
          driver.element('#container > .table-container .header tr:nth-child(2) th'),
          driver.element('#container > .table-container .footer tr td div h2'),
        ]);
      })
      .then((result) => {
        expect(result[0].length).to.be.equal(2);
        expect(result[1].text()).to.be.equal('head rows html');
        let assertion = util.validateElementMatrix(result[2], selectedKeys);
        expect(assertion).to.be.true;
        expect(result[3].text()).to.be.equal('view in footer');
      })
      .then(done)
      .catch(console.log);
  });

  it('rows should works as expected in body', function (done) {
    driver.once(gridView, 'didUpdate')
      .then(() => {
        return driver.element('.table-container table tbody tr[data-key]');
      })
      .then((result) => {
        util.validateClassesForElementArray([result.eq(0), result.eq(4), result.eq(9)], ['male']);
        util.validateClassesForElementArray([result.eq(10), result.eq(13), result.eq(15)], ['female']);
      })
      .then(done)
      .catch(console.log);
  });
});
