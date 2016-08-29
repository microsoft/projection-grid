import _ from 'underscore';
import $ from 'jquery';
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

class Command {
  constructor(changeLog = {}, version = {}) {
    this._changeLog = $.extend(true, {}, changeLog); /* same structure with _changedDate: primaryKey: {item, editState, onCommit} */
    this._version = $.extend(true, {}, version); /* same structure with _data: primaryKey, objectData */
  }
  exists(key) {
    if (_.has(this._changeLog, key)) {
      return this._changeLog[key].editState !== 'REMOVED';
    } else if (_.has(this._version, key)){
      return true;
    } else {
      return false;
    }
  }
  attributes(key, propName) {
    if (_.has(this._changeLog, key)) {
      const item = this._changeLog[key].item;
      return item[propName];
    } else if (_.has(this._version, key)){
      return this._version[key][propName];
    } 
  }
  getItem(key) {
    if (this.exists(key)) {
      if (_.has(this._changeLog, key)) {
        return this._changeLog[key].item;
      } else {
        return this._version[key];
      }
    }
    return {};
  }
}

function diff(clientState, serverState) {
  const cids = _.chain(_.union(_.keys(clientState._changeLog), _.keys(clientState._version)))
                .filter(clientState.exists, clientState)
                .value();
  const sids = _.chain(_.union(_.keys(serverState._changeLog), _.keys(serverState._version)))
                .filter(serverState.exists, serverState)
                .value();
  const ids = _.union(cids, sids);
  const changeLog = {};
  const changes =  _.each(ids, id => {
                      const cFlag = clientState.exists(id);
                      const sFlag = serverState.exists(id);
                      if (cFlag && sFlag) {
                        const cKeys = _.keys(clientState.getItem(id));
                        const sKeys = _.keys(serverState.getItem(id));
                        if (cKeys.length != sKeys.length) {
                          changeLog[id] = { item: clientState.getItem(id), editState: 'UPDATED', onCommit: false };
                        } else {
                          const allKeys = _.union(cKeys, sKeys);
                          for (let i = 0, len = allKeys.length; i < len; i++) {
                            const cData = clientState.attributes(id, allKeys[i]);
                            const sData = serverState.attributes(id, allKeys[i]);
                            if (_.isObject(cData)) {
                              if (!_.isEqual(cData, sData)) {
                                changeLog[id] = { item: clientState.getItem(id), editState: 'UPDATED', onCommit: false };
                              break;
                              }
                            } else{
                              if (cData !== sData) {
                              changeLog[id] = { item: clientState.getItem(id), editState: 'UPDATED', onCommit: false };
                              break;
                            }
                            }
                          }
                        }
                      } else if (cFlag && !sFlag) {
                        changeLog[id] = { item: clientState.getItem(id), editState: 'CREATED', onCommit: false };
                      } else if (!cFlag && sFlag) {
                        changeLog[id] = { item: serverState.getItem(id), editState: 'REMOVED', onCommit: false };
                      }
                    });
  return changeLog;
}

export class Editor {
  constructor(storage, model) {
    _.extend(this, Backbone.Events);
    this._storage = normalizeStorage(storage);
    this._data = {}; /* key: dataItem */
    this._orignal = {}; /* original data array from dataStorage */
    this._changedData = {}; /* primaryKey: {item, editState, onCommit} */
    this._commandChain = [];
    this._head = -1;
    this._serverEditID = _.uniqueId('serverEditID');
    this.model = model;
  }

  get primaryKey() {
    return this._storage.primaryKey;
  }

  read(options = {}) {
    if(options.serverEditID == this._serverEditID) {
      return Promise.resolve(this._orignal);
    }
    const p$state = this._storage.read(options);
    const self = this;
    p$state.then((data, editor = self) => {
      const primaryKey = this.primaryKey;
      editor._orignal = data;
      editor._data = {};
      _.each(data.items, item => {
        editor._data[item[primaryKey]] = item;
      });
    });
    this.model.set({ query: { serverEditID: _.uniqueId('serverEditID') } });// TODO: it should be returned by server
    this._serverEditID = this.model.get('query').serverEditID;
    return p$state;
  }

