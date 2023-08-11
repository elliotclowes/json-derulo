import { getMarkForCommentThreadID } from "./../components/TextEditor/Commenting";
import { v4 as uuid } from 'uuid'

const exampleOverlappingCommentThreadID = uuid();   //these ids should be replaced by a backend service rather than as they are currently

const ExampleDocument = [
    {
      type: "h1",
      children: [{ text: "Heading 1" }],
    },
    {
      type: "p",
      children: [{ text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex numquam mollitia beatae nemo saepe fugit quos perferendis voluptates accusantium dolor aut dolores sequi illo, porro, voluptas, ipsum eius laboriosam aliquam?"},{ text: "Bold text.", bold: true, [getMarkForCommentThreadID(uuid())]: true},
      { text: "Italic text.", italic: true },
      { text: "Bold and underlined text.", bold: true, underline: true },
      { text: "variableFoo", code: true },],
    },
    {
        text: "Lorem ipsum",
        [getMarkForCommentThreadID(uuid())]: true,
   },
//    {
//         text: "Richard McClintock",
//         // note the two comment threads here.
//         [getMarkForCommentThreadID(uuid())]: true,
//         [getMarkForCommentThreadID(exampleOverlappingCommentThreadID)]: true,
//    },
//    {
//         text: ", a Latin scholar",
//         [getMarkForCommentThreadID(exampleOverlappingCommentThreadID)]: true,
//    },
]
export default ExampleDocument;
