import _ from 'underscore';
import $ from 'jquery';
import Backbone from 'backbone';
import { escapeAttr } from './escape';
import { LAYOUT, headerFooterTemplate } from './const';
import flexHeadCell from './flex-head-cell.jade';

const subviewClass = i => `header-subview-${i}`;
const subviewSelector = i => `.${subviewClass(i)}`;
const columnNameClass = name => `column-name-${name}`;
const columnPlaceholderSelector = name => `.${columnNameClass(name)} +.column-group-placeholder`;

class HeaderFooterView extends Backbone.View {
  initialize({ tableView, group, layout }) {
    this.tableView = tableView;
    this.group = group;
    this.subviews = [];
    this.layout = layout;
    this.headerFooterTemplate = headerFooterTemplate[layout];
  }

  redraw() {
    _.each(this.subviews, subview => subview.$el.detach());

    this.subviews = [];

    this.rowsWithClass = _.map(this.rows, row => {
      const cells = _.map(row.cells, cell => {
        if (cell.view) {
          const classes = _.union(cell.classes, [
            subviewClass(this.subviews.length),
          ]);
          this.subviews.push(cell.view);
          return _.defaults({ classes }, cell);
        }

        const classes = _.union(cell.classes, [columnNameClass(cell.name)]);
        return _.defaults({ classes }, cell);
      });

      return _.defaults({ cells }, row);
    });

    if (this.layout === LAYOUT.flex) {
      const hasParentcells = [];
      const rowsFiltered = _.filter(_.map(this.rowsWithClass, row => {
        const noParentCells = [];
        _.each(row.cells, cell => {
          if (!_.isEmpty(cell.parentName) && cell.parentName !== '__root__') {
            hasParentcells.push(cell);
          } else {
            noParentCells.push(cell);
          }
        });
        return _.defaults({ cells: noParentCells }, row);
      }), row => !_.isEmpty(row.cells));

      this.$el.html(_.map(rowsFiltered, row => this.template(row)).join(''));

      _.each(hasParentcells, cell => {
        const cellHtml = $(flexHeadCell({ cell, escapeAttr }));
        this.$(columnPlaceholderSelector(cell.parentName)).append(cellHtml);
      });
    } else if (this.layout === LAYOUT.table){
      this.$el.html(_.map(this.rowsWithClass, row => this.template(row)).join(''));
    }

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
    return this.headerFooterTemplate(_.defaults({ row: model, group: 'head', escapeAttr }));
  }
}

export class FooterView extends HeaderFooterView {
  get rows() {
    return this.tableView._state.footRows;
  }

  template(model) {
    return this.headerFooterTemplate(_.defaults({ row: model, group: 'foot', escapeAttr }));
  }
}

