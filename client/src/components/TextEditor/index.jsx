import React, { useEffect, useState } from "react";
import Editor from "./Editor";

export default function TextEditor({ document: initialDocument, onChange, blockId }) {
  const [document, updateDocument] = useState(initialDocument);

  useEffect(() => {
    const autoSave = setInterval(() => {
      onChange(document);
    }, 5000); // Autosave every 5 seconds

    return () => {
      clearInterval(autoSave); // Clear interval when the component unmounts
    };
  }, [document, onChange]);

  return (
    <div className="App">
      
      <Editor
        document={document}
        onChange={(newDocument) => {
          updateDocument(newDocument);
        }}
        blockId={blockId}
      />
    </div>
  );
}
