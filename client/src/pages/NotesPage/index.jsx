import {TextEditor} from "../../components";
import '../../App.css'
import ExampleDocument from "../../utils/ExampleDocument";


export default function Notes() {

    const updateText = (newText) =>{
        localStorage.setItem('document', newText)
    }


  return (
    <div>
        <TextEditor document={ExampleDocument} onChange={(newText) => updateText(newText)}/>
    </div>
  );

}
