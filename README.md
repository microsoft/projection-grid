# projection-grid
Client side grid control in JavaScript using pipe and filter patterns. Our data starts its journey at a data-source (OData, Memory, Mock) and travels through multiple filters before it makes it to the grid renderer. Those filters are called 'projections'.

## Install
```bash
npm install --save projection-grid
```

## Usage

### As AMD
```javascript
require(['projection-grid'], function (pgrid) {
  var gridView = pgrid.factory().create({
    el: '.some-css-selector',
    dataSource: {
      type: 'js-data',
      resource: someJSDataResource,
    },
    columns: [
      { name: 'Foo' },
      { name: 'Bar', template: someTemplate },
    ],
  }).gridView;

  gridView.render();
});
```

### As CMD
```javascript
var pgrid = require('projection-grid');

var gridView = pgrid.factory().create({
  el: '.some-css-selector',
  dataSource: {
    type: 'js-data',
    resource: someJSDataResource,
  },
  columns: [
    { name: 'Foo' },
    { name: 'Bar', template: someTemplate },
  ],
}).gridView;

gridView.render();
```

## Play with the demos
```bash
git clone https://github.com/Microsoft/projection-grid
cd projection-grid
npm install
gulp demos
```

A demo server will start at http://localhost:8080/demos/, each sub-folders of
`demos` would be a standalone demo page.

The standard usage is demoed at http://localhost:8080/demos/factory

The source code is `demos/factory/index.js`.

## Configurations
The configuration object passed to `factory.create(...)`.

### `el`
The root element of the grid. It should be a CSS selector.

### `dataSource`
Data source of the grid. Tells grid where to get the row data.

### `dataSource.type`
The type of the data source. Only `'js-data'` is supported for now.

### `dataSource.resource`
An option of `'js-data'` data source which is a [JSData Resource][js-data-resource].

### `dataSource.schema`
An optional [JSON schema][json-schema] object specifying the schema of the row data.

### `columns`
An array of grid column configuration objects.

### `columns[].name`
The name of the column. By default, it's also the `title` showing in the column
header, the `field` of the cell data.

### `columns[].title`
The title showing in the column header. It overrides the `columns[].name`.

### `columns[].field`
The field of the cell data. It overrides the `columns[].name`.
In case you row data is in form of
```json
{
  "companyName": "Microsoft Corporation",
  "address": {
    "country": "USA",
    "state": "WA",
    "city": "Redmond",
    "street": "One Microsoft Way",
    "zip": "98053"
  }
}
```
* To reference the company name, the field should be `companyName`.
* To reference the zip code, the field should be `address/zip`.

### `columns[].value`
A function to calculate the cell value from the row data. It's used in complex
scenarios when the cell value is not a field of the row data. For example,
```javascript
// A column of combined address information
{
  name: 'address',
  value: function (rowData) {
    return [
      rowData.street,
      rowData.city,
      rowData.state,
      rowData.country,
      rowData.zip,
    ].join(', ');
  },
}
```

### `columns[].template`
A template function to generate the HTML in cells.

### `columns[].headerTemplate`
A template function to generate the HTML in column header.

### `columns[].attributes`
User defined attributes attached to the cells (`TD`).

### `columns[].headerAttributes`
User defined attributes attached to the column header (`TH`).

### `columns[].locked`
A boolean value specifies whether or not the column is locked.
Locked columns are always visible when column shifter is on.

### `columns[].sortable`
A boolean value specifies whether the column is sortable by clicking the header.

### `columns[].editable`
A boolean value specifies whether the cell data is editable with a pop up editor.

### `pageable`
Define the pagination behavior.

### `pageable.pageSize`
The default page size.

### `pageable.pageSizes`
An array of available page sizes.

### `selectable`
Boolean or string value. Available values are
* `false`, no selection support
* `true`, multiple selection, show a checkbox column to the left
* `'single'`, single selection, show a radio button column to the left

### `scrollable`
Scroll behavior configurations.

### `scrollable.virtual`
A boolean value telling whether or not the virtualization is turned on.

