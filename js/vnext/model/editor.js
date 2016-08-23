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

function defaultsDeep(dest, src) {
  if (_.isObject(dest) && !_.isArray(dest)) {
    _.defaults(dest, src);
    _.each(src, (value, key) => {
      if (dest[key] !== value) {
        defaultsDeep(dest[key], value);
      }
    });
  }
  return dest;
}

class Change {
  constructor({
    optionName,
    primaryKey,
    changedItem = {},
    previousItem = {},
  } = {}){
    this.primaryKey = primaryKey;
    this.changedItem = changedItem;
    this.previousItem = previousItem;
    this.optionName = optionName;
    this.timeStamp = Date.now();
  }
}

class Command {
  constructor(changes = []) { // changes is an array
    this.commandId = _.uniqueId();
    this.changes = changes;
  }
}

export class Editor {
  constructor(storage) {
    _.extend(this, Backbone.Events);
    this._storage = normalizeStorage(storage);
    this._data = {};
    this._changedData = {}; /* primaryKey: {item, editState, onCommit} */
    this._commandChain = [];
    this._head = 0;
    this._clientEditID = _.uniqueId('clientEditID');
  }

  get primaryKey() {
    return this._storage.primaryKey;
  }

  get clientEditID() {
    return this._clientEditID;
  }

  read(options = {}) {
    const p$state = this._storage.read(options);
    const self = this;
    p$state.then((data, editor = self) => {
      const primaryKey = this.primaryKey;
      editor._data.orignal = data;
      _.each(data.items, item => {
        editor._data[item[primaryKey]] = item;
      });
    });
    return p$state;
  }

  getItemEditState(key) {
    if (_.has(this._changedData, key)) {
      return this._changedData[key].eidtState;
    }
    return 'UNCHANGED';
  }

  setItemEditState() {

  }

  getEditState(){
    return JSON.stringify(this._changedData);
  }

  getItem(key) {
    if (_.has(this._changedData, key)) {
      return this._changedData[key];
    }
    return { item: this._data[key], editState: 'UNCHANGED', onCommit: false };
  }

  setItem(key, stateString, onCommitFlag, newItem={}) {
    if (_.has(this._changedData, key)) {
      const { item, editState, onCommit } = this._changedData[key];
      switch (editState) {
        case 'CREATED':
        if (stateString == 'REMOVED') {
          delete this._changedData[key];
        } else if (stateString == 'UPDATED') {
          this._changedData[key].item = defaultsDeep(newItem, item);
        }
        break;
        case 'UPDATED':
        if (stateString == 'REMOVED') {
          this._changedData[key].item = this._data[key];
          this._changedData[key].editState = 'REMOVED';
        } else if (stateString == 'UPDATED') {
          this._changedData[key].item = defaultsDeep(newItem, item);
        }
        break;
        case 'REMOVED':
        if (stateString == 'UPDATED') {
          this._changedData[key].item = defaultsDeep(newItem, this._data[key])
          this._changedData[key].editState = 'UPDATED';
        }
        break;
        default:
        break;
      }
    } else if (_.has(this._data, key)) {
      const original = this._data[key];
      switch (stateString) {
        case 'UPDATED':
        this._changedData[key] = { item: defaultsDeep(newItem, original), editState: stateString, onCommit: onCommitFlag };
        break;
        case 'REMOVED':
        this._changedData[key] = { item: original, editState: stateString, onCommit: onCommitFlag };
        default:
        break;
      }
    } else {
      // TODO handle error
    }
  }

  addItem(){

  }

  getPreviousItem(key) {
    if (_.has(this._changedData, key)) {
      return this._changedData[key].item;
    } else if(_.has(this._data, key)){
      return this._data[key];
    }
    return {};
  }

  create(item) {
    const itemKey = this.primaryKey;
    const key = _.uniqueId();
    const change = new Change({
      primaryKey: key,
      changedItem: item,
      previousItem: this.getPreviousItem(key),
      optionName: 'create',
    });
    this._commandChain.push(new Command([change]));
    this._changedData[key] = { item: _.defaults({ itemKey: key }, item), editState: 'CREATED', onCommit: false };
    this._clientEditID = _.uniqueId('clientEditID');
  }

