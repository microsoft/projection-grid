define([
  'lib/jquery',
  'lib/underscore',
], function ($, _) {
  function viewport(el) {
    var $el = el ? $(el) : this.$el;

    // todo [akamel] this would assume that only window has a scrollbar
    var $viewport = $(window);

    var viewportTop = $viewport.scrollTop();
    var viewportBottom = viewportTop + $viewport.height();
    var viewportLeft = $viewport.scrollLeft();

    var boundsTop = $el.offset().top;
    var boundsBottom = boundsTop + $el.innerHeight();
    // var boundsLeft = $el.offset().left;

    var visibleTop = Math.max(boundsTop, viewportTop);
    var visibleBottom = Math.min(boundsBottom, viewportBottom);
    // var visibleLeft = Math.max(boundsLeft, viewportLeft);

    return {
      top: visibleTop - boundsTop,
      bottom: visibleBottom - boundsTop,
      offsetLeft: viewportLeft,
    };
  }

  function dimensions(el) {
    var $el = el ? $(el) : this.$el;

    // calculate heights
    // a. header
    var ret = {
      rows: [],
      thead: $el.find('thead > tr').outerHeight(),
    };

    // b. keep row info
    $el.find('tbody').children('tr').each(function () {
      ret.rows.push($(this).outerHeight());
    });

    // c. update average row height
    var avg = _.reduce(ret.rows, function (memo, num) {
      return memo + num;
    }, 0) / (ret.rows.length === 0 ? 1 : ret.rows.length);

    ret.avgRowHeight = avg;
    ret.estimateHeight = (_.size(this.data.value) * avg) + ret.thead;

    return ret;
  }

  function sample() {
    // a. render test pass
    var $tmpEl = $('<div style="visibility:hidden" />');
    var sample = _.first(this.data.value, 20);

    this.$el.append($tmpEl);

    $tmpEl[0].innerHTML = this.toHTML(sample);

    // b. take measures
    var ret = dimensions.call(this, $tmpEl);

    // c. clean-up
    $tmpEl.remove();

    return ret;
  }

  return {
    viewport: viewport,
    dimensions: dimensions,
    sample: sample,
  };
});
