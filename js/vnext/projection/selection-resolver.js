import _ from 'underscore';

export class SelectionResolver {
  constructor(gridView) {
    this.gridView = gridView;
  }

  updateItems() {
    return this.patch({});
  }

  selectRow() {
    throw new Error('Not Supported');
  }

  deselectRow() {
    throw new Error('Not Supported');
  }

  selectAll() {
    throw new Error('Not Supported');
  }

  deselectAll() {
    throw new Error('Not Supported');
  }

  patch(options) {
    const selectionCur = this.gridView.get('selection');
    const selection = _.isFunction(options) ? options(selectionCur) : options;

    return _.defaults(selection, selectionCur);
  }
}

