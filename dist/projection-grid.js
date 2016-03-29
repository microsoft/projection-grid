(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("backbone"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "backbone", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["projection-grid"] = factory(require("underscore"), require("backbone"), require("jquery"));
	else
		root["projection-grid"] = factory(root["underscore"], root["backbone"], root["jquery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__) {
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

	module.exports = {
	  GridView: __webpack_require__(1),
	  projections: __webpack_require__(9),
	  layout: __webpack_require__(33),
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(4),
	  __webpack_require__(5),
	  __webpack_require__(8),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, Options, WindowContainer, ElementContainer) {
	  var GridView = Backbone.View.extend({
	    // todo [akamel] document available options
	    initialize: function (options) {
	      options = options || {};
	
	      this.options = new Options(options);
	
	      var container = selectContainer(options.container);
	
	      // todo [akamel] assert that layout is a ctor
	      this.layout = new options.Layout({
	        el: this.el,
	        grid: this,
	        container: container,
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
	
	    remove: function () {
	      this.layout.remove();
	      Backbone.View.prototype.remove.apply(this, arguments);
	    },
	
	    set: function () {
	      this.options.set.apply(this.options, _.toArray(arguments));
	    },
	
	    render: function (options) {
	      options = options || {};
	
	      this.layout.render();
	
	      if (options.fetch) {
	        this.projection.update({ deep: true });
	      }
	
	      return this;
	    },
	
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
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone) {
	  return Backbone.Model.extend({
	    defaults: {
	      layout: undefined,
	      projection: undefined,
	    },
	  });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(6),
	  __webpack_require__(7),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, $, ContainerBase) {
	  var WindowContainer = ContainerBase.extend({
	    constructor: function (options) {
	      options = _.extend({}, options, { el: window });
	      ContainerBase.prototype.constructor.apply(this, [options].concat(_.rest(arguments)));
	    },
	
	    offset: function (element) {
	      return $(element).offset();
	    },
	  });
	
	  return WindowContainer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(6),
	  __webpack_require__(3),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, $, Backbone) {
	  var ContainerBase = Backbone.View.extend({
	    events: {
	      scroll: 'onScroll',
	      resize: 'onResize',
	    },
	
	    onScroll: function (e) {
	      this.trigger('scroll:container', e);
	    },
	
	    onResize: function (e) {
	      this.trigger('resize:container', e);
	    },
	
	    offset: function (/* element, scrollTop, scrollLeft */) {
	      throw new Error("Offset function not implemented");
	    },
	  });
	
	  return ContainerBase;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(6),
	  __webpack_require__(7),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, $, ContainerBase) {
	  var ElementContainer = ContainerBase.extend({
	    offset: function (element) {
	      var position = $(element).position();
	
	      return {
	        top: position.top + this.$el.scrollTop(),
	        left: position.left + this.$el.scrollLeft(),
	      };
	    },
	  });
	
	  ElementContainer.isValidContainer = function (userContainer) {
	    return ['absolute', 'relative', 'fixed'].indexOf($(userContainer).css('position')) >= 0;
	  };
	
	  return ElementContainer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  AggregateRow: __webpack_require__(10),
	  Base: __webpack_require__(11),
	  ColumnI18n: __webpack_require__(13),
	  ColumnQueryable: __webpack_require__(15),
	  ColumnShifter: __webpack_require__(16),
	  ColumnTemplate: __webpack_require__(17),
	  EditableString: __webpack_require__(18),
	  Map: __webpack_require__(22),
	  MemoryQueryable: __webpack_require__(23),
	  Memory: __webpack_require__(24),
	  Mock: __webpack_require__(25),
	  Odata: __webpack_require__(26),
	  Page: __webpack_require__(27),
	  PropertyTemplate: __webpack_require__(28),
	  RowCheckbox: __webpack_require__(29),
	  RowIndex: __webpack_require__(31),
	  Sink: __webpack_require__(32),
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(11),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection) {
	  var createRows = function (fn, data) {
	    var rows = fn(data);
	
	    _.each(rows, function (row) {
	      row.$metadata = _.extend(row.$metadata, { type: 'aggregate' });
	    });
	
	    return rows;
	  };
	
	  var Model = BaseProjection.extend({
	
	    defaults: {
	      'aggregate.top': null,
	      'aggregate.bottom': null,
	    },
	
	    name: 'aggregate-row',
	
	    update: function (options) {
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
	            value: value,
	          });
	        }
	      }
	    },
	
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(12),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, Response) {
	  var Model = Backbone.Model.extend({
	    initialize: function () {
	      _.bindAll(this, 'onSrcUpdate', 'beforeSet', 'afterSet', 'update');
	      this.data = new Response();
	      this.src = undefined;
	      this.on('change', function (model) {
	        // todo [akamel] the model here is the settings model
	        this.update({ model: model });
	      }.bind(this));
	    },
	
	    constructor: function () {
	      // used to figure out which options to set localy and which ones to pass down the pipe
	      this.localKeys = _.keys(this.defaults);
	      // todo [akamel] this might prevent us from overriding initialize
	      Model.__super__.constructor.apply(this, arguments);
	    },
	
	    pipe: function (to) {
	      if (to) {
	        to.setSrc(this);
	      }
	
	      return to;
	    },
	
	    setSrc: function (src) {
	      if (this.src) {
	        this.src.data.off('change', this.onSrcUpdate);
	        this.src.off('all', this.bubble);
	      }
	
	      this.src = src;
	      if (this.src) {
	        this.src.data.on('change', this.onSrcUpdate);
	        this.src.on('all', this.bubble);
	      }
	
	      this.update();
	    },
	
	    patch: function (delta) {
	      var src = this.src ? this.src.data.toJSON() : {};
	      delta = _.isObject(delta) ? delta : {};
	
	      this.data.set(_.defaults(delta, this.attributes, src));
	    },
	
	    beforeSet: function (/* local, other */) {},
	    afterSet: function () {},
	
	    onSrcUpdate: function (/* model */) {
	      this.update(/* { model : model } */);
	    },
	    bubble: function () {
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
	
	    update: function (options) {
	      options = options || {};
	
	      if (this.src) {
	        if (options.deep) {
	          this.src.update(options);
	          return false;
	        }
	
	        return true;
	      }
	
	      return false;
	    },
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
	        case 'projection': {
	          var p = this;
	          do {
	            if (p.name === name) {
	              return p;
	            }
	            p = p.src;
	          } while (p);
	          break;
	        }
	        default: {
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone) {
	  return Backbone.Model.extend({
	    defaults: {
	      value: [],
	      select: [],
	      count: 0,
	      aggregate: [],
	    },
	  });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(11),
	  __webpack_require__(14),
	  __webpack_require__(12),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.i18n': {
	        '': function (name) {
	          return name;
	        },
	      },
	    },
	    name: 'column-i18n',
	    beforeSet: function (local) {
	      if (_.has(local, 'column.i18n')) {
	        if (!_.isObject(local['column.i18n'])) {
	          local['column.i18n'] = this.defaults['column.i18n'];
	        }
	      }
	    },
	    update: function (options) {
	      // todo [akamel] when calling a deep update; suppress onchange event based updates
	      // Model.__super__.update.call(this, options);
	
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var colOptions = this.get('column.i18n');
	        var select = _.size(model.get('columns')) ? _.map(model.get('columns'), function (i) {
	          return i.property;
	        }) : model.get('select');
	        var lookup = {};
	        var $default = colOptions[''];
	
	        // todo [akamel] use indexBy from underscore 1.5.x
	        _.each(model.get('columns'), function (element) {
	          lookup[element.property] = element;
	        });
	
	        var i18nColumns = _.map(select, function (element) {
	          var opt = colOptions[element];
	          if (_.isUndefined(opt)) {
	            opt = $default;
	          }
	
	          return _.defaults({
	            $text: _.isFunction(opt) ? opt(element) : opt,
	            property: element,
	          }, lookup[element]);
	        });
	
	        this.patch({
	          columns: i18nColumns,
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_) {
	  function from(arr) {
	    var obj = _.first(arr);
	
	    return _.keys(obj || {});
	  }
	
	  return { from: from };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(11),
	  __webpack_require__(14),
	  __webpack_require__(12),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.skip': 0,
	      'column.take': Number.MAX_VALUE,
	      'column.lock': [],
	      'column.filter': function () {
	        return true;
	      },
	      'column.in': undefined,
	    },
	    name: 'column-queryable',
	    update: function (options) {
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
	        var unlocked = _.isFunction(filter) ? _.filter($in || select, filter) : ($in || select);
	        var lookup = {};
	        var set = _.chain(unlocked).difference(lock).value();
	        var col = set;
	
	        // todo [akamel] use indexBy from underscore 1.5.x
	        _.each(model.get('columns'), function (element) {
	          lookup[element.property] = element;
	        });
	
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
	
	        // todo [akamel] [perf] this used a contains within a loop
	        var res = _.map(col, function (element) {
	          return _.defaults({
	            $lock: _.contains(lock, element),
	            property: element,
	          }, lookup[element]);
	        });
	
	        this.patch({
	          'columns': res,
	          // todo [akamel] rename to column.in???
	          // , 'columns.select'  : set
	          'columns.skipped': skipped,
	          'columns.remaining': remaining,
	          // , 'columns.count'   : _.size(res)
	          // todo [akamel] do we still need to update skip?
	          'column.skip': skip,
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(11),
	  __webpack_require__(14),
	  __webpack_require__(12),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	    },
	    name: 'column-shifter',
	    events: {
	      'layout:click:header': 'thClick',
	    },
	    update: function (options) {
	      // todo [akamel] when calling a deep update; suppress onchange event based updates
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        // todo [akamel] have 'columns' crated at the source so we don't have to put this all over the place
	        var columns = model.get('columns') || _.map(model.get('select'), function (i) {
	          return { property: i };
	        });
	        var colSkipped = model.get('columns.skipped');
	        var colRemaining = model.get('columns.remaining');
	
	        var unlockedAt = Math.max(_.findIndex(columns, function (col) {
	          return !col.$lock;
	        }), 0);
	
	        var hasLess = _.size(colSkipped);
	        var hasMore = _.size(colRemaining);
	
	        var colLess = {
	          property: 'column.skip.less',
	          $metadata: {
	            'attr.head': { class: ['skip-less'] },
	            'enabled': hasLess,
	          },
	          $html: '<span class="glyphicon glyphicon-triangle-left" />',
	        };
	        var colMore = {
	          property: 'column.skip.more',
	          $metadata: {
	            'attr.head': { class: ['skip-more'] },
	            'enabled': hasMore,
	          },
	          $html: '<span class="glyphicon glyphicon-triangle-right" />',
	        };
	
	        if (!hasLess) {
	          colLess.$metadata['attr.head'].class.push('disabled');
	        }
	
	        if (!hasMore) {
	          colMore.$metadata['attr.head'].class.push('disabled');
	        }
	
	        columns.splice(unlockedAt, 0, colLess);
	        columns.push(colMore);
	
	        this.patch({ columns: columns });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    },
	    thClick: function (e, arg) {
	      if (_.has(arg.column, '$metadata') && arg.column.$metadata.enabled) {
	        var ret = 0;
	        var skip = this.get('column.skip');
	
	        // todo [akamel] is this logic solid?
	        switch (arg.property) {
	          case 'column.skip.less': {
	            ret = _.isNumber(skip) ? Math.max(skip - 1, 0) : 0;
	            break;
	          }
	          case 'column.skip.more': {
	            ret = _.isNumber(skip) ? skip + 1 : 0;
	            break;
	          }
	          default:
	        }
	
	        this.set({ 'column.skip': ret });
	      }
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(11),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, BaseProjection) {
	  'use strict';
	
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.template': {},
	    },
	    name: 'column-template',
	    update: function (options) {
	      // todo [akamel] when calling a deep update; suppress onchange event based updates
	      // Model.__super__.update.call(this, options);
	
	      // TODO [imang]: columns: ideally we should not need to read from select.
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var colTemplate = this.get('column.template');
	        var columns = _.map(model.get('columns') || _.map(model.get('select'), function (i) {
	          return { property: i };
	        }), function (item) {
	          var ret = _.clone(item);
	          var property = ret.property;
	
	          if (_.has(colTemplate, property)) {
	            colTemplate = colTemplate[property];
	            ret.$html = _.isFunction(colTemplate) ? colTemplate(ret) : colTemplate;
	          }
	
	          return ret;
	        });
	
	        this.patch({ columns: columns });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
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
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(6),
	  __webpack_require__(11),
	  __webpack_require__(19),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, jquery, BaseProjection, editableTemplate) {
	  'use strict';
	
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.editable.string': {},
	    },
	    name: 'column-editable-string',
	    update: function (options) {
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
	
	              var defaultValue = (ret[key].$undefined || ret[key].$null) ? value.defaultValue : ret[key];
	
	              ret[key].$html = editableTemplate({ defaultValue: defaultValue });
	            }
	          });
	
	          return ret;
	        });
	
	        this.patch({ value: value });
	      }
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(20);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (defaultValue) {
	buf.push("<input type=\"text\"" + (jade.attr("value", defaultValue, true, true)) + " style=\"width:100%\" class=\"grid-text-input\">");}.call(this,"defaultValue" in locals_for_with?locals_for_with.defaultValue:typeof defaultValue!=="undefined"?defaultValue:undefined));;return buf.join("");
	}

/***/ },
/* 20 */
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
	    str = str || __webpack_require__(21).readFileSync(filename, 'utf8')
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
/* 21 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(11),
	  __webpack_require__(14),
	  __webpack_require__(12),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection, schemaProperties /* , Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      // todo [akamel] consider supporting a select on this level?
	      map: _.identity,
	    },
	    name: 'map',
	    update: function (options) {
	      // Model.__super__.update.call(this, options);
	
	      if (Model.__super__.update.call(this, options)) {
	        var model = this.src.data;
	        var map = this.get('map');
	        var value = _.isFunction(map) ? _.map(model.get('value'), map) : model.get('value');
	
	        value = _.flatten(value);
	
	        this.patch({
	          value: value,
	          select: schemaProperties.from(value),
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(11),
	  __webpack_require__(14),
	  __webpack_require__(12),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection, schemaProperties /* , Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'skip': 0,
	      'take': Number.MAX_VALUE,
	      'filter': function () {
	        return true;
	      },
	      'orderby': [],
	      'select': [],
	      'column.sortable': {},
	    },
	    name: 'map-queryable',
	    beforeSet: function (local) {
	      if (_.has(local, 'filter')) {
	        if (!_.isFunction(local.filter)) {
	          local.filter = this.defaults.filter;
	        }
	      }
	    },
	    update: function (options) {
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
	
	        value = value
	          .rest(this.get('skip'))
	          .first(this.get('take'))
	          .value();
	
	        var select = this.get('select');
	        if (!_.size(select)) {
	          select = schemaProperties.from(value);
	        }
	
	        this.patch({
	          value: value,
	          select: select,
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(11)], __WEBPACK_AMD_DEFINE_RESULT__ = function (BaseProjection) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      seed: [],
	    },
	    update: function () {
	      this.trigger('update:beginning');
	
	      var value = this.get('seed');
	
	      this.data.set({
	        value: value,
	        count: value.length,
	      });
	
	      this.trigger('update:finished');
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(11),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection) {
	  var wrds = ['troubles', 'kahlua', 'poncho', 'suzie', 'baheyya'];
	  var idx = 0;
	
	  function randomRow() {
	    var wrd1 = wrds[_.random(0, wrds.length - 1)];
	    var wrd2 = wrds[_.random(0, wrds.length - 1)];
	
	    return {
	      index: idx++,
	      name: wrd1 + ' ' + wrd2,
	      age: _.random(0, 22),
	    };
	  }
	
	  var Model = BaseProjection.extend({
	    defaults: {
	      n: 5000,
	    },
	    name: 'mock',
	    update: function () {
	      this.trigger('update:beginning');
	      var value = [];
	
	      _(this.get('n')).times(function () {
	        value.push(randomRow());
	      });
	
	      this.data.set({
	        value: value,
	        count: value.length,
	      });
	      this.trigger('update:finished');
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(6),
	  __webpack_require__(11),
	  __webpack_require__(25),
	  __webpack_require__(14),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, $, BaseProjection, MemoryMock, schemaProperties) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      verb: 'get',
	      url: undefined,
	      skip: undefined,
	      take: undefined,
	      filter: undefined,
	      orderby: [],
	      select: [],
	    },
	    name: 'odata',
	    update: function () {
	      this.trigger('update:beginning');
	      var url = this.get('url');
	
	      url = _.isFunction(url) ? url() : url;
	      var op = {
	        url: url,
	        $format: 'json',
	      // todo [akamel] this is odata v3 specific
	        $count: true,
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
	        var key = _.keys(col);
	        var dir = col[key];
	
	        op.$orderby = key + ' ' + (dir > 0 ? 'asc' : 'desc');
	      }
	
	      $.getJSON(op.url, _.omit(op, 'url'))
	        .success(function (data) {
	          var delta = {
	            value: data.value,
	            select: schemaProperties.from(data.value),
	            count: data['@odata.count'],
	            error: undefined,
	          };
	
	          this.patch(delta);
	        }.bind(this))
	        .error(function (jqXHR, textStatus, errorThrown) {
	          var delta = { error: errorThrown };
	
	          this.patch(delta);
	        }.bind(this))
	        .complete(function () {
	          this.trigger('update:finished');
	        }.bind(this));
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(11),
	  __webpack_require__(14),
	  __webpack_require__(12),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'page.size': 20,
	      'page.number': 0, // zero based
	    },
	    name: 'page',
	    // todo [akamel] what if we piped after the data was set?
	    beforeSet: function (local, other) {
	      var size = _.has(local, 'page.size') ? local['page.size'] : this.get('page.size');
	      var number = _.has(local, 'page.number') ? local['page.number'] : this.get('page.number');
	
	      // todo [akamel] sanetize size and number here
	      size = Math.max(size, 0);
	      number = Math.max(number, 0);
	
	      _.extend(other, {
	        take: size,
	        skip: size * number,
	      });
	    },
	    update: function (options) {
	      var model = this.src.data;
	      var size = Math.max(this.get('page.size'), 0);
	      var count = Math.max(0, model.get('count'));
	
	      options = options || {};
	
	      if (options.deep) {
	        if (this.src) {
	          var number = Math.max(this.get('page.number'), 0);
	
	          this.src.set({
	            take: size,
	            skip: size * number,
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
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(11),
	  __webpack_require__(14),
	  __webpack_require__(12),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {
	      'property.template': {},
	    },
	    name: 'property-template',
	    update: function (options) {
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
	                property: key,
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
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(11),
	  __webpack_require__(30),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection, rowCheckTemp) {
	  'use strict';
	
	  var Model = BaseProjection.extend({
	    defaults: {
	      'column.checked': 'checkbox',   // the checkbox column
	      'row.check.id': 'Id',
	      'row.check.list': [],
	      'row.check.checked.all': false, // used to store user's check value for the special case no rows or all rows is disabled
	      'row.check.allow': function () {
	        return true;
	      },
	    },
	    name: 'row-check',
	    events: {
	      'layout:click:cell': 'tdClick',
	      'layout:click:header': 'thClick',
	    },
	    reset: function () {
	      this.set({
	        'row.check.checked.all': false,
	        'row.check.list': [],
	      });
	    },
	    update: function (options) {
	      // Model.__super__.update.call(this, options);
	
	      if (Model.__super__.update.call(this, options)) {
	        var checkId = this.get('row.check.id');
	        var ids = _.pluck(this.src.data.get('value'), checkId);
	        var checked = _.intersection(this.get('row.check.list'), ids);
	        var checkedLookup = _.object(checked, []);
	        var col = this.get('column.checked');
	        var columns = _.clone(this.src.data.get('columns'));
	        var checkedAll = true;
	        var hasCheckboxable = false;
	        var checkboxAllow = this.get('row.check.allow');
	        var checkboxColumn = _.find(columns, function (item) {
	          return item.property === col;
	        });
	
	        this.set('row.check.list', checked, { silent: true });
	
	        // todo [akamel] it is not clear how 'hasCheckboxable' is used
	        var value = _.map(this.src.data.get('value'), function (item) {
	          var ret = _.clone(item);
	          var checked = false;
	          var disabled = true;
	          var isAllowed = _.isFunction(checkboxAllow) ? checkboxAllow(ret) : checkboxAllow;
	
	          if (isAllowed) {
	            checked = _.has(checkedLookup, ret[checkId]);
	            checkedAll = checkedAll && checked;
	            disabled = false;
	            hasCheckboxable = true;
	          }
	
	          ret[col] = _.extend({}, ret[col], {
	            $html: rowCheckTemp({
	              checked: checked,
	              disabled: disabled,
	            }),
	          });
	
	          return ret;
	        });
	
	        // set the checkbox in th
	        if (!_.isUndefined(checkboxColumn)) {
	          var disabled = _.size(ids) === 0;
	          if (hasCheckboxable) {
	            checkboxColumn.$html = rowCheckTemp({
	              checked: checkedAll,
	              disabled: disabled,
	            });
	            this.attributes['row.check.checked.all'] = checkedAll;
	          } else {
	            checkboxColumn.$html = rowCheckTemp({
	              checked: this.get('row.check.checked.all'),
	              disabled: disabled,
	            });
	          }
	        }
	
	        this.patch({
	          value: value,
	          columns: columns,
	        });
	      } else {
	        // todo [akamel] unset our properties only
	        // this.unset();
	      }
	    },
	    tdClick: function (e, arg) {
	      var checkboxProperty = this.get('column.checked');
	
	      if (arg.property === checkboxProperty) {
	        var list = this.get('row.check.list');
	        var id = arg.model[this.get('row.check.id')];
	
	        this.set({
	          'row.check.list': arg.checked ? list.concat([id]) : _.without(list, id),
	        });
	
	        this.update();
	      }
	    },
	    thClick: function (e, arg) {
	      var checkboxProperty = this.get('column.checked');
	
	      if (arg.property === checkboxProperty) {
	        var list = [];
	
	        if (arg.checked) {
	          var checkId = this.get('row.check.id');
	          // TODO [akamel] this concept of check allow is strange
	          var checkboxAllow = this.get('row.check.allow');
	
	          // get the list of allowed rows' id
	          list = _.chain(this.data.get('value'))
	            .filter(function (item) {
	              return (_.isFunction(checkboxAllow) ? checkboxAllow(item) : checkboxAllow) && !_.isUndefined(item[checkId]);
	            })
	            .map(function (item) {
	              return item[checkId];
	            })
	            .value();
	        }
	
	        this.set({
	          'row.check.list': list,
	          'row.check.checked.all': arg.checked,
	        });
	
	        this.update();
	      }
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(20);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (checked, disabled) {
	if ( checked)
	{
	if ( disabled)
	{
	buf.push("<input type=\"checkbox\" checked disabled class=\"column-checkbox\">");
	}
	else
	{
	buf.push("<input type=\"checkbox\" checked class=\"column-checkbox\">");
	}
	}
	else
	{
	if ( disabled)
	{
	buf.push("<input type=\"checkbox\" disabled class=\"column-checkbox\">");
	}
	else
	{
	buf.push("<input type=\"checkbox\" class=\"column-checkbox\">");
	}
	}}.call(this,"checked" in locals_for_with?locals_for_with.checked:typeof checked!=="undefined"?checked:undefined,"disabled" in locals_for_with?locals_for_with.disabled:typeof disabled!=="undefined"?disabled:undefined));;return buf.join("");
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(3),
	  __webpack_require__(11),
	  __webpack_require__(14),
	  __webpack_require__(12),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
	  var Model = BaseProjection.extend({
	    defaults: {},
	    name: 'row-index',
	    update: function (options) {
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
	    },
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(11),
	  __webpack_require__(14),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, BaseProjection, schemaProperties) {
	  var Model = BaseProjection.extend({
	
	    defaults: {
	      seed: null,
	    },
	
	    name: 'sink',
	
	    update: function () {
	      var value;
	
	      value = this.get('seed');
	
	      if (value) {
	        var select = schemaProperties.from(value);
	        this.patch({
	          value: value,
	          select: select,
	          count: _.size(value),
	        });
	      }
	    },
	
	  });
	
	  return Model;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  TableLayout: __webpack_require__(34),
	  templates: {
	    table: __webpack_require__(35),
	  },
	  renderers: __webpack_require__(36),
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(2),
	  __webpack_require__(6),
	  __webpack_require__(3),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (_, $, Backbone) {
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
	      var virtualizer = this.get_renderer('virtualization');
	      var i = $tr.index() + (virtualizer ? virtualizer.first : 0);
	      var j = $td.index();
	      // TODO [akamel] 1- check if $td is th; 2- throw if el is neither th or td as it is assumed in this function
	      var isHeader = $td.closest('thead', this.el).length;
	      var ret = { header: isHeader };
	
	      // we are not in header
	      if (!isHeader) {
	        ret.model = this.data.value[i];
	      }
	
	      ret.column = this.data.columns[j];
	      ret.property = this.data.columns[j].property;
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
	      var columns = model.get('columns') || _.map(model.get('select'), function (i) {
	        return { property: i };
	      });
	      var colOptions = this.options.columns || {};
	      var orderby = {};
	
	      _.each(this.grid.projection.get('orderby'), function (element, index) {
	        var key = _.first(_.keys(element));
	        orderby[key] = {
	          dir: element[key],
	          index: index,
	        };
	      });
	
	      columns = _.filter(columns, function (col) {
	        return col.property.charAt(0) !== '$';
	      });
	
	      columns = _.map(columns, function (col) {
	      // TODO [akamel] consider filtering which props to copy/override
	        var delta = {};
	        if (orderby[col.property]) {
	          delta.$orderby = orderby[col.property];
	        }
	
	        return _.extend(col, colOptions[col.property], delta);
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(20);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function ($metadata, undefined, value) {
	jade_mixins["th"] = jade_interp = function(column){
	var block = (this && this.block), attributes = (this && this.attributes) || {};
	var attr = (column.$metadata || {})['attr.head'] || {}
	var cls = [];
	if ( column.sortable)
	{
	cls.push('sortable');
	}
	if ( column.$orderby)
	{
	cls.push('orderby');
	}
	cls = cls.join(' ');
	buf.push("<th" + (jade.attrs(jade.merge([{"class": (jade_interp = [true], jade.joinClasses([cls].map(jade.joinClasses).map(function (cls, i) {   return jade_interp[i] ? jade.escape(cls) : cls })))},attributes,attr]), true)) + ">");
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
	buf.push("</th>");
	};
	jade_mixins["td"] = jade_interp = function(row, column){
	var block = (this && this.block), attributes = (this && this.attributes) || {};
	var attr = (column.$metadata || {})['attr.body'] || {}
	buf.push("<td" + (jade.attrs(jade.merge([attributes,attr]), true)) + ">");
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
	buf.push("<table" + (jade.attrs(jade.merge([{"class": "table table-hover grid"},$metadata || {}]), true)) + "><thead><tr class=\"table__row--header\">");
	// iterate locals['columns'] || []
	;(function(){
	  var $$obj = locals['columns'] || [];
	  if ('number' == typeof $$obj.length) {
	
	    for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
	      var column = $$obj[index];
	
	jade_mixins["th"](column);
	    }
	
	  } else {
	    var $$l = 0;
	    for (var index in $$obj) {
	      $$l++;      var column = $$obj[index];
	
	jade_mixins["th"](column);
	    }
	
	  }
	}).call(this);
	
	buf.push("</tr></thead><tbody>");
	// iterate value
	;(function(){
	  var $$obj = value;
	  if ('number' == typeof $$obj.length) {
	
	    for (var i = 0, $$l = $$obj.length; i < $$l; i++) {
	      var row = $$obj[i];
	
	var attr = (row.$metadata || {}).attr
	buf.push("<tr" + (jade.attrs(jade.merge([{"class": "table__row--body"},attr]), true)) + ">");
	// iterate locals['columns'] || []
	;(function(){
	  var $$obj = locals['columns'] || [];
	  if ('number' == typeof $$obj.length) {
	
	    for (var j = 0, $$l = $$obj.length; j < $$l; j++) {
	      var column = $$obj[j];
	
	jade_mixins["td"](row, column);
	    }
	
	  } else {
	    var $$l = 0;
	    for (var j in $$obj) {
	      $$l++;      var column = $$obj[j];
	
	jade_mixins["td"](row, column);
	    }
	
	  }
	}).call(this);
	
	buf.push("</tr>");
	    }
	
	  } else {
	    var $$l = 0;
	    for (var i in $$obj) {
	      $$l++;      var row = $$obj[i];
	
	var attr = (row.$metadata || {}).attr
	buf.push("<tr" + (jade.attrs(jade.merge([{"class": "table__row--body"},attr]), true)) + ">");
	// iterate locals['columns'] || []
	;(function(){
	  var $$obj = locals['columns'] || [];
	  if ('number' == typeof $$obj.length) {
	
	    for (var j = 0, $$l = $$obj.length; j < $$l; j++) {
	      var column = $$obj[j];
	
	jade_mixins["td"](row, column);
	    }
	
	  } else {
	    var $$l = 0;
	    for (var j in $$obj) {
	      $$l++;      var column = $$obj[j];
	
	jade_mixins["td"](row, column);
	    }
	
	  }
	}).call(this);
	
	buf.push("</tr>");
	    }
	
	  }
	}).call(this);
	
	buf.push("</tbody></table>");}.call(this,"$metadata" in locals_for_with?locals_for_with.$metadata:typeof $metadata!=="undefined"?$metadata:undefined,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined,"value" in locals_for_with?locals_for_with.value:typeof value!=="undefined"?value:undefined));;return buf.join("");
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  FixedHeader: __webpack_require__(37),
	  Virtualization: __webpack_require__(40),
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(6),
	  __webpack_require__(2),
	  __webpack_require__(38),
	  __webpack_require__(39),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, _, measure, px) {
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
	        'padding-top': px.pixelify(px.parse(data.css['padding-top']) + displacement),
	      });
	
	      data.canSkipDraw = true;
	
	      // b. yield to render
	      cb(undefined, data);
	
	      // c. get newly rendered header
	      var $thead = $el.find('thead');
	      var $headTD = $el.find('thead > tr').children();
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
	      _.each($target, function (td, index) {
	        $(td).width(px.pixelify(this.colWidth[index]));
	      }.bind(this));
	
	      _.each($ref, function (td, index) {
	        $(td).width(px.pixelify(this.colWidth[index]));
	      }.bind(this));
	
	      // f. set position 'fixed' and lock header at top of table
	      $thead.find('tr').css({
	        'position': this.layout.container.el === window ? 'fixed' : 'absolute',
	        'top': px.pixelify(this.layout.container.el === window ? 0 : this.layout.container.$el.scrollTop()),
	        'display': 'flex',
	        'margin-left': px.pixelify(-data.vpMeasures.offsetLeft),
	        'z-index': 1000,
	      });
	    } else {
	      _.extend(data.css, {
	        'padding-top': px.pixelify(px.parse(data.css['padding-top'])),
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(6),
	  __webpack_require__(2),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, _) {
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// todo [akamel] move to /component
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
	    pixelify: pixelify,
	  };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// TODO [akamel] [bug] with large data set, jitters when scrolling to bottom
	
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(6),
	  __webpack_require__(2),
	  __webpack_require__(38),
	  __webpack_require__(39),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, _, measure, px) {
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
	
	      // b.1 set height based on measures estimate
	      this.layout.$el.css({
	        'padding-top': px.pixelify(this.__measures.estimateHeight),
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
/******/ ])
});
;
//# sourceMappingURL=projection-grid.js.map