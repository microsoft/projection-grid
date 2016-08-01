import _ from 'underscore';

export function editable(state) {
  let {
    columns,
    columnGroup,
    bodyRows,
  } = state;
  _.map(columnGroup.leafColumns, col => {
    if (col.editable) {
      _.map(bodyRows)
    }
  })

}