import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { Slate, Editable, withReact, useSlate, useFocused } from 'slate-react';
import {
  Editor,
  Transforms,
  Text,
  createEditor,
  Range,
} from 'slate';

import { withHistory } from 'slate-history';
import HoveringToolbar from '../Toolbar'


const HoveringMenuEditor = ({document, onChange}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);


  const renderElement = useCallback(props => {
    const { element, children, attributes } = props;
  switch (element.type) {
    case "paragraph":
      return <p {...attributes}>{children}</p>;
    case "h1":
      return <h1 {...attributes}>{children}</h1>;
    case "h2":
      return <h2 {...attributes}>{children}</h2>;
    case "h3":
      return <h3 {...attributes}>{children}</h3>;
    case "h4":
      return <h4 {...attributes}>{children}</h4>;
    default:
      // For the default case, we delegate to Slate's default rendering. 
      return <p {...props.attributes}>{props.children}</p>;
    }
  }, [])

  const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
  
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
  
    if (leaf.underlined) {
      children = <u>{children}</u>;
    }
    if (leaf.highlight) {
      children = <span style={{backgroundColor: 'cornflowerblue'}} {...attributes}>{children}</span>;
    }

  
    return <span {...attributes}>{children}</span>;
  };

  return (
    <Slate editor={editor} initialValue={document} onChange={onChange}>
      <HoveringToolbar />
      <Editable
        renderElement={renderElement}
        renderLeaf={props => <Leaf {...props} />}
        placeholder="Enter some text..."
        onDOMBeforeInput={(event) => {
          switch (event.inputType) {
            case 'formatBold':
              event.preventDefault();
              return toggleMark(editor, 'bold');
            case 'formatItalic':
              event.preventDefault();
              return toggleMark(editor, 'italic');
            case 'formatUnderline':
              event.preventDefault();
              return toggleMark(editor, 'underlined');
            case 'formatHighlight':
              event.preventDefault()
              return toggleMark(editor, 'highlight')
            default:
              return;
          }
        }}
      />
    </Slate>
  );
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};






export default HoveringMenuEditor;
