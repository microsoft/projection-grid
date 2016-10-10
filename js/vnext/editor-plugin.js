import _ from 'underscore';
import { Editor } from './model/editor.js';
import { patchChange } from './projection/patch-change.js';
import { patchError } from './projection/patch-error.js';
import { editable } from './projection/editable.js';
import { editableOption } from './projection/editable-option.js';
import { addRowClass } from './projection/add-row-class.js';

export default (definePlugin) => 
  definePlugin('editorCore', [
    'config', 
    'gridView'
    ], ({ dataSource, plugin: { editableColumns = {} } } = {}, gridView) => {
      const editor = new Editor(dataSource, gridView.model);
      window.editor = editor;
      gridView.pipeDataProjections(patchError, patchChange);
      gridView.pipeStructureProjections(addRowClass, editableOption);
      gridView.pipeContentProjections(editable);
      gridView.set({
        dataSource: _.defaults({ read: editor.read.bind(editor) }, dataSource),
        patchChange: { editor },
        editable: { editableColumns },
        editableOption: true,
      });

  });
