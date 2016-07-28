import _ from 'underscore';
import selectionHeadTemplate from './selection-head.jade';
import selectionBodyTemplate from './selection-body.jade';

function normalize(selection) {
  return _.isObject(selection) ? selection : {
    single: false,
    selected: {},
    selectAll: false,
  };
}

export function selection (state, { selection } = {}) {
  if (!selection) {
    return state;
  }

  const model = normalize(selection);

  state.columns.unshift({
    name: 'selection',
    width: '30px',
    html: selectionHeadTemplate(model),
  });

  state.bodyRows = state.bodyRows.map(row => {
    row.item.selection = {
      html: selectionBodyTemplate({
        single: model.single,
        isSelected: model.selectAll,
      }),
    };
    return row;
  });

  state.events = _.extend({}, state.events, {
    'change th input.select-all': function (e) {
      let selection = this.get('selection');
      if (!_.isObject(selection)) {
        selection = normalize(selection);
      }
      if (selection.selectAll !== e.target.checked) {
        selection = _.defaults({
          selectAll: e.target.checked,
        }, selection);
      }
      this.set({ selection });
    },
  });

  return state;
}
