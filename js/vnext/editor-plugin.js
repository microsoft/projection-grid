import _ from 'underscore';
import { Editor } from './model/editor.js';

export default (definePlugin) => 
  definePlugin('editorCore', [
    'config', 
    'gridView'
    ], ({
      plugins: { dataSource } = {},
    } = {}, gridView) => {
      const editor = new Editor(dataSource, gridView.model);
      gridView.set({
        dataSource: _.defaults({ read: editor.read }, dataSource),
      });

  });
