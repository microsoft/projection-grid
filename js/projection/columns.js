import BaseProjection from './base';

const ColumnsProjection = BaseProjection.extend({
  defaults: {
    columns: {},
  },

  name: 'columns',

  update(options) {
    if (BaseProjection.prototype.update.call(this, options)) {
      this.patch({
        columns: this.get('columns'),
      });
    }
  },

});

export default ColumnsProjection;
