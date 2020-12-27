export default {
  list: {
    class: require('@editorjs/list'),
    shortcut: 'CMD+SHIFT+L',
    inlineToolbar: true
  },
  header: {
    class: require('@editorjs/header'),
    shortcut: 'CMD+SHIFT+H',
    config: {
      placeholder: 'Enter a heading…',
      levels: [2, 3, 4],
      defaultLevel: 3
    }
  },
  embed: {
    class: require('@editorjs/embed'),
    config: {
      services: {
        codepen: {
          regex: /(?:.*)codepen\.io\/([^/?&]*)\/(?:pen|details|full|embed)\/([^/?&]*)(?:.*)/,
          embedUrl:
            'https://codepen.io/<%= remote_id %>?default-tab=html,result',
          html: '<iframe class="embed-tool__content--16-9"></iframe>',
          id: ids => ids.join('/embed/')
        },
        coub: {
          regex: /(?:.*)coub\.com\/(?:view|embed)\/([^/?&]+)(?:.*)/,
          embedUrl: 'https://coub.com/embed/<%= remote_id %>',
          html:
            '<iframe class="embed-tool__content--16-9" allowfullscreen="true"></iframe>'
        },
        gfycat: {
          regex: /(?:.*)gfycat\.com(?:\/detail|\/ifr)?\/([a-zA-Z]+)(?:.*)/,
          embedUrl: 'https://gfycat.com/ifr/<%= remote_id %>',
          html:
            '<iframe class="embed-tool__content--16-9" allowfullscreen="true"></iframe>'
        },
        'twitch-channel': {
          regex: /(?:.*)twitch\.tv\/([^/?&]*)\/?$(?:.*)/,
          embedUrl:
            'https://player.twitch.tv/?channel=<%= remote_id %>&parent=localhost',
          html:
            '<iframe class="embed-tool__content--16-9" allowfullscreen="true"></iframe>'
        },
        'twitch-chat': {
          regex: /(?:.*)twitch\.tv(?:\/popout)?\/([^/?&]*)\/chat(?:.*)/,
          embedUrl:
            'https://www.twitch.tv/embed/<%= remote_id %>/chat?parent=localhost',
          html: '<iframe class="embed-tool__content--16-9"></iframe>'
        },
        'twitch-video': {
          regex: /(?:.*)twitch\.tv\/(?:[^/?&]*\/v|videos)\/([0-9]*)(?:.*)/,
          embedUrl:
            'https://player.twitch.tv/?video=v<%= remote_id %>&parent=localhost',
          html:
            '<iframe class="embed-tool__content--16-9" allowfullscreen="true"></iframe>'
        },
        'twitch-collections': {
          regex: /(?:.*)twitch\.tv\/collections\/([^/?&]*)(?:.*)/,
          embedUrl:
            'https://player.twitch.tv/?collection=<%= remote_id %>&parent=localhost',
          html:
            '<iframe class="embed-tool__content--16-9" allowfullscreen="true"></iframe>'
        },
        instagram: {
          regex: /(?:.*)instagram\.com\/p\/([^/?&]+)\/?/,
          embedUrl: 'https://www.instagram.com/p/<%= remote_id %>/embed',
          html:
            '<iframe class="embed-tool__content--instagram" allowfullscreen="true"></iframe>'
        },
        twitter: {
          regex: /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)(?:\/.*)?$/,
          embedUrl:
            'https://twitframe.com/show?url=https://twitter.com/<%= remote_id %>',
          html: '<iframe class="embed-tool__content--twitter"></iframe>',
          id: ids => ids.join('/status/')
        },
        youtube: {
          regex: /(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|watch))(?:(?:\?v=)?([^#&?=]*))?((?:[?&]\w*=\w*)*)/,
          embedUrl: 'https://www.youtube.com/embed/<%= remote_id %>',
          html:
            '<iframe class="embed-tool__content--16-9" allowfullscreen="true"></iframe>',
          id: ([_id, _params]) => {
            let id = _id;
            let params = _params;

            if (!params && id) {
              return id;
            }

            const paramsMap = {
              start: 'start',
              end: 'end',
              t: 'start',
              time_continue: 'start',
              list: 'list'
            };

            params = params
              .slice(1)
              .split('&')
              .map(param => {
                const [name, value] = param.split('=');

                if (!id && name === 'v') {
                  id = value;

                  return undefined;
                }

                if (!paramsMap[name]) {
                  return undefined;
                }

                return `${paramsMap[name]}=${value}`;
              })
              .filter(param => !!param);

            return `${id}?${params.join('&')}`;
          }
        },
        vimeo: {
          regex: /(?:http[s]?:\/\/)?(?:www.)?vimeo\.co(?:.+\/([^/]\d+)(?:#t=[\d]+)?s?$)/,
          embedUrl:
            'https://player.vimeo.com/video/<%= remote_id %>?title=0&byline=0',
          html:
            '<iframe class="embed-tool__content--16-9" allowfullscreen="true"></iframe>'
        },
        'github-gist': {
          regex: /^https?:\/\/gist\.github\.com\/([^#]+)(?:#file-(.*))?$/,
          embedUrl:
            '<script src="https://gist.github.com/<%= remote_id %>"></script>',
          html: '<iframe class="embed-tool__content--github-gist"></iframe>',
          id: ids => ids.join('.js?file='),
          attribute: 'srcdoc'
        }
      }
    }
  },
  Marker: {
    class: require('@editorjs/marker'),
    shortcut: 'CMD+ALT+H'
  },
  delimiter: {
    class: require('@editorjs/delimiter'),
    shortcut: 'CMD+ALT+ENTER'
  },
  quote: {
    class: require('@editorjs/quote'),
    shortcut: 'CMD+SHIFT+M',
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: "Quote's author"
    }
  },
  table: require('@editorjs/table'),
  inlineCode: {
    class: require('@editorjs/inline-code'),
    shortcut: 'CMD+ALT+C'
  },
  checklist: require('@editorjs/checklist'),
  code: {
    class: require('@editorjs/code'),
    shortcut: 'CMD+SHIFT+C',
    config: {
      placeholder: 'Enter some code here…'
    }
  },
  warning: {
    class: require('@editorjs/warning'),
    config: {
      titlePlaceholder: 'Title',
      messagePlaceholder: 'Warning'
    }
  },
  image: {
    class: require('editorjs-inline-image'),
    config: {
      unsplash: {
        appName: 'storyzen',
        clientId: 'vBeQPMC05YWeyaUQSea3VRD-PbYHLdIz_kUxX0ATcTI'
      }
    }
  },
  underline: {
    class: require('@editorjs/underline'),
    shortcut: 'CMD+U'
  },
  textAlign: require('@canburaks/text-align-editorjs'),
  ColorPicker: require('@itech-indrustries/editor-js-text-color'),
  strikethrough: {
    class: require('editorjs2-strikethrough'),
    shortcut: 'CMD+D'
  },
  subscript: {
    class: require('editorjs2-subscript'),
    shortcut: 'CMD+DOWN'
  },
  superscript: {
    class: require('editorjs2-superscript'),
    shortcut: 'CMD+UP'
  },
  fontFamily: require('editorjs-inline-font-family-tool'),
  fontSize: require('editorjs-inline-font-size-tool'),
  Math: {
    class: require('editorjs-math'),
    shortcut: 'ALT+E'
  }
};
