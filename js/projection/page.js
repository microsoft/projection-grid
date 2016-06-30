define([
  'lib/underscore',
  'lib/backbone',
  'component/grid/projection/base',
  'component/grid/schema/properties',
  'component/grid/model/response',
], function (_, Backbone, BaseProjection /* , schemaProperties, Response */) {
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
      var number = Math.max(this.get('page.number'), 0);
      var pageCount = Math.ceil(count / size);
      var pageNumber = Math.min(number, pageCount - 1);

      options = options || {};

      if (options.deep) {
        if (this.src) {
          this.src.set({
            take: size,
            skip: size * pageNumber,
          }, { silent: true });
        }
      }

      // Model.__super__.update.call(this, options);

      // if we came in with an update:deep
      if (Model.__super__.update.call(this, options)) {
        this.patch({ 'page.count': pageCount });
      } else {
        // todo [akamel] unset our properties only
        // this.unset();
      }
    },
  });

  return Model;
});
