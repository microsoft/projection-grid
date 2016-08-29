import _ from 'underscore';
import $ from 'jquery';
import editableOptionTemplate from './editable-option.jade';

function deleteRow() {
  return function (e) {
    const $tr = $(e.target).closest('tr');
    this.trigger('willDelet', null);
    const primaryKey = $tr.find("td.primaryKey").text();
    console.log(primaryKey);
  }
}

export const editableOption = {
  name: 'editableOption',
  handler(state) {
    const columns = state.columns.concat([{
      name: 'options',
      width: '100px',
      template: editableOptionTemplate,
    }]);

    const events = _.defaults({
      'click button.delete': deleteRow(),
    }, state.events);

    return _.defaults({ columns, events }, state);
  },
  defaults: {},
}