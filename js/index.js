import factory from './factory/grid-factory';

module.exports = {
  version: '0.1.0-15',
  GridView: require('./grid-view'),
  projections: require('./projection/index'),
  layout: require('./layout/index'),
  factory,
  popupEditorPrompt: require('./popup-editor/index'),
};
