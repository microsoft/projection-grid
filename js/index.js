import factory from './factory/grid-factory';
import pkg from '../package.json';
import {
  DataSource,
  MemoryDataSource,
  ODataDataSource,
  JSDataDataSource,
} from './vnext/data-source';

module.exports = {
  version: pkg.json,
  GridView: require('./grid-view'),
  projections: require('./projection/index'),
  layout: require('./layout/index'),
  factory,
  popupEditorPrompt: require('./popup-editor/index'),
  dataSource: {
    Base: DataSource,
    Memory: MemoryDataSource,
    OData: ODataDataSource,
    JSData: JSDataDataSource,
  },
};
