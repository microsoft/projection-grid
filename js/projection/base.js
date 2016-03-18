
define([
      'lib/underscore'
    , 'lib/backbone'
    , 'component/grid/model/response'
  ],
function(_, Backbone, Response) {
  var Model = Backbone.Model.extend({
      initialize: function(options) {
        _.bindAll(this, 'on_src_update', 'beforeSet', 'afterSet', 'update');

        this.data = new Response();

        this.src = undefined;

        this.on('change', function(model, options){
          // todo [akamel] the model here is the settings model
          this.update({ model : model });
        }.bind(this));
      }
    , constructor: function() {
        // used to figure out which options to set localy and which ones to pass down the pipe
        this.local_keys = _.keys(this.defaults);

        // todo [akamel] this might prevent us from overriding initialize
        Model.__super__.constructor.apply(this, arguments);
    }
    , pipe            : function(to) {
        if (to) {
          to.set_src(this);
        }

        return to;
     }
    , unpipe          : function() {
        to.set_src();

        return this;
     }
    , set_src         : function(src) {
        if (this.src) {
          this.src.data.off('change', this.on_src_update);
          this.src.off('all', this.bubble);
        }

        this.src = src;
        if (this.src) {
          this.src.data.on('change', this.on_src_update);
          this.src.on('all', this.bubble);
        }

        this.update();
    }
    , patch      : function(delta) {
        var src   = this.src? this.src.data.toJSON() : {}
          , delta = _.isObject(delta)? delta : {}
          ;

        this.data.set(_.defaults(delta, this.attributes, src));
    }
    , beforeSet        : function(local, other){}
    , afterSet         : function(){}
    , on_src_update    : function(model) {
        this.update(/*{ model : model }*/);
    }
    , bubble           : function(){
        var key = _.first(arguments);

        if (_.has(this.events, key)) {
          var fct = this[this.events[key]];
          if (_.isFunction(fct)) {
            fct.apply(this, _.rest(arguments))
          }
        }

        // todo [akamel] can this result in multiple redraw calls?
        if (this.src) {
          this.src.bubble.apply(this.src, _.toArray(arguments));
        }
    }
    , update           : function(options) {
        var options = options || {};

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

  Model.prototype.set = function(key, value, options) {
    var obj = {};

    if (_.isString(key)) {
      obj[key] = value;
    } else {
      obj = key;
      options = value;
    }

    var local       = _.pick(obj, this.local_keys)
      , other       = _.omit(obj, this.local_keys)
      ;

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

  Model.key_regex = /^([\w_\-$]+):(.+)$/;

  Model.prototype.get = function(key) {
    var match = Model.key_regex.exec(key);

    if (match) {
      var type = match[1]
        , name = match[2]
        ;

      switch(type) {
        case 'projection':
          var p = this;
          do {
            if (p.name == name) {
              return p;
            }
            p = p.src;
          } while(p);
        break;
        default:
        throw new Error('unknown special get key type');
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
});