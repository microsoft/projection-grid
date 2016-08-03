import _ from 'underscore';
import $ from 'jquery';
import editTemplate from '../layout/editable.jade';
import prompt from '../../popup-editor/index.js';

function edit(e) {
  const $td = $(e.target).closest('td');

  if($td.hasClass('grid-editable-cell')) {
    const editor = prompt;
    editor({
      model: { value: $td.text(), },
      position: { left: $td.offset().left, top: $td.offset().top },
      property: 'value',
      onSubmit: save,
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
  const leafColumns = state.columnGroup.leafColumns;
  const iconClasses = ['glyphicon', 'glyphicon-pencil'];
  const bodyRows = {
    length: state.bodyRows.length,
    slice: (...args) => state.bodyRows.slice(...args).map(row => {
      const cells = _.map(row.cells, (cell, index) => {
        const col = leafColumns[index];
        if (col.editable) {
          const classes = _.union(cell.classes, ['grid-editable-cell']);
          const html = editTemplate({ $html: cell.html, classes: iconClasses });
          return _.defaults({ classes, html }, cell);
        }
        return cell;
      });
      return _.defaults({ cells }, row);
    }),
  };

  const events = _.defaults({
    'click td.grid-editable-cell': edit,
  }, state.events);

  return _.defaults({ events, bodyRows }, state);
}