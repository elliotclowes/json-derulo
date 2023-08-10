import Editor from "./Editor"
import { useState } from "react";

export default function TextEditor(exampleDocument) {

    const [document, updateDocument] = useState(exampleDocument.document);  //this needs to be changed to use context for a local storage version of the document which can then be uploaded to the database
  
    return (
      <>
        <div className="App">
          <Editor document={document} onChange={updateDocument} />
        </div>
      </>
    );
    }
