define([
      'lib/underscore'
    , 'lib/backbone'
    , 'component/grid/projection/base'
  ],
function(_, Backbone, BaseProjection){

  var wrds = ['troubles', 'kahlua', 'poncho', 'suzie', 'baheyya'];
  var idx = 0;

  function random_row() {
    var wrd1 = wrds[_.random(0, wrds.length - 1)];
    var wrd2 = wrds[_.random(0, wrds.length - 1)];

    return {
        index : idx++
      , name  : wrd1 + ' ' + wrd2
      , age   : _.random(0, 22)
    };
  };

  var Model = BaseProjection.extend({
    defaults : {
      n : 5000
    },
    name : 'mock',
    update : function(options) {
      this.trigger('update:beginning');
      var value = [];

      _(this.get('n')).times(function(n){
        value.push(random_row());
      }.bind(this));

      this.data.set({ value : value, count : value.length });
      this.trigger('update:finished');
    }
  });

  return Model;
});