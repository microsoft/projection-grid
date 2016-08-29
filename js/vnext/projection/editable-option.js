import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import optionFooter from './option-footer.jade';
import editableOptionTemplate from './editable-option.jade';

import './editable-option.less';

const PopupCreate = Backbone.View.extend({
  events: {

  },
  initialize: function (options) {

  },
  render: function () {

  },
  remove: function () {

  },

});

function deleteRow(editor) {
  return function (e) {
    /*
    const $tr = $(e.target).closest('tr');
    this.trigger('willDelet', null);
    const primaryKey = $tr.find("td.primaryKey").text();
    */
    const index = this.indexOfElement(e.target);
    const primaryKey = _.result(this.itemAt(index), this.primaryKey);
    editor.destroy(primaryKey);
  };
}

function createRow(editor) {
  return function (e) {
    editor.create({});
  };
}

export const editableOption = {
  name: 'editableOption',
  handler(state, editableOption) {
    if (!editableOption) {
      return _.clone(state);
    }

    const columns = state.columns.concat([{
      name: 'options',
      width: '100px',
      template: editableOptionTemplate,
    }]);

    const editor = this.editor;
    const events = _.defaults({
      'click button.delete': deleteRow(editor),
      /*'click button.undo': editor.undo.bind(editor),
      'click button.redo': editor.redo.bind(editor),
      'click button.commit': editor.commit.bind(editor),
      'click button.create': createRow(editor),*/
    }, state.events);

    return _.defaults({ columns, events }, state);
  },
  defaults: {},
}