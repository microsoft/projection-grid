import _ from 'underscore';
import { PaginationView } from 'pagination-control';

export default definePlugin => definePlugin('pagerView', [
  'config',
  'projection',
  'gridView',
], function (config, projection, gridView) {
  const pagerView = new PaginationView(_.defaults({
    pageSize: config.pageable.pageSize,
    availablePageSizes: config.pageable.pageSizes,
  }, config.pagerView));

  gridView.on('change:data', function (model) {
    pagerView.itemCount = model.get('count');
  });

  pagerView.on('change:page-size', function (pageSize) {
    projection.set('page.size', pageSize);
  });

  pagerView.on('change:page-number', function (pageNumber) {
    projection.set('page.number', pageNumber);
  });

  return pagerView;
});
