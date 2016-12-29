import _ from 'underscore';
import { SelectionResolver } from './selection-resolver.js';

export class MultipleSelectionResolver extends SelectionResolver {

  selectRow(key) {
    return this.patch(({ selected }) => ({
      selected: _.union(selected, [key.toString()]),
    }));
  }

  deselectRow(key) {
    return this.patch(({ selected }) => ({
      selected: _.without(selected, key.toString()),
    }));
  }

  // Select all selectalbe items
  selectAll() {
    return this.patch(({ selectable, selected }) => {
      const patch = {};

      patch.selected = _.chain(this.gridView.items.slice())
        .filter(selectable)
        .map(_.property(this.gridView.primaryKey))
        .map(String)
        .union(selected)
        .value();

      return patch;
    });
  }

  // Deselect all selectable items
  deselectAll() {
    return this.patch(({ selectable, selected }) => {
      const patch = {};

      patch.selected = _.filter(selected, key => {
        const item = this.gridView.itemWithKey(key);

        return !(item && selectable(item));
      });

      return patch;
    });
  }
}
