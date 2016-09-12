import _ from 'underscore';
import { Editor } from './model/editor.js';

export default (definePlugin) => 
  definePlugin('editorCore', [
    'config', 
    'gridView'
    ], ({
      plugins: { dataSource } = {},
    } = {}, gridView) => {
      gridView.editor = new Editor(dataSource, gridView.model);

  });
