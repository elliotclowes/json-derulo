import Editor from "./Editor"
import { useState, useEffect } from "react";

export default function TextEditor({ document, onChange }) {
  console.log('TextEditor props:', document, onChange);
  return (
    <div className="App">
      <Editor document={document} onChange={onChange} />
    </div>
  );
}
