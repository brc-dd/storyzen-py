import React from 'react';
import EditorJS from '@editorjs/editorjs';
import './StoryWriter.css';
import { EDITOR_JS_TOOLS } from './tools';
import Undo from 'editorjs-undo';
import DragDrop from 'editorjs-drag-drop';

export default function StoryWriter() {
  const editor = new EditorJS({
    tools: EDITOR_JS_TOOLS,
    inlineToolbar: true,
    placeholder: "Let's write an awesome story!",
    onReady: () => {
      new Undo({ editor });
      new DragDrop(editor);
    }
  });

  return (
    <>
      <div id="editorjs" className="m-4"></div>
    </>
  );
}
