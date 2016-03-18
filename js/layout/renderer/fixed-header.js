define([
      'lib/jquery'
    , 'lib/underscore'
    , 'component/grid/layout/measure'
    , 'component/grid/layout/px'
  ],
function($, _, measure, px){
  function Renderer(options) {
    this.options = options || {};

    this.name = 'fixed-header';
    this.layout = this.options.layout;
  }


  Renderer.prototype.draw = function(data, cb) {
    data.vp_measures = data.vp_measures = measure.viewport.call(this.layout);
    if (data.vp_measures.top > 0) {
      var $el = this.layout.$el;

      // todo [akamel] assumes we have table rendered; measure/estimate otherwise

      // a. compensate for header displacement
      // .. as we set 'thead > tr' css position 'fixed'
      var displacement = $el.find('thead tr').outerHeight();
      _.extend(data.css, {
          'padding-top'     : px.pixelify(px.parse(data.css['padding-top']) + displacement)
      });

      data.can_skip_draw = true;

      // b. yield to render
      cb(undefined, data);

      // c. get newly rendered header
      var $thead    = $el.find('thead')
        , $head_td  = $el.find('thead > tr').children()
        , $body_td  = $el.find('tbody > tr:first-child').children()
        ;

      var $ref      = $body_td
        , $target   = $head_td
        ;

      // d. capture header col computed width
      // todo [akamel] [perf] 16%
      this.col_width = this.col_width || _.map($ref, function(td){
        return $(td).width();
      });

      // todo [akamel] [perf] 12% -- consider replacing with css rule generation
      // e. freeze column width
      // e.1 freeze col width
      _.each($target, function(td, index){
        $(td).width(px.pixelify(this.col_width[index]));
      }.bind(this));

      _.each($ref, function(td, index){
        $(td).width(px.pixelify(this.col_width[index]));
      }.bind(this));

      // f. set position 'fixed' and lock header at top of table
      $thead.find('tr').css({
          'position'      : 'fixed'
        , 'top'           : '0px'
        , 'display'       : 'flex'
        , 'margin-left'          : px.pixelify(-data.vp_measures.offset_left)
      });
    } else {
      _.extend(data.css, {
          'padding-top'     : px.pixelify(px.parse(data.css['padding-top']))
      });

      cb(undefined, data);
    }
  }

  Renderer.partial = function(options) {
    return function(o) {
      return new Renderer(_.defaults({}, o, options));
    };
  };

  return Renderer;
});