  getItemEditState(key) {
    if (_.has(this._changedData, key)) {
      return this._changedData[key].editState;
    } else if (_.has(this._data, key)) {
      return 'UNCHANGED';
    }
    return 'NOTEXISTED';
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
          if (stateString === 'REMOVED') {
            delete this._changedData[key];
          } else if (stateString === 'UPDATED') {
            this._changedData[key].item = defaultsDeep(newItem, item);
          } 
          break;
        case 'UPDATED':
          if (stateString === 'REMOVED') {
            this._changedData[key].item = this._data[key];
            this._changedData[key].editState = 'REMOVED';
          } else if (stateString === 'UPDATED') {
            this._changedData[key].item = defaultsDeep(newItem, item);
          }
          break;
        case 'REMOVED':
          if (stateString === 'UPDATED') {
            this._changedData[key].item = defaultsDeep(newItem, this._data[key])
            this._changedData[key].editState = 'UPDATED';
          }
          break;
        default:
          delete this._changedData[key];
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
          break;
        default:
          break;
      }
    } else {
      // TODO handle error
    }
  }

  addCommond(command){
    const commandChainEnd = this._commandChain.length - 1;
    if (this._head < commandChainEnd) {
      this._commandChain.splice(this._head + 1);
    }
    this._commandChain.push(command);
    this._head += 1;
  }

  create(item) {
    const key = _.uniqueId('temporary-');
    const newItem = item;
    newItem[this.primaryKey] = key;
    
    this._changedData[key] = { item: newItem, editState: 'CREATED', onCommit: false };
    this.addCommond(new Command(this._changedData, this._data));
    this.model.set({ patchChange: { clientEditID: _.uniqueId('clientEditID') } });
  }

  updatePrimaryKey(clientKey, serverKey) {
    // when a new create item is successfully added to serve, update primaryKey.
    _.each(this._commandChain, command => {
      _.chain(command._changeLog).keys().each(key => {
        if(key === clientKey) {
          command._changeLog[serverKey] = command._changeLog[clientKey];
          const itemLog = command._changeLog[serverKey].item;
          itemLog[this.primaryKey] = serverKey;
          delete command._changeLog[clientKey];
        }
      }).value();
    });

    _.chain(this._changedData).keys().each(key => {
      if(key === clientKey) {
        this._changedData[serverKey] = this._changedData[clientKey];
        const itemData = this._changedData[serverKey].item;
        itemData[this.primaryKey] = serverKey;
        delete this._changedData[clientKey];
      }
    }).value();
  }

  destroy(key) {
    this.setItem(key, 'REMOVED', false);
    this.addCommond(new Command(this._changedData, this._data));
    this.model.set({ patchChange: { clientEditID: _.uniqueId('clientEditID') } });
  }

  destroyAll(...keys) {
    _.each(keys, key => (this.setItem(key, 'REMOVED', false)));
    this.addCommond(new Command(this._changedData, this._data));
    this.model.set({ patchChange: { clientEditID: _.uniqueId('clientEditID') } });
  }

  update(key, attrs) {
    this.setItem(key, 'UPDATED', false, attrs);
    this.addCommond(new Command(this._changedData, this._data));
    this.model.set({ patchChange: { clientEditID: _.uniqueId('clientEditID') } });
  }

  updateAll(...params) { /* param { key: key, attrs: {} } */
    _.each(params, param => (this.setItem(param.key, 'UPDATED', false, param.attrs)));
    this.addCommond(new Command(this._changedData, this._data));
    this.model.set({ patchChange: { clientEditID: _.uniqueId('clientEditID') } });
  }

  undo() {
    let clientState;
    if (this._head <= 0) {
      if (this._commandChain.length <= 0) {
        return;
      }
      clientState = new Command({}, this._commandChain[0]._version);
      this._head = -1;
    } else {
      this._head -= 1;
      clientState = this._commandChain[this._head];
    }
    
    const serverState = new Command({}, this._data);
    this._changedData = diff(clientState, serverState);
    this.model.set({ patchChange: { clientEditID: _.uniqueId('clientEditID') } });
  }

  redo() {
    if (this._head == this._commandChain.length - 1) {
      return;
    }
    this._head += 1;
    const clientState = this._commandChain[this._head];
    const serverState = new Command({}, this._data);
    this._changedData = diff(clientState, serverState);
    this.model.set({ patchChange: { clientEditID: _.uniqueId('clientEditID') } });
  }

  commit(){
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
      }).then((serverKey, clientKey = key, editor = self) => {
        delete editor._changedData[clientKey];
        if (serverKey) {
          editor.updatePrimaryKey(clientKey, serverKey);
        }
      });
    }
    
    /*
    new Promise((editor = self) => {
      const allChanges = editor._changedData;
      for (let key in allChanges) {
        const {item, editState} = allChanges[key];
        if (editState === 'UPDATED') {
          editor._storage.update(key, item);
        } else if (editState === 'CREATED') {
          editor._storage.create(_.omit(item, editor.primaryKey)).then();
        }
      }
    }).then((editor = self) => {
      editor.model.set({ query: { serverEditID: _.uniqueId('serverEditID') } });
    });
    */
    this.model.set({ query: { serverEditID: _.uniqueId('serverEditID') } });
  }

}

