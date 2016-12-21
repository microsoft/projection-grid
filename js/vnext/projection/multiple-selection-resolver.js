import _ from 'underscore';
import { SelectionResolver } from './selection-resolver.js';

export class MultipleSelectionResolver extends SelectionResolver {

  selectRow(key) {
    return this.patch(({ selected }) => ({
      selected: _.union(selected, [key.toString()]),
      preSelect: key,
      preShiftSelect: null,
    }));
  }

  deselectRow(key) {
    return this.patch(({ selected }) => ({
      selected: _.without(selected, key.toString()),
      preSelect: null,
      preShiftSelect: null,
    }));
  }

  // Select all selectalbe items
  selectAll() {
    return this.patch(({ selectable, selected }) => {
      const patch = {
        preSelect: null,
        preShiftSelect: null,
      };

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

  // Selelct multi row when user press the Shift key
  selectMultiRow(key) {
    return this.patch(({ selectable, selected, preSelect, preShiftSelect }) => {
      const patch = {};

      if (!preSelect) {
        patch.selected = _.union(selected, [key.toString()]);
        patch.preSelect = key;
        return patch;
      }

      const allKey = _.chain(this.gridView.items.slice())
        .filter(selectable)
        .map(_.property(this.gridView.primaryKey))
        .map(String)
        .value();
      const preIndex = allKey.indexOf(preSelect);
      const curIndex = allKey.indexOf(key);
      const selectObj = _.indexBy(selected);

      if (preShiftSelect) {
        const preShiftIndex = allKey.indexOf(preShiftSelect);

        _.each(allKey.slice(
          Math.min(preIndex, preShiftIndex),
          Math.max(preIndex, preShiftIndex) + 1
        ), key => {
          delete selectObj[key];
        });
      }

      _.each(allKey.slice(
        Math.min(preIndex, curIndex),
        Math.max(preIndex, curIndex) + 1
      ), key => {
        selectObj[key] = key;
      });

      patch.selected = _.keys(selectObj);
      patch.preShiftSelect = key;

      return patch;
    });
  }

}
