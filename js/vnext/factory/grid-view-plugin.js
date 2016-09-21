import _ from 'underscore';
import { GridView } from '../grid-view.js';

const CONSTRUCTOR_OPTIONS = ['el', 'scrolling', 'tableClasses', 'dataSource'];
const NONE_PROJECTION_OPTIONS = CONSTRUCTOR_OPTIONS.concat(['plugins']);

/**
 * @typedef GridViewConfig
 * @type {Object}
 * @property {string} name
 *    Name of the grid
 * @property {string|HTMLElement|jQuery} el
 *    The root element of the grid view.
 * @property {ScrollingConfig} scrolling
 *    The scrolling behavior configuratoin.
 * @property {strings[]} tableClasses
 *    An array of classes to be applied to `TABLE` elements.
 * @property {Object.<string,Object>} plugins
 *    The plugin configurations. The keys are the plugin names, and the values
 *    are the configuation objects.
 * @property {RowsConfig} rows
 *    The structure of the head/body/foot rows.
 * @property {ColumnConfig[]} columns
 *    Array of the columns configurations.
 * @property {DataSourceConfig[]} dataSource
 *    The data source configurations. Tells the grid how to fetch data.
 * @property {SelectionConfig} selection
 *    Config the behavior for row selection.
 * @property {SortableHeaderConfig} sortableHeader
 *    Config the state and visual of the click-to-sort column headers.
 * @property {external:BackboneViewEventHash} events
 *    Customized event hash in form of `Backbone.View#events`.
 *    It can be set to handle
 *    * The DOM events inside the `GridView`.
 *    * The `GridView` events, e.g. {@link GridView#willUpdate},
 *      {@link GridView#didUpdate}.
 */
export default definePlugin => definePlugin('gridView', ['config'], config => {
  const gridView = new GridView(_.pick(config, CONSTRUCTOR_OPTIONS));

  gridView.set(_.omit(config, NONE_PROJECTION_OPTIONS));

  return gridView;
});

