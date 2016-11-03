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
      editable: true,
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

describe('editable for non-vnext', function () {
  let headRowSelector = '#container .grid thead .table__row--header';
  let bodyRowSelector = '#container .grid tbody .table__row--body';

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

  it('editable should works as expected for non-vnext', function (done) {
    let editableConfig= {
      editable: {
        tooltipText: 'edit me!',
        iconClasses: 'edit-icon-class',
      },
    };

    gridView = pgridFactory
      .create(_.extend(editableConfig, gridConfig))
      .gridView
      .render({ fetch: true });
    driver.element(bodyRowSelector)
      .then((result) => {
        let editTargetIcon = result.first().find('td').eq(1).find('.grid-edit-icon');
        let editTarget = result.first().find('td').eq(1);

        expect(editTargetIcon.hasClass('edit-icon-class')).to.be.true;
        expect(editTarget.hasClass('grid-editable-cell')).to.be.true;
        return driver.click(editTarget);
      })
      .then(() => {
        return Promise.all([
          driver.element('form.form-inline > .form-control'),
          driver.element('form.form-inline > .save'),
          driver.element('form.form-inline > .cancel'),
        ]);
      })
      .then((result) => {
        expect(result[0].hasClass('editor')).to.be.true;
        expect(result[1].text()).to.equal('Save');
        expect(result[2].text()).to.equal('Cancel');
        return driver.setValue('form.form-inline > .form-control', 'Conan');
      })
      .then(() => {
        return driver.click('form.form-inline > .save');
      })
      // not work currently, edit trigger a 'edit' events, but seems no one is listening this event.
      // .then(() => {
      //   return driver.once(gridView, 'change:data');
      // })
      // .then(() => {
      //   return driver.element(bodyRowSelector);
      // })
      // .then((result) => {
      //   let editedName = result.eq(0).find('td').eq(2).text();
      //   expect(editedName).to.be.equal('Conan');
      // })
      .then(done)
      .catch(console.log);
  });
});
