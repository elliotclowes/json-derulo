import Editor from "./Editor"
import { useState } from "react";

export default function TextEditor(exampleDocument) {

    const [document, updateDocument] = useState(exampleDocument.document);
  
    return (
      <>
        <div className="App">
          <Editor document={document} onChange={updateDocument} />
        </div>
      </>
    );
    }
