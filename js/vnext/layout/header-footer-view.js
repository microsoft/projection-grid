import _ from 'underscore';
import Backbone from 'backbone';
import { escapeAttr } from './escape';
import { headerFooterTemplate } from './const';

const subviewClass = i => `header-subview-${i}`;
const subviewSelector = i => `.${subviewClass(i)}`;

class HeaderFooterView extends Backbone.View {
  initialize({ tableView, group, layout }) {
    this.tableView = tableView;
    this.group = group;
    this.subviews = [];
    this.headerFooterTemplate = headerFooterTemplate[layout];
  }

  redraw() {
    _.each(this.subviews, subview => subview.$el.detach());
    this.subviews = [];
    this.$el.html(this.template({
      rows: _.map(this.rows, row => {
        const cells = _.map(row.cells, cell => {
          if (cell.view) {
            const classes = _.union(cell.classes, [
              subviewClass(this.subviews.length),
            ]);
            this.subviews.push(cell.view);
            return _.defaults({ classes }, cell);
          }
          return cell;
        });

        return _.defaults({ cells }, row);
      }),

      group: this.group,
    }));

    _.each(this.subviews, (subview, i) => {
      subview.$el.appendTo(this.$(subviewSelector(i)));
    });
  }

  render() {
    this.redraw();
    return this;
  }
}

export class HeaderView extends HeaderFooterView {
  get rows() {
    return this.tableView._state.headRows;
  }

  template(model) {
    return this.headerFooterTemplate(_.defaults({ group: 'head', escapeAttr }, model));
  }
}

export class FooterView extends HeaderFooterView {
  get rows() {
    return this.tableView._state.footRows;
  }

  template(model) {
    return this.headerFooterTemplate(_.defaults({ group: 'foot', escapeAttr }, model));
  }
}

