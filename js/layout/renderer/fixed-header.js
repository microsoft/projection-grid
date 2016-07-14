define([
  'lib/jquery',
  'lib/underscore',
  'component/grid/layout/measure',
  'component/grid/layout/px',
], function ($, _, measure, px) {
  var state = 'normal';

  function Renderer(options) {
    this.options = options || {};

    this.name = 'fixed-header';
    this.layout = this.options.layout;
    this.adjustColumnWidth = () => {
      if (_.isFunction(this.freezeColumnWidth)) {
        this.freezeColumnWidth();
      }
    };
    $(window).on('resize', this.adjustColumnWidth);
  }

  Renderer.prototype.draw = function (data, cb) {
    var newState = 'normal';

    data.vpMeasures = measure.viewport.call(this.layout);

    // TODO [wewei] this is a hack to temporarily solve the sticky header doesn't
    // respect the navbar problem.
    // We need a better solution on this.
    if (data.vpMeasures.viewportTop + (this.layout.top || 0) > data.vpMeasures.boundsTop) {
      var $el = this.layout.$el;

      newState = 'sticky';
      // todo [akamel] assumes we have table rendered; measure/estimate otherwise

      // a. compensate for header displacement
      // .. as we set 'thead > tr' css position 'absolute'
      var displacement = $el.find('thead tr').outerHeight();
      _.extend(data.css, {
        'padding-top': px.pixelify(px.parse(data.css['padding-top']) + displacement),
      });

      data.canSkipDraw = true;

      // b. yield to render
      cb(undefined, data);

      // c. get newly rendered header
      var $thead = $el.find('thead');
      var $headTR = $el.find('thead > tr');
      var $headTD = $headTR.first().children();
      var $secondHeadTD = $headTR.eq(1).children();
      var $bodyTD = $el.find('tbody > tr:first-child').children();

      var $ref = $bodyTD;
      var $target = $headTD;

      this.freezeColumnWidth = () => {
        // d. capture header col computed width
        // todo [akamel] [perf] 16%
        this.colWidth = this.colWidth || _.map($ref, function (td) {
          return $(td).width();
        });

        // todo [akamel] [perf] 12% -- consider replacing with css rule generation
        // e. freeze column width
        // e.1 freeze col width
        var colIndex = 0;
        var secondHeadTDIndex = 0;
        _.each($target, function (td) {
          var colspan = parseInt($(td).attr('colspan'), 10);
          var rowspan = parseInt($(td).attr('rowspan'), 10);
          var width = 0;
          for (var i = 0; i < colspan; ++i) {
            var colWidth = px.pixelify(this.colWidth[colIndex + i]);
            width += colWidth;
            if (rowspan === 1) {
              $secondHeadTD.eq(secondHeadTDIndex + i).width(colWidth);
            }
          }
          $(td).width(width);
          colIndex += colspan;
          if (rowspan === 1) {
            secondHeadTDIndex += colspan;
          }
        }.bind(this));

        _.each($ref, function (td, index) {
          $(td).width(px.pixelify(this.colWidth[index]));
        }.bind(this));
      };

      this.freezeColumnWidth();

      // f. set position 'fixed' and lock header at top of table
      $thead.css({
        'position': this.layout.container.el === window ? 'fixed' : 'absolute',
        'top': px.pixelify(this.layout.container.el === window ? 0 : this.layout.container.$el.scrollTop()),
        'margin-left': px.pixelify(-data.vpMeasures.offsetLeft),
        'z-index': 1000,
      });
    } else {
      newState = 'normal';

      _.extend(data.css, {
        'padding-top': px.pixelify(px.parse(data.css['padding-top'])),
      });

      cb(undefined, data);
    }

    if (state !== newState) {
      this.layout.grid.trigger('change:header-state', newState);
      state = newState;
    }
  };

  Renderer.prototype.remove = function () {
    $(window).off('resize', this.adjustColumnWidth);
  };

  Renderer.partial = function (options) {
    return function (o) {
      return new Renderer(_.defaults({}, o, options));
    };
  };

  return Renderer;
});
