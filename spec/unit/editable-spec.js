var sinon = require('sinon');
var chai = require("chai");
var sinonChai = require("sinon-chai");
var util = require('./util');
var EditableProjection = require('component/grid/projection/editable');
var Base = require('component/grid/projection/base');
var Response = require('component/grid/model/response');

chai.should();
chai.use(sinonChai);

describe('projection editable', function () {
  it('receive array editable config', function () {
    var model = new EditableProjection({
      'column.editable': ['name', 'age'],
    });

    var originalData = new Base();
    originalData.data = new Response({
      value: [{ name: 'hello', age: 11, id: 12 }],
      columns: {},
    });
    sinon.spy(model, 'patch');
    originalData.pipe(model);
    model.patch.should.have.been.called;

    Object.keys(model.viewConfig).should.be.eql(['name', 'age']);
  });

  it('receive object editable config', function () {
    var model = new EditableProjection({
      'column.editable': {
        name: sinon.spy(),
        age: sinon.spy(),
      },
    });

    var originalData = new Base();
    originalData.data = new Response({
      value: [{ name: 'hello', age: 11, id: 12 }],
      columns: {},
    });
    sinon.spy(model, 'patch');
    originalData.pipe(model);
    model.patch.should.have.been.called;

    Object.keys(model.viewConfig).should.be.eql(['name', 'age']);
  });

  it('supports localization of the tooltip', function () {
    const editableTemplate = sinon.stub();

    const tooltipText = 'Localized text';
    var originalData = new Base();
    const model = new EditableProjection({
      'column.editable': {
        name: sinon.spy(),
      },
      'editable.tooltip.text': tooltipText,
      'editable.template': editableTemplate,
    });

    originalData.data = new Response({
      value: [{ name: 'hello' }],
      columns: {},
    });
    sinon.spy(model, 'patch');

    originalData.pipe(model);

    editableTemplate.should.have.been.calledWith(
      util.objectPartialMatch(
        ['$html', 'classes'], {
          text: 'hello',
          tooltipText,
        }
      ));
    model.patch.should.have.been.called;
  });

  describe('during interaction calls editor on layout:click:cell event', function () {
    class Arg {
      constructor() {
        this.model = {
          id: 'abc',
          description: 'some description',
          $metadata: {
            attr: {
              class: ['row-class1', 'row-class2'],
            },
          },
        };
        this.property = 'description';
        this.column = {
          sortable: 'Description',
          $metadata: {
            'attr.head': { class: ['cell-head-class1', 'cell-head-class2'] },
          },
        };
        this.schema = {};
        this.position = 42;
      }

      withModel(model) {
        this.model = model;
        return this;
      }

      forProperty(property) {
        this.property = property;
        return this;
      }

      withColumn(column) {
        this.column = column;
        return this;
      }

      withSchema(schema) {
        this.schema = schema;
        return this;
      }

      build() {
        var gridOptionsGet = sinon.stub();
        gridOptionsGet.withArgs('schema').returns(this.schema);

        var gridLayoutContainerOffset = sinon.stub();
        gridLayoutContainerOffset.returns(this.position);

        return {
          header: { isHeader: false },
          model: this.model,
          property: this.property,
          column: this.column,
          grid: {
            options: {
              get: gridOptionsGet,
            },
            layout: {
              container: {
                offset: gridLayoutContainerOffset,
              },
            },
          },
        };
      }
    }

    var event;

    beforeEach(function (done) {
      util.$container.one('click', function (evt) {
        event = evt;
        done();
      });
      util.$container.click();
    });

    afterEach(function () {
      console.log('Doing cleanup');
      util.cleanup();
    });

    it('for simple model', function () {
      var editor = sinon.spy();

      var editable = new EditableProjection({
        'column.editable': {
          description: editor,
        },
      });

      let arg = new Arg();

      editable.bubble('layout:click:cell', event, arg.build());

      editor.should.have.been.calledWith(
        util.objectPartialMatch(
          ['onSubmit'], {
            model: arg.model,
            schema: arg.schema,
            position: arg.position,
            property: arg.property,
          }));
    });

    it('for complex model with value mapping', function () {
      var editor = sinon.spy();

      var editable = new EditableProjection({
        'column.editable': {
          label: editor,
        },
      });

      let arg = new Arg()
        .withModel({
          label: {
            name: 'Label 1',
            color: '#00ff0f',
          },
        })
        .withColumn({
          sortable: 'Name',
          $metadata: {
            map: {
              name: 'name',
              value(model) {
                return model.label;
              },
            },
          },
        })
        .forProperty('label');

      editable.bubble('layout:click:cell', event, arg.build());

      editor.should.have.been.calledWith(
        util.objectPartialMatch(
          ['onSubmit'], {
            model: arg.model,
            schema: arg.schema,
            position: arg.position,
            property: arg.column.$metadata.map,
          }));
    });
  });
});
