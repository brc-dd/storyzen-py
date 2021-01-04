import EditorJS from '@editorjs/editorjs';
import tools from 'utils/tools';

export default async (readOnly, storyID, callback) => {
  let data;

  try {
    if (readOnly && storyID) {
      const response = await fetch(`/${storyID}`);
      const _data = await response.json();
      data = _data;
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
  }

  return new EditorJS({
    data,
    inlineToolbar: true,
    logLevel: 'ERROR',
    onChange: callback,
    placeholder: "Let's write an awesome story!",
    readOnly,
    tools
  });
};
