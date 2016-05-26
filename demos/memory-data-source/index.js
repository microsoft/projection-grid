import Backbone from 'backbone';
import pgrid from 'projection-grid';
import pagerViewPlugin from './pager-view-plugin';
import people from 'json!./people.json';

import 'bootstrap-webpack';

const data = window.data = new Backbone.Collection(people.value);

const {
  pagerView,
  gridView,
} = pgrid.factory().use(pagerViewPlugin).create({
  el: '.grid-root',
  dataSource: {
    data,
    schema: { key: 'UserName' },
  },
  selectable: true,
  pageable: {
    pageSize: 10,
    pageSizes: [5, 10, 15, 20],
  },
  columns: [
    {
      name: 'UserName',
      title: 'User Name',
      sortable: true,
    },
    {
      name: 'Gender',
      sortable: true,
    },
    {
      name: 'City',
      field: 'AddressInfo/0/City/Name',
    },
  ],
  pagerView: {
    el: '.pager-root',
  },
});

gridView.on('update:beginning', function () {
  console.log('begin update');
});

gridView.on('update:finished', function () {
  console.log('end update');
});

gridView.render({ fetch: true });
pagerView.render();
