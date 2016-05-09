import _ from 'underscore';
import GridView from '../grid-view';
import layout from '../layout/index';

export default definePlugin => definePlugin('gridView', [
  'config',
  'projection',
  'renderers',
], function (config, projection, renderers) {
  return new GridView({
    projection,
    el: config.el,
    container: _.chain(config)
      .result('scrollable')
      .result('fixedHeader')
      .result('container')
      .value(),
    schema: config.dataSource.schema,
    Layout: layout.TableLayout.partial({
      renderers,
      template: layout.templates.table,
      hideHeaders: config.hideHeaders,
    }),
  });
});
