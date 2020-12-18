// eslint-disable

import 'assets/styles/_editor.scss';

import EditorJS from '@editorjs/editorjs';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import React from 'react';
import { Container } from 'react-bootstrap';
import EDITOR_JS_TOOLS from 'utils/tools';

export default () => {
  const editor = new EditorJS({
    tools: EDITOR_JS_TOOLS,
    inlineToolbar: true,
    placeholder: "Let's write an awesome story!",
    onReady: () => {
      new Undo({ editor });
      new DragDrop(editor);
      // eslint-disable-next-line no-console
      console.clear();
    },
    logLevel: 'ERROR'
  });

  return (
    <Container className="pt-5">
      <div id="editorjs" className="mt-4" />
    </Container>
  );
};
