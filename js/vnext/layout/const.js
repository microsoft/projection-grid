import _ from 'underscore';
import { escapeAttr } from './escape';

import tableStickyTemplate from './table-sticky.jade';
import flexStickyTemplate from './flex-sticky.jade';
import tableFixedTemplate from './table-fixed.jade';
import flexFixedTemplate from './flex-fixed.jade';
import tableStaticTemplate from './table-static.jade';
import flexStaticTemplate from './flex-static.jade';

import tableRowTemplate from './row.jade';
import flexRowTemplate from './flex-row.jade';

import tableHeaderFooterTemplate from './header-footer.jade';
import flexHeaderFooterTemplate from './flex-header-footer.jade';

export const LAYOUT = {
  table: 'table',
  flex: 'flex',
};

// sticky/static/fixed header type
export const stickyTemplate = {
  [LAYOUT.table]: tableStickyTemplate,
  [LAYOUT.flex]: flexStickyTemplate,
};

export const fixedTemplate = {
  [LAYOUT.table]: tableFixedTemplate,
  [LAYOUT.flex]: flexFixedTemplate,
};
export const staticTemplate = {
  [LAYOUT.table]: tableStaticTemplate,
  [LAYOUT.flex]: flexStaticTemplate,
};

// header footer template
export const headerFooterTemplate = {
  [LAYOUT.table]: tableHeaderFooterTemplate,
  [LAYOUT.flex]: flexHeaderFooterTemplate,
};

// row template
export const rowTemplateWithEscape = {
  [LAYOUT.table]: row => tableRowTemplate(_.defaults({ escapeAttr }, row)),
  [LAYOUT.flex]: row => flexRowTemplate(_.defaults({ escapeAttr }, row)),
};

// selector
export const colgroupSelector = {
  [LAYOUT.table]: 'colgroup.column-group',
  [LAYOUT.flex]: '.colgroup.column-group',
};
export const headerSelector = {
  [LAYOUT.table]: 'thead.header',
  [LAYOUT.flex]: '.thead.header',
};
export const footerSelector = {
  [LAYOUT.table]: 'tfoot.footer',
  [LAYOUT.flex]: '.tfoot.footer',
};
export const stickyHeaderFillerTableSelector = {
  [LAYOUT.table]: '.sticky-header-filler + table',
  [LAYOUT.flex]: '.sticky-header-filler + .table',
};
export const viewportTableSelector = {
  [LAYOUT.table]: '.viewport > table',
  [LAYOUT.flex]: '.viewport > .table',
};
