import EditorJS from '@editorjs/editorjs';
import $ from 'jquery';
import EDITOR_JS_TOOLS from 'utils/tools';

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

export default async (readOnly, storyID, callback) => {
  let data;

  try {
    if (readOnly && storyID) {
      const response = await fetch(`/${storyID}`);
      const _data = await response.json();
      data = _data;
    }
  } catch (err) {
    console.error(err);
  }

  return new EditorJS({
    tools: EDITOR_JS_TOOLS,
    inlineToolbar: true,
    placeholder: "Let's write an awesome story!",
    onReady: callback,
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
};
