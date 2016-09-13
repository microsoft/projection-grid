import _ from 'underscore';
import { Editor } from './model/editor.js';
import { patchChange } from './projection/patch-change.js';
import { editable } from './projection/editable.js';
import { editableOption } from './projection/editable-option.js';

export default (definePlugin) => 
  definePlugin('editorCore', [
    'config', 
    'gridView'
    ], ({ dataSource } = {}, gridView) => {
      const editor = new Editor(dataSource, gridView.model);
      window.editor = editor;
      gridView.pipeDataProjections(patchChange);
      gridView.pipeStructureProjections(editableOption);
      gridView.pipeContentProjections(editable);
      gridView.set({
        dataSource: _.defaults({ read: editor.read.bind(editor) }, dataSource),
        patchChange: { editor },
        editable: { editor },
      });
  });
