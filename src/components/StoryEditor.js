import 'assets/styles/_editor.scss';

import EditorJS from '@editorjs/editorjs';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import React from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import EDITOR_JS_TOOLS from 'utils/tools';

export default () => {
  const readOnly = true;

  const editor = new EditorJS({
    tools: EDITOR_JS_TOOLS,
    inlineToolbar: true,
    placeholder: "Let's write an awesome story!",
    onReady: () => {
      if (!readOnly) {
        new Undo({ editor });
        new DragDrop(editor);
      }
    },
    logLevel: 'ERROR',
    data: {
      time: 1608370653638,
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Hey there! This is an article.'
          }
        }
      ],
      version: '2.19.1'
    },
    readOnly
  });

  const handleClick = () => {
    editor
      .save()
      .then(outputData => console.log('Article data: ', outputData))
      .catch(error => console.log('Saving failed: ', error));
  };

  return (
    <Container className="pt-5">
      <div id="editorjs" className="mt-4" />
      {!readOnly ? (
        <Row>
          <Button
            variant="dark"
            size="lg"
            className="mx-auto px-5"
            onClick={handleClick}
          >
            Publish!
          </Button>
        </Row>
      ) : null}
    </Container>
  );
};
