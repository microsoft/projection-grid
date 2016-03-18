define([
      'lib/underscore'
    , 'lib/backbone'
    , 'component/grid/projection/base'
    , 'component/grid/schema/properties'
    , 'component/grid/model/response'
  ],
function(_, Backbone, BaseProjection, schema_properties, Response){
  var Model = BaseProjection.extend({
    defaults : {
        'page.size'   : 20
      , 'page.number' : 0 // zero based
    },
    name : 'page',
    // todo [akamel] what if we piped after the data was set?
    beforeSet : function(local, other){
      var size    = _.has(local, 'page.size')? local['page.size'] : this.get('page.size')
        , number  = _.has(local, 'page.number')? local['page.number'] : this.get('page.number')
        ;

      // todo [akamel] sanetize size and number here
      size    = Math.max(size, 0);
      number  = Math.max(number, 0);

      _.extend(other, {
          take  : size
        , skip  : size * number
      });
    },
    update : function(options) {
      var options = options || {};

      if (options.deep) {
        if (this.src) {
          var size    = Math.max(this.get('page.size'), 0)
            , number  = Math.max(this.get('page.number'), 0)
            ;

          this.src.set({
              take  : size
            , skip  : size * number
          }, { silent : true });
        }
      }

      // Model.__super__.update.call(this, options);

      // if we came in with an update:deep
      if (Model.__super__.update.call(this, options)) {
        var model       = this.src.data
          , count       = Math.max(0, model.get('count'))
          , size        = this.get('page.size')
          , page_count  = Math.ceil(count / size)
          ;

        this.patch({
            'page.count' : page_count
        });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    }
  });

  return Model;
});