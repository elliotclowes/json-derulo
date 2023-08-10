import React, { memo } from "react";
import Editor from "./Editor";

const TextEditor = ({ document, onChange }) => {
  console.log('TextEditor is rendering.');
  console.log('TextEditor rendering with document:', document);
  return (
    <div className="App">
      <Editor
        document={document}
        onChange={newText => {
          onChange(newText);
        }}
      />
    </div>
  );
};

export default memo(TextEditor);
