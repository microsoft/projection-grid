import $ from 'jquery';
import _ from 'underscore';
import measure from '../measure';
import px from '../px';

class FixedHeaderRenderer {
  constructor(options = {}) {
    this.name = 'fixed-header';
    this.state = 'normal';

    this.options = options;
    this.layout = this.options.layout;
    this.columnWidth = null;
    this.windowWidth = $(window).width();
  }

  draw(data, cb) {
    data.vpMeasures = measure.viewport.call(this.layout);

    const $el = this.layout.$el;
    const offset = _.result(this.layout, 'top', 0);
    const isSticky = (data.vpMeasures.viewportTop + offset) > data.vpMeasures.boundsTop;
    const newState = isSticky ? 'sticky' : 'normal';

    data.canSkipDraw = newState === this.state;
    data.isSticky = isSticky;

    cb(undefined, data);

    $el.find('table.grid').css({ tableLayout: 'fixed' });

    if (isSticky) {
      const $tableStickyHeader = $el.find('table.grid-sticky-header');
      const $tableContent = $el.find('table.grid-content');
      const $thLastRow = $tableStickyHeader.find('thead > tr:last-child').children();
      const $tdFirstRow = $tableContent.find('tbody > tr:first-child').children();

      if (this.state === 'normal') {
        const $stickyHeaderFiller = $el.find('.sticky-header-filler');
        $stickyHeaderFiller.css({
          height: $tableStickyHeader.outerHeight(),
        });
      }

      const setColumnWidth = (tableWidth, columnWidth) => {
        _.each([
          $thLastRow,
          $tdFirstRow,
        ], ($elems) => _.each($elems, (el, index) => {
          $(el).css({
            width: _.result(columnWidth, index, ''),
          });
        }));

        $el.find('table.grid').css({
          width: tableWidth,
        });
      };

      const unfreezeColumnWidth = () => {
        setColumnWidth('', null);
      };

      const updateColumnWidth = () => {
        unfreezeColumnWidth();
        this.windowWidth = $(window).width();
        this.tableWidth = $tableContent.outerWidth();
        this.columnWidth = _.map($tdFirstRow, (td) => $(td).outerWidth());
      };

      const freezeColumnWidth = this.freezeColumnWidth = () => {
        if (!this.columnWidth || Math.abs($(window).width() - this.windowWidth) >= 1) {
          updateColumnWidth();
        }

        setColumnWidth(this.tableWidth, this.columnWidth);
      };

      freezeColumnWidth();
      $tableStickyHeader.css({
        top: offset,
        left: $tableContent.offset().left - window.scrollX,
        position: 'fixed',
      });
    } else {
      this.freezeColumnWidth = null;
    }

    if (this.state !== newState) {
      this.layout.grid.trigger('change:header-state', newState);
      this.state = newState;
    }
  }

  static partial(options) {
    return function (o) {
      return new Renderer(_.defaults({}, o, options));
    };
  };
}

export default FixedHeaderRenderer;
