(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("backbone"), require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "backbone", "knockout"], factory);
	else if(typeof exports === 'object')
		exports["pagination-control"] = factory(require("underscore"), require("backbone"), require("knockout"));
	else
		root["pagination-control"] = factory(root["underscore"], root["backbone"], root["knockout"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
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
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _paginationView = __webpack_require__(1);
	
	Object.defineProperty(exports, 'PaginationView', {
	  enumerable: true,
	  get: function get() {
	    return _paginationView.PaginationView;
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.PaginationView = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _underscore = __webpack_require__(2);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _knockoutView = __webpack_require__(3);
	
	var _knockoutView2 = _interopRequireDefault(_knockoutView);
	
	var _default = __webpack_require__(6);
	
	var _default2 = _interopRequireDefault(_default);
	
	var _paginationViewModel = __webpack_require__(9);
	
	var _paginationViewModel2 = _interopRequireDefault(_paginationViewModel);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var PaginationView = exports.PaginationView = function (_KnockoutView) {
	  _inherits(PaginationView, _KnockoutView);
	
	  function PaginationView() {
	    _classCallCheck(this, PaginationView);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(PaginationView).apply(this, arguments));
	  }
	
	  _createClass(PaginationView, [{
	    key: 'initialize',
	    value: function initialize(_ref) {
	      var _this2 = this;
	
	      var _ref$pageSize = _ref.pageSize;
	      var
	      // for view model
	      pageSize = _ref$pageSize === undefined ? 20 : _ref$pageSize;
	      var _ref$pageNumber = _ref.pageNumber;
	      var pageNumber = _ref$pageNumber === undefined ? 0 : _ref$pageNumber;
	      var _ref$itemCount = _ref.itemCount;
	      var itemCount = _ref$itemCount === undefined ? 0 : _ref$itemCount;
	      var _ref$availablePageSiz = _ref.availablePageSizes;
	      var availablePageSizes = _ref$availablePageSiz === undefined ? [20, 50, 100, 200] : _ref$availablePageSiz;
	      var _ref$pageSizeText = _ref.pageSizeText;
	      var pageSizeText = _ref$pageSizeText === undefined ? 'Page size: ' : _ref$pageSizeText;
	      var _ref$totalPageCountTe = _ref.totalPageCountText;
	      var totalPageCountText = _ref$totalPageCountTe === undefined ? 'of ' : _ref$totalPageCountTe;
	      var _ref$viewModelDecorat = _ref.viewModelDecorator;
	      var viewModelDecorator = _ref$viewModelDecorat === undefined ? _underscore2.default.identity : _ref$viewModelDecorat;
	      var _ref$template = _ref.template;
	      var template = _ref$template === undefined ? _default2.default : _ref$template;
	
	      _get(Object.getPrototypeOf(PaginationView.prototype), 'initialize', this).call(this, {
	        state: {
	          pageSize: pageSize,
	          pageNumber: pageNumber,
	          itemCount: itemCount,
	          availablePageSizes: availablePageSizes
	        },
	        template: template,
	        ViewModel: _paginationViewModel2.default,
	        config: {
	          pageSizeText: pageSizeText,
	          totalPageCountText: totalPageCountText
	        }
	      });
	
	      viewModelDecorator(this.viewModel);
	
	      this.viewModel.pageSize.subscribe(function (pageSize) {
	        return _this2.trigger('change:page-size', pageSize);
	      });
	      this.viewModel.pageNumber.subscribe(function (pageNumber) {
	        return _this2.trigger('change:page-number', pageNumber);
	      });
	      this.viewModel.itemCount.subscribe(function (itemCount) {
	        return _this2.trigger('change:item-count', itemCount);
	      });
	    }
	  }, {
	    key: 'pageSize',
	    get: function get() {
	      return this.viewModel.pageSize();
	    },
	    set: function set(pageSize) {
	      this.viewModel.pageSize(pageSize);
	    }
	  }, {
	    key: 'itemCount',
	    get: function get() {
	      return this.itemCount();
	    },
	    set: function set(itemCount) {
	      this.viewModel.itemCount(itemCount);
	    }
	  }, {
	    key: 'pageNumber',
	    get: function get() {
	      return this.viewModel.pageNumber();
	    },
	    set: function set(pageNumber) {
	      this.viewModel.pageNumber(pageNumber);
	    }
	  }, {
	    key: 'availablePageSizes',
	    get: function get() {
	      return this.viewModel.availablePageSizes();
	    },
	    set: function set(availablePageSizes) {
	      this.viewModel.availablePageSizes(availablePageSizes);
	    }
	  }]);

	  return PaginationView;
	}(_knockoutView2.default);

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
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _backbone = __webpack_require__(4);
	
	var _backbone2 = _interopRequireDefault(_backbone);
	
	var _knockout = __webpack_require__(5);
	
	var _knockout2 = _interopRequireDefault(_knockout);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var KnockoutView = function (_Backbone$View) {
	  _inherits(KnockoutView, _Backbone$View);
	
	  function KnockoutView() {
	    _classCallCheck(this, KnockoutView);
	
	    return _possibleConstructorReturn(this, Object.getPrototypeOf(KnockoutView).apply(this, arguments));
	  }
	
	  _createClass(KnockoutView, [{
	    key: 'initialize',
	    value: function initialize(_ref) {
	      var _ref$template = _ref.template;
	      var template = _ref$template === undefined ? function () {
	        return '';
	      } : _ref$template;
	      var _ref$ViewModel = _ref.ViewModel;
	      var ViewModel = _ref$ViewModel === undefined ? function () {
	        function _class() {
	          _classCallCheck(this, _class);
	        }
	
	        return _class;
	      }() : _ref$ViewModel;
	      var _ref$state = _ref.state;
	      var state = _ref$state === undefined ? {} : _ref$state;
	      var _ref$config = _ref.config;
	      var config = _ref$config === undefined ? {} : _ref$config;
	
	      this.template = template;
	      this.viewModel = new ViewModel(state);
	      this.config = config;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.el.innerHTML = this.template(this.config);
	      _knockout2.default.applyBindings(this.viewModel, this.el);
	
	      return this;
	    }
	  }, {
	    key: 'remove',
	    value: function remove() {
	      _knockout2.default.clearNode(this.el);
	      _get(Object.getPrototypeOf(KnockoutView.prototype), 'remove', this).call(this);
	    }
	  }]);
	
	  return KnockoutView;
	}(_backbone2.default.View);
	
	exports.default = KnockoutView;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(7);
	
	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (pageSizeText, totalPageCountText) {
	buf.push("<form class=\"form-inline\"><span>" + (jade.escape(null == (jade_interp = pageSizeText) ? "" : jade_interp)) + "</span><select data-bind=\"options: availablePageSizes, value: pageSizeInput\" class=\"form-control\"></select><div class=\"input-group\"><span class=\"input-group-btn\"><button data-bind=\"click: decPageNumber\" type=\"button\" class=\"btn btn-default\"><div class=\"glyphicon glyphicon-triangle-left\"></div></button></span><input data-bind=\"value: pageNumberText, attr: { size: pageNumberSize, maxlength: pageNumberSize }\" type=\"text\" class=\"form-control\"><span class=\"input-group-addon\"><span>" + (jade.escape(null == (jade_interp = totalPageCountText) ? "" : jade_interp)) + "</span><span data-bind=\"text: pageCount\"></span></span><div class=\"input-group-btn\"><button data-bind=\"click: incPageNumber\" type=\"button\" class=\"btn btn-default\"><div class=\"span glyphicon glyphicon-triangle-right\"></div></button></div></div></form>");}.call(this,"pageSizeText" in locals_for_with?locals_for_with.pageSizeText:typeof pageSizeText!=="undefined"?pageSizeText:undefined,"totalPageCountText" in locals_for_with?locals_for_with.totalPageCountText:typeof totalPageCountText!=="undefined"?totalPageCountText:undefined));;return buf.join("");
	}

/***/ },
/* 7 */
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
	    str = str || __webpack_require__(8).readFileSync(filename, 'utf8')
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
/* 8 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _underscore = __webpack_require__(2);
	
	var _underscore2 = _interopRequireDefault(_underscore);
	
	var _knockout = __webpack_require__(5);
	
	var _knockout2 = _interopRequireDefault(_knockout);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var parseInt = Number.parseInt || window.parseInt;
	
	function isInteger(n) {
	  return n === parseInt(n, 10);
	}
	
	function isFiniteInteger(n) {
	  return isFinite(n) && isInteger(n);
	}
	
	var _class = function () {
	  function _class(options) {
	    var _this = this;
	
	    _classCallCheck(this, _class);
	
	    var pageNumber = options.pageNumber;
	    var pageSize = options.pageSize;
	    var itemCount = options.itemCount;
	    var availablePageSizes = options.availablePageSizes;
	
	
	    this.validate(options);
	
	    // All numbers / calculations in this model are
	    // base 0; so page 0 is the first page
	    this.pageSize = _knockout2.default.observable(pageSize);
	    this.itemCount = _knockout2.default.observable(itemCount);
	    this.pageNumber = _knockout2.default.observable(pageNumber);
	    this.availablePageSizes = _knockout2.default.observableArray(availablePageSizes);
	
	    this.pageSizeInput = _knockout2.default.computed({
	      read: function read() {
	        return _this.pageSize();
	      },
	      write: function write(value) {
	        if (isInteger(value)) {
	          _this.pageSize(value);
	          _this.pageNumberInput(_this.pageNumber());
	        }
	      }
	    });
	
	    this.pageCount = _knockout2.default.computed(function () {
	      return Math.ceil(_this.itemCount() / _this.pageSize());
	    });
	    this.pageNumberInput = _knockout2.default.computed({
	      read: function read() {
	        return _this.pageNumber();
	      },
	      write: function write(value) {
	        if (isInteger(value)) {
	          _this.pageNumber(Math.min(Math.max(value, 0), _this.pageCount() - 1));
	        }
	      }
	    });
	    this.pageNumberText = _knockout2.default.computed({
	      read: function read() {
	        return (_this.pageNumberInput() + 1).toString();
	      },
	      write: function write(value) {
	        var intValue = parseInt(value, 10) - 1;
	        if (isInteger(intValue)) {
	          _this.pageNumberInput(intValue);
	        } else {
	          _this.pageNumberInput.notifySubscribers();
	          _this.pageNumberText.notifySubscribers();
	        }
	      }
	    });
	    this.pageNumberSize = _knockout2.default.computed(function () {
	      return Math.floor(_this.pageCount().toString().length);
	    });
	
	    this.skip = _knockout2.default.computed(function () {
	      return _this.pageNumber() * _this.pageSize();
	    });
	    this.take = _knockout2.default.computed(function () {
	      return _this.pageSize();
	    });
	    // initialize the
	  }
	
	  _createClass(_class, [{
	    key: 'incPageNumber',
	    value: function incPageNumber() {
	      this.pageNumberInput(this.pageNumber() + 1);
	    }
	  }, {
	    key: 'decPageNumber',
	    value: function decPageNumber() {
	      this.pageNumberInput(this.pageNumber() - 1);
	    }
	  }, {
	    key: 'validate',
	    value: function validate(_ref) {
	      var pageNumber = _ref.pageNumber;
	      var pageSize = _ref.pageSize;
	      var itemCount = _ref.itemCount;
	      var availablePageSizes = _ref.availablePageSizes;
	
	      if (!isFiniteInteger(pageNumber) || pageNumber < 0) {
	        throw new Error('invalid pageNumber ' + pageNumber);
	      }
	
	      if (!isFiniteInteger(pageSize) || pageSize <= 0) {
	        throw new Error('invalid pageSize ' + pageSize);
	      }
	
	      if (!isFiniteInteger(itemCount) || itemCount < 0) {
	        throw new Error('invalid itemCount ' + itemCount);
	      }
	
	      if (pageNumber > 0 && pageNumber * pageSize >= itemCount) {
	        throw new Error('pageNumber ' + pageNumber + ' out of range');
	      }
	
	      if (!_underscore2.default.isArray(availablePageSizes)) {
	        throw new Error('availablePageSizes should be an array');
	      }
	
	      _underscore2.default.each(availablePageSizes, function (size) {
	        if (!isFiniteInteger(size) || size < 0) {
	          throw new Error('invalid size ' + size + ' in availablePageSizes');
	        }
	      });
	    }
	  }]);

	  return _class;
	}();

	exports.default = _class;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=pagination-control.js.map