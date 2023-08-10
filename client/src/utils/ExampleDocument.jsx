const ExampleDocument = [
    {
      type: "h1",
      children: [{ text: "Heading 1" }],
    },
    {
      type: "p",
      children: [{ text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex numquam mollitia beatae nemo saepe fugit quos perferendis voluptates accusantium dolor aut dolores sequi illo, porro, voluptas, ipsum eius laboriosam aliquam?"},{ text: "Bold text.", bold: true},
      { text: "Italic text.", italic: true },
      { text: "Bold and underlined text.", bold: true, underline: true },
      { text: "variableFoo", code: true },],
    }
]
export default ExampleDocument;
