import _ from 'underscore';
import Backbone from 'backbone';

class ListView extends Backbone.View {
  initialize({
    listTemplate,
    itemTemplate,
    items,
  }) {
    this.listTemplate = listTemplate;
    this.itemTemplate = itemTemplate;
    this.items = items;
  }

  reset({ items }) {
    this.$container.html(_.map(items, itemTemplate).join(''));
  }

  render() {
    this.$el.html(this.listTemplate());
    this.$container = this.$('.list-container');
    console.log(this.$container);
    let inner = _.map(this.items, this.itemTemplate);
    console.log(inner);
    this.$container.html(_.map(this.items, this.itemTemplate).join(''));
    return this;
  }
  
}

export default ListView;
