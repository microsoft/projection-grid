require([
  'projection-grid',
  'underscore',
  'jquery',
  'pagination-control',
  './northwind-schema',
], function (pgrid, _, $, pager, s$Northwind) {
  var Grid = pgrid.GridView;
  var PaginationView = pager.PaginationView;

  // projections
  // var MemoryQueryableProjection = pgrid.projections.MemoryQueryable;
  var ColumnQueryableProjection = pgrid.projections.ColumnQueryable;
  var ColumnI18NProjection = pgrid.projections.ColumnI18n;
  var ColumnShifterProjection = pgrid.projections.ColumnShifter;
  var PropertyTemplateProjection = pgrid.projections.PropertyTemplate;
  var MapProjection = pgrid.projections.Map;
  var PageProjection = pgrid.projections.Page;
  var OdataSource = pgrid.projections.Odata;
  // var MockSource = pgrid.projections.Mock;
  var RowCheckboxProjection = pgrid.projections.RowCheckbox;
  var RowTriStateCheckboxProjection = pgrid.projections.RowTriStateCheckboxProjection;
  var RowIndexProjection = pgrid.projections.RowIndex;
  var AggregateRow = pgrid.projections.AggregateRow;
  var ColumnGroup = pgrid.projections.ColumnGroup;
  var EditableProjection = pgrid.projections.Editable;
  var ColumnTemplate = pgrid.projections.ColumnTemplate;
  // layout
  var TableLayout = pgrid.layout.TableLayout;
  var tmplJade = pgrid.layout.templates.table;
  // pagination
  // Pagination,
  // PaginationTmpl,
  // connectors
  // PaginationConnector,
  // renders
  var Virtualization = pgrid.layout.renderers.Virtualization;
  var FixedHeader = pgrid.layout.renderers.FixedHeader;
  // schema
  // cat

  // Button,
  // Dropdown,
  // ButtonMenuItem,
  // DividerMenuItem,
  // HeaderMenuItem,
  // RadioGroupMenuItem,
  // RadioMenuItem,
  // SubMenuItem,
  // FilterInput,
  // GridToolbarItemContainer,
  // GridToolbar

  // function createToolbar() {
  //   var gridViewDropdownMenu = new Dropdown({
  //     title: 'Grid view',
  //     menuItems: [
  //       new RadioGroupMenuItem({items: [
  //         new RadioMenuItem({text: 'In Window'}),
  //         new RadioMenuItem({text: 'In Container'})
  //       ]}),
  //     ]
  //   });
  //
  //   function getGridViewStyle(menuItem) {
  //     return menuItem.getText() === 'In Window' ? 'window' : 'element';
  //   }
  //
  //   function getCheckboxMode(menuItem) {
  //     return menuItem.getText() === 'Two-state' ? 'two-state' : 'tri-state';
  //   }
  //
  //   var checkboxDropdownMenu = new Dropdown({
  //     title: 'Checkbox mode',
  //     menuItems: [
  //       new RadioGroupMenuItem({items: [
  //         new RadioMenuItem({text: 'Two-state'}),
  //         new RadioMenuItem({text: 'Tri-state'})
  //       ]}),
  //     ]
  //   });
  //
  //   gridViewDropdownMenu.getMenuItem(0).on('change:selection', function(group, item) {
  //     setGridViewStyle(item.getText() === 'In Window' ? 'window': 'element');
  //     setGridViewStyle(getGridViewStyle(item), getCheckboxMode(checkboxDropdownMenu.getMenuItem(0).checkedItem));
  //   });
  //
  //   checkboxDropdownMenu.getMenuItem(0).on('change:selection', function(group, item) {
  //     setGridViewStyle(getGridViewStyle(gridViewDropdownMenu.getMenuItem(0).checkedItem), getCheckboxMode(item));
  //   });
  //
  //   var buttonMenu = new Button({text: 'Click Me', leftIconClass: 'icon-export-normal'});
  //   buttonMenu.on('click', function() {
  //     alert('The button is clicked!');
  //   });
  //
  //   var dropdownMenu = new Dropdown({
  //     title: "Hello World",
  //     menuItems: [
  //       new HeaderMenuItem({text: "Header"}),
  //       new ButtonMenuItem({text: "hello", linkText: 'Remove'}),
  //       new DividerMenuItem(),
  //       new ButtonMenuItem({text: "world"}),
  //       new RadioGroupMenuItem({items: [
  //         new RadioMenuItem({text: "radio1", linkText: "Remove"}),
  //         new RadioMenuItem({text: "radio2", linkText: "Remove"})
  //       ]}),
  //       new SubMenuItem({text: 'The Sub MenuItem', children: [
  //         new ButtonMenuItem({text: 'Good Study'}),
  //         new ButtonMenuItem({text: 'Hello World'}),
  //         new ButtonMenuItem({text: 'Nimei HAHAH'}),
  //       ]}),
  //     ]
  //   });
  //   dropdownMenu.getMenuItem(4).on('click:link', function(group, item) {
  //     group.removeItem(item);
  //   });
  //   dropdownMenu.on('click:link', function(button, item) {
  //     button.removeMenuItem(item);
  //   });
  //
  //   var filterInput = new FilterInput({placeholder: "Hello World"});
  //   filterInput.on('change', function(button, filterVal) {
  //     button.setValue('Apply!');
  //   });
  //   return new GridToolbar({items: [gridViewDropdownMenu, buttonMenu, dropdownMenu, filterInput]});
  //   return new GridToolbar({items: [gridViewDropdownMenu, checkboxDropdownMenu, buttonMenu, dropdownMenu, filterInput]});
  // }

  // var pagination = new Pagination({
  //   el: $('#pagination_host_a'),
  //   template: PaginationTmpl,
  //   // , model     : {
  //   //       page_size   : 10
  //   //     , page_number : 0
  //   //     , item_count  : 132
  //   //   }
  // }).render();

  function createDataSource(checkboxMode) {
    var src;
    var odata = new OdataSource({
      url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
    });

    var map = new MapProjection({
      map: function (item) {
        var names = (item.name || item.ContactName || item.ShipName).split(' ');

        return [_.extend({}, item, {
          first: names[0],
          last: names[1],
          email: names[0] + '.' + names[1] + '@outlook.com',
          $metadata: {
            attr: { class: ['table__row--standard'] },
          },
        }), _.extend({}, {
          first: names[0],
          last: names[1],
          email: names[0] + '.' + names[1] + '@outlook.com',
          $metadata: {
            attr: { class: ['table__row--segment'] },
            type: 'segmentation',
          },
        })];
      },
    });

    // TODO [akamel] also support not-in
    var colq = new ColumnQueryableProjection({
      'column.lock': ['rowIndex', 'first', 'checkbox'],
      'column.take': 10,
      // , 'column.in'   : [ 'last', 'email', 'CustomerID', 'ShipCity', 'ShipCountry' ]
    });
    // TODO [akamel] make headers accept html
    // TODO [akamel] consider design to support merged columns multiple columns undr a seperate one
    var coli18n = new ColumnI18NProjection({
      'column.i18n': {
        'name': 'Name',
        'first': function (name) {
          return (_.first(name) || '').toUpperCase() + _.rest(name).join('');
        },
        '': function (name) {
          return '$' + name;
        },
      },
    });

    var group = new ColumnGroup({
      "column.group": {
        OrderDate: ['RequiredDate', 'ShippedDate'],
      },
      'column.groupExpansion': ['OrderDate'],
    });

    var colshifter = new ColumnShifterProjection();
    var proptmpl = new PropertyTemplateProjection({
      'property.template': {
        email: function (local) {
          return '<a href="http://google.com">' + local.model[local.property] + '</a>';
        },
        ShipName: function (local) {
          return '<span style="padding-left: 100px">' + local.model[local.property] + '</span>';
        },
        ShipPostalCode: function (local) {
          return '<span style="padding-left: 200px">' + local.model[local.property] + '</span>';
        },
      },
    });
    var page = new PageProjection({
      'page.size': 200,
      'page.number': 0,
    });
    var rowindex = new RowIndexProjection();
    var aggregateRow = new AggregateRow({
      'aggregate.top': function (data) {
        var items = data.get('value');

        return [{
          first: 'top: ' + items.length,
          $metadata: {
            attr: { class: ['table__row--aggregate'] },
          },
        }, {
          first: 'number of rows: ' + items.length,
          $metadata: {
            attr: { class: ['table__row--aggregate'] },
          },
        }];
      },
      'aggregate.bottom': function (data) {
        var items = data.get('value');

        return [{
          first: 'bottom: ' + items.length,
          $metadata: {
            attr: { class: ['table__row--aggregate'] },
          },
        }];
      },
    });
    var editable = new EditableProjection({
      'column.editable': ['OrderID', 'Freight'],
    });
    var checkbox = null;

    if (checkboxMode === 'tri-state') {
      checkbox = new RowTriStateCheckboxProjection({
        'row.check.id': 'CustomerID',
        'column.checked': 'checkbox',
      });
      var preCheckedIds = ['VINET', 'VICTE', 'TOMSP'];
      var preCheckMap = _.object(
        preCheckedIds.map(function (id) {
          return [id, {
            state: 'indeterminate',
            transition: RowTriStateCheckboxProjection.CheckTransitionRule.indeterminateToCheckedFullCycle,
          }];
        })
      );
      checkbox.set('row.check.map', _.clone(preCheckMap));
      console.log('row.check.map ORIGINAL', preCheckMap);
      var stats = RowTriStateCheckboxProjection.statCheckMap(preCheckMap);
      console.log('row.check.map STATS', stats);

      checkbox.on('change:row.check.map', function (model, checkMap) {
        console.log('change:row.check.map', checkMap);
        var diff = RowTriStateCheckboxProjection.diffCheckMap(preCheckMap, checkMap);
        console.log('change:row.check.map DIFF', diff);
        var stats = RowTriStateCheckboxProjection.statCheckMap(checkMap);
        console.log('change:row.check.map STATS', stats);
      });
    } else {
      checkbox = new RowCheckboxProjection({
        'row.check.id': 'CustomerID',
        'column.checked': 'checkbox',
      });
    }

    var columnTmpl = new ColumnTemplate({
      'column.template': {
        'rowIndex': function(item) {
          return '<strong>RowIndex</strong>';
        }
      }
    })
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g,
    };

    // TODO [akamel] give ability to listen to event given property 'name'
    // TODO [akamel] remove demo pipes
    // mock.pipe(memquery).pipe(map).pipe(proptmpl).pipe(colq).pipe(coli18n)
    // mock.pipe(memquery).pipe(map).pipe(colq).pipe(coli18n).pipe(proptmpl)
    src = odata.pipe(map).pipe(coli18n).pipe(page).pipe(colq).pipe(proptmpl)
      .pipe(colshifter).pipe(group).pipe(checkbox).pipe(rowindex)
      .pipe(aggregateRow).pipe(editable).pipe(columnTmpl);

    return src;
  }

  // $('#grid_toolbar_host_a').append(createToolbar().render().$el);

  function createGrid(src, container, el) {
    var grid = new Grid({
      el: el,
      container: container,
      projection: src,
      Layout: TableLayout.partial({
        template: tmplJade,
        renderers: [Virtualization, FixedHeader],
        hideHeaders: false,
        columns: {
          name: {},
          first: {
            $metadata: {
              'attr.head': { class: ['row__cell'] },
              'attr.body': { class: ['row__cell cell--text'] },
            },
          },
          CustomerID: {
            sortable: true,
          },
          ShipCity: {
            cell: {
              class: ['text-right'],
            },
          },
        },
      }),
      schema: s$Northwind,
    });

    grid.on('all', function () {
      console.log(_.toArray(arguments));
    });

    grid.on('layout:click:cell', function (e, data) {
      console.log(data.model.rowIndex, data);
    });

    grid.on('data:edit', function (data) {
      console.log('[edit] ' + JSON.stringify(data));
    });

    var pager = new PaginationView({ el: '#pager', pageSize: 200, pageNumber: 0 });
    pager.render();

    grid.once('change:data', function (model) {
      pager.itemCount = model.get('count');
    });

    pager.on('change:page-number', function (pageNumber) {
      grid.projection.set('page.number', pageNumber);
    });

    pager.on('change:page-size', function (pageSize) {
      grid.projection.set('page.size', pageSize);
    });

    window.grid = grid;

    return grid;
  }

  function setGridViewStyle(viewStyle, checkboxMode) {
    var gridHost, container;

    if (viewStyle === 'window') {
      $('#grid-view-style').text('Grid positioned in Window');
      gridHost = $('#grid_host_window');
    } else {
      $('#grid-view-style').text('Grid positioned in an element');
      container = $('#grid_host_container');
      gridHost = $('#grid_host_element');
    }
    if (window.grid) {
      window.grid.remove();
    }
    gridHost.append('<div id="grid_host_a">');
    createGrid(createDataSource(checkboxMode), container, $('#grid_host_a')).render({ fetch: true });
  }

  setGridViewStyle('window', 'tri-state');
});
