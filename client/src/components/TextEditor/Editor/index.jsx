import { Editable, Slate, withReact } from "slate-react";
import Toolbar from "../Toolbar";
import { createEditor } from "slate";
import { useMemo, useState, useCallback } from "react";
import { withHistory } from "slate-history";

export default function Editor({ document, onChange }) {
  const [editor] = useState(() => withReact(withHistory(createEditor()), []));
  const [showToolbar, setShowToolbar] = useState(false);


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
      return <DefaultElement {...props} />;
    }
  }, [])

  function renderLeaf({ attributes, children, leaf }) {
    let el = <>{children}</>;
  
    if (leaf.bold) {
      el = <strong>{el}</strong>;
    }
  
    if (leaf.code) {
      el = <code>{el}</code>;
    }
  
    if (leaf.italic) {
      el = <em>{el}</em>;
    }
  
    if (leaf.underline) {
      el = <u>{el}</u>;
    }
  
    return <span {...attributes}>{el}</span>;
  }

  return (
    <Slate editor={editor} initialValue={document} onChange={onChange}>
      {showToolbar && <Toolbar />}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onFocus={() => setShowToolbar(true)} // Show toolbar on focus
        onBlur={() => setShowToolbar(false)} // Hide toolbar on blur
        onKeyDown={event => {
          if (event.key === '&') {
            event.preventDefault();
            editor.insertText('and');
          }
        }}
      />
    </Slate>
  );
}

const CodeElement = props => {
    return (
      <pre {...props.attributes}>
        <code>{props.children}</code>
      </pre>
    )
  }
  
  const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>
  }
