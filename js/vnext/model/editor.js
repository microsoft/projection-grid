import _ from 'underscore';
import Backbone from 'backbone';
import Promise from 'bluebird';

import { ODataStorage } from './odata-storage.js';
import { MemoryStorage } from './memory-storage.js';
import { JSDataStorage } from './js-data-storage.js';

function normalizeStorage(storage) {
  if (_.isString(storage.type)) {
    switch (storage.type) {
      case 'odata':
        return new ODataStorage(storage);
      case 'js-data':
        return new JSDataStorage(storage);
      case 'memory':
        return new MemoryStorage(storage);
      default:
        throw new Error(`Unknown storage type '${storage.type}`);
    }
  }

  return storage;
}

export class Editor {
  constructor(storage) {
    _.extend(this, Backbone.Events);
    this._storage = normalizeStorage(storage);
  }

  get primaryKey() {
    return this._storage.primaryKey;
  }

  read(options = {}) {
    return this._storage.read(options);
  }

  getItemEditState(key) {
    return 'UNCHANGED';
  }
}

