import React, { useState } from "react";
import Editor from "./Editor";

export default function TextEditor({ document: initialDocument, onSubmit }) {
  const [document, updateDocument] = useState(initialDocument);
  const [editedDocument, setEditedDocument] = useState(initialDocument);

  const handleSubmit = () => {
    onSubmit(editedDocument);
  };

  return (
    <>
      <div className="App">
        <Editor
          document={document}
          onChange={(newDocument) => {
            updateDocument(newDocument);
            setEditedDocument(newDocument);
          }}
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}
