// TODO [akamel] [bug] with large data set, jitters when scrolling to bottom

define([
  'lib/jquery',
  'lib/underscore',
  'component/grid/layout/measure',
  'component/grid/layout/px',
], function ($, _, measure, px) {
  function rowHeight(row) {
    return _.isNumber(row.__height) ? row.__height : this.__measures.avgRowHeight;
  }

  function estimateHeight(first, last) {
    var rows = this.layout.data.value;

    var ret = 0;
    for (var i = first; i <= last; i++) {
      ret += rowHeight.call(this, rows[i]);
    }

    return ret;
  }

  function rowAtOffset(offset) {
    var rem = offset;

    if (rem <= 0) {
      return 0;
    }

    var ret = -1;
    var count = _.size(this.layout.data.value);

    while (rem > 0 && ret < count - 1) {
      ret++;
      rem -= rowHeight.call(this, ret);
    }

    return (ret < count) ? ret : -1;
  }

  function Renderer(options) {
    this.options = options || {};

    this.name = 'virtualization';
    this.layout = this.options.layout;
  }

  Renderer.prototype.draw = function (data, cb) {
    // a. define data set
    var value = this.layout.data.value;
    var count = _.size(value);
    var first = 0;
    var last = count - 1;

    // b. render test pass / take initial measures
    if (!this.__measures) {
      var smpl = measure.sample.call(this.layout);
      this.__measures = _.pick(smpl, 'avgRowHeight', 'estimateHeight', 'thead');
    }

    // b.1 set height based on measures estimate
    this.layout.$el.css({
      'padding-top': px.pixelify(this.__measures.estimateHeight),
    });

    // c. find visible viewport
    data.vpMeasures = data.vpMeasures || measure.viewport.call(this.layout);

    // d. find rendable rows
    first = rowAtOffset.call(this, data.vpMeasures.top - this.__measures.thead);
    last = rowAtOffset.call(this, data.vpMeasures.bottom - this.__measures.thead);

    // d.1 add a few rows before and after our calculations to account for measurment estimation err
    var errMarginRowCount = 5;

    first -= errMarginRowCount;
    last += errMarginRowCount;

    first = Math.max(0, first);
    last = Math.min((last < 0) ? count - 1 : last, count - 1);

    var pTop = estimateHeight.call(this, 0, first - 1);
    var pBottom = estimateHeight.call(this, last + 1, count - 1);

    data.rows = value.slice(first, last + 1);

    _.extend(data.css, {
      'padding-top': px.pixelify(pTop + px.parse(data.css['padding-top'])),
      'padding-bottom': px.pixelify(pBottom + px.parse(data.css['padding-bottom'])),
    });

    if (this.first === first && this.last === last) {
      data.canSkipDraw = true;
    }

    // e. yield to render
    cb(undefined, data);

    // f. take new measures and update avg row height
    // todo [akamel] [perf] 7.5%
    var tblMeasure = measure.dimensions.call(this.layout);
    _.each(tblMeasure.rows, function (height, i) {
      value[i + first].__height = height;
    });

    var heights = _.chain(value)
      .map(function (row) {
        return row.__height;
      }).compact().value();

    if (_.size(heights)) {
      this.__measures.avgRowHeight = _.reduce(heights, function (memo, num) {
        return memo + num;
      }, 0) / _.size(heights);
    }

    this.first = first;
    this.last = last;
  };

  Renderer.prototype.update = function () {
    delete this.__measures;
  };

  Renderer.partial = function (options) {
    return function (o) {
      return new Renderer(_.defaults({}, o, options));
    };
  };

  return Renderer;
});
