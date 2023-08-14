import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import { RecoilRoot } from "recoil";

export default function TextEditor({ document: initialDocument, onChange }) {
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
        <RecoilRoot>
      <Editor
        document={document}
        onChange={(newDocument) => {
          updateDocument(newDocument);
        }}
      />
      </RecoilRoot>
    </div>
  );
}
