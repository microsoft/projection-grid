// todo [akamel] [bug] with large data set, jitters when scrolling to bottom

define([
      'lib/jquery'
    , 'lib/underscore'
    , 'component/grid/layout/measure'
    , 'component/grid/layout/px'
  ],
function($, _, measure, px){
  function row_height(row) {
    return _.isNumber(row.__height)? row.__height : this.__measures.avg_row_height;
  }

  function estimate_height(first, last) {
    var rows = this.layout.data.value;

    var ret = 0;
    for (var i = first; i <= last; i++) {
      ret += row_height.call(this, rows[i]);
    };

    return ret;
  }

  function row_at_offset(offset) {
    var rem = offset;

    if (rem <= 0) {
      return 0;
    }

    var ret     = -1
      , count   = _.size(this.layout.data.value)
      ;

    while(rem > 0 && ret < count - 1) {
      ret++;
      rem -= row_height.call(this, ret);
    }

    return (ret < count)? ret : -1;
  }

  function Renderer(options) {
    this.options = options || {};

    this.name = 'virtualization';
    this.layout = this.options.layout;
  }


  Renderer.prototype.draw = function(data, cb) {
    // a. define data set
    var value         = this.layout.data.value
      , count         = _.size(value)
      , first         = 0
      , last          = count - 1
      ;

    // b. render test pass / take initial measures
    if (!this.__measures) {
      var smpl = measure.sample.call(this.layout);
      this.__measures = _.pick(smpl, 'avg_row_height', 'estimate_height', 'thead');
    }

    // b.1 set height based on measures estimate
    this.layout.$el.css({
        'padding-top'     : px.pixelify(this.__measures.estimate_height)
    });
    
    // c. find visible viewport
    data.vp_measures = data.vp_measures || measure.viewport.call(this.layout);

    // d. find rendable rows
    var first = row_at_offset.call(this, data.vp_measures.top - this.__measures.thead)
      , last  = row_at_offset.call(this, data.vp_measures.bottom - this.__measures.thead)
      ;

    // d.1 add a few rows before and after our calculations to account for measurment estimation err
    var err_margin_row_count = 5;

    first -= err_margin_row_count;
    last += err_margin_row_count;

    first = Math.max(0, first);
    last = Math.min((last < 0)? count - 1 : last, count - 1);;
    
    var p_top     = estimate_height.call(this, 0, first - 1)
      , p_bottom  = estimate_height.call(this, last + 1, count - 1)
      ;

    data.rows = value.slice(first, last + 1);

    _.extend(data.css, {
        'padding-top'     : px.pixelify(p_top + px.parse(data.css['padding-top']))
      , 'padding-bottom'  : px.pixelify(p_bottom + px.parse(data.css['padding-bottom']))
    });

    if (this.first === first && this.last === last) {
      data.can_skip_draw = true;
    }

    // e. yield to render
    cb(undefined, data);

    // f. take new measures and update avg row height
    // todo [akamel] [perf] 7.5%
    var tbl_measures = measure.dimensions.call(this.layout);
    _.each(tbl_measures.rows, function(height, i){
      value[i + first].__height = height;
    });

    var heights = _.chain(value).map(function(row){ return row.__height; }).compact().value();
    if (_.size(heights)) {
      this.__measures.avg_row_height = _.reduce(heights, function(memo, num){ return memo + num; }, 0) / _.size(heights);
    }
    
    this.first = first;
    this.last = last;
  }

  Renderer.prototype.update = function() {
    delete this.__measures;
  }

  Renderer.partial = function(options) {
    return function(o) {
      return new Renderer(_.defaults({}, o, options));
    };
  };

  return Renderer;
});
