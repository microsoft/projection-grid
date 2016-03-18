define([
      'lib/underscore'
    , 'lib/jquery'
    , 'lib/backbone'
  ],
function(_, $, Backbone){

  var View = Backbone.View.extend({
    events: {
      'click th'                        : 'th_click',
      'click td'                        : 'td_click',
      'change td>input.grid-text-input' : 'editable_string_change'
    },

    initialize: function(options) {
      _.bindAll(this, 'update', 'th_click', 'td_click', 'dataFor');

      this.options = _.extend(this.options, options);

      // todo [akamel] rename? this isn't a backbone data obj?
      this.data = undefined;

      this.grid = options.grid;

      this.renderers = _.map(this.options.renderers, function(Renderer){
        return new Renderer({ layout : this });
      }.bind(this));

      // todo [akamel] make this conditional if these renderes are enabled
      $(window).on('scroll resize', function(){
        this.schedule_draw();
      }.bind(this));
    },

    th_click: function(e) {
      var arg = this.dataFor(e.currentTarget);

      if (arg.column) {
        this.trigger('click:header', e, arg);
      }
    },

    td_click: function(e) {
      var arg = this.dataFor(e.currentTarget);

      if (arg.column) {
        this.trigger('click:cell', e, arg);
      }
    },

    editable_string_change: function(e) {
      var arg = this.dataFor(e.currentTarget)
      , colEditableStr = this.grid.projection.get('column.editable.string');

      if (arg.column) {
        if (_.isObject(colEditableStr) && !_.isUndefined(colEditableStr[arg.property])) {
          this.grid.projection.get('projection:column-editable-string').trigger('change:string', e, arg);
        } else {
          this.trigger('change:editable.string', e, arg);
        }
      }
    },

    dataFor: function(el) {
      if (!$.contains(this.el, el)) {
        return undefined;
      }

      var $el               = $(el)
          // todo [akamel] can we use target instead?
        , $tr               = $el.closest('tr', this.el)
        , $closest_td       = $el.closest('td', this.el)
        , $closest_th       = $el.closest('th', this.el)
        , $td               = _.size($closest_td) ? $closest_td : $closest_th
        , virtualizer       = this.get_renderer('virtualization')
        , i                 = $tr.index() + (virtualizer? virtualizer.first : 0)
        , j                 = $td.index()
          // todo [akamel] 1- check if $td is th; 2- throw if el is neither th or td as it is assumed in this function
        , isHeader          = !!$td.closest('thead', this.el).length
        , ret               = {
              header : isHeader
          }
        ;

      // we are not in header
      if (!isHeader) {
        ret.model   = this.data.value[i];
      }

      ret.column = this.data.columns[j];
      ret.property = this.data.columns[j].property;
      if (ret.property === this.grid.projection.get('column.checked')) {
        // todo [akamel] this shouldn't be here
        var checkbox = $el.find('.column-checkbox');
        if (checkbox.length) {
          ret.checked = checkbox[0].checked;
        }
      }

      return ret;
    },

    // todo [akamel] [perf] 8.5%
    toHTML: function(value) {
      var data  = _.defaults({ 'value' : value }, this.data);

      _.each(data.columns, function(col){
        if (_.isObject(col.$metadata)) {
          if (_.has(col.$metadata['attr.head'], 'class') && _.isArray(col.$metadata['attr.head']['class'])) {
            col.$metadata['attr.head']['class'] = col.$metadata['attr.head']['class'].join(' ');
          }

          if (_.has(col.$metadata['attr.body'], 'class') && _.isArray(col.$metadata['attr.head']['class'])) {
            col.$metadata['attr.head']['class'] = col.$metadata['attr.head']['class'].join(' ');
          }

         // todo [akamel] merge attr that are on $metadata['attr']
        }
      });

      return this.options.template(data);
    },

    update: function(model) {
      _.each(this.renderers, function(renderer){
        renderer.update && renderer.update();
      });

      // todo [akamel] consider moving this to a projection
      var value         = model.get('value')
        // todo [akamel] is this overriding the values we got from the projection //see column extend below
        , columns       = model.get('columns') || _.map(model.get('select'), function(i){ return { property : i }; })
        , col_options   = this.options.columns || {}
        , orderby       = {}
        ;

      _.each(this.grid.projection.get('orderby'), function(element, index, list){
        var key = _.first(_.keys(element));
        orderby[key] = {
            dir   : element[key]
          , index : index
        };
      });

      columns = _.filter(columns, function(col) {
        return col.property.charAt(0) !== '$';
      });

      columns = _.map(columns, function(col) {
        // todo [akamel] consider filtering which props to copy/override
        var delta = {};
        if (orderby[col.property]) {
          delta.$orderby = orderby[col.property];
        }

        return _.extend(col, col_options[col.property], delta);
      });

      var delta = {
          'value'                 : value
        , 'columns'               : columns
        , 'columns.lookup'        : _.indexBy(columns, function(col) { return col.property; })
      };

      this.data = _.defaults(delta, model.toJSON());

      this.draw({ can_skip_draw : false });
    },

    schedule_draw: function() {
      if (!this.__scheduled_draw) {
        this.__scheduled_draw = true;

        window.requestAnimationFrame(function(){
          this.__scheduled_draw = false;
          this.draw();
        }.bind(this));
      }
    },

    drawable: function() {
      return !!this.data;
    },

    get_renderer: function(name) {
      return _.find(this.renderers, function(r){ return r.name === name; });
    },

    draw: function(options) {
      if (!this.drawable()) {
        return;
      }

      this.trigger('render:beginning');

      var renderers = this.renderers
        , i         = 0
        ;

      var middleware = function(data, cb){
        var r = renderers[i++];
        if (!r) {
          cb(undefined, data);
        } else {
          var clone = _.defaults({}, data, { css : {} });
          delete clone.can_skip_draw;

          r.draw(clone, _.once(function(err, res){
            res.can_skip_draw = data.can_skip_draw === true && res.can_skip_draw === true;
            if (err) {
              cb(err);
            } else {
              middleware(res || clone, cb);
            }
          }));
        }
      }

      var can_skip_draw = _.has(options, 'can_skip_draw')? options.can_skip_draw : true;

      // this is _not_ and _cannot_ be async
      middleware({ rows : this.data.value, can_skip_draw : can_skip_draw }, function(err, res){
        res.css && this.$el.css(res.css);

        if (res.can_skip_draw !== true) {
          this.el.innerHTML = this.toHTML(res.rows);
        }
      }.bind(this));

      this.trigger('render:finished');
    },

    render: function() {
      this.grid.on('change:data', this.update);

      // this.grid.projection.data.on('change', this.update);
    }
  });

  View.partial = function(options) {
    return View.extend({
        options : options
    });
  };

  return View;
});
