import _ from 'underscore';
import { PaginationView } from 'pagination-control';

export default definePlugin => definePlugin('pagerView', [
  'gridView',
], function (gridView) {
  const pagerViewConfig = gridView.get('pagerView');
  const page = new PaginationView(pagerViewConfig).render();
  const initPageSize = pagerViewConfig.pageSize || pagerViewConfig.availablePageSizes[0];
  const initPageNumber = pagerViewConfig.pageNumber || 0;
  gridView.set({ query: _.defaults({ skip: initPageSize * initPageNumber, take: initPageSize }, gridView.get('query')) });
  gridView.on('didUpdate', () => {
    page.itemCount = gridView.totalCountRows;
  });
  page.on('change:page-number', pageNumber => {
    page.pageNumber = pageNumber;
    gridView.set({ query: _.defaults({ skip: page.pageSize * pageNumber, take: page.pageSize }, gridView.get('query')) });
  });
  page.on('change:page-size', pageSize => {
    page.pageSize = pageSize;
    gridView.set({ query: _.defaults({ take: pageSize }, gridView.get('query')) });
  });
});