  createCollection(...items) {
    const itemKey = this.primaryKey;
    const command = new Command();
    let key;
    let change;

    _.each(items, item => {
      key = _.uniqueId();

      change = new Change({
        primaryKey: key,
        changedItem: item,
        previousItem: this.getPreviousItem(key),
        optionName: 'create',
      });

      command.changes.push(change);
      this._changedData[key] = { item: _.defaults({ itemKey: key }, item), editState: 'CREATED', onCommit: false };
    });

    this._commandChain.push(command);
    this._clientEditID = _.uniqueId('clientEditID');
  }

  updatePrimaryKey(clientKey, serverKey) {
    // when a new create item is successfully added to serve, update primaryKey.
    _.each(this._commandChain, command => {
      _.each(command, change => {
        if(change.primaryKey == clientKey) {
          change.primaryKey = serverKey;
        }
      });
    });

    _.chain(this._changedData).keys().each(key => {
      if(key == clientKey) {
        key = serverKey;
      }
    });
  }

  destroy(key) {
    const change = new Change({
      primaryKey: key,
      optionName: 'destroy',
    });
    this._commandChain.push(new Command([change]));

    this.setItem(key, 'REMOVED', false);
    this._clientEditID = _.uniqueId('clientEditID');
  }

  destroyAll(...keys) {
    const changes = _.map(keys, key => {
      this.setItem(key, 'REMOVED', false); 
      return new Change({
        primaryKey: key,
        optionName: 'destroy',
      });
    });

    this._commandChain.push(new Command(changes));
    this._clientEditID = _.uniqueId('clientEditID');
  }

  update(key, attrs) {
    const change = new Change({
      primaryKey: key,
      changedItem: attrs,
      previousItem: this.getPreviousItem(key),
      optionName: 'update',
    });
    this._commandChain.push(new Command([change]));
    this.setItem(key, 'UPDATED', false, attrs);
    this._clientEditID = _.uniqueId('clientEditID');
  }

  updateAll(...params) {
    const command = new Command();
    let change;
    _.each(params, param => {
      change = new Change({
        primaryKey: param.key,
        changedItem: param.attrs,
        previousItem: this.getPreviousItem(param.key),
        optionName: 'update',
      });

      command.changes.push(change);

      this.setItem(key, 'UPDATED', false, param.attrs);
    });

    this._commandChain.push(command);
    this._clientEditID = _.uniqueId('clientEditID');
  }

  commit(){
    /*
    const commandChain = this._commandChain.slice(this._head);
    const self = this._storage;
    if(commandChain) {
      Promise.reduce(commandChain, command => {
        Promise.reduce(command.changes, (change, storage = self) => {
          const optionName = change.optionName;
          if(optionName == 'create') {
            const serverKey = storage.create(change.changedItem);
            updatePrimaryKey(change.changedItem.primaryKey, serverKey)
          } else if (optionName == 'update') {
            storage.update(change.primaryKey, change.changedItem);
          } else if (optionName == 'destroy') {
            storage.destroy(change.primaryKey);
          }
        }, []);
      }, []);
    }
    */
    
    const allChanges = this._changedData;
    const self = this;
    for(let key in allChanges) {
      const {item, editState} = allChanges[key];
      new Promise((resolve, reject, editor = self) => {
        let serverKey;
        if(editState == 'UPDATED') {
          editor._storage.update(key, item);
        } else if(editState == 'CREATED') {
          serverKey = editor._storage.create(_.omit(item, editor.primaryKey));
        } else if(editState == 'REMOVED') {
          editor._storage.destroy(key);
        } else {
          // TODO handle error
        }
        resolve(serverKey);
        reject();
      }).then((serverKey, clientKey = key, editor = self) => {
        delete editor._changedData[clientKey];
        if (serverKey) {
          _.each(editor._commandChain, command => {
            _.each(command.changes, change => {
              if (change.primaryKey == clientKey) {
                change.primaryKey = serverKey;
              }
            });
          });
        }
        
      }, () => {});
    }

  }

}

