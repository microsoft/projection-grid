import factory from './factory/grid-factory';
import {
  DataSource,
  MemoryDataSource,
  ODataDataSource,
  JSDataDataSource,
} from './vnext/data-source';

module.exports = {
  version: '0.1.0-40',
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
