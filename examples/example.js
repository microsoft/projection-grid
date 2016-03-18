window.BINGADS_DEBUG = true;

require([
  'lib/squire',
  // 'component/auto-config',
], function(Squire) {
  var injector = new Squire();

  injector
    .mock({
      'component/config/index': {
        get: function() {
          return 'en-us';
        },
      },
      'data/i18n/component/pagination/en-us': {
        'Component_Pagination_SummaryText': '{{from}} to {{to}} of {{total}}',
      },
    })
    .require([
      'lib/underscore',
      'lib/jquery',
      'component/grid/index',
      // projections
      'component/grid/projection/memory-queryable',
      'component/grid/projection/column-queryable',
      'component/grid/projection/column-i18n',
      'component/grid/projection/column-shifter',
      'component/grid/projection/property-template',
      'component/grid/projection/map',
      'component/grid/projection/page',
      'component/grid/projection/odata',
      'component/grid/projection/mock',
      'component/grid/projection/row-checkbox',
      'component/grid/projection/row-index',
      'component/grid/projection/aggregate-row',
      // layout
      'component/grid/layout/table',
      'component/grid/layout/template/table',
      // pagination
      // 'component/pagination/index',
      // 'component/pagination/layout/simple',
      // connectors
      // 'component/connectors/grid.pagination',
      // renderers
      'component/grid/layout/renderer/virtualization',
      'component/grid/layout/renderer/fixed-header',
      // example
      'component/grid/../../examples/cat-schema',

      // Grid toolbar
      // 'component/grid-toolbar/button',
      // 'component/grid-toolbar/dropdown',
      // 'component/grid-toolbar/buttonMenuItem',
      // 'component/grid-toolbar/dividerMenuItem',
      // 'component/grid-toolbar/headerMenuItem',
      // 'component/grid-toolbar/radioGroupMenuItem',
      // 'component/grid-toolbar/radioMenuItem',
      // 'component/grid-toolbar/subMenuItem',
      // 'component/grid-toolbar/filterInput',
      // 'component/grid-toolbar/gridToolbarItemContainer',
      // 'component/grid-toolbar/gridToolbar'
    ], function(
      _,
      $,
      Grid,
      // projections
      MemoryQueryableProjection,
      ColumnQueryableProjection,
      ColumnI18NProjection,
      ColumnShifterProjection,
      PropertyTemplateProjection,
      MapProjection,
      PageProjection,
      OdataSource,
      MockSource,
      RowCheckboxProjection,
      RowIndexProjection,
      AggregateRow,
      // layout
      TableLayout,
      tmplJade,
      // pagination
      // Pagination,
      // PaginationTmpl,
      // connectors
      // PaginationConnector,
      // renders
      Virtualization,
      FixedHeader,
      // schema
      cat

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
    ) {
      // function createToolbar() {
      //   var buttonMenu = new Button({text: 'Click Me', leftIconClass: 'icon-export-normal'});
      //   buttonMenu.on('click', function() {
      //     alert('The button is clicked!');
      //   });

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

      //   var filterInput = new FilterInput({placeholder: "Hello World"});
      //   filterInput.on('change', function(button, filterVal) {
      //     button.setValue('Apply!');
      //   });
      //   return new GridToolbar({items: [buttonMenu, dropdownMenu, filterInput]});
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

      var src,
        odata = new OdataSource({
          url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders',
        }),
        map = new MapProjection({
          map: function(item) {
            var names = (item.name || item.ContactName || item.ShipName).split(' ');

            return [_.extend({}, item, {
              'first': names[0],
              'last': names[1],
              'email': names[0] + '.' + names[1] + '@outlook.com',
              '$metadata': {
                'attr': { 'class': ['table__row--standard'] },
              },
            }), _.extend({}, {
              'first': names[0],
              'last': names[1],
              'email': names[0] + '.' + names[1] + '@outlook.com',
              '$metadata': {
                'attr': { 'class': ['table__row--segment'] },
                'type': 'segmentation',
              },
            })];
          },
        }),
        // todo [akamel] also support not-in
        colq = new ColumnQueryableProjection({
          'column.lock': ['__row_index', 'first', 'checkbox'],
          'column.take': 10,
          // , 'column.in'   : [ 'last', 'email', 'CustomerID', 'ShipCity', 'ShipCountry' ]
        }),
        // todo [akamel] make headers accept html
        // todo [akamel] consider design to support merged columns multiple columns undr a seperate one
        coli18n = new ColumnI18NProjection({
          'column.i18n': {
            'name': 'Name',
            'first': function(name) {
              return (_.first(name) || '').toUpperCase() + _.rest(name).join('');
            },
            '': function(name) {
              return '$' + name;
            },
          },
        }),
        colshifter = new ColumnShifterProjection(),
        proptmpl = new PropertyTemplateProjection({
          'property.template': {
            'email': function(local) {
              return '<a href="http://google.com">' + local.model[local.property] + '</a>';
            },
            'ShipName': function(local) {
              return '<span style="padding-left: 100px">' + local.model[local.property] + '</span>';
            },
            'ShipPostalCode': function(local) {
              return '<span style="padding-left: 200px">' + local.model[local.property] + '</span>';
            },
          },
        }),
        page = new PageProjection({
          'page.size': 200,
          'page.number': 0,
        }),
        checkbox = new RowCheckboxProjection({
          'row.check.id': 'CustomerID',
          'column.checked': 'checkbox',
        }),
        rowindex = new RowIndexProjection(),
        aggregateRow = new AggregateRow({
          'aggregate.top': function(data) {
            var items = data.get('value');

            return [{
              'first': 'top: ' + items.length,
              '$metadata': {
                'attr': { 'class': ['table__row--aggregate'] },
              },
            }, {
              'first': 'number of rows: ' + items.length,
              '$metadata': {
                'attr': { 'class': ['table__row--aggregate'] },
              },
            }];
          },
          'aggregate.bottom': function(data) {
            var items = data.get('value');

            return [{
              'first': 'bottom: ' + items.length,
              '$metadata': {
                'attr': { 'class': ['table__row--aggregate'] },
              },
            }];
          },
        });


      _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g,
      };

      // todo [akamel] give ability to listen to event given property 'name'
      // todo [akamel] remove demo pipes
      // mock.pipe(memquery).pipe(map).pipe(proptmpl).pipe(colq).pipe(coli18n)
      // mock.pipe(memquery).pipe(map).pipe(colq).pipe(coli18n).pipe(proptmpl)
      src = odata.pipe(map).pipe(coli18n).pipe(page).pipe(colq).pipe(proptmpl).pipe(colshifter).pipe(checkbox).pipe(rowindex).pipe(aggregateRow);

      $(function() {
        // $('#grid_toolbar_host_a').append(createToolbar().render().$el);
        var grid = new Grid({
          el: $('#grid_host_a'),
          projection: src,
          layout: TableLayout.partial({
            template: tmplJade,
            renderers: [ Virtualization, FixedHeader ],
            columns: {
              'name': {},
              'first': {
                '$metadata': {
                  'attr.head': { 'class': ['row__cell'] },
                  'attr.body': { 'class': ['row__cell cell--text'] },
                },
              },
              'CustomerID': {
                sortable: true,
              },
              'ShipCity': {
                cell: {
                  'class': ['text-right'],
                },
              },
            },
          }),
          schema: cat,
        });


        // pagination.on('click:next', /*@this*/ function(e, arg) {
        //   this.page(arg.page_number + 1);
        // });

        // pagination.on('click:previous', /*@this*/ function(e, arg) {
        //   this.page(arg.page_number - 1);
        // });

        grid.on('all', function() {
          console.log(_.toArray(arguments)); //eslint-disable-line no-console
        });

        grid.on('layout:click:cell', function(e, data) {
          console.log(data.model.__row_index, data); //eslint-disable-line no-console
        });

        grid.render({
          fetch: true,
        });

        // window.paginationConnector = new PaginationConnector(grid, pagination).connect();

        window.grid = grid;
      });
    });
});
