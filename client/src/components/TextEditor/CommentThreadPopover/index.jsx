// import NodePopover from './NodePopover'
import {getFirstTextNodeAtSelection} from "../" //gonna put inside this file
import useEditor from "slate-react"
import { useSetRecoilState } from "recoil"

import { activeCommentThreadIDAtom } from "../CommentState"
import { useCallback } from "react"

export default function CommentThreadPopover({editorOffsets, selection, threadID}){
    const editor = useEditor()
    const textNode = getFirstTextNodeAtSelection(editor, selection)
    const setActiveCommentThreadID = useSetRecoilState(activeCommentThreadIDAtom)

    const onClickOutside = useCallback( (event) => {
        const slateDOMNode = event.target.hasAttribute("data-slate-node")
          ? event.target
          : event.target.closest('[data-slate-node]');
  
        // The click event was somewhere outside the Slate hierarchy.
        if (slateDOMNode == null) {
          setActiveCommentThreadID(null);
          return;
        }
  
        const slateNode = ReactEditor.toSlateNode(editor, slateDOMNode);
  
        // Click is on another commented text node => do nothing.
        if (
          Text.isText(slateNode) &&
          getCommentThreadsOnTextNode(slateNode).size > 0
        ) {
          return;
        }
  
        setActiveCommentThreadID(null);
      },
      [editor, setActiveCommentThreadID])

    return(
        <NodePopover
        editorOffsets={editorOffsets}
        isBodyFullWidth={true}
        node={textNode}
        className={"comment-thread-popover"}
        onClickOutside={onClickOutside}
        >
            {`Comment Thread Popover for threadID:${threadID}`}
        </NodePopover>
    )
}

function getFirstTextNodeAtSelection(editor, selection) {
    const selectionForNode = selection ?? editor.selection;
  
    if (selectionForNode == null) {
      return null;
    }
  
    const textNodeEntry = Editor.nodes(editor, {
      at: selectionForNode,
      mode: "lowest",
      match: Text.isText,
    }).next().value;
  
    return textNodeEntry != null ? textNodeEntry[0] : null;
  }

function NodePopover({ editorOffsets }) {
    const NodePopoverRef = useRef(null);
  
    const [linkNode, path] = Editor.above(editor, {
      match: (n) => n.type === "link",
    });
  
    useEffect(() => {
      const commentEditorEl = NodePopoverRef.current;
      if (commentEditorEl == null) {
        return;
      }
  
      const linkDOMNode = ReactEditor.toDOMNode(editor, linkNode);
      const {
        x: nodeX,
        height: nodeHeight,
        y: nodeY,
      } = linkDOMNode.getBoundingClientRect();
  
      commentEditorEl.style.display = "block";
      commentEditorEl.style.top = `${nodeY + nodeHeight - editorOffsets.y}px`;
      commentEditorEl.style.left = `${nodeX - editorOffsets.x}px`;
    }, [editor, editorOffsets.x, editorOffsets.y, node]);
  
    if (editorOffsets == null) {
      return null;
    }
  
    return <Card ref={NodePopoverRef} className={"comment-popover"}></Card>;
  }
