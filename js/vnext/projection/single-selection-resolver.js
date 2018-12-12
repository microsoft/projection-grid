import { SelectionResolver } from './selection-resolver.js';

export class SingleSelectionResolver extends SelectionResolver {
  selectRow(key) {
    return this.patch({ selected: [key.toString()] });
  }
}

