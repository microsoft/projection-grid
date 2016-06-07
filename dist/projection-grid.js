(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("jquery"), require("backbone"), require("bluebird"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "jquery", "backbone", "bluebird"], factory);
	else if(typeof exports === 'object')
		exports["projection-grid"] = factory(require("underscore"), require("jquery"), require("backbone"), require("bluebird"));
	else
		root["projection-grid"] = factory(root["underscore"], root["jquery"], root["backbone"], root["bluebird"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_31__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _gridFactory = __webpack_require__(1);
	
	var _gridFactory2 = _interopRequireDefault(_gridFactory);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = {
	  GridView: __webpack_require__(55),
	  projections: __webpack_require__(17),
	  layout: __webpack_require__(4),
	  factory: _gridFactory2.default
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	exports.default = function () {
	  return new GridFactory();
	};
	
	var _underscore = __webpack_require__(2);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _renderersPlugin = __webpack_require__(3);
	
	var _renderersPlugin2 = _interopRequireDefault(_renderersPlugin);
	
	var _projectionPlugin = __webpack_require__(16);
	
	var _projectionPlugin2 = _interopRequireDefault(_projectionPlugin);
	
	var _gridViewPlugin = __webpack_require__(54);
	
	var _gridViewPlugin2 = _interopRequireDefault(_gridViewPlugin);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var configPlugin = function configPlugin(definePlugin) {
	  return definePlugin('config', [], function () {
	    return this.config;
	  });
	};
	
	var GridFactory = function () {
	  function GridFactory() {
	    _classCallCheck(this, GridFactory);
	
	    this.pluginIndex = {};
	    this.plugins = [];
	    this.use(configPlugin).use(_projectionPlugin2.default).use(_renderersPlugin2.default).use(_gridViewPlugin2.default);
	  }
	
	  _createClass(GridFactory, [{
	    key: 'definePlugin',
	    value: function definePlugin(name, deps, callback) {
	      var _this = this;
	
	      var plugin = { name: name, deps: deps, callback: callback };
	
	      this.pluginIndex[name] = plugin;
	      this.plugins.push(plugin);
	      _underscore2.default.each(deps, function (dep) {
	        if (!_underscore2.default.has(_this.pluginIndex, dep)) {
	          throw new Error('unresolved plugin dependency ' + name + ' -> ' + dep);
	        }
	      });
	    }
	  }, {
	    key: 'use',
	    value: function use(callback) {
	      callback(this.definePlugin.bind(this));
	      return this;
	    }
	  }, {
	    key: 'create',
	    value: function create(config) {
	      return _underscore2.default.reduce(this.plugins, function (result, _ref) {
	        var name = _ref.name;
	        var deps = _ref.deps;
	        var callback = _ref.callback;
	        return _underscore2.default.extend(result, _defineProperty({}, name, callback.apply(result, _underscore2.default.map(deps, function (dep) {
	          return result[dep];
	        }))));
	      }, { config: config });
	    }
	  }]);
	
	  return GridFactory;
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _index = __webpack_require__(4);
	
	var _index2 = _interopRequireDefault(_index);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (definePlugin) {
	  return definePlugin('renderers', ['config'], function (config) {
	    var renderers = [];
	
	    if (config.scrollable) {
	      if (config.scrollable.virtual) {
	        renderers.push(_index2.default.renderers.Virtualization);
	      }
	      if (config.scrollable.fixedHeader) {
	        renderers.push(_index2.default.renderers.FixedHeader);
	      }
	    }
	
	    return renderers;
	  });
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	  TableLayout: __webpack_require__(5),
	  templates: {
	    table: __webpack_require__(8)
	  },
	  renderers: __webpack_require__(11)
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(6), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, $, Backbone) {
	  var View = Backbone.View.extend({
	    events: {
	      'click th': 'thClick',
	      'click td': 'tdClick',
	      'change td>input.grid-text-input': 'editableStringChange'
	    },
	
	    initialize: function initialize(options) {
	      _.bindAll(this, 'update', 'thClick', 'tdClick', 'dataFor');
	
	      this.options = _.extend(this.options, options);
	
	      // TODO [akamel] rename? this isn't a backbone data obj?
	      this.data = undefined;
	
	      this.container = options.container;
	      this.grid = options.grid;
	
	      this.renderers = _.map(this.options.renderers, function (Renderer) {
	        return new Renderer({ layout: this });
	      }.bind(this));
	
	      this.subviews = [];
	
	      // TODO [akamel] make this conditional if these renderes are enabled
	      this.onViewPortChange = this.onViewPortChange.bind(this);
	      this.listenTo(this.container, 'scroll:container', this.onViewPortChange);
	      this.listenTo(this.container, 'resize:container', this.onViewPortChange);
	    },
	
	    onViewPortChange: function onViewPortChange() {
	      this.scheduleDraw();
	    },
	
	    removeSubviews: function removeSubviews() {
	      _.each(this.subviews, function (subview) {
	        subview.remove();
	      });
	      this.subviews = [];
	    },
	
	    remove: function remove() {
	      this.removeSubviews();
	      this.container.stopListening(this.container);
	      Backbone.View.prototype.remove.apply(this, arguments);
	    },
	
	    thClick: function thClick(e) {
	      var arg = this.dataFor(e.currentTarget);
	
	      if (arg.column) {
	        this.trigger('click:header', e, arg);
	      }
	    },
	
	    tdClick: function tdClick(e) {
	      var arg = this.dataFor(e.currentTarget);
	
	      if (arg.column) {
	        this.trigger('click:cell', e, arg);
	      }
	    },
	
	    editableStringChange: function editableStringChange(e) {
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
	
	    dataFor: function dataFor(el) {
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
	      if (isHeader) {
	        if (i === 0) {
	          ret.property = this.data.select[j];
	        } else if (i === 1) {
	          ret.property = this.data.subSelect[j];
	        } else {
	          ret.property = this.data.selectExpand[j];
	        }
	      } else {
	        ret.model = this.data.value[i];
	        if (this.data.selectExpand) {
	          ret.property = this.data.selectExpand[j];
	        } else {
	          ret.property = this.data.select[j];
	        }
	      }
	
	      ret.column = this.data.columns[ret.property];
	      if (ret.property === this.grid.projection.get('column.checked')) {
	        // TODO [akamel] this shouldn't be here
	        var checkbox = $el.find('.column-selection');
	        if (checkbox.length) {
	          ret.checked = checkbox[0].checked;
	        }
	      }
	      ret.grid = this.grid;
	
	      return ret;
	    },
	
	    // TODO [akamel] [perf] 8.5%
	    toHTML: function toHTML(value) {
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
	
	    update: function update(model) {
	      _.each(this.renderers, function (renderer) {
	        renderer.update && renderer.update();
	      });
	
	      var value = model.get('value');
	      var columns = model.get('columns');
	      var columnsDelta = {};
	      var colOptions = this.options.columns || {};
	      var orderby = {};
	
	      _.each(this.grid.projection.get('orderby'), function (element, index) {
	        var key = _.first(_.keys(element));
	        orderby[key] = {
	          dir: element[key],
	          index: index
	        };
	      });
	
	      _.each(columns, function (col, property) {
	        // TODO [akamel] consider filtering which props to copy/override
	        var delta = {};
	        var colOption = colOptions[property];
	        var orderName = property;
	
	        if (colOption && _.isString(colOption.sortable)) {
	          orderName = colOption.sortable;
	        } else if (col && _.isString(col.sortable)) {
	          orderName = col.sortable;
	        }
	
	        if (orderby[orderName]) {
	          delta.$orderby = orderby[orderName];
	        }
	
	        columnsDelta[property] = _.defaults(delta, colOption, col);
	      });
	
	      if (_.has(this.options.$metadata, 'class') && _.isArray(this.options.$metadata.class)) {
	        this.options.$metadata.class = this.options.$metadata.class.join(' ');
	      }
	
	      var delta = {
	        'value': value,
	        'columns': columnsDelta,
	        'columns.lookup': _.indexBy(columns, function (col) {
	          return col.property;
	        }),
	        '$metadata': this.options.$metadata,
	        'hideHeaders': this.options.hideHeaders
	      };
	
	      this.data = _.defaults(delta, model.toJSON());
	
	      this.draw({ canSkipDraw: false });
	    },
	
	    scheduleDraw: function scheduleDraw() {
	      if (!this.scheduledDraw) {
	        this.scheduledDraw = true;
	
	        window.requestAnimationFrame(function () {
	          this.scheduledDraw = false;
	          this.draw();
	        }.bind(this));
	      }
	    },
	
	    drawable: function drawable() {
	      return this.data;
	    },
	
	    getRenderer: function getRenderer(name) {
	      return _.find(this.renderers, function (r) {
	        return r.name === name;
	      });
	    },
	
	    draw: function draw(options) {
	      if (!this.drawable()) {
	        return;
	      }
	
	      this.trigger('render:beginning');
	
	      var renderers = this.renderers;
	      var i = 0;
	
	      var middleware = function middleware(data, cb) {
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
	
	        this.removeSubviews();
	
	        if (res.canSkipDraw !== true) {
	          this.el.innerHTML = this.toHTML(res.rows);
	        }
	
	        _.each(this.data.columns, function (column) {
	          if (column.config) {
	            if (_.isFunction(column.config.View)) {
	              this.$('td.col-' + column.config.name).each(function (index, el) {
	                var cellView = new column.config.View({ model: this.dataFor(el).model });
	                this.$(el).html(cellView.render().el);
	                this.subviews.push(cellView);
	              }.bind(this));
	            }
	            if (_.isFunction(column.config.HeaderView)) {
	              this.$('th.col-' + column.config.name).each(function (index, el) {
	                var headerView = new column.config.HeaderView();
	                this.$(el).html(headerView.render().el);
	                this.subviews.push(headerView);
	              }.bind(this));
	            }
	          }
	        }, this);
	      }.bind(this));
	
	      this.trigger('render:finished');
	    },
	
	    render: function render() {
	      this.grid.on('change:data', this.update);
	
	      // this.grid.projection.data.on('change', this.update);
	    }
	  });
	
	  View.partial = function (options) {
	    return View.extend({ options: options });
	  };
	
	  return View;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(9);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function ($metadata, columns, hideHeaders, isApplyGroup, subSelect, undefined, value) {
	jade_mixins["columnHeader"] = jade_interp = function(column){
	var block = (this && this.block), attributes = (this && this.attributes) || {};
	if ( column.$orderby)
	{
	if ( column.$orderby.dir > 0)
	{
	buf.push("<span class=\"grid-asc\"></span>");
	}
	else
	{
	buf.push("<span class=\"grid-des\"></span>");
	}
	}
	if ( (column && column.$html))
	{
	buf.push(null == (jade_interp = column.$html) ? "" : jade_interp);
	}
	else
	{
	buf.push(jade.escape(null == (jade_interp = (typeof column.$text != 'undefined')? column.$text : (column.property || column)) ? "" : jade_interp));
	}
	};
	jade_mixins["th"] = jade_interp = function(column, hasGroup, isSubColumn){
	var block = (this && this.block), attributes = (this && this.attributes) || {};
	var attr = (column.$metadata || {})['attr.head'] || {}
	var colName = column.config && column.config.name || '';
	var cls = [];
	if ( (colName))
	{
	cls.push('col-' + colName);
	}
	if ( column.sortable)
	{
	cls.push('sortable');
	}
	if ( column.$orderby)
	{
	cls.push('orderby');
	}
	cls = cls.join(' ');
	if ( isSubColumn )
	{
	var colspan = 1, rowspan = 1;
	buf.push("<th" + (jade.attrs(jade.merge([{"colspan": jade.escape(colspan),"rowspan": jade.escape(rowspan),"class": (jade_interp = [true], jade.joinClasses([cls].map(jade.joinClasses).map(function (cls, i) {   return jade_interp[i] ? jade.escape(cls) : cls })))},attributes,attr]), true)) + ">");
	jade_mixins["columnHeader"](column);
	buf.push("</th>");
	}
	else if ( hasGroup && column.groupExpansion)
	{
	var colspan = column.group.length, rowspan = 1;
	buf.push("<th" + (jade.attrs(jade.merge([{"colspan": jade.escape(colspan),"rowspan": jade.escape(rowspan),"class": (jade_interp = [true], jade.joinClasses([cls].map(jade.joinClasses).map(function (cls, i) {   return jade_interp[i] ? jade.escape(cls) : cls })))},attributes,attr]), true)) + "><span class=\"pop-collapse glyphicon glyphicon-minus\"></span><div>");
	jade_mixins["columnHeader"](column);
	buf.push("</div></th>");
	}
	else if ( hasGroup && column.group)
	{
	var colspan = 1, rowspan = 2;
	buf.push("<th" + (jade.attrs(jade.merge([{"colspan": jade.escape(colspan),"rowspan": jade.escape(rowspan),"class": (jade_interp = [true], jade.joinClasses([cls].map(jade.joinClasses).map(function (cls, i) {   return jade_interp[i] ? jade.escape(cls) : cls })))},attributes,attr]), true)) + "><span class=\"pop-expand glyphicon glyphicon-plus\"></span><div>");
	jade_mixins["columnHeader"](column);
	buf.push("</div></th>");
	}
	else
	{
	var colspan = 1, rowspan = 2;
	buf.push("<th" + (jade.attrs(jade.merge([{"colspan": jade.escape(colspan),"rowspan": jade.escape(rowspan),"class": (jade_interp = [true], jade.joinClasses([cls].map(jade.joinClasses).map(function (cls, i) {   return jade_interp[i] ? jade.escape(cls) : cls })))},attributes,attr]), true)) + ">");
	jade_mixins["columnHeader"](column);
	buf.push("</th>");
	}
	};
	jade_mixins["td"] = jade_interp = function(row, column){
	var block = (this && this.block), attributes = (this && this.attributes) || {};
	var attr = (column.$metadata || {})['attr.body'] || {}
	var colName = column.config && column.config.name || '';
	var cls = colName ? 'col-' + colName : '';
	buf.push("<td" + (jade.attrs(jade.merge([{"class": (jade_interp = [true], jade.joinClasses([cls].map(jade.joinClasses).map(function (cls, i) {   return jade_interp[i] ? jade.escape(cls) : cls })))},attributes,attr]), true)) + ">");
	var res = row[column.property]
	if ( (res && res.$html))
	{
	buf.push(null == (jade_interp = res.$html) ? "" : jade_interp);
	}
	else
	{
	buf.push(jade.escape(null == (jade_interp = res) ? "" : jade_interp));
	}
	buf.push("</td>");
	};
	buf.push("<table" + (jade.attrs(jade.merge([{"class": "table table-hover grid"},$metadata || {}]), true)) + ">");
	if ( !hideHeaders)
	{
	buf.push("<thead>");
	if ( isApplyGroup && subSelect.length === 0)
	{
	buf.push("<tr class=\"table__row--header\">");
	// iterate locals['select'] || []
	;(function(){
	  var $$obj = locals['select'] || [];
	  if ('number' == typeof $$obj.length) {
	
	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var columnName = $$obj[$index];
	
	jade_mixins["th"](columns[columnName], true);
	    }
	
	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var columnName = $$obj[$index];
	
	jade_mixins["th"](columns[columnName], true);
	    }
	
	  }
	}).call(this);
	
	buf.push("</tr>");
	}
	else if ( isApplyGroup)
	{
	buf.push("<tr class=\"table__row--header\">");
	// iterate locals['select'] || []
	;(function(){
	  var $$obj = locals['select'] || [];
	  if ('number' == typeof $$obj.length) {
	
	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var columnName = $$obj[$index];
	
	jade_mixins["th"](columns[columnName], true);
	    }
	
	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var columnName = $$obj[$index];
	
	jade_mixins["th"](columns[columnName], true);
	    }
	
	  }
	}).call(this);
	
	buf.push("</tr><tr class=\"table__row--header table__row--sub-header\">");
	// iterate locals['subSelect']
	;(function(){
	  var $$obj = locals['subSelect'];
	  if ('number' == typeof $$obj.length) {
	
	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var columnName = $$obj[$index];
	
	jade_mixins["th"](columns[columnName], true, true);
	    }
	
	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var columnName = $$obj[$index];
	
	jade_mixins["th"](columns[columnName], true, true);
	    }
	
	  }
	}).call(this);
	
	buf.push("</tr>");
	}
	else
	{
	buf.push("<tr class=\"table__row--header\">");
	// iterate locals['select'] || []
	;(function(){
	  var $$obj = locals['select'] || [];
	  if ('number' == typeof $$obj.length) {
	
	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var columnName = $$obj[$index];
	
	jade_mixins["th"](columns[columnName]);
	    }
	
	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var columnName = $$obj[$index];
	
	jade_mixins["th"](columns[columnName]);
	    }
	
	  }
	}).call(this);
	
	buf.push("</tr>");
	}
	buf.push("</thead>");
	}
	buf.push("<tbody>");
	// iterate value
	;(function(){
	  var $$obj = value;
	  if ('number' == typeof $$obj.length) {
	
	    for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
	      var row = $$obj[i];
	
	var attr = (row.$metadata || {}).attr || {}
	buf.push("<tr" + (jade.attrs(jade.merge([{"class": "table__row--body"},attr]), true)) + ">");
	// iterate locals['selectExpand'] || locals.select
	;(function(){
	  var $$obj = locals['selectExpand'] || locals.select;
	  if ('number' == typeof $$obj.length) {
	
	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var columnName = $$obj[$index];
	
	jade_mixins["td"](row, columns[columnName]);
	    }
	
	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var columnName = $$obj[$index];
	
	jade_mixins["td"](row, columns[columnName]);
	    }
	
	  }
	}).call(this);
	
	buf.push("</tr>");
	    }
	
	  } else {
	    var $$l = 0;
	    for (var i in $$obj) {
	      $$l++;      var row = $$obj[i];
	
	var attr = (row.$metadata || {}).attr || {}
	buf.push("<tr" + (jade.attrs(jade.merge([{"class": "table__row--body"},attr]), true)) + ">");
	// iterate locals['selectExpand'] || locals.select
	;(function(){
	  var $$obj = locals['selectExpand'] || locals.select;
	  if ('number' == typeof $$obj.length) {
	
	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var columnName = $$obj[$index];
	
	jade_mixins["td"](row, columns[columnName]);
	    }
	
	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var columnName = $$obj[$index];
	
	jade_mixins["td"](row, columns[columnName]);
	    }
	
	  }
	}).call(this);
	
	buf.push("</tr>");
	    }
	
	  }
	}).call(this);
	
	buf.push("</tbody></table>");}.call(this,"$metadata" in locals_for_with?locals_for_with.$metadata:typeof $metadata!=="undefined"?$metadata:undefined,"columns" in locals_for_with?locals_for_with.columns:typeof columns!=="undefined"?columns:undefined,"hideHeaders" in locals_for_with?locals_for_with.hideHeaders:typeof hideHeaders!=="undefined"?hideHeaders:undefined,"isApplyGroup" in locals_for_with?locals_for_with.isApplyGroup:typeof isApplyGroup!=="undefined"?isApplyGroup:undefined,"subSelect" in locals_for_with?locals_for_with.subSelect:typeof subSelect!=="undefined"?subSelect:undefined,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined,"value" in locals_for_with?locals_for_with.value:typeof value!=="undefined"?value:undefined));;return buf.join("");
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */
	
	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];
	
	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }
	
	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }
	
	  return a;
	};
	
	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */
	
	function nulls(val) {
	  return val != null && val !== '';
	}
	
	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}
	
	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};
	
	
	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};
	
	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];
	
	  var keys = Object.keys(obj);
	
	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];
	
	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }
	
	  return buf.join('');
	};
	
	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */
	
	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;
	
	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}
	
	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};
	
	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */
	
	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(10).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);
	
	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');
	
	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};
	
	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	  FixedHeader: __webpack_require__(12),
	  Virtualization: __webpack_require__(15)
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(6), __webpack_require__(2), __webpack_require__(13), __webpack_require__(14)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, _, measure, px) {
	  function Renderer(options) {
	    this.options = options || {};
	
	    this.name = 'fixed-header';
	    this.layout = this.options.layout;
	  }
	
	  Renderer.prototype.draw = function (data, cb) {
	    data.vpMeasures = data.vpMeasures = measure.viewport.call(this.layout);
	    if (data.vpMeasures.top > 0) {
	      var $el = this.layout.$el;
	
	      // todo [akamel] assumes we have table rendered; measure/estimate otherwise
	
	      // a. compensate for header displacement
	      // .. as we set 'thead > tr' css position 'absolute'
	      var displacement = $el.find('thead tr').outerHeight();
	      _.extend(data.css, {
	        'padding-top': px.pixelify(px.parse(data.css['padding-top']) + displacement)
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
	
	      // f. set position 'fixed' and lock header at top of table
	      $thead.css({
	        'position': this.layout.container.el === window ? 'fixed' : 'absolute',
	        'top': px.pixelify(this.layout.container.el === window ? 0 : this.layout.container.$el.scrollTop()),
	        'margin-left': px.pixelify(-data.vpMeasures.offsetLeft),
	        'z-index': 1000
	      });
	    } else {
	      _.extend(data.css, {
	        'padding-top': px.pixelify(px.parse(data.css['padding-top']))
	      });
	
	      cb(undefined, data);
	    }
	  };
	
	  Renderer.partial = function (options) {
	    return function (o) {
	      return new Renderer(_.defaults({}, o, options));
	    };
	  };
	
	  return Renderer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(6), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, _) {
	    function viewport(el, container) {
	        var $el = el ? $(el) : this.$el;
	
	        container = container || this.container;
	        var $viewport = container.$el;
	
	        var viewportTop = $viewport.scrollTop();
	        var viewportBottom = viewportTop + $viewport.height();
	        var viewportLeft = $viewport.scrollLeft();
	
	        var boundsTop = container.offset($el).top;
	        var boundsBottom = boundsTop + $el.innerHeight();
	        // var boundsLeft = $el.offset().left;
	
	        var visibleTop = Math.max(boundsTop, viewportTop);
	        var visibleBottom = Math.min(boundsBottom, viewportBottom);
	        // var visibleLeft = Math.max(boundsLeft, viewportLeft);
	
	        return {
	            top: visibleTop - boundsTop,
	            bottom: visibleBottom - boundsTop,
	            offsetLeft: viewportLeft
	        };
	    }
	
	    function dimensions(el) {
	        var $el = el ? $(el) : this.$el;
	
	        // calculate heights
	        // a. header
	        var ret = {
	            rows: [],
	            thead: $el.find('thead > tr').outerHeight()
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
	        ret.estimateHeight = _.size(this.data.value) * avg + ret.thead;
	
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
	        sample: sample
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	// todo [akamel] move to /component
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	  function parse(a) {
	    return abs(parseFloat(a));
	  }
	
	  function abs(a) {
	    return _.isFinite(a) ? a : 0;
	  }
	
	  function pixelify(a) {
	    return abs(a) + 'px';
	  }
	
	  return {
	    parse: parse,
	    pixelify: pixelify
	  };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	// TODO [akamel] [bug] with large data set, jitters when scrolling to bottom
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(6), __webpack_require__(2), __webpack_require__(13), __webpack_require__(14)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, _, measure, px) {
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
	
	    return ret < count ? ret : -1;
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
	
	      // b.1 set height based on measures estimate
	      this.layout.$el.css({
	        'padding-top': px.pixelify(this.__measures.estimateHeight)
	      });
	    }
	
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
	    last = Math.min(last < 0 ? count - 1 : last, count - 1);
	
	    var pTop = estimateHeight.call(this, 0, first - 1);
	    var pBottom = estimateHeight.call(this, last + 1, count - 1);
	
	    data.rows = value.slice(first, last + 1);
	
	    _.extend(data.css, {
	      'padding-top': px.pixelify(pTop + px.parse(data.css['padding-top'])),
	      'padding-bottom': px.pixelify(pBottom + px.parse(data.css['padding-bottom']))
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
	
	    var heights = _.chain(value).map(function (row) {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _underscore = __webpack_require__(2);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _backbone = __webpack_require__(7);
	
	var _backbone2 = _interopRequireDefault(_backbone);
	
	var _index = __webpack_require__(17);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _utility = __webpack_require__(53);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var projectionConfigs = {
	  AggregateRow: function AggregateRow(config) {
	    var configAgg = {};
	
	    if (_underscore2.default.has(config.aggregate, 'top')) {
	      configAgg['aggregate.top'] = config.aggregate.top;
	    }
	
	    if (_underscore2.default.has(config.aggregate, 'bottom')) {
	      configAgg['aggregate.bottom'] = config.aggregate.bottom;
	    }
	
	    return configAgg;
	  },
	  JSData: function JSData(config) {
	    return {
	      'jsdata.entity': config.dataSource.resource,
	      'jsdata.query': config.dataSource.query,
	      'jsdata.options': config.dataSource.options
	    };
	  },
	  Map: function Map(config) {
	    var properties = _underscore2.default.reduce(config.columns, function (memo, _ref) {
	      var name = _ref.name;
	      var value = _ref.value;
	      var field = _ref.field;
	
	      memo[name] = value || function (item) {
	        return _underscore2.default.reduce((field || name).split('/'), function (memo, prop) {
	          return _underscore2.default.result(memo, prop);
	        }, item);
	      };
	      return memo;
	    }, {});
	
	    return {
	      map: function map(item) {
	        return _underscore2.default.reduce(config.columns, function (memo, _ref2) {
	          var name = _ref2.name;
	
	          memo[name] = properties[name](item);
	          return memo;
	        }, {});
	      }
	    };
	  },
	  Columns: function Columns(config) {
	    var columns = _underscore2.default.reduce(config.columns, function (columns, column) {
	      var $metadata = {};
	
	      if (column.attributes) {
	        $metadata['attr.body'] = column.attributes;
	      }
	
	      if (column.headerAttributes) {
	        $metadata['attr.head'] = column.headerAttributes;
	      }
	
	      columns[column.name] = {
	        sortable: column.sortable,
	        $metadata: $metadata,
	        config: column
	      };
	
	      return columns;
	    }, {});
	
	    if (config.selectable) {
	      columns.checkbox = {
	        config: { name: 'selection' }
	      };
	    }
	
	    if (_underscore2.default.has(config.columnShifter, 'totalColumns')) {
	      columns['column.skip.less'] = {
	        config: { name: 'skip-less' }
	      };
	      columns['column.skip.more'] = {
	        config: { name: 'skip-more' }
	      };
	    }
	
	    return { columns: columns };
	  },
	  ColumnI18n: function ColumnI18n(config) {
	    return {
	      'column.i18n': _underscore2.default.reduce(config.columns, function (columnI18n, column) {
	        columnI18n[column.name] = column.title || column.name;
	        return columnI18n;
	      }, {})
	    };
	  },
	  ColumnQueryable: function ColumnQueryable(config) {
	    var columnIn = _underscore2.default.chain(config.columns).reject(_underscore2.default.property('hidden')).map(_underscore2.default.property('name')).value();
	    var columnLock = _underscore2.default.chain(config.columns).filter(_underscore2.default.property('locked')).map(_underscore2.default.property('name')).value();
	    var colqConfig = {
	      'column.lock': columnLock,
	      'column.in': columnIn
	    };
	
	    if (config.selectable) {
	      columnIn.unshift('checkbox');
	      columnLock.unshift('checkbox');
	    }
	
	    if (_underscore2.default.has(config.columnShifter, 'totalColumns')) {
	      colqConfig['column.take'] = config.columnShifter.totalColumns;
	    }
	    return colqConfig;
	  },
	  ColumnShifter: function ColumnShifter() {},
	  ColumnTemplate: function ColumnTemplate(config) {
	    return {
	      'column.template': _underscore2.default.reduce(config.columns, function (columnTmpl, column) {
	        if (column.headerTemplate) {
	          columnTmpl[column.name] = column.headerTemplate;
	        }
	        return columnTmpl;
	      }, {})
	    };
	  },
	  Editable: function Editable(config) {
	    return {
	      'column.editable': _underscore2.default.chain(config.columns).filter(_underscore2.default.property('editable')).map(_underscore2.default.property('name')).value()
	    };
	  },
	  MemoryQueryable: function MemoryQueryable() {},
	  PropertyTemplate: function PropertyTemplate(config) {
	    return {
	      'property.template': _underscore2.default.reduce(config.columns, function (propTmpl, column) {
	        if (column.template) {
	          propTmpl[column.name] = column.template;
	        }
	        return propTmpl;
	      }, {})
	    };
	  },
	  RowIndex: function RowIndex() {},
	  RowCheckbox: function RowCheckbox(config) {
	    return {
	      'row.check.id': _underscore2.default.chain(config).result('dataSource').result('schema').result('key', 'rowIndex').value(),
	      'row.check.single': config.selectable === 'single',
	      'column.checked': 'checkbox',
	      'row.check.allow': function rowCheckAllow(model) {
	        var type = _underscore2.default.chain(model).result('$metadata').result('type').value();
	
	        return !_underscore2.default.contains(['segmentation', 'aggregate'], type);
	      }
	    };
	  },
	  Page: function Page(config) {
	    return {
	      'page.size': config.pageable.pageSize,
	      'page.number': 0
	    };
	  },
	  Sink: function Sink(config) {
	    var data = _underscore2.default.result(config.dataSource, 'data', []);
	
	    if (_underscore2.default.isArray(data)) {
	      return { seed: data };
	    } else if (data instanceof _backbone2.default.Collection) {
	      return { seed: data.toJSON() };
	    }
	  }
	};
	
	exports.default = function (definePlugin) {
	  return definePlugin('projection', ['config'], function (config) {
	    var projection = null;
	
	    function pipeProjection(name) {
	      var Projection = _index2.default[name];
	      var configProj = projectionConfigs[name](config);
	      var projectionDest = new Projection(configProj);
	
	      if (projection) {
	        projection = projection.pipe(projectionDest);
	      } else {
	        projection = projectionDest;
	      }
	    }
	
	    var dataSourceType = config.dataSource.type || 'memory';
	    if (dataSourceType === 'js-data') {
	      pipeProjection('JSData');
	    } else if (dataSourceType === 'memory') {
	      pipeProjection('Sink');
	      pipeProjection('MemoryQueryable');
	      if (config.dataSource.data instanceof _backbone2.default.Collection) {
	        (function () {
	          var updating = false;
	          var scheduleUpdate = function scheduleUpdate() {
	            if (!updating) {
	              updating = true;
	              window.setTimeout(function () {
	                projection.set('seed', config.dataSource.data.toJSON());
	                updating = false;
	              }, 0);
	            }
	          };
	          config.dataSource.data.on('all', scheduleUpdate);
	        })();
	      }
	    } else {
	      throw new Error('dataSource.type "' + config.dataSource.type + '" is not supported');
	    }
	
	    var dataSourceProjection = projection;
	
	    pipeProjection('Columns');
	    pipeProjection('Map');
	    if (config.aggregate) {
	      pipeProjection('AggregateRow');
	    }
	    pipeProjection('ColumnQueryable');
	    pipeProjection('ColumnI18n');
	
	    if (_underscore2.default.has(config.columnShifter, 'totalColumns')) {
	      pipeProjection('ColumnShifter');
	    }
	
	    pipeProjection('ColumnTemplate');
	    pipeProjection('PropertyTemplate');
	    if (config.selectable) {
	      pipeProjection('RowIndex');
	      pipeProjection('RowCheckbox');
	    }
	
	    if (_underscore2.default.has(config.pageable, 'pageSize')) {
	      pipeProjection('Page');
	    }
	    if (_underscore2.default.find(config.columns, _underscore2.default.property('editable'))) {
	      pipeProjection('Editable');
	    }
	
	    (0, _utility.delegateEvents)({
	      from: dataSourceProjection,
	      to: projection,
	      events: ['update:beginning', 'update:finished']
	    });
	
	    return projection;
	  });
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	  AggregateRow: __webpack_require__(18),
	  Base: __webpack_require__(19),
	  ColumnI18n: __webpack_require__(21),
	  ColumnQueryable: __webpack_require__(23),
	  ColumnShifter: __webpack_require__(24),
	  ColumnTemplate: __webpack_require__(25),
	  EditableString: __webpack_require__(26),
	  Editable: __webpack_require__(28),
	  JSData: __webpack_require__(37),
	  Map: __webpack_require__(38),
	  MemoryQueryable: __webpack_require__(39),
	  Memory: __webpack_require__(40),
	  Mock: __webpack_require__(41),
	  Odata: __webpack_require__(42),
	  Page: __webpack_require__(43),
	  PropertyTemplate: __webpack_require__(44),
	  RowCheckbox: __webpack_require__(45),
	  RowTriStateCheckboxProjection: __webpack_require__(47),
	  RowIndex: __webpack_require__(49),
	  Sink: __webpack_require__(50),
	  ColumnGroup: __webpack_require__(51),
	  Columns: __webpack_require__(52).default
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection) {
	  var createRows = function createRows(fn, data) {
	    var rows = fn(data);
	
	    _.each(rows, function (row) {
	      row.$metadata = _.extend({}, row.$metadata, { type: 'aggregate' });
	    });
	
	    return rows;
	  };
	
	  var Model = BaseProjection.extend({
	
	    defaults: {
	      'aggregate.top': null,
	      'aggregate.bottom': null
	    },
	
	    name: 'aggregate-row',
	
	    update: function update(options) {
	      var value, topFn, rowTop, bottomFn, rowBottom;
	
	      if (Model.__super__.update.call(this, options)) {
	        value = this.src.data.get('value');
	
	        if (value) {
	          topFn = this.get('aggregate.top');
	          bottomFn = this.get('aggregate.bottom');
	          rowTop = _.isFunction(topFn) ? createRows(topFn, this.src.data) : null;
	          rowBottom = _.isFunction(bottomFn) ? createRows(bottomFn, this.src.data) : null;
	
	          if (rowTop) {
	            value = _.flatten(rowTop).concat(value);
	          }
	
	          if (rowBottom) {
	            value = value.concat(_.flatten(rowBottom));
	          }
	
	          this.patch({
	            value: value
	          });
	        }
	      }
	    }
	
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, Response) {
	  var Model = Backbone.Model.extend({
	    initialize: function initialize() {
	      _.bindAll(this, 'onSrcUpdate', 'beforeSet', 'afterSet', 'update');
	      this.data = new Response();
	      this.src = undefined;
	      this.on('change', function (model) {
	        // todo [akamel] the model here is the settings model
	        this.update({ model: model });
	      }.bind(this));
	    },
	
	    constructor: function constructor() {
	      // used to figure out which options to set localy and which ones to pass down the pipe
	      this.localKeys = _.keys(this.defaults);
	      // todo [akamel] this might prevent us from overriding initialize
	      Model.__super__.constructor.apply(this, arguments);
	    },
	
	    pipe: function pipe(to) {
	      if (to) {
	        to.setSrc(this);
	      }
	
	      return to;
	    },
	
	    setSrc: function setSrc(src) {
	      this.src = src;
	      if (this.src) {
	        this.src.data.off('change', this.onSrcUpdate);
	        this.src.off('all', this.bubble);
	      }
	
	      if (this.src) {
	        this.src.data.on('change', this.onSrcUpdate);
	        this.src.on('all', this.bubble);
	      }
	
	      this.update();
	    },
	
	    patch: function patch(delta) {
	      var src = this.src ? this.src.data.toJSON() : {};
	      delta = _.isObject(delta) ? delta : {};
	
	      this.data.set(_.defaults(delta, this.attributes, src));
	    },
	
	    beforeSet: function beforeSet() /* local, other */{},
	    afterSet: function afterSet() {},
	
	    onSrcUpdate: function onSrcUpdate() /* model */{
	      this.update();
	    },
	    /* { model : model } */bubble: function bubble() {
	      var key = _.first(arguments);
	
	      if (_.has(this.events, key)) {
	        var fct = this[this.events[key]];
	        if (_.isFunction(fct)) {
	          fct.apply(this, _.rest(arguments));
	        }
	      }
	
	      // todo [akamel] can this result in multiple redraw calls?
	      if (this.src) {
	        this.src.bubble.apply(this.src, _.toArray(arguments));
	      }
	    },
	
	    update: function update(options) {
	      options = options || {};
	
	      if (this.src) {
	        if (options.deep) {
	          this.src.update(options);
	          return false;
	        }
	
	        return true;
	      }
	
	      return false;
	    }
	  });
	
	  Model.prototype.set = function (key, value, options) {
	    var obj = {};
	
	    if (_.isString(key)) {
	      obj[key] = value;
	    } else {
	      obj = key;
	      options = value;
	    }
	
	    var local = _.pick(obj, this.localKeys);
	    var other = _.omit(obj, this.localKeys);
	
	    this.beforeSet(local, other);
	
	    var ret = Model.__super__.set.call(this, local, options);
	
	    // todo [akamel] if we set options that span multiple data sources we will trigger change multiple times in the chain??
	    // pass along non-local options
	    if (_.size(other)) {
	      if (this.src) {
	        this.src.set(other, options);
	      }
	    }
	    this.afterSet();
	
	    return ret;
	  };
	
	  Model.keyRegex = /^([\w_\-$]+):(.+)$/;
	
	  Model.prototype.get = function (key) {
	    var match = Model.keyRegex.exec(key);
	
	    if (match) {
	      var type = match[1];
	      var name = match[2];
	
	      switch (type) {
	        case 'projection':
	          {
	            var p = this;
	            do {
	              if (p.name === name) {
	                return p;
	              }
	              p = p.src;
	            } while (p);
	            break;
	          }
	        default:
	          {
	            throw new Error('unknown special get key type');
	          }
	      }
	    } else {
	      var ret = Model.__super__.get.apply(this, arguments);
	
	      if (_.isUndefined(ret)) {
	        if (this.src) {
	          ret = this.src.get.apply(this.src, arguments);
	        }
	      }
	
	      return ret;
	    }
	  };
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone) {
	  return Backbone.Model.extend({
	    defaults: {
	      value: [],
	      select: null,
	      count: 0,
	      aggregate: []
	    }
	  });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19), __webpack_require__(22), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.i18n': {
	        '': function _(name) {
	          return name;
	        }
	      }
	    },
	    name: 'column-i18n',
	    beforeSet: function beforeSet(local) {
	      if (_.has(local, 'column.i18n')) {
	        if (!_.isObject(local['column.i18n'])) {
	          local['column.i18n'] = this.defaults['column.i18n'];
	        }
	      }
	    },
	    update: function update(options) {
	      // todo [akamel] when calling a deep update; suppress onchange event based updates
	      // Model.__super__.update.call(this, options);
	
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var colOptions = this.get('column.i18n');
	        var columns = model.get('columns') || {};
	        var $default = colOptions[''];
	
	        var i18nColumns = {};
	        _.each(_.keys(columns), function (element) {
	          var opt = colOptions[element];
	          if (_.isUndefined(opt)) {
	            opt = $default;
	          }
	
	          i18nColumns[element] = _.defaults({
	            $text: _.isFunction(opt) ? opt(element) : opt,
	            property: element
	          }, columns[element]);
	        });
	
	        this.patch({
	          columns: i18nColumns
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	  function from(arr) {
	    var obj = _.first(arr);
	
	    return _.keys(obj || {});
	  }
	
	  return { from: from };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19), __webpack_require__(22), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.skip': 0,
	      'column.take': Number.MAX_VALUE,
	      'column.lock': [],
	      'column.filter': function columnFilter() {
	        return true;
	      },
	      'column.in': undefined
	    },
	    name: 'column-queryable',
	    update: function update(options) {
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var take = this.get('column.take');
	        var skip = this.get('column.skip');
	        var lock = this.get('column.lock') || [];
	        var filter = this.get('column.filter');
	        // todo [akamel] consider renaming to column.select
	        var $in = this.get('column.in');
	        var select = _.size(model.get('columns')) ? _.map(model.get('columns'), function (i) {
	          return i.property;
	        }) : model.get('select');
	        var unlocked = _.isFunction(filter) ? _.filter($in || select, filter) : $in || select;
	        var lookup = model.get('columns');
	        var set = _.chain(unlocked).difference(lock).value();
	        var col = set;
	
	        if (!_.isNumber(take)) {
	          take = Number.MAX_VALUE;
	        }
	
	        take = Math.max(take - _.size(lock), 0);
	        if (_.size(set) < skip) {
	          skip = 0;
	          // this.set({ 'columns.skip' : 0 }, { silent : true });
	        }
	
	        // start query
	        var skipped = _.first(set, skip);
	
	        if (skip) {
	          col = _.rest(set, skip);
	        }
	
	        var remaining = _.rest(col, take);
	
	        col = _.union(lock, _.first(col, take));
	        // end query
	
	        _.each(col, function (element) {
	          if (!lookup[element]) {
	            lookup[element] = { property: element };
	          }
	          lookup[element].$lock = _.contains(lock, element);
	        });
	
	        this.patch({
	          'select': col,
	          // todo [akamel] rename to column.in???
	          // , 'columns.select'  : set
	          'columns.skipped': skipped,
	          'columns.remaining': remaining,
	          // , 'columns.count'   : _.size(res)
	          // todo [akamel] do we still need to update skip?
	          'column.skip': skip
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19), __webpack_require__(22), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {},
	    name: 'column-shifter',
	    events: {
	      'layout:click:header': 'thClick'
	    },
	    update: function update(options) {
	      // todo [akamel] when calling a deep update; suppress onchange event based updates
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        // todo [akamel] have 'columns' crated at the source so we don't have to put this all over the place
	        var columns = model.get('columns');
	        var select = model.get('select');
	        var colSkipped = model.get('columns.skipped');
	        var colRemaining = model.get('columns.remaining');
	
	        var unlockedAt = Math.max(_.findIndex(select, function (col) {
	          return columns[col] && !columns[col].$lock;
	        }), 0);
	
	        var hasLess = _.size(colSkipped);
	        var hasMore = _.size(colRemaining);
	
	        var colLess = {
	          property: 'column.skip.less',
	          $metadata: {
	            'attr.head': { class: ['skip-less'] },
	            'enabled': hasLess
	          },
	          $html: '<span class="glyphicon glyphicon-triangle-left" />'
	        };
	        var colMore = {
	          property: 'column.skip.more',
	          $metadata: {
	            'attr.head': { class: ['skip-more'] },
	            'enabled': hasMore
	          },
	          $html: '<span class="glyphicon glyphicon-triangle-right" />'
	        };
	
	        if (!hasLess) {
	          colLess.$metadata['attr.head'].class.push('disabled');
	        }
	
	        if (!hasMore) {
	          colMore.$metadata['attr.head'].class.push('disabled');
	        }
	
	        select.splice(unlockedAt, 0, colLess.property);
	        columns[colLess.property] = _.defaults(colLess, columns[colLess.property]);
	        select.push(colMore.property);
	        columns[colMore.property] = _.defaults(colMore, columns[colMore.property]);
	
	        this.patch({
	          columns: columns,
	          select: select
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    },
	    thClick: function thClick(e, arg) {
	      if (_.has(arg.column, '$metadata') && arg.column.$metadata.enabled) {
	        var ret = 0;
	        var skip = this.get('column.skip');
	
	        // todo [akamel] is this logic solid?
	        switch (arg.property) {
	          case 'column.skip.less':
	            {
	              ret = _.isNumber(skip) ? Math.max(skip - 1, 0) : 0;
	              break;
	            }
	          case 'column.skip.more':
	            {
	              ret = _.isNumber(skip) ? skip + 1 : 0;
	              break;
	            }
	          default:
	        }
	
	        this.set({ 'column.skip': ret });
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(19)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, BaseProjection) {
	  'use strict';
	
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.template': {}
	    },
	    name: 'column-template',
	    update: function update(options) {
	      // todo [akamel] when calling a deep update; suppress onchange event based updates
	      // Model.__super__.update.call(this, options);
	
	      // TODO [imang]: columns: ideally we should not need to read from select.
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var colTemplate = this.get('column.template');
	        var columns = model.get('columns');
	        _.each(columns, function (item, property) {
	          var ret = _.clone(item);
	          var templateValue = colTemplate[property];
	
	          if (_.has(colTemplate, property)) {
	            ret.$html = _.isFunction(templateValue) ? templateValue(ret) : templateValue;
	          }
	
	          columns[property] = ret;
	        });
	
	        this.patch({ columns: columns });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	/**
	 *
	 * Important!!!
	 *
	 * The initial check-in is for unblock the simple grid in advanced campaign creation and
	 * may cause bugs if you try to use it with some more complex grid. Please DO NOT use this
	 * projection until we update this and remove the comments here.
	 *
	 * todo [yucongj, wewei] add the model to maintail the input data.
	 *
	 */
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(6), __webpack_require__(19), __webpack_require__(27)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, jquery, BaseProjection, editableTemplate) {
	  'use strict';
	
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.editable.string': {}
	    },
	    name: 'column-editable-string',
	    update: function update(options) {
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var columnEditable = this.get('column.editable.string');
	        var value = _.map(model.get('value'), function (item) {
	          var ret = _.clone(item);
	
	          _.each(columnEditable, function (value, key) {
	            if (_.has(ret, key)) {
	              if (!_.isObject(ret[key])) {
	                var obj = new Object(ret[key]); //eslint-disable-line
	
	                if (_.isUndefined(ret[key])) {
	                  obj.$undefined = true;
	                }
	
	                if (_.isNull(ret[key])) {
	                  obj.$null = true;
	                }
	
	                ret[key] = obj;
	              }
	
	              var defaultValue = ret[key].$undefined || ret[key].$null ? value.defaultValue : ret[key];
	
	              ret[key].$html = editableTemplate({ defaultValue: defaultValue });
	            }
	          });
	
	          return ret;
	        });
	
	        this.patch({ value: value });
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(9);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (defaultValue) {
	buf.push("<input type=\"text\"" + (jade.attr("value", defaultValue, true, true)) + " style=\"width:100%\" class=\"grid-text-input\">");}.call(this,"defaultValue" in locals_for_with?locals_for_with.defaultValue:typeof defaultValue!=="undefined"?defaultValue:undefined));;return buf.join("");
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(6), __webpack_require__(19), __webpack_require__(29), __webpack_require__(30), __webpack_require__(33)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, $, BaseProjection, editableTemplate, prompt) {
	  'use strict';
	
	  function isReadonlyRow(item) {
	    return !item || item.$metadata && _.contains(['aggregate', 'segmentation'], item.$metadata.type);
	  }
	
	  return BaseProjection.extend({
	    defaults: {
	      'column.editable': []
	    },
	    name: 'column-editable',
	    events: {
	      'layout:click:cell': 'tdClick'
	    },
	
	    beforeSet: function beforeSet(local) {
	      var _this = this;
	
	      var editable = function editable() {
	        return true;
	      };
	
	      if (_.has(local, 'column.editable')) {
	        (function () {
	          var editableOptions = local['column.editable'];
	          var viewConfig = {};
	          var conditions = {};
	
	          if (_.isArray(editableOptions)) {
	            _.each(editableOptions, function (editableColumn) {
	              if (_.isString(editableColumn)) {
	                conditions[editableColumn] = editable;
	              } else if (_.isObject(editableColumn) && _.isString(editableColumn.name)) {
	                conditions[editableColumn.name] = _.isFunction(editableColumn.condition) ? editableColumn.condition : editable;
	              }
	              viewConfig[editableColumn] = null;
	            });
	          } else {
	            _.each(editableOptions, function (options, columnName) {
	              if (_.isFunction(options)) {
	                conditions[columnName] = editable;
	                viewConfig[columnName] = options;
	              }
	            });
	          }
	
	          _this.viewConfig = viewConfig;
	          _this.isEditable = function (key, item) {
	            return _.isFunction(conditions[key]) && conditions[key](item);
	          };
	        })();
	      }
	    },
	
	    update: function update(options) {
	      if (BaseProjection.prototype.update.call(this, options)) {
	        var model = this.src.data;
	        var columns = model.get('columns');
	        var iconClasses = this.get('editable.icon.class') || ['glyphicon', 'glyphicon-pencil'];
	
	        _.each(this.viewConfig, function (view, key) {
	          var column = columns[key] || { property: key };
	          var $metadata = column.$metadata = column.$metadata || {};
	          var attrBody = $metadata['attr.body'] = $metadata['attr.body'] || {};
	          var className = attrBody.class || [];
	
	          if (_.isString(className)) {
	            className = className.split(/\s+/);
	          }
	          attrBody.class = _.union(className, ['grid-editable-cell']);
	
	          columns[key] = column;
	        });
	
	        var value = _.map(model.get('value'), function (item) {
	          return isReadonlyRow(item) ? item : _.mapObject(item, function (value, key) {
	            if (this.isEditable(key, item)) {
	              if (!_.isObject(value)) {
	                value = new Object(value); // eslint-disable-line
	              }
	
	              value.$html = editableTemplate({
	                $html: value.$html || String(value),
	                classes: iconClasses
	              });
	            }
	            return value;
	          }, this);
	        }, this);
	
	        this.patch({ value: value });
	      }
	    },
	
	    tdClick: function tdClick(e, arg) {
	      var _this2 = this;
	
	      var schema = null;
	      var metadata = arg.column.$metadata;
	      // TODO: wewei
	      // let's rethink this
	      var property = metadata && metadata.map || arg.property;
	
	      if (!isReadonlyRow(arg.model) && this.isEditable(arg.property, arg.model) && e.target.tagName !== 'A' && $(e.target).closest('.is-not-trigger').length === 0) {
	        schema = arg.grid.options.get('schema');
	        var editor = this.viewConfig[property] || prompt;
	        editor({
	          model: arg.model,
	          schema: schema,
	          position: $(e.target).closest('td').position(),
	          property: property,
	          onSubmit: function onSubmit(model) {
	            _this2.trigger('edit', model);
	          }
	        });
	      }
	    }
	  });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(9);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function ($html, classes) {
	buf.push("<div title=\"Edit\"" + (jade.cls(['grid-edit-icon',classes], [null,true])) + "></div>" + (null == (jade_interp = $html) ? "" : jade_interp));}.call(this,"$html" in locals_for_with?locals_for_with.$html:typeof $html!=="undefined"?$html:undefined,"classes" in locals_for_with?locals_for_with.classes:typeof classes!=="undefined"?classes:undefined));;return buf.join("");
	}

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(6), __webpack_require__(31), __webpack_require__(7), __webpack_require__(32)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, Promise, Backbone, template) {
	  var PopupEditor = Backbone.View.extend({
	    events: {
	      'click .save': function clickSave() {
	        this.trigger('save', this.model);
	      },
	      'click .cancel': function clickCancel() {
	        this.trigger('cancel');
	      },
	      'change .editor': function changeEditor(e) {
	        this.model = e.target.model;
	      },
	      'click form': function clickForm(e) {
	        e.stopPropagation();
	      }
	    },
	
	    initialize: function initialize(options) {
	      this.position = options.position;
	      this.model = options.model;
	      this.property = options.property;
	    },
	
	    render: function render() {
	      var _this = this;
	
	      this.$el.html(template({ value: this.model[this.property] }));
	      this.$el.css({
	        position: 'absolute',
	        left: this.position.left,
	        top: this.position.top
	      });
	
	      this.dismiss = function () {
	        this.trigger('cancel');
	      }.bind(this);
	
	      window.setTimeout(function () {
	        $(window).on('click', _this.dismiss);
	      }, 0);
	
	      return this;
	    },
	
	    remove: function remove() {
	      $(window).off('click', this.dismiss);
	      Backbone.View.prototype.remove.apply(this, arguments);
	    }
	
	  });
	
	  return function (options) {
	    var editor = new PopupEditor(options);
	
	    document.body.appendChild(editor.render().el);
	
	    editor.on('save', function (model) {
	      editor.remove();
	      options.onSubmit && options.onSubmit(model);
	    });
	
	    editor.on('cancel', function () {
	      editor.remove();
	      options.onCancel && options.onCancel();
	    });
	  };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_31__;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(9);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (value) {
	buf.push("<form style=\"padding: 5px; background: #e0e0e0\" class=\"form-inline\"><input type=\"text\"" + (jade.attr("value", value, true, true)) + " class=\"form-control editor\">&nbsp<button type=\"button\" class=\"btn btn-primary save\">Save</button>&nbsp<button type=\"button\" class=\"btn btn-default cancel\">Cancel</button></form>");}.call(this,"value" in locals_for_with?locals_for_with.value:typeof value!=="undefined"?value:undefined));;return buf.join("");
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(34);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(36)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./editable.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/less-loader/index.js!./editable.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(35)();
	// imports
	
	
	// module
	exports.push([module.id, ".grid-editable-cell {\n  position: relative;\n}\n.grid-editable-cell .grid-edit-icon {\n  display: none;\n  position: absolute;\n  top: 2px;\n  right: 2px;\n  font-size: 10px;\n}\n.grid-editable-cell:hover .grid-edit-icon {\n  display: block;\n}\n", ""]);
	
	// exports


/***/ },
/* 35 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(31), __webpack_require__(2), __webpack_require__(19), __webpack_require__(22)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Promise, _, BaseProjection, schemaProperties) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'jsdata.query': undefined,
	      'jsdata.entity': undefined,
	      'jsdata.options': undefined,
	      'skip': undefined,
	      'take': undefined,
	      'filter': undefined,
	      'orderby': [],
	      'select': []
	    },
	    name: 'jsdata',
	
	    update: function update() {
	      var entity = this.get('jsdata.entity');
	      var options = _.defaults(this.get('jsdata.options'), { all: true });
	      var op = {};
	
	      this.p$fetchData || this.trigger('update:beginning');
	
	      var take = this.get('take');
	
	      if (take) {
	        op.limit = take;
	      }
	
	      var skip = this.get('skip');
	
	      if (skip) {
	        op.offset = skip;
	      }
	
	      var filter = this.get('filter');
	
	      if (filter) {
	        op.where = filter;
	      }
	
	      var query = this.get('jsdata.query');
	
	      if (query) {
	        op.query = query;
	      }
	
	      var orderby = this.get('orderby');
	
	      if (orderby && orderby.length) {
	        op.orderBy = _.reduce(orderby, function (arr, obj) {
	          _.each(obj, function (value, key) {
	            arr.push([key, value > 0 ? 'ASC' : 'DESC']);
	          });
	          return arr;
	        }, []);
	      }
	
	      var p$fetchData = this.p$fetchData = entity.findAll(op, options).then(function (data) {
	        if (this.p$fetchData === p$fetchData) {
	          var delta = {
	            value: data,
	            count: data.totalCount,
	            select: schemaProperties.from(data)
	          };
	          if (_.has(data, 'raw')) {
	            delta.rawValue = data.raw;
	          }
	          this.patch(delta);
	        }
	      }.bind(this)).catch(function (jqXHR, textStatus, errorThrown) {
	        if (this.p$fetchData === p$fetchData) {
	          this.patch({
	            error: errorThrown
	          });
	        }
	      }.bind(this)).finally(function () {
	        if (this.p$fetchData === p$fetchData) {
	          this.trigger('update:finished');
	          this.p$fetchData = null;
	        }
	      }.bind(this));
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19), __webpack_require__(22), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection, schemaProperties /* , Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      // todo [akamel] consider supporting a select on this level?
	      map: _.identity
	    },
	    name: 'map',
	    update: function update(options) {
	      // Model.__super__.update.call(this, options);
	
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var map = this.get('map');
	        var value = _.isFunction(map) ? _.map(model.get('value'), map) : model.get('value');
	
	        value = _.flatten(value);
	
	        this.patch({
	          value: value,
	          select: _.without(schemaProperties.from(value), '$metadata')
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19), __webpack_require__(22), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection, schemaProperties /* , Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'skip': 0,
	      'take': Number.MAX_VALUE,
	      'filter': function filter() {
	        return true;
	      },
	      'orderby': [],
	      'select': [],
	      'column.sortable': {}
	    },
	    name: 'map-queryable',
	    beforeSet: function beforeSet(local) {
	      if (_.has(local, 'filter')) {
	        if (!_.isFunction(local.filter)) {
	          local.filter = this.defaults.filter;
	        }
	      }
	    },
	    update: function update(options) {
	      // Model.__super__.update.call(this, options);
	
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var order = _.chain(this.get('orderby')).first().pairs().first().value();
	
	        var orderKey = _.first(order);
	        var orderDir = _.last(order);
	
	        var value = _.chain(model.get('value')).filter(this.get('filter'));
	        var sortFunc = this.get('column.sortable')[orderKey];
	
	        if (orderKey) {
	          if (_.isFunction(sortFunc)) {
	            value = _.chain(sortFunc(value.value(), orderDir));
	          } else {
	            value = value.sortBy(orderKey);
	            if (orderDir === -1) {
	              value = value.reverse();
	            }
	          }
	        }
	
	        value = value.rest(this.get('skip')).first(this.get('take')).value();
	
	        var select = this.get('select');
	        if (!_.size(select)) {
	          select = schemaProperties.from(value);
	        }
	
	        this.patch({
	          value: value,
	          select: select
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(19)], __WEBPACK_AMD_DEFINE_RESULT__ = function (BaseProjection) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      seed: []
	    },
	    update: function update() {
	      this.trigger('update:beginning');
	
	      var value = this.get('seed');
	
	      this.data.set({
	        value: value,
	        count: value.length
	      });
	
	      this.trigger('update:finished');
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection) {
	  var wrds = ['troubles', 'kahlua', 'poncho', 'suzie', 'baheyya'];
	  var idx = 0;
	
	  function randomRow() {
	    var wrd1 = wrds[_.random(0, wrds.length - 1)];
	    var wrd2 = wrds[_.random(0, wrds.length - 1)];
	
	    return {
	      index: idx++,
	      name: wrd1 + ' ' + wrd2,
	      age: _.random(0, 22)
	    };
	  }
	
	  var Model = BaseProjection.extend({
	    defaults: {
	      n: 5000
	    },
	    name: 'mock',
	    update: function update() {
	      this.trigger('update:beginning');
	      var value = [];
	
	      _(this.get('n')).times(function () {
	        value.push(randomRow());
	      });
	
	      this.data.set({
	        value: value,
	        count: value.length
	      });
	      this.trigger('update:finished');
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(31), __webpack_require__(2), __webpack_require__(7), __webpack_require__(6), __webpack_require__(19), __webpack_require__(41), __webpack_require__(22)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Promise, _, Backbone, $, BaseProjection, MemoryMock, schemaProperties) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      verb: 'get',
	      url: undefined,
	      skip: undefined,
	      take: undefined,
	      filter: undefined,
	      orderby: [],
	      select: []
	    },
	    name: 'odata',
	    update: function update() {
	      this.p$fetchData || this.trigger('update:beginning');
	
	      var url = this.get('url');
	
	      url = _.isFunction(url) ? url() : url;
	      var op = {
	        url: url,
	        $format: 'json',
	        // todo [akamel] this is odata v3 specific
	        $count: true
	      };
	
	      var take = this.get('take');
	      if (take) {
	        op.$top = take;
	      }
	
	      var skip = this.get('skip');
	      if (skip) {
	        op.$skip = skip;
	      }
	
	      // todo [akamel] only supports one order column
	      var orderby = this.get('orderby');
	      if (_.size(orderby)) {
	        var col = _.first(orderby);
	        var key = _.keys(col)[0];
	        var dir = col[key];
	
	        op.$orderby = key + ' ' + (dir > 0 ? 'asc' : 'desc');
	      }
	
	      var p$fetchData = this.p$fetchData = new Promise(function (resolve, reject) {
	        $.getJSON(op.url, _.omit(op, 'url')).success(resolve).error(function (jqXHR, textStatus, errorThrown) {
	          reject(errorThrown);
	        });
	      }).then(function (data) {
	        if (p$fetchData === this.p$fetchData) {
	          var delta = {
	            value: data.value,
	            rawValue: data,
	            select: schemaProperties.from(data.value),
	            count: data['@odata.count'],
	            error: undefined
	          };
	          this.patch(delta);
	        }
	      }.bind(this)).catch(function (error) {
	        if (p$fetchData === this.p$fetchData) {
	          this.patch({ error: error });
	        }
	      }).finally(function () {
	        if (p$fetchData === this.p$fetchData) {
	          this.trigger('update:finished');
	          this.p$fetchData = null;
	        }
	      }.bind(this));
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19), __webpack_require__(22), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'page.size': 20,
	      'page.number': 0 },
	    // zero based
	    name: 'page',
	    // todo [akamel] what if we piped after the data was set?
	    beforeSet: function beforeSet(local, other) {
	      var size = _.has(local, 'page.size') ? local['page.size'] : this.get('page.size');
	      var number = _.has(local, 'page.number') ? local['page.number'] : this.get('page.number');
	
	      // todo [akamel] sanetize size and number here
	      size = Math.max(size, 0);
	      number = Math.max(number, 0);
	
	      _.extend(other, {
	        take: size,
	        skip: size * number
	      });
	    },
	    update: function update(options) {
	      var model = this.src.data;
	      var size = Math.max(this.get('page.size'), 0);
	      var count = Math.max(0, model.get('count'));
	
	      options = options || {};
	
	      if (options.deep) {
	        if (this.src) {
	          var number = Math.max(this.get('page.number'), 0);
	
	          this.src.set({
	            take: size,
	            skip: size * number
	          }, { silent: true });
	        }
	      }
	
	      // Model.__super__.update.call(this, options);
	
	      // if we came in with an update:deep
	      if (Model.__super__.update.call(this, options)) {
	        var pageCount = Math.ceil(count / size);
	
	        this.patch({ 'page.count': pageCount });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19), __webpack_require__(22), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'property.template': {}
	    },
	    name: 'property-template',
	    update: function update(options) {
	      // Model.__super__.update.call(this, options);
	
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var opt = this.get('property.template');
	        var value = _.map(model.get('value'), function (item) {
	          var ret = _.clone(item);
	
	          _.each(opt, function (value, key) {
	            if (_.has(ret, key)) {
	              var res = value({
	                model: item,
	                property: key
	              });
	
	              if (!_.isObject(ret[key])) {
	                var obj = new Object(ret[key]); // eslint-disable-line
	
	                if (_.isUndefined(ret[key])) {
	                  obj.$undefined = true;
	                }
	
	                if (_.isNull(ret[key])) {
	                  obj.$null = true;
	                }
	
	                ret[key] = obj;
	              }
	
	              ret[key].$html = res;
	            }
	          });
	
	          return ret;
	        });
	
	        this.patch({ value: value });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19), __webpack_require__(46)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection, selectableTemplate) {
	  'use strict';
	
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.checked': 'checkbox', // the checkbox column
	      'row.check.id': 'Id',
	      'row.check.list': [],
	      'row.check.checked.all': false, // used to store user's check value for the special case no rows or all rows is disabled
	      'row.check.single': false,
	      'row.check.allow': function rowCheckAllow() {
	        return true;
	      }
	    },
	    name: 'row-check',
	    events: {
	      'layout:click:cell': 'tdClick',
	      'layout:click:header': 'thClick'
	    },
	    reset: function reset() {
	      this.set({
	        'row.check.checked.all': false,
	        'row.check.list': []
	      });
	    },
	    update: function update(options) {
	      // Model.__super__.update.call(this, options);
	
	      if (Model.__super__.update.call(this, options)) {
	        var checkId = this.get('row.check.id');
	        var value = this.src.data.get('value');
	        var ids = _.pluck(value, checkId);
	        var checked = _.intersection(this.get('row.check.list'), ids);
	        var checkedLookup = _.object(checked, []);
	        var col = this.get('column.checked');
	        var columns = _.clone(this.src.data.get('columns'));
	        var checkedAll = value.length > 0;
	        var hasCheckboxable = false;
	        var checkboxAllow = this.get('row.check.allow');
	        var checkboxColumn = _.find(columns, function (item) {
	          return item.property === col;
	        });
	        var isSingle = this.get('row.check.single');
	
	        this.set('row.check.list', checked, { silent: true });
	
	        // todo [akamel] it is not clear how 'hasCheckboxable' is used
	        value = _.map(value, function (item) {
	          var ret = _.clone(item);
	          var checked = false;
	          var disabled = true;
	          var isAllowed = _.isFunction(checkboxAllow) ? checkboxAllow(ret) : checkboxAllow;
	
	          if (isAllowed) {
	            checked = _.has(checkedLookup, ret[checkId]);
	            checkedAll = checkedAll && checked;
	            disabled = false;
	            hasCheckboxable = true;
	
	            ret[col] = _.extend({}, ret[col], {
	              $html: selectableTemplate({
	                type: isSingle ? 'radio' : 'checkbox',
	                checked: checked,
	                disabled: disabled
	              })
	            });
	          }
	
	          return ret;
	        });
	
	        // set the checkbox in th
	        if (!_.isUndefined(checkboxColumn)) {
	          if (isSingle) {
	            checkboxColumn.$html = '<span/>';
	          } else {
	            var disabled = _.size(ids) === 0;
	            if (hasCheckboxable) {
	              checkboxColumn.$html = selectableTemplate({
	                type: 'checkbox',
	                checked: checkedAll,
	                disabled: disabled
	              });
	              if (!checkedAll) {
	                this.attributes['row.check.checked.all'] = false;
	              }
	            } else {
	              checkboxColumn.$html = selectableTemplate({
	                type: 'checkbox',
	                checked: this.get('row.check.checked.all'),
	                disabled: disabled
	              });
	            }
	          }
	        }
	
	        this.patch({
	          value: value,
	          columns: columns
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    },
	    tdClick: function tdClick(e, arg) {
	      var checkboxProperty = this.get('column.checked');
	      var isSingle = this.get('row.check.single');
	
	      if (arg.property === checkboxProperty) {
	        var list = this.get('row.check.list');
	        var id = arg.model[this.get('row.check.id')];
	
	        if (isSingle) {
	          this.set({ 'row.check.list': [id] });
	        } else {
	          this.set({
	            'row.check.list': arg.checked ? list.concat([id]) : _.without(list, id)
	          });
	        }
	
	        this.update();
	      }
	    },
	    thClick: function thClick(e, arg) {
	      var checkboxProperty = this.get('column.checked');
	
	      if (arg.property === checkboxProperty) {
	        var list = [];
	
	        if (arg.checked) {
	          var checkId = this.get('row.check.id');
	          // TODO [akamel] this concept of check allow is strange
	          var checkboxAllow = this.get('row.check.allow');
	
	          // get the list of allowed rows' id
	          list = _.chain(this.data.get('value')).filter(function (item) {
	            return (_.isFunction(checkboxAllow) ? checkboxAllow(item) : checkboxAllow) && !_.isUndefined(item[checkId]);
	          }).map(function (item) {
	            return item[checkId];
	          }).value();
	        }
	
	        this.set({
	          'row.check.list': list,
	          'row.check.checked.all': arg.checked
	        });
	
	        this.update();
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(9);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (checked, disabled, type) {
	buf.push("<input" + (jade.attr("type", type, true, true)) + (jade.attr("checked", checked, true, true)) + (jade.attr("disabled", disabled, true, true)) + " class=\"column-selection\">");}.call(this,"checked" in locals_for_with?locals_for_with.checked:typeof checked!=="undefined"?checked:undefined,"disabled" in locals_for_with?locals_for_with.disabled:typeof disabled!=="undefined"?disabled:undefined,"type" in locals_for_with?locals_for_with.type:typeof type!=="undefined"?type:undefined));;return buf.join("");
	}

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19), __webpack_require__(48)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection, defaultRowCheckTemp) {
	  'use strict';
	
	  var CheckTransitionRule = {};
	
	  // CheckTransitionRule functions determine the state transition of a checkbox.
	  // State transition depends on the current state and wheather a short or full cycle is requested.
	  // When the short  cycle is requested the checkbox cannot return to the indeterminate state,
	  // event if it started in this state.
	  // Two directions of transition are available:
	  // ... -> indeterminate -> checked -> unchecked -> ...
	  // ... -> indeterminate -> unchecked -> checked -> ...
	  CheckTransitionRule.indeterminateToChecked = function () {
	    var nextState = {
	      unchecked: function unchecked(shortCycle) {
	        return shortCycle ? 'checked' : 'indeterminate';
	      },
	      checked: _.constant('unchecked'),
	      indeterminate: _.constant('checked')
	    };
	
	    return function (shortCycle, currentState) {
	      return _.has(nextState, currentState) && nextState[currentState](shortCycle) || 'unchecked';
	    };
	  }();
	
	  CheckTransitionRule.indeterminateToUnchecked = function () {
	    var nextState = {
	      unchecked: _.constant('checked'),
	      checked: function checked(shortCycle) {
	        return shortCycle ? 'unchecked' : 'indeterminate';
	      },
	      indeterminate: _.constant('unchecked')
	    };
	
	    return function (shortCycle, currentState) {
	      return _.has(nextState, currentState) && nextState[currentState](shortCycle) || 'unchecked';
	    };
	  }();
	
	  CheckTransitionRule.indeterminateToCheckedFullCycle = function (currentState) {
	    return CheckTransitionRule.indeterminateToChecked(false, currentState);
	  };
	
	  CheckTransitionRule.indeterminateToUncheckedFullCycle = function (currentState) {
	    return CheckTransitionRule.indeterminateToUnchecked(false, currentState);
	  };
	
	  CheckTransitionRule.indeterminateToCheckedShortCycle = function (currentState) {
	    return CheckTransitionRule.indeterminateToChecked(true, currentState);
	  };
	
	  CheckTransitionRule.indeterminateToUncheckedShortCycle = function (currentState) {
	    return CheckTransitionRule.indeterminateToUnchecked(true, currentState);
	  };
	
	  function getAllCheckState(checkStateCounters, count) {
	    return _.findKey(checkStateCounters, function (c) {
	      return c === count;
	    }) || 'unchecked';
	  }
	
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.checked': 'checkbox', // the checkbox column
	      'row.check.id': 'Id',
	      'row.check.map': {},
	      'row.check.all': { state: 'unchecked' }, // used to store user's check value for the special case no rows or all rows is disabled
	      'row.check.allow': function rowCheckAllow() {
	        return true;
	      },
	      'row.check.click-anywhere': false,
	      'row.check.transition': CheckTransitionRule.indeterminateToCheckedShortCycle,
	      'row.check.all.transition': CheckTransitionRule.indeterminateToCheckedShortCycle,
	      'row.check.template': defaultRowCheckTemp
	    },
	    name: 'row-check',
	    events: {
	      'layout:click:cell': 'tdClick',
	      'layout:click:header': 'thClick'
	    },
	    reset: function reset() {
	      this.set({
	        'row.check.checked.all': false,
	        'row.check.map': {}
	      });
	    },
	    update: function update(options) {
	      if (!Model.__super__.update.call(this, options)) {
	        return;
	      }
	
	      var checkId = this.get('row.check.id');
	      var ids = _.pluck(this.src.data.get('value'), checkId);
	      var checkMap = this.get('row.check.map');
	      var col = this.get('column.checked');
	      var columns = _.clone(this.src.data.get('columns'));
	      var checkStateCounters = _.object(['unchecked', 'checked', 'indeterminate'], [0, 0, 0]);
	      var hasCheckboxable = false;
	      var checkboxAllow = this.get('row.check.allow');
	      var checkboxColumn = _.find(columns, function (item) {
	        return item.property === col;
	      });
	      var rowCheckTemp = this.get('row.check.template');
	
	      var value = _.map(this.src.data.get('value'), function (item) {
	        var ret = _.clone(item);
	        var check = checkMap[ret[checkId]] || { state: 'unchecked' };
	        var disabled = true;
	        var isAllowed = _.isFunction(checkboxAllow) ? checkboxAllow(ret) : checkboxAllow;
	
	        checkStateCounters[check.state]++;
	
	        if (isAllowed) {
	          disabled = false;
	          hasCheckboxable = true;
	        }
	
	        ret[col] = _.extend({}, ret[col], {
	          $html: rowCheckTemp({ checkState: check.state, disabled: disabled })
	        });
	
	        return ret;
	      });
	
	      // set the checkbox in th
	      if (!_.isUndefined(checkboxColumn)) {
	        var disabledAllCheck = _.size(ids) === 0;
	
	        if (hasCheckboxable) {
	          var checkState = getAllCheckState(checkStateCounters, ids.length);
	
	          checkboxColumn.$html = rowCheckTemp({ checkState: checkState, disabled: disabledAllCheck });
	          this.attributes['row.check.all'] = _.extend(this.attributes['row.check.all'], { state: checkState });
	        } else {
	          checkboxColumn.$html = rowCheckTemp({ checkState: this.get('row.check.all').state, disabled: disabledAllCheck });
	        }
	      }
	
	      this.patch({
	        value: value,
	        columns: columns
	      });
	    },
	    tdClick: function tdClick(e, arg) {
	      var checkboxProperty = this.get('column.checked');
	      var clickAnywhere = this.get('row.check.click-anywhere');
	
	      if (arg.property === checkboxProperty || clickAnywhere) {
	        var checkMap = _.clone(this.get('row.check.map'));
	        var id = arg.model[this.get('row.check.id')];
	        var defaultTransition = this.get('row.check.transition');
	        var check = _.extend({
	          id: id,
	          transition: defaultTransition,
	          state: 'unchecked'
	        }, checkMap[id]);
	
	        check.state = check.transition(check.state);
	        checkMap[id] = check;
	
	        this.set({
	          'row.check.map': checkMap
	        });
	
	        e.stopImmediatePropagation();
	      }
	    },
	    thClick: function thClick(e, arg) {
	      var checkboxProperty = this.get('column.checked');
	
	      if (arg.property === checkboxProperty) {
	        var checkMap = _.clone(this.get('row.check.map'));
	        var checkId = this.get('row.check.id');
	        var allCheck = this.get('row.check.all');
	        var checkState = allCheck.state;
	        var allCheckTransitionRule = this.get('row.check.all.transition');
	        var CheckTransitionRule = this.get('row.check.transition');
	
	        allCheck.state = allCheckTransitionRule(checkState);
	
	        checkMap = _.object(this.data.get('value').map(function (item) {
	          var id = item[checkId];
	          var check = _.extend({
	            id: id,
	            transition: CheckTransitionRule
	          }, checkMap[id], { state: allCheck.state });
	
	          return [id, check];
	        }));
	
	        this.set({
	          'row.check.map': checkMap,
	          'row.check.all': allCheck
	        });
	
	        e.stopImmediatePropagation();
	      }
	    }
	  });
	
	  function CheckDiff(added, changed, removed, unchanged) {
	    this.added = added || {};
	    this.changed = changed || {};
	    this.removed = removed || {};
	    this.unchanged = unchanged || {};
	  }
	
	  CheckDiff.prototype.hasChanges = function () {
	    return _.keys(this.changed).length + _.keys(this.added).length > 0;
	  };
	
	  function diffCheckMap(before, after, defaultState) {
	    defaultState = defaultState || { state: 'unchecked' };
	
	    var checkDiff = new CheckDiff();
	
	    _.keys(before).forEach(function (key) {
	      var beforeState = before[key];
	      var afterState = after[key];
	
	      if (!afterState) {
	        checkDiff.removed[key] = beforeState;
	      } else if (beforeState.state === afterState.state) {
	        checkDiff.unchanged[key] = afterState;
	      } else {
	        checkDiff.changed[key] = { before: beforeState, after: afterState };
	      }
	    });
	
	    _.keys(after).forEach(function (key) {
	      var afterState = after[key];
	      var beforeState = before[key];
	
	      if (!beforeState && defaultState.state !== afterState.state) {
	        checkDiff.added[key] = afterState;
	      }
	    });
	
	    return checkDiff;
	  }
	
	  function statCheckMap(checkMap, defaultState) {
	    defaultState = defaultState || { state: 'unchecked' };
	    var checked = [];
	    var indeterminate = [];
	    var unchecked = [];
	
	    _.keys(checkMap).forEach(function (key) {
	      var check = checkMap[key];
	
	      if (check.state === 'checked' && check.state !== defaultState.state) {
	        checked.push(check);
	      } else if (check.state === 'unchecked' && check.state !== defaultState.state) {
	        unchecked.push(check);
	      } else if (check.state !== defaultState.state) {
	        indeterminate.push(check);
	      }
	    });
	
	    return {
	      checked: checked,
	      unchecked: unchecked,
	      indeterminate: indeterminate
	    };
	  }
	
	  function fullStatCheckMap(before, after, defaultState) {
	    return _.extend(statCheckMap(after, defaultState), diffCheckMap(before, after, defaultState));
	  }
	
	  Model.CheckTransitionRule = CheckTransitionRule;
	  Model.fullStatCheckMap = fullStatCheckMap;
	  Model.statCheckMap = statCheckMap;
	  Model.diffCheckMap = diffCheckMap;
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(9);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (checkState) {
	var classes = [].concat(checkState === 'indeterminate' ? ['glyphicon', 'glyphicon-minus'] : checkState === 'checked' ? ['glyphicon', 'glyphicon-ok'] : [])
	buf.push("<div class=\"column-tri-state-checkbox\"><span" + (jade.cls([classes], [true])) + "></span></div>");}.call(this,"checkState" in locals_for_with?locals_for_with.checkState:typeof checkState!=="undefined"?checkState:undefined));;return buf.join("");
	}

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19), __webpack_require__(22), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {},
	    name: 'row-index',
	    update: function update(options) {
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var skip = this.get('skip');
	        var value = _.map(model.get('value'), function (i, idx) {
	          var ret = _.clone(i);
	          ret.rowIndex = idx + (_.isFinite(skip) ? skip : 0) + 1;
	          return ret;
	        });
	
	        this.patch({ value: value });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(19), __webpack_require__(22)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, BaseProjection, schemaProperties) {
	  var Model = BaseProjection.extend({
	
	    defaults: {
	      seed: null
	    },
	
	    name: 'sink',
	
	    update: function update() {
	      var value;
	
	      value = this.get('seed');
	
	      if (value) {
	        var select = schemaProperties.from(value);
	        this.patch({
	          value: value,
	          select: select,
	          count: _.size(value)
	        });
	      }
	    }
	
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(19), __webpack_require__(20)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.group': {},
	      'column.groupExpansion': [],
	      'column.select': null
	    },
	    name: 'column-group',
	
	    events: {
	      'layout:click:header': 'onClickHeader'
	    },
	
	    update: function update(options) {
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var columnGroup = this.get('column.group') || {};
	        var groupExpansion = {};
	        _.each(this.get('column.groupExpansion') || [], function (columnName) {
	          groupExpansion[columnName] = true;
	        });
	        var select = this.get('column.select') || model.get('select');
	        var columns = model.get('columns');
	        var subSelect = [];
	        var isApplyGroup = false;
	
	        _.each(columnGroup, function (subColumns, name) {
	          if (!_.has(columns, name)) {
	            return;
	          }
	          isApplyGroup = true;
	          columns[name].group = subColumns;
	          // remove the columns that appear in the select
	          select = _.difference(select, subColumns);
	          columns[name].groupExpansion = _.has(groupExpansion, name);
	        }, this);
	        var selectExpand = select.slice(0);
	
	        _.each(select, function (columnName) {
	          var column = columns[columnName];
	          var subColumns = column.group;
	          if (column.groupExpansion) {
	            var nameIndex = selectExpand.indexOf(columnName);
	            selectExpand.splice.apply(selectExpand, [nameIndex, 1].concat(subColumns));
	            subSelect = subSelect.concat(subColumns);
	          }
	        }, this);
	
	        this.patch({
	          columns: columns,
	          select: select,
	          subSelect: subSelect,
	          selectExpand: selectExpand,
	          isApplyGroup: isApplyGroup
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    },
	
	    onClickHeader: function onClickHeader(e, arg) {
	      if (!e.target.classList.contains('glyphicon')) {
	        return;
	      }
	      var column = arg.column;
	      if (_.isArray(column.group)) {
	        var groupExpansion = this.get('column.groupExpansion') || [];
	        if (column.groupExpansion) {
	          groupExpansion = _.without(groupExpansion, column.property);
	        } else {
	          groupExpansion = _.union(groupExpansion, [column.property]);
	        }
	        this.set({ 'column.groupExpansion': groupExpansion });
	      }
	    }
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _base = __webpack_require__(19);
	
	var _base2 = _interopRequireDefault(_base);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ColumnsProjection = _base2.default.extend({
	  defaults: {
	    columns: {}
	  },
	
	  name: 'columns',
	
	  update: function update(options) {
	    if (_base2.default.prototype.update.call(this, options)) {
	      this.patch({
	        columns: this.get('columns')
	      });
	    }
	  }
	});
	
	exports.default = ColumnsProjection;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.delegateEvents = delegateEvents;
	
	var _underscore = __webpack_require__(2);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function delegateEvents(_ref) {
	  var from = _ref.from;
	  var to = _ref.to;
	  var events = _ref.events;
	
	  _underscore2.default.each(events, function (event) {
	    return from.on(event, function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      return to.trigger.apply(to, [event].concat(args));
	    });
	  });
	}

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _underscore = __webpack_require__(2);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _gridView = __webpack_require__(55);
	
	var _gridView2 = _interopRequireDefault(_gridView);
	
	var _index = __webpack_require__(4);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _utility = __webpack_require__(53);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (definePlugin) {
	  return definePlugin('gridView', ['config', 'projection', 'renderers'], function (config, projection, renderers) {
	    var gridView = new _gridView2.default({
	      projection: projection,
	      el: config.el,
	      container: _underscore2.default.chain(config).result('scrollable').result('fixedHeader').result('container').value(),
	      schema: config.dataSource.schema,
	      Layout: _index2.default.TableLayout.partial({
	        renderers: renderers,
	        template: _index2.default.templates.table,
	        hideHeaders: config.hideHeaders
	      })
	    });
	
	    (0, _utility.delegateEvents)({
	      from: projection,
	      to: gridView,
	      events: ['update:beginning', 'update:finished']
	    });
	
	    return gridView;
	  });
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7), __webpack_require__(56), __webpack_require__(57), __webpack_require__(59)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, Options, WindowContainer, ElementContainer) {
	  var GridView = Backbone.View.extend({
	    // todo [akamel] document available options
	    initialize: function initialize(options) {
	      options = options || {};
	
	      this.options = new Options(options);
	
	      var container = selectContainer(options.container);
	
	      // todo [akamel] assert that layout is a ctor
	      this.layout = new options.Layout({
	        el: this.el,
	        grid: this,
	        container: container
	      });
	
	      this.projection = options.projection;
	
	      this.projection.data.on('change', function () {
	        this.trigger.apply(this, ['change:data'].concat(_.toArray(arguments)));
	      }.bind(this));
	
	      this.options.on('change', function () {
	        this.trigger.apply(this, ['change:options'].concat(_.toArray(arguments)));
	      }.bind(this));
	
	      this.projection.on('all', function () {
	        this.trigger.apply(this, ['data:' + _.first(arguments)].concat(_.rest(arguments)));
	      }.bind(this));
	
	      this.layout.on('all', function () {
	        var key = 'layout:' + _.first(arguments);
	        var arg = [key].concat(_.rest(arguments));
	
	        this.projection.bubble.apply(this.projection, arg);
	        this.trigger.apply(this, arg);
	      }.bind(this));
	
	      // todo [akamel] this is a temporary implementation of orderby; should be in layout not in grid
	      this.on('layout:click:header', function (e, arg) {
	        var column = arg.column;
	
	        if (column.sortable) {
	          var orderby = {};
	
	          var key = _.isString(column.sortable) ? column.sortable : column.property;
	
	          orderby[key] = column.$orderby ? column.$orderby.dir * -1 : 1;
	
	          this.projection.set({ 'orderby': [orderby], 'page.number': 0 });
	        }
	      }.bind(this));
	
	      var local = _.omit(options, 'projection', 'layout');
	      this.options.set(local);
	    },
	
	    remove: function remove() {
	      this.layout.remove();
	      Backbone.View.prototype.remove.apply(this, arguments);
	    },
	
	    set: function set() {
	      this.options.set.apply(this.options, _.toArray(arguments));
	    },
	
	    render: function render(options) {
	      options = options || {};
	
	      this.layout.render();
	
	      if (options.fetch) {
	        this.projection.update({ deep: true });
	      }
	
	      return this;
	    },
	
	    getSelection: function getSelection() {
	      return this.projection.get('row.check.list') || [];
	    }
	
	  });
	
	  function selectContainer(userContainer) {
	    if (userContainer && window !== userContainer && ElementContainer.isValidContainer(userContainer)) {
	      return new ElementContainer({ el: userContainer });
	    }
	
	    return new WindowContainer();
	  }
	
	  return GridView;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone) {
	  return Backbone.Model.extend({
	    defaults: {
	      layout: undefined,
	      projection: undefined
	    }
	  });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(6), __webpack_require__(58)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, $, ContainerBase) {
	  var WindowContainer = ContainerBase.extend({
	    constructor: function constructor(options) {
	      options = _.extend({}, options, { el: window });
	      ContainerBase.prototype.constructor.apply(this, [options].concat(_.rest(arguments)));
	    },
	
	    offset: function offset(element) {
	      return $(element).offset();
	    }
	  });
	
	  return WindowContainer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(6), __webpack_require__(7)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, $, Backbone) {
	  var ContainerBase = Backbone.View.extend({
	    events: {
	      scroll: 'onScroll',
	      resize: 'onResize'
	    },
	
	    onScroll: function onScroll(e) {
	      this.trigger('scroll:container', e);
	    },
	
	    onResize: function onResize(e) {
	      this.trigger('resize:container', e);
	    },
	
	    offset: function offset() /* element, scrollTop, scrollLeft */{
	      throw new Error("Offset function not implemented");
	    }
	  });
	
	  return ContainerBase;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(6), __webpack_require__(58)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, $, ContainerBase) {
	  var ElementContainer = ContainerBase.extend({
	    offset: function offset(element) {
	      var position = $(element).position();
	
	      return {
	        top: position.top + this.$el.scrollTop(),
	        left: position.left + this.$el.scrollLeft()
	      };
	    }
	  });
	
	  ElementContainer.isValidContainer = function (userContainer) {
	    return ['absolute', 'relative', 'fixed'].indexOf($(userContainer).css('position')) >= 0;
	  };
	
	  return ElementContainer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ])
});
;
//# sourceMappingURL=projection-grid.js.map