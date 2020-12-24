/* eslint no-console:0 */

// https://i.imgur.com/2MPKGOl.mp4

import 'assets/styles/_editor.scss';

import EditorJS from '@editorjs/editorjs';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import $ from 'jquery';
import React, { useEffect } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import data from 'utils/data';
import EDITOR_JS_TOOLS from 'utils/tools';

export default ({ readOnly }) => {
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
    onChange: () => {
      const nextHeader = $('div:has(:header) + div :header');
      $(':header').not(nextHeader).css('padding-top', '');
      nextHeader.css('padding-top', 0);
    },
    logLevel: 'ERROR',
    data,
    readOnly
  });

  const handleClick = () =>
    editor
      .save()
      .then(outputData => {
        console.log('Article data: ', outputData);
        navigator.clipboard
          .writeText(
            JSON.stringify(outputData)
              .replace(/&nbsp;/g, ' ')
              .replace(/\s\s+/g, ' ')
          )
          .then(
            () => console.log('Async: Copying to clipboard was successful!'),
            err => console.error('Async: Could not copy text: ', err)
          );
      })
      .catch(error => console.error('Saving failed: ', error));

  useEffect(() => {
    document.body.setAttribute('spellcheck', true);
    if (readOnly)
      document.getElementsByClassName('codex-editor__redactor')[0].style[
        'padding-bottom'
      ] = 0;

    return () => {};
  }, [readOnly]);

  return (
    <Container className="py-5">
      <div id="editorjs" className="my-4" />
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
