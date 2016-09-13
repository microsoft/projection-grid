import pgrid from '../../../../js';
import { ToolbarView } from 'backbone-toolbar';
import Editor from '../../../../js/vnext/editor-plugin.js';
import people from './people.json';

import './index.less';
import 'bootstrap-webpack';

window.toolbar = new ToolbarView({
  toolbarId: 'edit-toolbar',
  items: [{
    type: 'button',
    classes: ['btn', 'btn-primary', 'create-row'],
    text: 'CREATE',
    onClick(e) {
      editor.create({});
    }
  },{
    type: 'button',
    classes: ['btn', 'btn-primary', 'undo'],
    text: 'UNDO',
    onClick(e) {
      editor.undo();
    }
  },{
    type: 'button',
    classes: ['btn', 'btn-primary', 'redo'],
    text: 'REDO',
    onClick(e) {
      editor.redo();
    }
  },{
    type: 'button',
    classes: ['btn', 'btn-success', 'commit'],
    text: 'COMMIT',
    onClick(e) {
      editor.commit();
    }
  }],
}).render();

window.gridView = pgrid.factory({ vnext: true }).use(Editor).create({
  el: '.grid-container',
  tableClasses: ['table', 'table-bordered'],
  scrolling: {
    virtualized: true,
  },
  dataSource: {
    type: 'memory',
    data: people.value,
  },
  editableOption: true,
  selection: false,
  rows: {
    headRows: [
      {
        view: toolbar,
      },
      'column-header-rows',
      ],
  },
  columns: [{
    name: '__primary_key__',
   },{
    name: 'UserName',
    editable: true,
  },{
    name: 'FirstName',
    editable: true,
  },{
    name: 'LastName',
    editable: true,
  },{
    name: 'Emails',
    editable: true,
    width: 100,
  },{
    name: 'Gender',
    editable: true,
  },{
    name: 'Concurrency',
    editable: true,
  }],
}).gridView.render();
