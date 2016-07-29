import _ from 'underscore';
import $ from 'jquery';
import { GridView } from '../../js/vnext/grid-view.js';
import {
  odata,
  selection,
  columns,
  rows,
  columnGroup,
  cells,
} from '../../js/vnext/projection';
import './index.less';
import * as tmpl from './bodyTemplate.jade';
import 'bootstrap-webpack';

window.gridViewEl = new GridView({
  el: '.container-element-viewport',
  viewport: '.container-element-viewport',
  stickyHeader: true,
  virtualized: true,
}).pipeDataProjections([
  odata,
]).pipeStructureProjections([
  columns,
  rows,
  selection,
]).pipeContentProjections([
  columnGroup,
  cells,
]).set({
  url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
  selection: true,
  columns: [{
    name: 'CustomerID',
    //template:tmpl.default,
  },{
    name: 'ShipCity',
  }],
}).render();

/*
window.gridViewWin = new GridView({
  el: '.container-window-viewport',
  stickyHeader: {
    offset() {
      return $('.navbar-container').height();
    },
  },
  virtualized: true,
}).pipeDataProjections([
  odata,
]).pipeStructureProjections([
  columns,
  rows,
  selection,
]).pipeContentProjections([
  columnGroup,
  cells,
]).set({
  url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
  selection: { single: true },
}).render();
*/
