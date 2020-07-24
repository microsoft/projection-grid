import Backbone from 'backbone';

class CustomView extends Backbone.View {
  events() {
    return {
      'click button': () => {
        console.log('click');
        this.$el.find('.text').val('test view');
      },
    };
  }
  render() {
    this.$el.html(`<h2>This is a Backbone View Row.</h2><button>Click</button><input class="text" />`);
    return this;
  }
}

window.customView = new CustomView().render();

export default {
  headRows: [
    { view: window.customView },
    { html: '<h3>This a html row</h3>' },
    'column-header-rows',
  ],
};
