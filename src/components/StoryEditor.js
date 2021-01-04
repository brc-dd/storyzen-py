/* eslint no-console:0 */

import 'assets/styles/_editor.scss';

import Autolinker from 'autolinker';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import $ from 'jquery';
import React from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import buildEditor from 'utils/editor';

export default ({ readOnly }) => {
  const { storyID = undefined } = useParams();

  const changeLinks = () =>
    $('a[href^="http"]')
      .not(`a[href*="${window.location.hostname}"]`)
      .attr({ target: '_blank', rel: 'noopener noreferrer' });

  const bindListener = () => {
    $(window).on('message', function (e) {
      const oe = e.originalEvent;
      if (oe.origin !== 'https://twitframe.com') return;

      if (oe.data.height && oe.data.element.match(/^tweet_/))
        $(`#${oe.data.element}`).css(
          'height',
          `${parseInt(oe.data.height, 10) + 10}px`
        );
    });
  };

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

  const handleChange = () => {
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
  };

  let editor;
  buildEditor(readOnly, storyID, handleChange).then(_editor => {
    editor = _editor;

    editor.isReady
      .then(() => {
        bindListener();

        if (!readOnly) {
          new Undo({ editor });
          new DragDrop(editor);
        } else changeLinks();

        $(document.body).attr('spellcheck', true);
        $(':root').css('--padding', readOnly ? 0 : '300px');

        handleChange();
      })
      .catch(reason => {
        console.error(`Editor.js initialization failed because of ${reason}`);
      });
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
              ? key.trim() === 'text' || key.trim() === 'caption'
                ? autolinker.link(obj[key].replace(/&nbsp;/g, ' ').trim())
                : obj[key].replace(/&nbsp;/g, ' ').trim()
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
      .then(outputData =>
        fetch('/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: sanitize(outputData)
        })
          .then(response => response.json())
          .then(data => {
            if (data.id) window.location.assign(`/${data.id}`);
          })
      )
      .catch(error => console.error('Saving failed: ', error));
  };

  return (
    <Container className="py-5">
      <div id="editorjs" className="py-3" />
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