### `scrollable.fixedHeader`
Fixed header configuration. If it's a truthy value, the grid header will stick
to a container when scrolled out of it. The default container is the browser
window.

### `scrollable.fixedHeader.container`
A CSS selector specifying the container element the header sticks to.

### `columnShifter`
Column shifter configurations. Column shifter limit the number of visible
columns, and provide a pair of control button to shift the columns.

### `columnShifter.totalColumns`
The number of visible columns.

### `aggregate`
Configurations of aggregation rows

### `aggregate.top`
A function returning an array of aggregation row data for the rows showing on
top of the grid.

### `aggregate.bottom`
A function returning an array of aggregation row data for the rows showing at
the bottom of the grid.

## Create accessory views with plugins
The `factory.create(...)` method not only create the grid view, it can also
create accessory views, like pager, and hook them up. The factory plugins are
designed to handle this.

### Using a plugin
In case we have a `pagerView` defined in `pager-view-plugin.js`
(Refer to the factory demo). The code using it should be something like
```javascript
var pgrid = require('projection-grid');
// load the plugin
var pagerViewPlugin = require('./pager-view-plugin');

var grid = pgrid.factory()
  // use the plugin
  .use(pagerViewPlugin)
  .create({
    // the grid configurations
  });

var gridView = grid.gridView;
// get the view
var pagerView = grid.pagerView;

gridView.render();
pagerView.render();
```

It would be even simpler with ES2015.
```javascript
import pgrid from 'projection-grid';
import pagerViewPlugin from './pager-view-plugin';

const { gridView, pagerView } = pgrid.factory()
  .use(pagerViewPlugin)
  .create({
    /// the grid configurations
  });

gridView.render();
pagerView.render();
```

The object returned from `factory.create(...)` is a map, from plugin name to
it's product. Technically, the `gridView` is the product of a builtin plugin
called `'gridView'`.

### Developing a plugin
> To develop a grid factory plugin, you need to understand the projection grid
> internal concepts like projections, renderers, layouts etc.

A grid factory plugin is a function in form of
```javascript
function (definePlugin) {
  definePlugin('pluginName', [
    // name of dependent plugins
  ], function (/* product of dependent plugins */) {

    // create and return the product

  });
}
```
The `definePlugin` is a function similar to the `define` of AMD. It's defined by
the factory, having the factory context.

For example, the pager plugin is defined like this.
```javascript
import _ from 'underscore';
import { PaginationView } from 'pagination-control';

export default definePlugin => definePlugin('pagerView', [
  // builtin plugin, returning the configuration object
  'config',
  // builtin plugin, the chained projections of the grid
  'projection',
  // builtin plugin, the final grid view
  'gridView',
], function (config, projection, gridView) {

  // create the pager view
  const pagerView = new PaginationView(_.defaults({
    pageSize: config.pageable.pageSize,
    availablePageSizes: config.pageable.pageSizes,
  }, config.pagerView));

  // hook up the pager view with the grid and the projection chain
  gridView.on('change:data', function (model) {
    pagerView.itemCount = model.get('count');
  });

  pagerView.on('change:page-size', function (pageSize) {
    projection.set('page.size', pageSize);
  });

  pagerView.on('change:page-number', function (pageNumber) {
    projection.set('page.number', pageNumber);
  });

  // return the pager view
  return pagerView;
});
```

## Developer instructions

1. Create your own fork of the project
2. Clone your own fork of the project to local

  ```bash
  git clone https://github.com/your-github-user-name/projection-grid
  ```

3. Install dependencies

  ```bash
  cd projection-grid
  npm install
  ```

4. Launch demo server which watch and build your changes automatically

  ```bash
  gulp demos
  ```

5. Make changes with your favorite editor
6. Add unit test cases under `spec`
7. If necessary, add your own demo page under `demos`
8. Add selenium test cases under `demos/your-demo-page/spec`
9. Test your changes with

  ```bash
  gulp test
  ```

10. Commit your local changes and push to GitHub

  ```bash
  git add .
  git commit
  git push
  ```

11. Send pull request on GitHub and review it with the management team

[js-data-resource]: http://www.js-data.io/docs/resources
[json-schema]: http://json-schema.org/
