define([
      'lib/jquery'
    , 'lib/underscore'
  ],
function($, _){
  function viewport(el) {
    var $el = el? $(el) : this.$el;

    // todo [akamel] this would assume that only window has a scrollbar
    var $viewport       = $(window);

    var viewport_top    = $viewport.scrollTop()
      , viewport_bottom = viewport_top + $viewport.height()
      , viewport_left   = $viewport.scrollLeft()
      ;

    var bounds_top      = $el.offset().top
      , bounds_bottom   = bounds_top + $el.innerHeight()
      // , bounds_left     = $el.offset().left
      ;

    var visible_top     = Math.max(bounds_top, viewport_top)
      , visible_bottom  = Math.min(bounds_bottom, viewport_bottom)
      // , visible_left    = Math.max(bounds_left, viewport_left)
      ;

    return {
        top         : visible_top    - bounds_top
      , bottom      : visible_bottom - bounds_top
      , offset_left : viewport_left
    };
  }

  function dimensions(el) {
    var $el = el? $(el) : this.$el;

    // calculate heights
    // a. header
    var ret = {
        rows  : []
      , thead : $el.find('thead > tr').outerHeight()
    };

    // b. keep row info
    $el.find('tbody').children('tr').each(function(){
      ret.rows.push($(this).outerHeight());
    });

    // c. update average row height
    var avg = _.reduce(ret.rows, function(memo, num) {
        return memo + num;
    }, 0) / (ret.rows.length === 0 ? 1 : ret.rows.length);

    ret.avg_row_height = avg;
    ret.estimate_height = (_.size(this.data.value) * avg) + ret.thead

    return ret;
  }

  function sample() {
    // a. render test pass
    var $tmp_el     = $('<div style="visibility:hidden" />')
      , sample      = _.first(this.data.value, 20)
      ;

    this.$el.append($tmp_el);

    $tmp_el[0].innerHTML = this.toHTML(sample);

    // b. take measures
    var ret = dimensions.call(this, $tmp_el);

    // c. clean-up
    $tmp_el.remove();

    return ret;
  }

  return {
      viewport    : viewport
    , dimensions  : dimensions
    , sample      : sample
  };
});
