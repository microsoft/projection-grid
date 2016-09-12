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
function oneLineDiff(cLine, sLine) {
  const cKeys = _.keys(cLine);
  const sKeys = _.keys(sLine);
  
  const allKeys = _.union(cKeys, sKeys);
  const item = {};
  let isChanged = false;
  _.chain(cKeys).union(sKeys).each(key => {
    if (key in cLine){
      if (!_.isEqual(cLine[key], sLine[key])) {
        isChanged = true;
      }
      item[key] = cLine[key];
    } else {
      isChanged = true;
      item[key] = null;
    }
  }).value();

  if (isChanged) {
    return { item, editState: 'UPDATED', onCommit: false };
  } else {
    return null;
  }
  
  /*
  if (cKeys.length != sKeys.length) {
    return { item: cLine, editState: 'UPDATED', onCommit: false };
  } else {
    const allKeys = _.union(cKeys, sKeys);
    for(let i in allKeys) {
      const key = allKeys[i];
      if (!_.isEqual(cLine[key], sLine[key])) {
        return { item: cLine, editState: 'UPDATED', onCommit: false };
      }
    }
  }
  */
  
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
  _.each(ids, id => {
    const cFlag = clientState.exists(id);
    const sFlag = serverState.exists(id);
    if (cFlag && sFlag) {
      const changedObj = oneLineDiff(clientState.getItem(id), serverState.getItem(id));
      if (changedObj) {
        changeLog[id] = changedObj;
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
    this._autoCommit = false;
  }

  get primaryKey() {
    return this._storage.primaryKey;
  }

  read(options = {}) {
    if(options.serverEditID == this._serverEditID) {
      return Promise.resolve(this._orignal);
    }
    const p$state = this._storage.read(options);
    return p$state.then((data) => {
      const primaryKey = this.primaryKey;
      this._orignal = data;
      this._data = $.extend(true, {}, data.itemIndex);

      this.model.set({ query: { serverEditID: _.uniqueId('serverEditID') } });// TODO: it should be returned by server
      this._serverEditID = this.model.get('query').serverEditID;
      return data;
    }).bind(this);
  }

  setAutoCommit(time = 10000) {
    this._autoCommit = this.autoCommit(time);
  }

  cancelAutoCommit() {
    this._autoCommit = false;
  }

  getItemEditState(key) {
    if (_.has(this._changedData, key)) {
      return this._changedData[key].editState;
    } else if (_.has(this._data, key)) {
      return 'UNCHANGED';
    }
    return 'NOTEXISTED';
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

  addCommond(command){
    const commandChainEnd = this._commandChain.length - 1;
    if (this._head < commandChainEnd) {
      this._commandChain.splice(this._head + 1);
    }
    this._commandChain.push(command);
    this._head += 1;
  }

  createItem(item) {
    const key = item[this.primaryKey] === undefined ? _.uniqueId('temporary-') : item[this.primaryKey];
    const newItem = item;
    newItem[this.primaryKey] = key;
    this._changedData[key] = { item: newItem, editState: 'CREATED', onCommit: false };
  }

  create(item) {
    this.createItem(item);
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

  destroyItem(key) {
    const currentState = this.getItemEditState(key);
    if (currentState === 'CREATED') {
      delete this._changedData[key];
    } else if (currentState === 'UPDATED') {
      this._changedData[key].editState = 'REMOVED';
    } else if (currentState === 'UNCHANGED') {
      this._changedData[key] = { item: this._data[key], editState: 'REMOVED', onCommit: false };
    } else {
      throw new Error('Element does not exist or has been removed!');
    }
  }

  destroy(key) {
    this.destroyItem(key);
    this.addCommond(new Command(this._changedData, this._data));
    this.model.set({ patchChange: { clientEditID: _.uniqueId('clientEditID') } });
  }

  destroyAll(...keys) {
    _.each(keys, key => (this.destroyItem(key)));
    this.addCommond(new Command(this._changedData, this._data));
    this.model.set({ patchChange: { clientEditID: _.uniqueId('clientEditID') } });
  }

  updateItem(key, attrs) {
    const currentState = this.getItemEditState(key);
    if (currentState === 'CREATED' || currentState === 'UPDATED') {
      this._changedData[key].item = defaultsDeep(attrs, this._changedData[key].item);
    } else if (currentState === 'UNCHANGED') {
      this._changedData[key] = { item: defaultsDeep(attrs, this._data[key]), editState: 'UPDATED', onCommit: false };
    } else {
      throw new Error('Element does not exist or has been removed!');
    }
  }

  update(key, attrs) {
    this.updateItem(key, attrs);
    this.addCommond(new Command(this._changedData, this._data));
    this.model.set({ patchChange: { clientEditID: _.uniqueId('clientEditID') } });
  }

  updateAll(...params) { /* param { key: key, attrs: {} } */
    _.each(params, param => (this.updateItem(param.key, param.attrs)));
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

  commit() {
    let clientState;

    if (this._head < 0) {
      if (this._commandChain.length <= 0) {
        return;
      }
      clientState = new Command({}, this._commandChain[0]._version);
    } else {
      clientState = this._commandChain[this._head];
    }

    const serverState = new Command({}, this._data);
    const changeLog = diff(clientState, serverState);
    this._changedData = {};

    const allChanges = [];
    _.mapObject(changeLog, (value, key) => {
      const { item, editState } = value;
      if (editState === 'UPDATED') {
        const p$update = this._storage.update(key, item).then(
          (data, primaryKey = key) => ('update'),
          (error) => (alert(error))).bind(this);

        allChanges.push(p$update);

      } else if (editState === 'CREATED') {
        const p$create = this._storage.create(item).then((data, clientKey = key) => {
          const serverKey = data[this.primaryKey]
          this.updatePrimaryKey(clientKey, serverKey);
        }).bind(this);

        allChanges.push(p$create);

      } else if (editState === 'REMOVED') {
        const p$remove = this._storage.destroy(key).then(
          (data, primaryKey = key) => {
            'remove'
          }).bind(this);

        allChanges.push(p$remove);
      }
    });

    Promise.all(allChanges).then(() => {
      this.model.set({ query: { serverEditID: _.uniqueId('serverEditID') } });
    }).bind(this); 
  }

  autoCommit(time = 10000) {
    return window.setInterval(() => {
      if (!_.isEmpty(this._changedData)) {
        this.commit();
      }
    }, time);
  }

}

