import _ from 'underscore';
import { GridView } from '../grid-view.js';

const CONSTRUCTOR_OPTIONS = ['el', 'viewport', 'virtualized', 'stickyHeader'];

export default definePlugin => definePlugin('gridView', ['config'], config => {
  const gridView = new GridView(_.pick(config, CONSTRUCTOR_OPTIONS));

  gridView.set(_.omit(config, CONSTRUCTOR_OPTIONS));

  return gridView;
});

