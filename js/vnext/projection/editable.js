import _ from 'underscore';
import $ from 'jquery';
import editTemplate from '../layout/editable.jade';
import prompt from '../../popup-editor/index.js';

function edit(e) {
  if($(e.target).closest('td').hasClass('grid-editable-cell')) {
    const editor = window.prompt;
    console.log('dbclick');
    editor({
    });
  }
}

function cancel() {

}

function save() {

}

function updateServer() {

}

export function editable(state) {
  _.each(state.columnGroup.leafColumns, (col, index) => {
    if (col.editable) {
      const iconClasses = col['editable.icon.class'] || ['glyphicon', 'glyphicon-pencil'];
      _.each(state.bodyRows, row => {
          const cell = row.cells[index];
          if (!_.isArray(cell.classes)) {
            cell.classes = ['grid-editable-cell'];
          } else {
            cell.classes.push('grid-editable-cell');
          }
          if (cell.html) {
            cell.html = editTemplate({ $html: cell.html, classes: iconClasses });
          } else {
            cell.html = editTemplate({ text: cell.value, classes: iconClasses });
          }
          row.cells[index] = cell;
        });
    }
  });

  const events = _.defaults({
    'dbclick td.grid-editable-cell': edit,
  }, state.events);

  return _.defaults({ events }, state);
}