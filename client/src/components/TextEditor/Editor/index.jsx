import { Editable, Slate, withReact } from "slate-react";
import { createEditor } from "slate";
import { useMemo, useState, useCallback, memo } from "react";
import { withHistory } from "slate-history";

const Editor = ({ document, onChange }) => {
  console.log(document);
  const [editor] = useState(() => withReact(withHistory(createEditor()), []));

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

  return (
    <Slate editor={editor} initialValue={document} onChange={onChange}>
      <Editable renderElement={renderElement} onKeyDown={event => { /* existing implementation */ }} />
    </Slate>
  );
};


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

  export default memo(Editor);
