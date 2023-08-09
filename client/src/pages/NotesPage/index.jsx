import {TextEditor} from "../../components";
import '../../App.css'
import ExampleDocument from "../../utils/ExampleDocument";

export default function Notes() {

    console.log(ExampleDocument)

  return (
    <div>
        <TextEditor document={ExampleDocument}/>
    </div>
  );

}
