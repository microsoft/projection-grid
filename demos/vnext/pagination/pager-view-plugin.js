import _ from 'underscore';
import { PaginationView } from 'pagination-control';

export default definePlugin => definePlugin('pagerView', [
  'gridView',
], function (gridView) {
    const page = new PaginationView(gridView.get('pagerView')).render();
    const initPageSize = gridView.initPageSize;
    gridView.set({ dataSource: _.defaults({ skip: initPageSize * gridView.initPageNumber, take: initPageSize }, gridView.get('dataSource')) });
    gridView.on('didUpdate', () => {
      page.itemCount = gridView.getItemCount();
    });
    page.on('change:page-number', pageNumber => {
      page.pageNumber = pageNumber;
      gridView.set({ dataSource: _.defaults({ skip: page.pageSize * pageNumber, take: page.pageSize }, gridView.get('dataSource')) });
    });
    page.on('change:page-size', pageSize => {
      page.pageSize = pageSize;
      gridView.set({ dataSource: _.defaults({ take: pageSize }, gridView.get('dataSource')) });
    });
  });
