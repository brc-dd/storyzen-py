/* eslint no-console:0 */

// https://i.imgur.com/2MPKGOl.mp4

import 'assets/styles/_editor.scss';

import EditorJS from '@editorjs/editorjs';
import Autolinker from 'autolinker';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import $ from 'jquery';
import React, { useEffect } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import data from 'utils/data';
import EDITOR_JS_TOOLS from 'utils/tools';

export default ({ readOnly }) => {
  const changeLinks = () =>
    $('a[href^="http"]')
      .not(`a[href*="${window.location.hostname}"]`)
      .attr({ target: '_blank', rel: 'noopener noreferrer' });

  const handleTweets = () => {
    $('.embed-tool__content--twitter:not([id])').each(function () {
      const val = $(this).attr('src');
      const _id = `tweet_${val.substr(val.lastIndexOf('/') + 1)}_`;
      const id = _id + $(`iframe[id^=${_id}]`).length;

      setTimeout(() => {
        // eslint-disable-next-line
        this.contentWindow.postMessage(
          { element: id, query: 'height' },
          'https://twitframe.com'
        );
      }, 1000);

      $(this).attr({ id });
    });
  };

  const bindListener = () => {
    $(window).on('message', function (e) {
      const oe = e.originalEvent;
      if (oe.origin !== 'https://twitframe.com') return;

      if (oe.data.height && oe.data.element.match(/^tweet_/))
        $(`#${oe.data.element}`).css(
          'height',
          `${parseInt(oe.data.height, 10) + 30}px`
        );
    });
  };

  const editor = new EditorJS({
    tools: EDITOR_JS_TOOLS,
    inlineToolbar: true,
    placeholder: "Let's write an awesome story!",
    onReady: () => {
      bindListener();

      if (!readOnly) {
        new Undo({ editor });
        new DragDrop(editor);
      } else changeLinks();
    },
    onChange: () => {
      const nextHeader = $('div:has(:header) + div :header');
      $(':header').not(nextHeader).css('padding-top', '');
      nextHeader.css('padding-top', 0);

      $('.cdx-block.embed-tool:has(.embed-tool__content--16-9)').css({
        height: 0,
        position: 'relative',
        'padding-bottom': '56.25%'
      });

      $('.cdx-block.embed-tool:has(.embed-tool__content--instagram)').css({
        height: 0,
        width: '80%',
        position: 'relative',
        'padding-bottom': '120%'
      });

      $('.embed-tool__content--github-gist').each(function () {
        $(this).css(
          'height',
          `${$(this).contents().find('body').height() + 30}px`
        );
      });

      handleTweets();
    },
    logLevel: 'ERROR',
    data,
    readOnly
  });

  const sanitize = _data => {
    const autolinker = new Autolinker({
      truncate: { length: 32, location: 'smart' }
    });

    const trimObj = obj => {
      if (obj === null || (!Array.isArray(obj) && typeof obj !== 'object'))
        return obj;

      return Object.keys(obj).reduce(
        (acc, key) => {
          acc[key.trim()] =
            typeof obj[key] === 'string'
              ? key.trim() === 'url'
                ? obj[key].replace(/&nbsp;/g, ' ').trim()
                : autolinker.link(obj[key].replace(/&nbsp;/g, ' ').trim())
              : trimObj(obj[key]);
          return acc;
        },

        Array.isArray(obj) ? [] : {}
      );
    };

    let outputData = JSON.stringify(trimObj(_data))
      .replace(/&nbsp;/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/"<br>|<br>"/g, '"')
      .replace(/\s*(?<!\\)"\s*/g, '"');

    const rotR = (s, l, r) =>
      s.substring(0, l) + s[r] + s.substring(l, r) + s.substr(r + 1);

    const rotL = (s, l, r) =>
      s.substring(0, l) + s.substring(l + 1, r + 1) + s[l] + s.substr(r + 1);

    [...outputData.matchAll(/<[^/^>]+> /g)].forEach(match => {
      outputData = rotR(
        outputData,
        match.index,
        match.index + match[0].length - 1
      );
    });

    [...outputData.matchAll(/ <\/[^>]+>/g)].forEach(match => {
      outputData = rotL(
        outputData,
        match.index,
        match.index + match[0].length - 1
      );
    });

    return outputData.replace(/\s\s+/g, ' ');
  };

  const handleClick = () => {
    changeLinks();

    editor
      .save()
      .then(outputData => {
        console.log('Article data: ', outputData);
        navigator.clipboard.writeText(sanitize(outputData)).then(
          () => console.log('Async: Copying to clipboard was successful!'),
          err => console.error('Async: Could not copy text: ', err)
        );
      })
      .catch(error => console.error('Saving failed: ', error));
  };

  useEffect(() => {
    if (readOnly) {
      document.body.setAttribute('spellcheck', true);
      document.getElementsByClassName('codex-editor__redactor')[0].style[
        'padding-bottom'
      ] = 0;
    }

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
