import Editor from "./Editor"
import { useState } from "react";

export default function TextEditor(exampleDocument) {

    const [document, updateDocument] = useState(exampleDocument.document);
    console.log("🚀 ~ file: index.jsx:7 ~ TextEditor ~ document:", document)
  
    return (
      <>
        <div className="App">
          <Editor document={document} onChange={updateDocument} />
        </div>
      </>
    );
    }
