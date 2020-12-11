export const EDITOR_JS_TOOLS = {
  list: {
    class: require('@editorjs/list'),
    shortcut: 'CMD+SHIFT+L'
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
  embed: require('@editorjs/embed'),
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
  underline: require('@editorjs/underline'),
  socialPost: require('editorjs-social-post-plugin'),
  textAlign: require('@canburaks/text-align-editorjs')
};
