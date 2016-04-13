define([
  'lib/underscore',
  'lib/jquery',
  'lib/backbone',
], function (_, $, Backbone) {
  var View = Backbone.View.extend({
    events: {
      'click th': 'thClick',
      'click td': 'tdClick',
      'change td>input.grid-text-input': 'editableStringChange',
    },

    initialize: function (options) {
      _.bindAll(this, 'update', 'thClick', 'tdClick', 'dataFor');

      this.options = _.extend(this.options, options);

      // TODO [akamel] rename? this isn't a backbone data obj?
      this.data = undefined;

      this.container = options.container;
      this.grid = options.grid;

      this.renderers = _.map(this.options.renderers, function (Renderer) {
        return new Renderer({ layout: this });
      }.bind(this));

      // TODO [akamel] make this conditional if these renderes are enabled
      this.onViewPortChange = this.onViewPortChange.bind(this);
      this.listenTo(this.container, 'scroll:container', this.onViewPortChange);
      this.listenTo(this.container, 'resize:container', this.onViewPortChange);
    },

    onViewPortChange: function () {
      this.scheduleDraw();
    },

    remove: function () {
      this.container.stopListening(this.container);
      Backbone.View.prototype.remove.apply(this, arguments);
    },

    thClick: function (e) {
      var arg = this.dataFor(e.currentTarget);

      if (arg.column) {
        this.trigger('click:header', e, arg);
      }
    },

    tdClick: function (e) {
      var arg = this.dataFor(e.currentTarget);

      if (arg.column) {
        this.trigger('click:cell', e, arg);
      }
    },

    editableStringChange: function (e) {
      var arg = this.dataFor(e.currentTarget);
      var colEditableStr = this.grid.projection.get('column.editable.string');

      if (arg.column) {
        if (_.isObject(colEditableStr) && !_.isUndefined(colEditableStr[arg.property])) {
          this.grid.projection.get('projection:column-editable-string').trigger('change:string', e, arg);
        } else {
          this.trigger('change:editable.string', e, arg);
        }
      }
    },

    dataFor: function (el) {
      if (!$.contains(this.el, el)) {
        return undefined;
      }

      var $el = $(el);
      // TODO [akamel] can we use target instead?
      var $tr = $el.closest('tr', this.el);
      var $closestTD = $el.closest('td', this.el);
      var $closestTH = $el.closest('th', this.el);
      var $td = _.size($closestTD) ? $closestTD : $closestTH;
      var virtualizer = this.getRenderer('virtualization');
      var i = $tr.index() + (virtualizer ? virtualizer.first : 0);
      var j = $td.index();
      // TODO [akamel] 1- check if $td is th; 2- throw if el is neither th or td as it is assumed in this function
      var isHeader = $td.closest('thead', this.el).length;
      var ret = { header: isHeader };

      // we are not in header
      if (!isHeader) {
        ret.model = this.data.value[i];
      }
      if (isHeader && i === 0) {
        ret.property = this.data.select[j];
      } else if (isHeader && i === 1) {
        ret.property = this.data.subSelect[j];
      } else {
        ret.property = this.data.selectExpand[j];
      }

      ret.column = this.data.columns[ret.property];
      if (ret.property === this.grid.projection.get('column.checked')) {
        // TODO [akamel] this shouldn't be here
        var checkbox = $el.find('.column-checkbox');
        if (checkbox.length) {
          ret.checked = checkbox[0].checked;
        }
      }
      ret.grid = this.grid;

      return ret;
    },

    // TODO [akamel] [perf] 8.5%
    toHTML: function (value) {
      var data = _.defaults({ value: value }, this.data);

      _.each(data.columns, function (col) {
        if (_.isObject(col.$metadata)) {
          if (_.has(col.$metadata['attr.head'], 'class') && _.isArray(col.$metadata['attr.head'].class)) {
            col.$metadata['attr.head'].class = col.$metadata['attr.head'].class.join(' ');
          }

          if (_.has(col.$metadata['attr.body'], 'class') && _.isArray(col.$metadata['attr.body'].class)) {
            col.$metadata['attr.body'].class = col.$metadata['attr.body'].class.join(' ');
          }

         // TODO [akamel] merge attr that are on $metadata['attr']
        }
      });

      return this.options.template(data);
    },

    update: function (model) {
      _.each(this.renderers, function (renderer) {
        renderer.update && renderer.update();
      });

      // TODO [akamel] consider moving this to a projection
      var value = model.get('value');
      // TODO [akamel] is this overriding the values we got from the projection //see column extend below
      var columns = model.get('columns');
      var colOptions = this.options.columns || {};
      var orderby = {};

      _.each(this.grid.projection.get('orderby'), function (element, index) {
        var key = _.first(_.keys(element));
        orderby[key] = {
          dir: element[key],
          index: index,
        };
      });

      _.each(columns, function (col, property) {
      // TODO [akamel] consider filtering which props to copy/override
        var delta = {};
        if (orderby[property]) {
          delta.$orderby = orderby[property];
        }

        columns[property] = _.extend(col, colOptions[property], delta);
      });

      if (_.has(this.options.$metadata, 'class') && _.isArray(this.options.$metadata.class)) {
        this.options.$metadata.class = this.options.$metadata.class.join(' ');
      }

      var delta = {
        'value': value,
        'columns': columns,
        'columns.lookup': _.indexBy(columns, function (col) {
          return col.property;
        }),
        '$metadata': this.options.$metadata,
      };

      this.data = _.defaults(delta, model.toJSON());

      this.draw({ canSkipDraw: false });
    },

    scheduleDraw: function () {
      if (!this.scheduledDraw) {
        this.scheduledDraw = true;

        window.requestAnimationFrame(function () {
          this.scheduledDraw = false;
          this.draw();
        }.bind(this));
      }
    },

    drawable: function () {
      return this.data;
    },

    getRenderer: function (name) {
      return _.find(this.renderers, function (r) {
        return r.name === name;
      });
    },

    draw: function (options) {
      if (!this.drawable()) {
        return;
      }

      this.trigger('render:beginning');

      var renderers = this.renderers;
      var i = 0;

      var middleware = function (data, cb) {
        var r = renderers[i++];
        if (r) {
          var clone = _.defaults({}, data, { css: {} });
          delete clone.canSkipDraw;

          r.draw(clone, _.once(function (err, res) {
            res.canSkipDraw = data.canSkipDraw === true && res.canSkipDraw === true;
            if (err) {
              cb(err);
            } else {
              middleware(res || clone, cb);
            }
          }));
        } else {
          cb(undefined, data);
        }
      };

      var canSkipDraw = _.has(options, 'canSkipDraw') ? options.canSkipDraw : true;

      // this is _not_ and _cannot_ be async
      middleware({ rows: this.data.value, canSkipDraw: canSkipDraw }, function (err, res) {
        res.css && this.$el.css(res.css);

        if (err) {
          throw err;
        }

        if (res.canSkipDraw !== true) {
          this.el.innerHTML = this.toHTML(res.rows);
        }
      }.bind(this));

      this.trigger('render:finished');
    },

    render: function () {
      this.grid.on('change:data', this.update);

      // this.grid.projection.data.on('change', this.update);
    },
  });

  View.partial = function (options) {
    return View.extend({ options: options });
  };

  return View;
});
