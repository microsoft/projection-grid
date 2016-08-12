import Backbone from 'backbone';

class CustomView extends Backbone.View {
  events() {
    return {
      'click h2': () => console.log('click'),
    };
  }
  render() {
    this.$el.html('<h2>Custom View</h2>');
    return this;
  }
}

window.customView = new CustomView().render();

export default {
  headRows: [
    { view: window.customView },
    'column-header-rows',
  ],
};
